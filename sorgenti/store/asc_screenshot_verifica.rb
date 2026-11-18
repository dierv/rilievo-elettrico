# Carica lo screenshot per la verifica di Apple su tutti gli acquisti in-app e gli abbonamenti che non ce l'hanno.
#   ruby asc_screenshot_verifica.rb <immagine.jpg|png>
# Variabili: KEY_ID, ISSUER_ID (la chiave è in ~/private_keys/AuthKey_<KEY_ID>.p8), APP_ID (App Store Connect), FORCE=1 per sostituire quelli già caricati.
require 'openssl'
require 'json'
require 'base64'
require 'net/http'
require 'digest'

KEY_ID = ENV.fetch('KEY_ID')
ISSUER_ID = ENV.fetch('ISSUER_ID')
APP_ID = ENV.fetch('APP_ID', '6834807545')
FORCE = ENV['FORCE'] == '1'
API = 'https://api.appstoreconnect.apple.com'

def jwt
  key = OpenSSL::PKey::EC.new(File.read(File.expand_path("~/private_keys/AuthKey_#{KEY_ID}.p8")))
  b64 = ->(s) { Base64.urlsafe_encode64(s, padding: false) }
  now = Time.now.to_i
  head = b64.(JSON.dump({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }))
  body = b64.(JSON.dump({ iss: ISSUER_ID, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }))
  der = key.sign(OpenSSL::Digest::SHA256.new, "#{head}.#{body}")
  sig = OpenSSL::ASN1.decode(der).value.map { |v| v.value.to_s(2).rjust(32, "\0") }.join
  "#{head}.#{body}.#{b64.(sig)}"
end

def call(method, path, data = nil, allow404: false)
  uri = URI(path.start_with?('http') ? path : API + path)
  req = { get: Net::HTTP::Get, post: Net::HTTP::Post, patch: Net::HTTP::Patch, delete: Net::HTTP::Delete }[method].new(uri)
  req['Authorization'] = "Bearer #{jwt}"
  if data
    req['Content-Type'] = 'application/json'
    req.body = JSON.dump(data)
  end
  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |h| h.request(req) }
  return nil if allow404 && res.code.to_i == 404
  abort "App Store Connect #{method.upcase} #{path}: HTTP #{res.code}\n#{res.body}" unless res.code.to_i.between?(200, 299)
  res.body.to_s.empty? ? {} : JSON.parse(res.body)
end

def upload(type, rel_name, rel_type, rel_id, file)
  bytes = File.binread(file)
  made = call(:post, "/v1/#{type}", { data: { type: type, attributes: { fileName: File.basename(file), fileSize: bytes.bytesize },
                                              relationships: { rel_name => { data: { type: rel_type, id: rel_id } } } } })['data']
  (made['attributes']['uploadOperations'] || []).each do |op|
    uri = URI(op['url'])
    req = Net::HTTP.const_get(op['method'].capitalize).new(uri)
    (op['requestHeaders'] || []).each { |h| req[h['name']] = h['value'] }
    req.body = bytes.byteslice(op['offset'], op['length'])
    res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |h| h.request(req) }
    abort "Caricamento #{type}: HTTP #{res.code}" unless res.code.to_i.between?(200, 299)
  end
  call(:patch, "/v1/#{type}/#{made['id']}", { data: { type: type, id: made['id'], attributes: { uploaded: true, sourceFileChecksum: Digest::MD5.hexdigest(bytes) } } })
  made['id']
end

file = ARGV[0] or abort 'Uso: ruby asc_screenshot_verifica.rb <immagine>'

iaps = call(:get, "/v1/apps/#{APP_ID}/inAppPurchasesV2?limit=200")['data']
iaps.each do |iap|
  name = "#{iap['attributes']['productId']} (#{iap['attributes']['state']})"
  have = call(:get, "/v2/inAppPurchases/#{iap['id']}/appStoreReviewScreenshot", allow404: true)
  old = have && have['data']
  if old && !FORCE
    puts "#{name}: screenshot già presente"
    next
  end
  call(:delete, "/v1/inAppPurchaseAppStoreReviewScreenshots/#{old['id']}") if old
  upload('inAppPurchaseAppStoreReviewScreenshots', :inAppPurchaseV2, 'inAppPurchases', iap['id'], file)
  puts "#{name}: screenshot caricato"
end

groups = call(:get, "/v1/apps/#{APP_ID}/subscriptionGroups?limit=50")['data']
groups.each do |g|
  call(:get, "/v1/subscriptionGroups/#{g['id']}/subscriptions?limit=50")['data'].each do |sub|
    name = "#{sub['attributes']['productId']} (#{sub['attributes']['state']})"
    have = call(:get, "/v1/subscriptions/#{sub['id']}/appStoreReviewScreenshot", allow404: true)
    old = have && have['data']
    if old && !FORCE
      puts "#{name}: screenshot già presente"
      next
    end
    call(:delete, "/v1/subscriptionAppStoreReviewScreenshots/#{old['id']}") if old
    upload('subscriptionAppStoreReviewScreenshots', :subscription, 'subscriptions', sub['id'], file)
    puts "#{name}: screenshot caricato"
  end
end

sleep 20
puts "\nStato dopo il caricamento:"
call(:get, "/v1/apps/#{APP_ID}/inAppPurchasesV2?limit=200")['data'].each { |i| puts "  #{i['attributes']['productId']}: #{i['attributes']['state']}" }
groups.each do |g|
  call(:get, "/v1/subscriptionGroups/#{g['id']}/subscriptions?limit=50")['data'].each { |s| puts "  #{s['attributes']['productId']}: #{s['attributes']['state']}" }
end
