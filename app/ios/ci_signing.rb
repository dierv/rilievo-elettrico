# Firma dell'app iOS sul Mac di GitHub, con la chiave API di App Store Connect (nessun account Apple sul Mac).
#   ruby ci_signing.rb create <cartella>   crea certificato «Apple Distribution» e profilo App Store, li mette in <cartella>
#   ruby ci_signing.rb project <cartella> <project.pbxproj>  firma manuale con quel profilo nella configurazione Release dell'app
#   ruby ci_signing.rb cleanup <cartella>  revoca il certificato e cancella il profilo creati (si rifanno a ogni build)
# Variabili: KEY_ID, ISSUER_ID (la chiave è in ~/private_keys/AuthKey_<KEY_ID>.p8), BUNDLE_ID.
require 'openssl'
require 'json'
require 'base64'
require 'net/http'
require 'fileutils'

KEY_ID = ENV.fetch('KEY_ID')
ISSUER_ID = ENV.fetch('ISSUER_ID')
BUNDLE_ID = ENV.fetch('BUNDLE_ID', 'it.diervsoft.sopralux')
API = 'https://api.appstoreconnect.apple.com'

def jwt
  key = OpenSSL::PKey::EC.new(File.read(File.expand_path("~/private_keys/AuthKey_#{KEY_ID}.p8")))
  b64 = ->(s) { Base64.urlsafe_encode64(s, padding: false) }
  now = Time.now.to_i
  head = b64.(JSON.dump({ alg: 'ES256', kid: KEY_ID, typ: 'JWT' }))
  body = b64.(JSON.dump({ iss: ISSUER_ID, iat: now, exp: now + 900, aud: 'appstoreconnect-v1' }))
  der = key.sign(OpenSSL::Digest::SHA256.new, "#{head}.#{body}")
  asn = OpenSSL::ASN1.decode(der)
  sig = asn.value.map { |v| v.value.to_s(2).rjust(32, "\0") }.join
  "#{head}.#{body}.#{b64.(sig)}"
end

def call(method, path, data = nil)
  uri = URI(API + path)
  req = { get: Net::HTTP::Get, post: Net::HTTP::Post, delete: Net::HTTP::Delete }[method].new(uri)
  req['Authorization'] = "Bearer #{jwt}"
  if data
    req['Content-Type'] = 'application/json'
    req.body = JSON.dump(data)
  end
  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |h| h.request(req) }
  abort "App Store Connect #{method.upcase} #{path}: HTTP #{res.code}\n#{res.body}" unless res.code.to_i.between?(200, 299)
  res.body.to_s.empty? ? {} : JSON.parse(res.body)
end

dir = ARGV[1] or abort 'manca la cartella'
FileUtils.mkdir_p(dir)

case ARGV[0]
when 'create'
  # chiave privata e richiesta di certificato
  key = OpenSSL::PKey::RSA.new(2048)
  csr = OpenSSL::X509::Request.new
  csr.version = 0
  csr.subject = OpenSSL::X509::Name.parse('/CN=SopraLux CI/O=SopraLux/C=IT')
  csr.public_key = key.public_key
  csr.sign(key, OpenSSL::Digest::SHA256.new)
  File.write(File.join(dir, 'dist.key'), key.to_pem)
  cert = call(:post, '/v1/certificates', { data: { type: 'certificates', attributes: { certificateType: 'DISTRIBUTION', csrContent: csr.to_pem } } })['data']
  File.binwrite(File.join(dir, 'dist.cer'), Base64.decode64(cert['attributes']['certificateContent']))
  File.write(File.join(dir, 'cert_id'), cert['id'])
  puts "Certificato creato: #{cert['id']}"
  # identificativo dell'app e profilo App Store
  bid = call(:get, "/v1/bundleIds?filter[identifier]=#{BUNDLE_ID}")['data'].find { |b| b['attributes']['identifier'] == BUNDLE_ID } or abort "Identificativo #{BUNDLE_ID} non trovato"
  name = "SopraLux CI #{Time.now.utc.strftime('%Y%m%d%H%M%S')}"
  prof = call(:post, '/v1/profiles', { data: { type: 'profiles', attributes: { name: name, profileType: 'IOS_APP_STORE' },
    relationships: { bundleId: { data: { type: 'bundleIds', id: bid['id'] } }, certificates: { data: [{ type: 'certificates', id: cert['id'] }] } } } })['data']
  File.binwrite(File.join(dir, 'profile.mobileprovision'), Base64.decode64(prof['attributes']['profileContent']))
  File.write(File.join(dir, 'profile_id'), prof['id'])
  File.write(File.join(dir, 'profile_name'), name)
  File.write(File.join(dir, 'profile_uuid'), prof['attributes']['uuid'])
  puts "Profilo creato: #{name}"
when 'project'
  pbx = ARGV[2] or abort 'manca project.pbxproj'
  name = File.read(File.join(dir, 'profile_name'))
  uuid = File.read(File.join(dir, 'profile_uuid'))
  src = File.read(pbx)
  re = %r{(/\* Release \*/ = \{\s*isa = XCBuildConfiguration;\s*buildSettings = \{\s*ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;\s*)CODE_SIGN_STYLE = Automatic;}
  out = src.sub(re) { "#{$1}CODE_SIGN_STYLE = Manual;\n\t\t\t\t\"CODE_SIGN_IDENTITY[sdk=iphoneos*]\" = \"Apple Distribution\";\n\t\t\t\tDEVELOPMENT_TEAM = #{ENV.fetch('TEAM_ID')};\n\t\t\t\tPROVISIONING_PROFILE = \"#{uuid}\";\n\t\t\t\tPROVISIONING_PROFILE_SPECIFIER = \"#{uuid}\";" }
  abort 'configurazione Release dell\'app non trovata nel progetto' if out == src
  File.write(pbx, out)
  puts "Progetto: firma manuale con #{name} (#{uuid})"
when 'cleanup'
  pid = File.read(File.join(dir, 'profile_id')) rescue nil
  cid = File.read(File.join(dir, 'cert_id')) rescue nil
  (call(:delete, "/v1/profiles/#{pid}"); puts 'Profilo cancellato') if pid
  (call(:delete, "/v1/certificates/#{cid}"); puts 'Certificato revocato') if cid
else
  abort 'uso: create|cleanup <cartella>'
end
