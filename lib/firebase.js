/* Sopralux: Firebase 13.2.0, app + auth + firestore + storage. Rigenerare con npm ci e npm run build in sorgenti/firebase. */
var FB=(()=>{var Ea=Object.defineProperty;var lw=Object.getOwnPropertyDescriptor;var hw=Object.getOwnPropertyNames;var Bw=Object.prototype.hasOwnProperty;var fw=(n,e,t)=>e in n?Ea(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var dw=(n,e)=>{for(var t in e)Ea(n,t,{get:e[t],enumerable:!0})},pw=(n,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of hw(e))!Bw.call(n,s)&&s!==t&&Ea(n,s,{get:()=>e[s],enumerable:!(r=lw(e,s))||r.enumerable});return n};var gw=n=>pw(Ea({},"__esModule",{value:!0}),n);var M=(n,e,t)=>fw(n,typeof e!="symbol"?e+"":e,t);var dv={};dw(dv,{GoogleAuthProvider:()=>_r,OAuthProvider:()=>qi,collection:()=>bd,deleteUser:()=>nh,doc:()=>vd,getApps:()=>vg,getAuth:()=>uh,getBlob:()=>Py,getDocFromServer:()=>iy,getFirestore:()=>jd,getMetadata:()=>vy,getStorage:()=>Sy,initializeApp:()=>wl,linkWithCredential:()=>Xl,linkWithPopup:()=>ah,onAuthStateChanged:()=>Zl,onSnapshot:()=>oy,reauthenticateWithPopup:()=>oh,ref:()=>Ry,revokeAccessToken:()=>th,runTransaction:()=>sy,serverTimestamp:()=>Pd,signInWithCredential:()=>Yl,signInWithPopup:()=>ih,signOut:()=>eh,unlink:()=>$l,uploadBytes:()=>by});var ng=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sg=function(n){let e=[],t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},Cw=function(n){let e=[],t=0,r=0;for(;t<n.length;){let s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){let i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){let i=n[t++],o=n[t++],u=n[t++],c=((s&7)<<18|(i&63)<<12|(o&63)<<6|u&63)-65536;e[r++]=String.fromCharCode(55296+(c>>10)),e[r++]=String.fromCharCode(56320+(c&1023))}else{let i=n[t++],o=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},ig={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();let t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){let i=n[s],o=s+1<n.length,u=o?n[s+1]:0,c=s+2<n.length,l=c?n[s+2]:0,B=i>>2,d=(i&3)<<4|u>>4,g=(u&15)<<2|l>>6,w=l&63;c||(w=64,o||(g=64)),r.push(t[B],t[d],t[g],t[w])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(sg(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Cw(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();let t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){let i=t[n.charAt(s++)],u=s<n.length?t[n.charAt(s)]:0;++s;let l=s<n.length?t[n.charAt(s)]:64;++s;let d=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||u==null||l==null||d==null)throw new nl;let g=i<<2|u>>4;if(r.push(g),l!==64){let w=u<<4&240|l>>2;if(r.push(w),d!==64){let D=l<<6&192|d;r.push(D)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}},nl=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},mw=function(n){let e=sg(n);return ig.encodeByteArray(e,!0)},bi=function(n){return mw(n).replace(/\./g,"")},ya=function(n){try{return ig.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function og(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _w=()=>og().__FIREBASE_DEFAULTS__,Ew=()=>{if(typeof process>"u"||typeof process.env>"u")return;let n=process.env.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},yw=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let e=n&&ya(n[1]);return e&&JSON.parse(e)},wa=()=>{try{return ng()||_w()||Ew()||yw()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},sl=n=>wa()?.emulatorHosts?.[n],Ia=n=>{let e=sl(n);if(!e)return;let t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);let r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},il=()=>wa()?.config,ol=n=>wa()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var as=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Da(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");let o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[bi(JSON.stringify(t)),bi(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ag(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(We())}function ww(){let n=wa()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ug(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function cg(){let n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function lg(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function hg(){let n=We();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Bg(){return!ww()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function al(){try{return typeof indexedDB=="object"}catch{return!1}}function fg(){return new Promise((n,e)=>{try{let t=!0,r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Iw="FirebaseError",ht=class n extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Iw,Object.setPrototypeOf(this,n.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Bn.prototype.create)}},Bn=class{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?Dw(i,r):"Error",u=`${this.serviceName}: ${o} (${s}).`;return new ht(s,u,r)}};function Dw(n,e){try{let t=0,r="";for(;t<n.length;){let s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}let i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}let o=n.substring(s+2,i),u=e[o];r+=n.substring(t,s)+(u!=null?String(u):`<${o}?>`),t=i+1}return r}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dg(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Vt(n,e){if(n===e)return!0;let t=Object.keys(n),r=Object.keys(e);for(let s of t){if(!r.includes(s))return!1;let i=n[s],o=e[s];if(rg(i)&&rg(o)){if(!Vt(i,o))return!1}else if(i!==o)return!1}for(let s of r)if(!t.includes(s))return!1;return!0}function rg(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function us(n){let e=[];for(let[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function cs(n){let e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){let[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function ls(n){let e=n.indexOf("?");if(!e)return"";let t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pg(n,e){let t=new rl(n,e);return t.subscribe.bind(t)}var rl=class{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Tw(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=tl),s.error===void 0&&(s.error=tl),s.complete===void 0&&(s.complete=tl);let i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function Tw(n,e){if(typeof n!="object"||n===null)return!1;for(let t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function tl(){}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var mv=14400*1e3;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pe(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function hs(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gt=class{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ul=class{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let r=new as;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{let s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(bw(e))try{this.getOrInitializeService({instanceIdentifier:fr})}catch{}for(let[t,r]of this.instancesDeferred.entries()){let s=this.normalizeInstanceIdentifier(t);try{let i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=fr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=fr){return this.instances.has(e)}getOptions(e=fr){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[i,o]of this.instancesDeferred.entries()){let u=this.normalizeInstanceIdentifier(i);r===u&&o.resolve(s)}return s}onInit(e,t){let r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);let i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Aw(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=fr){return this.component?this.component.multipleInstances?e:fr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function Aw(n){return n===fr?void 0:n}function bw(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ta=class{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new ul(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vw=[],oe;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(oe||(oe={}));var Rw={debug:oe.DEBUG,verbose:oe.VERBOSE,info:oe.INFO,warn:oe.WARN,error:oe.ERROR,silent:oe.SILENT},Sw=oe.INFO,Pw={[oe.DEBUG]:"log",[oe.VERBOSE]:"log",[oe.INFO]:"info",[oe.WARN]:"warn",[oe.ERROR]:"error"},Nw=(n,e,...t)=>{if(e<n.logLevel)return;let r=new Date().toISOString(),s=Pw[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)},qn=class{constructor(e){this.name=e,this._logLevel=Sw,this._logHandler=Nw,this._userLogHandler=null,vw.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in oe))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Rw[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,oe.DEBUG,...e),this._logHandler(this,oe.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,oe.VERBOSE,...e),this._logHandler(this,oe.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,oe.INFO,...e),this._logHandler(this,oe.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,oe.WARN,...e),this._logHandler(this,oe.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,oe.ERROR,...e),this._logHandler(this,oe.ERROR,...e)}};var Ow=(n,e)=>e.some(t=>n instanceof t),gg,Cg;function xw(){return gg||(gg=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Fw(){return Cg||(Cg=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var mg=new WeakMap,ll=new WeakMap,_g=new WeakMap,cl=new WeakMap,Bl=new WeakMap;function kw(n){let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("success",i),n.removeEventListener("error",o)},i=()=>{t(Xt(n.result)),s()},o=()=>{r(n.error),s()};n.addEventListener("success",i),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&mg.set(t,n)}).catch(()=>{}),Bl.set(e,n),e}function Lw(n){if(ll.has(n))return;let e=new Promise((t,r)=>{let s=()=>{n.removeEventListener("complete",i),n.removeEventListener("error",o),n.removeEventListener("abort",o)},i=()=>{t(),s()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",i),n.addEventListener("error",o),n.addEventListener("abort",o)});ll.set(n,e)}var hl={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return ll.get(n);if(e==="objectStoreNames")return n.objectStoreNames||_g.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Xt(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Eg(n){hl=n(hl)}function Vw(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){let r=n.call(Aa(this),e,...t);return _g.set(r,e.sort?e.sort():[e]),Xt(r)}:Fw().includes(n)?function(...e){return n.apply(Aa(this),e),Xt(mg.get(this))}:function(...e){return Xt(n.apply(Aa(this),e))}}function Mw(n){return typeof n=="function"?Vw(n):(n instanceof IDBTransaction&&Lw(n),Ow(n,xw())?new Proxy(n,hl):n)}function Xt(n){if(n instanceof IDBRequest)return kw(n);if(cl.has(n))return cl.get(n);let e=Mw(n);return e!==n&&(cl.set(n,e),Bl.set(e,n)),e}var Aa=n=>Bl.get(n);function wg(n,e,{blocked:t,upgrade:r,blocking:s,terminated:i}={}){let o=indexedDB.open(n,e),u=Xt(o);return r&&o.addEventListener("upgradeneeded",c=>{r(Xt(o.result),c.oldVersion,c.newVersion,Xt(o.transaction),c)}),t&&o.addEventListener("blocked",c=>t(c.oldVersion,c.newVersion,c)),u.then(c=>{i&&c.addEventListener("close",()=>i()),s&&c.addEventListener("versionchange",l=>s(l.oldVersion,l.newVersion,l))}).catch(()=>{}),u}var Uw=["get","getKey","getAll","getAllKeys","count"],Gw=["put","add","delete","clear"],fl=new Map;function yg(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(fl.get(e))return fl.get(e);let t=e.replace(/FromIndex$/,""),r=e!==t,s=Gw.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Uw.includes(t)))return;let i=async function(o,...u){let c=this.transaction(o,s?"readwrite":"readonly"),l=c.store;return r&&(l=l.index(u.shift())),(await Promise.all([l[t](...u),s&&c.done]))[0]};return fl.set(e,i),i}Eg(n=>({...n,get:(e,t,r)=>yg(e,t)||n.get(e,t,r),has:(e,t)=>!!yg(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var pl=class{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Hw(t)){let r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}};function Hw(n){return n.getComponent()?.type==="VERSION"}var gl="@firebase/app",Ig="0.16.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var dn=new qn("@firebase/app"),qw="@firebase/app-compat",jw="@firebase/analytics-compat",Kw="@firebase/analytics",Jw="@firebase/app-check-compat",zw="@firebase/app-check",Ww="@firebase/auth",Qw="@firebase/auth-compat",$w="@firebase/crashlytics",Yw="@firebase/database",Xw="@firebase/data-connect",Zw="@firebase/database-compat",eI="@firebase/functions",tI="@firebase/functions-compat",nI="@firebase/installations",rI="@firebase/installations-compat",sI="@firebase/messaging",iI="@firebase/messaging-compat",oI="@firebase/performance",aI="@firebase/performance-compat",uI="@firebase/remote-config",cI="@firebase/remote-config-compat",lI="@firebase/storage",hI="@firebase/storage-compat",BI="@firebase/firestore",fI="@firebase/ai",dI="@firebase/firestore-compat",pI="firebase",gI="13.2.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cl="[DEFAULT]",CI={[gl]:"fire-core",[qw]:"fire-core-compat",[Kw]:"fire-analytics",[jw]:"fire-analytics-compat",[zw]:"fire-app-check",[Jw]:"fire-app-check-compat",[Ww]:"fire-auth",[Qw]:"fire-auth-compat",[$w]:"fire-cls",[Yw]:"fire-rtdb",[Xw]:"fire-data-connect",[Zw]:"fire-rtdb-compat",[eI]:"fire-fn",[tI]:"fire-fn-compat",[nI]:"fire-iid",[rI]:"fire-iid-compat",[sI]:"fire-fcm",[iI]:"fire-fcm-compat",[oI]:"fire-perf",[aI]:"fire-perf-compat",[uI]:"fire-rc",[cI]:"fire-rc-compat",[lI]:"fire-gcs",[hI]:"fire-gcs-compat",[BI]:"fire-fst",[dI]:"fire-fst-compat",[fI]:"fire-vertex","fire-js":"fire-js",[pI]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vi=new Map,mI=new Map,ml=new Map;function Dg(n,e){try{n.container.addComponent(e)}catch(t){dn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Zt(n){let e=n.name;if(ml.has(e))return dn.debug(`There were multiple attempts to register component ${e}.`),!1;ml.set(e,n);for(let t of vi.values())Dg(t,n);for(let t of mI.values())Dg(t,n);return!0}function dr(n,e){let t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function it(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _I={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},fn=new Bn("app","Firebase",_I);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _l=class{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw fn.create("app-deleted",{appName:this._name})}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var en=gI;function wl(n,e={}){let t=n;typeof e!="object"&&(e={name:e});let r={name:Cl,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw fn.create("bad-app-name",{appName:String(s)});if(t||(t=il()),!t)throw fn.create("no-options");let i=vi.get(s);if(i)if(Vt(t,i.options)){if(Vt(r,i.config))return i;throw fn.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw fn.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});let o=new Ta(s);for(let c of ml.values())o.addComponent(c);let u=new _l(t,r,o);return vi.set(s,u),u}function Bs(n=Cl){let e=vi.get(n);if(!e&&n===Cl&&il())return wl();if(!e)throw fn.create("no-app",{appName:n});return e}function vg(){return Array.from(vi.values())}function Ct(n,e,t){let r=CI[n]??n;t&&(r+=`-${t}`);let s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){let o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),dn.warn(o.join(" "));return}Zt(new gt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var EI="firebase-heartbeat-database",yI=1,Ri="firebase-heartbeat-store",dl=null;function Rg(){return dl||(dl=wg(EI,yI,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Ri)}catch(t){console.warn(t)}}}}).catch(n=>{throw fn.create("idb-open",{originalErrorMessage:n.message})})),dl}async function wI(n){try{let t=(await Rg()).transaction(Ri),r=await t.objectStore(Ri).get(Sg(n));return await t.done,r}catch(e){if(e instanceof ht)dn.warn(e.message);else{let t=fn.create("idb-get",{originalErrorMessage:e?.message});dn.warn(t.message)}}}async function Tg(n,e){try{let r=(await Rg()).transaction(Ri,"readwrite");await r.objectStore(Ri).put(e,Sg(n)),await r.done}catch(t){if(t instanceof ht)dn.warn(t.message);else{let r=fn.create("idb-set",{originalErrorMessage:t?.message});dn.warn(r.message)}}}function Sg(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var II=1024,DI=30,El=class{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new yl(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ag();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>DI){let s=AI(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){dn.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let e=Ag(),{heartbeatsToSend:t,unsentEntries:r}=TI(this._heartbeatsCache.heartbeats),s=bi(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return dn.warn(e),""}}};function Ag(){return new Date().toISOString().substring(0,10)}function TI(n,e=II){let t=[],r=n.slice();for(let s of n){let i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),bg(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),bg(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}var yl=class{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return al()?fg().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let t=await wI(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Tg(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){let r=await this.read();return Tg(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}};function bg(n){return bi(JSON.stringify({version:2,heartbeats:n})).length}function AI(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bI(n){Zt(new gt("platform-logger",e=>new pl(e),"PRIVATE")),Zt(new gt("heartbeat",e=>new El(e),"PRIVATE")),Ct(gl,Ig,n),Ct(gl,Ig,"esm2020"),Ct("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */bI("");var vI="firebase",RI="13.2.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ct(vI,RI,"app");/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $g(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}var Yg=$g,Xg=new Bn("auth","Firebase",$g());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xa=new qn("@firebase/auth");function va(n,...e){xa.logLevel<=oe.WARN&&xa.warn(`Auth (${en}): ${n}`,...e)}function Ra(n,...e){xa.logLevel<=oe.ERROR&&xa.error(`Auth (${en}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(n,...e){throw Jl(n,...e)}function St(n,...e){return Jl(n,...e)}function tu(n,e,t){let r={...Yg(),[e]:t};return new Bn("auth","Firebase",r).create(e,{appName:n.name})}function pr(n){return tu(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Kl(n,e,t){let r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&Pt(n,"argument-error"),tu(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Jl(n,...e){if(typeof n!="string"){let t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Xg.create(n,...e)}function $(n,e,...t){if(!n)throw Jl(e,...t)}function tn(n){let e="INTERNAL ASSERTION FAILED: "+n;throw Ra(e),new Error(e)}function gn(n,e){n||tn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl(){return typeof self<"u"&&self.location?.href||""}function SI(){return Pg()==="http:"||Pg()==="https:"}function Pg(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function PI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(SI()||cg()||"connection"in navigator)?navigator.onLine:!0}function NI(){if(typeof navigator>"u")return null;let n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gr=class{constructor(e,t){this.shortDelay=e,this.longDelay=t,gn(t>e,"Short delay should be less than long delay!"),this.isMobile=ag()||lg()}get(){return PI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zl(n,e){gn(n.emulator,"Emulator should always be set here");let{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fa=class{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;tn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;tn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;tn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var OI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xI=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],FI=new gr(3e4,6e4);function Qe(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function tt(n,e,t,r,s={}){return Zg(n,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});let u=us({...o,key:n.config.apiKey}).slice(1),c=await n._getAdditionalHeaders();c["Content-Type"]="application/json",n.languageCode&&(c["X-Firebase-Locale"]=n.languageCode);let l={method:e,headers:c,...i};return ug()||(l.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&Yt(n.emulatorConfig.host)&&(l.credentials="include"),Fa.fetch()(await eC(n,n.config.apiHost,t,u),l)})}async function Zg(n,e,t){n._canInitEmulator=!1;let r={...OI,...e};try{let s=new Rl(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();let o=await i.json();if("needConfirmation"in o)throw Pi(n,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{let u=i.ok?o.errorMessage:o.error.message,[c,l]=u.split(" : ");if(c==="FEDERATED_USER_ID_ALREADY_LINKED")throw Pi(n,"credential-already-in-use",o);if(c==="EMAIL_EXISTS")throw Pi(n,"email-already-in-use",o);if(c==="USER_DISABLED")throw Pi(n,"user-disabled",o);let B=r[c]||c.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw tu(n,B,l);Pt(n,B)}}catch(s){if(s instanceof ht)throw s;Pt(n,"network-request-failed",{message:String(s)})}}async function yr(n,e,t,r,s={}){let i=await tt(n,e,t,r,s);return"mfaPendingCredential"in i&&Pt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function eC(n,e,t,r){let s=`${e}${t}?${r}`,i=n,o=i.config.emulator?zl(n.config,s):`${n.config.apiScheme}://${s}`;return xI.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function kI(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}var Rl=class{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(St(this.auth,"network-request-failed")),FI.get())})}};function Pi(n,e,t){let r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);let s=St(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ng(n){return n!==void 0&&n.enterprise!==void 0}var ka=class{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return kI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tC(n,e){return tt(n,"GET","/v2/recaptchaConfig",Qe(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function LI(n,e){return tt(n,"POST","/v1/accounts:delete",e)}async function VI(n,e){return tt(n,"POST","/v1/accounts:update",e)}async function La(n,e){return tt(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ni(n){if(n)try{let e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nC(n,e=!1){let t=pe(n),r=await t.getIdToken(e),s=Wl(r);$(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");let i=typeof s.firebase=="object"?s.firebase:void 0,o=i?.sign_in_provider;return{claims:s,token:r,authTime:Ni(Il(s.auth_time)),issuedAtTime:Ni(Il(s.iat)),expirationTime:Ni(Il(s.exp)),signInProvider:o||null,signInSecondFactor:i?.sign_in_second_factor||null}}function Il(n){return Number(n)*1e3}function Wl(n){let[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Ra("JWT malformed, contained fewer than 3 sections"),null;try{let s=ya(t);return s?JSON.parse(s):(Ra("Failed to decode base64 JWT payload"),null)}catch(s){return Ra("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Og(n){let e=Wl(n);return $(e,"internal-error"),$(typeof e.exp<"u","internal-error"),$(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Li(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw rC(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function rC(n){return n instanceof ht?n.code==="auth/user-disabled"||n.code==="auth/user-token-expired":!1}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Sl=class{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){let t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;let r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Vi=class{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ni(this.lastLoginAt),this.creationTime=Ni(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Mi(n){let e=n.auth,t=await n.getIdToken(),r=await Li(n,La(e,{idToken:t}));$(r?.users.length,e,"internal-error");let s=r.users[0];n._notifyReloadListener(s);let i=s.providerUserInfo?.length?iC(s.providerUserInfo):[],o=MI(n.providerData,i),u=n.isAnonymous,c=!(n.email&&s.passwordHash)&&!o?.length,l=u?c:!1,B={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Vi(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(n,B)}async function sC(n){let e=pe(n);await Mi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function MI(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function iC(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function UI(n,e){let t=await Zg(n,{},async()=>{let r=us({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,o=await eC(n,s,"/v1/token",`key=${i}`),u=await n._getAdditionalHeaders();u["Content-Type"]="application/x-www-form-urlencoded";let c={method:"POST",headers:u,body:r};return n.emulatorConfig&&Yt(n.emulatorConfig.host)&&(c.credentials="include"),Fa.fetch()(o,c)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function GI(n,e){return tt(n,"POST","/v2/accounts:revokeToken",Qe(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Oi=class n{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e5}updateFromServerResponse(e){$(e.idToken,"internal-error"),$(typeof e.idToken<"u","internal-error"),$(typeof e.refreshToken<"u","internal-error");let t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Og(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){$(e.length!==0,"internal-error");let t=Og(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:($(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:s,expiresIn:i}=await UI(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){let{refreshToken:r,accessToken:s,expirationTime:i}=t,o=new n;return r&&($(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&($(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&($(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new n,this.toJSON())}_performRefresh(){return tn("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jn(n,e){$(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}var Kn=class n{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new Sl(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Vi(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){let t=await Li(this,this.stsTokenManager.getToken(this.auth,e));return $(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return nC(this,e)}reload(){return sC(this)}_assign(e){this!==e&&($(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new n({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){$(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Mi(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(it(this.auth.app))return Promise.reject(pr(this.auth));let e=await this.getIdToken();return await Li(this,LI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,u=t.tenantId??void 0,c=t._redirectEventId??void 0,l=t.createdAt??void 0,B=t.lastLoginAt??void 0,{uid:d,emailVerified:g,isAnonymous:w,providerData:D,stsTokenManager:P}=t;$(d&&P,e,"internal-error");let V=Oi.fromJSON(this.name,P);$(typeof d=="string",e,"internal-error"),jn(r,e.name),jn(s,e.name),$(typeof g=="boolean",e,"internal-error"),$(typeof w=="boolean",e,"internal-error"),jn(i,e.name),jn(o,e.name),jn(u,e.name),jn(c,e.name),jn(l,e.name),jn(B,e.name);let j=new n({uid:d,auth:e,email:s,emailVerified:g,displayName:r,isAnonymous:w,photoURL:o,phoneNumber:i,tenantId:u,stsTokenManager:V,createdAt:l,lastLoginAt:B});return D&&Array.isArray(D)&&(j.providerData=D.map(Q=>({...Q}))),c&&(j._redirectEventId=c),j}static async _fromIdTokenResponse(e,t,r=!1){let s=new Oi;s.updateFromServerResponse(t);let i=new n({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Mi(i),i}static async _fromGetAccountInfoResponse(e,t,r){let s=t.users[0];$(s.localId!==void 0,"internal-error");let i=s.providerUserInfo!==void 0?iC(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!i?.length,u=new Oi;u.updateFromIdToken(r);let c=new n({uid:s.localId,auth:e,stsTokenManager:u,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Vi(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!i?.length};return Object.assign(c,l),c}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xg=new Map;function pn(n){gn(n instanceof Function,"Expected a class definition");let e=xg.get(n);return e?(gn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,xg.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Va=class{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};Va.type="NONE";var Pl=Va;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sa(n,e,t){return`firebase:${n}:${e}:${t}`}var xi=class n{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:s,name:i}=this.auth;this.fullUserKey=Sa(this.userKey,s.apiKey,i),this.fullPersistenceKey=Sa("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){let t=await La(this.auth,{idToken:e}).catch(()=>{});return t?Kn._fromGetAccountInfoResponse(this.auth,t,e):null}return Kn._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new n(pn(Pl),e,r);let s=(await Promise.all(t.map(async l=>{try{if(await l._isAvailable())return l}catch{return}}))).filter(l=>l),i=s[0]||pn(Pl),o=Sa(r,e.config.apiKey,e.name),u=null;for(let l of t)try{let B=await l._get(o);if(B){let d;if(typeof B=="string"){let g=await La(e,{idToken:B}).catch(()=>{});if(!g)break;d=await Kn._fromGetAccountInfoResponse(e,g,B)}else d=Kn._fromJSON(e,B);l!==i&&(u=d),i=l;break}}catch{}let c=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!c.length?new n(i,e,r):(i=c[0],u&&await i._set(o,u.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new n(i,e,r))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fg(n){let e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(cC(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(oC(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(hC(e))return"Blackberry";if(BC(e))return"Webos";if(aC(e))return"Safari";if((e.includes("chrome/")||uC(e))&&!e.includes("edge/"))return"Chrome";if(lC(e))return"Android";{let t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function oC(n=We()){return/firefox\//i.test(n)}function aC(n=We()){let e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function uC(n=We()){return/crios\//i.test(n)}function cC(n=We()){return/iemobile/i.test(n)}function lC(n=We()){return/android/i.test(n)}function hC(n=We()){return/blackberry/i.test(n)}function BC(n=We()){return/webos/i.test(n)}function Ql(n=We()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function HI(n=We()){return Ql(n)&&!!window.navigator?.standalone}function qI(){return hg()&&document.documentMode===10}function fC(n=We()){return Ql(n)||lC(n)||BC(n)||hC(n)||/windows phone/i.test(n)||cC(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dC(n,e=[]){let t;switch(n){case"Browser":t=Fg(We());break;case"Worker":t=`${Fg(We())}-${n}`;break;default:t=n}let r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${en}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Nl=class{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=i=>new Promise((o,u)=>{try{let c=e(i);o(c)}catch(c){u(c)}});r.onAbort=t,this.queue.push(r);let s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(let s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function jI(n,e={}){return tt(n,"GET","/v2/passwordPolicy",Qe(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var KI=6,Ol=class{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??KI,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xl=class{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Ma(this),this.idTokenSubscription=new Ma(this),this.beforeStateQueue=new Nl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Xg,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=pn(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted){try{this.persistenceManager=await xi.create(this,e)}catch(r){va(`Failed to initialize persistence: ${r}`),this.persistenceManager=await xi.create(this,[])}finally{this._resolvePersistenceManagerAvailable?.()}if(!this._deleted){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}try{await this.initializeCurrentUser(t)}catch(r){va(`Failed to initialize current user: ${r}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await La(this,{idToken:e}),r=await Kn._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(it(this.app)){let i=this.app.settings.authIdToken;return i?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(i).then(o,o))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let i=this.redirectUser?._redirectEventId,o=r?._redirectEventId,u=await this.tryRedirectSignIn(e);(!i||i===o)&&u?.user&&(r=u.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(i))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return $(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Mi(e)}catch(t){if(rC(t))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=NI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(it(this.app))return Promise.reject(pr(this));let t=e?pe(e):null;return t&&$(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&$(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return it(this.app)?Promise.reject(pr(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return it(this.app)?Promise.reject(pr(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(pn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await jI(this),t=new Ol(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Bn("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await GI(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&pn(e)||this._popupRedirectResolver;$(t,this,"argument-error"),this.redirectPersistenceManager=await xi.create(this,[pn(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};let i=typeof t=="function"?t:t.next.bind(t),o=!1,u=this._isInitialized?Promise.resolve():this._initializationPromise;if($(u,this,"internal-error"),u.then(()=>{o||i(this.currentUser)}).catch(c=>{if(!o)if(typeof t!="function"&&t.error)t.error(c);else if(r)r(c);else throw c}),typeof t=="function"){let c=e.addObserver(t,r,s);return()=>{o=!0,c()}}else{let c=e.addObserver(t);return()=>{o=!0,c()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(t){let r=t?.message||String(t),s=tu(this,"internal-error",`An internal AuthError has occurred: ${r}`);throw s.customData={originalError:t},s}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return $(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=dC(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(it(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&va(`Error while retrieving App Check token: ${e.error}`),e?.token}};function mn(n){return pe(n)}var Ma=class{constructor(e){this.auth=e,this.observer=null,this.addObserver=pg(t=>this.observer=t)}get next(){return $(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function JI(n){nu=n}function pC(n){return nu.loadJS(n)}function zI(){return nu.recaptchaEnterpriseScript}function WI(){return nu.gapiScript}function gC(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fl=class{constructor(){this.enterprise=new kl}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}},kl=class{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var QI="recaptcha-enterprise",Fi="NO_RECAPTCHA",kg="onFirebaseAuthREInstanceReady",Ui=class n{constructor(e){this.type=QI,this.auth=mn(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,u)=>{tC(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(c=>{if(c.recaptchaKey===void 0)u(new Error("recaptcha Enterprise site key undefined"));else{let l=new ka(c);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(c=>{u(c)})})}function s(i,o,u){let c=window.grecaptcha;Ng(c)?c.enterprise.ready(()=>{c.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(Fi)})}):u(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new Fl().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{r(this.auth).then(async u=>{if(!t&&Ng(window.grecaptcha)&&n.scriptInjectionDeferred)await n.scriptInjectionDeferred.promise,s(u,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let c=zI();c.length!==0&&(c+=u+`&onload=${kg}`),n.scriptInjectionDeferred=new as,window[kg]=()=>{n.scriptInjectionDeferred?.resolve()},pC(c).then(()=>n.scriptInjectionDeferred?.promise).then(()=>{s(u,i,o)}).catch(l=>{o(l)})}}).catch(u=>{o(u)})})}};Ui.scriptInjectionDeferred=null;async function Si(n,e,t,r=!1,s=!1){let i=new Ui(n),o;if(s)o=Fi;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}let u={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in u){let c=u.phoneEnrollmentInfo.phoneNumber,l=u.phoneEnrollmentInfo.recaptchaToken;Object.assign(u,{phoneEnrollmentInfo:{phoneNumber:c,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in u){let c=u.phoneSignInInfo.recaptchaToken;Object.assign(u,{phoneSignInInfo:{recaptchaToken:c,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return u}return r?Object.assign(u,{captchaResp:o}):Object.assign(u,{captchaResponse:o}),Object.assign(u,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(u,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),u}async function ki(n,e,t,r,s){if(s==="EMAIL_PASSWORD_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let i=await Si(n,e,t,t==="getOobCode");return r(n,i)}else return r(n,e).catch(async i=>{if(i.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let o=await Si(n,e,t,t==="getOobCode");return r(n,o)}else return Promise.reject(i)});else if(s==="PHONE_PROVIDER")if(n._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let i=await Si(n,e,t);return r(n,i).catch(async o=>{if(n._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&(o.code==="auth/missing-recaptcha-token"||o.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${t} flow.`);let u=await Si(n,e,t,!1,!0);return r(n,u)}return Promise.reject(o)})}else{let i=await Si(n,e,t,!1,!0);return r(n,i)}else return Promise.reject(s+" provider is not supported.")}async function $I(n){let e=mn(n),t=await tC(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),r=new ka(t);e.tenantId==null?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,r.isAnyProviderEnabled()&&new Ui(e).verify().catch(()=>{})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CC(n,e){let t=dr(n,"auth");if(t.isInitialized()){let s=t.getImmediate(),i=t.getOptions();if(Vt(i,e??{}))return s;Pt(s,"already-initialized")}return t.initialize({options:e})}function YI(n,e){let t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(pn);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function mC(n,e,t){let r=mn(n);$(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");let s=!!t?.disableWarnings,i=_C(e),{host:o,port:u}=XI(e),c=u===null?"":`:${u}`,l={url:`${i}//${o}${c}/`},B=Object.freeze({host:o,port:u,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){$(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),$(Vt(l,r.config.emulator)&&Vt(B,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=l,r.emulatorConfig=B,r.settings.appVerificationDisabledForTesting=!0,Yt(o)?hs(`${i}//${o}${c}`):s||ZI()}function _C(n){let e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function XI(n){let e=_C(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};let r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){let i=s[1];return{host:i,port:Lg(r.substr(i.length+1))}}else{let[i,o]=r.split(":");return{host:i,port:Lg(o)}}}function Lg(n){if(!n)return null;let e=Number(n);return isNaN(e)?null:e}function ZI(){function n(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cr=class{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return tn("not implemented")}_getIdTokenResponse(e){return tn("not implemented")}_linkToIdToken(e,t){return tn("not implemented")}_getReauthenticationResolver(e){return tn("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eD(n,e){return tt(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tD(n,e){return yr(n,"POST","/v1/accounts:signInWithPassword",Qe(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nD(n,e){return yr(n,"POST","/v1/accounts:signInWithEmailLink",Qe(n,e))}async function rD(n,e){return yr(n,"POST","/v1/accounts:signInWithEmailLink",Qe(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Gi=class n extends Cr{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new n(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new n(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ki(e,t,"signInWithPassword",tD,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return nD(e,{email:this._email,oobCode:this._password});default:Pt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return ki(e,r,"signUpPassword",eD,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return rD(e,{idToken:t,email:this._email,oobCode:this._password});default:Pt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fs(n,e){return yr(n,"POST","/v1/accounts:signInWithIdp",Qe(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sD="http://localhost",Cn=class n extends Cr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Pt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;let o=new n(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){let t=this.buildRequest();return fs(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,fs(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,fs(e,t)}buildRequest(){let e={requestUri:sD,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=us(t)}return e}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vg(n,e){return tt(n,"POST","/v1/accounts:sendVerificationCode",Qe(n,e))}async function iD(n,e){return yr(n,"POST","/v1/accounts:signInWithPhoneNumber",Qe(n,e))}async function oD(n,e){let t=await yr(n,"POST","/v1/accounts:signInWithPhoneNumber",Qe(n,e));if(t.temporaryProof)throw Pi(n,"account-exists-with-different-credential",t);return t}var aD={USER_NOT_FOUND:"user-not-found"};async function uD(n,e){let t={...e,operation:"REAUTH"};return yr(n,"POST","/v1/accounts:signInWithPhoneNumber",Qe(n,t),aD)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hi=class n extends Cr{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new n({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new n({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return iD(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return oD(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return uD(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:s}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:s}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i}=e;return!r&&!t&&!s&&!i?null:new n({verificationId:t,verificationCode:r,phoneNumber:s,temporaryProof:i})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cD(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function lD(n){let e=cs(ls(n)).link,t=e?cs(ls(e)).deep_link_id:null,r=cs(ls(n)).deep_link_id;return(r?cs(ls(r)).link:null)||r||t||e||n}var Ua=class n{constructor(e){let t=cs(ls(e)),r=t.apiKey??null,s=t.oobCode??null,i=cD(t.mode??null);$(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=lD(e);try{return new n(t)}catch{return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ds=class n{constructor(){this.providerId=n.PROVIDER_ID}static credential(e,t){return Gi._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=Ua.parseLink(t);return $(r,"argument-error"),Gi._fromEmailAndCode(e,r.code,r.tenantId)}};ds.PROVIDER_ID="password";ds.EMAIL_PASSWORD_SIGN_IN_METHOD="password";ds.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var mr=class{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jn=class extends mr{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}},qi=class n extends Jn{static credentialFromJSON(e){let t=typeof e=="string"?JSON.parse(e):e;return $("providerId"in t&&"signInMethod"in t,"argument-error"),Cn._fromParams(t)}credential(e){return this._credential({...e,nonce:e.rawNonce})}_credential(e){return $(e.idToken||e.accessToken,"argument-error"),Cn._fromParams({...e,providerId:this.providerId,signInMethod:this.providerId})}static credentialFromResult(e){return n.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return n.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r,oauthTokenSecret:s,pendingToken:i,nonce:o,providerId:u}=e;if(!r&&!s&&!t&&!i||!u)return null;try{return new n(u)._credential({idToken:t,accessToken:r,nonce:o,pendingToken:i})}catch{return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ji=class n extends Jn{constructor(){super("facebook.com")}static credential(e){return Cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};ji.FACEBOOK_SIGN_IN_METHOD="facebook.com";ji.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _r=class n extends Jn{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return n.credential(t,r)}catch{return null}}};_r.GOOGLE_SIGN_IN_METHOD="google.com";_r.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ki=class n extends Jn{constructor(){super("github.com")}static credential(e){return Cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return n.credential(e.oauthAccessToken)}catch{return null}}};Ki.GITHUB_SIGN_IN_METHOD="github.com";Ki.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ji=class n extends Jn{constructor(){super("twitter.com")}static credential(e,t){return Cn._fromParams({providerId:n.PROVIDER_ID,signInMethod:n.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return n.credentialFromTaggedObject(e)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return n.credential(t,r)}catch{return null}}};Ji.TWITTER_SIGN_IN_METHOD="twitter.com";Ji.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zi=class n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){let i=await Kn._fromIdTokenResponse(e,r,s),o=Mg(r);return new n({user:i,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let s=Mg(r);return new n({user:e,providerId:s,_tokenResponse:r,operationType:t})}};function Mg(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ll=class n extends ht{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,n.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new n(e,t,r,s)}};function EC(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Ll._fromErrorAndOperation(n,i,e,r):i})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yC(n){return new Set(n.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $l(n,e){let t=pe(n);await IC(!0,t,e);let{providerUserInfo:r}=await VI(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),s=yC(r||[]);return t.providerData=t.providerData.filter(i=>s.has(i.providerId)),s.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function wC(n,e,t=!1){let r=await Li(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return zi._forOperation(n,"link",r)}async function IC(n,e,t){await Mi(e);let r=yC(e.providerData),s=n===!1?"provider-already-linked":"no-such-provider";$(r.has(t)===n,e.auth,s)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function hD(n,e,t=!1){let{auth:r}=n;if(it(r.app))return Promise.reject(pr(r));let s="reauthenticate";try{let i=await Li(n,EC(r,s,e,n),t);$(i.idToken,r,"internal-error");let o=Wl(i.idToken);$(o,r,"internal-error");let{sub:u}=o;return $(n.uid===u,r,"user-mismatch"),zi._forOperation(n,s,i)}catch(i){throw i?.code==="auth/user-not-found"&&Pt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DC(n,e,t=!1){if(it(n.app))return Promise.reject(pr(n));let r="signIn",s=await EC(n,r,e),i=await zi._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function Yl(n,e){return DC(mn(n),e)}async function Xl(n,e){let t=pe(n);return await IC(!1,t,e.providerId),wC(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TC(n,e,t,r){return pe(n).onIdTokenChanged(e,t,r)}function AC(n,e,t){return pe(n).beforeAuthStateChanged(e,t)}function Zl(n,e,t,r){return pe(n).onAuthStateChanged(e,t,r)}function eh(n){return pe(n).signOut()}function th(n,e){return mn(n).revokeAccessToken(e)}async function nh(n){return pe(n).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ug(n,e){return tt(n,"POST","/v2/accounts/mfaEnrollment:start",Qe(n,e))}function BD(n,e){return tt(n,"POST","/v2/accounts/mfaEnrollment:finalize",Qe(n,e))}function fD(n,e){return tt(n,"POST","/v2/accounts/mfaEnrollment:start",Qe(n,e))}function dD(n,e){return tt(n,"POST","/v2/accounts/mfaEnrollment:finalize",Qe(n,e))}var Ga="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ha=class{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ga,"1"),this.storage.removeItem(Ga),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var pD=1e3,gD=10,qa=class extends Ha{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=fC(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,u,c)=>{this.notifyListeners(o,c)});return}let r=e.key;t?this.detachListener():this.stopPolling();let s=()=>{let o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);qI()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,gD):s()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},pD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};qa.type="LOCAL";var bC=qa;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var CD=1e3;function Dl(n){let e=n.replace(/[\\^$.*+?()[\]{}|]/g,"\\$&"),t=RegExp(`${e}=([^;]+)`);return document.cookie.match(t)?.[1]??null}function Tl(n){return`${window.location.protocol==="http:"?"__dev_":"__HOST-"}FIREBASE_${n.split(":")[3]}`}var Vl=class{constructor(){this.type="COOKIE",this.listenerUnsubscribes=new Map}_getFinalTarget(e){if(typeof window===void 0)return e;let t=new URL(`${window.location.origin}/__cookies__`);return t.searchParams.set("finalTarget",e),t}async _isAvailable(){return typeof isSecureContext=="boolean"&&!isSecureContext||typeof navigator>"u"||typeof document>"u"?!1:navigator.cookieEnabled??!0}async _set(e,t){}async _get(e){if(!this._isAvailable())return null;let t=Tl(e);return window.cookieStore?(await window.cookieStore.get(t))?.value:Dl(t)}async _remove(e){if(!this._isAvailable()||!await this._get(e))return;let r=Tl(e);document.cookie=`${r}=;Max-Age=34560000;Partitioned;Secure;SameSite=Strict;Path=/;Priority=High`,await fetch("/__cookies__",{method:"DELETE"}).catch(()=>{})}_addListener(e,t){if(!this._isAvailable())return;let r=Tl(e);if(window.cookieStore){let u=(l=>{let B=l.changed.find(g=>g.name===r);B&&t(B.value),l.deleted.find(g=>g.name===r)&&t(null)}),c=()=>window.cookieStore.removeEventListener("change",u);return this.listenerUnsubscribes.set(t,c),window.cookieStore.addEventListener("change",u)}let s=Dl(r),i=setInterval(()=>{let u=Dl(r);u!==s&&(t(u),s=u)},CD),o=()=>clearInterval(i);this.listenerUnsubscribes.set(t,o)}_removeListener(e,t){let r=this.listenerUnsubscribes.get(t);r&&(r(),this.listenerUnsubscribes.delete(t))}};Vl.type="COOKIE";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ja=class extends Ha{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};ja.type="SESSION";var rh=ja;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mD(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ka=class n{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;let r=new n(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let t=e,{eventId:r,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});let u=Array.from(o).map(async l=>l(t.origin,i)),c=await mD(u);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:c})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};Ka.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sh(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ml=class{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((u,c)=>{let l=sh("",20);s.port1.start();let B=setTimeout(()=>{c(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(d){let g=d;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(B),i=setTimeout(()=>{c(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),u(g.data.response);break;default:clearTimeout(B),clearTimeout(i),c(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nn(){return window}function _D(n){nn().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vC(){return typeof nn().WorkerGlobalScope<"u"&&typeof nn().importScripts=="function"}async function ED(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function yD(){return navigator?.serviceWorker?.controller||null}function wD(){return vC()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var RC="firebaseLocalStorageDb",ID=1,Ja="firebaseLocalStorage",SC="fbase_key",Er=class{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function ru(n,e){return n.transaction([Ja],e?"readwrite":"readonly").objectStore(Ja)}function DD(){let n=indexedDB.deleteDatabase(RC);return new Er(n).toPromise()}function PC(){let n=indexedDB.open(RC,ID);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{let r=n.result;try{r.createObjectStore(Ja,{keyPath:SC})}catch(s){t(s)}}),n.addEventListener("success",async()=>{let r=n.result;r.objectStoreNames.contains(Ja)?e(r):(r.close(),await DD(),e(await PC()))})})}async function Gg(n,e,t){let r=ru(n,!0).put({[SC]:e,value:t});return new Er(r).toPromise()}async function TD(n,e){let t=ru(n,!1).get(e),r=await new Er(t).toPromise();return r===void 0?null:r.value}function Hg(n,e){let t=ru(n,!0).delete(e);return new Er(t).toPromise()}var AD=800,bD=3,za=class{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise?this.dbPromise:(this.dbPromise=PC(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{let r=await this._openDb();return await e(r)}catch(r){if(t++>bD)throw r;if(this.dbPromise){let s=this.dbPromise;this.dbPromise=null;try{(await s).close()}catch{}}}}async initializeServiceWorkerMessaging(){return vC()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ka._getInstance(wD()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await ED(),!this.activeServiceWorker)return;this.sender=new Ml(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||yD()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await Gg(e,Ga,"1"),await Hg(e,Ga)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Gg(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(r=>TD(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Hg(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{let e=await this._withRetries(s=>{let i=ru(s,!1).getAll();return new Er(i).toPromise()});if(this.isClosing)return[];if(!e)return[];if(this.pendingWrites!==0)return[];let t=[],r=new Set;if(e.length!==0)for(let{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(let s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isClosing||va(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),AD)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e).catch(()=>{})),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}};za.type="LOCAL";var NC=za;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qg(n,e){return tt(n,"POST","/v2/accounts/mfaSignIn:start",Qe(n,e))}function vD(n,e){return tt(n,"POST","/v2/accounts/mfaSignIn:finalize",Qe(n,e))}function RD(n,e){return tt(n,"POST","/v2/accounts/mfaSignIn:finalize",Qe(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jv=gC("rcb"),Kv=new gr(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pa="recaptcha";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function SD(n,e,t){if(!n._getRecaptchaConfig())try{await $I(n)}catch{console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let r;if(typeof e=="string"?r={phoneNumber:e}:r=e,"session"in r){let s=r.session;if("phoneNumber"in r){$(s.type==="enroll",n,"internal-error");let i={idToken:s.credential,phoneEnrollmentInfo:{phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"}};return(await ki(n,i,"mfaSmsEnrollment",async(l,B)=>{if(B.phoneEnrollmentInfo.captchaResponse===Fi){$(t?.type===Pa,l,"argument-error");let d=await Al(l,B,t);return Ug(l,d)}return Ug(l,B)},"PHONE_PROVIDER").catch(l=>Promise.reject(l))).phoneSessionInfo.sessionInfo}else{$(s.type==="signin",n,"internal-error");let i=r.multiFactorHint?.uid||r.multiFactorUid;$(i,n,"missing-multi-factor-info");let o={mfaPendingCredential:s.credential,mfaEnrollmentId:i,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}};return(await ki(n,o,"mfaSmsSignIn",async(B,d)=>{if(d.phoneSignInInfo.captchaResponse===Fi){$(t?.type===Pa,B,"argument-error");let g=await Al(B,d,t);return qg(B,g)}return qg(B,d)},"PHONE_PROVIDER").catch(B=>Promise.reject(B))).phoneResponseInfo.sessionInfo}}else{let s={phoneNumber:r.phoneNumber,clientType:"CLIENT_TYPE_WEB"};return(await ki(n,s,"sendVerificationCode",async(c,l)=>{if(l.captchaResponse===Fi){$(t?.type===Pa,c,"argument-error");let B=await Al(c,l,t);return Vg(c,B)}return Vg(c,l)},"PHONE_PROVIDER").catch(c=>Promise.reject(c))).sessionInfo}}finally{t?._reset()}}async function Al(n,e,t){$(t.type===Pa,n,"argument-error");let r=await t.verify();$(typeof r=="string",n,"argument-error");let s={...e};if("phoneEnrollmentInfo"in s){let i=s.phoneEnrollmentInfo.phoneNumber,o=s.phoneEnrollmentInfo.captchaResponse,u=s.phoneEnrollmentInfo.clientType,c=s.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(s,{phoneEnrollmentInfo:{phoneNumber:i,recaptchaToken:r,captchaResponse:o,clientType:u,recaptchaVersion:c}}),s}else if("phoneSignInInfo"in s){let i=s.phoneSignInInfo.captchaResponse,o=s.phoneSignInInfo.clientType,u=s.phoneSignInInfo.recaptchaVersion;return Object.assign(s,{phoneSignInInfo:{recaptchaToken:r,captchaResponse:i,clientType:o,recaptchaVersion:u}}),s}else return Object.assign(s,{recaptchaToken:r}),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wi=class n{constructor(e){this.providerId=n.PROVIDER_ID,this.auth=mn(e)}verifyPhoneNumber(e,t){return SD(this.auth,e,pe(t))}static credential(e,t){return Hi._fromVerification(e,t)}static credentialFromResult(e){let t=e;return n.credentialFromTaggedObject(t)}static credentialFromError(e){return n.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?Hi._fromTokenResponse(t,r):null}};Wi.PROVIDER_ID="phone";Wi.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function su(n,e){return e?pn(e):($(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qi=class extends Cr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return fs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return fs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return fs(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function PD(n){return DC(n.auth,new Qi(n),n.bypassAuthState)}function ND(n){let{auth:e,user:t}=n;return $(t,e,"internal-error"),hD(t,new Qi(n),n.bypassAuthState)}async function OD(n){let{auth:e,user:t}=n;return $(t,e,"internal-error"),wC(t,new Qi(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wa=class{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{if(this.eventManager=await this.resolver._initialize(this.auth),!this.pendingPromise||(await this.onExecution(),!this.pendingPromise))return;this.eventManager.registerConsumer(this)}catch(r){this.pendingPromise&&this.reject(r)}})}async onAuthEvent(e){if(!this.pendingPromise)return;let{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:o,type:u}=e;if(o){this.reject(o);return}let c={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(u)(c))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return PD;case"linkViaPopup":case"linkViaRedirect":return OD;case"reauthViaPopup":case"reauthViaRedirect":return ND;default:Pt(this.auth,"internal-error")}}resolve(e){gn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){gn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xD=new gr(2e3,1e4);async function ih(n,e,t){if(it(n.app))return Promise.reject(St(n,"operation-not-supported-in-this-environment"));let r=mn(n);Kl(n,e,mr);let s=su(r,t);return new ps(r,"signInViaPopup",e,s).executeNotNull()}async function oh(n,e,t){let r=pe(n);if(it(r.auth.app))return Promise.reject(St(r.auth,"operation-not-supported-in-this-environment"));Kl(r.auth,e,mr);let s=su(r.auth,t);return new ps(r.auth,"reauthViaPopup",e,s,r).executeNotNull()}async function ah(n,e,t){let r=pe(n);Kl(r.auth,e,mr);let s=su(r.auth,t);return new ps(r.auth,"linkViaPopup",e,s,r).executeNotNull()}var ps=class n extends Wa{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,n.currentPopupAction&&n.currentPopupAction.cancel(),n.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return $(e,this.auth,"internal-error"),e}async onExecution(){gn(this.filter.length===1,"Popup operations only handle one event");let e=sh();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(St(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(St(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,n.currentPopupAction=null}pollUserCancellation(){let e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(St(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,xD.get())};e()}};ps.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var FD="pendingRedirect",Na=new Map,Ul=class extends Wa{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Na.get(this.auth._key());if(!e){try{let r=await kD(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Na.set(this.auth._key(),e)}return this.bypassAuthState||Na.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function kD(n,e){let t=MD(e),r=VD(n);if(!await r._isAvailable())return!1;let s=await r._get(t)==="true";return await r._remove(t),s}function LD(n,e){Na.set(n._key(),e)}function VD(n){return pn(n._redirectPersistence)}function MD(n){return Sa(FD,n.config.apiKey,n.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function UD(n,e,t=!1){if(it(n.app))return Promise.reject(pr(n));let r=mn(n),s=su(r,e),o=await new Ul(r,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var GD=600*1e3,Gl=class{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!HD(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!OC(e)){let r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(St(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=GD&&this.cachedEventUids.clear(),this.cachedEventUids.has(jg(e))}saveEventToCache(e){this.cachedEventUids.add(jg(e)),this.lastProcessedEventTime=Date.now()}};function jg(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function OC({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function HD(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return OC(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qD(n,e={}){return tt(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jD=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,KD=/^https?/;async function JD(n){if(n.config.emulator)return;let{authorizedDomains:e}=await qD(n);for(let t of e)try{if(zD(t))return}catch{}Pt(n,"unauthorized-domain")}function zD(n){let e=vl(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){let o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!KD.test(t))return!1;if(jD.test(n))return r===n;let s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var WD=new gr(3e4,6e4);function Kg(){let n=nn().___jsl;if(n?.H){for(let e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function QD(n){return new Promise((e,t)=>{function r(){Kg(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Kg(),t(St(n,"network-request-failed"))},timeout:WD.get()})}if(nn().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(nn().gapi?.load)r();else{let s=gC("iframefcb");return nn()[s]=()=>{gapi.load?r():t(St(n,"network-request-failed"))},pC(`${WI()}?onload=${s}`).catch(i=>t(i))}}).catch(e=>{throw Oa=null,e})}var Oa=null;function $D(n){return Oa=Oa||QD(n),Oa}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var YD=new gr(5e3,15e3),XD="__/auth/iframe",ZD="emulator/auth/iframe",eT={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},tT=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function nT(n){let e=n.config;$(e.authDomain,n,"auth-domain-config-required");let t=e.emulator?zl(e,ZD):`https://${n.config.authDomain}/${XD}`,r={apiKey:e.apiKey,appName:n.name,v:en},s=tT.get(n.config.apiHost);s&&(r.eid=s);let i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${us(r).slice(1)}`}async function rT(n){let e=await $D(n),t=nn().gapi;return $(t,n,"internal-error"),e.open({where:document.body,url:nT(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:eT,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});let o=St(n,"network-request-failed"),u=nn().setTimeout(()=>{i(o)},YD.get());function c(){nn().clearTimeout(u),s(r)}r.ping(c).then(c,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sT={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},iT=500,oT=600,aT="_blank",uT="http://localhost",Qa=class{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}};function cT(n,e,t,r=iT,s=oT){let i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString(),u="",c={...sT,width:r.toString(),height:s.toString(),top:i,left:o},l=We().toLowerCase();t&&(u=uC(l)?aT:t),oC(l)&&(e=e||uT,c.scrollbars="yes");let B=Object.entries(c).reduce((g,[w,D])=>`${g}${w}=${D},`,"");if(HI(l)&&u!=="_self")return lT(e||"",u),new Qa(null);let d=window.open(e||"",u,B);$(d,n,"popup-blocked");try{d.focus()}catch{}return new Qa(d)}function lT(n,e){let t=document.createElement("a");t.href=n,t.target=e;let r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var hT="__/auth/handler",BT="emulator/auth/handler",fT=encodeURIComponent("fac");async function Jg(n,e,t,r,s,i){$(n.config.authDomain,n,"auth-domain-config-required"),$(n.config.apiKey,n,"invalid-api-key");let o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:en,eventId:s};if(e instanceof mr){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",dg(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(let[B,d]of Object.entries(i||{}))o[B]=d}if(e instanceof Jn){let B=e.getScopes().filter(d=>d!=="");B.length>0&&(o.scopes=B.join(","))}n.tenantId&&(o.tid=n.tenantId);let u=o;for(let B of Object.keys(u))u[B]===void 0&&delete u[B];let c=await n._getAppCheckToken(),l=c?`#${fT}=${encodeURIComponent(c)}`:"";return`${dT(n)}?${us(u).slice(1)}${l}`}function dT({config:n}){return n.emulator?zl(n,BT):`https://${n.authDomain}/${hT}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bl="webStorageSupport",Hl=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=rh,this._completeRedirectFn=UD,this._overrideRedirectResult=LD}async _openPopup(e,t,r,s){gn(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");let i=await Jg(e,t,r,vl(),s);return cT(e,i,sh())}async _openRedirect(e,t,r,s){await this._originValidation(e);let i=await Jg(e,t,r,vl(),s);return _D(i),new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(gn(i,"If manager is not set, promise should be"),i)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await rT(e),r=new Gl(e);return t.register("authEvent",s=>($(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(bl,{type:bl},s=>{let i=s?.[0]?.[bl];i!==void 0&&t(!!i),Pt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=JD(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return fC()||aC()||Ql()}},xC=Hl,$a=class{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return tn("unexpected MultiFactorSessionType")}}},ql=class n extends $a{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new n(e)}_finalizeEnroll(e,t,r){return BD(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return vD(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}},Ya=class{constructor(){}static assertion(e){return ql._fromCredential(e)}};Ya.FACTOR_ID="phone";var Xa=class{static assertionForEnrollment(e,t){return Za._fromSecret(e,t)}static assertionForSignIn(e,t){return Za._fromEnrollmentId(e,t)}static async generateSecret(e){let t=e;$(typeof t.user?.auth<"u","internal-error");let r=await fD(t.user.auth,{idToken:t.credential,totpEnrollmentInfo:{}});return eu._fromStartTotpMfaEnrollmentResponse(r,t.user.auth)}};Xa.FACTOR_ID="totp";var Za=class n extends $a{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new n(t,void 0,e)}static _fromEnrollmentId(e,t){return new n(t,e)}async _finalizeEnroll(e,t,r){return $(typeof this.secret<"u",e,"argument-error"),dD(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){$(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");let r={verificationCode:this.otp};return RD(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r})}},eu=class n{constructor(e,t,r,s,i,o,u){this.sessionInfo=o,this.auth=u,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=s,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new n(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let r=!1;return(ba(e)||ba(t))&&(r=!0),r&&(ba(e)&&(e=this.auth.currentUser?.email||"unknownuser"),ba(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function ba(n){return typeof n>"u"||n?.length===0}var zg="@firebase/auth",Wg="1.13.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jl=class{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){$(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pT(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function gT(n){Zt(new gt("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:u}=r.options;$(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});let c={apiKey:o,authDomain:u,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:dC(n)},l=new xl(r,s,i,c);return YI(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Zt(new gt("auth-internal",e=>{let t=mn(e.getProvider("auth").getImmediate());return(r=>new jl(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Ct(zg,Wg,pT(n)),Ct(zg,Wg,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var CT=300,mT=ol("authIdTokenMaxAge")||CT,Qg=null,_T=n=>async e=>{let t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>mT)return;let s=t?.token;Qg!==s&&(Qg=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function uh(n=Bs()){let e=dr(n,"auth");if(e.isInitialized())return e.getImmediate();let t=CC(n,{popupRedirectResolver:xC,persistence:[NC,bC,rh]}),r=ol("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){let i=new URL(r,location.origin);if(location.origin===i.origin){let o=_T(i.toString());AC(t,o,()=>o(t.currentUser)),TC(t,u=>o(u))}}let s=sl("auth");return s&&mC(t,`http://${s}`),t}function ET(){return document.getElementsByTagName("head")?.[0]??document}JI({loadJS(n){return new Promise((e,t)=>{let r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{let i=St("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",ET().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});gT("Browser");var FC=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},kC={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var _n,ch;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(A,_){function y(){}y.prototype=_.prototype,A.F=_.prototype,A.prototype=new y,A.prototype.constructor=A,A.D=function(v,T,S){for(var E=Array(arguments.length-2),pt=2;pt<arguments.length;pt++)E[pt-2]=arguments[pt];return _.prototype[T].apply(v,E)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(A,_,y){y||(y=0);let v=Array(16);if(typeof _=="string")for(var T=0;T<16;++T)v[T]=_.charCodeAt(y++)|_.charCodeAt(y++)<<8|_.charCodeAt(y++)<<16|_.charCodeAt(y++)<<24;else for(T=0;T<16;++T)v[T]=_[y++]|_[y++]<<8|_[y++]<<16|_[y++]<<24;_=A.g[0],y=A.g[1],T=A.g[2];let S=A.g[3],E;E=_+(S^y&(T^S))+v[0]+3614090360&4294967295,_=y+(E<<7&4294967295|E>>>25),E=S+(T^_&(y^T))+v[1]+3905402710&4294967295,S=_+(E<<12&4294967295|E>>>20),E=T+(y^S&(_^y))+v[2]+606105819&4294967295,T=S+(E<<17&4294967295|E>>>15),E=y+(_^T&(S^_))+v[3]+3250441966&4294967295,y=T+(E<<22&4294967295|E>>>10),E=_+(S^y&(T^S))+v[4]+4118548399&4294967295,_=y+(E<<7&4294967295|E>>>25),E=S+(T^_&(y^T))+v[5]+1200080426&4294967295,S=_+(E<<12&4294967295|E>>>20),E=T+(y^S&(_^y))+v[6]+2821735955&4294967295,T=S+(E<<17&4294967295|E>>>15),E=y+(_^T&(S^_))+v[7]+4249261313&4294967295,y=T+(E<<22&4294967295|E>>>10),E=_+(S^y&(T^S))+v[8]+1770035416&4294967295,_=y+(E<<7&4294967295|E>>>25),E=S+(T^_&(y^T))+v[9]+2336552879&4294967295,S=_+(E<<12&4294967295|E>>>20),E=T+(y^S&(_^y))+v[10]+4294925233&4294967295,T=S+(E<<17&4294967295|E>>>15),E=y+(_^T&(S^_))+v[11]+2304563134&4294967295,y=T+(E<<22&4294967295|E>>>10),E=_+(S^y&(T^S))+v[12]+1804603682&4294967295,_=y+(E<<7&4294967295|E>>>25),E=S+(T^_&(y^T))+v[13]+4254626195&4294967295,S=_+(E<<12&4294967295|E>>>20),E=T+(y^S&(_^y))+v[14]+2792965006&4294967295,T=S+(E<<17&4294967295|E>>>15),E=y+(_^T&(S^_))+v[15]+1236535329&4294967295,y=T+(E<<22&4294967295|E>>>10),E=_+(T^S&(y^T))+v[1]+4129170786&4294967295,_=y+(E<<5&4294967295|E>>>27),E=S+(y^T&(_^y))+v[6]+3225465664&4294967295,S=_+(E<<9&4294967295|E>>>23),E=T+(_^y&(S^_))+v[11]+643717713&4294967295,T=S+(E<<14&4294967295|E>>>18),E=y+(S^_&(T^S))+v[0]+3921069994&4294967295,y=T+(E<<20&4294967295|E>>>12),E=_+(T^S&(y^T))+v[5]+3593408605&4294967295,_=y+(E<<5&4294967295|E>>>27),E=S+(y^T&(_^y))+v[10]+38016083&4294967295,S=_+(E<<9&4294967295|E>>>23),E=T+(_^y&(S^_))+v[15]+3634488961&4294967295,T=S+(E<<14&4294967295|E>>>18),E=y+(S^_&(T^S))+v[4]+3889429448&4294967295,y=T+(E<<20&4294967295|E>>>12),E=_+(T^S&(y^T))+v[9]+568446438&4294967295,_=y+(E<<5&4294967295|E>>>27),E=S+(y^T&(_^y))+v[14]+3275163606&4294967295,S=_+(E<<9&4294967295|E>>>23),E=T+(_^y&(S^_))+v[3]+4107603335&4294967295,T=S+(E<<14&4294967295|E>>>18),E=y+(S^_&(T^S))+v[8]+1163531501&4294967295,y=T+(E<<20&4294967295|E>>>12),E=_+(T^S&(y^T))+v[13]+2850285829&4294967295,_=y+(E<<5&4294967295|E>>>27),E=S+(y^T&(_^y))+v[2]+4243563512&4294967295,S=_+(E<<9&4294967295|E>>>23),E=T+(_^y&(S^_))+v[7]+1735328473&4294967295,T=S+(E<<14&4294967295|E>>>18),E=y+(S^_&(T^S))+v[12]+2368359562&4294967295,y=T+(E<<20&4294967295|E>>>12),E=_+(y^T^S)+v[5]+4294588738&4294967295,_=y+(E<<4&4294967295|E>>>28),E=S+(_^y^T)+v[8]+2272392833&4294967295,S=_+(E<<11&4294967295|E>>>21),E=T+(S^_^y)+v[11]+1839030562&4294967295,T=S+(E<<16&4294967295|E>>>16),E=y+(T^S^_)+v[14]+4259657740&4294967295,y=T+(E<<23&4294967295|E>>>9),E=_+(y^T^S)+v[1]+2763975236&4294967295,_=y+(E<<4&4294967295|E>>>28),E=S+(_^y^T)+v[4]+1272893353&4294967295,S=_+(E<<11&4294967295|E>>>21),E=T+(S^_^y)+v[7]+4139469664&4294967295,T=S+(E<<16&4294967295|E>>>16),E=y+(T^S^_)+v[10]+3200236656&4294967295,y=T+(E<<23&4294967295|E>>>9),E=_+(y^T^S)+v[13]+681279174&4294967295,_=y+(E<<4&4294967295|E>>>28),E=S+(_^y^T)+v[0]+3936430074&4294967295,S=_+(E<<11&4294967295|E>>>21),E=T+(S^_^y)+v[3]+3572445317&4294967295,T=S+(E<<16&4294967295|E>>>16),E=y+(T^S^_)+v[6]+76029189&4294967295,y=T+(E<<23&4294967295|E>>>9),E=_+(y^T^S)+v[9]+3654602809&4294967295,_=y+(E<<4&4294967295|E>>>28),E=S+(_^y^T)+v[12]+3873151461&4294967295,S=_+(E<<11&4294967295|E>>>21),E=T+(S^_^y)+v[15]+530742520&4294967295,T=S+(E<<16&4294967295|E>>>16),E=y+(T^S^_)+v[2]+3299628645&4294967295,y=T+(E<<23&4294967295|E>>>9),E=_+(T^(y|~S))+v[0]+4096336452&4294967295,_=y+(E<<6&4294967295|E>>>26),E=S+(y^(_|~T))+v[7]+1126891415&4294967295,S=_+(E<<10&4294967295|E>>>22),E=T+(_^(S|~y))+v[14]+2878612391&4294967295,T=S+(E<<15&4294967295|E>>>17),E=y+(S^(T|~_))+v[5]+4237533241&4294967295,y=T+(E<<21&4294967295|E>>>11),E=_+(T^(y|~S))+v[12]+1700485571&4294967295,_=y+(E<<6&4294967295|E>>>26),E=S+(y^(_|~T))+v[3]+2399980690&4294967295,S=_+(E<<10&4294967295|E>>>22),E=T+(_^(S|~y))+v[10]+4293915773&4294967295,T=S+(E<<15&4294967295|E>>>17),E=y+(S^(T|~_))+v[1]+2240044497&4294967295,y=T+(E<<21&4294967295|E>>>11),E=_+(T^(y|~S))+v[8]+1873313359&4294967295,_=y+(E<<6&4294967295|E>>>26),E=S+(y^(_|~T))+v[15]+4264355552&4294967295,S=_+(E<<10&4294967295|E>>>22),E=T+(_^(S|~y))+v[6]+2734768916&4294967295,T=S+(E<<15&4294967295|E>>>17),E=y+(S^(T|~_))+v[13]+1309151649&4294967295,y=T+(E<<21&4294967295|E>>>11),E=_+(T^(y|~S))+v[4]+4149444226&4294967295,_=y+(E<<6&4294967295|E>>>26),E=S+(y^(_|~T))+v[11]+3174756917&4294967295,S=_+(E<<10&4294967295|E>>>22),E=T+(_^(S|~y))+v[2]+718787259&4294967295,T=S+(E<<15&4294967295|E>>>17),E=y+(S^(T|~_))+v[9]+3951481745&4294967295,A.g[0]=A.g[0]+_&4294967295,A.g[1]=A.g[1]+(T+(E<<21&4294967295|E>>>11))&4294967295,A.g[2]=A.g[2]+T&4294967295,A.g[3]=A.g[3]+S&4294967295}r.prototype.v=function(A,_){_===void 0&&(_=A.length);let y=_-this.blockSize,v=this.C,T=this.h,S=0;for(;S<_;){if(T==0)for(;S<=y;)s(this,A,S),S+=this.blockSize;if(typeof A=="string"){for(;S<_;)if(v[T++]=A.charCodeAt(S++),T==this.blockSize){s(this,v),T=0;break}}else for(;S<_;)if(v[T++]=A[S++],T==this.blockSize){s(this,v),T=0;break}}this.h=T,this.o+=_},r.prototype.A=function(){var A=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);A[0]=128;for(var _=1;_<A.length-8;++_)A[_]=0;_=this.o*8;for(var y=A.length-8;y<A.length;++y)A[y]=_&255,_/=256;for(this.v(A),A=Array(16),_=0,y=0;y<4;++y)for(let v=0;v<32;v+=8)A[_++]=this.g[y]>>>v&255;return A};function i(A,_){var y=u;return Object.prototype.hasOwnProperty.call(y,A)?y[A]:y[A]=_(A)}function o(A,_){this.h=_;let y=[],v=!0;for(let T=A.length-1;T>=0;T--){let S=A[T]|0;v&&S==_||(y[T]=S,v=!1)}this.g=y}var u={};function c(A){return-128<=A&&A<128?i(A,function(_){return new o([_|0],_<0?-1:0)}):new o([A|0],A<0?-1:0)}function l(A){if(isNaN(A)||!isFinite(A))return d;if(A<0)return V(l(-A));let _=[],y=1;for(let v=0;A>=y;v++)_[v]=A/y|0,y*=4294967296;return new o(_,0)}function B(A,_){if(A.length==0)throw Error("number format error: empty string");if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(A.charAt(0)=="-")return V(B(A.substring(1),_));if(A.indexOf("-")>=0)throw Error('number format error: interior "-" character');let y=l(Math.pow(_,8)),v=d;for(let S=0;S<A.length;S+=8){var T=Math.min(8,A.length-S);let E=parseInt(A.substring(S,S+T),_);T<8?(T=l(Math.pow(_,T)),v=v.j(T).add(l(E))):(v=v.j(y),v=v.add(l(E)))}return v}var d=c(0),g=c(1),w=c(16777216);n=o.prototype,n.m=function(){if(P(this))return-V(this).m();let A=0,_=1;for(let y=0;y<this.g.length;y++){let v=this.i(y);A+=(v>=0?v:4294967296+v)*_,_*=4294967296}return A},n.toString=function(A){if(A=A||10,A<2||36<A)throw Error("radix out of range: "+A);if(D(this))return"0";if(P(this))return"-"+V(this).toString(A);let _=l(Math.pow(A,6));var y=this;let v="";for(;;){let T=ue(y,_).g;y=j(y,T.j(_));let S=((y.g.length>0?y.g[0]:y.h)>>>0).toString(A);if(y=T,D(y))return S+v;for(;S.length<6;)S="0"+S;v=S+v}},n.i=function(A){return A<0?0:A<this.g.length?this.g[A]:this.h};function D(A){if(A.h!=0)return!1;for(let _=0;_<A.g.length;_++)if(A.g[_]!=0)return!1;return!0}function P(A){return A.h==-1}n.l=function(A){return A=j(this,A),P(A)?-1:D(A)?0:1};function V(A){let _=A.g.length,y=[];for(let v=0;v<_;v++)y[v]=~A.g[v];return new o(y,~A.h).add(g)}n.abs=function(){return P(this)?V(this):this},n.add=function(A){let _=Math.max(this.g.length,A.g.length),y=[],v=0;for(let T=0;T<=_;T++){let S=v+(this.i(T)&65535)+(A.i(T)&65535),E=(S>>>16)+(this.i(T)>>>16)+(A.i(T)>>>16);v=E>>>16,S&=65535,E&=65535,y[T]=E<<16|S}return new o(y,y[y.length-1]&-2147483648?-1:0)};function j(A,_){return A.add(V(_))}n.j=function(A){if(D(this)||D(A))return d;if(P(this))return P(A)?V(this).j(V(A)):V(V(this).j(A));if(P(A))return V(this.j(V(A)));if(this.l(w)<0&&A.l(w)<0)return l(this.m()*A.m());let _=this.g.length+A.g.length,y=[];for(var v=0;v<2*_;v++)y[v]=0;for(v=0;v<this.g.length;v++)for(let T=0;T<A.g.length;T++){let S=this.i(v)>>>16,E=this.i(v)&65535,pt=A.i(T)>>>16,ar=A.i(T)&65535;y[2*v+2*T]+=E*ar,Q(y,2*v+2*T),y[2*v+2*T+1]+=S*ar,Q(y,2*v+2*T+1),y[2*v+2*T+1]+=E*pt,Q(y,2*v+2*T+1),y[2*v+2*T+2]+=S*pt,Q(y,2*v+2*T+2)}for(A=0;A<_;A++)y[A]=y[2*A+1]<<16|y[2*A];for(A=_;A<2*_;A++)y[A]=0;return new o(y,0)};function Q(A,_){for(;(A[_]&65535)!=A[_];)A[_+1]+=A[_]>>>16,A[_]&=65535,_++}function re(A,_){this.g=A,this.h=_}function ue(A,_){if(D(_))throw Error("division by zero");if(D(A))return new re(d,d);if(P(A))return _=ue(V(A),_),new re(V(_.g),V(_.h));if(P(_))return _=ue(A,V(_)),new re(V(_.g),_.h);if(A.g.length>30){if(P(A)||P(_))throw Error("slowDivide_ only works with positive integers.");for(var y=g,v=_;v.l(A)<=0;)y=Oe(y),v=Oe(v);var T=Ee(y,1),S=Ee(v,1);for(v=Ee(v,2),y=Ee(y,2);!D(v);){var E=S.add(v);E.l(A)<=0&&(T=T.add(y),S=E),v=Ee(v,1),y=Ee(y,1)}return _=j(A,T.j(_)),new re(T,_)}for(T=d;A.l(_)>=0;){for(y=Math.max(1,Math.floor(A.m()/_.m())),v=Math.ceil(Math.log(y)/Math.LN2),v=v<=48?1:Math.pow(2,v-48),S=l(y),E=S.j(_);P(E)||E.l(A)>0;)y-=v,S=l(y),E=S.j(_);D(S)&&(S=g),T=T.add(S),A=j(A,E)}return new re(T,A)}n.B=function(A){return ue(this,A).h},n.and=function(A){let _=Math.max(this.g.length,A.g.length),y=[];for(let v=0;v<_;v++)y[v]=this.i(v)&A.i(v);return new o(y,this.h&A.h)},n.or=function(A){let _=Math.max(this.g.length,A.g.length),y=[];for(let v=0;v<_;v++)y[v]=this.i(v)|A.i(v);return new o(y,this.h|A.h)},n.xor=function(A){let _=Math.max(this.g.length,A.g.length),y=[];for(let v=0;v<_;v++)y[v]=this.i(v)^A.i(v);return new o(y,this.h^A.h)};function Oe(A){let _=A.g.length+1,y=[];for(let v=0;v<_;v++)y[v]=A.i(v)<<1|A.i(v-1)>>>31;return new o(y,A.h)}function Ee(A,_){let y=_>>5;_%=32;let v=A.g.length-y,T=[];for(let S=0;S<v;S++)T[S]=_>0?A.i(S+y)>>>_|A.i(S+y+1)<<32-_:A.i(S+y);return new o(T,A.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,ch=kC.Md5=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=B,_n=kC.Integer=o}).apply(typeof FC<"u"?FC:typeof self<"u"?self:typeof window<"u"?window:{});function $e(n,e,t,r){if(t==="a"&&!r)throw new TypeError("Private accessor was defined without a getter");if(typeof e=="function"?n!==e||!r:!e.has(n))throw new TypeError("Cannot read private member from an object whose class did not declare it");return t==="m"?r:t==="a"?r.call(n):r?r.value:e.get(n)}var iu=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},En={};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var lh,yT,gs,hh,$i,ou,Bh,fh,dh;(function(){var n,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof iu=="object"&&iu];for(var h=0;h<a.length;++h){var f=a[h];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=t(this);function s(a,h){if(h)e:{var f=r;a=a.split(".");for(var p=0;p<a.length-1;p++){var R=a[p];if(!(R in f))break e;f=f[R]}a=a[a.length-1],p=f[a],h=h(p),h!=p&&h!=null&&e(f,a,{configurable:!0,writable:!0,value:h})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(h){var f=[],p;for(p in h)Object.prototype.hasOwnProperty.call(h,p)&&f.push([p,h[p]]);return f}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function u(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function c(a,h,f){return a.call.apply(a.bind,arguments)}function l(a,h,f){return l=c,l.apply(null,arguments)}function B(a,h){var f=Array.prototype.slice.call(arguments,1);return function(){var p=f.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function d(a,h){function f(){}f.prototype=h.prototype,a.Z=h.prototype,a.prototype=new f,a.prototype.constructor=a,a.Ob=function(p,R,N){for(var q=Array(arguments.length-2),se=2;se<arguments.length;se++)q[se-2]=arguments[se];return h.prototype[R].apply(p,q)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function w(a){let h=a.length;if(h>0){let f=Array(h);for(let p=0;p<h;p++)f[p]=a[p];return f}return[]}function D(a,h){for(let p=1;p<arguments.length;p++){let R=arguments[p];var f=typeof R;if(f=f!="object"?f:R?Array.isArray(R)?"array":f:"null",f=="array"||f=="object"&&typeof R.length=="number"){f=a.length||0;let N=R.length||0;a.length=f+N;for(let q=0;q<N;q++)a[f+q]=R[q]}else a.push(R)}}class P{constructor(h,f){this.i=h,this.j=f,this.h=0,this.g=null}get(){let h;return this.h>0?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function V(a){o.setTimeout(()=>{throw a},0)}function j(){var a=A;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class Q{constructor(){this.h=this.g=null}add(h,f){let p=re.get();p.set(h,f),this.h?this.h.next=p:this.g=p,this.h=p}}var re=new P(()=>new ue,a=>a.reset());class ue{constructor(){this.next=this.g=this.h=null}set(h,f){this.h=h,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let Oe,Ee=!1,A=new Q,_=()=>{let a=Promise.resolve(void 0);Oe=()=>{a.then(y)}};function y(){for(var a;a=j();){try{a.h.call(a.g)}catch(f){V(f)}var h=re;h.j(a),h.h<100&&(h.h++,a.next=h.g,h.g=a)}Ee=!1}function v(){this.u=this.u,this.C=this.C}v.prototype.u=!1,v.prototype.dispose=function(){this.u||(this.u=!0,this.N())},v.prototype[Symbol.dispose]=function(){this.dispose()},v.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function T(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}T.prototype.h=function(){this.defaultPrevented=!0};var S=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{let f=()=>{};o.addEventListener("test",f,h),o.removeEventListener("test",f,h)}catch{}return a})();function E(a){return/^[\s\xa0]*$/.test(a)}function pt(a,h){T.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,h)}d(pt,T),pt.prototype.init=function(a,h){let f=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget,h||(f=="mouseover"?h=a.fromElement:f=="mouseout"&&(h=a.toElement)),this.relatedTarget=h,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&pt.Z.h.call(this)},pt.prototype.h=function(){pt.Z.h.call(this);let a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ar="closure_listenable_"+(Math.random()*1e6|0),Ny=0;function Oy(a,h,f,p,R){this.listener=a,this.proxy=null,this.src=h,this.type=f,this.capture=!!p,this.ha=R,this.key=++Ny,this.da=this.fa=!1}function sa(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ia(a,h,f){for(let p in a)h.call(f,a[p],p,a)}function xy(a,h){for(let f in a)h.call(void 0,a[f],f,a)}function tp(a){let h={};for(let f in a)h[f]=a[f];return h}let np="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function rp(a,h){let f,p;for(let R=1;R<arguments.length;R++){p=arguments[R];for(f in p)a[f]=p[f];for(let N=0;N<np.length;N++)f=np[N],Object.prototype.hasOwnProperty.call(p,f)&&(a[f]=p[f])}}function oa(a){this.src=a,this.g={},this.h=0}oa.prototype.add=function(a,h,f,p,R){let N=a.toString();a=this.g[N],a||(a=this.g[N]=[],this.h++);let q=Oc(a,h,p,R);return q>-1?(h=a[q],f||(h.fa=!1)):(h=new Oy(h,this.src,N,!!p,R),h.fa=f,a.push(h)),h};function Nc(a,h){let f=h.type;if(f in a.g){var p=a.g[f],R=Array.prototype.indexOf.call(p,h,void 0),N;(N=R>=0)&&Array.prototype.splice.call(p,R,1),N&&(sa(h),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Oc(a,h,f,p){for(let R=0;R<a.length;++R){let N=a[R];if(!N.da&&N.listener==h&&N.capture==!!f&&N.ha==p)return R}return-1}var xc="closure_lm_"+(Math.random()*1e6|0),Fc={};function sp(a,h,f,p,R){if(Array.isArray(h)){for(let N=0;N<h.length;N++)sp(a,h[N],f,p,R);return null}return f=ap(f),a&&a[ar]?a.J(h,f,u(p)?!!p.capture:!1,R):Fy(a,h,f,!1,p,R)}function Fy(a,h,f,p,R,N){if(!h)throw Error("Invalid event type");let q=u(R)?!!R.capture:!!R,se=Lc(a);if(se||(a[xc]=se=new oa(a)),f=se.add(h,f,p,q,N),f.proxy)return f;if(p=ky(),f.proxy=p,p.src=a,p.listener=f,a.addEventListener)S||(R=q),R===void 0&&(R=!1),a.addEventListener(h.toString(),p,R);else if(a.attachEvent)a.attachEvent(op(h.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return f}function ky(){function a(f){return h.call(a.src,a.listener,f)}let h=Ly;return a}function ip(a,h,f,p,R){if(Array.isArray(h))for(var N=0;N<h.length;N++)ip(a,h[N],f,p,R);else p=u(p)?!!p.capture:!!p,f=ap(f),a&&a[ar]?(a=a.i,N=String(h).toString(),N in a.g&&(h=a.g[N],f=Oc(h,f,p,R),f>-1&&(sa(h[f]),Array.prototype.splice.call(h,f,1),h.length==0&&(delete a.g[N],a.h--)))):a&&(a=Lc(a))&&(h=a.g[h.toString()],a=-1,h&&(a=Oc(h,f,p,R)),(f=a>-1?h[a]:null)&&kc(f))}function kc(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[ar])Nc(h.i,a);else{var f=a.type,p=a.proxy;h.removeEventListener?h.removeEventListener(f,p,a.capture):h.detachEvent?h.detachEvent(op(f),p):h.addListener&&h.removeListener&&h.removeListener(p),(f=Lc(h))?(Nc(f,a),f.h==0&&(f.src=null,h[xc]=null)):sa(a)}}}function op(a){return a in Fc?Fc[a]:Fc[a]="on"+a}function Ly(a,h){if(a.da)a=!0;else{h=new pt(h,this);let f=a.listener,p=a.ha||a.src;a.fa&&kc(a),a=f.call(p,h)}return a}function Lc(a){return a=a[xc],a instanceof oa?a:null}var Vc="__closure_events_fn_"+(Math.random()*1e9>>>0);function ap(a){return typeof a=="function"?a:(a[Vc]||(a[Vc]=function(h){return a.handleEvent(h)}),a[Vc])}function st(){v.call(this),this.i=new oa(this),this.M=this,this.G=null}d(st,v),st.prototype[ar]=!0,st.prototype.removeEventListener=function(a,h,f,p){ip(this,a,h,f,p)};function ct(a,h){var f,p=a.G;if(p)for(f=[];p;p=p.G)f.push(p);if(a=a.M,p=h.type||h,typeof h=="string")h=new T(h,a);else if(h instanceof T)h.target=h.target||a;else{var R=h;h=new T(p,a),rp(h,R)}R=!0;let N,q;if(f)for(q=f.length-1;q>=0;q--)N=h.g=f[q],R=aa(N,p,!0,h)&&R;if(N=h.g=a,R=aa(N,p,!0,h)&&R,R=aa(N,p,!1,h)&&R,f)for(q=0;q<f.length;q++)N=h.g=f[q],R=aa(N,p,!1,h)&&R}st.prototype.N=function(){if(st.Z.N.call(this),this.i){var a=this.i;for(let h in a.g){let f=a.g[h];for(let p=0;p<f.length;p++)sa(f[p]);delete a.g[h],a.h--}}this.G=null},st.prototype.J=function(a,h,f,p){return this.i.add(String(a),h,!1,f,p)},st.prototype.K=function(a,h,f,p){return this.i.add(String(a),h,!0,f,p)};function aa(a,h,f,p){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();let R=!0;for(let N=0;N<h.length;++N){let q=h[N];if(q&&!q.da&&q.capture==f){let se=q.listener,qe=q.ha||q.src;q.fa&&Nc(a.i,q),R=se.call(qe,p)!==!1&&R}}return R&&!p.defaultPrevented}function Vy(a,h){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=l(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(h)>2147483647?-1:o.setTimeout(a,h||0)}function up(a){a.g=Vy(()=>{a.g=null,a.i&&(a.i=!1,up(a))},a.l);let h=a.h;a.h=null,a.m.apply(null,h)}class My extends v{constructor(h,f){super(),this.m=h,this.l=f,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:up(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function hi(a){v.call(this),this.h=a,this.g={}}d(hi,v);var cp=[];function lp(a){ia(a.g,function(h,f){this.g.hasOwnProperty(f)&&kc(h)},a),a.g={}}hi.prototype.N=function(){hi.Z.N.call(this),lp(this)},hi.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Mc=o.JSON.stringify,Uy=o.JSON.parse,Gy=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function hp(){}function Bp(){}var Bi={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Uc(){T.call(this,"d")}d(Uc,T);function Gc(){T.call(this,"c")}d(Gc,T);var ur={},fp=null;function ua(){return fp=fp||new st}ur.Ia="serverreachability";function dp(a){T.call(this,ur.Ia,a)}d(dp,T);function fi(a){let h=ua();ct(h,new dp(h))}ur.STAT_EVENT="statevent";function pp(a,h){T.call(this,ur.STAT_EVENT,a),this.stat=h}d(pp,T);function lt(a){let h=ua();ct(h,new pp(h,a))}ur.Ja="timingevent";function gp(a,h){T.call(this,ur.Ja,a),this.size=h}d(gp,T);function di(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},h)}function pi(){this.g=!0}pi.prototype.ua=function(){this.g=!1};function Hy(a,h,f,p,R,N){a.info(function(){if(a.g)if(N){var q="",se=N.split("&");for(let ye=0;ye<se.length;ye++){var qe=se[ye].split("=");if(qe.length>1){let ze=qe[0];qe=qe[1];let $t=ze.split("_");q=$t.length>=2&&$t[1]=="type"?q+(ze+"="+qe+"&"):q+(ze+"=redacted&")}}}else q=null;else q=N;return"XMLHTTP REQ ("+p+") [attempt "+R+"]: "+h+`
`+f+`
`+q})}function qy(a,h,f,p,R,N,q){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+R+"]: "+h+`
`+f+`
`+N+" "+q})}function ss(a,h,f,p){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+Ky(a,f)+(p?" "+p:"")})}function jy(a,h){a.info(function(){return"TIMEOUT: "+h})}pi.prototype.info=function(){};function Ky(a,h){if(!a.g)return h;if(!h)return null;try{let N=JSON.parse(h);if(N){for(a=0;a<N.length;a++)if(Array.isArray(N[a])){var f=N[a];if(!(f.length<2)){var p=f[1];if(Array.isArray(p)&&!(p.length<1)){var R=p[0];if(R!="noop"&&R!="stop"&&R!="close")for(let q=1;q<p.length;q++)p[q]=""}}}}return Mc(N)}catch{return h}}var ca={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Cp={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},mp;function Hc(){}d(Hc,hp),Hc.prototype.g=function(){return new XMLHttpRequest},mp=new Hc;function gi(a){return encodeURIComponent(String(a))}function Jy(a){var h=1;a=a.split(":");let f=[];for(;h>0&&a.length;)f.push(a.shift()),h--;return a.length&&f.push(a.join(":")),f}function Ln(a,h,f,p){this.j=a,this.i=h,this.l=f,this.S=p||1,this.V=new hi(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new _p}function _p(){this.i=null,this.g="",this.h=!1}var Ep={},qc={};function jc(a,h,f){a.M=1,a.A=ha(Qt(h)),a.u=f,a.R=!0,yp(a,null)}function yp(a,h){a.F=Date.now(),la(a),a.B=Qt(a.A);var f=a.B,p=a.S;Array.isArray(p)||(p=[String(p)]),xp(f.i,"t",p),a.C=0,f=a.j.L,a.h=new _p,a.g=Xp(a.j,f?h:null,!a.u),a.P>0&&(a.O=new My(l(a.Y,a,a.g),a.P)),h=a.V,f=a.g,p=a.ba;var R="readystatechange";Array.isArray(R)||(R&&(cp[0]=R.toString()),R=cp);for(let N=0;N<R.length;N++){let q=sp(f,R[N],p||h.handleEvent,!1,h.h||h);if(!q)break;h.g[q.key]=q}h=a.J?tp(a.J):{},a.u?(a.v||(a.v="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,h)):(a.v="GET",a.g.ea(a.B,a.v,null,h)),fi(),Hy(a.i,a.v,a.B,a.l,a.S,a.u)}Ln.prototype.ba=function(a){a=a.target;let h=this.O;h&&Un(a)==3?h.j():this.Y(a)},Ln.prototype.Y=function(a){try{if(a==this.g)e:{let se=Un(this.g),qe=this.g.ya(),ye=this.g.ca();if(!(se<3)&&(se!=3||this.g&&(this.h.h||this.g.la()||Gp(this.g)))){this.K||se!=4||qe==7||(qe==8||ye<=0?fi(3):fi(2)),Kc(this);var h=this.g.ca();this.X=h;var f=zy(this);if(this.o=h==200,qy(this.i,this.v,this.B,this.l,this.S,se,h),this.o){if(this.U&&!this.L){t:{if(this.g){var p,R=this.g;if((p=R.g?R.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!E(p)){var N=p;break t}}N=null}if(a=N)ss(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Jc(this,a);else{this.o=!1,this.m=3,lt(12),cr(this),Ci(this);break e}}if(this.R){a=!0;let ze;for(;!this.K&&this.C<f.length;)if(ze=Wy(this,f),ze==qc){se==4&&(this.m=4,lt(14),a=!1),ss(this.i,this.l,null,"[Incomplete Response]");break}else if(ze==Ep){this.m=4,lt(15),ss(this.i,this.l,f,"[Invalid Chunk]"),a=!1;break}else ss(this.i,this.l,ze,null),Jc(this,ze);if(wp(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),se!=4||f.length!=0||this.h.h||(this.m=1,lt(16),a=!1),this.o=this.o&&a,!a)ss(this.i,this.l,f,"[Invalid Chunked Response]"),cr(this),Ci(this);else if(f.length>0&&!this.W){this.W=!0;var q=this.j;q.g==this&&q.aa&&!q.P&&(q.j.info("Great, no buffering proxy detected. Bytes received: "+f.length),Zc(q),q.P=!0,lt(11))}}else ss(this.i,this.l,f,null),Jc(this,f);se==4&&cr(this),this.o&&!this.K&&(se==4?Wp(this.j,this):(this.o=!1,la(this)))}else uw(this.g),h==400&&f.indexOf("Unknown SID")>0?(this.m=3,lt(12)):(this.m=0,lt(13)),cr(this),Ci(this)}}}catch{}};function zy(a){if(!wp(a))return a.g.la();let h=Gp(a.g);if(h==="")return"";let f="",p=h.length,R=Un(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return cr(a),Ci(a),"";a.h.i=new o.TextDecoder}for(let N=0;N<p;N++)a.h.h=!0,f+=a.h.i.decode(h[N],{stream:!(R&&N==p-1)});return h.length=0,a.h.g+=f,a.C=0,a.h.g}function wp(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function Wy(a,h){var f=a.C,p=h.indexOf(`
`,f);return p==-1?qc:(f=Number(h.substring(f,p)),isNaN(f)?Ep:(p+=1,p+f>h.length?qc:(h=h.slice(p,p+f),a.C=p+f,h)))}Ln.prototype.cancel=function(){this.K=!0,cr(this)};function la(a){a.T=Date.now()+a.H,Ip(a,a.H)}function Ip(a,h){if(a.D!=null)throw Error("WatchDog timer not null");a.D=di(l(a.aa,a),h)}function Kc(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Ln.prototype.aa=function(){this.D=null;let a=Date.now();a-this.T>=0?(jy(this.i,this.B),this.M!=2&&(fi(),lt(17)),cr(this),this.m=2,Ci(this)):Ip(this,this.T-a)};function Ci(a){a.j.I==0||a.K||Wp(a.j,a)}function cr(a){Kc(a);var h=a.O;h&&typeof h.dispose=="function"&&h.dispose(),a.O=null,lp(a.V),a.g&&(h=a.g,a.g=null,h.abort(),h.dispose())}function Jc(a,h){try{var f=a.j;if(f.I!=0&&(f.g==a||zc(f.h,a))){if(!a.L&&zc(f.h,a)&&f.I==3){try{var p=f.Ba.g.parse(h)}catch{p=null}if(Array.isArray(p)&&p.length==3){var R=p;if(R[0]==0){e:if(!f.v){if(f.g)if(f.g.F+3e3<a.F)Ca(f),pa(f);else break e;Xc(f),lt(18)}}else f.xa=R[1],0<f.xa-f.K&&R[2]<37500&&f.F&&f.A==0&&!f.C&&(f.C=di(l(f.Va,f),6e3));Ap(f.h)<=1&&f.ta&&(f.ta=void 0)}else hr(f,11)}else if((a.L||f.g==a)&&Ca(f),!E(h))for(R=f.Ba.g.parse(h),h=0;h<R.length;h++){let ye=R[h],ze=ye[0];if(!(ze<=f.K))if(f.K=ze,ye=ye[1],f.I==2)if(ye[0]=="c"){f.M=ye[1],f.ba=ye[2];let $t=ye[3];$t!=null&&(f.ka=$t,f.j.info("VER="+f.ka));let Br=ye[4];Br!=null&&(f.za=Br,f.j.info("SVER="+f.za));let Gn=ye[5];Gn!=null&&typeof Gn=="number"&&Gn>0&&(p=1.5*Gn,f.O=p,f.j.info("backChannelRequestTimeoutMs_="+p)),p=f;let Hn=a.g;if(Hn){let _a=Hn.g?Hn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(_a){var N=p.h;N.g||_a.indexOf("spdy")==-1&&_a.indexOf("quic")==-1&&_a.indexOf("h2")==-1||(N.j=N.l,N.g=new Set,N.h&&(Wc(N,N.h),N.h=null))}if(p.G){let el=Hn.g?Hn.g.getResponseHeader("X-HTTP-Session-Id"):null;el&&(p.wa=el,be(p.J,p.G,el))}}f.I=3,f.l&&f.l.ra(),f.aa&&(f.T=Date.now()-a.F,f.j.info("Handshake RTT: "+f.T+"ms")),p=f;var q=a;if(p.na=Yp(p,p.L?p.ba:null,p.W),q.L){bp(p.h,q);var se=q,qe=p.O;qe&&(se.H=qe),se.D&&(Kc(se),la(se)),p.g=q}else Jp(p);f.i.length>0&&ga(f)}else ye[0]!="stop"&&ye[0]!="close"||hr(f,7);else f.I==3&&(ye[0]=="stop"||ye[0]=="close"?ye[0]=="stop"?hr(f,7):Yc(f):ye[0]!="noop"&&f.l&&f.l.qa(ye),f.A=0)}}fi(4)}catch{}}var Qy=class{constructor(a,h){this.g=a,this.map=h}};function Dp(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Tp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function Ap(a){return a.h?1:a.g?a.g.size:0}function zc(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function Wc(a,h){a.g?a.g.add(h):a.h=h}function bp(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}Dp.prototype.cancel=function(){if(this.i=vp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(let a of this.g.values())a.cancel();this.g.clear()}};function vp(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let h=a.i;for(let f of a.g.values())h=h.concat(f.G);return h}return w(a.i)}var Rp=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function $y(a,h){if(a){a=a.split("&");for(let f=0;f<a.length;f++){let p=a[f].indexOf("="),R,N=null;p>=0?(R=a[f].substring(0,p),N=a[f].substring(p+1)):R=a[f],h(R,N?decodeURIComponent(N.replace(/\+/g," ")):"")}}}function Vn(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let h;a instanceof Vn?(this.l=a.l,mi(this,a.j),this.o=a.o,this.g=a.g,_i(this,a.u),this.h=a.h,Qc(this,Fp(a.i)),this.m=a.m):a&&(h=String(a).match(Rp))?(this.l=!1,mi(this,h[1]||"",!0),this.o=Ei(h[2]||""),this.g=Ei(h[3]||"",!0),_i(this,h[4]),this.h=Ei(h[5]||"",!0),Qc(this,h[6]||"",!0),this.m=Ei(h[7]||"")):(this.l=!1,this.i=new wi(null,this.l))}Vn.prototype.toString=function(){let a=[];var h=this.j;h&&a.push(yi(h,Sp,!0),":");var f=this.g;return(f||h=="file")&&(a.push("//"),(h=this.o)&&a.push(yi(h,Sp,!0),"@"),a.push(gi(f).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.u,f!=null&&a.push(":",String(f))),(f=this.h)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(yi(f,f.charAt(0)=="/"?Zy:Xy,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",yi(f,tw)),a.join("")},Vn.prototype.resolve=function(a){let h=Qt(this),f=!!a.j;f?mi(h,a.j):f=!!a.o,f?h.o=a.o:f=!!a.g,f?h.g=a.g:f=a.u!=null;var p=a.h;if(f)_i(h,a.u);else if(f=!!a.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var R=h.h.lastIndexOf("/");R!=-1&&(p=h.h.slice(0,R+1)+p)}if(R=p,R==".."||R==".")p="";else if(R.indexOf("./")!=-1||R.indexOf("/.")!=-1){p=R.lastIndexOf("/",0)==0,R=R.split("/");let N=[];for(let q=0;q<R.length;){let se=R[q++];se=="."?p&&q==R.length&&N.push(""):se==".."?((N.length>1||N.length==1&&N[0]!="")&&N.pop(),p&&q==R.length&&N.push("")):(N.push(se),p=!0)}p=N.join("/")}else p=R}return f?h.h=p:f=a.i.toString()!=="",f?Qc(h,Fp(a.i)):f=!!a.m,f&&(h.m=a.m),h};function Qt(a){return new Vn(a)}function mi(a,h,f){a.j=f?Ei(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function _i(a,h){if(h){if(h=Number(h),isNaN(h)||h<0)throw Error("Bad port number "+h);a.u=h}else a.u=null}function Qc(a,h,f){h instanceof wi?(a.i=h,nw(a.i,a.l)):(f||(h=yi(h,ew)),a.i=new wi(h,a.l))}function be(a,h,f){a.i.set(h,f)}function ha(a){return be(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function Ei(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function yi(a,h,f){return typeof a=="string"?(a=encodeURI(a).replace(h,Yy),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Yy(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Sp=/[#\/\?@]/g,Xy=/[#\?:]/g,Zy=/[#\?]/g,ew=/[#\?@]/g,tw=/#/g;function wi(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function lr(a){a.g||(a.g=new Map,a.h=0,a.i&&$y(a.i,function(h,f){a.add(decodeURIComponent(h.replace(/\+/g," ")),f)}))}n=wi.prototype,n.add=function(a,h){lr(this),this.i=null,a=is(this,a);let f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(h),this.h+=1,this};function Pp(a,h){lr(a),h=is(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function Np(a,h){return lr(a),h=is(a,h),a.g.has(h)}n.forEach=function(a,h){lr(this),this.g.forEach(function(f,p){f.forEach(function(R){a.call(h,R,p,this)},this)},this)};function Op(a,h){lr(a);let f=[];if(typeof h=="string")Np(a,h)&&(f=f.concat(a.g.get(is(a,h))));else for(a=Array.from(a.g.values()),h=0;h<a.length;h++)f=f.concat(a[h]);return f}n.set=function(a,h){return lr(this),this.i=null,a=is(this,a),Np(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},n.get=function(a,h){return a?(a=Op(this,a),a.length>0?String(a[0]):h):h};function xp(a,h,f){Pp(a,h),f.length>0&&(a.i=null,a.g.set(is(a,h),w(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";let a=[],h=Array.from(this.g.keys());for(let p=0;p<h.length;p++){var f=h[p];let R=gi(f);f=Op(this,f);for(let N=0;N<f.length;N++){let q=R;f[N]!==""&&(q+="="+gi(f[N])),a.push(q)}}return this.i=a.join("&")};function Fp(a){let h=new wi;return h.i=a.i,a.g&&(h.g=new Map(a.g),h.h=a.h),h}function is(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function nw(a,h){h&&!a.j&&(lr(a),a.i=null,a.g.forEach(function(f,p){let R=p.toLowerCase();p!=R&&(Pp(this,p),xp(this,R,f))},a)),a.j=h}function rw(a,h){let f=new pi;if(o.Image){let p=new Image;p.onload=B(Mn,f,"TestLoadImage: loaded",!0,h,p),p.onerror=B(Mn,f,"TestLoadImage: error",!1,h,p),p.onabort=B(Mn,f,"TestLoadImage: abort",!1,h,p),p.ontimeout=B(Mn,f,"TestLoadImage: timeout",!1,h,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else h(!1)}function sw(a,h){let f=new pi,p=new AbortController,R=setTimeout(()=>{p.abort(),Mn(f,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:p.signal}).then(N=>{clearTimeout(R),N.ok?Mn(f,"TestPingServer: ok",!0,h):Mn(f,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(R),Mn(f,"TestPingServer: error",!1,h)})}function Mn(a,h,f,p,R){try{R&&(R.onload=null,R.onerror=null,R.onabort=null,R.ontimeout=null),p(f)}catch{}}function iw(){this.g=new Gy}function Ba(a){this.i=a.Sb||null,this.h=a.ab||!1}d(Ba,hp),Ba.prototype.g=function(){return new fa(this.i,this.h)};function fa(a,h){st.call(this),this.H=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}d(fa,st),n=fa.prototype,n.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=h,this.readyState=1,Di(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;let h={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(h.body=a),(this.H||o).fetch(new Request(this.D,h)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Ii(this)),this.readyState=0},n.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,Di(this)),this.g&&(this.readyState=3,Di(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;kp(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function kp(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}n.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.B.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?Ii(this):Di(this),this.readyState==3&&kp(this)}},n.Oa=function(a){this.g&&(this.response=this.responseText=a,Ii(this))},n.Na=function(a){this.g&&(this.response=a,Ii(this))},n.ga=function(){this.g&&Ii(this)};function Ii(a){a.readyState=4,a.l=null,a.j=null,a.B=null,Di(a)}n.setRequestHeader=function(a,h){this.A.append(a,h)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";let a=[],h=this.h.entries();for(var f=h.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=h.next();return a.join(`\r
`)};function Di(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(fa.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Lp(a){let h="";return ia(a,function(f,p){h+=p,h+=":",h+=f,h+=`\r
`}),h}function $c(a,h,f){e:{for(p in f){var p=!1;break e}p=!0}p||(f=Lp(f),typeof a=="string"?f!=null&&gi(f):be(a,h,f))}function Se(a){st.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}d(Se,st);var ow=/^https?$/i,aw=["POST","PUT"];n=Se.prototype,n.Fa=function(a){this.H=a},n.ea=function(a,h,f,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():mp.g(),this.g.onreadystatechange=g(l(this.Ca,this));try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(N){Vp(this,N);return}if(a=f||"",f=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var R in p)f.set(R,p[R]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(let N of p.keys())f.set(N,p.get(N));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(f.keys()).find(N=>N.toLowerCase()=="content-type"),R=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(aw,h,void 0)>=0)||p||R||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(let[N,q]of f)this.g.setRequestHeader(N,q);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(N){Vp(this,N)}};function Vp(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.o=5,Mp(a),da(a)}function Mp(a){a.A||(a.A=!0,ct(a,"complete"),ct(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,ct(this,"complete"),ct(this,"abort"),da(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),da(this,!0)),Se.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Up(this):this.Xa())},n.Xa=function(){Up(this)};function Up(a){if(a.h&&typeof i<"u"){if(a.v&&Un(a)==4)setTimeout(a.Ca.bind(a),0);else if(ct(a,"readystatechange"),Un(a)==4){a.h=!1;try{let N=a.ca();e:switch(N){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var f;if(!(f=h)){var p;if(p=N===0){let q=String(a.D).match(Rp)[1]||null;!q&&o.self&&o.self.location&&(q=o.self.location.protocol.slice(0,-1)),p=!ow.test(q?q.toLowerCase():"")}f=p}if(f)ct(a,"complete"),ct(a,"success");else{a.o=6;try{var R=Un(a)>2?a.g.statusText:""}catch{R=""}a.l=R+" ["+a.ca()+"]",Mp(a)}}finally{da(a)}}}}function da(a,h){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);let f=a.g;a.g=null,h||ct(a,"ready");try{f.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Un(a){return a.g?a.g.readyState:0}n.ca=function(){try{return Un(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),Uy(h)}};function Gp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function uw(a){let h={};a=(a.g&&Un(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(E(a[p]))continue;var f=Jy(a[p]);let R=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();let N=h[R]||[];h[R]=N,N.push(f)}xy(h,function(p){return p.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Ti(a,h,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||h}function Hp(a){this.za=0,this.i=[],this.j=new pi,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Ti("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Ti("baseRetryDelayMs",5e3,a),this.Za=Ti("retryDelaySeedMs",1e4,a),this.Ta=Ti("forwardChannelMaxRetries",2,a),this.va=Ti("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new Dp(a&&a.concurrentRequestLimit),this.Ba=new iw,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Hp.prototype,n.ka=8,n.I=1,n.connect=function(a,h,f,p){lt(0),this.W=a,this.H=h||{},f&&p!==void 0&&(this.H.OSID=f,this.H.OAID=p),this.F=this.X,this.J=Yp(this,null,this.W),ga(this)};function Yc(a){if(qp(a),a.I==3){var h=a.V++,f=Qt(a.J);if(be(f,"SID",a.M),be(f,"RID",h),be(f,"TYPE","terminate"),Ai(a,f),h=new Ln(a,a.j,h),h.M=2,h.A=ha(Qt(f)),f=!1,o.navigator&&o.navigator.sendBeacon)try{f=o.navigator.sendBeacon(h.A.toString(),"")}catch{}!f&&o.Image&&(new Image().src=h.A,f=!0),f||(h.g=Xp(h.j,null),h.g.ea(h.A)),h.F=Date.now(),la(h)}$p(a)}function pa(a){a.g&&(Zc(a),a.g.cancel(),a.g=null)}function qp(a){pa(a),a.v&&(o.clearTimeout(a.v),a.v=null),Ca(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function ga(a){if(!Tp(a.h)&&!a.m){a.m=!0;var h=a.Ea;Oe||_(),Ee||(Oe(),Ee=!0),A.add(h,a),a.D=0}}function cw(a,h){return Ap(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=h.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=di(l(a.Ea,a,h),Qp(a,a.D)),a.D++,!0)}n.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;let R=new Ln(this,this.j,a),N=this.o;if(this.U&&(N?(N=tp(N),rp(N,this.U)):N=this.U),this.u!==null||this.R||(R.J=N,N=null),this.S)e:{for(var h=0,f=0;f<this.i.length;f++){t:{var p=this.i[f];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(h+=p,h>4096){h=f;break e}if(h===4096||f===this.i.length-1){h=f+1;break e}}h=1e3}else h=1e3;h=Kp(this,R,h),f=Qt(this.J),be(f,"RID",a),be(f,"CVER",22),this.G&&be(f,"X-HTTP-Session-Id",this.G),Ai(this,f),N&&(this.R?h="headers="+gi(Lp(N))+"&"+h:this.u&&$c(f,this.u,N)),Wc(this.h,R),this.Ra&&be(f,"TYPE","init"),this.S?(be(f,"$req",h),be(f,"SID","null"),R.U=!0,jc(R,f,null)):jc(R,f,h),this.I=2}}else this.I==3&&(a?jp(this,a):this.i.length==0||Tp(this.h)||jp(this))};function jp(a,h){var f;h?f=h.l:f=a.V++;let p=Qt(a.J);be(p,"SID",a.M),be(p,"RID",f),be(p,"AID",a.K),Ai(a,p),a.u&&a.o&&$c(p,a.u,a.o),f=new Ln(a,a.j,f,a.D+1),a.u===null&&(f.J=a.o),h&&(a.i=h.G.concat(a.i)),h=Kp(a,f,1e3),f.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Wc(a.h,f),jc(f,p,h)}function Ai(a,h){a.H&&ia(a.H,function(f,p){be(h,p,f)}),a.l&&ia({},function(f,p){be(h,p,f)})}function Kp(a,h,f){f=Math.min(a.i.length,f);let p=a.l?l(a.l.Ka,a.l,a):null;e:{var R=a.i;let se=-1;for(;;){let qe=["count="+f];se==-1?f>0?(se=R[0].g,qe.push("ofs="+se)):se=0:qe.push("ofs="+se);let ye=!0;for(let ze=0;ze<f;ze++){var N=R[ze].g;let $t=R[ze].map;if(N-=se,N<0)se=Math.max(0,R[ze].g-100),ye=!1;else try{N="req"+N+"_"||"";try{var q=$t instanceof Map?$t:Object.entries($t);for(let[Br,Gn]of q){let Hn=Gn;u(Gn)&&(Hn=Mc(Gn)),qe.push(N+Br+"="+encodeURIComponent(Hn))}}catch(Br){throw qe.push(N+"type="+encodeURIComponent("_badmap")),Br}}catch{p&&p($t)}}if(ye){q=qe.join("&");break e}}q=void 0}return a=a.i.splice(0,f),h.G=a,q}function Jp(a){if(!a.g&&!a.v){a.Y=1;var h=a.Da;Oe||_(),Ee||(Oe(),Ee=!0),A.add(h,a),a.A=0}}function Xc(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=di(l(a.Da,a),Qp(a,a.A)),a.A++,!0)}n.Da=function(){if(this.v=null,zp(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=di(l(this.Wa,this),a)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,lt(10),pa(this),zp(this))};function Zc(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function zp(a){a.g=new Ln(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var h=Qt(a.na);be(h,"RID","rpc"),be(h,"SID",a.M),be(h,"AID",a.K),be(h,"CI",a.F?"0":"1"),!a.F&&a.ia&&be(h,"TO",a.ia),be(h,"TYPE","xmlhttp"),Ai(a,h),a.u&&a.o&&$c(h,a.u,a.o),a.O&&(a.g.H=a.O);var f=a.g;a=a.ba,f.M=1,f.A=ha(Qt(h)),f.u=null,f.R=!0,yp(f,a)}n.Va=function(){this.C!=null&&(this.C=null,pa(this),Xc(this),lt(19))};function Ca(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Wp(a,h){var f=null;if(a.g==h){Ca(a),Zc(a),a.g=null;var p=2}else if(zc(a.h,h))f=h.G,bp(a.h,h),p=1;else return;if(a.I!=0){if(h.o)if(p==1){f=h.u?h.u.length:0,h=Date.now()-h.F;var R=a.D;p=ua(),ct(p,new gp(p,f)),ga(a)}else Jp(a);else if(R=h.m,R==3||R==0&&h.X>0||!(p==1&&cw(a,h)||p==2&&Xc(a)))switch(f&&f.length>0&&(h=a.h,h.i=h.i.concat(f)),R){case 1:hr(a,5);break;case 4:hr(a,10);break;case 3:hr(a,6);break;default:hr(a,2)}}}function Qp(a,h){let f=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(f*=2),f*h}function hr(a,h){if(a.j.info("Error code "+h),h==2){var f=l(a.bb,a),p=a.Ua;let R=!p;p=new Vn(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||mi(p,"https"),ha(p),R?rw(p.toString(),f):sw(p.toString(),f)}else lt(2);a.I=0,a.l&&a.l.pa(h),$p(a),qp(a)}n.bb=function(a){a?(this.j.info("Successfully pinged google.com"),lt(2)):(this.j.info("Failed to ping google.com"),lt(1))};function $p(a){if(a.I=0,a.ja=[],a.l){let h=vp(a.h);(h.length!=0||a.i.length!=0)&&(D(a.ja,h),D(a.ja,a.i),a.h.i.length=0,w(a.i),a.i.length=0),a.l.oa()}}function Yp(a,h,f){var p=f instanceof Vn?Qt(f):new Vn(f);if(p.g!="")h&&(p.g=h+"."+p.g),_i(p,p.u);else{var R=o.location;p=R.protocol,h=h?h+"."+R.hostname:R.hostname,R=+R.port;let N=new Vn(null);p&&mi(N,p),h&&(N.g=h),R&&_i(N,R),f&&(N.h=f),p=N}return f=a.G,h=a.wa,f&&h&&be(p,f,h),be(p,"VER",a.ka),Ai(a,p),p}function Xp(a,h,f){if(h&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Aa&&!a.ma?new Se(new Ba({ab:f})):new Se(a.ma),h.Fa(a.L),h}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Zp(){}n=Zp.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function ma(){}ma.prototype.g=function(a,h){return new yt(a,h)};function yt(a,h){st.call(this),this.g=new Hp(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.sa&&(a?a["X-WebChannel-Client-Profile"]=h.sa:a={"X-WebChannel-Client-Profile":h.sa}),this.g.U=a,(a=h&&h.Qb)&&!E(a)&&(this.g.u=a),this.A=h&&h.supportsCrossDomainXhr||!1,this.v=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!E(h)&&(this.g.G=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new os(this)}d(yt,st),yt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},yt.prototype.close=function(){Yc(this.g)},yt.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.v&&(f={},f.__data__=Mc(a),a=f);h.i.push(new Qy(h.Ya++,a)),h.I==3&&ga(h)},yt.prototype.N=function(){this.g.l=null,delete this.j,Yc(this.g),delete this.g,yt.Z.N.call(this)};function eg(a){Uc.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(let f in h){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}d(eg,Uc);function tg(){Gc.call(this),this.status=1}d(tg,Gc);function os(a){this.g=a}d(os,Zp),os.prototype.ra=function(){ct(this.g,"a")},os.prototype.qa=function(a){ct(this.g,new eg(a))},os.prototype.pa=function(a){ct(this.g,new tg)},os.prototype.oa=function(){ct(this.g,"b")},ma.prototype.createWebChannel=ma.prototype.g,yt.prototype.send=yt.prototype.o,yt.prototype.open=yt.prototype.m,yt.prototype.close=yt.prototype.close,dh=En.createWebChannelTransport=function(){return new ma},fh=En.getStatEventTarget=function(){return ua()},Bh=En.Event=ur,ou=En.Stat={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ca.NO_ERROR=0,ca.TIMEOUT=8,ca.HTTP_ERROR=6,$i=En.ErrorCode=ca,Cp.COMPLETE="complete",hh=En.EventType=Cp,Bp.EventType=Bi,Bi.OPEN="a",Bi.CLOSE="b",Bi.ERROR="c",Bi.MESSAGE="d",st.prototype.listen=st.prototype.J,gs=En.WebChannel=Bp,yT=En.FetchXmlHttpFactory=Ba,Se.prototype.listenOnce=Se.prototype.K,Se.prototype.getLastError=Se.prototype.Ha,Se.prototype.getLastErrorCode=Se.prototype.ya,Se.prototype.getStatus=Se.prototype.ca,Se.prototype.getResponseJson=Se.prototype.La,Se.prototype.getResponseText=Se.prototype.la,Se.prototype.send=Se.prototype.ea,Se.prototype.setWithCredentials=Se.prototype.Fa,lh=En.XhrIo=Se}).apply(typeof iu<"u"?iu:typeof self<"u"?self:typeof window<"u"?window:{});/*!
* re2js
* RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
*
* @version v2.9.1
* @author Oleksii Vasyliev
* @homepage https://github.com/le0pard/re2js#readme
* @repository [object Object]
* @license MIT
*/var Ie,F=(Ie=class{},M(Ie,"FOLD_CASE",1),M(Ie,"LITERAL",2),M(Ie,"CLASS_NL",4),M(Ie,"DOT_NL",8),M(Ie,"ONE_LINE",16),M(Ie,"NON_GREEDY",32),M(Ie,"PERL_X",64),M(Ie,"UNICODE_GROUPS",128),M(Ie,"WAS_DOLLAR",256),M(Ie,"LOOKBEHIND",512),M(Ie,"MATCH_NL",Ie.CLASS_NL|Ie.DOT_NL),M(Ie,"PERL",Ie.CLASS_NL|Ie.ONE_LINE|Ie.PERL_X|Ie.UNICODE_GROUPS),M(Ie,"POSIX",0),M(Ie,"UNANCHORED",0),M(Ie,"ANCHOR_START",1),M(Ie,"ANCHOR_BOTH",2),Ie),Mt={CASE_INSENSITIVE:1,DOTALL:2,MULTILINE:4,DISABLE_UNICODE_GROUPS:8,LONGEST_MATCH:16,LOOKBEHINDS:512},eo=128,Eh=new Int32Array(eo),yh=new Int32Array(eo),au=65535;for(let n=0;n<eo;n++)n>=97&&n<=122?Eh[n]=n-32:Eh[n]=n,n>=65&&n<=90?yh[n]=n+32:yh[n]=n;var _h,k=(_h=class{static toUpperCase(n){if(n<eo)return Eh[n];let e=String.fromCodePoint(n).toUpperCase(),t=e.codePointAt(0)>au?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toLowerCase(),s=r.codePointAt(0)>au?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}static toLowerCase(n){if(n<eo)return yh[n];let e=String.fromCodePoint(n).toLowerCase(),t=e.codePointAt(0)>au?2:1;if(e.length>t)return n;let r=String.fromCodePoint(e.codePointAt(0)).toUpperCase(),s=r.codePointAt(0)>au?2:1;return r.length>s||r.codePointAt(0)!==n?n:e.codePointAt(0)}},M(_h,"CODES",Object.freeze({"\x07":7,"\b":8,"	":9,"\n":10,"\v":11,"\f":12,"\r":13," ":32,'"':34,$:36,"&":38,"'":39,"(":40,")":41,"*":42,"+":43,"-":45,".":46,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,":":58,"<":60,">":62,"?":63,A:65,B:66,C:67,F:70,P:80,Q:81,U:85,Z:90,"[":91,"\\":92,"]":93,"^":94,_:95,"`":96,a:97,b:98,f:102,i:105,m:109,n:110,r:114,s:115,t:116,v:118,x:120,z:122,"{":123,"|":124,"}":125})),_h),C=class{constructor(n,e=!1){this.data=n,this.isStride1=e,this.SIZE=e?2:3}getLo(n){return this.data[n*this.SIZE]}getHi(n){return this.data[n*this.SIZE+1]}getStride(n){return this.isStride1?1:this.data[n*this.SIZE+2]}get length(){return this.data.length/this.SIZE}},wT="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-",Bm=new Uint8Array(256);for(let n=0;n<64;n++)Bm[wT.charCodeAt(n)]=n;var fm=n=>{let e=[],t=0,r=0;for(let s=0;s<n.length;s++){let i=Bm[n.charCodeAt(s)];t|=(i&31)<<r,(i&32)===0?(e.push(t),t=0,r=0):r+=5}return e},m=(n,e)=>{let t=fm(n),r=e?t.length/2:t.length/3,s=new Uint32Array(r*3),i=0,o=0;for(let u=0;u<r;u++)i+=t[o++],s[u*3]=i,i+=t[o++],s[u*3+1]=i,s[u*3+2]=e?1:t[o++];return s},IT=n=>{let e=fm(n),t=new Map,r=0;for(let s=0;s<e.length;s+=2){r+=e[s];let i=e[s+1],o=i>>>1^-(i&1);t.set(r,r+o)}return t},uu=class{constructor(n){this.initializer=n,this.cache=new Map}has(n){return n in this.initializer}get(n){if(this.cache.has(n))return this.cache.get(n);let e=this.initializer[n],t=e?e():null;return this.cache.set(n,t),t}},zn,wt=(zn=class{static get CASE_ORBIT(){return this._CASE_ORBIT||(this._CASE_ORBIT=IT("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC")),this._CASE_ORBIT}static get Print(){return this._Print||(this._Print=new C(m("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB",!1))),this._Print}},M(zn,"_CASE_ORBIT",null),M(zn,"_Print",null),M(zn,"CATEGORIES",new uu({C:()=>new C(m("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB",!1)),Cc:()=>new C(m("AfgDgB",!0)),Cf:()=>new C(m("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB",!1)),Cn:()=>new C(m("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB",!1)),Co:()=>new C(m("gg4B-nGh4hc9--BD9--B",!0)),Cs:()=>new C(m("gg2B--B",!0)),L:()=>new C(m("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),LC:()=>new C(m("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB",!1)),Ll:()=>new C(m("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB",!1)),Lm:()=>new C(m("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB",!1)),Lo:()=>new C(m("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Lt:()=>new C(m("lOGDnB2sH2sHBGBJHBJHBNQQwBAB",!1)),Lu:()=>new C(m("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB",!1)),M:()=>new C(m("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),Mc:()=>new C(m("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB",!1)),Me:()=>new C(m("okBBB1xF-wB-wBBCBCCBsshBCB",!1)),Mn:()=>new C(m("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB",!1)),N:()=>new C(m("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB",!1)),Nd:()=>new C(m("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ",!0)),Nl:()=>new C(m("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB",!1)),No:()=>new C(m("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB",!1)),P:()=>new C(m("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Pc:()=>new C(m("-Cg-Hg-HBUU-u3BBBZCBwHAB",!1)),Pd:()=>new C(m("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Pe:()=>new C(m("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD",!1)),Pf:()=>new C(m("7F+6H+6HEddpuDCCFDDQEE",!1)),Pi:()=>new C(m("rFt7Ht7HDBBDaapuDCCFDDQEE",!1)),Po:()=>new C(m("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB",!1)),Ps:()=>new C(m("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB",!1)),S:()=>new C(m("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Sc:()=>new C(m("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC",!1)),Sk:()=>new C(m("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB",!1)),Sm:()=>new C(m("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB",!1)),So:()=>new C(m("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB",!1)),Z:()=>new C(m("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB",!1)),Zl:()=>new C(m("ohIA",!0)),Zp:()=>new C(m("phIA",!0)),Zs:()=>new C(m("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB",!1)),ASCII_Hex_Digit:()=>new C(m("wBJIFbF",!0)),Alphabetic:()=>new C(m("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Dash:()=>new C(m("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J",!1)),Emoji:()=>new C(m("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Emoji_Component:()=>new C(m("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB",!1)),Emoji_Modifier:()=>new C(m("7-8DE",!0)),Emoji_Modifier_Base:()=>new C(m("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB",!1)),Emoji_Presentation:()=>new C(m("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB",!1)),Extended_Pictographic:()=>new C(m("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB",!1)),Hex_Digit:()=>new C(m("wBJIFbFq1-BJIFbF",!0)),Lowercase:()=>new C(m("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB",!1)),Math:()=>new C(m("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB",!1)),Quotation_Mark:()=>new C(m("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB",!1)),Terminal_Punctuation:()=>new C(m("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB",!1)),Uppercase:()=>new C(m("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB",!1)),White_Space:()=>new C(m("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB",!1))})),M(zn,"SCRIPTS",new uu({Adlam:()=>new C(m("go6DrCFJFB",!0)),Ahom:()=>new C(m("g4lCaDOFW",!0)),Anatolian_Hieroglyphs:()=>new C(m("ggxCmS",!0)),Arabic:()=>new C(m("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB",!1)),Armenian:()=>new C(m("xpBlBDxBDCks9BE",!0)),Avestan:()=>new C(m("g4iC1BEG",!0)),Balinese:()=>new C(m("g4GsCCxB",!0)),Bamum:()=>new C(m("g1pB3CpowB4R",!0)),Bassa_Vah:()=>new C(m("w26CdDF",!0)),Batak:()=>new C(m("g+GzBJD",!0)),Bengali:()=>new C(m("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB",!1)),Beria_Erfe:()=>new C(m("g17CYDY",!0)),Bhaiksuki:()=>new C(m("ggnCICsBCNLc",!0)),Bopomofo:()=>new C(m("qXB6wLqBxDf",!0)),Brahmi:()=>new C(m("ggkCtCFjBKA",!0)),Braille:()=>new C(m("ggK-H",!0)),Buginese:()=>new C(m("gwGbDB",!0)),Buhid:()=>new C(m("g6FT",!0)),Canadian_Aboriginal:()=>new C(m("ggF-TxRlC7tgCP",!0)),Carian:()=>new C(m("g1gCwB",!0)),Caucasian_Albanian:()=>new C(m("wphCzBMA",!0)),Chakma:()=>new C(m("gokC0BCR",!0)),Cham:()=>new C(m("gwqB2BKNDJDD",!0)),Cherokee:()=>new C(m("g9E1CDFz7lBvC",!0)),Chorasmian:()=>new C(m("w9jCb",!0)),Common:()=>new C(m("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB",!1)),Coptic:()=>new C(m("ifNxkKzDGG",!0)),Cuneiform:()=>new C(m("ggoC5cnDuDCEMjG",!0)),Cypriot:()=>new C(m("ggiCFBDCCBqBBCBBEDD",!1)),Cypro_Minoan:()=>new C(m("w8rCiD",!0)),Cyrillic:()=>new C(m("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB",!1)),Deseret:()=>new C(m("gghCvC",!0)),Devanagari:()=>new C(m("goCwCFODZh7nBfhwcJ",!0)),Dives_Akuru:()=>new C(m("gomCGBDDDBGBCBBCdBCBBDLBKJB",!1)),Dogra:()=>new C(m("ggmC7B",!0)),Duployan:()=>new C(m("ggvDqDGMEIIJDD",!0)),Egyptian_Hieroglyphs:()=>new C(m("ggsC1iBL68D",!0)),Elbasan:()=>new C(m("gohCnB",!0)),Elymaic:()=>new C(m("g-jCW",!0)),Ethiopic:()=>new C(m("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB",!1)),Garay:()=>new C(m("gqjClBEcJB",!0)),Georgian:()=>new C(m("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG",!1)),Glagolitic:()=>new C(m("ggL-Ch9sDGCQDGCBCE",!0)),Gothic:()=>new C(m("w5gCa",!0)),Grantha:()=>new C(m("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB",!1)),Greek:()=>new C(m("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB",!1)),Gujarati:()=>new C(m("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB",!1)),Gunjala_Gondi:()=>new C(m("grnCFCBCkBCBCFIJ",!0)),Gurmukhi:()=>new C(m("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB",!1)),Gurung_Khema:()=>new C(m("go4C5B",!0)),Han:()=>new C(m("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB",!1)),Hangul:()=>new C(m("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC",!0)),Hanifi_Rohingya:()=>new C(m("gojCnBJJ",!0)),Hanunoo:()=>new C(m("g5FU",!0)),Hatran:()=>new C(m("gniCSCBGE",!0)),Hebrew:()=>new C(m("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB",!1)),Hiragana:()=>new C(m("hiM1CBHCBi7-C+IBTeeBBBulQAB",!1)),Imperial_Aramaic:()=>new C(m("giiCVCI",!0)),Inherited:()=>new C(m("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB",!1)),Inscriptional_Pahlavi:()=>new C(m("g7iCSGH",!0)),Inscriptional_Parthian:()=>new C(m("g6iCVDH",!0)),Javanese:()=>new C(m("gsqBtCDJFB",!0)),Kaithi:()=>new C(m("gkkCiCLA",!0)),Kannada:()=>new C(m("gkDMCCCWCJCEDICCCDIBGCCDDJCC",!0)),Katakana:()=>new C(m("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB",!1)),Kawi:()=>new C(m("g4nCQCoBEc",!0)),Kayah_Li:()=>new C(m("goqBtBCA",!0)),Kharoshthi:()=>new C(m("gwiCDCBGHCCCcDCFJII",!0)),Khitan_Small_Script:()=>new C(m("k-7C84G84GB0OBqBAB",!1)),Khmer:()=>new C(m("g8F9CDJHJnPf",!0)),Khojki:()=>new C(m("gwkCRCuB",!0)),Khudawadi:()=>new C(m("w1kC6BGJ",!0)),Kirat_Rai:()=>new C(m("gq7C5B",!0)),Lao:()=>new C(m("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB",!1)),Latin:()=>new C(m("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB",!1)),Lepcha:()=>new C(m("ggH3BEOEC",!0)),Limbu:()=>new C(m("goGeBCLBFLBFEEBKB",!1)),Linear_A:()=>new C(m("gwhC2JKVLH",!0)),Linear_B:()=>new C(m("gggCLCZCSCBCODNjB6D",!0)),Lisu:()=>new C(m("wmpBvBx1eA",!0)),Lycian:()=>new C(m("g0gCc",!0)),Lydian:()=>new C(m("gpiCZGA",!0)),Mahajani:()=>new C(m("wqkCmB",!0)),Makasar:()=>new C(m("g3nCY",!0)),Malayalam:()=>new C(m("goDMCCCyBCCCFFPDZ",!0)),Mandaic:()=>new C(m("giCbDA",!0)),Manichaean:()=>new C(m("g2iCmBFL",!0)),Marchen:()=>new C(m("wjnCfDVCN",!0)),Masaram_Gondi:()=>new C(m("gonCGBCBBCrBBECCBCCBHBJJB",!1)),Medefaidrin:()=>new C(m("gy7C6C",!0)),Meetei_Mayek:()=>new C(m("g3qBWqGtBDJ",!0)),Mende_Kikakui:()=>new C(m("gg6DkGDP",!0)),Meroitic_Cursive:()=>new C(m("gtiCXFTDtB",!0)),Meroitic_Hieroglyphs:()=>new C(m("gsiCf",!0)),Miao:()=>new C(m("g47CqCF4BIQ",!0)),Modi:()=>new C(m("gwlCkCMJ",!0)),Mongolian:()=>new C(m("ggGBBDCCBSBH4CBIqBB2t-BMB",!1)),Mro:()=>new C(m("gy6CeCJFB",!0)),Multani:()=>new C(m("g0kCGBCCCBCBCOBCKB",!1)),Myanmar:()=>new C(m("ggE-EhqmBeiDfxibT",!0)),Nabataean:()=>new C(m("gkiCeJI",!0)),Nag_Mundari:()=>new C(m("wm5DpB",!0)),Nandinagari:()=>new C(m("gtmCHDtBDK",!0)),New_Tai_Lue:()=>new C(m("gsGrBFZHKEB",!0)),Newa:()=>new C(m("gglC7CCE",!0)),Nko:()=>new C(m("g+B6BDC",!0)),Nushu:()=>new C(m("h-7CvsQvsQBqMB",!1)),Nyiakeng_Puachue_Hmong:()=>new C(m("go4DsBENDJFB",!0)),Ogham:()=>new C(m("g0Fc",!0)),Ol_Chiki:()=>new C(m("wiHvB",!0)),Ol_Onal:()=>new C(m("wu5DqBFA",!0)),Old_Hungarian:()=>new C(m("gkjCyBOyBIF",!0)),Old_Italic:()=>new C(m("g4gCjBKC",!0)),Old_North_Arabian:()=>new C(m("g0iCf",!0)),Old_Permic:()=>new C(m("w6gCqB",!0)),Old_Persian:()=>new C(m("g9gCjBFN",!0)),Old_Sogdian:()=>new C(m("g4jCnB",!0)),Old_South_Arabian:()=>new C(m("gziCf",!0)),Old_Turkic:()=>new C(m("ggjCoC",!0)),Old_Uyghur:()=>new C(m("w7jCZ",!0)),Oriya:()=>new C(m("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR",!0)),Osage:()=>new C(m("wlhCjBFjB",!0)),Osmanya:()=>new C(m("gkhCdDJ",!0)),Pahawh_Hmong:()=>new C(m("g46ClCLJCGCUGS",!0)),Palmyrene:()=>new C(m("gjiCf",!0)),Pau_Cin_Hau:()=>new C(m("g2mC4B",!0)),Phags_Pa:()=>new C(m("giqB3B",!0)),Phoenician:()=>new C(m("goiCbEA",!0)),Psalter_Pahlavi:()=>new C(m("g8iCRIDNG",!0)),Rejang:()=>new C(m("wpqBjBMA",!0)),Runic:()=>new C(m("g1FqCEK",!0)),Samaritan:()=>new C(m("ggCtBDO",!0)),Saurashtra:()=>new C(m("gkqBlCJL",!0)),Sharada:()=>new C(m("gskC-ChsCH",!0)),Shavian:()=>new C(m("wihCvB",!0)),Siddham:()=>new C(m("gslC1BDlB",!0)),Sidetic:()=>new C(m("gqiCZ",!0)),SignWriting:()=>new C(m("gg2DrUQECO",!0)),Sinhala:()=>new C(m("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB",!1)),Sogdian:()=>new C(m("w5jCpB",!0)),Sora_Sompeng:()=>new C(m("wmkCYIJ",!0)),Soyombo:()=>new C(m("wymCyC",!0)),Sundanese:()=>new C(m("g8G-BhIH",!0)),Sunuwar:()=>new C(m("g+mChBPJ",!0)),Syloti_Nagri:()=>new C(m("ggqBsB",!0)),Syriac:()=>new C(m("g4BNC7BDCxIK",!0)),Tagalog:()=>new C(m("g4FVKA",!0)),Tagbanwa:()=>new C(m("g7FMCCCB",!0)),Tai_Le:()=>new C(m("wqGdDE",!0)),Tai_Tham:()=>new C(m("gxG+BCcDKHJHN",!0)),Tai_Viet:()=>new C(m("g0qBiCZE",!0)),Tai_Yo:()=>new C(m("g25DeCVJB",!0)),Takri:()=>new C(m("g0lC5BHJ",!0)),Tamil:()=>new C(m("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB",!1)),Tangsa:()=>new C(m("wz6CuCCJ",!0)),Tangut:()=>new C(m("g-7CgBgBB+3GBhQeBiDyDB",!1)),Telugu:()=>new C(m("ggDMCCCWCPDICCCDIBCCCBDDDJII",!0)),Thaana:()=>new C(m("g8BxB",!0)),Thai:()=>new C(m("hwD5BGb",!0)),Tibetan:()=>new C(m("g4DnCCjBFmBCjBCOCGFB",!0)),Tifinagh:()=>new C(m("wpL3BIBPA",!0)),Tirhuta:()=>new C(m("gklCnCJJ",!0)),Todhri:()=>new C(m("guhCzB",!0)),Tolong_Siki:()=>new C(m("wtnCrBFJ",!0)),Toto:()=>new C(m("w04De",!0)),Tulu_Tigalari:()=>new C(m("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB",!1)),Ugaritic:()=>new C(m("g8gCdCA",!0)),Unknown:()=>new C(m("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB",!1)),Vai:()=>new C(m("gopBrJ",!0)),Vithkuqi:()=>new C(m("wrhCKCOCGCBCKCOCGCB",!0)),Wancho:()=>new C(m("g24D5BGA",!0)),Warang_Citi:()=>new C(m("glmCyCNA",!0)),Yezidi:()=>new C(m("g0jCpBCCDB",!0)),Yi:()=>new C(m("ggoBskBE2B",!0)),Zanabazar_Square:()=>new C(m("gwmCnC",!0))})),M(zn,"FOLD_CATEGORIES",new uu({L:()=>new C(m("laA",!0)),LC:()=>new C(m("laA",!0)),Ll:()=>new C(m("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Lt:()=>new C(m("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB",!1)),Lu:()=>new C(m("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1)),M:()=>new C(m("5cgBgBlgHAB",!1)),Mn:()=>new C(m("5cgBgBlgHAB",!1)),Emoji:()=>new C(m("8mJA",!0)),Extended_Pictographic:()=>new C(m("8mJA",!0)),Lowercase:()=>new C(m("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB",!1)),Math:()=>new C(m("ycGDCHHFMMDDDCHHFAB",!1)),Uppercase:()=>new C(m("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB",!1))})),M(zn,"FOLD_SCRIPT",new uu({Common:()=>new C(m("8cgBgB",!1)),Greek:()=>new C(m("1FwUwU",!1)),Inherited:()=>new C(m("5cgBgBlgHAB",!1))})),zn),me,z=(me=class{static isUnsearchable(e){return e===me.RUNE_ERROR||e>=me.MIN_HIGH_SURROGATE&&e<=me.MAX_LOW_SURROGATE}static is32(e,t){let r=0,s=e.length;for(;r<s;){let i=r+Math.floor((s-r)/2),o=e.getLo(i),u=e.getHi(i);if(o<=t&&t<=u){let c=e.getStride(i);return(t-o)%c===0}t<o?s=i:r=i+1}return!1}static is(e,t){if(t<=me.MAX_LATIN1){for(let r=0;r<e.length;r++){if(t>e.getHi(r))continue;let s=e.getLo(r);if(t<s)return!1;let i=e.getStride(r);return(t-s)%i===0}return!1}return e.length>0&&t>=e.getLo(0)&&me.is32(e,t)}static isPrint(e){return e<=me.MAX_LATIN1?e>=32&&e<me.MAX_ASCII||e>=161&&e!==173:me.is(wt.Print,e)}static simpleFold(e){if(wt.CASE_ORBIT.has(e))return wt.CASE_ORBIT.get(e);if(e<=me.MAX_ASCII){let t=k.toLowerCase(e);return t!==e?t:k.toUpperCase(e)}return e}static equalsIgnoreCase(e,t){if(e===t)return!0;if(e<0||t<0)return!1;if(e<=me.MAX_ASCII&&t<=me.MAX_ASCII)return 65<=e&&e<=90&&(e|=32),65<=t&&t<=90&&(t|=32),e===t;for(let r=me.simpleFold(e);r!==e;r=me.simpleFold(r))if(r===t)return!0;return!1}},M(me,"MAX_RUNE",1114111),M(me,"RUNE_ERROR",65533),M(me,"MAX_ASCII",127),M(me,"MAX_LATIN1",255),M(me,"MAX_BMP",65535),M(me,"MIN_FOLD",65),M(me,"MAX_FOLD",125251),M(me,"MIN_HIGH_SURROGATE",55296),M(me,"MAX_HIGH_SURROGATE",56319),M(me,"MIN_LOW_SURROGATE",56320),M(me,"MAX_LOW_SURROGATE",57343),M(me,"MIN_SUPPLEMENTARY_CODE_POINT",65536),me),Ih=256,dm=new Uint8Array(Ih);for(let n=0;n<Ih;n++)dm[n]=97<=n&&n<=122||65<=n&&n<=90||48<=n&&n<=57||n===95?1:0;var ph=null,gh=null,ve,K=(ve=class{static emptyInts(){return[]}static isByteArray(e){return Array.isArray(e)||Object.prototype.toString.call(e)==="[object Uint8Array]"}static isalnum(e){return k.CODES[0]<=e&&e<=k.CODES[9]||k.CODES.a<=e&&e<=k.CODES.z||k.CODES.A<=e&&e<=k.CODES.Z}static unhex(e){return k.CODES[0]<=e&&e<=k.CODES[9]?e-k.CODES[0]:k.CODES.a<=e&&e<=k.CODES.f?e-k.CODES.a+10:k.CODES.A<=e&&e<=k.CODES.F?e-k.CODES.A+10:-1}static escapeRune(e){let t="";if(z.isPrint(e))ve.METACHARACTERS.indexOf(String.fromCodePoint(e))>=0&&(t+="\\"),t+=String.fromCodePoint(e);else switch(e){case k.CODES['"']:t+='\\"';break;case k.CODES["\\"]:t+="\\\\";break;case k.CODES["	"]:t+="\\t";break;case k.CODES[`
`]:t+="\\n";break;case k.CODES["\r"]:t+="\\r";break;case k.CODES["\b"]:t+="\\b";break;case k.CODES["\f"]:t+="\\f";break;default:{let r=e.toString(16);e<256?(t+="\\x",r.length===1&&(t+="0"),t+=r):t+=`\\x{${r}}`;break}}return t}static stringToRunes(e){let t=String(e),r=[],s=0;for(;s<t.length;){let i=t.codePointAt(s);r.push(i),s+=i>z.MAX_BMP?2:1}return new Int32Array(r)}static runeToString(e){return String.fromCodePoint(e)}static isWordRune(e){return e<Ih?dm[e]===1:!1}static emptyOpContext(e,t){let r=0;return e<0&&(r|=ve.EMPTY_BEGIN_TEXT|ve.EMPTY_BEGIN_LINE),e===10&&(r|=ve.EMPTY_BEGIN_LINE),t<0&&(r|=ve.EMPTY_END_TEXT|ve.EMPTY_END_LINE),t===10&&(r|=ve.EMPTY_END_LINE),ve.isWordRune(e)!==ve.isWordRune(t)?r|=ve.EMPTY_WORD_BOUNDARY:r|=ve.EMPTY_NO_WORD_BOUNDARY,r}static quoteMeta(e){return e.split("").map(t=>ve.METACHARACTERS.indexOf(t)>=0?`\\${t}`:t).join("")}static charCount(e){return e>z.MAX_BMP?2:1}static toArray(e){let t=e.length,r=new Array(t);for(let s=0;s<t;s++)r[s]=e[s];return r}static stringToUtf8ByteArray(e){if(globalThis.TextEncoder)return ph||(ph=new TextEncoder),ph.encode(e);{let t=[],r=0;for(let s=0;s<e.length;s++){let i=e.charCodeAt(s);i<128?t[r++]=i:i<2048?(t[r++]=i>>6|192,t[r++]=i&63|128):(i&64512)===z.MIN_HIGH_SURROGATE&&s+1<e.length&&(e.charCodeAt(s+1)&64512)===z.MIN_LOW_SURROGATE?(i=z.MIN_SUPPLEMENTARY_CODE_POINT+((i&1023)<<10)+(e.charCodeAt(++s)&1023),t[r++]=i>>18|240,t[r++]=i>>12&63|128,t[r++]=i>>6&63|128,t[r++]=i&63|128):(t[r++]=i>>12|224,t[r++]=i>>6&63|128,t[r++]=i&63|128)}return t}}static utf8ByteArrayToString(e){if(globalThis.TextDecoder){gh||(gh=new TextDecoder("utf-8"));let t=e instanceof Uint8Array?e:new Uint8Array(e);return gh.decode(t)}else{let t=[],r=0,s=0;for(;r<e.length;){let i=e[r++];if(i<128)t[s++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[r++];t[s++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[r++],u=e[r++],c=e[r++],l=((i&7)<<18|(o&63)<<12|(u&63)<<6|c&63)-z.MIN_SUPPLEMENTARY_CODE_POINT;t[s++]=String.fromCharCode(z.MIN_HIGH_SURROGATE+(l>>10)),t[s++]=String.fromCharCode(z.MIN_LOW_SURROGATE+(l&1023))}else{let o=e[r++],u=e[r++];t[s++]=String.fromCharCode((i&15)<<12|(o&63)<<6|u&63)}}return t.join("")}}},M(ve,"METACHARACTERS","\\.+*?()|[]{}^$"),M(ve,"EMPTY_BEGIN_LINE",1),M(ve,"EMPTY_END_LINE",2),M(ve,"EMPTY_BEGIN_TEXT",4),M(ve,"EMPTY_END_TEXT",8),M(ve,"EMPTY_WORD_BOUNDARY",16),M(ve,"EMPTY_NO_WORD_BOUNDARY",32),M(ve,"EMPTY_ALL",-1),ve),pm=(n=[],e=0)=>{let t=Object.create(null);for(let r=0;r<n.length;r++){let s=n[r],i=e+r;t[s]=i,t[i]=s}return Object.freeze(t)},Wn,br=(Wn=class{getEncoding(){throw Error("not implemented")}asCharSequence(){throw Error("not implemented")}asBytes(){throw Error("not implemented")}length(){throw Error("not implemented")}isUTF8Encoding(){return this.getEncoding()===Wn.Encoding.UTF_8}isUTF16Encoding(){return this.getEncoding()===Wn.Encoding.UTF_16}},M(Wn,"Encoding",pm(["UTF_16","UTF_8"])),Wn),LC=class extends br{constructor(n=null){super(),this.bytes=n}getEncoding(){return br.Encoding.UTF_8}asCharSequence(){return K.utf8ByteArrayToString(this.bytes)}asBytes(){return this.bytes}length(){return this.bytes.length}},DT=class extends br{constructor(n=null){super(),this.charSequence=n}getEncoding(){return br.Encoding.UTF_16}asCharSequence(){return this.charSequence}asBytes(){return K.stringToUtf8ByteArray(this.charSequence.toString())}length(){return this.charSequence.length}},Dr=class{static utf16(n){return new DT(n)}static utf8(n){return K.isByteArray(n)?new LC(n):new LC(K.stringToUtf8ByteArray(n))}},Bt=class{static EOF(){return-8}constructor(){this.start=0,this.end=0}canCheckPrefix(){return!0}endPos(){return this.end-this.start}hasString(){return!1}hasAnyString(){return!1}prefixLength(){return 0}},Gt,TT=(Gt=class extends Bt{constructor(e,t=0,r=e.length){super(),this.bytes=e,this.start=t,this.end=r}hasString(e,t){let r=e.bytes;if(r.length===0)return!0;let s=this.indexOf(this.bytes,r,this.start+t);return s!==-1&&s<=this.end-r.length}hasAnyString(e,t){return e.automaton8().searchUTF8(this.bytes,this.start+t,this.end)}step(e){if(e+=this.start,e>=this.end)return Bt.EOF();let t=this.bytes[e]&255;if(t<128)return t<<3|1;let r,s,i=128,o=191;if(t>=194&&t<=223)r=2,s=t&31;else if(t>=224&&t<=239)r=3,s=t&15,t===224?i=160:t===237&&(o=159);else if(t>=240&&t<=244)r=4,s=t&7,t===240?i=144:t===244&&(o=143);else return Gt.RUNE_ERROR_STEP;if(e+r>this.end)return Gt.RUNE_ERROR_STEP;let u=this.bytes[e+1]&255;if(u<i||u>o)return Gt.RUNE_ERROR_STEP;if(s=s<<6|u&63,r>2){let c=this.bytes[e+2]&255;if((c&192)!==128)return Gt.RUNE_ERROR_STEP;if(s=s<<6|c&63,r>3){let l=this.bytes[e+3]&255;if((l&192)!==128)return Gt.RUNE_ERROR_STEP;s=s<<6|l&63}}return s<<3|r}index(e,t){t+=this.start;let r=this.indexOf(this.bytes,e.prefixUTF8,t);return r<0?r:r-t}context(e){e+=this.start;let t=-1;if(e>this.start&&e<=this.end){let s=e-1;if(t=this.bytes[s--],t>=128){let i=e-4;for(i<this.start&&(i=this.start);s>=i&&(this.bytes[s]&192)===128;)s--;s<this.start&&(s=this.start);let o=this.step(s-this.start);t=s+(o&7)===e?o>>3:z.RUNE_ERROR}}let r=e<this.end?this.step(e-this.start)>>3:-1;return K.emptyOpContext(t,r)}indexOf(e,t,r=0){let s=t.length;if(s===0)return r<=this.end?r:-1;let i=t[0],o=this.end-s,u=typeof e.indexOf=="function",c=r;for(;c<=o;){if(u){if(c=e.indexOf(i,c),c===-1||c>o)return-1}else{for(;c<=o&&e[c]!==i;)c++;if(c>o)return-1}let l=!0;for(let B=1;B<s;B++)if(e[c+B]!==t[B]){l=!1;break}if(l)return c;c++}return-1}prefixLength(e){return e.prefixUTF8.length}},M(Gt,"RUNE_ERROR_STEP",z.RUNE_ERROR<<3|1),Gt),AT=class extends Bt{constructor(n,e=0,t=n.length){super(),this.charSequence=n,this.start=e,this.end=t}hasString(n,e){let t=this.charSequence.indexOf(n.str,this.start+e);return t!==-1&&t<=this.end-n.str.length}hasAnyString(n,e){return n.automaton16().searchUTF16(this.charSequence,this.start+e,this.end)}step(n){if(n+=this.start,n>=this.end)return Bt.EOF();let e=this.charSequence.charCodeAt(n);if(e<z.MIN_HIGH_SURROGATE||e>z.MAX_HIGH_SURROGATE||n+1>=this.end)return e<<3|1;let t=this.charSequence.charCodeAt(n+1);return t>=z.MIN_LOW_SURROGATE&&t<=z.MAX_LOW_SURROGATE?(e-z.MIN_HIGH_SURROGATE)*1024+(t-z.MIN_LOW_SURROGATE)+z.MIN_SUPPLEMENTARY_CODE_POINT<<3|2:e<<3|1}index(n,e){e+=this.start;let t=this.charSequence.indexOf(n.prefix,e);return t<0||t>this.end-n.prefix.length?-1:t-e}context(n){n+=this.start;let e=n>this.start&&n<=this.end?this.charSequence.charCodeAt(n-1):-1,t=n<this.end?this.charSequence.charCodeAt(n):-1;return K.emptyOpContext(e,t)}prefixLength(n){return n.prefix.length}},we=class{static fromUTF8(n,e=0,t=n.length){return new TT(n,e,t)}static fromUTF16(n,e=0,t=n.length){return new AT(n,e,t)}},to=class extends Error{constructor(n){super(n),this.name="RE2JSException"}},De=class extends to{constructor(n,e=null){let t=`error parsing regexp: ${n}`;e&&(t+=`: \`${e}\``),super(t),this.name="RE2JSSyntaxException",this.message=t,this.error=n,this.input=e}getDescription(){return this.error}getPattern(){return this.input}},Zi=class extends to{constructor(n){super(n),this.name="RE2JSCompileException"}},mt=class extends to{constructor(n){super(n),this.name="RE2JSGroupException"}},bT=class extends to{constructor(n){super(n),this.name="RE2JSFlagsException"}},du=class extends to{constructor(n){super(n),this.name="RE2JSInternalException"}},Tr,VC=(Tr=class{static quoteReplacement(e,t=!1){return t?e.indexOf("\\")<0&&e.indexOf("$")<0?e:e.split("").map(r=>{let s=r.codePointAt(0);return s===k.CODES["\\"]||s===k.CODES.$?`\\${r}`:r}).join(""):e.indexOf("$")<0?e:e.split("").map(r=>r.codePointAt(0)===k.CODES.$?"$$":r).join("")}constructor(e,t){if(e===null)throw new Error("pattern is null");this.patternInput=e;let r=this.patternInput.re2();this.patternGroupCount=r.numberOfCapturingGroups(),this.groups=[],this.namedGroups=r.namedGroups,this.hasNamedGroups=Object.keys(this.namedGroups).length>0,this.numberOfInstructions=r.numberOfInstructions(),this.lookbehindState=null,t instanceof br?this.resetMatcherInput(t):K.isByteArray(t)?this.resetMatcherInput(Dr.utf8(t)):this.resetMatcherInput(Dr.utf16(t))}pattern(){return this.patternInput}reset(){return this.matcherInputLength=this.matcherInput.length(),this.appendPos=0,this.hasMatch=!1,this.hasGroups=!1,this.anchorFlag=0,this}resetMatcherInput(e){if(e===null)throw new Error("input is null");return e instanceof br||(K.isByteArray(e)?e=Dr.utf8(e):e=Dr.utf16(e)),this.matcherInput=e,this.lookbehindState!==null?this.lookbehindState.reset():this.lookbehindState=this.patternInput.re2().createLookbehindState(),this.reset(),this}start(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new mt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e]}end(e=0){if(typeof e=="string"){let t=this.namedGroups[e];if(!Number.isFinite(t))throw new mt(`group '${e}' not found`);e=t}return this.loadGroup(e),this.groups[2*e+1]}programSize(){return this.numberOfInstructions}group(e=0){if(typeof e=="string"){let s=this.namedGroups[e];if(!Number.isFinite(s))throw new mt(`group '${e}' not found`);e=s}let t=this.start(e),r=this.end(e);return t<0&&r<0?null:this.substring(t,r)}getNamedGroups(){if(!this.hasMatch)throw new mt("perhaps no match attempted");let e=Object.create(null);for(let t of Object.keys(this.namedGroups))e[t]=this.group(t);return e}groupCount(){return this.patternGroupCount}loadGroup(e){if(!Number.isInteger(e)||e<0||e>this.patternGroupCount)throw new mt(`Group index out of bounds: ${e}`);if(!this.hasMatch)throw new mt("perhaps no match attempted");if(e===0||this.hasGroups)return;let t=this.matcherInputLength,r=this.patternInput.re2().matchMachineInput(this.matcherInput,this.groups[0],t,this.anchorFlag,1+this.patternGroupCount,this.lookbehindState);if(!r[0])throw new mt("inconsistency in matching group data");this.groups=r[1],this.hasGroups=!0}matches(){return this.genMatch(0,F.ANCHOR_BOTH)}lookingAt(){return this.genMatch(0,F.ANCHOR_START)}find(e=null){if(e!==null){if(!Number.isInteger(e)||e<0||e>this.matcherInputLength)throw new mt(`start index out of bounds: ${e}`);return this.reset(),this.genMatch(e,0)}if(e=0,this.hasMatch&&(e=this.groups[1],this.groups[0]===this.groups[1])){let t=(this.matcherInput.isUTF16Encoding()?we.fromUTF16(this.matcherInput.asCharSequence(),0,this.matcherInputLength):we.fromUTF8(this.matcherInput.asBytes(),0,this.matcherInputLength)).step(e);t<0?e++:e+=t&7}return this.genMatch(e,F.UNANCHORED)}genMatch(e,t){let r=this.patternInput.re2().matchMachineInput(this.matcherInput,e,this.matcherInputLength,t,1,this.lookbehindState);return r[0]?(this.groups=r[1],this.hasMatch=!0,this.hasGroups=this.patternGroupCount===0,this.anchorFlag=t,!0):(this.hasMatch=!1,!1)}substring(e,t){return this.matcherInput.isUTF8Encoding()?K.utf8ByteArrayToString(this.matcherInput.asBytes().slice(e,t)):this.matcherInput.asCharSequence().substring(e,t).toString()}inputLength(){return this.matcherInputLength}appendReplacement(e,t=!1){let r="",s=this.start(),i=this.end();return this.appendPos<s&&(r+=this.substring(this.appendPos,s)),this.appendPos=i,r+=t?this.appendReplacementInternalJava(e):this.appendReplacementInternalJs(e),r}appendReplacementInternalJava(e){let t="",r=0,s=e.length,i=0;for(;i<s;){let o=e.codePointAt(i);if(o===k.CODES["\\"]){if(r<i&&(t+=e.substring(r,i)),i++,i>=s)throw new mt("character to be escaped is missing");r=i,i++;continue}if(o===k.CODES.$){if(r<i&&(t+=e.substring(r,i)),i+1>=s)throw new mt("Illegal group reference: group index is missing");let u=e.codePointAt(i+1);if(k.CODES[0]<=u&&u<=k.CODES[9]){let c=u-k.CODES[0],l=i+2;for(;l<s;l++){let d=e.codePointAt(l);if(d<k.CODES[0]||d>k.CODES[9]||c*10+d-k.CODES[0]>this.patternGroupCount)break;c=c*10+d-k.CODES[0]}if(c>this.patternGroupCount)throw new mt(`n > number of groups: ${c}`);let B=this.group(c);B!==null&&(t+=B),i=l,r=i}else if(u===k.CODES["{"]){let c=i+2;for(;c<s&&e.codePointAt(c)!==k.CODES["}"];)c++;if(c>=s)throw new mt("named capture group is missing trailing '}'");let l=e.substring(i+2,c),B=this.group(l);B!==null&&(t+=B),i=c+1,r=i}else throw new mt("Illegal group reference");continue}i++}return r<s&&(t+=e.substring(r,s)),t}appendReplacementInternalJs(e){let t=o=>o>=48&&o<=57,r=this.patternGroupCount,s="",i=0;for(;i<e.length;){let o=e.indexOf("$",i);if(o<0)break;s+=e.substring(i,o),i=o;let u=e.charCodeAt(i+1);if(u===k.CODES.$)s+="$",i+=2;else if(u===k.CODES["&"])s+=this.group(0),i+=2;else if(u===k.CODES["`"])s+=this.substring(0,this.start(0)),i+=2;else if(u===k.CODES["'"])s+=this.substring(this.end(0),this.matcherInputLength),i+=2;else if(t(u)){let c=1,l=u-48,B=e.charCodeAt(i+2);if(t(B)&&l*10+B-48<=r&&(c=2,l=l*10+B-48),l>=1&&l<=r){let d=this.group(l);d!==null&&(s+=d)}else s+=e.substring(i,i+1+c);i+=1+c}else if(u===k.CODES["<"]&&this.hasNamedGroups){let c=e.indexOf(">",i+2);if(c<0)s+="$<",i+=2;else{let l=e.substring(i+2,c);if(Object.prototype.hasOwnProperty.call(this.namedGroups,l)){let B=this.group(l);B!==null&&(s+=B)}i=c+1}}else s+="$",i+=1}return s+e.substring(i)}appendTail(){return this.substring(this.appendPos,this.matcherInputLength)}replaceAll(e,t=!1){return this.replace(e,!0,t)}replaceFirst(e,t=!1){return this.replace(e,!1,t)}replace(e,t=!0,r=!1){let s="";this.reset();let i=typeof e=="function",o=null;if(i){if(this.groupCount()>=Tr.MAX_REPLACER_ARGS)throw new mt("Too many capture groups to safely invoke replacer function");o=this.matcherInput.isUTF8Encoding()?this.matcherInput.asBytes():this.matcherInput.asCharSequence()}for(;this.find()&&(s+=i?this.appendReplacementFunc(e,o):this.appendReplacement(e,r),!!t););return s+=this.appendTail(),s}appendReplacementFunc(e,t){let r="",s=this.start(),i=this.end();this.appendPos<s&&(r+=this.substring(this.appendPos,s)),this.appendPos=i;let o=this.matchArray();return o.push(s,t),this.hasNamedGroups&&o.push(this.namedGroupsObject()),r+=String(e(...o)),r}matchArray(){let e=[this.group(0)];for(let t=1;t<=this.patternGroupCount;t++){let r=this.group(t);e.push(r===null?void 0:r)}return e}namedGroupsObject(){if(!this.hasNamedGroups)return;let e=this.getNamedGroups();for(let t in e)e[t]===null&&(e[t]=void 0);return e}},M(Tr,"MAX_REPLACER_ARGS",65535),Tr),he,O=(he=class{static isRuneOp(e){return he.RUNE<=e&&e<=he.RUNE_ANY_NOT_NL}static escapeRunes(e){let t='"';for(let r of e)t+=K.escapeRune(r);return t+='"',t}constructor(e){this.op=e,this.out=0,this.arg=0,this.runes=new Int32Array(0),this.next=null}matchRune(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&F.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e):e===o}let t=this.runes.length;if(t===0)return!1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return!1;if(e<=this.runes[o+1])return!0}return!1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]}matchRunePos(e){if(this.runes.length===1){let o=this.runes[0];return(this.arg&F.FOLD_CASE)!==0?z.equalsIgnoreCase(o,e)?0:-1:e===o?0:-1}let t=this.runes.length;if(t===0)return-1;if(t===2||t===4||t===6||t===8){for(let o=0;o<t;o+=2){if(e<this.runes[o])return-1;if(e<=this.runes[o+1])return Math.floor(o/2)}return-1}let r=0,s=t>>1;for(;s>1;){let o=s>>1;r+=this.runes[r+o<<1]<=e?o:0,s-=o}r+=this.runes[r<<1]<=e?1:0;let i=r-1;return i>=0&&e<=this.runes[i<<1|1]?i:-1}toString(){switch(this.op){case he.ALT:return`alt -> ${this.out}, ${this.arg}`;case he.ALT_MATCH:return`altmatch -> ${this.out}, ${this.arg}`;case he.CAPTURE:return`cap ${this.arg} -> ${this.out}`;case he.EMPTY_WIDTH:return`empty ${this.arg} -> ${this.out}`;case he.MATCH:return`match${this.arg!==0?` ${this.arg}`:""}`;case he.FAIL:return"fail";case he.NOP:return`nop -> ${this.out}`;case he.LB_WRITE:return`lbwrite ${this.arg} -> ${this.out}`;case he.LB_CHECK:return`lbcheck ${this.arg} -> ${this.out}`;case he.RUNE:return this.runes===null?"rune <null>":["rune ",he.escapeRunes(this.runes),(this.arg&F.FOLD_CASE)!==0?"/i":""," -> ",this.out].join("");case he.RUNE1:return`rune1 ${he.escapeRunes(this.runes)} -> ${this.out}`;case he.RUNE_ANY:return`any -> ${this.out}`;case he.RUNE_ANY_NOT_NL:return`anynotnl -> ${this.out}`;default:throw new Error("unhandled case in Inst.toString")}}},M(he,"ALT",1),M(he,"ALT_MATCH",2),M(he,"CAPTURE",3),M(he,"EMPTY_WIDTH",4),M(he,"FAIL",5),M(he,"MATCH",6),M(he,"NOP",7),M(he,"RUNE",8),M(he,"RUNE1",9),M(he,"RUNE_ANY",10),M(he,"RUNE_ANY_NOT_NL",11),M(he,"LB_WRITE",12),M(he,"LB_CHECK",13),he),Ar,MC=(Ar=class{constructor(e){this.sparse=new Int32Array(e),this.densePcs=new Int32Array(e),this.denseCaps=null,this.size=0,this.ncap=0,this.mainThreads=0}init(e){this.ncap=e;let t=Math.min(this.densePcs.length,Ar.INITIAL_THREADS)*e;(!this.denseCaps||this.denseCaps.length<t)&&(this.denseCaps=new Int32Array(t))}growCaps(e){let t=this.densePcs.length*this.ncap,r=new Int32Array(Math.min(t,Math.max(e,2*this.denseCaps.length)));r.set(this.denseCaps),this.denseCaps=r}contains(e){let t=this.sparse[e];return t<this.size&&this.densePcs[t]===e}isEmpty(){return this.size===0}add(e){let t=this.size++;return this.sparse[e]=t,this.densePcs[t]=e,t}clear(){this.size=0,this.mainThreads=0}toString(){let e="{";for(let t=0;t<this.size;t++)t!==0&&(e+=", "),e+=this.densePcs[t];return e+="}",e}},M(Ar,"INITIAL_THREADS",32),Ar),vT=class{constructor(n){this.pos=-1,this.pcs=new Int32Array(n.numInst()),this.size=0,this.lbTable=new Int32Array(n.numLb+1)}reset(){this.pos=-1,this.size=0}},gm=class Cm{static fromRE2(e){let t=new Cm;return t.prog=e.prog,t.re2=e,t.q0=new MC(t.prog.numInst()),t.q1=new MC(t.prog.numInst()),t.addStack=new Int32Array(2*(t.prog.numInst()+1)),t.matched=!1,t.matchcap=new Int32Array(t.prog.numCap<2?2:t.prog.numCap),t.ncap=0,t}constructor(){this.prog=null,this.re2=null,this.q0=null,this.q1=null,this.addStack=null,this.matched=!1,this.matchcap=null,this.ncap=0,this.lbTable=null}init(e){this.ncap=e,e>this.matchcap.length?this.matchcap=new Int32Array(e).fill(-1):this.matchcap.fill(-1),this.q0.init(e),this.q1.init(e),this.prog.numLb>0&&((!this.lbTable||this.lbTable.length<this.prog.numLb+1)&&(this.lbTable=new Int32Array(this.prog.numLb+1)),this.lbTable.fill(-1))}submatches(){return this.ncap===0?K.emptyInts():K.toArray(this.matchcap.subarray(0,this.ncap))}match(e,t,r,s=null){let i=this.re2.cond;if(i===K.EMPTY_ALL||(r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&t!==0)return!1;this.matched=!1,this.matchcap.fill(-1);let o=this.prog.numLb>0,u=t,c=t,l=!1;o&&(s!==null&&s.pos>=0&&s.pos<=t?(c=s.pos,l=!0):c=0);let B=o&&s!==null,d=this.q0,g=this.q1,w=e.step(c),D=w>>3,P=w&7,V=-1,j=0;w!==Bt.EOF()&&(w=e.step(c+P),V=w>>3,j=w&7);let Q;for(c===0?Q=K.emptyOpContext(-1,D):Q=e.context(c),o&&(l?this.restoreLookbehinds(s,d,Q):this.spawnLookbehinds(d,c,Q));;){if(d.mainThreads===0){if((i&K.EMPTY_BEGIN_TEXT)!==0&&c!==0||(r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&c!==0||this.matched)break;if(this.prog.numLb===0&&d.isEmpty()&&this.re2.prefix.length!==0&&V!==this.re2.prefixRune&&e.canCheckPrefix()){let Oe=e.index(this.re2,c);if(Oe<0)break;c+=Oe,w=e.step(c),D=w>>3,P=w&7,w=e.step(c+P),V=w>>3,j=w&7,Q=e.context(c)}}c>=u&&(B&&(this.saveLookbehinds(s,d,c),B=!1),!this.matched&&(c===0||r===F.UNANCHORED)&&(this.ncap>0&&(this.matchcap[0]=c),this.add(d,this.prog.start,c,this.matchcap,0,Q)));let re=c+P;if(Q=e.context(re),this.step(d,g,c,re,D,Q,r,c===e.endPos()),P===0||this.ncap===0&&this.matched)break;c+=P,D=V,P=j,D!==-1&&(w=e.step(c+P),V=w>>3,j=w&7);let ue=d;d=g,g=ue}return d.clear(),g.clear(),this.matched}matchSet(e,t,r){let s=this.re2.cond;if(s===K.EMPTY_ALL)return[];if((r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&t!==0)return[];let i=this.prog.numLb>0?0:t,o=t,u=this.q0,c=this.q1,l=e.step(i),B=l>>3,d=l&7,g=-1,w=0;l!==Bt.EOF()&&(l=e.step(i+d),g=l>>3,w=l&7);let D=i===0?K.emptyOpContext(-1,B):e.context(i),P=new Set;for(this.prog.numLb>0&&this.spawnLookbehinds(u,i,D);!(u.mainThreads===0&&((s&K.EMPTY_BEGIN_TEXT)!==0&&i!==0||(r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&i!==0));){(i===0||r===F.UNANCHORED)&&i>=o&&this.add(u,this.prog.start,i,this.matchcap,0,D);let V=i+d;D=e.context(V);for(let Q=0;Q<u.size;Q++){let re=u.densePcs[Q],ue=this.prog.inst[re],Oe=Q*this.ncap,Ee=!1;switch(ue.op){case O.MATCH:if(r===F.ANCHOR_BOTH&&i!==e.endPos())break;P.add(ue.arg);break;case O.RUNE:Ee=ue.matchRune(B);break;case O.RUNE1:Ee=B===ue.runes[0];break;case O.RUNE_ANY:Ee=!0;break;case O.RUNE_ANY_NOT_NL:Ee=B!==10;break;default:continue}Ee&&this.add(c,ue.out,V,u.denseCaps,Oe,D)}if(u.clear(),d===0)break;i+=d,B=g,d=w,B!==-1&&(l=e.step(i+d),g=l>>3,w=l&7);let j=u;u=c,c=j}return c.clear(),Array.from(P).sort((V,j)=>V-j)}step(e,t,r,s,i,o,u,c){let l=this.re2.longest;for(let B=0;B<e.size;B++){let d=e.densePcs[B],g=B*this.ncap;if(l&&this.matched&&this.ncap>0&&this.matchcap[0]<e.denseCaps[g])continue;let w=this.prog.inst[d],D=!1;switch(w.op){case O.MATCH:if(u===F.ANCHOR_BOTH&&!c)break;if(this.ncap>0&&(!l||!this.matched||this.matchcap[1]<r)){e.denseCaps[g+1]=r;for(let P=0;P<this.ncap;P++)this.matchcap[P]=e.denseCaps[g+P]}l||(e.size=0),this.matched=!0;break;case O.RUNE:D=w.matchRune(i);break;case O.RUNE1:D=i===w.runes[0];break;case O.RUNE_ANY:D=!0;break;case O.RUNE_ANY_NOT_NL:D=i!==10;break;default:continue}D&&this.add(t,w.out,s,e.denseCaps,g,o)}e.clear()}spawnLookbehinds(e,t,r){for(let s=0;s<this.prog.lbStarts.length;s++)this.add(e,this.prog.lbStarts[s],t,this.matchcap,0,r)}restoreLookbehinds(e,t,r){this.lbTable.set(e.lbTable);for(let s=0;s<e.size;s++)this.add(t,e.pcs[s],e.pos,this.matchcap,0,r)}saveLookbehinds(e,t,r){let s=0;for(let i=0;i<t.size;i++){let o=t.densePcs[i];this.prog.lbInst[o]===1&&O.isRuneOp(this.prog.inst[o].op)&&(e.pcs[s++]=o)}e.size=s,e.pos=r,e.lbTable.set(this.lbTable)}add(e,t,r,s,i,o){let u=this.addStack,c=0;for(;;){for(;t!==0&&!e.contains(t);){let B=e.add(t),d=this.prog.inst[t];switch(d.op){case O.FAIL:t=0;break;case O.ALT:case O.ALT_MATCH:u[c++]=d.arg,u[c++]=0,t=d.out;break;case O.EMPTY_WIDTH:t=(d.arg&~o)===0?d.out:0;break;case O.NOP:t=d.out;break;case O.CAPTURE:d.arg<this.ncap&&(u[c++]=-d.arg-1,u[c++]=s[i+d.arg],s[i+d.arg]=r),t=d.out;break;case O.LB_WRITE:this.lbTable[Math.abs(d.arg)]=r,t=d.out;break;case O.LB_CHECK:d.arg>0?t=this.lbTable[d.arg]===r?d.out:0:t=this.lbTable[-d.arg]!==r?d.out:0;break;case O.MATCH:case O.RUNE:case O.RUNE1:case O.RUNE_ANY:case O.RUNE_ANY_NOT_NL:if(this.prog.lbInst[t]===0&&e.mainThreads++,this.ncap>0){let g=B*this.ncap;g+this.ncap>e.denseCaps.length&&e.growCaps(g+this.ncap);for(let w=0;w<this.ncap;w++)e.denseCaps[g+w]=s[i+w]}t=0;break;default:throw new du("unhandled")}}if(c===0)return;c-=2;let l=u[c];l<0?(s[i-l-1]=u[c+1],t=0):t=l}}},RT=(n,e,t)=>{let r=-2128831035;for(let s=0;s<n.length;s++)r^=n[s],r=Math.imul(r,16777619);r^=e,r=Math.imul(r,16777619);for(let s=0;s<t.length;s++)r^=t[s],r=Math.imul(r,16777619);return r},UC=(n,e)=>{if(n.length!==e.length)return!1;for(let t=0;t<n.length;t++)if(n[t]!==e[t])return!1;return!0},GC=(n,e,t,r)=>n.flag===t&&UC(n.nfaStates,e)&&UC(n.matchIDs,r),Ch=[],Yi=-1,cu=class{constructor(n,e,t){this.nfaStates=n,this.flag=e,this.isMatch=(e&Dh.FLAG_MATCH)!==0,this.matchIDs=t,this.next=null,this.nextAnchored=null}},ge,Dh=(ge=class{constructor(e,t=8388608){this.prog=e,this.maxMem=t,this.stateCache=new Map,this.stateCount=0,this.startStates=new Map,this.failed=!1;for(let r=0;r<e.numInst();r++){let s=e.getInst(r).op;if(s===O.LB_WRITE||s===O.LB_CHECK){this.failed=!0;break}}this.computeRuneClasses(),this.stateBudget=t,this.memBudget=t}computeRuneClasses(){let e=new Set,t=(s,i)=>{e.add(s),e.add(i+1)};for(let s=0;s<this.prog.numInst();s++){let i=this.prog.getInst(s);switch(i.op){case O.RUNE:case O.RUNE1:if(i.runes.length===1){if(t(i.runes[0],i.runes[0]),(i.arg&F.FOLD_CASE)!==0)for(let o=z.simpleFold(i.runes[0]);o!==i.runes[0];o=z.simpleFold(o))t(o,o)}else for(let o=0;o<i.runes.length;o+=2)t(i.runes[o],i.runes[o+1]);break;case O.RUNE_ANY_NOT_NL:t(10,10);break;case O.EMPTY_WIDTH:(i.arg&(K.EMPTY_BEGIN_LINE|K.EMPTY_END_LINE))!==0&&t(10,10),(i.arg&(K.EMPTY_WORD_BOUNDARY|K.EMPTY_NO_WORD_BOUNDARY))!==0&&(t(48,57),t(65,90),t(95,95),t(97,122))}}e.delete(0),this.classBounds=Int32Array.from(e).sort(),this.numClasses=this.classBounds.length+1;let r=new Int32Array(z.MAX_LATIN1+1);for(let s=0;s<=z.MAX_LATIN1;s++)r[s]=this.searchClass(s);this.latin1Class=r}runeClass(e){return e<=z.MAX_LATIN1?this.latin1Class[e]:this.searchClass(e)}searchClass(e){let t=this.classBounds,r=0,s=t.length;for(;r<s;){let i=r+s>>1;t[i]<=e?r=i+1:s=i}return r}closure(e,t){let r=new Set,s=Array.from(e),i=0;for(;s.length>0;){let o=s.pop();if(o===0||r.has(o))continue;r.add(o);let u=this.prog.getInst(o);switch(u.op){case O.ALT:case O.ALT_MATCH:s.push(u.out),s.push(u.arg);break;case O.NOP:case O.CAPTURE:s.push(u.out);break;case O.EMPTY_WIDTH:i|=u.arg,(u.arg&~t)===0&&s.push(u.out)}}return{pcs:Array.from(r).sort((o,u)=>o-u),needflags:i}}getState(e,t,r){let s=RT(e,t,r),i=this.stateCache.get(s);if(i instanceof cu){if(GC(i,e,t,r))return i}else if(i!==void 0){for(let c=0;c<i.length;c++)if(GC(i[c],e,t,r))return i[c]}let o=ge.stateCost(e,r);if(this.memBudget<o)return null;this.memBudget-=o;let u=new cu(e,t,r);return i===void 0?this.stateCache.set(s,u):i instanceof cu?this.stateCache.set(s,[i,u]):i.push(u),this.stateCount++,u}static stateCost(e,t){let r=t.length===0?0:ge.ARRAY_OVERHEAD+ge.ELEMENT_SIZE*t.length;return ge.STATE_OVERHEAD+ge.ELEMENT_SIZE*e.length+r}*cachedStates(){for(let e of this.stateCache.values())e instanceof cu?yield e:yield*e}makeState(e,t,r){let s=this.closure(e,t&ge.FLAG_EMPTY_MASK),i=t;return s.needflags===0&&(i&=ge.FLAG_MATCH),i|=s.needflags<<ge.FLAG_NEED_SHIFT,this.getState(s.pcs,i,r)}allocTable(e,t){let r=this.numClasses+1,s=ge.TABLE_OVERHEAD+ge.ELEMENT_SIZE*r;if(this.memBudget<s)return null;this.memBudget-=s;let i=new Array(r).fill(null);return t===F.UNANCHORED?e.next=i:e.nextAnchored=i,i}clearCache(){this.stateCache.clear(),this.stateCount=0,this.startStates.clear(),this.memBudget=this.stateBudget}resetCache(e){return this.clearCache(),this.getState(e.nfaStates,e.flag,e.matchIDs)}step(e,t,r,s){let i=s===F.UNANCHORED?e.next:e.nextAnchored;if(i!==null){let Q=i[t];if(Q!==null)return Q}else if(i=this.allocTable(e,s),i===null)return null;let o=e.flag>>>ge.FLAG_NEED_SHIFT,u=e.flag&ge.FLAG_EMPTY_MASK,c=u,l=0;r===10&&(c|=K.EMPTY_END_LINE,l|=K.EMPTY_BEGIN_LINE),r===Yi&&(c|=K.EMPTY_END_LINE|K.EMPTY_END_TEXT);let B=(e.flag&ge.FLAG_LAST_WORD)!==0,d=r!==Yi&&K.isWordRune(r);c|=d===B?K.EMPTY_NO_WORD_BOUNDARY:K.EMPTY_WORD_BOUNDARY;let g=e.nfaStates;(c&~u&o)!==0&&(g=this.closure(g,c).pcs);let w=[],D=!1,P=Ch;for(let Q=0;Q<g.length;Q++){let re=this.prog.getInst(g[Q]);re.op===O.MATCH?(D||(D=!0,P=[]),P.push(re.arg)):r!==Yi&&O.isRuneOp(re.op)&&re.matchRune(r)&&w.push(re.out)}P.length>1&&P.sort((Q,re)=>Q-re),s===F.UNANCHORED&&r!==Yi&&w.push(this.prog.start);let V=l;D&&(V|=ge.FLAG_MATCH),d&&(V|=ge.FLAG_LAST_WORD);let j=this.makeState(w,V,P);return j===null?null:(i[t]=j,j)}start(e,t){let r=e.context(t),s;if((r&K.EMPTY_BEGIN_TEXT)!==0)s=K.EMPTY_BEGIN_TEXT|K.EMPTY_BEGIN_LINE;else if((r&K.EMPTY_BEGIN_LINE)!==0)s=K.EMPTY_BEGIN_LINE;else{let o=e.step(t),u=o>=0&&K.isWordRune(o>>3);s=(r&K.EMPTY_WORD_BOUNDARY)!==0!==u?ge.FLAG_LAST_WORD:0}let i=this.startStates.get(s);if(i===void 0){if(i=this.makeState([this.prog.start],s,Ch),i===null&&(this.clearCache(),i=this.makeState([this.prog.start],s,Ch),i===null))return null;this.startStates.set(s,i)}return i}stepOrReset(e,t,r,s,i,o){let u=this.step(e,t,r,s);if(u!==null)return u;if(o.resetPos>=0&&i-o.resetPos<ge.PROGRESS_PER_STATE*this.stateCount)return null;o.resetPos=i;let c=this.resetCache(e);return c===null?null:(u=this.step(c,t,r,s),u)}run(e,t,r,s,i){let o=e.endPos(),u=this.latin1Class,c=r===F.UNANCHORED,l={resetPos:-1},B=t;for(;B<o;){let d=e.step(B),g=d>>3,w=d&7;if(w===0)break;let D=g<=z.MAX_LATIN1?u[g]:this.runeClass(g),P=c&&s.next!==null?s.next[D]:null;if(P===null&&(P=this.stepOrReset(s,D,g,r,B,l),P===null))return null;if(s=P,s.isMatch&&i(s,!1))return!0;if(!c&&s.nfaStates.length===0)return!1;B+=w}return s=this.stepOrReset(s,this.numClasses,Yi,r,B,l),s===null?null:s.isMatch&&i(s,!0)}match(e,t,r){if(this.failed)return null;if((r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&t!==0)return!1;let s=this.start(e,t);return s===null?null:this.run(e,t,r,s,(i,o)=>r!==F.ANCHOR_BOTH||o)}matchSet(e,t,r){if(this.failed)return null;if((r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&t!==0)return[];let s=this.start(e,t);if(s===null)return null;let i=new Set,o=(u,c)=>{if(r!==F.ANCHOR_BOTH||c)for(let l=0;l<u.matchIDs.length;l++)i.add(u.matchIDs[l]);return!1};return this.run(e,t,r,s,o)===null?null:Array.from(i).sort((u,c)=>u-c)}},M(ge,"FLAG_EMPTY_MASK",255),M(ge,"FLAG_MATCH",256),M(ge,"FLAG_LAST_WORD",512),M(ge,"FLAG_NEED_SHIFT",16),M(ge,"STATE_OVERHEAD",150),M(ge,"ARRAY_OVERHEAD",40),M(ge,"ELEMENT_SIZE",8),M(ge,"TABLE_OVERHEAD",48),M(ge,"PROGRESS_PER_STATE",10),ge),ST=32,PT=500,mh=256,NT=262144,OT=class{constructor(){this.end=0,this.cap=new Int32Array(0),this.matchcap=new Int32Array(0),this.ncap=0,this.jobPc=new Int32Array(mh),this.jobArg=new Uint8Array(mh),this.jobPos=new Int32Array(mh),this.jobLen=0,this.visited=new Uint32Array(0)}reset(n,e,t){this.end=e,this.jobLen=0,this.ncap=t;let r=n.numInst()*(e+1)+ST-1>>>5;this.visited.length<r?this.visited=new Uint32Array(r):this.visited.fill(0,0,r),this.cap.length<t?this.cap=new Int32Array(t).fill(-1):this.cap.fill(-1,0,t),this.matchcap.length<t?this.matchcap=new Int32Array(t).fill(-1):this.matchcap.fill(-1,0,t)}shouldVisit(n,e){let t=n*(this.end+1)+e,r=t>>>5,s=1<<(t&31);return(this.visited[r]&s)!==0?!1:(this.visited[r]|=s,!0)}push(n,e,t,r){if(n.prog.getInst(e).op!==O.FAIL&&(r||this.shouldVisit(e,t))){if(this.jobLen>=this.jobPc.length){let s=this.jobPc.length*2,i=new Int32Array(s);i.set(this.jobPc),this.jobPc=i;let o=new Uint8Array(s);o.set(this.jobArg),this.jobArg=o;let u=new Int32Array(s);u.set(this.jobPos),this.jobPos=u}this.jobPc[this.jobLen]=e,this.jobArg[this.jobLen]=r?1:0,this.jobPos[this.jobLen]=t,this.jobLen++}}tryBacktrack(n,e,t,r,s){let i=n.longest;for(this.push(n,t,r,!1);this.jobLen>0;){this.jobLen--;let o=this.jobPc[this.jobLen],u=this.jobArg[this.jobLen]===1,c=this.jobPos[this.jobLen],l=!0;for(;!(!l&&!this.shouldVisit(o,c));){l=!1;let B=n.prog.getInst(o);switch(B.op){case O.FAIL:break;case O.ALT:if(u){u=!1,o=B.arg;continue}else{this.push(n,o,c,!0),o=B.out;continue}case O.ALT_MATCH:{let d=n.prog.getInst(B.out);if(O.isRuneOp(d.op)){this.push(n,B.arg,c,!1),o=B.arg,c=this.end;continue}this.push(n,B.out,this.end,!1),o=B.out;continue}case O.RUNE:{let d=e.step(c);if(d===Bt.EOF()||!B.matchRune(d>>3))break;c+=d&7,o=B.out;continue}case O.RUNE1:{let d=e.step(c);if(d===Bt.EOF()||d>>3!==B.runes[0])break;c+=d&7,o=B.out;continue}case O.RUNE_ANY_NOT_NL:{let d=e.step(c);if(d===Bt.EOF()||d>>3===10)break;c+=d&7,o=B.out;continue}case O.RUNE_ANY:{let d=e.step(c);if(d===Bt.EOF())break;c+=d&7,o=B.out;continue}case O.CAPTURE:if(u){this.cap[B.arg]=c;break}else{B.arg<this.ncap&&(this.push(n,o,this.cap[B.arg],!0),this.cap[B.arg]=c),o=B.out;continue}case O.EMPTY_WIDTH:{let d=e.context(c);if((B.arg&~d)!==0)break;o=B.out;continue}case O.NOP:o=B.out;continue;case O.MATCH:{if(s===F.ANCHOR_BOTH&&c!==this.end)break;if(this.ncap===0)return!0;this.ncap>1&&(this.cap[1]=c);let d=this.matchcap[1];if((d===-1||i&&c>0&&c>d)&&this.matchcap.set(this.cap),!i||c===this.end)return!0;break}case O.LB_WRITE:case O.LB_CHECK:throw new du("Backtracker cannot evaluate Lookbehind instructions");default:throw new du("bad inst")}break}}return i&&this.matchcap.length>1&&this.matchcap[1]>=0}},lu=[],hu=class mm{static shouldBacktrack(e){return e.numInst()<=PT}static maxBitStateLen(e){return mm.shouldBacktrack(e)?Math.floor(NT/e.numInst()):0}static execute(e,t,r,s,i){let o=e.cond;if(o===K.EMPTY_ALL||(s===F.ANCHOR_START||s===F.ANCHOR_BOTH)&&r!==0||(o&K.EMPTY_BEGIN_TEXT)!==0&&r!==0)return null;let u=lu.length>0?lu.pop():new OT,c=t.endPos();u.reset(e.prog,c,i);let l=!1;if((o&K.EMPTY_BEGIN_TEXT)!==0||s===F.ANCHOR_START||s===F.ANCHOR_BOTH)u.ncap>0&&(u.cap[0]=r),u.tryBacktrack(e,t,e.prog.start,r,s)&&(l=!0);else{let d=-1;for(;r<=c&&d!==0;r+=d){if(e.prefix.length>0){let w=t.index(e,r);if(w<0)break;r+=w}if(u.ncap>0&&(u.cap[0]=r),u.tryBacktrack(e,t,e.prog.start,r,s)){l=!0;break}let g=t.step(r);d=g===Bt.EOF()?0:g&7}}if(!l)return lu.push(u),null;let B=i===0?[]:K.toArray(u.matchcap.subarray(0,i));return lu.push(u),B}},HC=class{constructor(n){this.sparse=new Uint32Array(n),this.dense=new Uint32Array(n),this.size=0,this.nextIndex=0}empty(){return this.nextIndex>=this.size}next(){return this.dense[this.nextIndex++]}clear(){this.size=0,this.nextIndex=0}contains(n){return n<this.sparse.length&&this.sparse[n]<this.size&&this.dense[this.sparse[n]]===n}insert(n){this.contains(n)||this.insertNew(n)}insertNew(n){n>=this.sparse.length||(this.sparse[n]=this.size,this.dense[this.size]=n,this.size++)}},xT=(n,e,t,r)=>{let s=n.length,i=e.length,o=0,u=0,c=[],l=[],B=!0,d=-1,g=w=>{let D=w?n:e,P=w?o:u,V=w?t:r;return d>0&&D[P]<=c[d]?!1:(c.push(D[P],D[P+1]),w?o+=2:u+=2,d+=2,l.push(V),!0)};for(;o<s||u<i;)if(u>=i?B=g(!0):o>=s||e[u]<n[o]?B=g(!1):B=g(!0),!B)return null;return{merged:c,next:l}},FT=class{constructor(n){this.start=n.start,this.numCap=n.numCap,this.inst=new Array(n.inst.length);for(let e=0;e<n.inst.length;e++){let t=n.inst[e],r=new O(t.op);r.out=t.out,r.arg=t.arg,r.runes=t.runes?new Int32Array(t.runes):new Int32Array(0),r.next=null,this.inst[e]=r}}},kT=n=>{let e=new FT(n);for(let t=0;t<e.inst.length;t++){let r=e.inst[t];if(r.op!==O.ALT&&r.op!==O.ALT_MATCH)continue;let s="out",i="arg",o=e.inst[r[i]];if(o.op!==O.ALT&&o.op!==O.ALT_MATCH&&(s="arg",i="out",o=e.inst[r[i]],o.op!==O.ALT&&o.op!==O.ALT_MATCH))continue;let u=e.inst[r[s]];if(u.op===O.ALT||u.op===O.ALT_MATCH)continue;let c="out",l="arg",B=!1;o.out===t?B=!0:o.arg===t&&(B=!0,c="arg",l="out"),B&&(o[c]=r[s]),r[s]===o[c]&&(r[i]=o[l])}return e},LT=n=>{if(n.inst.length>=1e3)return null;let e=new HC(n.inst.length),t=new HC(n.inst.length),r=new Array(n.inst.length),s=new Array(n.inst.length).fill(!1),i=o=>{let u=!0,c=n.inst[o];if(t.contains(o))return!0;switch(t.insert(o),c.op){case O.ALT:case O.ALT_MATCH:{u=i(c.out)&&i(c.arg);let l=s[c.out],B=s[c.arg];if(l&&B)return!1;if(B){let D=c.out;c.out=c.arg,c.arg=D;let P=l;l=B,B=P}l&&(s[o]=!0,c.op=O.ALT_MATCH);let d=r[c.out]||[],g=r[c.arg]||[],w=xT(d,g,c.out,c.arg);if(!w)return!1;r[o]=new Int32Array(w.merged),c.next=new Uint32Array(w.next);break}case O.CAPTURE:case O.EMPTY_WIDTH:case O.NOP:u=i(c.out),s[o]=s[c.out],r[o]=r[c.out]?new Int32Array(r[c.out]):new Int32Array(0),c.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(c.out);break;case O.MATCH:case O.FAIL:s[o]=c.op===O.MATCH;break;case O.RUNE:{if(s[o]=!1,c.next&&c.next.length>0)break;if(e.insert(c.out),!c.runes||c.runes.length===0){r[o]=new Int32Array(0),c.next=new Uint32Array([c.out]);break}let l=[];if(c.runes.length===1&&(c.arg&F.FOLD_CASE)!==0){let B=c.runes[0];l.push(B,B);for(let d=z.simpleFold(B);d!==B;d=z.simpleFold(d))l.push(d,d);l.sort((d,g)=>d-g)}else for(let B=0;B<c.runes.length;B++)l.push(c.runes[B]);r[o]=new Int32Array(l),c.next=new Uint32Array(Math.floor(l.length/2)+1).fill(c.out),c.op=O.RUNE;break}case O.RUNE1:{if(s[o]=!1,c.next&&c.next.length>0)break;e.insert(c.out);let l=[];if((c.arg&F.FOLD_CASE)!==0){let B=c.runes[0];l.push(B,B);for(let d=z.simpleFold(B);d!==B;d=z.simpleFold(d))l.push(d,d);l.sort((d,g)=>d-g)}else l.push(c.runes[0],c.runes[0]);r[o]=new Int32Array(l),c.next=new Uint32Array(Math.floor(l.length/2)+1).fill(c.out),c.op=O.RUNE;break}case O.RUNE_ANY:if(s[o]=!1,c.next&&c.next.length>0)break;e.insert(c.out),r[o]=new Int32Array([0,z.MAX_RUNE]),c.next=new Uint32Array([c.out]);break;case O.RUNE_ANY_NOT_NL:if(s[o]=!1,c.next&&c.next.length>0)break;e.insert(c.out),r[o]=new Int32Array([0,9,11,z.MAX_RUNE]),c.next=new Uint32Array(Math.floor(r[o].length/2)+1).fill(c.out)}return u};for(e.clear(),e.insert(n.start);!e.empty();)if(t.clear(),!i(e.next()))return null;for(let o=0;o<n.inst.length;o++)r[o]&&(n.inst[o].runes=r[o]);return n},VT=(n,e)=>{for(let t=0;t<e.inst.length;t++){let r=e.inst[t];switch(r.op){case O.ALT:case O.ALT_MATCH:case O.RUNE:break;case O.CAPTURE:case O.EMPTY_WIDTH:case O.NOP:case O.MATCH:case O.FAIL:n.inst[t].next=null;break;case O.RUNE1:case O.RUNE_ANY:case O.RUNE_ANY_NOT_NL:n.inst[t].next=null,n.inst[t].op=r.op,n.inst[t].runes=r.runes?new Int32Array(r.runes):new Int32Array(0)}}},qC=class _m{static compile(e){if(e.start===0||e.numLb>0)return null;let t=e.inst[e.start];if(t.op!==O.EMPTY_WIDTH||(t.arg&K.EMPTY_BEGIN_TEXT)===0)return null;let r=!1;for(let i=0;i<e.inst.length;i++)if(e.inst[i].op===O.ALT||e.inst[i].op===O.ALT_MATCH){r=!0;break}for(let i=0;i<e.inst.length;i++){let o=e.inst[i],u=e.inst[o.out].op;switch(o.op){case O.ALT:case O.ALT_MATCH:if(u===O.MATCH||e.inst[o.arg].op===O.MATCH)return null;break;case O.EMPTY_WIDTH:if(u===O.MATCH){if((o.arg&K.EMPTY_END_TEXT)===K.EMPTY_END_TEXT)continue;return null}break;default:if(u===O.MATCH&&r)return null}}let s=kT(e);return s=LT(s),s!==null&&VT(s,e),s}static next(e,t){let r=e.matchRunePos(t);return r>=0?e.next[r]:e.op===O.ALT_MATCH?e.out:0}static execute(e,t,r,s,i){let o=e.onepass;if(!o)return null;let u=new Int32Array(i).fill(-1),c=!1,l=t.step(r),B=l>>3,d=l&7,g=Bt.EOF(),w=-1,D=0;l!==Bt.EOF()&&(g=t.step(r+d),g!==Bt.EOF()&&(w=g>>3,D=g&7));let P=r===0?K.emptyOpContext(-1,B):t.context(r),V=o.start,j;for(;;){switch(j=o.inst[V],V=j.out,j.op){case O.MATCH:return s===F.ANCHOR_BOTH&&r!==t.endPos()?null:(c=!0,u.length>0&&(u[0]=0,u[1]=r),i===0?[]:K.toArray(u));case O.RUNE:if(!j.matchRune(B))return null;break;case O.RUNE1:if(B!==j.runes[0])return null;break;case O.RUNE_ANY:break;case O.RUNE_ANY_NOT_NL:if(B===10)return null;break;case O.ALT:case O.ALT_MATCH:V=_m.next(j,B);continue;case O.FAIL:return null;case O.NOP:continue;case O.EMPTY_WIDTH:if((j.arg&~P)!==0)return null;continue;case O.CAPTURE:j.arg<u.length&&(u[j.arg]=r);continue;default:throw new du("bad inst")}if(d===0)break;P=K.emptyOpContext(B,w),r+=d,B=w,d=D,B!==-1&&(g=t.step(r+d),g!==Bt.EOF()?(w=g>>3,D=g&7):(w=-1,D=0))}return c?i===0?[]:K.toArray(u):null}},Z,I=(Z=class{static isPseudoOp(e){return e>=Z.Op.LEFT_PAREN}static emptySubs(){return[]}static quoteIfHyphen(e){return e===k.CODES["-"]?"\\":""}static fromRegexp(e){let t=new Z(e.op);return t.flags=e.flags,t.subs=e.subs,t.runes=e.runes,t.cap=e.cap,t.min=e.min,t.max=e.max,t.name=e.name,t.namedGroups=e.namedGroups,t.lb=e.lb,t}constructor(e){this.op=e,this.flags=0,this.subs=Z.emptySubs(),this.runes=new Int32Array(0),this.min=0,this.max=0,this.cap=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}reinit(){this.flags=0,this.subs=Z.emptySubs(),this.runes=new Int32Array(0),this.cap=0,this.min=0,this.max=0,this.name=null,this.namedGroups=Object.create(null),this.lb=0}toString(){return this.appendTo()}appendTo(){let e="";switch(this.op){case Z.Op.NO_MATCH:e+="[^\\x00-\\x{10FFFF}]";break;case Z.Op.EMPTY_MATCH:e+="(?:)";break;case Z.Op.STAR:case Z.Op.PLUS:case Z.Op.QUEST:case Z.Op.REPEAT:{let t=this.subs[0];switch(t.op>Z.Op.CAPTURE||t.op===Z.Op.LITERAL&&t.runes.length>1?e+=`(?:${t.appendTo()})`:e+=t.appendTo(),this.op){case Z.Op.STAR:e+="*";break;case Z.Op.PLUS:e+="+";break;case Z.Op.QUEST:e+="?";break;case Z.Op.REPEAT:e+=`{${this.min}`,this.min!==this.max&&(e+=",",this.max>=0&&(e+=this.max)),e+="}"}(this.flags&F.NON_GREEDY)!==0&&(e+="?");break}case Z.Op.CONCAT:for(let t of this.subs)t.op===Z.Op.ALTERNATE?e+=`(?:${t.appendTo()})`:e+=t.appendTo();break;case Z.Op.ALTERNATE:{let t="";for(let r of this.subs)e+=t,t="|",e+=r.appendTo();break}case Z.Op.LITERAL:(this.flags&F.FOLD_CASE)!==0&&(e+="(?i:");for(let t of this.runes)e+=K.escapeRune(t);(this.flags&F.FOLD_CASE)!==0&&(e+=")");break;case Z.Op.ANY_CHAR_NOT_NL:e+="(?-s:.)";break;case Z.Op.ANY_CHAR:e+="(?s:.)";break;case Z.Op.PLB:e+=`(?<=${this.subs[0].appendTo()})`;break;case Z.Op.NLB:e+=`(?<!${this.subs[0].appendTo()})`;break;case Z.Op.CAPTURE:this.name===null||this.name.length===0?e+="(":e+=`(?P<${this.name}>`,this.subs[0].op!==Z.Op.EMPTY_MATCH&&(e+=this.subs[0].appendTo()),e+=")";break;case Z.Op.BEGIN_TEXT:e+="\\A";break;case Z.Op.END_TEXT:(this.flags&F.WAS_DOLLAR)!==0?e+="(?-m:$)":e+="\\z";break;case Z.Op.BEGIN_LINE:e+="^";break;case Z.Op.END_LINE:e+="$";break;case Z.Op.WORD_BOUNDARY:e+="\\b";break;case Z.Op.NO_WORD_BOUNDARY:e+="\\B";break;case Z.Op.CHAR_CLASS:if(this.runes.length%2!==0){e+="[invalid char class]";break}if(e+="[",this.runes.length===0)e+="^\\x00-\\x{10FFFF}";else if(this.runes[0]===0&&this.runes[this.runes.length-1]===z.MAX_RUNE){e+="^";for(let t=1;t<this.runes.length-1;t+=2){let r=this.runes[t]+1,s=this.runes[t+1]-1;e+=Z.quoteIfHyphen(r),e+=K.escapeRune(r),r!==s&&(e+="-",e+=Z.quoteIfHyphen(s),e+=K.escapeRune(s))}}else for(let t=0;t<this.runes.length;t+=2){let r=this.runes[t],s=this.runes[t+1];e+=Z.quoteIfHyphen(r),e+=K.escapeRune(r),r!==s&&(e+="-",e+=Z.quoteIfHyphen(s),e+=K.escapeRune(s))}e+="]";break;default:e+=this.op}return e}maxCap(){let e=0;if(this.op===Z.Op.CAPTURE&&(e=this.cap),this.subs!==null)for(let t of this.subs){let r=t.maxCap();e<r&&(e=r)}return e}equals(e){if(!(e!==null&&e instanceof Z)||this.op!==e.op)return!1;switch(this.op){case Z.Op.END_TEXT:if((this.flags&F.WAS_DOLLAR)!==(e.flags&F.WAS_DOLLAR))return!1;break;case Z.Op.LITERAL:case Z.Op.CHAR_CLASS:if((this.flags&F.FOLD_CASE)!==(e.flags&F.FOLD_CASE))return!1;if(this.runes===null&&e.runes===null)break;if(this.runes===null||e.runes===null||this.runes.length!==e.runes.length)return!1;for(let t=0;t<this.runes.length;t++)if(this.runes[t]!==e.runes[t])return!1;break;case Z.Op.ALTERNATE:case Z.Op.CONCAT:if(this.subs.length!==e.subs.length)return!1;for(let t=0;t<this.subs.length;++t)if(!this.subs[t].equals(e.subs[t]))return!1;break;case Z.Op.STAR:case Z.Op.PLUS:case Z.Op.QUEST:if((this.flags&F.NON_GREEDY)!==(e.flags&F.NON_GREEDY)||!this.subs[0].equals(e.subs[0]))return!1;break;case Z.Op.REPEAT:if((this.flags&F.NON_GREEDY)!==(e.flags&F.NON_GREEDY)||this.min!==e.min||this.max!==e.max||!this.subs[0].equals(e.subs[0]))return!1;break;case Z.Op.CAPTURE:if(this.cap!==e.cap||(this.name===null?e.name!==null:this.name!==e.name)||!this.subs[0].equals(e.subs[0]))return!1;break;case Z.Op.PLB:case Z.Op.NLB:if(this.lb!==e.lb||!this.subs[0].equals(e.subs[0]))return!1}return!0}},M(Z,"Op",pm(["NO_MATCH","EMPTY_MATCH","LITERAL","CHAR_CLASS","ANY_CHAR_NOT_NL","ANY_CHAR","BEGIN_LINE","END_LINE","BEGIN_TEXT","END_TEXT","WORD_BOUNDARY","NO_WORD_BOUNDARY","CAPTURE","STAR","PLUS","QUEST","REPEAT","CONCAT","ALTERNATE","PLB","NLB","LEFT_PAREN","VERTICAL_BAR"])),Z),Th=class{static walk(n,e){let t=[],r=n,s;for(;;){if(r.subs.length===0)s=e.leaf(r);else{let i=e.enter(r);if(i.result===void 0){t.push({re:r,state:i,i:0}),r=r.subs[0];continue}s=i.result}for(;;){if(t.length===0)return s;let i=t[t.length-1];if(e.child(i.re,i.state,s,i.i),i.i++,i.state.result===void 0&&i.i<i.re.subs.length){r=i.re.subs[i.i];break}t.pop(),s=i.state.result!==void 0?i.state.result:e.leave(i.re,i.state)}}}},jC=class{constructor(n,e){let t=new Map,r=[0],s=[0],i=[0],o=[0];for(let D of n){let P=0;for(let V=0;V<D.length;V++){let j=P*e+D[V],Q=t.get(j);Q===void 0&&(Q=r.length,t.set(j,Q),r.push(P),s.push(D[V]),i.push(i[P]+1),o.push(0)),P=Q}o[P]=1}let u=r.length,c=new Int32Array(u-1);for(let D=1;D<u;D++)c[D-1]=D;c.sort((D,P)=>r[D]-r[P]||s[D]-s[P]);let l=new Int32Array(u+1);for(let D=1;D<u;D++)l[r[D]+1]++;for(let D=0;D<u;D++)l[D+1]+=l[D];let B=new Int32Array(u-1);for(let D=0;D<c.length;D++)B[D]=s[c[D]];this.childStart=l,this.childUnit=B,this.childNode=c;let d=new Int32Array(u);for(let D=0;D<u;D++)d[D]=D;d.sort((D,P)=>i[D]-i[P]);let g=new Int32Array(u),w=Uint8Array.from(o);for(let D=1;D<u;D++){let P=d[D],V=r[P];if(V!==0){let j=g[V],Q=this.next(j,s[P]);for(;Q<0&&j!==0;)j=g[j],Q=this.next(j,s[P]);g[P]=Q>=0?Q:0}w[P]|=w[g[P]]}this.fail=g,this.match=w}next(n,e){let t=this.childStart[n],r=this.childStart[n+1],s=this.childUnit;for(;t<r;){let i=t+r>>1,o=s[i];if(o===e)return this.childNode[i];o<e?t=i+1:r=i}return-1}advance(n,e){for(;;){let t=this.next(n,e);if(t>=0)return t;if(n===0)return 0;n=this.fail[n]}}searchUTF16(n,e,t){let r=0;for(let s=e;s<t;s++)if(r=this.advance(r,n.charCodeAt(s)),this.match[r]===1)return!0;return!1}searchUTF8(n,e,t){let r=0;for(let s=e;s<t;s++)if(r=this.advance(r,n[s]),this.match[r]===1)return!0;return!1}},It,ie=(It=class{constructor(e){this.type=e,this.subs=[],this.str="",this.bytes=null,this.cost=e===It.Type.EXACT?1:0,this.allExact=!1,this.ac16=null,this.ac8=null}automaton16(){if(this.ac16===null){let e=this.subs.map(t=>{let r=new Array(t.str.length);for(let s=0;s<t.str.length;s++)r[s]=t.str.charCodeAt(s);return r});this.ac16=new jC(e,65536)}return this.ac16}automaton8(){return this.ac8===null&&(this.ac8=new jC(this.subs.map(e=>e.bytes),256)),this.ac8}eval(e,t){switch(this.type){case It.Type.NONE:return!0;case It.Type.EXACT:return e.hasString(this,t);case It.Type.AND:for(let r=0;r<this.subs.length;r++)if(!this.subs[r].eval(e,t))return!1;return!0;case It.Type.OR:if(this.allExact)return e.hasAnyString(this,t);for(let r=0;r<this.subs.length;r++)if(this.subs[r].eval(e,t))return!0;return!1;default:return!0}}},M(It,"Type",{NONE:0,EXACT:1,AND:2,OR:3}),M(It,"MAX_SCANS",32),M(It,"MAX_AC_UNITS",1<<18),It),Ht,MT=(Ht=class{static build(e){return e?Th.walk(e,Ht.WALKER):new ie(ie.Type.NONE)}static leaf(e){if(e.op!==I.Op.LITERAL)return new ie(ie.Type.NONE);if(e.runes.length===0||(e.flags&F.FOLD_CASE)!==0)return new ie(ie.Type.NONE);let t="";for(let s=0;s<e.runes.length;s++){if(z.isUnsearchable(e.runes[s]))return new ie(ie.Type.NONE);t+=String.fromCodePoint(e.runes[s])}let r=new ie(ie.Type.EXACT);return r.str=t,r.bytes=K.stringToUtf8ByteArray(r.str),r}static enter(e){switch(e.op){case I.Op.CAPTURE:case I.Op.PLUS:return{sub:null};case I.Op.REPEAT:return e.min>=1?{sub:null}:{result:new ie(ie.Type.NONE)};case I.Op.CONCAT:return{pf:new ie(ie.Type.AND),subs:[]};case I.Op.ALTERNATE:return{pf:new ie(ie.Type.OR),subs:[]};default:return{result:new ie(ie.Type.NONE)}}}static child(e,t,r){if(t.subs===void 0){t.sub=r;return}if(t.pf.type===ie.Type.AND){if(r.type===ie.Type.NONE)return;if(r.type===ie.Type.AND){for(let s=0;s<r.subs.length;s++)t.subs.push(r.subs[s]);return}t.subs.push(r);return}if(r.type===ie.Type.NONE){t.result=new ie(ie.Type.NONE);return}if(r.type===ie.Type.OR){for(let s=0;s<r.subs.length;s++)t.subs.push(r.subs[s]);return}t.subs.push(r)}static leave(e,t){if(t.subs===void 0)return t.sub;let r=t.pf,s=new Set,i=[];for(let l of t.subs){if(l.type===ie.Type.EXACT){if(s.has(l.str))continue;s.add(l.str)}i.push(l)}if(r.type===ie.Type.AND){let l=[],B=0;for(let d of i)B+d.cost>ie.MAX_SCANS||(l.push(d),B+=d.cost);return l.length===0?new ie(ie.Type.NONE):l.length===1?l[0]:(r.subs=l,r.cost=B,r)}if(i.length===0)return new ie(ie.Type.NONE);if(i.length===1)return i[0];r.subs=i;let o=!0,u=0,c=0;for(let l of i)l.type!==ie.Type.EXACT?o=!1:c+=l.bytes.length,u+=l.cost;return o?c>ie.MAX_AC_UNITS?new ie(ie.Type.NONE):(r.allExact=!0,r.cost=1,r):u>ie.MAX_SCANS?new ie(ie.Type.NONE):(r.cost=u,r)}},M(Ht,"WALKER",{leaf:e=>Ht.leaf(e),enter:e=>Ht.enter(e),child:(e,t,r)=>Ht.child(e,t,r),leave:(e,t)=>Ht.leave(e,t)}),Ht),Nt=class{constructor(n=0,e=0){this.head=n,this.tail=e}},UT=class{constructor(){this.inst=[],this.start=0,this.numCap=2,this.lbStarts=[],this.numLb=0,this.lbInst=null}getInst(n){return this.inst[n]}numInst(){return this.inst.length}addInst(n){this.inst.push(new O(n))}markLookbehindInsts(){let n=new Uint8Array(this.inst.length),e=this.lbStarts.slice();for(;e.length>0;){let t=e.pop();if(t===0||n[t]===1)continue;n[t]=1;let r=this.inst[t];switch(r.op){case O.ALT:case O.ALT_MATCH:e.push(r.out,r.arg);break;case O.MATCH:case O.FAIL:break;default:e.push(r.out)}}this.lbInst=n}skipNop(n){let e=this.inst[n];for(;e.op===O.NOP||e.op===O.CAPTURE;)e=this.inst[n],n=e.out;return e}prefix(){let n="",e=this.skipNop(this.start);if(!O.isRuneOp(e.op)||e.runes.length!==1)return[e.op===O.MATCH,n];for(;O.isRuneOp(e.op)&&e.runes.length===1&&(e.arg&F.FOLD_CASE)===0&&!z.isUnsearchable(e.runes[0]);)n+=String.fromCodePoint(e.runes[0]),e=this.skipNop(e.out);return[e.op===O.MATCH,n]}startCond(){let n=0,e=this.start;e:for(;;){let t=this.inst[e];switch(t.op){case O.EMPTY_WIDTH:n|=t.arg;break;case O.FAIL:return-1;case O.CAPTURE:case O.NOP:break;default:break e}e=t.out}return n}patch(n,e){let t=n.head;for(;t!==0;){let r=this.inst[t>>1];(t&1)===0?(t=r.out,r.out=e):(t=r.arg,r.arg=e)}}append(n,e){if(n.head===0)return e;if(e.head===0)return n;let t=this.inst[n.tail>>1];return(n.tail&1)===0?t.out=e.head:t.arg=e.head,new Nt(n.head,e.tail)}toString(){let n="";for(let e=0;e<this.inst.length;e++){let t=n.length;n+=e,e===this.start&&(n+="*"),n+="        ".substring(n.length-t),n+=this.inst[e],n+=`
`}return n}},GT=new Int32Array([0,k.CODES[`
`]-1,k.CODES[`
`]+1,z.MAX_RUNE]),KC=new Int32Array([0,z.MAX_RUNE]),Bu=class{constructor(n=0,e=new Nt,t=!1){this.i=n,this.out=e,this.nullable=t}},Em=class wh{static compileRegexp(e){let t=new wh,r=t.compile(e);return t.prog.patch(r.out,t.newInst(O.MATCH).i),t.prog.start=r.i,t.prog.markLookbehindInsts(),t.prog}static compileSet(e){let t=new wh;if(e.length===0)return t.prog.start=t.newInst(O.FAIL).i,t.prog.markLookbehindInsts(),t.prog;let r=[];for(let i=0;i<e.length;i++){t.lbOffset=t.prog.numLb;let o=t.compile(e[i]),u=t.newInst(O.MATCH);t.prog.getInst(u.i).arg=i,t.prog.patch(o.out,u.i),r.push(o.i)}let s=r[0];for(let i=1;i<r.length;i++){let o=t.newInst(O.ALT),u=t.prog.getInst(o.i);u.out=s,u.arg=r[i],s=o.i}return t.prog.start=s,t.prog.markLookbehindInsts(),t.prog}constructor(){this.prog=new UT,this.newInst(O.FAIL),this.lbOffset=0,this.runeCache=new Map,this.walker={leaf:e=>this.leaf(e),enter:e=>this.enter(e),child:(e,t,r)=>this.child(e,t,r),leave:(e,t)=>this.leave(e,t)}}newInst(e){return this.prog.addInst(e),new Bu(this.prog.numInst()-1,new Nt,!0)}nop(){let e=this.newInst(O.NOP);return e.out=new Nt(e.i<<1,e.i<<1),e}fail(){return new Bu}cap(e){let t=this.newInst(O.CAPTURE);return t.out=new Nt(t.i<<1,t.i<<1),this.prog.getInst(t.i).arg=e,this.prog.numCap<e+1&&(this.prog.numCap=e+1),t}cat(e,t){return e.i===0||t.i===0?(this.prog.patch(e.out,0),this.prog.patch(t.out,0),this.fail()):(this.prog.patch(e.out,t.i),new Bu(e.i,t.out,e.nullable&&t.nullable))}alt(e,t){if(e.i===0)return t;if(t.i===0)return e;let r=this.newInst(O.ALT),s=this.prog.getInst(r.i);return s.out=e.i,s.arg=t.i,r.out=this.prog.append(e.out,t.out),r.nullable=e.nullable||t.nullable,r}loop(e,t){let r=this.newInst(O.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new Nt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new Nt(r.i<<1|1,r.i<<1|1)),this.prog.patch(e.out,r.i),r}quest(e,t){if(e.i===0)return this.nop();let r=this.newInst(O.ALT),s=this.prog.getInst(r.i);return t?(s.arg=e.i,r.out=new Nt(r.i<<1,r.i<<1)):(s.out=e.i,r.out=new Nt(r.i<<1|1,r.i<<1|1)),r.out=this.prog.append(r.out,e.out),r}star(e,t){return e.i===0?this.nop():e.nullable?this.quest(this.plus(e,t),t):this.loop(e,t)}plus(e,t){return e.i===0?this.fail():new Bu(e.i,this.loop(e,t).out,e.nullable)}empty(e){let t=this.newInst(O.EMPTY_WIDTH);return this.prog.getInst(t.i).arg=e,t.out=new Nt(t.i<<1,t.i<<1),t}rune(e,t){let r=this.newInst(O.RUNE);r.nullable=!1;let s=this.prog.getInst(r.i);return s.runes=e,t&=F.FOLD_CASE,(e.length!==1||z.simpleFold(e[0])===e[0])&&(t&=~F.FOLD_CASE),s.arg=t,r.out=new Nt(r.i<<1,r.i<<1),(t&F.FOLD_CASE)===0&&e.length===1||e.length===2&&e[0]===e[1]?s.op=O.RUNE1:e.length===2&&e[0]===0&&e[1]===z.MAX_RUNE?s.op=O.RUNE_ANY:e.length===4&&e[0]===0&&e[1]===k.CODES[`
`]-1&&e[2]===k.CODES[`
`]+1&&e[3]===z.MAX_RUNE&&(s.op=O.RUNE_ANY_NOT_NL),r}lookBehind(e,t){let r=Math.sign(t)*(Math.abs(t)+this.lbOffset),s=this.newInst(O.LB_WRITE);this.prog.getInst(s.i).arg=r;let i=this.rune(KC,0),o=this.star(i,!0),u=this.cat(o,e);this.prog.patch(u.out,s.i);let c=this.newInst(O.LB_CHECK);return this.prog.getInst(c.i).arg=r,this.prog.lbStarts.push(u.i),Math.abs(r)>this.prog.numLb&&(this.prog.numLb=Math.abs(r)),c.out=new Nt(c.i<<1,c.i<<1),c}compile(e){return Th.walk(e,this.walker)}leaf(e){switch(e.op){case I.Op.NO_MATCH:return this.fail();case I.Op.EMPTY_MATCH:return this.nop();case I.Op.LITERAL:{if(e.runes.length===0)return this.nop();let t=null;for(let r of e.runes){let s=this.runeCache.get(r);s===void 0&&(s=new Int32Array([r]),this.runeCache.set(r,s));let i=this.rune(s,e.flags);t=t===null?i:this.cat(t,i)}return t}case I.Op.CHAR_CLASS:return this.rune(e.runes,e.flags);case I.Op.ANY_CHAR_NOT_NL:return this.rune(GT,0);case I.Op.ANY_CHAR:return this.rune(KC,0);case I.Op.BEGIN_LINE:return this.empty(K.EMPTY_BEGIN_LINE);case I.Op.END_LINE:return this.empty(K.EMPTY_END_LINE);case I.Op.BEGIN_TEXT:return this.empty(K.EMPTY_BEGIN_TEXT);case I.Op.END_TEXT:return this.empty(K.EMPTY_END_TEXT);case I.Op.WORD_BOUNDARY:return this.empty(K.EMPTY_WORD_BOUNDARY);case I.Op.NO_WORD_BOUNDARY:return this.empty(K.EMPTY_NO_WORD_BOUNDARY);case I.Op.CONCAT:case I.Op.ALTERNATE:return this.nop();default:throw new Zi("regexp: unhandled case in compile")}}enter(e){switch(e.op){case I.Op.PLB:case I.Op.NLB:case I.Op.STAR:case I.Op.PLUS:case I.Op.QUEST:return{sub:null};case I.Op.CAPTURE:return{bra:this.cap(e.cap<<1),sub:null};case I.Op.CONCAT:case I.Op.ALTERNATE:return{f:null};default:throw new Zi("regexp: unhandled case in compile")}}child(e,t,r){e.op===I.Op.CONCAT?t.f=t.f===null?r:this.cat(t.f,r):e.op===I.Op.ALTERNATE?t.f=t.f===null?r:this.alt(t.f,r):t.sub=r}leave(e,t){switch(e.op){case I.Op.PLB:case I.Op.NLB:return this.lookBehind(t.sub,e.lb);case I.Op.CAPTURE:{let r=this.cap(e.cap<<1|1);return this.cat(this.cat(t.bra,t.sub),r)}case I.Op.STAR:return this.star(t.sub,(e.flags&F.NON_GREEDY)!==0);case I.Op.PLUS:return this.plus(t.sub,(e.flags&F.NON_GREEDY)!==0);case I.Op.QUEST:return this.quest(t.sub,(e.flags&F.NON_GREEDY)!==0);case I.Op.CONCAT:case I.Op.ALTERNATE:return t.f;default:throw new Zi("regexp: unhandled case in compile")}}},xe,ym=(xe=class{static simplify(e){return e===null?null:Th.walk(e,xe.WALKER)}static leaf(e){if(e.op===I.Op.CHAR_CLASS){if(e.runes===null)return e;if(e.runes.length===0)return new I(I.Op.NO_MATCH);if(e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE)return new I(I.Op.ANY_CHAR);if(e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES[`
`]-1&&e.runes[2]===k.CODES[`
`]+1&&e.runes[3]===z.MAX_RUNE)return new I(I.Op.ANY_CHAR_NOT_NL)}return e}static enter(e){switch(e.op){case I.Op.PLB:case I.Op.NLB:case I.Op.CAPTURE:case I.Op.STAR:case I.Op.PLUS:case I.Op.QUEST:return{sub:null};case I.Op.CONCAT:case I.Op.ALTERNATE:return{subs:[],changed:!1};case I.Op.REPEAT:return e.min===0&&e.max===0?{result:new I(I.Op.EMPTY_MATCH)}:{sub:null};default:return{result:e}}}static child(e,t,r,s){if(t.subs===void 0){t.sub=r;return}if(r!==e.subs[s]&&(t.changed=!0),e.op===I.Op.CONCAT){if(r.op===I.Op.NO_MATCH){t.result=new I(I.Op.NO_MATCH);return}if(r.op===I.Op.EMPTY_MATCH){t.changed=!0;return}if(r.op===I.Op.CONCAT){t.changed=!0;for(let i=0;i<r.subs.length;i++)t.subs.push(r.subs[i]);return}}else{if(r.op===I.Op.NO_MATCH){t.changed=!0;return}if(r.op===I.Op.ALTERNATE){t.changed=!0;for(let i=0;i<r.subs.length;i++)t.subs.push(r.subs[i]);return}}t.subs.push(r)}static leave(e,t){switch(e.op){case I.Op.PLB:case I.Op.NLB:case I.Op.CAPTURE:{let r=t.sub;if(r!==e.subs[0]){let s=I.fromRegexp(e);return s.runes=new Int32Array(0),s.subs=[r],s}return e}case I.Op.CONCAT:case I.Op.ALTERNATE:if(t.changed){let r=t.subs;if(r.length===0)return new I(e.op===I.Op.CONCAT?I.Op.EMPTY_MATCH:I.Op.NO_MATCH);if(r.length===1)return r[0];let s=I.fromRegexp(e);return s.runes=new Int32Array(0),s.subs=r,s}return e;case I.Op.STAR:case I.Op.PLUS:case I.Op.QUEST:return xe.simplify1(e.op,e.flags,t.sub,e);case I.Op.REPEAT:return xe.simplifyRepeat(e,t.sub);default:return e}}static simplifyRepeat(e,t){if(e.max===-1){if(e.min===0)return xe.simplify1(I.Op.STAR,e.flags,t,null);if(e.min===1)return xe.simplify1(I.Op.PLUS,e.flags,t,null);let s=[];for(let i=0;i<e.min-1;i++)s.push(t);return s.push(xe.simplify1(I.Op.PLUS,e.flags,t,null)),xe.concat(s)}if(e.min===1&&e.max===1)return t;let r=null;if(e.min>0){r=[];for(let s=0;s<e.min;s++)r.push(t)}if(e.max>e.min){let s=xe.simplify1(I.Op.QUEST,e.flags,t,null);for(let i=e.min+1;i<e.max;i++)s=xe.simplify1(I.Op.QUEST,e.flags,xe.concat([t,s]),null);if(r===null)return s;r.push(s)}return r!==null?xe.concat(r):new I(I.Op.NO_MATCH)}static concat(e){let t=[];for(let s=0;s<e.length;s++){let i=e[s];if(i.op===I.Op.NO_MATCH)return new I(I.Op.NO_MATCH);if(i.op!==I.Op.EMPTY_MATCH){if(i.op===I.Op.CONCAT){for(let o=0;o<i.subs.length;o++)t.push(i.subs[o]);continue}t.push(i)}}if(t.length===0)return new I(I.Op.EMPTY_MATCH);if(t.length===1)return t[0];let r=new I(I.Op.CONCAT);return r.subs=t,r}static simplify1(e,t,r,s){if(r.op===I.Op.EMPTY_MATCH)return r;if(r.op===I.Op.NO_MATCH)return e===I.Op.PLUS?r:new I(I.Op.EMPTY_MATCH);if(e===r.op&&(t&F.NON_GREEDY)===(r.flags&F.NON_GREEDY))return r;if(s!==null&&s.op===e&&(s.flags&F.NON_GREEDY)===(t&F.NON_GREEDY)&&r===s.subs[0])return s;let i=new I(e);return i.flags=t,i.subs=[r],i}},M(xe,"WALKER",{leaf:e=>xe.leaf(e),enter:e=>xe.enter(e),child:(e,t,r,s)=>xe.child(e,t,r,s),leave:(e,t)=>xe.leave(e,t)}),xe),fe=class{constructor(n,e){this.sign=n,this.cls=e}},JC=[48,57],zC=[9,10,12,13,32,32],WC=[48,57,65,90,95,95,97,122],QC=new Map([["\\d",new fe(1,JC)],["\\D",new fe(-1,JC)],["\\s",new fe(1,zC)],["\\S",new fe(-1,zC)],["\\w",new fe(1,WC)],["\\W",new fe(-1,WC)]]),$C=[48,57,65,90,97,122],YC=[65,90,97,122],XC=[0,127],ZC=[9,9,32,32],em=[0,31,127,127],tm=[48,57],nm=[33,126],rm=[97,122],sm=[32,126],im=[33,47,58,64,91,96,123,126],om=[9,13,32,32],am=[65,90],um=[48,57,65,90,95,95,97,122],cm=[48,57,65,70,97,102],lm=new Map([["[:alnum:]",new fe(1,$C)],["[:^alnum:]",new fe(-1,$C)],["[:alpha:]",new fe(1,YC)],["[:^alpha:]",new fe(-1,YC)],["[:ascii:]",new fe(1,XC)],["[:^ascii:]",new fe(-1,XC)],["[:blank:]",new fe(1,ZC)],["[:^blank:]",new fe(-1,ZC)],["[:cntrl:]",new fe(1,em)],["[:^cntrl:]",new fe(-1,em)],["[:digit:]",new fe(1,tm)],["[:^digit:]",new fe(-1,tm)],["[:graph:]",new fe(1,nm)],["[:^graph:]",new fe(-1,nm)],["[:lower:]",new fe(1,rm)],["[:^lower:]",new fe(-1,rm)],["[:print:]",new fe(1,sm)],["[:^print:]",new fe(-1,sm)],["[:punct:]",new fe(1,im)],["[:^punct:]",new fe(-1,im)],["[:space:]",new fe(1,om)],["[:^space:]",new fe(-1,om)],["[:upper:]",new fe(1,am)],["[:^upper:]",new fe(-1,am)],["[:word:]",new fe(1,um)],["[:^word:]",new fe(-1,um)],["[:xdigit:]",new fe(1,cm)],["[:^xdigit:]",new fe(-1,cm)]]),wr=class fu{static charClassToString(e,t){let r="[";for(let s=0;s<t;s+=2){s>0&&(r+=" ");let i=e[s],o=e[s+1];i===o?r+=`0x${i.toString(16)}`:r+=`0x${i.toString(16)}-0x${o.toString(16)}`}return r+="]",r}static sortRanges(e,t){let r=t>>1,s=new Array(r);for(let o=0;o<r;o++)s[o]=o;s.sort((o,u)=>e[2*o]-e[2*u]||e[2*u+1]-e[2*o+1]);let i=e.slice(0,t);for(let o=0;o<r;o++)e[2*o]=i[2*s[o]],e[2*o+1]=i[2*s[o]+1]}constructor(e=K.emptyInts()){this.r=e,this.len=e.length}toArray(){return this.r instanceof Int32Array?this.len===this.r.length?this.r:this.r.subarray(0,this.len):new Int32Array(this.len===this.r.length?this.r:this.r.slice(0,this.len))}toGrowableArray(){return Array.isArray(this.r)?(this.r.length=this.len,this.r):Array.from(this.r.subarray(0,this.len))}cleanClass(){if(this.len<4)return this;fu.sortRanges(this.r,this.len);let e=2;for(let t=2;t<this.len;t+=2){let r=this.r[t],s=this.r[t+1];if(r<=this.r[e-1]+1){s>this.r[e-1]&&(this.r[e-1]=s);continue}this.r[e]=r,this.r[e+1]=s,e+=2}return this.len=e,this}appendLiteral(e,t){return(t&F.FOLD_CASE)!==0?this.appendFoldedRange(e,e):this.appendRange(e,e)}appendRange(e,t){if(this.len>0){for(let r=2;r<=4;r+=2)if(this.len>=r){let s=this.r[this.len-r],i=this.r[this.len-r+1];if(e<=i+1&&s<=t+1)return e<s&&(this.r[this.len-r]=e),t>i&&(this.r[this.len-r+1]=t),this}}return this.r[this.len++]=e,this.r[this.len++]=t,this}appendFoldedRange(e,t){if(e<=z.MIN_FOLD&&t>=z.MAX_FOLD)return this.appendRange(e,t);if(t<z.MIN_FOLD||e>z.MAX_FOLD)return this.appendRange(e,t);e<z.MIN_FOLD&&(this.appendRange(e,z.MIN_FOLD-1),e=z.MIN_FOLD),t>z.MAX_FOLD&&(this.appendRange(z.MAX_FOLD+1,t),t=z.MAX_FOLD);for(let r=e;r<=t;r++){this.appendRange(r,r);for(let s=z.simpleFold(r);s!==r;s=z.simpleFold(s))this.appendRange(s,s)}return this}appendClass(e){for(let t=0;t<e.length;t+=2)this.appendRange(e[t],e[t+1]);return this}appendFoldedClass(e){for(let t=0;t<e.length;t+=2)this.appendFoldedRange(e[t],e[t+1]);return this}appendNegatedClass(e){let t=0;for(let r=0;r<e.length;r+=2){let s=e[r],i=e[r+1];t<=s-1&&this.appendRange(t,s-1),t=i+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTable(e){for(let t=0;t<e.length;++t){let r=e.getLo(t),s=e.getHi(t),i=e.getStride(t);if(i===1){this.appendRange(r,s);continue}for(let o=r;o<=s;o+=i)this.appendRange(o,o)}return this}appendNegatedTable(e){let t=0;for(let r=0;r<e.length;++r){let s=e.getLo(r),i=e.getHi(r),o=e.getStride(r);if(o===1){t<=s-1&&this.appendRange(t,s-1),t=i+1;continue}for(let u=s;u<=i;u+=o)t<=u-1&&this.appendRange(t,u-1),t=u+1}return t<=z.MAX_RUNE&&this.appendRange(t,z.MAX_RUNE),this}appendTableWithSign(e,t){return t<0?this.appendNegatedTable(e):this.appendTable(e)}negateClass(){let e=0,t=0;for(let r=0;r<this.len;r+=2){let s=this.r[r],i=this.r[r+1];e<=s-1&&(this.r[t]=e,this.r[t+1]=s-1,t+=2),e=i+1}return this.len=t,e<=z.MAX_RUNE&&(this.r[this.len++]=e,this.r[this.len++]=z.MAX_RUNE),this}appendClassWithSign(e,t){return t<0?this.appendNegatedClass(e):this.appendClass(e)}appendGroup(e,t){let r=e.cls;return t&&(r=new fu().appendFoldedClass(r).cleanClass().toArray()),this.appendClassWithSign(r,e.sign)}toString(){return fu.charClassToString(this.r,this.len)}},HT=class{constructor(n){this.str=n,this.position=0}pos(){return this.position}rewindTo(n){this.position=n}more(){return this.position<this.str.length}peek(){return this.str.codePointAt(this.position)}skip(n){this.position+=n}skipString(n){this.position+=n.length}pop(){let n=this.str.codePointAt(this.position);return this.position+=K.charCount(n),n}lookingAt(n){return this.str.startsWith(n,this.position)}rest(){return this.str.substring(this.position)}from(n){return this.str.substring(n,this.position)}toString(){return this.rest()}},G,Xi=(G=class{static unicodeTable(e){return e==="Any"?{tab:G.ANY_TABLE,fold:G.ANY_TABLE,sign:1}:e==="Ascii"?{tab:G.ASCII_TABLE,fold:G.ASCII_FOLD_TABLE,sign:1}:e==="Assigned"?{tab:wt.CATEGORIES.get("Cn"),fold:wt.CATEGORIES.get("Cn"),sign:-1}:e==="Lc"?{tab:wt.CATEGORIES.get("LC"),fold:wt.FOLD_CATEGORIES.get("LC"),sign:1}:wt.CATEGORIES.has(e)?{tab:wt.CATEGORIES.get(e),fold:wt.FOLD_CATEGORIES.get(e),sign:1}:wt.SCRIPTS.has(e)?{tab:wt.SCRIPTS.get(e),fold:wt.FOLD_SCRIPT.get(e),sign:1}:null}static minFoldRune(e){if(e<z.MIN_FOLD||e>z.MAX_FOLD)return e;let t=e,r=e;for(e=z.simpleFold(e);e!==r;e=z.simpleFold(e))t>e&&(t=e);return t}static leadingRegexp(e){if(e.op===I.Op.EMPTY_MATCH)return null;if(e.op===I.Op.CONCAT&&e.subs.length>0){let t=e.subs[0];return t.op===I.Op.EMPTY_MATCH?null:t}return e}static literalRegexp(e,t){let r=new I(I.Op.LITERAL);return r.flags=t,r.runes=K.stringToRunes(e),r}static parse(e,t){return new G(e,t).parseInternal()}static parseRepeat(e){let t=e.pos();if(!e.more()||!e.lookingAt("{"))return-1;e.skip(1);let r=G.parseInt(e);if(r===-1||!e.more())return-1;let s;if(!e.lookingAt(","))s=r;else{if(e.skip(1),!e.more())return-1;if(e.lookingAt("}"))s=-1;else if((s=G.parseInt(e))===-1)return-1}if(!e.more()||!e.lookingAt("}"))return-1;if(e.skip(1),r<0||r>1e3||s===-2||s>1e3||s>=0&&r>s)throw new De(G.ERR_INVALID_REPEAT_SIZE,e.from(t));return r<<16|s&z.MAX_BMP}static isValidCaptureName(e){if(e.length===0)return!1;for(let t=0;t<e.length;t++){let r=e.codePointAt(t);if(r!==k.CODES._&&!K.isalnum(r))return!1}return!0}static parseInt(e){let t=e.pos();for(;e.more()&&e.peek()>=k.CODES[0]&&e.peek()<=k.CODES[9];)e.skip(1);let r=e.from(t);return r.length===0||r.length>1&&r.codePointAt(0)===k.CODES[0]?-1:r.length>8?-2:parseInt(r,10)}static isCharClass(e){return e.op===I.Op.LITERAL&&e.runes.length===1||e.op===I.Op.CHAR_CLASS||e.op===I.Op.ANY_CHAR_NOT_NL||e.op===I.Op.ANY_CHAR}static matchRune(e,t){switch(e.op){case I.Op.LITERAL:return e.runes.length===1&&e.runes[0]===t;case I.Op.CHAR_CLASS:for(let r=0;r<e.runes.length;r+=2)if(e.runes[r]<=t&&t<=e.runes[r+1])return!0;return!1;case I.Op.ANY_CHAR_NOT_NL:return t!==k.CODES[`
`];case I.Op.ANY_CHAR:return!0}return!1}static mergeCharClass(e,t){switch(e.op){case I.Op.ANY_CHAR:break;case I.Op.ANY_CHAR_NOT_NL:G.matchRune(t,k.CODES[`
`])&&(e.op=I.Op.ANY_CHAR);break;case I.Op.CHAR_CLASS:{let r=new wr(Array.isArray(e.runes)?e.runes:Array.from(e.runes));t.op===I.Op.LITERAL?r.appendLiteral(t.runes[0],t.flags):r.appendClass(t.runes),e.runes=r.toGrowableArray();break}case I.Op.LITERAL:if(t.runes[0]===e.runes[0]&&t.flags===e.flags)break;e.op=I.Op.CHAR_CLASS,e.runes=new wr().appendLiteral(e.runes[0],e.flags).appendLiteral(t.runes[0],t.flags).toGrowableArray()}}static parseEscape(e){let t=e.pos();if(e.skip(1),!e.more())throw new De(G.ERR_TRAILING_BACKSLASH);let r=e.pop();e:switch(r){case k.CODES[1]:case k.CODES[2]:case k.CODES[3]:case k.CODES[4]:case k.CODES[5]:case k.CODES[6]:case k.CODES[7]:if(!e.more()||e.peek()<k.CODES[0]||e.peek()>k.CODES[7])break;case k.CODES[0]:{let s=r-k.CODES[0];for(let i=1;i<3&&!(!e.more()||e.peek()<k.CODES[0]||e.peek()>k.CODES[7]);i++)s=s*8+e.peek()-k.CODES[0],e.skip(1);return s}case k.CODES.x:{if(!e.more())break;if(r=e.pop(),r===k.CODES["{"]){let o=0,u=0;for(;;){if(!e.more())break e;if(r=e.pop(),r===k.CODES["}"])break;let c=K.unhex(r);if(c<0||(u=u*16+c,u>z.MAX_RUNE))break e;o++}if(o===0)break e;return u}let s=K.unhex(r);if(!e.more())break;r=e.pop();let i=K.unhex(r);if(s<0||i<0)break;return s*16+i}case k.CODES.a:return k.CODES["\x07"];case k.CODES.f:return k.CODES["\f"];case k.CODES.n:return k.CODES[`
`];case k.CODES.r:return k.CODES["\r"];case k.CODES.t:return k.CODES["	"];case k.CODES.v:return k.CODES["\v"];default:if(r<=z.MAX_ASCII&&!K.isalnum(r))return r}throw new De(G.ERR_INVALID_ESCAPE,e.from(t))}static parseClassChar(e,t){if(!e.more())throw new De(G.ERR_MISSING_BRACKET,e.from(t));return e.lookingAt("\\")?G.parseEscape(e):e.pop()}static hasCapture(e){if(e===null)return!1;if(e.op===I.Op.CAPTURE)return!0;if(e.subs){for(let t of e.subs)if(G.hasCapture(t))return!0}return!1}constructor(e,t=0){this.wholeRegexp=e,this.flags=t,this.numCap=0,this.namedGroups=Object.create(null),this.stack=[],this.free=null,this.numRegexp=0,this.numRunes=0,this.repeats=0,this.height=null,this.size=null,this.nlb=0}newRegexp(e){let t=this.free;return t!==null&&t.subs!==null&&t.subs.length>0?(this.free=t.subs[0],t.reinit(),t.op=e):(t=new I(e),this.numRegexp+=1),t}reuse(e){this.height!==null&&this.height.has(e)&&this.height.delete(e),e.subs!==null&&e.subs.length>0&&(e.subs[0]=this.free),this.free=e}checkLimits(e){if(this.numRunes>G.MAX_RUNES)throw new De(G.ERR_LARGE);this.checkSize(e),this.checkHeight(e)}checkSize(e){if(this.size===null){if(this.repeats===0&&(this.repeats=1),e.op===I.Op.REPEAT){let t=e.max;t===-1&&(t=e.min),t<=0&&(t=1),t>Math.floor(G.MAX_SIZE/this.repeats)?this.repeats=G.MAX_SIZE:this.repeats*=t}if(this.numRegexp<Math.floor(G.MAX_SIZE/this.repeats))return;this.size=new Map;for(let t of this.stack)this.checkSize(t)}if(this.calcSize(e,!0)>G.MAX_SIZE)throw new De(G.ERR_LARGE)}calcSize(e,t=!1){if(!t&&this.size!==null&&this.size.has(e))return this.size.get(e);let r=0;switch(e.op){case I.Op.LITERAL:r=e.runes.length;break;case I.Op.PLB:case I.Op.NLB:case I.Op.CAPTURE:case I.Op.STAR:r=2+this.calcSize(e.subs[0]);break;case I.Op.PLUS:case I.Op.QUEST:r=1+this.calcSize(e.subs[0]);break;case I.Op.CONCAT:for(let s of e.subs)r=r+this.calcSize(s);break;case I.Op.ALTERNATE:for(let s of e.subs)r=r+this.calcSize(s);e.subs.length>1&&(r=r+e.subs.length-1);break;case I.Op.REPEAT:{let s=this.calcSize(e.subs[0]);if(e.max===-1){e.min===0?r=2+s:r=1+e.min*s;break}r=e.max*s+(e.max-e.min);break}}return r=Math.max(1,r),this.size===null&&(this.size=new Map),this.size.set(e,r),r}checkHeight(e){if(!(this.numRegexp<G.MAX_HEIGHT)){if(this.height===null){this.height=new Map;for(let t of this.stack)this.checkHeight(t)}if(this.calcHeight(e,!0)>G.MAX_HEIGHT)throw new De(G.ERR_NESTING_DEPTH)}}calcHeight(e,t=!1){if(!t&&this.height!==null&&this.height.has(e))return this.height.get(e);let r=1;for(let s of e.subs){let i=this.calcHeight(s);r<1+i&&(r=1+i)}return this.height===null&&(this.height=new Map),this.height.set(e,r),r}pop(){return this.stack.pop()}popToPseudo(){let e=this.stack.length,t=e;for(;t>0&&!I.isPseudoOp(this.stack[t-1].op);)t--;return this.stack.splice(t,e-t)}push(e){if(this.numRunes+=e.runes.length,e.op===I.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]===e.runes[1]){if(this.maybeConcat(e.runes[0],this.flags&~F.FOLD_CASE))return null;e.op=I.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags&~F.FOLD_CASE}else if(e.op===I.Op.CHAR_CLASS&&e.runes.length===4&&e.runes[0]===e.runes[1]&&e.runes[2]===e.runes[3]&&z.simpleFold(e.runes[0])===e.runes[2]&&z.simpleFold(e.runes[2])===e.runes[0]||e.op===I.Op.CHAR_CLASS&&e.runes.length===2&&e.runes[0]+1===e.runes[1]&&z.simpleFold(e.runes[0])===e.runes[1]&&z.simpleFold(e.runes[1])===e.runes[0]){if(this.maybeConcat(e.runes[0],this.flags|F.FOLD_CASE))return null;e.op=I.Op.LITERAL,e.runes=[e.runes[0]],e.flags=this.flags|F.FOLD_CASE}else this.maybeConcat(-1,0);return this.stack.push(e),this.checkLimits(e),e}maybeConcat(e,t){let r=this.stack.length;if(r<2)return!1;let s=this.stack[r-1],i=this.stack[r-2];if(s.op!==I.Op.LITERAL||i.op!==I.Op.LITERAL||(s.flags&F.FOLD_CASE)!==(i.flags&F.FOLD_CASE))return!1;Array.isArray(i.runes)||(i.runes=Array.from(i.runes));for(let o=0;o<s.runes.length;o++)i.runes.push(s.runes[o]);return e>=0?(s.runes=[e],s.flags=t,!0):(this.pop(),this.reuse(s),!1)}newLiteral(e,t){let r=this.newRegexp(I.Op.LITERAL);return r.flags=t,(t&F.FOLD_CASE)!==0&&(e=G.minFoldRune(e)),r.runes=[e],r}literal(e){this.push(this.newLiteral(e,this.flags))}op(e){let t=this.newRegexp(e);return t.flags=this.flags,this.push(t)}repeat(e,t,r,s,i,o){let u=this.flags;if((u&F.PERL_X)!==0&&(i.more()&&i.lookingAt("?")&&(i.skip(1),u^=F.NON_GREEDY),o!==-1))throw new De(G.ERR_INVALID_REPEAT_OP,i.from(o));let c=this.stack.length;if(c===0)throw new De(G.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let l=this.stack[c-1];if(I.isPseudoOp(l.op))throw new De(G.ERR_MISSING_REPEAT_ARGUMENT,i.from(s));let B=this.newRegexp(e);if(B.min=t,B.max=r,B.flags=u,B.subs=[l],this.stack[c-1]=B,this.checkLimits(B),e===I.Op.REPEAT&&(t>=2||r>=2)&&!this.repeatIsValid(B,1e3))throw new De(G.ERR_INVALID_REPEAT_SIZE,i.from(s))}repeatIsValid(e,t){if(e.op===I.Op.REPEAT){let r=e.max;if(r===0)return!0;if(r<0&&(r=e.min),r>t)return!1;r>0&&(t=Math.trunc(t/r))}for(let r of e.subs)if(!this.repeatIsValid(r,t))return!1;return!0}concat(){this.maybeConcat(-1,0);let e=this.popToPseudo();return e.length===0?this.push(this.newRegexp(I.Op.EMPTY_MATCH)):this.push(this.collapse(e,I.Op.CONCAT))}alternate(){let e=this.popToPseudo();return e.length>0&&this.cleanAlt(e[e.length-1]),e.length===0?this.push(this.newRegexp(I.Op.NO_MATCH)):this.push(this.collapse(e,I.Op.ALTERNATE))}cleanAlt(e){e.op===I.Op.CHAR_CLASS&&(e.runes=new wr(Array.from(e.runes)).cleanClass().toArray(),e.runes.length===2&&e.runes[0]===0&&e.runes[1]===z.MAX_RUNE?(e.runes=new Int32Array(0),e.op=I.Op.ANY_CHAR):e.runes.length===4&&e.runes[0]===0&&e.runes[1]===k.CODES[`
`]-1&&e.runes[2]===k.CODES[`
`]+1&&e.runes[3]===z.MAX_RUNE&&(e.runes=new Int32Array(0),e.op=I.Op.ANY_CHAR_NOT_NL))}collapse(e,t){if(e.length===1)return e[0];let r=0;for(let u of e)r+=u.op===t?u.subs.length:1;let s=new Array(r).fill(null),i=0;for(let u of e)if(u.op===t){for(let c=0;c<u.subs.length;c++)s[i++]=u.subs[c];this.reuse(u)}else s[i++]=u;let o=this.newRegexp(t);if(o.subs=s,t===I.Op.ALTERNATE&&(o.subs=this.factor(o.subs),o.subs.length===1)){let u=o;o=o.subs[0],this.reuse(u)}return o}factor(e){if(e.length<2)return e;let t=0,r=e.length,s=0,i=null,o=0,u=0,c=0;for(let B=0;B<=r;B++){let d=null,g=0,w=0;if(B<r){let D=e[t+B];if(D.op===I.Op.CONCAT&&D.subs.length>0&&(D=D.subs[0]),D.op===I.Op.LITERAL&&(d=D.runes,g=D.runes.length,w=D.flags&F.FOLD_CASE),w===u){let P=0;for(;P<o&&P<g&&i[P]===d[P];)P++;if(P>0){o=P;continue}}}if(B!==c)if(B===c+1)e[s++]=e[t+c];else{let D=this.newRegexp(I.Op.LITERAL);D.flags=u,D.runes=i.slice(0,o);for(let j=c;j<B;j++)e[t+j]=this.removeLeadingString(e[t+j],o),this.checkLimits(e[t+j]);let P=this.collapse(e.slice(t+c,t+B),I.Op.ALTERNATE),V=this.newRegexp(I.Op.CONCAT);V.subs=[D,P],e[s++]=V}c=B,i=d,o=g,u=w}r=s,t=0,c=0,s=0;let l=null;for(let B=0;B<=r;B++){let d=null;if(!(B<r&&(d=G.leadingRegexp(e[t+B]),l!==null&&l.equals(d)&&(G.isCharClass(l)||l.op===I.Op.REPEAT&&l.min===l.max&&G.isCharClass(l.subs[0]))))){if(B!==c)if(B===c+1)e[s++]=e[t+c];else{let g=l;for(let P=c;P<B;P++){let V=P!==c;e[t+P]=this.removeLeadingRegexp(e[t+P],V),this.checkLimits(e[t+P])}let w=this.collapse(e.slice(t+c,t+B),I.Op.ALTERNATE),D=this.newRegexp(I.Op.CONCAT);D.subs=[g,w],e[s++]=D}c=B,l=d}}r=s,t=0,c=0,s=0;for(let B=0;B<=r;B++)if(!(B<r&&G.isCharClass(e[t+B]))){if(B!==c)if(B===c+1)e[s++]=e[t+c];else{let d=c;for(let w=c+1;w<B;w++){let D=e[t+d],P=e[t+w];(D.op<P.op||D.op===P.op&&(D.runes!==null?D.runes.length:0)<(P.runes!==null?P.runes.length:0))&&(d=w)}let g=e[t+c];e[t+c]=e[t+d],e[t+d]=g;for(let w=c+1;w<B;w++)G.mergeCharClass(e[t+c],e[t+w]),this.reuse(e[t+w]);this.cleanAlt(e[t+c]),e[s++]=e[t+c]}B<r&&(e[s++]=e[t+B]),c=B+1}r=s,t=0,c=0,s=0;for(let B=0;B<r;++B)B+1<r&&e[t+B].op===I.Op.EMPTY_MATCH&&e[t+B+1].op===I.Op.EMPTY_MATCH||(e[s++]=e[t+B]);return r=s,t=0,e.slice(t,r)}removeLeadingString(e,t){if(e.op===I.Op.CONCAT&&e.subs.length>0){let r=this.removeLeadingString(e.subs[0],t);if(e.subs[0]=r,r.op===I.Op.EMPTY_MATCH)switch(this.reuse(r),e.subs.length){case 0:case 1:e.op=I.Op.EMPTY_MATCH,e.subs=I.emptySubs();break;case 2:{let s=e;e=e.subs[1],this.reuse(s);break}default:e.subs=e.subs.slice(1,e.subs.length)}return e}return e.op===I.Op.LITERAL&&(e.runes=e.runes.slice(t,e.runes.length),e.runes.length===0&&(e.op=I.Op.EMPTY_MATCH)),e}removeLeadingRegexp(e,t){if(e.op===I.Op.CONCAT&&e.subs.length>0){switch(t&&this.reuse(e.subs[0]),e.subs=e.subs.slice(1,e.subs.length),e.subs.length){case 0:e.op=I.Op.EMPTY_MATCH,e.subs=I.emptySubs();break;case 1:{let r=e;e=e.subs[0],this.reuse(r);break}}return e}return t&&this.reuse(e),this.newRegexp(I.Op.EMPTY_MATCH)}parseInternal(){if((this.flags&F.LITERAL)!==0)return G.literalRegexp(this.wholeRegexp,this.flags);let e=-1,t=-1,r=-1,s=new HT(this.wholeRegexp);for(;s.more();){let i=-1;e:switch(s.peek()){case k.CODES["("]:if((this.flags&F.LOOKBEHIND)!==0){if(s.lookingAt("(?<=")){this.parsePosLookBehind(),s.skip(4);break}if(s.lookingAt("(?<!")){this.parseNegLookBehind(),s.skip(4);break}}if((this.flags&F.PERL_X)!==0&&s.lookingAt("(?")){this.parsePerlFlags(s);break}this.op(I.Op.LEFT_PAREN).cap=++this.numCap,s.skip(1);break;case k.CODES["|"]:this.parseVerticalBar(),s.skip(1);break;case k.CODES[")"]:this.parseRightParen(),s.skip(1);break;case k.CODES["^"]:(this.flags&F.ONE_LINE)!==0?this.op(I.Op.BEGIN_TEXT):this.op(I.Op.BEGIN_LINE),s.skip(1);break;case k.CODES.$:(this.flags&F.ONE_LINE)!==0?this.op(I.Op.END_TEXT).flags|=F.WAS_DOLLAR:this.op(I.Op.END_LINE),s.skip(1);break;case k.CODES["."]:(this.flags&F.DOT_NL)!==0?this.op(I.Op.ANY_CHAR):this.op(I.Op.ANY_CHAR_NOT_NL),s.skip(1);break;case k.CODES["["]:this.parseClass(s);break;case k.CODES["*"]:case k.CODES["+"]:case k.CODES["?"]:{i=s.pos();let o=null;switch(s.pop()){case k.CODES["*"]:o=I.Op.STAR;break;case k.CODES["+"]:o=I.Op.PLUS;break;case k.CODES["?"]:o=I.Op.QUEST}this.repeat(o,t,r,i,s,e);break}case k.CODES["{"]:{let o=s.pos(),u=G.parseRepeat(s);if(u<0){s.rewindTo(o),this.literal(s.pop());break}i=o,t=u>>16,r=(u&z.MAX_BMP)<<16>>16,this.repeat(I.Op.REPEAT,t,r,i,s,e);break}case k.CODES["\\"]:{let o=s.pos();if(s.skip(1),(this.flags&F.PERL_X)!==0&&s.more())switch(s.pop()){case k.CODES.A:this.op(I.Op.BEGIN_TEXT);break e;case k.CODES.b:this.op(I.Op.WORD_BOUNDARY);break e;case k.CODES.B:this.op(I.Op.NO_WORD_BOUNDARY);break e;case k.CODES.C:throw new De(G.ERR_INVALID_ESCAPE,"\\C");case k.CODES.Q:{let l=s.rest(),B=l.indexOf("\\E");B>=0?(l=l.substring(0,B),s.skipString(l),s.skipString("\\E")):s.skipString(l);let d=0;for(;d<l.length;){let g=l.codePointAt(d);this.literal(g),d+=K.charCount(g)}break e}case k.CODES.z:this.op(I.Op.END_TEXT);break e;default:s.rewindTo(o)}else s.rewindTo(o);let u=this.newRegexp(I.Op.CHAR_CLASS);if(u.flags=this.flags,s.lookingAt("\\p")||s.lookingAt("\\P")){let l=new wr;if(this.parseUnicodeClass(s,l)){u.runes=l.toArray(),this.push(u);break e}}let c=new wr;if(this.parsePerlClassEscape(s,c)){u.runes=c.toArray(),this.push(u);break e}s.rewindTo(o),this.reuse(u),this.literal(G.parseEscape(s));break}default:this.literal(s.pop())}e=i}if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length!==1)throw new De(G.ERR_MISSING_PAREN,this.wholeRegexp);return this.stack[0].namedGroups=this.namedGroups,this.stack[0]}parsePerlFlags(e){let t=e.pos(),r=e.rest();if(r.startsWith("(?P<")||r.startsWith("(?<")){let u=r.charAt(2)==="P"?4:3,c=r.indexOf(">");if(c<0)throw new De(G.ERR_INVALID_NAMED_CAPTURE,r);let l=r.substring(u,c);if(e.skipString(l),e.skip(u+1),!G.isValidCaptureName(l))throw new De(G.ERR_INVALID_NAMED_CAPTURE,r.substring(0,c+1));let B=this.op(I.Op.LEFT_PAREN);if(B.cap=++this.numCap,this.namedGroups[l])throw new De(G.ERR_DUPLICATE_NAMED_CAPTURE,l);this.namedGroups[l]=this.numCap,B.name=l;return}e.skip(2);let s=this.flags,i=1,o=!1;e:for(;e.more();){let u=e.pop();switch(u){case k.CODES.i:s|=F.FOLD_CASE,o=!0;break;case k.CODES.m:s&=~F.ONE_LINE,o=!0;break;case k.CODES.s:s|=F.DOT_NL,o=!0;break;case k.CODES.U:s|=F.NON_GREEDY,o=!0;break;case k.CODES["-"]:if(i<0)break e;i=-1,s=~s,o=!1;break;case k.CODES[":"]:case k.CODES[")"]:if(i<0){if(!o)break e;s=~s}u===k.CODES[":"]&&this.op(I.Op.LEFT_PAREN),this.flags=s;return;default:break e}}throw new De(G.ERR_INVALID_PERL_OP,e.from(t))}parsePosLookBehind(){let e=this.newRegexp(I.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=++this.nlb,this.push(e)}parseNegLookBehind(){let e=this.newRegexp(I.Op.LEFT_PAREN);return e.flags=this.flags,e.lb=-++this.nlb,this.push(e)}parseVerticalBar(){this.concat(),this.swapVerticalBar()||this.op(I.Op.VERTICAL_BAR)}swapVerticalBar(){let e=this.stack.length;if(e>=3&&this.stack[e-2].op===I.Op.VERTICAL_BAR&&G.isCharClass(this.stack[e-1])&&G.isCharClass(this.stack[e-3])){let t=this.stack[e-1],r=this.stack[e-3];if(t.op>r.op){let s=r;r=t,t=s,this.stack[e-3]=r}return G.mergeCharClass(r,t),this.reuse(t),this.pop(),!0}if(e>=2){let t=this.stack[e-1],r=this.stack[e-2];if(r.op===I.Op.VERTICAL_BAR)return e>=3&&this.cleanAlt(this.stack[e-3]),this.stack[e-2]=t,this.stack[e-1]=r,!0}return!1}parseRightParen(){if(this.concat(),this.swapVerticalBar()&&this.pop(),this.alternate(),this.stack.length<2)throw new De(G.ERR_UNEXPECTED_PAREN,this.wholeRegexp);let e=this.pop(),t=this.pop();if(t.op!==I.Op.LEFT_PAREN)throw new De(G.ERR_UNEXPECTED_PAREN,this.wholeRegexp);if(this.flags=t.flags,t.lb!==0){if(G.hasCapture(e))throw new De(G.ERR_INVALID_CAPTURE_IN_LOOKBEHIND,this.wholeRegexp);t.lb>0?t.op=I.Op.PLB:t.op=I.Op.NLB,t.subs=[e],this.push(t);return}t.cap===0?this.push(e):(t.op=I.Op.CAPTURE,t.subs=[e],this.push(t))}parsePerlClassEscape(e,t){let r=e.pos();if((this.flags&F.PERL_X)===0||!e.more()||e.pop()!==k.CODES["\\"]||!e.more())return!1;e.pop();let s=e.from(r),i=QC.has(s)?QC.get(s):null;return i===null?!1:(t.appendGroup(i,(this.flags&F.FOLD_CASE)!==0),!0)}parseNamedClass(e,t){let r=e.rest(),s=r.indexOf(":]");if(s<0)return!1;let i=r.substring(0,s+2);e.skipString(i);let o=lm.has(i)?lm.get(i):null;if(o===null)throw new De(G.ERR_INVALID_CHAR_RANGE,i);return t.appendGroup(o,(this.flags&F.FOLD_CASE)!==0),!0}parseUnicodeClass(e,t){let r=e.pos();if((this.flags&F.UNICODE_GROUPS)===0||!e.lookingAt("\\p")&&!e.lookingAt("\\P"))return!1;e.skip(1);let s=1,i=e.pop();if(i===k.CODES.P&&(s=-1),!e.more())throw e.rewindTo(r),new De(G.ERR_INVALID_CHAR_RANGE,e.rest());i=e.pop();let o;if(i!==k.CODES["{"])o=K.runeToString(i);else{let B=e.rest(),d=B.indexOf("}");if(d<0)throw e.rewindTo(r),new De(G.ERR_INVALID_CHAR_RANGE,e.rest());o=B.substring(0,d),e.skipString(o),e.skip(1)}o.length!==0&&o.codePointAt(0)===k.CODES["^"]&&(s=0-s,o=o.substring(1));let u=G.unicodeTable(o);if(u===null)throw new De(G.ERR_INVALID_CHAR_RANGE,e.from(r));u.sign<0&&(s=0-s);let c=u.tab,l=u.fold;if((this.flags&F.FOLD_CASE)===0||l===null)t.appendTableWithSign(c,s);else{let B=new wr().appendTable(c).appendTable(l).cleanClass().toArray();t.appendClassWithSign(Array.from(B),s)}return!0}parseClass(e){let t=e.pos();e.skip(1);let r=this.newRegexp(I.Op.CHAR_CLASS);r.flags=this.flags;let s=new wr,i=1;e.more()&&e.lookingAt("^")&&(i=-1,e.skip(1),(this.flags&F.CLASS_NL)===0&&s.appendRange(k.CODES[`
`],k.CODES[`
`]));let o=!0;for(;!e.more()||e.peek()!==k.CODES["]"]||o;){if(e.more()&&e.lookingAt("-")&&(this.flags&F.PERL_X)===0&&!o){let B=e.rest();if(B==="-"||!B.startsWith("-]"))throw e.rewindTo(t),new De(G.ERR_INVALID_CHAR_RANGE,e.rest())}o=!1;let u=e.pos();if(e.lookingAt("[:")){if(this.parseNamedClass(e,s))continue;e.rewindTo(u)}if(this.parseUnicodeClass(e,s)||this.parsePerlClassEscape(e,s))continue;e.rewindTo(u);let c=G.parseClassChar(e,t),l=c;if(e.more()&&e.lookingAt("-")){if(e.skip(1),e.more()&&e.lookingAt("]"))e.skip(-1);else if(l=G.parseClassChar(e,t),l<c)throw new De(G.ERR_INVALID_CHAR_RANGE,e.from(u))}(this.flags&F.FOLD_CASE)===0?s.appendRange(c,l):s.appendFoldedRange(c,l)}e.skip(1),s.cleanClass(),i<0&&s.negateClass(),r.runes=s.toArray(),this.push(r)}},M(G,"ERR_INTERNAL_ERROR","regexp/syntax: internal error"),M(G,"ERR_INVALID_CHAR_RANGE","invalid character class range"),M(G,"ERR_INVALID_ESCAPE","invalid escape sequence"),M(G,"ERR_INVALID_NAMED_CAPTURE","invalid named capture"),M(G,"ERR_INVALID_PERL_OP","invalid or unsupported Perl syntax"),M(G,"ERR_INVALID_REPEAT_OP","invalid nested repetition operator"),M(G,"ERR_INVALID_REPEAT_SIZE","invalid repeat count"),M(G,"ERR_MISSING_BRACKET","missing closing ]"),M(G,"ERR_MISSING_PAREN","missing closing )"),M(G,"ERR_MISSING_REPEAT_ARGUMENT","missing argument to repetition operator"),M(G,"ERR_TRAILING_BACKSLASH","trailing backslash at end of expression"),M(G,"ERR_DUPLICATE_NAMED_CAPTURE","duplicate capture group name"),M(G,"ERR_UNEXPECTED_PAREN","unexpected )"),M(G,"ERR_NESTING_DEPTH","expression nests too deeply"),M(G,"ERR_LARGE","expression too large"),M(G,"ERR_INVALID_CAPTURE_IN_LOOKBEHIND","invalid capture in lookbehind"),M(G,"MAX_HEIGHT",1e3),M(G,"MAX_SIZE",1398101),M(G,"MAX_RUNES",33554432),M(G,"ANY_TABLE",new C(new Uint32Array([0,z.MAX_RUNE,1]))),M(G,"ASCII_TABLE",new C(new Uint32Array([0,127,1]))),M(G,"ASCII_FOLD_TABLE",new C(new Uint32Array([0,127,1,383,383,1,8490,8490,1]))),G),qT=class Ir{static initTest(e){let t=Ir.compile(e),r=new Ir(t.expr,t.prog,t.numSubexp,t.longest);return r.cond=t.cond,r.prefix=t.prefix,r.prefixUTF8=t.prefixUTF8,r.prefixComplete=t.prefixComplete,r.prefixRune=t.prefixRune,r.prefilter=t.prefilter,r.namedGroups=t.namedGroups,r}static compile(e){return Ir.compileImpl(e,F.PERL,!1)}static compilePOSIX(e){return Ir.compileImpl(e,F.POSIX,!0)}static compileImpl(e,t,r){let s=Xi.parse(e,t),i=s.maxCap(),o=s.namedGroups;s=ym.simplify(s);let u=MT.build(s),c=Em.compileRegexp(s),l=new Ir(e,c,i,r);l.prefilter=u.type===ie.Type.NONE?null:u;let[B,d]=c.prefix();return l.prefixComplete=B,l.prefix=d,l.prefixUTF8=K.stringToUtf8ByteArray(l.prefix),l.prefix.length>0&&(l.prefixRune=l.prefix.codePointAt(0)),l.namedGroups=o,l}static match(e,t){return Ir.compile(e).match(t)}constructor(e,t,r=0,s=0){this.expr=e,this.prog=t,this.numSubexp=r,this.longest=s,this.cond=t.startCond(),this.prefix=null,this.prefixUTF8=null,this.prefixComplete=!1,this.prefixRune=0,this.namedGroups=Object.create(null),this.machinePool=[],this.lazyDFA=null,this.onepass=qC.compile(this.prog),this.prefilter=null}get dfa(){return this.lazyDFA===null&&(this.lazyDFA=new Dh(this.prog)),this.lazyDFA}matchPrefixComplete(e,t,r,s){if((r===F.ANCHOR_START||r===F.ANCHOR_BOTH)&&t!==0)return null;let i=-1,o=-1,u=e.prefixLength(this);if(r===F.UNANCHORED){let c=e.index(this,t);if(c<0)return null;i=t+c,o=i+u}else if(r===F.ANCHOR_BOTH){if(e.endPos()!==u||e.index(this,0)!==0)return null;i=0,o=u}else if(r===F.ANCHOR_START){if(e.index(this,0)!==0)return null;i=0,o=u}if(i<0)return null;if(s>0){let c=new Int32Array(s).fill(-1);return c[0]=i,c[1]=o,Array.from(c)}return[]}createLookbehindState(){return this.prog.numLb>0?new vT(this.prog):null}executeEngine(e,t,r,s,i=null){if(this.prefixComplete&&(s===0||this.numSubexp===0))return this.matchPrefixComplete(e,t,r,s);if(this.prefilter!==null&&r===F.UNANCHORED&&!this.prefilter.eval(e,t))return null;if(this.onepass!==null)return qC.execute(this,e,t,r,s);if(s>0)return this.prog.numLb===0&&e.endPos()<=hu.maxBitStateLen(this.prog)?hu.execute(this,e,t,r,s):this.doExecuteNFA(e,t,r,s,i);if(this.prog.numLb===0){let o=this.dfa.match(e,t,r);if(o!==null)return o?[]:null;if(e.endPos()<=hu.maxBitStateLen(this.prog))return hu.execute(this,e,t,r,s)}return this.doExecuteNFA(e,t,r,s,i)}numberOfCapturingGroups(){return this.numSubexp}numberOfInstructions(){return this.prog.numInst()}get(){return this.machinePool.length>0?this.machinePool.pop():null}reset(){this.machinePool.length=0}put(e){this.machinePool.push(e)}toString(){return this.expr}doExecuteNFA(e,t,r,s,i=null){let o=this.get();o||(o=gm.fromRE2(this)),o.init(s);let u=o.match(e,t,r,i)?o.submatches():null;return this.put(o),u}match(e){return this.executeEngine(we.fromUTF16(e),0,F.UNANCHORED,0)!==null}matchWithGroup(e,t,r,s,i,o=null){return e instanceof br||(K.isByteArray(e)?e=Dr.utf8(e):e=Dr.utf16(e)),this.matchMachineInput(e,t,r,s,i,o)}matchMachineInput(e,t,r,s,i,o=null){if(t>r)return[!1,null];let u=e.isUTF16Encoding()?we.fromUTF16(e.asCharSequence(),0,r):we.fromUTF8(e.asBytes(),0,r),c=this.executeEngine(u,t,s,2*i,o);return c===null?[!1,null]:[!0,c]}matchUTF8(e){return this.executeEngine(we.fromUTF8(e),0,F.UNANCHORED,0)!==null}replaceAll(e,t){return this.replaceAllFunc(e,()=>t,2*e.length+1)}replaceFirst(e,t){return this.replaceAllFunc(e,()=>t,1)}replaceAllFunc(e,t,r){let s=0,i=0,o="",u=we.fromUTF16(e),c=this.createLookbehindState(),l=0;for(;i<=e.length;){let B=this.executeEngine(u,i,F.UNANCHORED,2,c);if(B===null||B.length===0)break;o+=e.substring(s,B[0]),(B[1]>s||B[0]===0)&&(o+=t(e.substring(B[0],B[1])),l++),s=B[1];let d=u.step(i)&7;if(i+d>B[1]?i+=d:i+1>B[1]?i++:i=B[1],l>=r)break}return o+=e.substring(s),o}pad(e){if(e===null)return null;let t=(1+this.numSubexp)*2;if(e.length<t){let r=new Array(t).fill(-1);for(let s=0;s<e.length;s++)r[s]=e[s];e=r}return e}allMatches(e,t,r=s=>s){let s=[],i=e.endPos();t<0&&(t=i+1);let o=0,u=0,c=-1,l=this.createLookbehindState();for(;u<t&&o<=i;){let B=this.executeEngine(e,o,F.UNANCHORED,this.prog.numCap,l);if(B===null||B.length===0)break;let d=!0;if(B[1]===o){B[0]===c&&(d=!1);let g=e.step(o);g<0?o=i+1:o+=g&7}else o=B[1];c=B[1],d&&(s.push(r(this.pad(B))),u++)}return s}findUTF8(e){let t=this.executeEngine(we.fromUTF8(e),0,F.UNANCHORED,2);return t===null?null:e.slice(t[0],t[1])}findUTF8Index(e){let t=this.executeEngine(we.fromUTF8(e),0,F.UNANCHORED,2);return t===null?null:t.slice(0,2)}find(e){let t=this.executeEngine(we.fromUTF16(e),0,F.UNANCHORED,2);return t===null?"":e.substring(t[0],t[1])}findIndex(e){return this.executeEngine(we.fromUTF16(e),0,F.UNANCHORED,2)}findUTF8Submatch(e){let t=this.executeEngine(we.fromUTF8(e),0,F.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.slice(t[2*s],t[2*s+1]));return r}findUTF8SubmatchIndex(e){return this.pad(this.executeEngine(we.fromUTF8(e),0,F.UNANCHORED,this.prog.numCap))}findSubmatch(e){let t=this.executeEngine(we.fromUTF16(e),0,F.UNANCHORED,this.prog.numCap);if(t===null)return null;let r=new Array(1+this.numSubexp).fill(null);for(let s=0;s<r.length;s++)2*s<t.length&&t[2*s]>=0&&(r[s]=e.substring(t[2*s],t[2*s+1]));return r}findSubmatchIndex(e){return this.pad(this.executeEngine(we.fromUTF16(e),0,F.UNANCHORED,this.prog.numCap))}findAllUTF8(e,t){let r=this.allMatches(we.fromUTF8(e),t,s=>e.slice(s[0],s[1]));return r.length===0?null:r}findAllUTF8Index(e,t){let r=this.allMatches(we.fromUTF8(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAll(e,t){let r=this.allMatches(we.fromUTF16(e),t,s=>e.substring(s[0],s[1]));return r.length===0?null:r}findAllIndex(e,t){let r=this.allMatches(we.fromUTF16(e),t,s=>s.slice(0,2));return r.length===0?null:r}findAllUTF8Submatch(e,t){let r=this.allMatches(we.fromUTF8(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.slice(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllUTF8SubmatchIndex(e,t){let r=this.allMatches(we.fromUTF8(e),t);return r.length===0?null:r}findAllSubmatch(e,t){let r=this.allMatches(we.fromUTF16(e),t,s=>{let i=new Array(s.length/2|0).fill(null);for(let o=0;o<i.length;o++)s[2*o]>=0&&(i[o]=e.substring(s[2*o],s[2*o+1]));return i});return r.length===0?null:r}findAllSubmatchIndex(e,t){let r=this.allMatches(we.fromUTF16(e),t);return r.length===0?null:r}},Ut,ZR=(Ut=class{constructor(e=Ut.UNANCHORED,t=0,r=8388608){this.anchor=e,this.jsFlags=t,this.maxMem=r;let s=F.PERL;(t&Mt.DISABLE_UNICODE_GROUPS)!==0&&(s&=~F.UNICODE_GROUPS),(t&Mt.LOOKBEHINDS)!==0&&(s|=F.LOOKBEHIND),this.re2Flags=s,this.regexps=[],this.prog=null,this.dfa=null,this.dummyRe2=null}add(e){if(this.prog)throw new Zi("Cannot add patterns after compile");let t=e;(this.jsFlags&Mt.CASE_INSENSITIVE)!==0&&(t=`(?i)${t}`),(this.jsFlags&Mt.DOTALL)!==0&&(t=`(?s)${t}`),(this.jsFlags&Mt.MULTILINE)!==0&&(t=`(?m)${t}`);let r=Xi.parse(t,this.re2Flags);return this.regexps.push(ym.simplify(r)),this.regexps.length-1}compile(){if(this.prog)return;let e=Em.compileSet(this.regexps);if(e.numInst()>Xi.MAX_SIZE)throw new Zi(`${Xi.ERR_LARGE}: the set compiles to ${e.numInst()} instructions, more than ${Xi.MAX_SIZE}`);this.prog=e,this.dfa=new Dh(this.prog,this.maxMem),this.dummyRe2={prog:this.prog,cond:this.prog.startCond(),prefix:"",prefixRune:0,longest:!1}}match(e){this.prog||this.compile();let t=K.isByteArray(e)?we.fromUTF8(e):we.fromUTF16(e),r=F.UNANCHORED;this.anchor===Ut.ANCHOR_START?r=F.ANCHOR_START:this.anchor===Ut.ANCHOR_BOTH&&(r=F.ANCHOR_BOTH);let s=this.dfa.matchSet(t,0,r);if(s!==null)return s;let i=gm.fromRE2(this.dummyRe2);return i.init(0),i.matchSet(t,0,r)}},M(Ut,"UNANCHORED",F.UNANCHORED),M(Ut,"ANCHOR_START",F.ANCHOR_START),M(Ut,"ANCHOR_BOTH",F.ANCHOR_BOTH),Ut),jT=class Cs{static isHexadecimal(e){return"0"<=e&&e<="9"||"A"<=e&&e<="F"||"a"<=e&&e<="f"}static translate(e){let t="";if(e instanceof RegExp&&(e.ignoreCase&&(t+="i"),e.multiline&&(t+="m"),e.dotAll&&(t+="s"),e=e.source),typeof e!="string")return e;let r="",s=!1,i=e.length;i===0&&(r="(?:)",s=!0);let o=!1,u=0;for(;u<i;){let l=e[u];if(l==="\\"){if(u+1<i)switch(l=e[u+1],l){case"\\":r+="\\\\",u+=2;continue;case"c":if(u+2<i){let g=e[u+2].charCodeAt(0);if(g>=65&&g<=90||g>=97&&g<=122){let w=g%32;r+="\\x",r+=(w>>4).toString(16).toUpperCase(),r+=(w&15).toString(16).toUpperCase(),u+=3,s=!0;continue}}r+="c",u+=2,s=!0;continue;case"u":if(u+2<i){if(e[u+2]==="{"){let g=u+3,w=!1,D=!1;for(;g<i;){let P=e[g];if(P==="}"){D=!0;break}if(!Cs.isHexadecimal(P))break;w=!0,g++}if(D&&w){r+="\\x",u+=2,s=!0;continue}}else if(u+5<i){let g=!0;for(let w=0;w<4;w++)if(!Cs.isHexadecimal(e[u+2+w])){g=!1;break}if(g){r+="\\x{"+e.substring(u+2,u+6)+"}",u+=6,s=!0;continue}}}r+="u",u+=2,s=!0;continue;case"x":{let g=!1;if(u+2<i&&e[u+2]==="{"){let w=u+3,D=!1,P=!1;for(;w<i;){let V=e[w];if(V==="}"){P=!0;break}if(!Cs.isHexadecimal(V))break;D=!0,w++}P&&D&&(g=!0)}else u+3<i&&Cs.isHexadecimal(e[u+2])&&Cs.isHexadecimal(e[u+3])&&(g=!0);g?(r+="\\x",u+=2):(r+="x",u+=2,s=!0);continue}case"n":case"r":case"t":case"a":case"f":case"v":case"d":case"D":case"s":case"S":case"w":case"W":case"b":case"B":case"p":case"P":case"A":case"z":case"Q":case"E":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":r+="\\"+l,u+=2;continue;default:{let g=e.codePointAt(u+1);if(g>=48&&g<=57||g>=65&&g<=90||g>=97&&g<=122){let w=K.charCount(g);r+=e.substring(u+1,u+1+w),u+=w+1,s=!0}else{r+="\\";let w=K.charCount(g);r+=e.substring(u+1,u+1+w),u+=w+1}continue}}}else if(l==="/"){r+="\\/",u+=1,s=!0;continue}else if(l==="["){if(!o&&e[u+1]==="]"){r+="[^\\x00-\\x{10FFFF}]",u+=2,s=!0;continue}if(!o&&e[u+1]==="^"&&e[u+2]==="]"){r+="[\\x00-\\x{10FFFF}]",u+=3,s=!0;continue}o=!0}else if(l==="]")o=!1;else if(!o&&l==="("&&u+2<i&&e[u+1]==="?"&&e[u+2]==="<"&&u+3<i&&!"=!>)".includes(e[u+3])){r+="(?P<",u+=3,s=!0;continue}let B=e.codePointAt(u),d=K.charCount(B);r+=e.substring(u,u+d),u+=d}let c=s?r:e;return t.length>0?`(?${t})${c}`:c}},hm=(n,e)=>{let t=n.matchArray();return t.index=n.start(0),t.input=e,t.groups=n.namedGroupsObject(),t},Te,pu=(Te=class{static quote(e){return K.quoteMeta(e)}static quoteReplacement(e,t=!1){return VC.quoteReplacement(e,t)}static translateRegExp(e){return jT.translate(e)}static compile(e,t=0){let r=e;if((t&Te.CASE_INSENSITIVE)!==0&&(r=`(?i)${r}`),(t&Te.DOTALL)!==0&&(r=`(?s)${r}`),(t&Te.MULTILINE)!==0&&(r=`(?m)${r}`),(t&~(Te.MULTILINE|Te.DOTALL|Te.CASE_INSENSITIVE|Te.DISABLE_UNICODE_GROUPS|Te.LONGEST_MATCH|Te.LOOKBEHINDS))!==0)throw new bT("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");let s=F.PERL;(t&Te.DISABLE_UNICODE_GROUPS)!==0&&(s&=~F.UNICODE_GROUPS),(t&Te.LOOKBEHINDS)!==0&&(s|=F.LOOKBEHIND);let i=new Te(e,t);return i.re2Input=qT.compileImpl(r,s,(t&Te.LONGEST_MATCH)!==0),i}static matches(e,t){return Te.compile(e).testExact(t)}static initTest(e,t,r){if(e==null)throw new Error("pattern is null");if(r==null)throw new Error("re2 is null");let s=new Te(e,t);return s.re2Input=r,s}constructor(e,t){this.patternInput=e,this.flagsInput=t,this.re2Input=null}reset(){this.re2Input.reset()}flags(){return this.flagsInput}pattern(){return this.patternInput}re2(){return this.re2Input}matches(e){return this.testExact(e)}matcher(e){return K.isByteArray(e)&&(e=Dr.utf8(e)),new VC(this,e)}test(e){return K.isByteArray(e)?this.re2Input.matchUTF8(e):this.re2Input.match(e)}testExact(e){let t=K.isByteArray(e)?we.fromUTF8(e):we.fromUTF16(e);return this.re2Input.executeEngine(t,0,F.ANCHOR_BOTH,0)!==null}exec(e){let t=this.matcher(e);return t.find()?hm(t,e):null}split(e,t=0){let r=this.matcher(e),s=[],i=0,o=0;for(;r.find();){if(o===0&&r.end()===0){o=r.end();continue}if(t>0&&s.length===t-1)break;if(o===r.start()){if(t===0){i+=1,o=r.end();continue}}else for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.start())),o=r.end()}if(t===0&&o!==r.inputLength()){for(;i>0;)s.push(""),i-=1;s.push(r.substring(o,r.inputLength()))}return(t!==0||s.length===0&&!(o===r.inputLength()&&o>0))&&s.push(r.substring(o,r.inputLength())),s}*matchAll(e){let t=this.matcher(e);for(;t.find();)yield hm(t,e)}toString(){return this.patternInput}programSize(){return this.re2Input.numberOfInstructions()}groupCount(){return this.re2Input.numberOfCapturingGroups()}namedGroups(){return this.re2Input.namedGroups}equals(e){return this===e?!0:e===null||this.constructor!==e.constructor?!1:this.flagsInput===e.flagsInput&&this.patternInput===e.patternInput}},M(Te,"CASE_INSENSITIVE",Mt.CASE_INSENSITIVE),M(Te,"DOTALL",Mt.DOTALL),M(Te,"MULTILINE",Mt.MULTILINE),M(Te,"DISABLE_UNICODE_GROUPS",Mt.DISABLE_UNICODE_GROUPS),M(Te,"LONGEST_MATCH",Mt.LONGEST_MATCH),M(Te,"LOOKBEHINDS",Mt.LOOKBEHINDS),Te);/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oi="13.2.0";function c_(n){oi=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Or=new qn("@firebase/firestore");function ms(){return Or.logLevel}function W(n,...e){if(Or.logLevel<=oe.DEBUG){let t=e.map(Ed);Or.debug(`Firestore (${oi}): ${n}`,...t)}}function vn(n,...e){if(Or.logLevel<=oe.ERROR){let t=e.map(Ed);Or.error(`Firestore (${oi}): ${n}`,...t)}}function Ft(n,...e){if(Or.logLevel<=oe.WARN){let t=e.map(Ed);Or.warn(`Firestore (${oi}): ${n}`,...t)}}function Ed(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,l_(n,r,t)}function l_(n,e,t){let r=`FIRESTORE (${oi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw vn(r),new Error(r)}function X(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||l_(e,s,r)}function le(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function KT(n){let e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Rs=class{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516),r="";for(;r.length<20;){let s=KT(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}};function ae(n,e){return n<e?-1:n>e?1:0}function Bo(n,e){let t=Math.min(n.length,e.length);for(let r=0;r<t;r++){let s=n.charAt(r),i=e.charAt(r);if(s!==i)return Ah(s)===Ah(i)?ae(s,i):Ah(s)?1:-1}return ae(n.length,e.length)}var JT=55296,zT=57343;function Ah(n){let e=n.charCodeAt(0);return e>=JT&&e<=zT}function Ss(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ne=class n{constructor(e,t){this.comparator=e,this.root=t||an.EMPTY}insert(e,t){return new n(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,an.BLACK,null,null))}remove(e){return new n(this.comparator,this.root.remove(e,this.comparator).copy(null,null,an.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){let e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Is(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Is(this.root,e,this.comparator,!1)}getReverseIterator(){return new Is(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Is(this.root,e,this.comparator,!0)}},Is=class{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}},an=class n{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??n.RED,this.left=s??n.EMPTY,this.right=i??n.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new n(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this,i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return n.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return n.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){let e=this.copy(null,null,n.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,n.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Y(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Y(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw Y(27949);return e+(this.isRed()?0:1)}};an.EMPTY=null,an.RED=!0,an.BLACK=!1;an.EMPTY=new class{constructor(){this.size=0}get key(){throw Y(57766)}get value(){throw Y(16141)}get color(){throw Y(16727)}get left(){throw Y(29726)}get right(){throw Y(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new an(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ke=class n{constructor(e){this.comparator=e,this.data=new Ne(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Du(this.data.getIterator())}getIteratorFrom(e){return new Du(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){let e=[];return this.forEach((t=>{e.push(t)})),e}toString(){let e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){let t=new n(this.comparator);return t.data=e,t}},Du=class{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var L={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"},J=class extends ht{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ps="__name__",Tu=class n{constructor(e,t,r){t===void 0?t=0:t>e.length&&Y(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&Y(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return n.comparator(this,e)===0}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof n?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let s=0;s<r;s++){let i=n.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return ae(e.length,t.length)}static compareSegments(e,t){let r=n.isNumericId(e),s=n.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?n.extractNumericId(e).compare(n.extractNumericId(t)):Bo(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return _n.fromString(e.substring(4,e.length-2))}},Ce=class n extends Tu{construct(e,t,r){return new n(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new J(L.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new n(t)}static emptyPath(){return new n([])}},WT=/^[_a-zA-Z][_a-zA-Z0-9]*$/,bt=class _s extends Tu{construct(e,t,r){return new _s(e,t,r)}static isValidIdentifier(e){return WT.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),_s.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Ps}static keyField(){return new _s([Ps])}static fromServerFormat(e){let t=[],r="",s=0,i=()=>{if(r.length===0)throw new J(L.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},o=!1;for(;s<e.length;){let u=e[s];if(u==="\\"){if(s+1===e.length)throw new J(L.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let c=e[s+1];if(c!=="\\"&&c!=="."&&c!=="`")throw new J(L.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=c,s+=2}else u==="`"?(o=!o,s++):u!=="."||o?(r+=u,s++):(i(),s++)}if(i(),o)throw new J(L.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new _s(t)}static emptyPath(){return new _s([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jt=class n{constructor(e){this.fields=e,e.sort(bt.comparator)}static empty(){return new n([])}unionWith(e){let t=new Ke(bt.comparator);for(let r of this.fields)t=t.add(r);for(let r of e)t=t.add(r);return new n(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return Ss(this.fields,e.fields,((t,r)=>t.isEqual(r)))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xr(n){let e=0;for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function ns(n,e){for(let t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function h_(n,e){let t=[];for(let r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function B_(n){for(let e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ee=class n{constructor(e){this.path=e}static fromPath(e){return new n(Ce.fromString(e))}static fromName(e){return new n(Ce.fromString(e).popFirst(5))}static empty(){return new n(Ce.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Ce.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Ce.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new n(new Ce(e.slice()))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function f_(n,e,t){if(!t)throw new J(L.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function d_(n,e,t,r){if(e===!0&&r===!0)throw new J(L.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function wm(n){if(!ee.isDocumentKey(n))throw new J(L.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Im(n){if(ee.isDocumentKey(n))throw new J(L.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function qo(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function pc(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{let e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Y(12329,{type:typeof n})}function ir(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new J(L.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let t=pc(n);throw new J(L.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ke(n,e){let t={typeString:n};return e&&(t.value=e),t}function jo(n,e){if(!qo(n))throw new J(L.INVALID_ARGUMENT,"JSON must be an object");let t;for(let r in e)if(e[r]){let s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0,o=e[r].optional;if(!(r in n)){if(o)continue;t=`JSON missing required field: '${r}'`;break}let u=n[r];if(s&&typeof u!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&u!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new J(L.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Dm=-62135596800,Tm=1e6,Pe=class n{static now(){return n.fromMillis(Date.now())}static fromDate(e){return n.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Tm);return new n(t,r)}static fromInstant(e){if(!e||typeof e.t!="bigint")throw new J(L.INVALID_ARGUMENT,"Invalid Temporal.Instant object provided.");return n._fromEpochNanoseconds(e.t)}static _fromEpochNanoseconds(e){let t,r;if(e>=0n)t=Number(e/1000000000n),r=Number(e%1000000000n);else{let s=e%1000000000n;s===0n?(t=Number(e/1000000000n),r=0):(t=Number(e/1000000000n-1n),r=Number(s+1000000000n))}return new n(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new J(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new J(L.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Dm)throw new J(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new J(L.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Tm}toInstant(){if(typeof Temporal>"u"||!Temporal.Instant)throw new J(L.FAILED_PRECONDITION,"The Temporal object is not available in the current environment.");let e=1000000000n*BigInt(this.seconds)+BigInt(this.nanoseconds);return Temporal.Instant.__PRIVATE_fromEpochNanoseconds(e)}_compareTo(e){return this.seconds===e.seconds?ae(this.nanoseconds,e.nanoseconds):ae(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:n._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(jo(e,n._jsonSchema))return new n(e.seconds,e.nanoseconds)}valueOf(){let e=this.seconds-Dm;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}};Pe._jsonSchemaVersion="firestore/timestamp/1.0",Pe._jsonSchema={type:ke("string",Pe._jsonSchemaVersion),seconds:ke("number"),nanoseconds:ke("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Au=class extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Re=class n{constructor(e){this.binaryString=e}static fromBase64String(e){let t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Au("Invalid base64 string: "+i):i}})(e);return new n(t)}static fromUint8Array(e){let t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new n(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return ae(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}};Re.EMPTY_BYTE_STRING=new Re("");var QT=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Rn(n){if(X(!!n,39018),typeof n=="string"){let e=0,t=QT.exec(n);if(X(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}let r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Ae(n.seconds),nanos:Ae(n.nanos)}}function Ae(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Kt(n){return typeof n=="string"?Re.fromBase64String(n):Re.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var p_="server_timestamp",g_="__type__",C_="__previous_value__",m_="__local_write_time__";function gc(n){return(n?.mapValue?.fields||{})[g_]?.stringValue===p_}function Ko(n){let e=n.mapValue.fields[C_];return gc(e)?Ko(e):e}function Ns(n){let e=Rn(n.mapValue.fields[m_].timestampValue);return new Pe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Nh=class{constructor(e,t,r,s,i,o,u,c,l,B,d,g,w){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=u,this.longPollingOptions=c,this.useFetchStreams=l,this.isUsingEmulator=B,this.apiKey=d,this._customHeaders=g,this.grpcFlowControlWindow=w}},bu="(default)",fo=class n{constructor(e,t){this.projectId=e,this.database=t||bu}static empty(){return new n("","")}get isDefaultDatabase(){return this.database===bu}isEqual(e){return e instanceof n&&e.projectId===this.projectId&&e.database===this.database}};function __(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new J(L.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new fo(n.options.projectId,e)}/**
 * Copyright 2021 M.Vokhmentsev
 *
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Fe=class n{constructor(){this.exponent=0,this.i=0n,this.o=0n,this.u=new Array(4).fill(0n),this.l=new Array(6).fill(0n),this.h=new Array(6).fill(0n),this.T=new Array(6).fill(0n),this.P=new Array(12).fill(0n)}static I(e,t){let r=new n;return r.parse(e,t),r}parse(e,t){t+=e.length-1,this.exponent=0,this.i=0n,this.o=0n;let r=this.T,s=this.R(e,r);if(s==0&&this.isEmpty(r)||(t+=s)<n.A)return;if(t>n.V)return void(this.exponent=Number(n.m));let i=this.p(t,r);this.S(t,i,r)}R(e,t){for(let i=0;i<6;i++)t[i]=0n;let r=0;for(;r<e.length&&e[r]==0;)r+=1;if(r==e.length)return 0;let s=-r;if(e.length-r>n.v){let i=e[n.v]>=5,o=new Array(n.v).fill(0);for(let u=0;u<n.v;u++)o[u]=e[u+r];i&&(s+=this.D(o)),e=o,r=0}for(let i=e.length-1;i>=r;i--)t[0]|=BigInt(e[i])<<32n,this.C(t);return s}C(e){let t=e.length;for(let r=0;r<t;r++){let s=e[r]%10n;e[r]=e[r]/10n,r+1<t&&(e[r+1]+=s<<32n)}}isEmpty(e){for(let t=0;t<e.length;t++)if(e[t]!=0n)return!1;return!0}D(e){for(let t=e.length-1;t>=0;t--){if(e[t]!=9)return e[t]=e[t]+1,0;e[t]=0}return e[0]=1,1}p(e,t){let r=t[0]<<31n|t[1]>>1n,s=Number(r)/n.F;return Math.floor(Number(e)*n.O+this.log2(s))}log2(e){return n.M*Math.log(e)}S(e,t,r){let s=this.u;this.N(-t,s);let i=this.P;this.B(r,s,i),this.L(i),BigInt(s[0])!=BigInt(-e)&&this.L(i),t+=this.$(i),(t+=n.U)<=0||(t+=this.k(i),BigInt(t)>=n.m?this.exponent=Number(n.m):(this.exponent=Number(t),this.i=(i[0]<<32n)+i[1]&0xffffffffffffffffn,this.o=(i[2]<<32n)+i[3]&0xffffffffffffffffn))}N(e,t){if(e==0)return void this.q(n.K[0],t);let r=n.K;e<0&&(e=-e,r=n.W);let s=n.G,i=32,o=!0;for(;e>0;)e>=s&&(o?(this.q(r[i],t),o=!1):this.j(t,r[i],t),e-=s),i-=1,s*=.5}q(e,t){for(let r=0;r<t.length;r++)t[r]=e[r]}j(e,t,r){this.H(e,t,this.P);let s=this.J(this.P);this.Y(this.P,r),r[0]=e[0]+t[0]+BigInt(s)}H(e,t,r){for(let s=0;s<r.length;s++)r[s]=0n;this.Z(e,this.l),this.Z(t,this.h);for(let s=5;s>=0;s--)for(let i=5;i>=0;i--){let o=this.l[s]*this.h[i];r[i+s+1]=r[i+s+1]+(o&n.X)&0xffffffffffffffffn,r[i+s]=r[i+s]+(o>>32n)&0xffffffffffffffffn}for(let s=11;s>=1;s--)r[s-1]=r[s-1]+(r[s]>>32n)&0xffffffffffffffffn,r[s]&=n.X}J(e){let t=0;for(;this.ee(e);)this.L(e),t-=1;return t}ee(e){if(e[0]<0x19999999n)return!0;if(e[0]>0x19999999n)return!1;for(let t=1;t<e.length;t++){if(e[t]<0x99999999n)return!0;if(e[t]>0x99999999n)return!1}return!1}B(e,t,r){for(let o=0;o<r.length;o++)r[o]=0n;let s=this.h;this.Z(t,s);let i=e.length;for(let o=i-1;o>=0;o--)for(let u=i-1;u>=0;u--){let c=e[o]*s[u];r[u+o+1]=r[u+o+1]+(c&n.X)&0xffffffffffffffffn,r[u+o]=r[u+o]+(c>>32n)&0xffffffffffffffffn}for(let o=11;o>=1;o--)r[o-1]=r[o-1]+(r[o]>>32n)&0xffffffffffffffffn,r[o]&=n.X}L(e){let t=e.length-1;e[0]&=n.X,e[t]*=10n;for(let r=t-1;r>=0;r--)e[r]=10n*e[r]+(e[r+1]>>32n)&0xffffffffffffffffn,e[r+1]&=n.X}$(e){let t=31-n.te(e[0]);return t!=0&&this.ne(e,t),t}k(e){return this.re(e,5,100n),this.re(e,4,0x80000000n),(e[0]&n.ie<<1n)!=0n?(this.ne(e,1),1):0}Y(e,t){t[1]=(e[0]<<32n)+e[1],t[2]=(e[2]<<32n)+e[3],t[3]=(e[4]<<32n)+e[5]}Z(e,t){t[0]=e[1]>>32n,t[1]=e[1]&n.X,t[2]=e[2]>>32n,t[3]=e[2]&n.X,t[4]=e[3]>>32n,t[5]=e[3]&n.X}ne(e,t){let r=e.length-1,s=BigInt(32-Math.abs(t));if(t>0){let i=BigInt(t);for(let o=r+1-1;o>=1;o--)e[o]=e[o]>>i|e[o-1]<<s&n.X;e[0]=e[0]>>i}else if(t<0){let i=BigInt(-t);e[0]=0xffffffffffffffffn&(e[0]<<i|e[1]>>s);for(let o=1;o<r;o++)e[o]=0xffffffffffffffffn&(e[o]<<i&n.X|e[o+1]>>s);e[r]=e[r]<<i&n.X}}re(e,t,r){let s=t;e[s]=e[s]+r&0xffffffffffffffffn;for(let i=s+1-1;i>=1&&(e[i]&n.ie)!=0n;i--)e[i]&=n.X,e[i-1]+=1n}static te(e){let t=Number(e>>32n);return t==0?32+Math.clz32(Number(BigInt.asUintN(32,e))):Math.clz32(t)}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ye,Ds,Oh,Eu,yu,so;Fe.v=59,Fe.V=646456993,Fe.A=-646457032,Fe.F=0xccccccccccccd00,Fe.se=0x8000000000000000n,Fe.G=2147483648,Fe.X=0x00000000ffffffffn,Fe.ie=0xffffffff00000000n,Fe.O=Math.log(10)/Math.log(2),Fe.M=1/Math.log(2),Fe.U=2147483647,Fe.m=0xffffffffn,Fe.K=[[1n,0x1999999999999999n,0x9999999999999999n,0x999999999999999an],[1n,0x3333333333333333n,0x3333333333333333n,0x3333333333333334n],[1n,0x6666666666666666n,0x6666666666666666n,0x6666666666666667n],[2n,0x28f5c28f5c28f5c2n,0x8f5c28f5c28f5c28n,0xf5c28f5c28f5c290n],[3n,0x4189374bc6a7ef9dn,0xb22d0e5604189374n,0xbc6a7ef9db22d0e6n],[5n,0xa7c5ac471b478423n,0x0fcf80dc33721d53n,0xcddd6e04c0592104n],[10n,0x6df37f675ef6eadfn,0x5ab9a2072d44268dn,0x97df837e6748956en],[20n,0x2f394219248446ban,0xa23d2ec729af3d61n,0x0607aa0167dd94cbn],[39n,0x571cbec554b60dbbn,0xd5f64baf0506840dn,0x451db70d5904029bn],[78n,0x1da48ce468e7c702n,0x6520247d3556476dn,0x1469caf6db224cfan],[155n,0x2252f0e5b39769dcn,0x9ae2eea30ca3ade0n,0xeeaa3c08dfe84e30n],[309n,0x2e055c9a3f6ba793n,0x16583a816eb60a59n,0x22c4b0826cf1ebf7n],[617n,0x52bb45e9cf23f17fn,0x7688c07606e50364n,0xb34479aa9d449a57n],[1234n,0x1abc81c8ff5f846cn,0x8f5e3c9853e38c97n,0x45060097f3bf9296n],[2467n,0x1bec53b510daa7b4n,0x48369ed77dbb0eb1n,0x3b05587b2187b41en],[4933n,0x1e75063a5ba91326n,0x8abfb8e460016ae3n,0x28008702d29e8a3cn],[9865n,0x243c5d8bb5c5fa55n,0x40c6d248c5881915n,0x4c0fd99fd5befc22n],[19729n,0x334a5570c3f4ef3cn,0xa13c36c43f979c90n,0xda7ac473555fb7a8n],[39457n,0x66c304445dd98f3bn,0xa8c293a20e47a41bn,0x4c5b03dc12604964n],[78914n,0x293ffbf5fb028cc4n,0x89d3e5ff44238406n,0x369a339e1bfe8c9bn],[157827n,0x427792fbb68e5d20n,0x7b297cd9fc154b62n,0xf09142114aa9a20cn],[315653n,0xac92bc65ad5c08fcn,0x00beeb115a566c19n,0x4ba882d8a4622437n],[631306n,0x745581440f92e80en,0x4da822cf7f896f41n,0x509d598678164ecdn],[1262612n,0x34dd99b4c69523a5n,0x64bc2e8f0d8b1044n,0xb03b1c96da5dd349n],[2525223n,0x6d2bbea9d6d25a08n,0xa0a4606a88e96b70n,0x182063bbc2fe8520n],[5050446n,0x2e8e47d63bfdd6e3n,0x2b55fa8976eaa3e9n,0x1a6b9d3086412a73n],[10100891n,0x54aa68efa1d719dfn,0xd8505806612c5c8fn,0xad068837fee8b43an],[20201782n,0x1c00464ccb7bae77n,0x9e3877784c77982cn,0xd94af3b61717404fn],[40403563n,0x1ea099c8be2b6cd0n,0x8bfb6d539fa50466n,0x6d3bc37e69a84218n],[80807125n,0x24a457f466ce8d18n,0xf2c8f3b81bc6bb59n,0xa78c757692e02d49n],[161614249n,0x347256677aba6b53n,0x3fbf90d30611a67cn,0x1e039d87e0bdb32bn],[323228497n,0x6b727daf0fd3432an,0x71f71121f9e4200fn,0x8fcd9942d486c10cn],[646456994n,0x2d18e84484d91f78n,0x4079bfe7829dec6fn,0x21551643e365abc6n]],Fe.W=[[1n,0x1999999999999999n,0x9999999999999999n,0x999999999999999an],[0n,0x8000000000000000n,0x0000000000000000n,0x0000000000000000n],[0n,0x4000000000000000n,0x0000000000000000n,0x0000000000000001n],[-1n,0xa000000000000000n,0x0000000000000000n,0x0000000000000000n],[-2n,0x6400000000000000n,0x0000000000000000n,0x0000000000000000n],[-4n,0x2710000000000000n,0x0000000000000000n,0x0000000000000001n],[-9n,0x3b9aca0000000000n,0x0000000000000000n,0x0000000000000001n],[-19n,0x8ac7230489e80000n,0x0000000000000000n,0x0000000000000000n],[-38n,0x4b3b4ca85a86c47an,0x098a224000000000n,0x0000000000000001n],[-77n,0xdd15fe86affad912n,0x49ef0eb713f39eben,0xaa987b6e6fd2a002n],[-154n,0xbeeefb584aff8603n,0xaafb550ffacfd8fan,0x5ca47e4f88d45371n],[-308n,0x8e679c2f5e44ff8fn,0x570f09eaa7ea7648n,0x5961db50c6d2b888n],[-616n,0x4f371b3399fc2ab0n,0x8170041c9feb05aan,0xc7c343447c75bcf6n],[-1233n,0xf51e928179013fd3n,0xde4bd12cde4d985cn,0x4a573ca6f94bff14n],[-2466n,0xeab388127bccaff7n,0x1667639142b9fbaen,0x775ec9995e1039fbn],[-4932n,0xd72cb2a95c7ef6ccn,0xe81bf1e825ba7515n,0xc2feb521d6cb5dcdn],[-9864n,0xb4dc1be6604502dcn,0xd491079b8eef6535n,0x578d3965d24de84dn],[-19728n,0x7fc6447bee60ea43n,0x2548da5c8b125b27n,0x5f42d1142f41d349n],[-39456n,0x3fc65180f88af8fbn,0x6a6915f383349413n,0x063c3708b6ceb291n],[-78913n,0x9ee0197c8dcd55bfn,0x2b2b9b942c38f4a2n,0x0f8ba634e9c706aen],[-157826n,0x629963a25b8b2d79n,0xd00b9d2286f70876n,0xe97004700c3644fcn],[-315652n,0x25f9cc308ceef4f3n,0x40f19543911a4546n,0xa2cd389452cfc366n],[-631305n,0x385597b0d47e76b8n,0x1b9f67e103bf2329n,0xc3119848595985f7n],[-1262611n,0x7bf795d276c12f66n,0x66a61d62a446659an,0xa1a4d73bebf093d5n],[-2525222n,0x3c07d96ab1ed7799n,0xcb7355c22cc05ac0n,0x4ffc0ab73b1f6a49n],[-5050445n,0x8cc4cd8c3edefb9an,0x6c8ff86a90a97e0cn,0x166cfddbf98b71bfn],[-10100890n,0x4d67d81cc88e1228n,0x1d7cfb06666b79b3n,0x7b916728aaa4e70dn],[-20201781n,0xea0c55494e7a552dn,0xb88cb9484bb86c61n,0x8d44893c610bb7dfn],[-40403562n,0xd5fa8c821ec0c24an,0xa80e46e764e0f8b0n,0xa7276bfa432fac7en],[-80807124n,0xb2dae307426f6791n,0xc970b82f58b12918n,0x0472592f7f39190en],[-161614248n,0x7cf51edd8a15f1c9n,0x656dab3498f8e697n,0x12daa2a80e53c807n],[-323228496n,0x3cfe609ab5883c50n,0xbec8b5d22b198871n,0xe18477703b4622b4n],[-646456993n,0x9152447b9d7cda9an,0x3b4d3f6110d77aadn,0xfa81bad1c394adb4n]];var _e=class n{constructor(e,t,r,s){this.negative=e,this._e=t,this.i=r,this.o=s}exponent(){return this._e-Fe.U}oe(){return this._e===0&&this.i===0n&&this.o===0n}ae(){return this._e===$e(n,Ye,"f",Ds)&&this.i===0n&&this.o===0n}isNaN(){return this._e===$e(n,Ye,"f",Ds)&&!(this.i===0n&&this.o===0n)}compareTo(e){if(this.isNaN())return e.isNaN()?0:1;if(e.isNaN())return-1;let t,r;if(this.negative){if(!e.negative)return-1;t=1,r=-1}else{if(e.negative)return 1;t=-1,r=1}return this._e<e._e?t:this._e>e._e?r:this.i<e.i?t:this.i>e.i?r:this.o<e.o?t:this.o>e.o?r:0}debug(){return(this.negative?"+":"-")+$e(n,Ye,"m",Oh).call(n,this.i)+$e(n,Ye,"m",Oh).call(n,this.o)+"*2^"+this.exponent()}static fromNumber(e){if(isNaN(e))return n.NaN;if(!isFinite(e))return e<0?n.ue:n.ce;if(e===0)return Math.sign(1/e)>0?n.le:n.Ee;let t=new DataView(new ArrayBuffer(8));t.setFloat64(0,e);let r=t.getBigUint64(0),s=BigInt.asUintN(64,r<<12n),i=2047&Number(r>>52n);if(i===0){let o=Fe.te(s);s=o<63?s<<BigInt(o+1):0n,i=-o}return new n(e<0,$e(n,Ye,"m",so).call(n,i-1023),s,0n)}static fromString(e){if(e==="NaN")return n.NaN;if(e==="-Infinity")return n.ue;if(e==="Infinity"||e==="+Infinity")return n.ce;let t=new Array(e.length).fill(0),r=0,s=0,i=0,o=!1;for(e[r]==="-"?(o=!0,r++):e[r]==="+"&&r++;$e(n,Ye,"m",Eu).call(n,e,r);)t[s++]=$e(n,Ye,"m",yu).call(n,e,r++);if(e[r]==="."){let c=++r;for(;$e(n,Ye,"m",Eu).call(n,e,r);)t[s++]=$e(n,Ye,"m",yu).call(n,e,r++);i=c-r}if(e[r]==="e"||e[r]==="E"){let c=0;r++;let l=1;e[r]==="-"?(l=-1,r++):e[r]==="+"&&r++;let B=r;for(;$e(n,Ye,"m",Eu).call(n,e,r);)if(c=10*c+$e(n,Ye,"m",yu).call(n,e,r++),r-B>9)throw new Error("Exponent too large "+e);if(r===B)throw new Error("Invalid number "+e);i+=c*l}if(s===0||r!==e.length)throw new Error("Invalid number "+e);let u=Fe.I(t.slice(0,s),i);return new n(o,u.exponent,u.i,u.o)}};Ye=_e,Oh=function(e){return e.toString(16).padStart(16,"0")},Eu=function(e,t){let r=e.codePointAt(t);return r!==void 0&&r>=48&&r<=57},yu=function(e,t){return e.codePointAt(t)-48},so=function(e){return e+Fe.U},Ds={value:Number(Fe.m)},_e.le=new _e(!1,0,0n,0n),_e.Ee=new _e(!0,0,0n,0n),_e.NaN=new _e(!1,$e(_e,Ye,"f",Ds),1n<<63n,0n),_e.ue=new _e(!0,$e(_e,Ye,"f",Ds),0n,0n),_e.ce=new _e(!1,$e(_e,Ye,"f",Ds),0n,0n),new _e(!0,$e(_e,Ye,"m",so).call(_e,63),0n,0n),new _e(!1,$e(_e,Ye,"m",so).call(_e,0),0n,0n),new _e(!0,$e(_e,Ye,"m",so).call(_e,0),0n,0n);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $T=-1;function Jo(n){return n==null}function Os(n){return n===0&&1/n==-1/0}function YT(n){return typeof n=="number"&&Number.isInteger(n)&&!Os(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function XT(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cc="__type__",mc="__vector__",Fr="value",ZT="server_timestamp",yd="__min__",zo="__max__",rn="__regex__",xs="pattern",Fs="options",kr="__oid__",or="__int__",Sn="__decimal128__",yn="__request_timestamp__",po="seconds",go="increment",ks="__binary__",Ls={nullValue:"NULL_VALUE"},gu={mapValue:{fields:{__type__:{stringValue:zo}}}},US={mapValue:{fields:{[Cc]:{stringValue:mc},[Fr]:{arrayValue:{}}}}},GS={mapValue:{fields:{[yd]:{nullValue:"NULL_VALUE"}}}},HS={mapValue:{fields:{[zo]:{nullValue:"NULL_VALUE"}}}},qS={mapValue:{fields:{[kr]:{stringValue:""}}}},jS={mapValue:{fields:{[yn]:{mapValue:{fields:{[po]:{integerValue:0},[go]:{integerValue:0}}}}}}},KS={mapValue:{fields:{[rn]:{mapValue:{fields:{[xs]:{stringValue:""},[Fs]:{stringValue:""}}}}}}},ce,Ot;(Ot=ce||(ce={})).he="regexValue",Ot.Te="bsonObjectIdValue",Ot.Pe="int32Value",Ot.Ie="decimal128Value",Ot.Re="bsonTimestampValue",Ot.Ae="bsonBinaryValue",Ot.Ve="minKeyValue",Ot.de="maxKeyValue",Ot.fe="maxValue",Ot.me="vectorValue",Ot.pe="serverTimestampValue",Ot.ge="regularMapValue";var Am={[mc]:ce.me,[zo]:ce.fe,[ZT]:ce.pe},E_={[rn]:ce.he,[kr]:ce.Te,[or]:ce.Pe,[Sn]:ce.Ie,[yn]:ce.Re,[ks]:ce.Ae,[yd]:ce.Ve,[zo]:ce.de},JS=new Set(Object.values(E_)),_t={booleanValue:!0},Ze={booleanValue:!1};function He(n){if("nullValue"in n)return 0;if("booleanValue"in n)return 2;if("integerValue"in n||"doubleValue"in n)return 3;if("timestampValue"in n)return 4;if("stringValue"in n)return 7;if("bytesValue"in n)return 8;if("referenceValue"in n)return 9;if("geoPointValue"in n)return 11;if("arrayValue"in n)return 13;if(!("mapValue"in n))return Y(28295,{value:n});switch(b_(n)){case ce.pe:return 6;case ce.fe:return 9007199254740991;case ce.me:return 14;case ce.he:return 12;case ce.Te:return 10;case ce.Pe:case ce.Ie:return 3;case ce.Re:return 5;case ce.Ae:return 8;case ce.Ve:return 1;case ce.de:return 16;default:return 15}}function kt(n,e,t){if(n===e)return!0;let r=He(n);if(r!==He(e))return!1;switch(r){case 0:case 9007199254740991:case 16:case 1:return!0;case 2:return n.booleanValue===e.booleanValue;case 6:return Ns(n).isEqual(Ns(e));case 4:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;let u=Rn(i.timestampValue),c=Rn(o.timestampValue);return u.seconds===c.seconds&&u.nanos===c.nanos})(n,e);case 7:return n.stringValue===e.stringValue;case 8:return(function(i,o){return D_(i,o)===0})(n,e);case 9:return n.referenceValue===e.referenceValue;case 11:return(function(i,o){return Ae(i.geoPointValue.latitude)===Ae(o.geoPointValue.latitude)&&Ae(i.geoPointValue.longitude)===Ae(o.geoPointValue.longitude)})(n,e);case 3:return(function(i,o,u){if(Lt(i)&&Lt(o))return w_(i,o)===0;if("integerValue"in i&&"integerValue"in o||Xn(i)&&Xn(o))return mo(i)===mo(o);let c,l;if("doubleValue"in i&&"doubleValue"in o)c=Ae(i.doubleValue),l=Ae(o.doubleValue);else{if(!u?.ye)return!1;c=Ae(i.integerValue??i.doubleValue),l=Ae(o.integerValue??o.doubleValue)}return c===l?!!u?.we||Os(c)===Os(l):!!(u===void 0||u.be)&&isNaN(c)&&isNaN(l)})(n,e,t);case 13:return Ss(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>kt(s,i,t)));case 14:case 15:return(function(i,o,u){let c=i.mapValue.fields||{},l=o.mapValue.fields||{};if(xr(c)!==xr(l))return!1;for(let B in c)if(c.hasOwnProperty(B)&&(l[B]===void 0||!kt(c[B],l[B],u)))return!1;return!0})(n,e,t);case 5:return I_(n,e)===0;case 12:return T_(n,e)===0;case 10:return A_(n,e)===0;default:return Y(52216,{left:n})}}function Co(n,e){return(n.values||[]).find((t=>kt(t,e)))!==void 0}function Et(n,e){if(n===e)return 0;let t=He(n),r=He(e);if(t!==r)return ae(t,r);switch(t){case 0:case 1:case 16:case 9007199254740991:return 0;case 2:return ae(n.booleanValue,e.booleanValue);case 3:return _o(n,e);case 4:return vm(n.timestampValue,e.timestampValue);case 6:return vm(Ns(n),Ns(e));case 7:return Bo(n.stringValue,e.stringValue);case 8:return D_(n,e);case 9:return(function(i,o){let u=i.split("/"),c=o.split("/");for(let l=0;l<u.length&&l<c.length;l++){let B=ae(u[l],c[l]);if(B!==0)return B}return ae(u.length,c.length)})(n.referenceValue,e.referenceValue);case 11:return(function(i,o){let u=ae(Ae(i.latitude),Ae(o.latitude));return u!==0?u:ae(Ae(i.longitude),Ae(o.longitude))})(n.geoPointValue,e.geoPointValue);case 13:return Rm(n.arrayValue,e.arrayValue);case 14:return(function(i,o){let u=i.fields||{},c=o.fields||{},l=u[Fr]?.arrayValue,B=c[Fr]?.arrayValue,d=ae(l?.values?.length||0,B?.values?.length||0);return d!==0?d:Rm(l,B)})(n.mapValue,e.mapValue);case 15:return(function(i,o){if(i===gu.mapValue&&o===gu.mapValue)return 0;if(i===gu.mapValue)return 1;if(o===gu.mapValue)return-1;let u=i.fields||{},c=Object.keys(u),l=o.fields||{},B=Object.keys(l);c.sort(),B.sort();for(let d=0;d<c.length&&d<B.length;++d){let g=Bo(c[d],B[d]);if(g!==0)return g;let w=Et(u[c[d]],l[B[d]]);if(w!==0)return w}return ae(c.length,B.length)})(n.mapValue,e.mapValue);case 5:return I_(n,e);case 12:return T_(n,e);case 10:return A_(n,e);default:throw Y(23264,{Se:t})}}function mo(n){let e;return e=Xn(n)?n.mapValue.fields[or].integerValue:n.integerValue||n.doubleValue,Ae(e)}function y_(n){return n.mapValue.fields[Sn].stringValue}function _o(n,e){if(Lt(n)||Lt(e))return w_(n,e);let t=mo(n),r=mo(e);return isNaN(t)?isNaN(r)?0:-1:isNaN(r)?1:ae(t,r)}function w_(n,e){let t=bm(n),r=bm(e);return t.oe()&&r.oe()?0:t.isNaN()?r.isNaN()?0:-1:r.isNaN()?1:t.compareTo(r)}function bm(n){return Lt(n)?_e.fromString(y_(n)):_e.fromNumber(mo(n))}function vm(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return ae(n,e);let t=Rn(n),r=Rn(e),s=ae(t.seconds,r.seconds);return s!==0?s:ae(t.nanos,r.nanos)}function Rm(n,e){let t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){let i=Et(t[s],r[s]);if(i!==void 0&&i!==0)return i}return ae(t.length,r.length)}function I_(n,e){let t=n.mapValue.fields?.[yn].mapValue?.fields?.[po],r=e.mapValue.fields?.[yn].mapValue?.fields?.[po],s=n.mapValue.fields?.[yn].mapValue?.fields?.[go],i=e.mapValue.fields?.[yn].mapValue?.fields?.[go],o=_o(t,r);return o!==0?o:_o(s,i)}function Sm(n){if("bytesValue"in n)return{subtype:0,bytes:Kt(n.bytesValue)};let e=n.mapValue?.fields,t=e?.[ks],r=t?.bytesValue;if(!r)throw new Error("Received incorrect value for BsonBinaryData");let s=Kt(r).toUint8Array();if(s.length===0)throw new Error("Received empty bytesValue for BsonBinaryData");let i=s[0],o=s.slice(1);return{subtype:i,bytes:Re.fromUint8Array(o)}}function D_(n,e){let t=Sm(n),r=Sm(e);return t.subtype!==r.subtype?t.subtype<r.subtype?-1:1:t.bytes.compareTo(r.bytes)}function T_(n,e){let t=n.mapValue.fields,r=t?.[rn]?.mapValue?.fields?.[xs]?.stringValue??"",s=t?.[rn]?.mapValue?.fields?.[Fs]?.stringValue??"",i=e.mapValue.fields,o=i?.[rn]?.mapValue?.fields?.[xs]?.stringValue??"",u=i?.[rn]?.mapValue?.fields?.[Fs]?.stringValue??"",c=Bo(r,o);return c!==0?c:ae(s,u)}function A_(n,e){return Bo(n.mapValue.fields?.[kr]?.stringValue??"",e.mapValue.fields?.[kr]?.stringValue??"")}function Vs(n){return xh(n)}function xh(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){let r=Rn(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Kt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return ee.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(let i of t.values||[])s?s=!1:r+=",",r+=xh(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){let r=Object.keys(t.fields||{}).sort(),s="{",i=!0;for(let o of r)i?i=!1:s+=",",s+=`${o}:${xh(t.fields[o])}`;return s+"}"})(n.mapValue):Y(61005,{value:n})}function vu(n){switch(He(n)){case 0:case 2:return 4;case 3:return Lt(n)?16:8;case 4:case 11:return 16;case 6:let e=Ko(n);return e?16+vu(e):16;case 7:return 2*n.stringValue.length;case 8:return"bytesValue"in n?Kt(n.bytesValue).approximateByteSize():Pm(n.mapValue);case 9:return n.referenceValue.length;case 13:return(function(r){return(r.values||[]).reduce(((s,i)=>s+vu(i)),0)})(n.arrayValue);case 14:case 15:case 12:case 10:case 5:case 1:case 16:return Pm(n.mapValue);default:throw Y(13486,{value:n})}}function Pm(n){let e=0;return ns(n.fields,((t,r)=>{e+=t.length+vu(r)})),e}function sn(n){return!!n&&"integerValue"in n}function on(n){return!!n&&"doubleValue"in n}function Lt(n){if(!n.mapValue?.fields)return!1;let e=n.mapValue.fields;return xr(e)===1&&e[Sn]&&!!e[Sn].stringValue}function Xn(n){if(!n.mapValue?.fields)return!1;let e=n.mapValue.fields;return xr(e)===1&&e[or]?.integerValue!==void 0}function Pn(n){return sn(n)||on(n)||!!n&&Xn(n)||!!n&&Lt(n)}function Ms(n){return!!n&&"arrayValue"in n}function Tt(n){return!!n&&"nullValue"in n}function et(n){return!(!on(n)||!isNaN(Number(n.doubleValue)))||!(!Lt(n)||y_(n)!=="NaN")}function Ts(n){return!!n&&"mapValue"in n}function b_(n){if(!n.mapValue?.fields)return ce.ge;let e=n.mapValue.fields,t=e[Cc]?.stringValue;if(t&&Am[t])return Am[t];if(xr(e)===1){let r=Object.keys(e);return E_[r[0]]??ce.ge}return ce.ge}function Fh(n){return(n?.mapValue?.fields||{})[Cc]?.stringValue===mc}function kh(n){return(n?.mapValue?.fields||{})[Fr]?.arrayValue}function io(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){let e={mapValue:{fields:{}}};return ns(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=io(r))),e}if(n.arrayValue){let e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=io(n.arrayValue.values[t]);return e}return{...n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ft=class n{constructor(e){this.value=e}static empty(){return new n({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!Ts(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=io(t)}setAll(e){let t=bt.emptyPath(),r={},s=[];e.forEach(((o,u)=>{if(!t.isImmediateParentOf(u)){let c=this.getFieldsMap(t);this.applyChanges(c,r,s),r={},s=[],t=u.popLast()}o?r[u.lastSegment()]=io(o):s.push(u.lastSegment())}));let i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){let t=this.field(e.popLast());Ts(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return kt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];Ts(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){ns(t,((s,i)=>e[s]=i));for(let s of r)delete e[s]}clone(){return new n(io(this.value))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wd(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Os(e)?"-0":e}}function As(n){return{integerValue:""+n}}function Id(n,e,t){return YT(e)?As(e):wd(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Us=class{constructor(){this._=void 0}};function e0(n,e,t){return n instanceof Lr?(function(s,i){let o={fields:{[g_]:{stringValue:p_},[m_]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&gc(i)&&(i=Ko(i)),i&&(o.fields[C_]=i),{mapValue:o}})(t,e):n instanceof Vr?v_(n,e):n instanceof Mr?R_(n,e):n instanceof Ur?(function(s,i){let o=n0(s,i),u=Nm(o)+Nm(s.xe);return Lt(o)||Lt(s.xe)?{mapValue:{fields:{[Sn]:{stringValue:u.toString()}}}}:Xn(o)?on(s.xe)?{doubleValue:u}:sn(s.xe)?{integerValue:u.toString()}:{mapValue:{fields:{[or]:As(u)}}}:sn(o)&&(sn(s.xe)||Xn(s.xe))?As(u):wd(s.serializer,u)})(n,e):n instanceof Gs?(function(s,i){return!Pn(i)||et(s.xe)?s.xe:et(i)?i:_o(s.xe,i)<0?s.xe:i})(n,e):n instanceof Hs?(function(s,i){return!Pn(i)||et(s.xe)?s.xe:et(i)?i:_o(s.xe,i)>0?s.xe:i})(n,e):void 0}function t0(n,e,t){return n instanceof Vr?v_(n,e):n instanceof Mr?R_(n,e):t}function n0(n,e){return n instanceof Ur?Pn(e)?e:{integerValue:0}:null}var Lr=class extends Us{},Vr=class extends Us{constructor(e){super(),this.elements=e}};function v_(n,e){let t=S_(e);for(let r of n.elements)t.some((s=>kt(s,r)))||t.push(r);return{arrayValue:{values:t}}}var Mr=class extends Us{constructor(e){super(),this.elements=e}};function R_(n,e){let t=S_(e);for(let r of n.elements)t=t.filter((s=>!kt(s,r)));return{arrayValue:{values:t}}}var Eo=class extends Us{constructor(e,t){super(),this.serializer=e,this.xe=t}},Ur=class extends Eo{},Gs=class extends Eo{},Hs=class extends Eo{};function Nm(n){return sn(n)?Ae(n.integerValue):on(n)?Ae(n.doubleValue):Xn(n)?Ae(n.mapValue.fields[or].integerValue):Lt(n)?parseFloat(n.mapValue.fields[Sn].stringValue):0}function S_(n){return Ms(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Lh=class{constructor(e,t){this.field=e,this.transform=t}};function r0(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof Vr&&s instanceof Vr||r instanceof Mr&&s instanceof Mr?Ss(r.elements,s.elements,kt):r instanceof Ur&&s instanceof Ur||r instanceof Gs&&s instanceof Gs||r instanceof Hs&&s instanceof Hs?kt(r.xe,s.xe):r instanceof Lr&&s instanceof Lr})(n.transform,e.transform)}var qt=class n{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new n}static exists(e){return new n(void 0,e)}static updateTime(e){return new n(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}};function wu(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}var qs=class{};function P_(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new js(n.key,qt.none()):new Gr(n.key,n.data,qt.none());{let t=n.data,r=ft.empty(),s=new Ke(bt.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new Nn(n.key,r,new jt(s.toArray()),qt.none())}}function s0(n,e,t){n instanceof Gr?(function(s,i,o){let u=s.value.clone(),c=xm(s.fieldTransforms,i,o.transformResults);u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(n,e,t):n instanceof Nn?(function(s,i,o){if(!wu(s.precondition,i))return void i.convertToUnknownDocument(o.version);let u=xm(s.fieldTransforms,i,o.transformResults),c=i.data;c.setAll(N_(s)),c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function oo(n,e,t,r){return n instanceof Gr?(function(i,o,u,c){if(!wu(i.precondition,o))return u;let l=i.value.clone(),B=Fm(i.fieldTransforms,c,o);return l.setAll(B),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(n,e,t,r):n instanceof Nn?(function(i,o,u,c){if(!wu(i.precondition,o))return u;let l=Fm(i.fieldTransforms,c,o),B=o.data;return B.setAll(N_(i)),B.setAll(l),o.convertToFoundDocument(o.version,B).setHasLocalMutations(),u===null?null:u.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((d=>d.field)))})(n,e,t,r):(function(i,o,u){return wu(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):u})(n,e,t)}function Om(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&Ss(r,s,((i,o)=>r0(i,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}var Gr=class extends qs{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}},Nn=class extends qs{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}};function N_(n){let e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){let r=n.data.field(t);e.set(t,r)}})),e}function xm(n,e,t){let r=new Map;X(n.length===t.length,32656,{ve:t.length,De:n.length});for(let s=0;s<t.length;s++){let i=n[s],o=i.transform,u=e.data.field(i.field);r.set(i.field,t0(o,u,t[s]))}return r}function Fm(n,e,t){let r=new Map;for(let s of n){let i=s.transform,o=t.data.field(s.field);r.set(s.field,e0(i,o,e))}return r}var js=class extends qs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}},Ru=class extends qs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hr=class{constructor(e,t){this.position=e,this.inclusive=t}};function km(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){let i=e[s],o=n.position[s];if(i.field.isKeyField()?r=ee.comparator(ee.fromName(o.referenceValue),t.key):r=Et(o,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Lm(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!kt(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Su=class{},Ge=class n extends Su{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new Mh(e,t,r):t==="array-contains"?new Hh(e,r):t==="in"?new qh(e,r):t==="not-in"?new jh(e,r):t==="array-contains-any"?new Kh(e,r):new n(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new Uh(e,r):new Gh(e,r)}matches(e){let t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Et(t,this.value)):t!==null&&He(this.value)===He(t)&&this.matchesComparison(Et(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return Y(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}},zt=class n extends Su{constructor(e,t){super(),this.filters=e,this.op=t,this.Ce=null}static create(e,t){return new n(e,t)}matches(e){return O_(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Ce!==null||(this.Ce=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Ce}getFilters(){return Object.assign([],this.filters)}};function O_(n){return n.op==="and"}function x_(n){return i0(n)&&O_(n)}function i0(n){for(let e of n.filters)if(e instanceof zt)return!1;return!0}function Vh(n){if(n instanceof Ge)return n.field.canonicalString()+n.op.toString()+Vs(n.value);if(x_(n))return n.filters.map((e=>Vh(e))).join(",");{let e=n.filters.map((t=>Vh(t))).join(",");return`${n.op}(${e})`}}function F_(n,e){return n instanceof Ge?(function(r,s){return s instanceof Ge&&r.op===s.op&&r.field.isEqual(s.field)&&kt(r.value,s.value)})(n,e):n instanceof zt?(function(r,s){return s instanceof zt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,o,u)=>i&&F_(o,s.filters[u])),!0):!1})(n,e):void Y(19439)}function k_(n){return n instanceof Ge?(function(t){return`${t.field.canonicalString()} ${t.op} ${Vs(t.value)}`})(n):n instanceof zt?(function(t){return t.op.toString()+" {"+t.getFilters().map(k_).join(" ,")+"}"})(n):"Filter"}var Mh=class extends Ge{constructor(e,t,r){super(e,t,r),this.key=ee.fromName(r.referenceValue)}matches(e){let t=ee.comparator(e.key,this.key);return this.matchesComparison(t)}},Uh=class extends Ge{constructor(e,t){super(e,"in",t),this.keys=L_("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}},Gh=class extends Ge{constructor(e,t){super(e,"not-in",t),this.keys=L_("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}};function L_(n,e){return(e.arrayValue?.values||[]).map((t=>ee.fromName(t.referenceValue)))}var Hh=class extends Ge{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return Ms(t)&&Co(t.arrayValue,this.value)}},qh=class extends Ge{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return t!==null&&Co(this.value.arrayValue,t)}},jh=class extends Ge{constructor(e,t){super(e,"not-in",t)}matches(e){if(Co(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Co(this.value.arrayValue,t)}},Kh=class extends Ge{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!Ms(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Co(this.value.arrayValue,r)))}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var qr=class{constructor(e,t="asc"){this.field=e,this.dir=t}};function o0(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ne=class n{static fromTimestamp(e){return new n(e)}static min(){return new n(new Pe(0,0))}static max(){return new n(new Pe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Rt=class n{constructor(e,t,r,s,i,o,u){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=u}static newInvalidDocument(e){return new n(e,0,ne.min(),ne.min(),ne.min(),ft.empty(),0)}static newFoundDocument(e,t,r,s){return new n(e,1,t,ne.min(),r,s,0)}static newNoDocument(e,t){return new n(e,2,t,ne.min(),ne.min(),ft.empty(),0)}static newUnknownDocument(e,t){return new n(e,3,t,ne.min(),ne.min(),ft.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(ne.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ft.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ft.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ne.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof n&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new n(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var yo=-1,Pu=class{constructor(e,t,r,s){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=s}};Pu.UNKNOWN_ID=-1;function a0(n,e){let t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=ne.fromTimestamp(r===1e9?new Pe(t+1,0):new Pe(t,r));return new jr(s,ee.empty(),e)}function u0(n){return new jr(n.readTime,n.key,yo)}var jr=class n{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new n(ne.min(),ee.empty(),yo)}static max(){return new n(ne.max(),ee.empty(),yo)}};function c0(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=ee.comparator(n.documentKey,e.documentKey),t!==0?t:ae(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jh=class{constructor(e,t=null,r=[],s=[],i=null,o=null,u=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=u,this.Fe=null}};function Vm(n,e=null,t=[],r=[],s=null,i=null,o=null){return new Jh(n,e,t,r,s,i,o)}function V_(n){let e=le(n);if(e.Fe===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Vh(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),Jo(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>Vs(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>Vs(r))).join(",")),e.Fe=t}return e.Fe}function M_(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!o0(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!F_(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Lm(n.startAt,e.startAt)&&Lm(n.endAt,e.endAt)}function vr(n){return!!n.isCorePipeline}function U_(n){return!!n.path&&ee.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ks=class{constructor(e,t=null,r=[],s=[],i=null,o="F",u=null,c=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=u,this.endAt=c,this.Oe=null,this.Me=null,this.Ne=null,this.startAt,this.endAt}};function l0(n,e,t,r,s,i,o,u){return new Ks(n,e,t,r,s,i,o,u)}function Wo(n){return new Ks(n)}function Mm(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function h0(n){return ee.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function G_(n){return n.collectionGroup!==null}function bs(n){let e=le(n);if(e.Oe===null){e.Oe=[];let t=new Set;for(let i of e.explicitOrderBy)e.Oe.push(i),t.add(i.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let u=new Ke(bt.comparator);return o.filters.forEach((c=>{c.getFlattenedFilters().forEach((l=>{l.isInequality()&&(u=u.add(l.field))}))})),u})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Oe.push(new qr(i,r))})),t.has(bt.keyField().canonicalString())||e.Oe.push(new qr(bt.keyField(),r))}return e.Oe}function un(n){let e=le(n);return e.Me||(e.Me=B0(e,bs(n))),e.Me}function B0(n,e){if(n.limitType==="F")return Vm(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{let i=s.dir==="desc"?"asc":"desc";return new qr(s.field,i)}));let t=n.endAt?new Hr(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Hr(n.startAt.position,n.startAt.inclusive):null;return Vm(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Nu(n,e,t){return new Ks(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function f0(n,e){return M_(un(n),un(e))&&n.limitType===e.limitType}function ao(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>k_(s))).join(", ")}]`),Jo(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>Vs(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>Vs(s))).join(",")),`Target(${r})`})(un(n))}; limitType=${n.limitType})`}function _c(n,e){return e.isFoundDocument()&&(function(r,s){let i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):ee.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(let i of bs(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(let i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(o,u,c){let l=km(o,u,c);return o.inclusive?l<=0:l<0})(r.startAt,bs(r),s)||r.endAt&&!(function(o,u,c){let l=km(o,u,c);return o.inclusive?l>=0:l>0})(r.endAt,bs(r),s))})(n,e)}function Dd(n){return(e,t)=>{let r=!1;for(let s of bs(n)){let i=d0(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function d0(n,e,t){let r=n.field.isKeyField()?ee.comparator(e.key,t.key):(function(i,o,u){let c=o.data.field(i),l=u.data.field(i);return c!==null&&l!==null?Et(c,l):Y(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return Y(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zh=class{constructor(e,t){this.count=e,this.unchangedNames=t}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Me,de;function p0(n){switch(n){case L.OK:return Y(64938);case L.CANCELLED:case L.UNKNOWN:case L.DEADLINE_EXCEEDED:case L.RESOURCE_EXHAUSTED:case L.INTERNAL:case L.UNAVAILABLE:case L.UNAUTHENTICATED:return!1;case L.INVALID_ARGUMENT:case L.NOT_FOUND:case L.ALREADY_EXISTS:case L.PERMISSION_DENIED:case L.FAILED_PRECONDITION:case L.ABORTED:case L.OUT_OF_RANGE:case L.UNIMPLEMENTED:case L.DATA_LOSS:return!0;default:return Y(15467,{code:n})}}function H_(n){if(n===void 0)return vn("GRPC error has no .code"),L.UNKNOWN;switch(n){case Me.OK:return L.OK;case Me.CANCELLED:return L.CANCELLED;case Me.UNKNOWN:return L.UNKNOWN;case Me.DEADLINE_EXCEEDED:return L.DEADLINE_EXCEEDED;case Me.RESOURCE_EXHAUSTED:return L.RESOURCE_EXHAUSTED;case Me.INTERNAL:return L.INTERNAL;case Me.UNAVAILABLE:return L.UNAVAILABLE;case Me.UNAUTHENTICATED:return L.UNAUTHENTICATED;case Me.INVALID_ARGUMENT:return L.INVALID_ARGUMENT;case Me.NOT_FOUND:return L.NOT_FOUND;case Me.ALREADY_EXISTS:return L.ALREADY_EXISTS;case Me.PERMISSION_DENIED:return L.PERMISSION_DENIED;case Me.FAILED_PRECONDITION:return L.FAILED_PRECONDITION;case Me.ABORTED:return L.ABORTED;case Me.OUT_OF_RANGE:return L.OUT_OF_RANGE;case Me.UNIMPLEMENTED:return L.UNIMPLEMENTED;case Me.DATA_LOSS:return L.DATA_LOSS;default:return Y(39323,{code:n})}}(de=Me||(Me={}))[de.OK=0]="OK",de[de.CANCELLED=1]="CANCELLED",de[de.UNKNOWN=2]="UNKNOWN",de[de.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",de[de.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",de[de.NOT_FOUND=5]="NOT_FOUND",de[de.ALREADY_EXISTS=6]="ALREADY_EXISTS",de[de.PERMISSION_DENIED=7]="PERMISSION_DENIED",de[de.UNAUTHENTICATED=16]="UNAUTHENTICATED",de[de.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",de[de.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",de[de.ABORTED=10]="ABORTED",de[de.OUT_OF_RANGE=11]="OUT_OF_RANGE",de[de.UNIMPLEMENTED=12]="UNIMPLEMENTED",de[de.INTERNAL=13]="INTERNAL",de[de.UNAVAILABLE=14]="UNAVAILABLE",de[de.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var On=class{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(let[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){let r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){ns(this.inner,((t,r)=>{for(let[s,i]of r)e(s,i)}))}isEmpty(){return B_(this.inner)}size(){return this.innerSize}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var g0=new Ne(ee.comparator);function At(){return g0}var q_=new Ne(ee.comparator);function Es(...n){let e=q_;for(let t of n)e=e.insert(t.key,t);return e}function C0(n){let e=q_;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function Qn(){return uo()}function j_(){return uo()}function uo(){return new On((n=>n.toString()),((n,e)=>n.isEqual(e)))}var zS=new Ne(ee.comparator),m0=new Ke(ee.comparator);function Be(...n){let e=m0;for(let t of n)e=e.add(t);return e}var _0=new Ke(ae);function E0(){return _0}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var y0=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function w0(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var I0=new _n([4294967295,4294967295],0);function Um(n){let e=w0().encode(n),t=new ch;return t.update(e),new Uint8Array(t.digest())}function Gm(n){let e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new _n([t,r],0),new _n([s,i],0)]}var Wh=class n{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Rr(`Invalid padding: ${t}`);if(r<0)throw new Rr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Rr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Rr(`Invalid padding when bitmap length is 0: ${t}`);this.Be=8*e.length-t,this.Le=_n.fromNumber(this.Be)}$e(e,t,r){let s=e.add(t.multiply(_n.fromNumber(r)));return s.compare(I0)===1&&(s=new _n([s.getBits(0),s.getBits(1)],0)),s.modulo(this.Le).toNumber()}Ue(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.Be===0)return!1;let t=Um(e),[r,s]=Gm(t);for(let i=0;i<this.hashCount;i++){let o=this.$e(r,s,i);if(!this.Ue(o))return!1}return!0}static create(e,t,r){let s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new n(i,s,t);return r.forEach((u=>o.insert(u))),o}insert(e){if(this.Be===0)return;let t=Um(e),[r,s]=Gm(t);for(let i=0;i<this.hashCount;i++){let o=this.$e(r,s,i);this.ke(o)}}ke(e){let t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}},Rr=class extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wo=class n{constructor(e,t,r,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){let s=new Map;return s.set(e,Io.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new n(ne.min(),s,new Ne(ae),At(),At(),Be())}},Io=class n{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new n(r,t,Be(),Be(),Be())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vs=class{constructor(e,t,r,s){this.Qe=e,this.removedTargetIds=t,this.key=r,this.qe=s}},Ou=class{constructor(e,t){this.targetId=e,this.Ke=t}},xu=class{constructor(e,t,r=Re.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}},Fu=class{constructor(e){this.targetId=e,this.We=0,this.Ge=Hm(),this.je=Re.EMPTY_BYTE_STRING,this.ze=!1,this.He=!0}get current(){return this.ze}get resumeToken(){return this.je}get Je(){return this.We!==0}get Ye(){return this.He}Ze(e){e.approximateByteSize()>0&&(this.He=!0,this.je=e)}Xe(){let e=Be(),t=Be(),r=Be();return this.Ge.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:Y(38017,{changeType:i})}})),new Io(this.je,this.ze,e,t,r)}et(){this.He=!1,this.Ge=Hm()}tt(e,t){this.He=!0,this.Ge=this.Ge.insert(e,t)}nt(e){this.He=!0,this.Ge=this.Ge.remove(e)}rt(){this.We+=1}it(){this.We-=1,X(this.We>=0,3241,{We:this.We,targetId:this.targetId})}st(){this.He=!0,this.ze=!0}},no="WatchChangeAggregator",Qh=class{constructor(e){this._t=e,this.ot=new Map,this.ut=At(),this.ct=Cu(),this.lt=At(),this.Et=Cu(),this.ht=new Ne(ae)}Tt(e){for(let t of e.Qe)e.qe&&e.qe.isFoundDocument()?this.Pt(t,e.qe):this.It(t,e.key,e.qe);for(let t of e.removedTargetIds)this.It(t,e.key,e.qe)}Rt(e){this.forEachTarget(e,(t=>{let r=this.ot.get(t);if(r)switch(e.state){case 0:this.At(t)&&r.Ze(e.resumeToken);break;case 1:r.it(),r.Je||r.et(),r.Ze(e.resumeToken);break;case 2:r.it(),r.Je||this.removeTarget(t);break;case 3:this.At(t)&&(r.st(),r.Ze(e.resumeToken));break;case 4:this.At(t)&&(this.Vt(t),r.Ze(e.resumeToken));break;default:Y(56790,{state:e.state})}else W(no,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ot.forEach(((r,s)=>{this.At(s)&&t(s)}))}dt(e){return vr(e)?e.getPipelineSourceType()==="documents"&&e.getPipelineDocuments()?.length===1:U_(e)}ft(e){let t=e.targetId,r=e.Ke.count,s=this.gt(t);if(s){let i=s.target;if(this.dt(i))if(r===0){let o=new ee(vr(i)?Ce.fromString(i.getPipelineDocuments()[0]):i.path);this.It(t,o,Rt.newNoDocument(o,ne.min()))}else X(r===1,20013,"Single document existence filter with count: "+r);else{let o=this.yt(t);if(o!==r){let u=this.wt(e),c=u?this.bt(u,e,o):1;if(c!==0){this.Vt(t);let l=c===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.ht=this.ht.insert(t,l)}y0?.St((function(B,d,g,w,D){let P={localCacheCount:B,existenceFilterCount:d.count,databaseId:g.database,projectId:g.projectId},V=d.unchangedNames;return V&&(P.bloomFilter={applied:D===0,hashCount:V?.hashCount??0,bitmapLength:V?.bits?.bitmap?.length??0,padding:V?.bits?.padding??0,mightContain:j=>w?.mightContain(j)??!1}),P})(o,e.Ke,this._t.xt(),u,c))}}}}wt(e){let t=e.Ke.unchangedNames;if(!t||!t.bits)return null;let{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t,o,u;try{o=Kt(r).toUint8Array()}catch(c){if(c instanceof Au)return Ft("Decoding the base64 bloom filter in existence filter failed ("+c.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw c}try{u=new Wh(o,s,i)}catch(c){return Ft(c instanceof Rr?"BloomFilter error: ":"Applying bloom filter failed: ",c),null}return u.Be===0?null:u}bt(e,t,r){return t.Ke.count===r-this.vt(e,t.targetId)?0:2}vt(e,t){let r=this._t.getRemoteKeysForTarget(t),s=0;return r.forEach((i=>{let o=this._t.xt(),u=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(u)||(this.It(t,i,null),s++)})),s}Dt(e){let t=new Map;this.ot.forEach(((i,o)=>{let u=this.gt(o);if(u){if(i.current&&this.dt(u.target)){let c=vr(u.target)?Ce.fromString(u.target.getPipelineDocuments()[0]):u.target.path,l=new ee(c);this.Ct(l).has(o)||this.Ft(o,l)||this.It(o,l,Rt.newNoDocument(l,e))}i.Ye&&(t.set(o,i.Xe()),i.et())}}));let r=Be();this.Et.forEach(((i,o)=>{let u=!0;o.forEachWhile((c=>{let l=this.gt(c);return!l||l.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(r=r.add(i))})),this.ut.forEach(((i,o)=>o.setReadTime(e))),this.lt.forEach(((i,o)=>o.setReadTime(e)));let s=new wo(e,t,this.ht,this.ut,this.lt,r);return this.ut=At(),this.ct=Cu(),this.lt=At(),this.Et=Cu(),this.ht=new Ne(ae),s}Pt(e,t){let r=this.ot.get(e);if(!r||!this.At(e))return void W(no,`addDocumentToTarget received document for unknown inactive target (${e})`);let s=this.Ft(e,t.key)?2:0;r.tt(t.key,s),vr(this.gt(e).target)&&this.gt(e).target.getPipelineFlavor()!=="exact"?this.lt=this.lt.insert(t.key,t):this.ut=this.ut.insert(t.key,t),this.ct=this.ct.insert(t.key,this.Ct(t.key).add(e)),this.Et=this.Et.insert(t.key,this.Ot(t.key).add(e))}It(e,t,r){let s=this.ot.get(e);s&&this.At(e)?(this.Ft(e,t)?s.tt(t,1):s.nt(t),this.Et=this.Et.insert(t,this.Ot(t).delete(e)),this.Et=this.Et.insert(t,this.Ot(t).add(e)),r&&(vr(this.gt(e).target)&&this.gt(e).target.getPipelineFlavor()!=="exact"?this.lt=this.lt.insert(t,r):this.ut=this.ut.insert(t,r))):W(no,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.ot.delete(e)}yt(e){let t=this.ot.get(e);if(!t)return 0;let r=t.Xe();return this._t.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}rt(e){let t=this.ot.get(e);t||(W(no,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Fu(e),this.ot.set(e,t)),t.rt()}Ot(e){let t=this.Et.get(e);return t||(t=new Ke(ae),this.Et=this.Et.insert(e,t)),t}Ct(e){let t=this.ct.get(e);return t||(t=new Ke(ae),this.ct=this.ct.insert(e,t)),t}At(e){let t=this.gt(e)!==null;return t||W(no,"Detected inactive target",e),t}gt(e){let t=this.ot.get(e);return t===void 0||t.Je?null:this._t.Mt(e)}Vt(e){this.ot.set(e,new Fu(e)),this._t.getRemoteKeysForTarget(e).forEach((t=>{this.It(e,t,null)}))}Ft(e,t){return this._t.getRemoteKeysForTarget(e).has(t)}};function Cu(){return new Ne(ee.comparator)}function Hm(){return new Ne(ee.comparator)}var D0={asc:"ASCENDING",desc:"DESCENDING"},T0={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},A0={and:"AND",or:"OR"},$h=class{constructor(e,t){this.databaseId=e,this.useProto3Json=t}};function Yh(n,e){return n.useProto3Json||Jo(e)?e:{value:e}}function co(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Td(n){let e=Rn(n);return new Pe(e.seconds,e.nanos)}function Xh(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Iu(n,e){return co(n,e.toTimestamp())}function In(n){return X(!!n,49232),ne.fromTimestamp(Td(n))}function Ad(n,e){return Zh(n,e).canonicalString()}function Zh(n,e){let t=(function(s){return new Ce(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function K_(n){let e=Ce.fromString(n);return X($_(e),10190,{key:e.toString()}),e}function Do(n,e){return Ad(n.databaseId,e.path)}function lo(n,e){let t=K_(e);if(t.get(1)!==n.databaseId.projectId)throw new J(L.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new J(L.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new ee(z_(t))}function J_(n,e){return Ad(n.databaseId,e)}function b0(n){let e=K_(n);return e.length===4?Ce.emptyPath():z_(e)}function qm(n){return new Ce(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function z_(n){return X(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function jm(n,e,t){return{name:Do(n,e),fields:t.value.mapValue.fields}}function v0(n,e){return"found"in e?(function(r,s){X(!!s.found,43571),s.found.name,s.found.updateTime;let i=lo(r,s.found.name),o=In(s.found.updateTime),u=s.found.createTime?In(s.found.createTime):ne.min(),c=new ft({mapValue:{fields:s.found.fields}});return Rt.newFoundDocument(i,o,u,c)})(n,e):"missing"in e?(function(r,s){X(!!s.missing,3894),X(!!s.readTime,22933);let i=lo(r,s.missing),o=In(s.readTime);return Rt.newNoDocument(i,o)})(n,e):Y(7234,{result:e})}function R0(n,e){let t;if("targetChange"in e){e.targetChange;let r=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:Y(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,B){return l.useProto3Json?(X(B===void 0||typeof B=="string",58123),Re.fromBase64String(B||"")):(X(B===void 0||B instanceof Buffer||B instanceof Uint8Array,16193),Re.fromUint8Array(B||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,u=o&&(function(l){let B=l.code===void 0?L.UNKNOWN:H_(l.code);return new J(B,l.message||"")})(o);t=new xu(r,s,i,u||null)}else if("documentChange"in e){e.documentChange;let r=e.documentChange;r.document,r.document.name,r.document.updateTime;let s=lo(n,r.document.name),i=In(r.document.updateTime),o=r.document.createTime?In(r.document.createTime):ne.min(),u=new ft({mapValue:{fields:r.document.fields}}),c=Rt.newFoundDocument(s,i,o,u),l=r.targetIds||[],B=r.removedTargetIds||[];t=new vs(l,B,c.key,c)}else if("documentDelete"in e){e.documentDelete;let r=e.documentDelete;r.document;let s=lo(n,r.document),i=r.readTime?In(r.readTime):ne.min(),o=Rt.newNoDocument(s,i),u=r.removedTargetIds||[];t=new vs([],u,o.key,o)}else if("documentRemove"in e){e.documentRemove;let r=e.documentRemove;r.document;let s=lo(n,r.document),i=r.removedTargetIds||[];t=new vs([],i,s,null)}else{if(!("filter"in e))return Y(11601,{Nt:e});{e.filter;let r=e.filter;r.targetId;let{count:s=0,unchangedNames:i}=r,o=new zh(s,i),u=r.targetId;t=new Ou(u,o)}}return t}function S0(n,e){let t;if(e instanceof Gr)t={update:jm(n,e.key,e.value)};else if(e instanceof js)t={delete:Do(n,e.key)};else if(e instanceof Nn)t={update:jm(n,e.key,e.data),updateMask:M0(e.fieldMask)};else{if(!(e instanceof Ru))return Y(16599,{Bt:e.type});t={verify:Do(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,o){let u=o.transform;if(u instanceof Lr)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Vr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Mr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Ur)return{fieldPath:o.field.canonicalString(),increment:u.xe};if(u instanceof Gs)return{fieldPath:o.field.canonicalString(),minimum:u.xe};if(u instanceof Hs)return{fieldPath:o.field.canonicalString(),maximum:u.xe};throw Y(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Iu(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:Y(27497)})(n,e.precondition)),t}function P0(n,e){return{documents:[J_(n,e.path)]}}function N0(n,e){let t={structuredQuery:{}},r=e.path,s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=J_(n,s);let i=(function(l){if(l.length!==0)return Q_(zt.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);let o=(function(l){if(l.length!==0)return l.map((B=>(function(g){return{field:ys(g.field),direction:k0(g.dir)}})(B)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);let u=Yh(n,e.limit);return u!==null&&(t.structuredQuery.limit=u),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{Lt:t,parent:s}}function O0(n){let e=b0(n.parent),t=n.structuredQuery,r=t.from?t.from.length:0,s=null;if(r>0){X(r===1,65062);let B=t.from[0];B.allDescendants?s=B.collectionId:e=e.child(B.collectionId)}let i=[];t.where&&(i=(function(d){let g=W_(d);return g instanceof zt&&x_(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(d){return d.map((g=>(function(D){return new qr(ws(D.field),(function(V){switch(V){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(D.direction))})(g)))})(t.orderBy));let u=null;t.limit&&(u=(function(d){let g;return g=typeof d=="object"?d.value:d,Jo(g)?null:g})(t.limit));let c=null;t.startAt&&(c=(function(d){let g=!!d.before,w=d.values||[];return new Hr(w,g)})(t.startAt));let l=null;return t.endAt&&(l=(function(d){let g=!d.before,w=d.values||[];return new Hr(w,g)})(t.endAt)),l0(e,s,o,i,u,"F",c,l)}function x0(n,e){let t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Y(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function F0(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function W_(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":let r=ws(t.unaryFilter.field);return Ge.create(r,"==",{doubleValue:NaN});case"IS_NULL":let s=ws(t.unaryFilter.field);return Ge.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let i=ws(t.unaryFilter.field);return Ge.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let o=ws(t.unaryFilter.field);return Ge.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Y(61313);default:return Y(60726)}})(n):n.fieldFilter!==void 0?(function(t){return Ge.create(ws(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Y(58110);default:return Y(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return zt.create(t.compositeFilter.filters.map((r=>W_(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return Y(1026)}})(t.compositeFilter.op))})(n):Y(30097,{filter:n})}function k0(n){return D0[n]}function L0(n){return T0[n]}function V0(n){return A0[n]}function ys(n){return{fieldPath:n.canonicalString()}}function ws(n){return bt.fromServerFormat(n.fieldPath)}function Q_(n){return n instanceof Ge?(function(t){if(t.op==="=="){if(et(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NAN"}};if(Tt(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(et(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NOT_NAN"}};if(Tt(t.value))return{unaryFilter:{field:ys(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ys(t.field),op:L0(t.op),value:t.value}}})(n):n instanceof zt?(function(t){let r=t.getFilters().map((s=>Q_(s)));return r.length===1?r[0]:{compositeFilter:{op:V0(t.op),filters:r}}})(n):Y(54877,{filter:n})}function M0(n){let e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function $_(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Y_(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function To(n,e){let t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function X_(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ec(n){return new $h(n,!0)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Js=class{constructor(e){this.value=e}isEqual(e){return this.value===e.value}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zs=class{constructor(e,t){if(this.seconds=e,this.increment=t,!Number.isInteger(e)||e<0||e>4294967295)throw new Error("BsonTimestamp 'seconds' must be in the range of a 32-bit unsigned integer (0-4294967295).");if(!Number.isInteger(t)||t<0||t>4294967295)throw new Error("BsonTimestamp 'increment' must be in the range of a 32-bit unsigned integer (0-4294967295).")}isEqual(e){return this.seconds===e.seconds&&this.increment===e.increment}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jt=class n{constructor(e,t=0){if(this.subtype=t,!Number.isInteger(t)||t<0||t>255)throw new J(L.INVALID_ARGUMENT,"The subtype for Bytes must be a value in the inclusive [0, 255] range.");this._byteString=e}static fromBase64String(e,t=0){try{return new n(Re.fromBase64String(e),t)}catch(r){throw new J(L.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+r)}}static fromUint8Array(e,t=0){return new n(Re.fromUint8Array(e),t)}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}get data(){return this.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+", subtype: "+this.subtype+")"}isEqual(e){return this.subtype===e.subtype&&this._byteString.isEqual(e._byteString)}toJSON(){let e={type:n._jsonSchemaVersion,bytes:this.toBase64()};return this.subtype!==0&&(e.subtype=this.subtype),e}static fromJSON(e){if(jo(e,n._jsonSchema)){let t=e.subtype??0;return n.fromBase64String(e.bytes,t)}}};Jt._jsonSchemaVersion="firestore/bytes/1.0",Jt._jsonSchema={type:ke("string",Jt._jsonSchemaVersion),bytes:ke("string"),subtype:{...ke("number"),optional:!0}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ws=class{constructor(e){this.stringValue=e,this.value=_e.fromString(e)}isEqual(e){return!(!this.value.oe()||!e.value.oe())||this.value.compareTo(e.value)===0}toJSON(){return{Ut:{stringValue:this.stringValue}}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Kr=class{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new J(L.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new bt(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}};function Z_(){return new Kr(Ps)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jr=class{constructor(e){this._methodName=e}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Dn=class n{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new J(L.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new J(L.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return ae(this._lat,e._lat)||ae(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:n._jsonSchemaVersion}}static fromJSON(e){if(jo(e,n._jsonSchema))return new n(e.latitude,e.longitude)}};Dn._jsonSchemaVersion="firestore/geoPoint/1.0",Dn._jsonSchema={type:ke("string",Dn._jsonSchemaVersion),latitude:ke("number"),longitude:ke("number")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qs=class{constructor(e){this.value=e}isEqual(e){return this.value===e.value}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zr=class n{constructor(){this.type="MaxKey"}static instance(){return n.MAX_KEY_VALUE_INSTANCE||(n.MAX_KEY_VALUE_INSTANCE=new n),n.MAX_KEY_VALUE_INSTANCE}};zr.MAX_KEY_VALUE_INSTANCE=null;/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wr=class n{constructor(){this.type="MinKey"}static instance(){return n.MIN_KEY_VALUE_INSTANCE||(n.MIN_KEY_VALUE_INSTANCE=new n),n.MIN_KEY_VALUE_INSTANCE}};Wr.MIN_KEY_VALUE_INSTANCE=null;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Xe=class{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}};Xe.UNAUTHENTICATED=new Xe(null),Xe.GOOGLE_CREDENTIALS=new Xe("google-credentials-uid"),Xe.FIRST_PARTY=new Xe("first-party-uid"),Xe.MOCK_USER=new Xe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var cn=class{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ku=class{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}},Lu=class{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Xe.UNAUTHENTICATED)))}shutdown(){}},eB=class{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}},Vu=class{constructor(e){this.kt=e,this.currentUser=Xe.UNAUTHENTICATED,this.Qt=0,this.forceRefresh=!1,this.auth=null}start(e,t){X(this.qt===void 0,42304);let r=this.Qt,s=c=>this.Qt!==r?(r=this.Qt,t(c)):Promise.resolve(),i=new cn;this.qt=()=>{this.Qt++,this.currentUser=this.Kt(),i.resolve(),i=new cn,e.enqueueRetryable((()=>s(this.currentUser)))};let o=()=>{let c=i;e.enqueueRetryable((async()=>{await c.promise,await s(this.currentUser)}))},u=c=>{W("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=c,this.qt&&(this.auth.addAuthTokenListener(this.qt),o())};this.kt.onInit((c=>u(c))),setTimeout((()=>{if(!this.auth){let c=this.kt.getImmediate({optional:!0});c?u(c):(W("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new cn)}}),0),o()}getToken(){let e=this.Qt,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.Qt!==e?(W("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(X(typeof r.accessToken=="string",31837,{Wt:r}),new ku(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.qt&&this.auth.removeAuthTokenListener(this.qt),this.qt=void 0}Kt(){let e=this.auth&&this.auth.getUid();return X(e===null||typeof e=="string",2055,{Gt:e}),new Xe(e)}},tB=class{constructor(e,t,r){this.jt=e,this.zt=t,this.Ht=r,this.type="FirstParty",this.user=Xe.FIRST_PARTY,this.Jt=new Map}Yt(){return this.Ht?this.Ht():null}get headers(){this.Jt.set("X-Goog-AuthUser",this.jt);let e=this.Yt();return e&&this.Jt.set("Authorization",e),this.zt&&this.Jt.set("X-Goog-Iam-Authorization-Token",this.zt),this.Jt}},nB=class{constructor(e,t,r){this.jt=e,this.zt=t,this.Ht=r}getToken(){return Promise.resolve(new tB(this.jt,this.zt,this.Ht))}start(e,t){e.enqueueRetryable((()=>t(Xe.FIRST_PARTY)))}shutdown(){}invalidateToken(){}},Mu=class{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}},Uu=class{constructor(e,t){this.Zt=t,this.forceRefresh=!1,this.appCheck=null,this.Xt=null,this.en=null,it(e)&&e.settings.appCheckToken&&(this.en=e.settings.appCheckToken)}start(e,t){X(this.qt===void 0,3512);let r=i=>{i.error!=null&&W("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);let o=i.token!==this.Xt;return this.Xt=i.token,W("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.qt=i=>{e.enqueueRetryable((()=>r(i)))};let s=i=>{W("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.qt&&this.appCheck.addTokenListener(this.qt)};this.Zt.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){let i=this.Zt.getImmediate({optional:!0});i?s(i):W("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.en)return Promise.resolve(new Mu(this.en));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(X(typeof t.token=="string",44558,{tokenResult:t}),this.Xt=t.token,new Mu(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.qt&&this.appCheck.removeTokenListener(this.qt),this.qt=void 0}};function eE(n){let e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rB=class{tn(e){}shutdown(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Km="ConnectivityMonitor",Gu=class{constructor(){this.nn=()=>this.rn(),this.sn=()=>this._n(),this.an=[],this.un()}tn(e){this.an.push(e)}shutdown(){window.removeEventListener("online",this.nn),window.removeEventListener("offline",this.sn)}un(){window.addEventListener("online",this.nn),window.addEventListener("offline",this.sn)}rn(){W(Km,"Network connectivity changed: AVAILABLE");for(let e of this.an)e(0)}_n(){W(Km,"Network connectivity changed: UNAVAILABLE");for(let e of this.an)e(1)}static cn(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var mu=null;function sB(){return mu===null?mu=(function(){return 268435456+Math.round(2147483648*Math.random())})():mu++,"0x"+mu.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bh="RestConnection",U0={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"},iB=class{get En(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.hn=t+"://"+e.host,this.Tn=`projects/${r}/databases/${s}`,this.Pn=this.databaseId.database===bu?`project_id=${r}`:`project_id=${r}&database_id=${s}`}In(e,t,r,s,i){let o=sB(),u=this.Rn(e,t.toUriEncodedString());W(bh,`Sending RPC '${e}' ${o}:`,u,r);let c={"google-cloud-resource-prefix":this.Tn,"x-goog-request-params":this.Pn};this.An(c,s,i);let{host:l}=new URL(u),B=Yt(l);return this.Vn(e,u,c,r,B).then((d=>(W(bh,`Received RPC '${e}' ${o}: `,d),d)),(d=>{throw Ft(bh,`RPC '${e}' ${o} failed with error: `,d,"url: ",u,"request:",r),d}))}dn(e,t,r,s,i,o){return this.In(e,t,r,s,i)}An(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+oi})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(let s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}Rn(e,t){let r=U0[e],s=`${this.hn}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oB=class{constructor(e){this.fn=e.fn,this.mn=e.mn}pn(e){this.gn=e}yn(e){this.wn=e}bn(e){this.Sn=e}onMessage(e){this.xn=e}close(){this.mn()}send(e){this.fn(e)}vn(){this.gn()}Dn(){this.wn()}Cn(e){this.Sn(e)}Fn(e){this.xn(e)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ot="WebChannelConnection",ro=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))},Hu=class n extends iB{constructor(e){super(e),this.On=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static Mn(){if(!n.Nn){let e=fh();ro(e,Bh.STAT_EVENT,(t=>{t.stat===ou.PROXY?W(ot,"STAT_EVENT: detected buffering proxy"):t.stat===ou.NOPROXY&&W(ot,"STAT_EVENT: detected no buffering proxy")})),n.Nn=!0}}Vn(e,t,r,s,i){let o=sB();return new Promise(((u,c)=>{let l=new lh;l.setWithCredentials(!0),l.listenOnce(hh.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case $i.NO_ERROR:let d=l.getResponseJson();W(ot,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(d)),u(d);break;case $i.TIMEOUT:W(ot,`RPC '${e}' ${o} timed out`),c(new J(L.DEADLINE_EXCEEDED,"Request time out"));break;case $i.HTTP_ERROR:let g=l.getStatus();if(W(ot,`RPC '${e}' ${o} failed with status:`,g,"response text:",l.getResponseText()),g>0){let w=l.getResponseJson();Array.isArray(w)&&(w=w[0]);let D=w?.error;if(D&&D.status&&D.message){let P=(function(j){let Q=j.toLowerCase().replace(/_/g,"-");return Object.values(L).indexOf(Q)>=0?Q:L.UNKNOWN})(D.status);c(new J(P,D.message))}else c(new J(L.UNKNOWN,"Server responded with status "+l.getStatus()))}else c(new J(L.UNAVAILABLE,"Connection failed."));break;default:Y(9055,{Bn:e,streamId:o,Ln:l.getLastErrorCode(),$n:l.getLastError()})}}finally{W(ot,`RPC '${e}' ${o} completed.`)}}));let B=JSON.stringify(s);W(ot,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",B,r,15)}))}Un(e,t,r){let s=sB(),i=[this.hn,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.An(u.initMessageHeaders,t,r),u.encodeInitMessageHeaders=!0;let l=i.join("");W(ot,`Creating RPC '${e}' stream ${s}: ${l}`,u);let B=o.createWebChannel(l,u);this.kn(B);let d=!1,g=!1,w=new oB({fn:D=>{g?W(ot,`Not sending because RPC '${e}' stream ${s} is closed:`,D):(d||(W(ot,`Opening RPC '${e}' stream ${s} transport.`),B.open(),d=!0),W(ot,`RPC '${e}' stream ${s} sending:`,D),B.send(D))},mn:()=>B.close()});return ro(B,gs.EventType.OPEN,(()=>{g||(W(ot,`RPC '${e}' stream ${s} transport opened.`),w.vn())})),ro(B,gs.EventType.CLOSE,(()=>{g||(g=!0,W(ot,`RPC '${e}' stream ${s} transport closed`),w.Cn(),this.Qn(B))})),ro(B,gs.EventType.ERROR,(D=>{g||(g=!0,Ft(ot,`RPC '${e}' stream ${s} transport errored. Name:`,D.name,"Message:",D.message),w.Cn(new J(L.UNAVAILABLE,"The operation could not be completed")))})),ro(B,gs.EventType.MESSAGE,(D=>{if(!g){let P=D.data[0];X(!!P,16349);let V=P,j=V?.error||V[0]?.error;if(j){W(ot,`RPC '${e}' stream ${s} received error:`,j);let Q=j.status,re=(function(Ee){let A=Me[Ee];if(A!==void 0)return H_(A)})(Q),ue=j.message;Q==="NOT_FOUND"&&ue.includes("database")&&ue.includes("does not exist")&&ue.includes(this.databaseId.database)&&Ft(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),re===void 0&&(re=L.INTERNAL,ue="Unknown error status: "+Q+" with message "+j.message),g=!0,w.Cn(new J(re,ue)),B.close()}else W(ot,`RPC '${e}' stream ${s} received:`,P),w.Fn(P)}})),n.Mn(),setTimeout((()=>{w.Dn()}),0),w}terminate(){this.On.forEach((e=>e.close())),this.On=[]}kn(e){this.On.push(e)}Qn(e){this.On=this.On.filter((t=>t===e))}An(e,t,r){super.An(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return dh()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G0(n){return new Hu(n)}Hu.Nn=!1;var Ao=class{constructor(e,t,r=1e3,s=1.5,i=6e4){this.qn=e,this.timerId=t,this.Kn=r,this.Wn=s,this.Gn=i,this.jn=0,this.zn=null,this.Hn=Date.now(),this.reset()}reset(){this.jn=0}Jn(){this.jn=this.Gn}Yn(e){this.cancel();let t=Math.floor(this.jn+this.Zn()),r=Math.max(0,Date.now()-this.Hn),s=Math.max(0,t-r);s>0&&W("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.jn} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.zn=this.qn.enqueueAfterDelay(this.timerId,s,(()=>(this.Hn=Date.now(),e()))),this.jn*=this.Wn,this.jn<this.Kn&&(this.jn=this.Kn),this.jn>this.Gn&&(this.jn=this.Gn)}Xn(){this.zn!==null&&(this.zn.skipDelay(),this.zn=null)}cancel(){this.zn!==null&&(this.zn.cancel(),this.zn=null)}Zn(){return(Math.random()-.5)*this.jn}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jm="PersistentStream",aB=class{constructor(e,t,r,s,i,o,u,c){this.qn=e,this.er=r,this.tr=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=u,this.listener=c,this.state=0,this.nr=0,this.rr=null,this.ir=null,this.stream=null,this.sr=0,this._r=new Ao(e,t)}ar(){return this.state===1||this.state===5||this.ur()}ur(){return this.state===2||this.state===3}start(){this.sr=0,this.state!==4?this.auth():this.cr()}async stop(){this.ar()&&await this.close(0)}lr(){this.state=0,this._r.reset()}Er(){this.ur()&&this.rr===null&&(this.rr=this.qn.enqueueAfterDelay(this.er,6e4,(()=>this.hr())))}Tr(e){this.Pr(),this.stream.send(e)}async hr(){if(this.ur())return this.close(0)}Pr(){this.rr&&(this.rr.cancel(),this.rr=null)}Ir(){this.ir&&(this.ir.cancel(),this.ir=null)}async close(e,t){this.Pr(),this.Ir(),this._r.cancel(),this.nr++,e!==4?this._r.reset():t&&t.code===L.RESOURCE_EXHAUSTED?(vn(t.toString()),vn("Using maximum backoff delay to prevent overloading the backend."),this._r.Jn()):t&&t.code===L.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.Rr(),this.stream.close(),this.stream=null),this.state=e,await this.listener.bn(t)}Rr(){}auth(){this.state=1;let e=this.Ar(this.nr),t=this.nr;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.nr===t&&this.Vr(r,s)}),(r=>{e((()=>{let s=new J(L.UNKNOWN,"Fetching auth token failed: "+r.message);return this.dr(s)}))}))}Vr(e,t){let r=this.Ar(this.nr);this.stream=this.mr(e,t),this.stream.pn((()=>{r((()=>this.listener.pn()))})),this.stream.yn((()=>{r((()=>(this.state=2,this.ir=this.qn.enqueueAfterDelay(this.tr,1e4,(()=>(this.ur()&&(this.state=3),Promise.resolve()))),this.listener.yn())))})),this.stream.bn((s=>{r((()=>this.dr(s)))})),this.stream.onMessage((s=>{r((()=>++this.sr==1?this.pr(s):this.onNext(s)))}))}cr(){this.state=5,this._r.Yn((async()=>{this.state=0,this.start()}))}dr(e){return W(Jm,`close with error: ${e}`),this.stream=null,this.close(4,e)}Ar(e){return t=>{this.qn.enqueueAndForget((()=>this.nr===e?t():(W(Jm,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}},uB=class extends aB{constructor(e,t,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}mr(e,t){return this.connection.Un("Listen",e,t)}pr(e){return this.onNext(e)}onNext(e){this._r.reset();let t=R0(this.serializer,e),r=(function(i){if(!("targetChange"in i))return ne.min();let o=i.targetChange;return o.targetIds&&o.targetIds.length?ne.min():o.readTime?In(o.readTime):ne.min()})(e);return this.listener.gr(t,r)}yr(e){let t={};t.database=qm(this.serializer),t.addTarget=(function(i,o){let u,c=o.target;if(u=vr(c)?{pipelineQuery:F0(i,c)}:U_(c)?{documents:P0(i,c)}:{query:N0(i,c).Lt},u.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){u.resumeToken=Xh(i,o.resumeToken);let l=Yh(i,o.expectedCount);l!==null&&(u.expectedCount=l)}else if(o.snapshotVersion.compareTo(ne.min())>0){u.readTime=co(i,o.snapshotVersion.toTimestamp());let l=Yh(i,o.expectedCount);l!==null&&(u.expectedCount=l)}return u})(this.serializer,e);let r=x0(this.serializer,e);r&&(t.labels=r),this.Tr(t)}wr(e){let t={};t.database=qm(this.serializer),t.removeTarget=e,this.Tr(t)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var cB=class{},lB=class extends cB{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.Fr=!1}Or(){if(this.Fr)throw new J(L.FAILED_PRECONDITION,"The client has already been terminated.")}In(e,t,r,s){return this.Or(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.In(e,Zh(t,r),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new J(L.UNKNOWN,i.toString())}))}dn(e,t,r,s,i){return this.Or(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,u])=>this.connection.dn(e,Zh(t,r),s,o,u,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===L.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new J(L.UNKNOWN,o.toString())}))}terminate(){this.Fr=!0,this.connection.terminate()}};function H0(n,e,t,r){return new lB(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var q0="ComponentProvider",zm=new Map;function j0(n,e,t,r,s){return new Nh(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,eE(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wm={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},tE=41943040,xt=class n{static withCacheSize(e){return new n(e,n.DEFAULT_COLLECTION_PERCENTILE,n.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}};xt.DEFAULT_COLLECTION_PERCENTILE=10,xt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,xt.DEFAULT=new xt(tE,xt.DEFAULT_COLLECTION_PERCENTILE,xt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),xt.DISABLED=new xt(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $s=class{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.Mr(r),this.Nr=r=>t.writeSequenceNumber(r))}Mr(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.Nr&&this.Nr(e),e}};$s.Br=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var K0="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.",hB=class{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yc(n){if(n.code!==L.FAILED_PRECONDITION||n.message!==K0)throw n;W("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var U=class n{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Y(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new n(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{let t=e();return t instanceof n?t:n.resolve(t)}catch(t){return n.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):n.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):n.reject(t)}static resolve(e){return new n(((t,r)=>{t(e)}))}static reject(e){return new n(((t,r)=>{r(e)}))}static waitFor(e){return new n(((t,r)=>{let s=0,i=0,o=!1;e.forEach((u=>{++s,u.next((()=>{++i,o&&i===s&&t()}),(c=>r(c)))})),o=!0,i===s&&t()}))}static or(e){let t=n.resolve(!1);for(let r of e)t=t.next((s=>s?n.resolve(s):r()));return t}static forEach(e,t){let r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new n(((r,s)=>{let i=e.length,o=new Array(i),u=0;for(let c=0;c<i;c++){let l=c;t(e[l]).next((B=>{o[l]=B,++u,u===i&&r(o)}),(B=>s(B)))}}))}static doWhile(e,t){return new n(((r,s)=>{let i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J0(n){let e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function ai(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qm="LruGarbageCollector",z0=1048576;function $m([n,e],[t,r]){let s=ae(n,t);return s===0?ae(e,r):s}var BB=class{constructor(e){this.ai=e,this.buffer=new Ke($m),this.ui=0}ci(){return++this.ui}li(e){let t=[e,this.ci()];if(this.buffer.size<this.ai)this.buffer=this.buffer.add(t);else{let r=this.buffer.last();$m(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}},fB=class{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Ei=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.hi(6e4)}stop(){this.Ei&&(this.Ei.cancel(),this.Ei=null)}get started(){return this.Ei!==null}hi(e){W(Qm,`Garbage collection scheduled in ${e}ms`),this.Ei=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Ei=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){ai(t)?W(Qm,"Ignoring IndexedDB error during garbage collection: ",t):await yc(t)}await this.hi(3e5)}))}},dB=class{constructor(e,t){this.Ti=e,this.params=t}calculateTargetCount(e,t){return this.Ti.Pi(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return U.resolve($s.Br);let r=new BB(t);return this.Ti.forEachTarget(e,(s=>r.li(s.sequenceNumber))).next((()=>this.Ti.Ii(e,(s=>r.li(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.Ti.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.Ti.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(W("LruGarbageCollector","Garbage collection skipped; disabled"),U.resolve(Wm)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(W("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Wm):this.Ri(e,t)))}getCacheSize(e){return this.Ti.getCacheSize(e)}Ri(e,t){let r,s,i,o,u,c,l,B=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((d=>(d>this.params.maximumSequenceNumbersToCollect?(W("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${d}`),s=this.params.maximumSequenceNumbersToCollect):s=d,o=Date.now(),this.nthSequenceNumber(e,s)))).next((d=>(r=d,u=Date.now(),this.removeTargets(e,r,t)))).next((d=>(i=d,c=Date.now(),this.removeOrphanedDocuments(e,r)))).next((d=>(l=Date.now(),ms()<=oe.DEBUG&&W("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-B}ms
	Determined least recently used ${s} in `+(u-o)+`ms
	Removed ${i} targets in `+(c-u)+`ms
	Removed ${d} documents in `+(l-c)+`ms
Total Duration: ${l-B}ms`),U.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:d}))))}};function W0(n,e){return new dB(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nE="firestore.googleapis.com",Ym=!0,qu=class{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new J(L.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=nE,this.ssl=Ym}else this.host=e.host,this.ssl=e.ssl??Ym;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=tE;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<z0)throw new J(L.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(d_("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=eE(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new J(L.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new J(L.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new J(L.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new J(L.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;let i=Object.keys(r),o=Object.keys(s);if(i.length!==o.length)return!1;for(let u of i)if(r[u]!==s[u])return!1;return!0})(this._customHeaders,e._customHeaders)}},wc=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new qu({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new J(L.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new J(L.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new qu(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Lu;switch(r.type){case"firstParty":return new nB(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new J(L.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){let r=zm.get(t);r&&(W(q0,"Removing Datastore"),zm.delete(t),r.terminate())})(this),Promise.resolve()}};function rE(n,e,t,r={}){n=ir(n,wc);let s=Yt(e),i=n._getSettings(),o={...i,emulatorOptions:n._getEmulatorOptions()},u=`${e}:${t}`;s&&hs(`https://${u}`),i.host!==nE&&i.host!==u&&Ft("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let c={...i,host:u,ssl:s,emulatorOptions:r};if(!Vt(c,o)&&(n._setSettings(c),r.mockUserToken)){let l,B;if(typeof r.mockUserToken=="string")l=r.mockUserToken,B=Xe.MOCK_USER;else{l=Da(r.mockUserToken,n._app?.options.projectId);let d=r.mockUserToken.sub||r.mockUserToken.user_id;if(!d)throw new J(L.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");B=new Xe(d)}n._authCredentials=new eB(new ku(l,B))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var bo=class n{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new n(this.firestore,e,this._query)}},Je=class n{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Tn(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new n(this.firestore,e,this._key)}toJSON(){return{type:n._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(jo(t,n._jsonSchema))return new n(e,r||null,new ee(Ce.fromString(t.referencePath)))}};Je._jsonSchemaVersion="firestore/documentReference/1.0",Je._jsonSchema={type:ke("string",Je._jsonSchemaVersion),referencePath:ke("string")};var Tn=class n extends bo{constructor(e,t,r){super(e,t,Wo(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new Je(this.firestore,null,new ee(e))}withConverter(e){return new n(this.firestore,e,this._path)}};function bd(n,e,...t){if(n=pe(n),f_("collection","path",e),n instanceof wc){let r=Ce.fromString(e,...t);return Im(r),new Tn(n,null,r)}{if(!(n instanceof Je||n instanceof Tn))throw new J(L.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(Ce.fromString(e,...t));return Im(r),new Tn(n.firestore,null,r)}}function vd(n,e,...t){if(n=pe(n),arguments.length===1&&(e=Rs.newId()),f_("doc","path",e),n instanceof wc){let r=Ce.fromString(e,...t);return wm(r),new Je(n,null,new ee(r))}{if(!(n instanceof Je||n instanceof Tn))throw new J(L.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=n._path.child(Ce.fromString(e,...t));return wm(r),new Je(n.firestore,n instanceof Tn?n.converter:null,new ee(r))}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ys=class{constructor(e,t){this.pattern=e,this.options=t}isEqual(e){return this.pattern===e.pattern&&this.options===e.options}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vt=class n{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:n._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(jo(e,n._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new n(e.vectorValues);throw new J(L.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}};vt._jsonSchemaVersion="firestore/vectorValue/1.0",vt._jsonSchema={type:ke("string",vt._jsonSchemaVersion),vectorValues:ke("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Q0=/^__.*__$/,pB=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Nn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Gr(e,this.data,t,this.fieldTransforms)}},ju=class{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Nn(e,this.data,this.fieldMask,t,this.fieldTransforms)}};function sE(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Y(40011,{dataSource:n})}}var gB=class n{constructor(e,t,r,s,i,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new n({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){let t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Ju(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(sE(this.dataSource)&&Q0.test(e))throw this.createError('Document fields cannot begin and end with "__"')}},CB=class{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Ec(e)}createContext(e,t,r,s=!1){return new gB({dataSource:e,methodName:t,targetDoc:r,path:bt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}};function iE(n){let e=n._freezeSettings(),t=Ec(n._databaseId);return new CB(n._databaseId,!!e.ignoreUndefinedProperties,t)}function oE(n,e,t,r,s,i={}){let o=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);Rd("Data must be an object, but it was:",o,r);let u=cE(r,o),c,l;if(i.merge)c=new jt(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){let B=[];for(let d of i.mergeFields){let g=$r(e,d,t);if(!o.contains(g))throw new J(L.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);BE(B,g)||B.push(g)}c=new jt(B),l=o.fieldTransforms.filter((d=>c.covers(d.field)))}else c=null,l=o.fieldTransforms;return new pB(new ft(u),c,l)}var Ku=class n extends Jr{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof n}};var mB=class n extends Jr{_toFieldTransform(e){return new Lh(e.path,new Lr)}isEqual(e){return e instanceof n}};function aE(n,e,t,r){let s=n.createContext(1,e,t);Rd("Data must be an object, but it was:",s,r);let i=[],o=ft.empty();ns(r,((c,l)=>{let B=Sd(e,c,t);l=pe(l);let d=s.childContextForFieldPath(B);if(l instanceof Ku)i.push(B);else{let g=Qr(l,d);g!=null&&(i.push(B),o.set(B,g))}}));let u=new jt(i);return new ju(o,u,s.fieldTransforms)}function uE(n,e,t,r,s,i){let o=n.createContext(1,e,t),u=[$r(e,r,t)],c=[s];if(i.length%2!=0)throw new J(L.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)u.push($r(e,i[g])),c.push(i[g+1]);let l=[],B=ft.empty();for(let g=u.length-1;g>=0;--g)if(!BE(l,u[g])){let w=u[g],D=c[g];D=pe(D);let P=o.childContextForFieldPath(w);if(D instanceof Ku)l.push(w);else{let V=Qr(D,P);V!=null&&(l.push(w),B.set(w,V))}}let d=new jt(l);return new ju(B,d,o.fieldTransforms)}function Qr(n,e,t){if(hE(n=pe(n)))return Rd("Unsupported field value:",e,n),cE(n,e);if(n instanceof Jr)return(function(s,i){if(!sE(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);let o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){let o=[],u=0;for(let c of s){let l=Qr(c,i.childContextForArray(u));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),u++}return{arrayValue:{values:o}}})(n,e)}return(function(s,i,o){if((s=pe(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return Id(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){let u=Pe.fromDate(s);return{timestampValue:co(i.serializer,u)}}if(s instanceof Pe){let u=new Pe(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:co(i.serializer,u)}}if(lE(s)){let u=Pe.fromInstant(s),c=new Pe(u.seconds,1e3*Math.floor(u.nanoseconds/1e3));return{timestampValue:co(i.serializer,c)}}if(s instanceof Dn)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof Jt)return s.subtype===0?{bytesValue:Xh(i.serializer,s._byteString)}:(function(c,l){let B=l.toUint8Array(),d=new Uint8Array(B.length+1);return d[0]=l.subtype,d.set(B,1),{mapValue:{fields:{[ks]:{bytesValue:Xh(c,Re.fromUint8Array(d))}}}}})(i.serializer,s);if(s instanceof Je){let u=i.databaseId,c=s.firestore._databaseId;if(!c.isEqual(u))throw i.createError(`Document reference is for database ${c.projectId}/${c.database} but should be for database ${u.projectId}/${u.database}`);return{referenceValue:Ad(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof vt)return(function(c,l){let B=c instanceof vt?c.toArray():c;return{mapValue:{fields:{[Cc]:{stringValue:mc},[Fr]:{arrayValue:{values:B.map((g=>{if(typeof g!="number")throw l.createError("VectorValues must only contain numeric values.");return wd(l.serializer,g)}))}}}}}})(s,i);if(s instanceof Ys)return(function(c){return{mapValue:{fields:{[rn]:{mapValue:{fields:{[xs]:{stringValue:c.pattern},[Fs]:{stringValue:c.options}}}}}}}})(s);if(s instanceof Js)return(function(c){return{mapValue:{fields:{[kr]:{stringValue:c.value}}}}})(s);if(s instanceof Qs)return(function(c){return{mapValue:{fields:{[or]:As(c.value)}}}})(s);if(s instanceof Ws)return(function(c){return{mapValue:{fields:{[Sn]:{stringValue:c.stringValue}}}}})(s);if(s instanceof zs)return(function(c){return{mapValue:{fields:{[yn]:{mapValue:{fields:{[po]:As(c.seconds),[go]:As(c.increment)}}}}}}})(s);if(s instanceof Wr)return(function(){return{mapValue:{fields:{[yd]:{nullValue:"NULL_VALUE"}}}}})();if(s instanceof zr)return(function(){return{mapValue:{fields:{[zo]:{nullValue:"NULL_VALUE"}}}}})();if(Y_(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${pc(s)}`)})(n,e)}function cE(n,e){let t={};return B_(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):ns(n,((r,s)=>{let i=Qr(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function lE(n){if(typeof n!="object"||n===null)return!1;if(typeof Temporal<"u"&&typeof Temporal.Instant=="function"&&n instanceof Temporal.Instant)return!0;let e=n;return e[Symbol.toStringTag]==="Temporal.Instant"&&typeof e.t=="bigint"}function hE(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Pe||n instanceof Dn||n instanceof Jt||n instanceof Je||n instanceof Jr||n instanceof vt||n instanceof Wr||n instanceof zr||n instanceof Qs||n instanceof Ws||n instanceof Ys||n instanceof Js||n instanceof zs||lE(n)||Y_(n))}function Rd(n,e,t){if(!hE(t)||!qo(t)){let r=pc(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function $r(n,e,t){if((e=pe(e))instanceof Kr)return e._internalPath;if(typeof e=="string")return Sd(n,e);throw Ju("Field path arguments must be of type string or ",n,!1,void 0,t)}var $0=new RegExp("[~\\*/\\[\\]]");function Sd(n,e,t){if(e.search($0)>=0)throw Ju(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Kr(...e.split("."))._internalPath}catch{throw Ju(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Ju(n,e,t,r,s){let i=r&&!r.isEmpty(),o=s!==void 0,u=`Function ${e}() called with invalid data`;t&&(u+=" (via `toFirestore()`)"),u+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new J(L.INVALID_ARGUMENT,u+n+c)}function BE(n,e){return n.some((t=>t.isEqual(e)))}function Y0(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ut=class n{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){let r=ft.empty();for(let s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){let i=this.optionDefinitions[s];if(s in e){let o=e[s],u;i.nestedOptions&&qo(o)?u={mapValue:{fields:new n(i.nestedOptions).getOptionsProto(t,o)}}:o&&(u=Qr(o,t)??void 0),u&&r.set(bt.fromServerFormat(i.serverName),u)}}return r}getOptionsProto(e,t,r){let s=this._getKnownOptions(t,e);if(r){let i=new Map(h_(r,((o,u)=>[bt.fromServerFormat(u),o!==void 0?Qr(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function X0(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!qo(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}function Pd(){return new mB("serverTimestamp")}function fE(n){return new vt(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H(n){let e;return n instanceof xn?n:(e=qo(n)?tA(n):n instanceof Array?nA(n):dE(n,void 0),e)}function vh(n){if(n instanceof xn)return n;if(n instanceof vt)return vo(n);if(Array.isArray(n))return vo(fE(n));throw new Error("Unsupported value: "+typeof n)}function Nd(n){return XT(n)?Z0(n):H(n)}var xn=class{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,H(e)],"add")}asBoolean(){if(this instanceof Zn)return this;if(this instanceof Xs)return new Wu(this);if(this instanceof Yr)return new yB(this);if(this instanceof x)return new zu(this);throw new J("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,H(e)],"subtract")}multiply(e){return new x("multiply",[this,H(e)],"multiply")}divide(e){return new x("divide",[this,H(e)],"divide")}mod(e){return new x("mod",[this,H(e)],"mod")}equal(e){return new x("equal",[this,H(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,H(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,H(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,H(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,H(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,H(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){let r=[e,...t].map((s=>H(s)));return new x("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,H(e)],"arrayContains").asBoolean()}arrayContainsAll(e){let t=Array.isArray(e)?new Sr(e.map(H),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){let t=Array.isArray(e)?new Sr(e.map(H),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){let t=Array.isArray(e)?new Sr(e.map(H),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){let t=Array.isArray(e)?new Sr(e.map(H),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,H(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,H(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,H(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,H(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,H(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,H(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,H(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,H(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){let t=[this];return e&&t.push(H(e)),new x("trim",t,"trim")}ltrim(e){let t=[this];return e&&t.push(H(e)),new x("ltrim",t,"ltrim")}rtrim(e){let t=[this];return e&&t.push(H(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,vo(e)],"isType").asBoolean()}stringConcat(e,...t){let r=[e,...t].map(H);return new x("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,H(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,H(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,H(e),H(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,H(e),H(t)],"stringReplaceOne")}concat(e,...t){let r=[e,...t].map(H);return new x("concat",[this,...r],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,H(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,H(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new x("array_transform",[this,H(e),H(t),r],"arrayTransformWithIndex")}arraySlice(e,t){let r=[this,H(e)];return t!==void 0&&r.push(H(t)),new x("array_slice",r,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,H(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,H(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,H(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,H(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,H(e),H("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,H(e),H("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,H(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,vo(e)],"mapGet")}mapSet(e,t,...r){let s=[this,H(e),H(t),...r.map(H)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,H(e)],"get_field")}count(){return Dt._create("count",[this],"count")}sum(){return Dt._create("sum",[this],"sum")}average(){return Dt._create("average",[this],"average")}minimum(){return Dt._create("minimum",[this],"minimum")}maximum(){return Dt._create("maximum",[this],"maximum")}first(){return Dt._create("first",[this],"first")}last(){return Dt._create("last",[this],"last")}arrayAgg(){return Dt._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return Dt._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return Dt._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){let r=[e,...t];return new x("maximum",[this,...r.map(H)],"logicalMaximum")}logicalMinimum(e,...t){let r=[e,...t];return new x("minimum",[this,...r.map(H)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,vh(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,vh(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,vh(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,H(e),H(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,H(e),H(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,Nd(e),H(t)],"timestampDiff")}timestampExtract(e,t){let r=[this,H(e)];return t&&r.push(H(t)),new x("timestamp_extract",r,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){let r=H(e);return new x("substring",t===void 0?[this,r]:[this,r,H(t)],"substring")}arrayGet(e){return new x("array_get",[this,H(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){let t=new x("if_error",[this,H(e)],"ifError");return e instanceof Zn?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,H(e)],"mapRemove")}mapMerge(e,...t){let r=H(e),s=t.map(H);return new x("map_merge",[this,r,...s],"mapMerge")}pow(e){return new x("pow",[this,H(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,H(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,H(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,H(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,H(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,H(e),...t.map(H)],"coalesce")}join(e){return new x("join",[this,H(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,H(e)])}timestampTruncate(e,t){let r=[this,H(e)];return t&&r.push(H(t)),new x("timestamp_trunc",r)}ascending(){return rA(this)}descending(){return sA(this)}as(e){return new EB(this,e,"as")}},Dt=class n{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){let s=new n(e,t);return s._methodName=r,s}as(e){return new _B(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}},_B=class{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}},EB=class{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}},Sr=class extends xn{constructor(e,t){super(),this.di=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.di.map((t=>t._toProto(e)))}}}_readUserData(e){this.di.forEach((t=>t._readUserData(e)))}},Yr=class extends xn{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,H(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}};function Z0(n){return eA(n,"field")}function eA(n,e){return new Yr(typeof n=="string"?Ps===n?Z_()._internalPath:$r("field",n):n._internalPath,e)}var Xs=class n extends xn{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){let t=new n(e,void 0);return t._protoValue=e,t}_toProto(e){return X(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,X0(this._protoValue)||(this._protoValue=Qr(this.value,e))}};function vo(n,e){return dE(n,"constant")}function dE(n,e){let t=new Xs(n,e);return typeof n=="boolean"?new Wu(t):t}var x=class extends xn{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new ut({})}_toProto(e){let t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}},Zn=class n extends xn{get _methodName(){return this._expr._methodName}countIf(){return Dt._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){let t=H(e),r=new x("if_error",[this,t],"ifError");return t instanceof n?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}},zu=class extends Zn{constructor(e){super(),this._expr=e,this.expressionType="Function"}},Wu=class extends Zn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}},yB=class extends Zn{constructor(e){super(),this._expr=e,this.expressionType="Field"}};function tA(n,e){let t=[];for(let r in n)if(Object.prototype.hasOwnProperty.call(n,r)){let s=n[r];t.push(vo(r)),t.push(H(s))}return new x("map",t,"map")}function nA(n){return(function(t,r){return new x("array",t.map((s=>H(s))),r)})(n,"array")}function rA(n){return new Qu(Nd(n),"ascending","ascending")}function sA(n){return new Qu(Nd(n),"descending","descending")}var Qu=class{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:X_(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var dt=class{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}},$u=class extends dt{get _name(){return"add_fields"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[To(e,this.fields)]}}_readUserData(e){super._readUserData(e),er(this.fields,e)}};var Yu=class extends dt{get _name(){return"aggregate"}get _optionsUtil(){return new ut({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[To(e,this.accumulators),To(e,this.groups)]}}_readUserData(e){super._readUserData(e),er(this.groups,e),er(this.accumulators,e)}},Xu=class extends dt{get _name(){return"distinct"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[To(e,this.groups)]}}_readUserData(e){super._readUserData(e),er(this.groups,e)}},Zs=class extends dt{get _name(){return"collection"}get _optionsUtil(){return new ut({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.pi=iA(e)}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.pi}]}}_readUserData(e){super._readUserData(e)}},ei=class extends dt{get _name(){return"collection_group"}get _optionsUtil(){return new ut({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}};var Ro=class extends dt{get _name(){return"database"}get _optionsUtil(){return new ut({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}},So=class extends dt{get _name(){return"documents"}get _optionsUtil(){return new ut({})}constructor(e,t){if(super(t),!e||e.length===0)throw new J(L.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");let r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new J(L.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.gi=r,this.yi=s}_toProto(e){return{...super._toProto(e),args:this.gi.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}};var Po=class extends dt{get _name(){return"where"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),er(this.condition,e)}};var Xr=class extends dt{get _name(){return"limit"}get _optionsUtil(){return new ut({})}constructor(e,t){X(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[Id(e,this.limit)]}}},Zu=class extends dt{get _name(){return"offset"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[Id(e,this.offset)]}}},wB=class extends dt{get _name(){return"select"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[To(e,this.selections)]}}_readUserData(e){super._readUserData(e),er(this.selections,e)}},No=class extends dt{get _name(){return"sort"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),er(this.orderings,e)}};var IB=class n extends dt{get _name(){return"replace_with"}get _optionsUtil(){return new ut({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),X_(n.bi)]}}_readUserData(e){super._readUserData(e),er(this.map,e)}};IB.bi="full_replace";function iA(n){let e=typeof n=="string"?n:n.path;return e.startsWith("/")?e:"/"+e}function er(n,e){return Y0(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// Copyright 2024 Google LLC* @license
var at=class{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return Ic(this)}getPipelineCollectionGroup(){return Od(this)}getPipelineCollectionId(){return oA(this)}getPipelineDocuments(){return DB(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==Xu.name&&s._name!==Yu.name||(r="keyless"),s._name===wB.name&&r==="exact"&&(r="augmented"),s._name===$u.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return $n(this)}};function $n(n){let e=n.stages[0];return e instanceof Zs||e instanceof ei||e instanceof Ro||e instanceof So?e._name:"unknown"}function Ic(n){if($n(n)==="collection")return n.stages[0].pi}function Od(n){if($n(n)==="collection_group")return n.stages[0].collectionId}function oA(n){switch($n(n)){case"collection":return Ce.fromString(Ic(n)).lastSegment();case"collection_group":return Od(n);default:return}}function DB(n){if($n(n)==="documents")return n.stages[0].gi}var b=class n{constructor(e,t){this.type=e,this.value=t}static Oi(){return new n("ERROR",void 0)}static Mi(){return new n("UNSET",void 0)}static Ni(){return new n("NULL",Ls)}static newValue(e){return Tt(e)?new n("NULL",Ls):(function(r){return!!r&&"booleanValue"in r})(e)?new n("BOOLEAN",e):sn(e)?new n("INT",e):on(e)?new n("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new n("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new n("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new n("BYTES",e):e.referenceValue?new n("REFERENCE",e):e.geoPointValue?new n("GEO_POINT",e):Ms(e)?new n("ARRAY",e):Fh(e)?new n("VECTOR",e):Ts(e)?new n("MAP",e):new n("ERROR",void 0)}Bi(){return this.type==="ERROR"||this.type==="UNSET"}Li(){return this.type==="NULL"}};function ho(n){if(!n.Bi())return n.value}function pE(n){return n instanceof Zn?n._expr:n}function te(n){if((n=pE(n))instanceof Yr)return new TB(n);if(n instanceof Xs)return new AB(n);if(n instanceof Sr)return new bB(n);if(n instanceof x){if(n.name==="add")return new vB(n);if(n.name==="subtract")return new RB(n);if(n.name==="multiply")return new SB(n);if(n.name==="divide")return new PB(n);if(n.name==="mod")return new NB(n);if(n.name==="and")return new OB(n);if(n.name==="equal")return new JB(n);if(n.name==="not_equal")return new zB(n);if(n.name==="less_than")return new WB(n);if(n.name==="less_than_or_equal")return new QB(n);if(n.name==="greater_than")return new $B(n);if(n.name==="greater_than_or_equal")return new YB(n);if(n.name==="array_concat")return new XB(n);if(n.name==="array_reverse")return new ZB(n);if(n.name==="array_contains")return new ef(n);if(n.name==="array_contains_all")return new tf(n);if(n.name==="array_contains_any")return new nf(n);if(n.name==="array_length")return new rf(n);if(n.name==="array_element")return new sf(n);if(n.name==="equal_any")return new ec(n);if(n.name==="not_equal_any")return new kB(n);if(n.name==="is_nan")return new LB(n);if(n.name==="is_not_nan")return new VB(n);if(n.name==="is_null")return new MB(n);if(n.name==="is_not_null")return new UB(n);if(n.name==="is_error")return new GB(n);if(n.name==="exists")return new HB(n);if(n.name==="not")return new ti(n);if(n.name==="or")return new xB(n);if(n.name==="xor")return new FB(n);if(n.name==="conditional")return new qB(n);if(n.name==="maximum")return new jB(n);if(n.name==="minimum")return new KB(n);if(n.name==="reverse")return new of(n);if(n.name==="replace_first")return new af(n);if(n.name==="replace_all")return new uf(n);if(n.name==="char_length")return new cf(n);if(n.name==="byte_length")return new lf(n);if(n.name==="like")return new hf(n);if(n.name==="regex_contains")return new Bf(n);if(n.name==="regex_match")return new ff(n);if(n.name==="string_contains")return new df(n);if(n.name==="starts_with")return new pf(n);if(n.name==="ends_with")return new gf(n);if(n.name==="to_lower")return new Cf(n);if(n.name==="to_upper")return new mf(n);if(n.name==="trim")return new _f(n);if(n.name==="string_concat")return new Ef(n);if(n.name==="map_get")return new yf(n);if(n.name==="cosine_distance")return new wf(n);if(n.name==="dot_product")return new If(n);if(n.name==="euclidean_distance")return new Df(n);if(n.name==="vector_length")return new Tf(n);if(n.name==="unix_micros_to_timestamp")return new Af(n);if(n.name==="timestamp_to_unix_micros")return new Rf(n);if(n.name==="unix_millis_to_timestamp")return new bf(n);if(n.name==="timestamp_to_unix_millis")return new Sf(n);if(n.name==="unix_seconds_to_timestamp")return new vf(n);if(n.name==="timestamp_to_unix_seconds")return new Pf(n);if(n.name==="timestamp_add")return new Nf(n);if(n.name==="timestamp_subtract")return new Of(n)}throw new Error(`Unknown Expr : ${n}`)}var TB=class{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Ps)return b.newValue({referenceValue:Do(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return b.newValue({timestampValue:Iu(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return b.newValue({timestampValue:Iu(e.serializer,t.createTime)});let r=t.data.field(this.expr._fieldPath);return r?gc(r)?b.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:Iu(i.serializer,ne.fromTimestamp(Ns(o)))};if(i.serverTimestampBehavior==="previous"){let u=Ko(o);if(u)return u}return{nullValue:"NULL_VALUE"}})(e,r)):b.newValue(r):b.Mi()}},AB=class{constructor(e){this.expr=e}evaluate(e,t){return b.newValue(this.expr._getValue())}},bB=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.di.map((s=>te(s).evaluate(e,t)));return r.some((s=>s.Bi()))?b.Oi():b.newValue({arrayValue:{values:r.map((s=>s.value))}})}};function nt(n){return on(n)?Number(n.doubleValue):Number(n.integerValue)}function ln(n){return BigInt(n.integerValue)}var aA=BigInt("0x7fffffffffffffff"),uA=-BigInt("0x8000000000000000"),Zr=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length>=2,24778);let r=te(this.expr.params[0]).evaluate(e,t),s=te(this.expr.params[1]).evaluate(e,t),i=this.$i(r,s);for(let o of this.expr.params.slice(2)){let u=te(o).evaluate(e,t);i=this.$i(i,u)}return i}$i(e,t){if(e.Bi()||t.Bi())return b.Oi();if(e.Li()||t.Li())return b.Ni();let r=e.value,s=t.value;if(!on(r)&&!sn(r)||!on(s)&&!sn(s))return b.Oi();if(on(r)||on(s)){let i=this.Ui(r,s);return i?b.newValue(i):b.Oi()}if(sn(r)&&sn(s)){let i=this.ki(r,s);return i===void 0?b.Oi():typeof i=="number"?b.newValue({doubleValue:i}):i<uA||i>aA?b.Oi():b.newValue({integerValue:`${i}`})}return b.Oi()}};function Fn(n,e){return He(n)!==He(e)?"TYPE_MISMATCH":et(n)||et(e)?"NOT_EQ":Tt(n)&&Tt(e)?"EQ":Tt(n)||Tt(e)?"NULL":Ms(n)&&Ms(e)?(function(r,s){if(r.values?.length!==s.values?.length)return"NOT_EQ";let i=!1;for(let o=0;o<(r.values?.length??0);o++){let u=r.values[o],c=s.values[o];switch(Fn(u,c)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:Y(44609,{Qi:u,qi:c})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):Fh(n)&&Fh(e)||Ts(n)&&Ts(e)?(function(r,s){let i=r.fields||{},o=s.fields||{};if(xr(i)!==xr(o))return"NOT_EQ";let u=!1;for(let c in i)if(i.hasOwnProperty(c)){if(o[c]===void 0)return"NOT_EQ";switch(Fn(i[c],o[c])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":u=!0}}return u?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return kt(r,s,{be:!1,ye:!0,we:!0})})(n,e)?"EQ":"NOT_EQ"}var vB=class extends Zr{ki(e,t){return ln(e)+ln(t)}Ui(e,t){return{doubleValue:nt(e)+nt(t)}}},RB=class extends Zr{constructor(e){super(e),this.expr=e}ki(e,t){return ln(e)-ln(t)}Ui(e,t){return{doubleValue:nt(e)-nt(t)}}},SB=class extends Zr{constructor(e){super(e),this.expr=e}ki(e,t){return ln(e)*ln(t)}Ui(e,t){return{doubleValue:nt(e)*nt(t)}}},PB=class extends Zr{constructor(e){super(e),this.expr=e}ki(e,t){let r=ln(t);if(r!==BigInt(0))return ln(e)/r}Ui(e,t){let r=nt(t);return r===0?{doubleValue:Os(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:nt(e)/r}}},NB=class extends Zr{constructor(e){super(e),this.expr=e}ki(e,t){let r=ln(t);if(r!==BigInt(0))return ln(e)%r}Ui(e,t){let r=nt(t);if(r!==0)return{doubleValue:nt(e)%r}}},OB=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=te(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(!o.value?.booleanValue)return b.newValue(Ze);break;case"NULL":s=!0;break;default:r=!0}}return r?b.Oi():s?b.Ni():b.newValue(_t)}},ti=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,9634);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return b.newValue({booleanValue:!r.value?.booleanValue});case"NULL":return b.Ni();default:return b.Oi()}}},xB=class{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=te(i).evaluate(e,t);switch(o.type){case"BOOLEAN":if(o.value?.booleanValue)return b.newValue(_t);break;case"NULL":s=!0;break;default:r=!0}}return r?b.Oi():s?b.Ni():b.newValue(Ze)}},FB=class n{constructor(e){this.expr=e}evaluate(e,t){let r=!1,s=!1;for(let i of this.expr.params){let o=te(i).evaluate(e,t);switch(o.type){case"BOOLEAN":r=n.xor(r,!!o.value?.booleanValue);break;case"NULL":s=!0;break;default:return b.Oi()}}return s?b.Ni():b.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}},ec=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,55094);let r=!1,s=te(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return b.Oi()}let i=te(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.Oi()}if(r)return b.Ni();for(let o of i.value?.arrayValue?.values??[])switch(Tt(s.value)&&Tt(o)?"EQ":Fn(s.value,o)){case"EQ":return b.newValue(_t);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Y(44608,{value:s.value,candidate:o})}return r?b.Ni():b.newValue(Ze)}},kB=class{constructor(e){this.expr=e}evaluate(e,t){return new ti(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}},LB=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,23322);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return b.newValue(Ze);case"DOUBLE":return b.newValue({booleanValue:isNaN(nt(r.value))});case"NULL":return b.Ni();default:return b.Oi()}}},VB=class{constructor(e){this.expr=e}evaluate(e,t){return X(this.expr.params.length===1,50406),new ti(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}},MB=class{constructor(e){this.expr=e}evaluate(e,t){switch(X(this.expr.params.length===1,23123),te(this.expr.params[0]).evaluate(e,t).type){case"NULL":return b.newValue(_t);case"UNSET":case"ERROR":return b.Oi();default:return b.newValue(Ze)}}},UB=class{constructor(e){this.expr=e}evaluate(e,t){return X(this.expr.params.length===1,23167),new ti(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}},GB=class{constructor(e){this.expr=e}evaluate(e,t){return X(this.expr.params.length===1,5228),te(this.expr.params[0]).evaluate(e,t).type==="ERROR"?b.newValue(_t):b.newValue(Ze)}},HB=class{constructor(e){this.expr=e}evaluate(e,t){switch(X(this.expr.params.length===1,6877),te(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return b.Oi();case"UNSET":return b.newValue(Ze);default:return b.newValue(_t)}}},qB=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===3,11706);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return r.value?.booleanValue?te(this.expr.params[1]).evaluate(e,t):te(this.expr.params[2]).evaluate(e,t);case"NULL":return te(this.expr.params[2]).evaluate(e,t);default:return b.Oi()}}},jB=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>te(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||Et(i.value,s.value)>0?i:s}return s===void 0?b.Ni():s}},KB=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((i=>te(i).evaluate(e,t))),s;for(let i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||Et(i.value,s.value)<0?i:s}return s===void 0?b.Ni():s}},tr=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return b.Oi()}let s=te(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return b.Oi()}return this.Ki(r,s)}},JB=class extends tr{constructor(e){super(e),this.expr=e}Ki(e,t){if(e.Li()&&t.Li())return b.newValue(_t);if(e.Li()||t.Li()||et(e.value)||et(t.value)||He(e.value)!==He(t.value))return b.newValue(Ze);switch(Fn(e.value,t.value)){case"EQ":return b.newValue(_t);case"NOT_EQ":return b.newValue(Ze);case"NULL":return b.Ni();default:Y(44615,{left:e,right:t})}}},zB=class extends tr{constructor(e){super(e),this.expr=e}Ki(e,t){switch(Fn(e.value,t.value)){case"EQ":return b.newValue(Ze);case"NOT_EQ":case"TYPE_MISMATCH":return b.newValue(_t);case"NULL":return b.Ni();default:Y(44614,{left:e,right:t})}}},WB=class extends tr{constructor(e){super(e),this.expr=e}Ki(e,t){return He(e.value)!==He(t.value)||et(e.value)||et(t.value)?b.newValue(Ze):b.newValue({booleanValue:Et(e.value,t.value)<0})}},QB=class extends tr{constructor(e){super(e),this.expr=e}Ki(e,t){return He(e.value)!==He(t.value)||et(e.value)||et(t.value)?b.newValue(Ze):Fn(e.value,t.value)==="EQ"?b.newValue(_t):b.newValue({booleanValue:Et(e.value,t.value)<0})}},$B=class extends tr{constructor(e){super(e),this.expr=e}Ki(e,t){return He(e.value)!==He(t.value)||et(e.value)||et(t.value)?b.newValue(Ze):b.newValue({booleanValue:Et(e.value,t.value)>0})}},YB=class extends tr{constructor(e){super(e),this.expr=e}Ki(e,t){return He(e.value)!==He(t.value)||et(e.value)||et(t.value)?b.newValue(Ze):Fn(e.value,t.value)==="EQ"?b.newValue(_t):b.newValue({booleanValue:Et(e.value,t.value)>0})}},XB=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},ZB=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,216);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.Ni();case"ARRAY":{let s=r.value.arrayValue?.values??[];return b.newValue({arrayValue:{values:[...s].reverse()}})}default:return b.Oi()}}},ef=class{constructor(e){this.expr=e}evaluate(e,t){return X(this.expr.params.length===2,52884),new ec(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}},tf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,1392);let r=!1,s=te(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.Oi()}let i=te(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.Oi()}if(r)return b.Ni();let o=i.value?.arrayValue?.values??[],u=s.value?.arrayValue?.values??[];for(let c of o){let l=!1;r=!1;for(let B of u){switch(Tt(c)&&Tt(B)?"EQ":Fn(c,B)){case"EQ":l=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Y(44613,{value:B,search:c})}if(l)break}if(!l)return b.newValue(Ze)}return b.newValue(_t)}},nf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,2680);let r=!1,s=te(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.Oi()}let i=te(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return b.Oi()}if(r)return b.Ni();let o=i.value?.arrayValue?.values??[],u=s.value?.arrayValue?.values??[];for(let c of u)for(let l of o)switch(Tt(c)&&Tt(l)?"EQ":Fn(c,l)){case"EQ":return b.newValue(_t);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:Y(60403,{value:c,search:l})}return r?b.Ni():b.newValue(Ze)}},rf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,38605);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.Ni();case"ARRAY":return b.newValue({integerValue:`${r.value?.arrayValue?.values?.length??0}`});default:return b.Oi()}}},sf=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},of=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,1508);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.Ni();case"BYTES":{let s=r.value?.bytesValue;if(typeof s=="string"){let i=Re.fromBase64String(s).toUint8Array();return i.reverse(),b.newValue({bytesValue:Re.fromUint8Array(i).toBase64()})}return b.newValue({bytesValue:new Uint8Array(s).reverse()})}case"STRING":{let s=r.value?.stringValue,i=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(s),o=Array.from(i,(u=>u.segment)).reverse();return b.newValue({stringValue:o.join("")})}default:return b.Oi()}}},af=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},uf=class{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}},cf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,19400);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return b.Ni();case"STRING":{let s=(function(o){let u=0;for(let c=0;c<o.length;c++){let l=o.codePointAt(c);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){let B=o.codePointAt(c+1);B!==void 0&&B>=56320&&B<=57343?(u+=1,c++):u+=1}else u+=1;else u+=1;else{if(!(l<=1114111))return;u+=1,c++}}return u})(r.value.stringValue);return s===void 0?b.Oi():b.newValue({integerValue:s})}default:return b.Oi()}}},lf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,8486);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{let s=r.value?.bytesValue;return typeof s=="string"?b.newValue({integerValue:Re.fromBase64String(s).toUint8Array().length}):b.newValue({integerValue:new Uint8Array(s).length})}case"STRING":{let s=(function(o){let u=0;for(let c=0;c<o.length;c++){let l=o.codePointAt(c);if(l===void 0)return;if(l>=55296&&l<=57343){if(!(l<=56319))return;{let B=o.codePointAt(c+1);if(B===void 0||!(B>=56320&&B<=57343))return;u+=4,c++}}else if(l<=127)u+=1;else if(l<=2047)u+=2;else if(l<=65535)u+=3;else{if(!(l<=1114111))return;u+=4,c++}}return u})(r.value?.stringValue);return s===void 0?b.Oi():b.newValue({integerValue:s})}case"NULL":return b.Ni();default:return b.Oi()}}},nr=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1,s=te(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return b.Oi()}let i=te(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return b.Oi()}return r?b.Ni():this.Wi(s.value?.stringValue,i.value?.stringValue)}},hf=class extends nr{Wi(e,t){try{let r=(function(o){let u="";for(let c=0;c<o.length;c++){let l=o.charAt(c);switch(l){case"_":u+=".";break;case"%":u+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":u+="\\"+l;break;default:u+=l}}return"^"+u+"$"})(t),s=pu.compile(r);return b.newValue({booleanValue:s.matches(e)})}catch(r){return Ft(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),b.Oi()}}},Bf=class extends nr{Wi(e,t){try{let r=pu.compile(t);return b.newValue({booleanValue:r.test(e)})}catch{return Ft(`Invalid regex pattern found in regex_contains: ${t}, returning error`),b.Oi()}}},ff=class extends nr{Wi(e,t){try{return b.newValue({booleanValue:pu.compile(t).matches(e)})}catch{return Ft(`Invalid regex pattern found in regex_match: ${t}, returning error`),b.Oi()}}},df=class extends nr{Wi(e,t){return b.newValue({booleanValue:e.includes(t)})}},pf=class extends nr{Wi(e,t){return b.newValue({booleanValue:e.startsWith(t)})}},gf=class extends nr{Wi(e,t){return b.newValue({booleanValue:e.endsWith(t)})}},Cf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,29079);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return b.newValue({stringValue:r.value?.stringValue?.toLowerCase()});case"NULL":return b.Ni();default:return b.Oi()}}},mf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,60487);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return b.newValue({stringValue:r.value?.stringValue?.toUpperCase()});case"NULL":return b.Ni();default:return b.Oi()}}},_f=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,28544);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return b.newValue({stringValue:r.value?.stringValue?.trim()});case"NULL":return b.Ni();default:return b.Oi()}}},Ef=class{constructor(e){this.expr=e}evaluate(e,t){let r=this.expr.params.map((o=>te(o).evaluate(e,t))),s="",i=!1;for(let o of r)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return b.Oi()}return i?b.Ni():b.newValue({stringValue:s})}},yf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,4483);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return b.Mi();case"MAP":break;default:return b.Oi()}let s=te(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return b.Oi();let i=r.value?.mapValue?.fields?.[s.value?.stringValue];return i===void 0?b.Mi():b.newValue(i)}},Oo=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1,s=te(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return b.Oi()}let i=te(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return b.Oi()}if(r)return b.Ni();let o=kh(s.value),u=kh(i.value);if(o===void 0||u===void 0||o.values?.length!==u.values?.length)return b.Oi();let c=this.Gi(o,u);return c===void 0||isNaN(c)?b.Oi():b.newValue({doubleValue:c})}},wf=class extends Oo{Gi(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return;let i=0,o=0,u=0;for(let l=0;l<r.length;l++){if(!Pn(r[l])||!Pn(s[l]))return;let B=nt(r[l]),d=nt(s[l]);i+=B*d,o+=B*B,u+=d*d}let c=Math.sqrt(o)*Math.sqrt(u);if(c!==0)return 1-Math.max(-1,Math.min(1,i/c))}},If=class extends Oo{Gi(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!Pn(r[o])||!Pn(s[o]))return;i+=nt(r[o])*nt(s[o])}return i}},Df=class extends Oo{Gi(e,t){let r=e?.values??[],s=t?.values??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!Pn(r[o])||!Pn(s[o]))return;let u=nt(r[o]),c=nt(s[o]);i+=Math.pow(u-c,2)}return Math.sqrt(i)}},Tf=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,39044);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{let s=kh(r.value);return b.newValue({integerValue:s?.values?.length??0})}case"NULL":return b.Ni();default:return b.Oi()}}},xo=BigInt(-62135596800),Fo=BigInt(253402300799),tc=BigInt(1e3),Yn=BigInt(1e6),cA=xo*tc,lA=Fo*tc+BigInt(999),hA=xo*Yn,BA=Fo*Yn+BigInt(999999);function xd(n){return n>=hA&&n<=BA}function gE(n){return n>=xo&&n<=Fo}function ko(n,e){let t=BigInt(n);return!(t<xo||t>Fo)&&!(e<0||e>=1e9)&&(t!==xo||e===0)&&!(t===Fo&&e>999999999)}function CE(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function Fd(n){return BigInt(n.seconds)*Yn+BigInt(Math.trunc(n.nanoseconds/1e3))}var Lo=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return b.Ni();default:return b.Oi()}}},Af=class extends Lo{toTimestamp(e){if(!xd(e))return b.Oi();let t=Number(e/Yn),r=Number(e%Yn*BigInt(1e3)),s=CE(t,r);return t=s.seconds,r=s.nanos,ko(t,r)?b.newValue({timestampValue:{seconds:t,nanos:r}}):b.Oi()}},bf=class extends Lo{toTimestamp(e){if(!(function(o){return o>=cA&&o<=lA})(e))return b.Oi();let t=Number(e/tc),r=Number(e%tc*BigInt(1e6)),s=CE(t,r);return t=s.seconds,r=s.nanos,ko(t,r)?b.newValue({timestampValue:{seconds:t,nanos:r}}):b.Oi()}},vf=class extends Lo{toTimestamp(e){if(!gE(e))return b.Oi();let t=Number(e);return b.newValue({timestampValue:{seconds:t,nanos:0}})}},Vo=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);let r=te(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return b.Ni();default:return b.Oi()}let s=Td(r.value.timestampValue);return ko(s.seconds,s.nanoseconds)?this.ji(s):b.Oi()}},Rf=class extends Vo{ji(e){let t=Fd(e);return xd(t)?b.newValue({integerValue:`${t.toString()}`}):b.Oi()}},Sf=class extends Vo{ji(e){let t=Fd(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?b.newValue({integerValue:r.toString()}):b.newValue({integerValue:(r-BigInt(1)).toString()})}},Pf=class extends Vo{ji(e){let t=BigInt(e.seconds);return gE(t)?b.newValue({integerValue:t.toString()}):b.Oi()}},nc=class{constructor(e){this.expr=e}evaluate(e,t){X(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1,s=te(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return b.Oi()}let i=te(this.expr.params[1]).evaluate(e,t),o;switch(i.type){case"STRING":if(o=(function(Q){switch(Q){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return b.Oi();break;case"NULL":r=!0;break;default:return b.Oi()}let u=te(this.expr.params[2]).evaluate(e,t);switch(u.type){case"INT":break;case"NULL":r=!0;break;default:return b.Oi()}if(r)return b.Ni();let c=BigInt(u.value.integerValue),l;try{switch(o){case"microsecond":l=c;break;case"millisecond":l=c*BigInt(1e3);break;case"second":l=c*BigInt(1e6);break;case"minute":l=c*BigInt(6e7);break;case"hour":l=c*BigInt(36e8);break;case"day":l=c*BigInt(864e8);break;default:return b.Oi()}if(o!=="microsecond"&&c!==BigInt(0)&&l/c!==BigInt(this.zi(o)))return b.Oi()}catch(j){return Ft(`Error during timestamp arithmetic: ${j}`),b.Oi()}let B=Td(s.value.timestampValue);if(!ko(B.seconds,B.nanoseconds))return b.Oi();let d=Fd(B),g=this.Hi(d,l);if(!xd(g))return b.Oi();let w=Number(g/Yn),D=g%Yn,P=Number((D<0?D+Yn:D)*BigInt(1e3)),V=D<0?w-1:w;return ko(V,P)?b.newValue({timestampValue:{seconds:V,nanos:P}}):b.Oi()}zi(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}},Nf=class extends nc{Hi(e,t){return e+t}},Of=class extends nc{Hi(e,t){return e-t}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mo(n){if((n=pE(n))instanceof Yr)return`fld(${n.fieldName})`;if(n instanceof Xs)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof Je?`ref(${t.path})`:t instanceof vt?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof x)return`fn(${n.name},[${n.params.map(Mo).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.di.map(Mo).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function fA(n){if(n instanceof $u)return`${n._name}(${_u(n.fields)})`;if(n instanceof Yu){let e=`${n._name}(${_u(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${_u(n.groups)})`),e}if(n instanceof Xu)return`${n._name}(${_u(n.groups)})`;if(n instanceof Zs)return`${n._name}(${n.pi})`;if(n instanceof ei)return`${n._name}(${n.collectionId})`;if(n instanceof Ro)return`${n._name}()`;if(n instanceof So)return`${n._name}(${n.gi.sort()})`;if(n instanceof Po)return`${n._name}(${Mo(n.condition)})`;if(n instanceof Xr)return`${n._name}(${n.limit})`;if(n instanceof No)return`${n._name}(${(function(t){return t.map((r=>`${Mo(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function _u(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${Mo(t)}`)).join(",")}`}function An(n){return n.stages.map((e=>fA(e))).join("|")}function mE(n,e){return An(n)===An(e)}function je(n){return n instanceof at}function Xm(n){return je(n)?An(n):ao(n)}function _E(n){return je(n)?An(n):(function(t){return`${V_(un(t))}|lt:${t.limitType}`})(n)}function Dc(n,e){return n instanceof at&&e instanceof at?mE(n,e):!(n instanceof at&&!(e instanceof at)||!(n instanceof at)&&e instanceof at)&&f0(n,e)}function EE(n){return vr(n)?An(n):V_(n)}function yE(n,e){return n instanceof at&&e instanceof at?mE(n,e):!(n instanceof at&&!(e instanceof at)||!(n instanceof at)&&e instanceof at)&&M_(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var xf=class{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){let i=this.mutations[s];i.key.isEqual(e.key)&&s0(i,e,r[s])}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=oo(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=oo(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=j_();return this.mutations.forEach((s=>{let i=e.get(s.key),o=i.overlayedDocument,u=this.applyToLocalView(o,i.mutatedFields);u=t.has(s.key)?null:u;let c=P_(o,u);c!==null&&r.set(s.key,c),o.isValidDocument()||o.convertToNoDocument(ne.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Be())}isEqual(e){return this.batchId===e.batchId&&Ss(this.mutations,e.mutations,((t,r)=>Om(t,r)))&&Ss(this.baseMutations,e.baseMutations,((t,r)=>Om(t,r)))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wE="";function dA(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Zm(e)),e=pA(n.get(t),e);return Zm(e)}function pA(n,e){let t=e,r=n.length;for(let s=0;s<r;s++){let i=n.charAt(s);switch(i){case"\0":t+="";break;case wE:t+="";break;default:t+=i}}return t}function Zm(n){return n+wE+""}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gA="remoteDocuments",IE="owner";var DE="mutationQueues";var TE="mutations";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var AE="documentMutations",CA="remoteDocumentsV14";var bE="remoteDocumentGlobal";var vE="targets";var RE="targetDocuments";var SE="targetGlobal",PE="collectionParents";var NE="clientMetadata";var OE="bundles";var xE="namedQueries";var mA="indexConfiguration";var _A="indexState";var EA="indexEntries";var FE="documentOverlays";var yA="globals";var wA=[DE,TE,AE,gA,vE,IE,SE,RE,NE,bE,PE,OE,xE],QS=[...wA,FE],IA=[DE,TE,AE,CA,vE,IE,SE,RE,NE,bE,PE,OE,xE,FE],DA=IA,TA=[...DA,mA,_A,EA];var $S=[...TA,yA];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ff=class{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ni=class n{constructor(e,t,r,s,i=ne.min(),o=ne.min(),u=Re.EMPTY_BYTE_STRING,c=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=u,this.expectedCount=c}withSequenceNumber(e){return new n(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new n(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kf=class{constructor(e){this.Xi=e}};function AA(n){let e=O0({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Nu(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rc=class{constructor(){}Ts(e,t){this.Ps(e,t),t.Is()}Ps(e,t){if("nullValue"in e)this.Rs(t,5);else if("booleanValue"in e)this.Rs(t,10),t.As(e.booleanValue?1:0);else if("integerValue"in e)this.Rs(t,15),t.As(Ae(e.integerValue));else if("doubleValue"in e){let r=Ae(e.doubleValue);this.Vs(r,t)}else if("timestampValue"in e)this.ds(e.timestampValue,t);else if("stringValue"in e)this.fs(e.stringValue,t),this.ps(t);else if("bytesValue"in e)this.Rs(t,30),t.gs(Kt(e.bytesValue)),this.ps(t);else if("referenceValue"in e)this.ys(e.referenceValue,t);else if("geoPointValue"in e)this.ws(e.geoPointValue,t);else if("mapValue"in e){let r=b_(e);if(r===ce.fe)this.Rs(t,Number.MAX_SAFE_INTEGER);else if(r===ce.me)this.bs(e.mapValue,t);else if(r===ce.de)this.Rs(t,999);else if(r===ce.Ve)this.Rs(t,7);else if(r===ce.Ae){let s=e.mapValue?.fields,i=s?.[ks],o=i?.bytesValue,u=Kt(o).toUint8Array();if(u[0]===0){let c=u.slice(1);this.Rs(t,30),t.gs(Re.fromUint8Array(c)),this.ps(t)}else this.Ss(e.mapValue,t)}else if(r===ce.he)this.xs(e.mapValue,t);else if(r===ce.Re)this.vs(e.mapValue,t);else if(r===ce.Te)this.Ds(e.mapValue,t);else if(r===ce.Pe)this.Cs(e.mapValue,t);else if(r===ce.Ie){let s=parseFloat(e.mapValue.fields[Sn].stringValue);this.Vs(s,t)}else this.Fs(e.mapValue,t),this.ps(t)}else"arrayValue"in e?(this.Os(e.arrayValue,t),this.ps(t)):Y(19022,{Ms:e})}fs(e,t){this.Rs(t,25),this.Ns(e,t)}Ns(e,t){t.Bs(e)}Vs(e,t){isNaN(e)?this.Rs(t,13):(this.Rs(t,15),Os(e)?t.As(0):t.As(e))}Cs(e,t){this.Rs(t,15),t.As(Ae(e.fields[or].integerValue))}ds(e,t){this.Rs(t,20),typeof e=="string"&&(e=Rn(e)),t.Bs(`${e.seconds||""}`),t.As(e.nanos||0)}ws(e,t){this.Rs(t,45),t.As(e.latitude||0),t.As(e.longitude||0)}Fs(e,t){let r=e.fields||{};this.Rs(t,55);for(let s of Object.keys(r))this.fs(s,t),this.Ps(r[s],t)}bs(e,t){let r=e.fields||{};this.Rs(t,53);let s=Fr,i=r[s].arrayValue?.values?.length||0;this.Rs(t,15),t.As(Ae(i)),this.fs(s,t),this.Ps(r[s],t)}Os(e,t){let r=e.values||[];this.Rs(t,50);for(let s of r)this.Ps(s,t)}ys(e,t){this.Rs(t,37);let r=e.split("/").filter((s=>s.length>0));ee.fromSegments(r.slice(5)).path.forEach((s=>{this.Rs(t,60),this.Ns(s,t)}))}Rs(e,t){e.As(t)}ps(e){e.As(2)}vs(e,t){this.Rs(t,22);let r=e.fields||{};r&&this.Fs(r[yn].mapValue,t)}Ds(e,t){this.Rs(t,43);let r=e.fields||{},s=r[kr]?.stringValue||"";t.gs(Kt(s))}Ss(e,t){this.Rs(t,31);let r=e.fields||{},s=r[ks]?.bytesValue||"";t.gs(Kt(s)),this.ps(t)}xs(e,t){this.Rs(t,47);let r=e.fields||{},s=r[rn]?.mapValue?.fields||{};s&&(t.Bs(s[xs]?.stringValue||""),t.Bs(s[Fs]?.stringValue||"")),this.ps(t)}};rc.Ls=new rc;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Lf=class{constructor(){this.d_=new Vf}addToCollectionParentIndex(e,t){return this.d_.add(t),U.resolve()}getCollectionParents(e,t){return U.resolve(this.d_.getEntries(t))}addFieldIndex(e,t){return U.resolve()}deleteFieldIndex(e,t){return U.resolve()}deleteAllFieldIndexes(e){return U.resolve()}createTargetIndexes(e,t){return U.resolve()}getDocumentsMatchingTarget(e,t){return U.resolve(null)}getIndexType(e,t){return U.resolve(0)}getFieldIndexes(e,t){return U.resolve([])}getNextCollectionGroupToUpdate(e){return U.resolve(null)}getMinOffset(e,t){return U.resolve(jr.min())}getMinOffsetFromCollectionGroup(e,t){return U.resolve(jr.min())}updateCollectionGroup(e,t,r){return U.resolve()}updateIndexEntries(e,t){return U.resolve()}},Vf=class{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new Ke(Ce.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){let t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new Ke(Ce.comparator)).toArray()}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var YS=new Uint8Array(0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var es=class n{constructor(e){this.K_=e}next(){return this.K_+=2,this.K_}static W_(){return new n(0)}static G_(){return new n(-1)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */// Copyright 2024 Google LLC* @license
function kE(n,e){let t=e;for(let r of n.stages)t=vA({serializer:n.serializer,serverTimestampBehavior:n.listenOptions?.serverTimestampBehavior},r,t);return t}function Tc(n,e){return kE(n,[e]).length>0}function bA(n,e){return je(n)?Tc(n,e):_c(n,e)}function vA(n,e,t){if(e instanceof Zs)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()&&`/${u.key.getCollectionPath().canonicalString()}`===i.pi))})(0,e,t);if(e instanceof Po)return(function(s,i,o){return o.filter((u=>{let c=ho(te(i.condition).evaluate(s,u));return c!==void 0&&kt(c,_t)}))})(n,e,t);if(e instanceof ei)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()&&u.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof Ro)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()))})(0,0,t);if(e instanceof So)return(function(s,i,o){return o.filter((u=>u.isFoundDocument()&&i.yi.has(u.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Xr)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof No)return(function(s,i,o){let u=i.orderings.map((c=>({eo:te(c.expr),direction:c.direction})));return[...o].sort(((c,l)=>{for(let{eo:B,direction:d}of u){let g=ho(B.evaluate(s,c)),w=ho(B.evaluate(s,l)),D=Et(g??Ls,w??Ls);if(D!==0)return d==="ascending"?D:-D}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function Mf(n){let e=(function(r){for(let s=r.stages.length-1;s>=0;s--){let i=r.stages[s];if(i instanceof No)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(let s of e){let i=ho(te(s.expr).evaluate({serializer:n.serializer},t)),o=ho(te(s.expr).evaluate({serializer:n.serializer},r)),u=Et(i||Ls,o||Ls);if(u!==0)return s.direction==="ascending"?u:-u}return 0}}function Rh(n){for(let e=n.stages.length-1;e>=0;e--){let t=n.stages[e];if(t instanceof Xr)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Uf=class{constructor(){this.changes=new On((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Rt.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return r!==void 0?U.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Gf=class{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hf=class{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&oo(r.mutation,s,jt.empty(),Pe.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,Be()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=Be()){let s=Qn();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let o=Es();return i.forEach(((u,c)=>{o=o.insert(u,c.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){let r=Qn();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,Be())))}populateOverlays(e,t,r){let s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,u)=>{t.set(o,u)}))}))}computeViews(e,t,r,s){let i=At(),o=uo(),u=(function(){return uo()})();return t.forEach(((c,l)=>{let B=r.get(l.key);s.has(l.key)&&(B===void 0||B.mutation instanceof Nn)?i=i.insert(l.key,l):B!==void 0?(o.set(l.key,B.mutation.getFieldMask()),oo(B.mutation,l,B.mutation.getFieldMask(),Pe.now())):o.set(l.key,jt.empty())})),this.recalculateAndSaveOverlays(e,i).next((c=>(c.forEach(((l,B)=>o.set(l,B))),t.forEach(((l,B)=>u.set(l,new Gf(B,o.get(l)??null)))),u)))}recalculateAndSaveOverlays(e,t){let r=uo(),s=new Ne(((o,u)=>o-u)),i=Be();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(let u of o)u.keys().forEach((c=>{let l=t.get(c);if(l===null)return;let B=r.get(c)||jt.empty();B=u.applyToLocalView(l,B),r.set(c,B);let d=(s.get(u.batchId)||Be()).add(c);s=s.insert(u.batchId,d)}))})).next((()=>{let o=[],u=s.getReverseIterator();for(;u.hasNext();){let c=u.getNext(),l=c.key,B=c.value,d=j_();B.forEach((g=>{if(!i.has(g)){let w=P_(t.get(g),r.get(g));w!==null&&d.set(g,w),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,d))}return U.waitFor(o)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return je(t)?this.getDocumentsMatchingPipeline(e,t,r,s):h0(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):G_(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{let o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):U.resolve(Qn()),u=yo,c=i;return o.next((l=>U.forEach(l,((B,d)=>(u<d.largestBatchId&&(u=d.largestBatchId),i.get(B)?U.resolve():this.remoteDocumentCache.getEntry(e,B).next((g=>{c=c.insert(B,g)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,c,l,Be()))).next((B=>({batchId:u,changes:C0(B)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ee(t)).next((r=>{let s=Es();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){let i=t.collectionGroup,o=Es();return this.indexManager.getCollectionParents(e,i).next((u=>U.forEach(u,(c=>{let l=(function(d,g){return new Ks(g,null,d.explicitOrderBy.slice(),d.filters.slice(),d.limit,d.limitType,d.startAt,d.endAt)})(t,c.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,r,s).next((B=>{B.forEach(((d,g)=>{o=o.insert(d,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(u=>_c(t,u)))))}getDocumentsMatchingPipeline(e,t,r,s){if($n(t)==="collection_group"){let i=Od(t),o=Es();return this.indexManager.getCollectionParents(e,i).next((u=>U.forEach(u,(c=>{let l=(function(d,g){let w=d.stages.map((D=>D instanceof ei?new Zs(g.canonicalString(),{}):D));return new at(d.serializer,w)})(t,c.child(i));return this.getDocumentsMatchingPipeline(e,l,r,s).next((B=>{B.forEach(((d,g)=>{o=o.insert(d,g)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((o=>{switch(i=o,$n(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let u=Be();for(let c of DB(t))u=u.add(ee.fromPath(c));return this.remoteDocumentCache.getEntries(e,u);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new J("invalid-argument",`Invalid pipeline source to execute offline: ${An(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(u=>Tc(t,u)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,o)=>{let u=o.getKey();t.get(u)===null&&(t=t.insert(u,Rt.newInvalidDocument(u)))}));let s=Es();return t.forEach(((i,o)=>{let u=e.get(i);u!==void 0&&oo(u.mutation,o,jt.empty(),Pe.now()),r(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,r){switch($n(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,Ce.fromString(Ic(t)),r);case"collection_group":throw new J("invalid-argument",`Unexpected collection group pipeline: ${An(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,DB(t).map((s=>ee.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new J("invalid-argument",`Failed to get overlays for pipeline: ${An(t)}`)}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var qf=class{constructor(e){this.serializer=e,this.co=new Map,this.lo=new Map}getBundleMetadata(e,t){return U.resolve(this.co.get(t))}saveBundleMetadata(e,t){return this.co.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:In(s.createTime)}})(t)),U.resolve()}getNamedQuery(e,t){return U.resolve(this.lo.get(t))}saveNamedQuery(e,t){return this.lo.set(t.name,(function(s){return{name:s.name,query:AA(s.bundledQuery),readTime:In(s.readTime)}})(t)),U.resolve()}};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var jf=class{constructor(){this.overlays=new Ne(ee.comparator),this.Eo=new Map}getOverlay(e,t){return U.resolve(this.overlays.get(t))}getOverlays(e,t){let r=Qn();return U.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){let r=Qn();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),U.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Es(e,t,i)})),U.resolve()}removeOverlaysForBatchId(e,t,r){let s=this.Eo.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Eo.delete(r)),U.resolve()}getOverlaysForCollection(e,t,r){let s=Qn(),i=t.length+1,o=new ee(t.child("")),u=this.overlays.getIteratorFrom(o);for(;u.hasNext();){let c=u.getNext().value,l=c.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&c.largestBatchId>r&&s.set(c.getKey(),c)}return U.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new Ne(((l,B)=>l-B)),o=this.overlays.getIterator();for(;o.hasNext();){let l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>r){let B=i.get(l.largestBatchId);B===null&&(B=Qn(),i=i.insert(l.largestBatchId,B)),B.set(l.getKey(),l)}}let u=Qn(),c=i.getIterator();for(;c.hasNext()&&(c.getNext().value.forEach(((l,B)=>u.set(l,B))),!(u.size()>=s)););return U.resolve(u)}Es(e,t,r){let s=this.overlays.get(r.key);if(s!==null){let o=this.Eo.get(s.largestBatchId).delete(r.key);this.Eo.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new Ff(t,r));let i=this.Eo.get(t);i===void 0&&(i=Be(),this.Eo.set(t,i)),this.Eo.set(t,i.add(r.key))}};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Kf=class{constructor(){this.sessionToken=Re.EMPTY_BYTE_STRING}getSessionToken(e){return U.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,U.resolve()}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Uo=class{constructor(){this.ho=new Ke(Ue.To),this.Po=new Ke(Ue.Io)}isEmpty(){return this.ho.isEmpty()}addReference(e,t){let r=new Ue(e,t);this.ho=this.ho.add(r),this.Po=this.Po.add(r)}Ro(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Ao(new Ue(e,t))}Vo(e,t){e.forEach((r=>this.removeReference(r,t)))}fo(e){let t=new ee(new Ce([])),r=new Ue(t,e),s=new Ue(t,e+1),i=[];return this.Po.forEachInRange([r,s],(o=>{this.Ao(o),i.push(o.key)})),i}mo(){this.ho.forEach((e=>this.Ao(e)))}Ao(e){this.ho=this.ho.delete(e),this.Po=this.Po.delete(e)}po(e){let t=new ee(new Ce([])),r=new Ue(t,e),s=new Ue(t,e+1),i=Be();return this.Po.forEachInRange([r,s],(o=>{i=i.add(o.key)})),i}containsKey(e){let t=new Ue(e,0),r=this.ho.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}},Ue=class{constructor(e,t){this.key=e,this.yo=t}static To(e,t){return ee.comparator(e.key,t.key)||ae(e.yo,t.yo)}static Io(e,t){return ae(e.yo,t.yo)||ee.comparator(e.key,t.key)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Jf=class{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.rs=1,this.wo=new Ke(Ue.To)}checkEmpty(e){return U.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){let i=this.rs;this.rs++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let o=new xf(i,t,r,s);this.mutationQueue.push(o);for(let u of s)this.wo=this.wo.add(new Ue(u.key,i)),this.indexManager.addToCollectionParentIndex(e,u.key.path.popLast());return U.resolve(o)}lookupMutationBatch(e,t){return U.resolve(this.bo(t))}getNextMutationBatchAfterBatchId(e,t){let r=t+1,s=this.So(r),i=s<0?0:s;return U.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return U.resolve(this.mutationQueue.length===0?$T:this.rs-1)}getAllMutationBatches(e){return U.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new Ue(t,0),s=new Ue(t,Number.POSITIVE_INFINITY),i=[];return this.wo.forEachInRange([r,s],(o=>{let u=this.bo(o.yo);i.push(u)})),U.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new Ke(ae);return t.forEach((s=>{let i=new Ue(s,0),o=new Ue(s,Number.POSITIVE_INFINITY);this.wo.forEachInRange([i,o],(u=>{r=r.add(u.yo)}))})),U.resolve(this.xo(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,s=r.length+1,i=r;ee.isDocumentKey(i)||(i=i.child(""));let o=new Ue(new ee(i),0),u=new Ke(ae);return this.wo.forEachWhile((c=>{let l=c.key.path;return!!r.isPrefixOf(l)&&(l.length===s&&(u=u.add(c.yo)),!0)}),o),U.resolve(this.xo(u))}xo(e){let t=[];return e.forEach((r=>{let s=this.bo(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){X(this.vo(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.wo;return U.forEach(t.mutations,(s=>{let i=new Ue(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.wo=r}))}us(e){}containsKey(e,t){let r=new Ue(t,0),s=this.wo.firstAfterOrEqual(r);return U.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,U.resolve()}vo(e,t){return this.So(e)}So(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}bo(e){let t=this.So(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zf=class{constructor(e){this.Do=e,this.docs=(function(){return new Ne(ee.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,s=this.docs.get(r),i=s?s.size:0,o=this.Do(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return U.resolve(r?r.document.mutableCopy():Rt.newInvalidDocument(t))}getEntries(e,t){let r=At();return t.forEach((s=>{let i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():Rt.newInvalidDocument(s))})),U.resolve(r)}getAllEntries(e){let t=At();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),U.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,o;je(t)?(i=Ce.fromString(Ic(t)),o=B=>Tc(t,B)):(i=t.path,o=B=>_c(t,B));let u=At(),c=new ee(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(c);for(;l.hasNext();){let{key:B,value:{document:d}}=l.getNext();if(!i.isPrefixOf(B.path))break;B.path.length>i.length+1||c0(u0(d),r)<=0||(s.has(d.key)||o(d))&&(u=u.insert(d.key,d.mutableCopy()))}return U.resolve(u)}getAllFromCollectionGroup(e,t,r,s){Y(9500)}Co(e,t){return U.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new Wf(this)}getSize(e){return U.resolve(this.size)}},Wf=class extends Uf{constructor(e){super(),this.ao=e}applyChanges(e){let t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.ao.addEntry(e,s)):this.ao.removeEntry(r)})),U.waitFor(t)}getFromCache(e,t){return this.ao.getEntry(e,t)}getAllFromCache(e,t){return this.ao.getEntries(e,t)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qf=class{constructor(e){this.persistence=e,this.Fo=new On((t=>EE(t)),yE),this.lastRemoteSnapshotVersion=ne.min(),this.highestTargetId=0,this.Oo=0,this.Mo=new Uo,this.targetCount=0,this.No=es.W_()}forEachTarget(e,t){return this.Fo.forEach(((r,s)=>t(s))),U.resolve()}getLastRemoteSnapshotVersion(e){return U.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return U.resolve(this.Oo)}allocateTargetId(e){return this.highestTargetId=this.No.next(),U.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Oo&&(this.Oo=t),U.resolve()}H_(e){this.Fo.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.No=new es(t),this.highestTargetId=t),e.sequenceNumber>this.Oo&&(this.Oo=e.sequenceNumber)}addTargetData(e,t){return this.H_(t),this.targetCount+=1,U.resolve()}updateTargetData(e,t){return this.H_(t),U.resolve()}removeTargetData(e,t){return this.Fo.delete(t.target),this.Mo.fo(t.targetId),this.targetCount-=1,U.resolve()}removeTargets(e,t,r){let s=0,i=[];return this.Fo.forEach(((o,u)=>{u.sequenceNumber<=t&&r.get(u.targetId)===null&&(this.Fo.delete(o),i.push(this.removeMatchingKeysForTargetId(e,u.targetId)),s++)})),U.waitFor(i).next((()=>s))}getTargetCount(e){return U.resolve(this.targetCount)}getTargetData(e,t){let r=this.Fo.get(t)||null;return U.resolve(r)}addMatchingKeys(e,t,r){return this.Mo.Ro(t,r),U.resolve()}removeMatchingKeys(e,t,r){this.Mo.Vo(t,r);let s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),U.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Mo.fo(t),U.resolve()}getMatchingKeysForTargetId(e,t){let r=this.Mo.po(t);return U.resolve(r)}containsKey(e,t){return U.resolve(this.Mo.containsKey(t))}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sc=class{constructor(e,t){this.Bo={},this.overlays={},this.Lo=new $s(0),this.$o=!1,this.$o=!0,this.Uo=new Kf,this.referenceDelegate=e(this),this.ko=new Qf(this),this.indexManager=new Lf,this.remoteDocumentCache=(function(s){return new zf(s)})((r=>this.referenceDelegate.Qo(r))),this.serializer=new kf(t),this.qo=new qf(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.$o=!1,Promise.resolve()}get started(){return this.$o}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new jf,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.Bo[e.toKey()];return r||(r=new Jf(t,this.referenceDelegate),this.Bo[e.toKey()]=r),r}getGlobalsCache(){return this.Uo}getTargetCache(){return this.ko}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.qo}runTransaction(e,t,r){W("MemoryPersistence","Starting transaction:",e);let s=new $f(this.Lo.next());return this.referenceDelegate.Ko(),r(s).next((i=>this.referenceDelegate.Wo(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Go(e,t){return U.or(Object.values(this.Bo).map((r=>()=>r.containsKey(e,t))))}},$f=class extends hB{constructor(e){super(),this.currentSequenceNumber=e}},Yf=class n{constructor(e){this.persistence=e,this.jo=new Uo,this.zo=null}static Ho(e){return new n(e)}get Jo(){if(this.zo)return this.zo;throw Y(60996)}addReference(e,t,r){return this.jo.addReference(r,t),this.Jo.delete(r.toString()),U.resolve()}removeReference(e,t,r){return this.jo.removeReference(r,t),this.Jo.add(r.toString()),U.resolve()}markPotentiallyOrphaned(e,t){return this.Jo.add(t.toString()),U.resolve()}removeTarget(e,t){this.jo.fo(t.targetId).forEach((s=>this.Jo.add(s.toString())));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.Jo.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}Ko(){this.zo=new Set}Wo(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return U.forEach(this.Jo,(r=>{let s=ee.fromPath(r);return this.Yo(e,s).next((i=>{i||t.removeEntry(s,ne.min())}))})).next((()=>(this.zo=null,t.apply(e))))}updateLimboDocument(e,t){return this.Yo(e,t).next((r=>{r?this.Jo.delete(t.toString()):this.Jo.add(t.toString())}))}Qo(e){return 0}Yo(e,t){return U.or([()=>U.resolve(this.jo.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Go(e,t)])}},ic=class n{constructor(e,t){this.persistence=e,this.Zo=new On((r=>dA(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=W0(this,t)}static Ho(e,t){return new n(e,t)}Ko(){}Wo(e){return U.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Pi(e){let t=this.Y_(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}Y_(e){let t=0;return this.Ii(e,(r=>{t++})).next((()=>t))}Ii(e,t){return U.forEach(this.Zo,((r,s)=>this.X_(e,r,s).next((i=>i?U.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0,s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.Co(e,(o=>this.X_(e,o,t).next((u=>{u||(r++,i.removeEntry(o,ne.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.Zo.set(t,e.currentSequenceNumber),U.resolve()}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.Zo.set(r,e.currentSequenceNumber),U.resolve()}removeReference(e,t,r){return this.Zo.set(r,e.currentSequenceNumber),U.resolve()}updateLimboDocument(e,t){return this.Zo.set(t,e.currentSequenceNumber),U.resolve()}Qo(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=vu(e.data.value)),t}X_(e,t,r){return U.or([()=>this.persistence.Go(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let s=this.Zo.get(t);return U.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Xf=class n{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.$a=r,this.Ua=s}static ka(e,t){let r=Be(),s=Be();for(let i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new n(e,t.fromCache,r,s)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RA(n,e){return ee.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Zf=class{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ed=class{constructor(){this.Qa=!1,this.qa=!1,this.Ka=100,this.Wa=(function(){return Bg()?8:J0(We())>0?6:4})()}initialize(e,t){this.Ga=e,this.indexManager=t,this.Qa=!0}getDocumentsMatchingQuery(e,t,r,s){let i={result:null};return this.ja(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.za(e,t,s,r).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;let o=new Zf;return this.Ha(e,t,o).next((u=>{if(i.result=u,this.qa)return this.Ja(e,t,o,u.size)}))})).next((()=>i.result))}Ja(e,t,r,s){return je(t)?U.resolve():r.documentReadCount<this.Ka?(ms()<=oe.DEBUG&&W("QueryEngine","SDK will not create cache indexes for query:",ao(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Ka,"documents"),U.resolve()):(ms()<=oe.DEBUG&&W("QueryEngine","Query:",ao(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Wa*s?(ms()<=oe.DEBUG&&W("QueryEngine","The SDK decides to create cache indexes for query:",ao(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,un(t))):U.resolve())}ja(e,t){if(je(t))return U.resolve(null);let r=t;if(Mm(r))return U.resolve(null);let s=un(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=Nu(r,null,"F"),s=un(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{let u=Be(...o);return this.Ga.getDocuments(e,u).next((c=>this.indexManager.getMinOffset(e,s).next((l=>{let B=this.Ya(r,c);return this.Za(r,B,u,l.readTime)?this.ja(e,Nu(r,null,"F")):this.Xa(e,B,r,l)}))))})))))}za(e,t,r,s){return(je(t)?(function(o){for(let u of o.stages){if(u instanceof Xr||u instanceof Zu)return!1;if(u instanceof Po){if(u.condition instanceof zu&&u.condition._expr.name==="exists"&&u.condition._expr.params[0]instanceof Yr&&u.condition._expr.params[0].fieldName===Ps)continue;return!1}}return!0})(t):Mm(t))||s.isEqual(ne.min())?U.resolve(null):this.Ga.getDocuments(e,r).next((i=>{let o=this.Ya(t,i);return this.Za(t,o,r,s)?U.resolve(null):(ms()<=oe.DEBUG&&W("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Xm(t)),this.Xa(e,o,t,a0(s,yo)).next((u=>u)))}))}Ya(e,t){let r,s;return je(e)?(r=new Ke(RA),s=i=>Tc(e,i)):(r=new Ke(Dd(e)),s=i=>_c(e,i)),t.forEach(((i,o)=>{s(o)&&(r=r.add(o))})),r}Za(e,t,r,s){if(je(e))return(function(u){return u.stages.some((c=>c instanceof Xr||c instanceof Zu))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;let i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ha(e,t,r){return ms()<=oe.DEBUG&&W("QueryEngine","Using full collection scan to execute query:",Xm(t)),this.Ga.getDocumentsMatchingQuery(e,t,jr.min(),r)}Xa(e,t,r,s){return this.Ga.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kd="LocalStore",SA=3e8,td=class{constructor(e,t,r,s){this.persistence=e,this.eu=t,this.serializer=s,this.tu=new Ne(ae),this.nu=new On((i=>EE(i)),yE),this.ru=new Map,this.iu=e.getRemoteDocumentCache(),this.ko=e.getTargetCache(),this.qo=e.getBundleCache(),this.su(r)}su(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Hf(this.iu,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.iu.setIndexManager(this.indexManager),this.eu.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.tu)))}};function PA(n,e,t,r){return new td(n,e,t,r)}async function LE(n,e){let t=le(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.su(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{let o=[],u=[],c=Be();for(let l of s){o.push(l.batchId);for(let B of l.mutations)c=c.add(B.key)}for(let l of i){u.push(l.batchId);for(let B of l.mutations)c=c.add(B.key)}return t.localDocuments.getDocuments(r,c).next((l=>({_u:l,removedBatchIds:o,addedBatchIds:u})))}))}))}function VE(n){let e=le(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.ko.getLastRemoteSnapshotVersion(t)))}function NA(n,e){let t=le(n),r=e.snapshotVersion,s=t.tu;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{let o=t.iu.newChangeBuffer({trackRemovals:!0});s=t.tu;let u=[];e.targetChanges.forEach(((B,d)=>{let g=s.get(d);if(!g)return;u.push(t.ko.removeMatchingKeys(i,B.removedDocuments,d).next((()=>t.ko.addMatchingKeys(i,B.addedDocuments,d))));let w=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(d)!==null?w=w.withResumeToken(Re.EMPTY_BYTE_STRING,ne.min()).withLastLimboFreeSnapshotVersion(ne.min()):B.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(B.resumeToken,r)),s=s.insert(d,w),(function(P,V,j){return P.resumeToken.approximateByteSize()===0||V.snapshotVersion.toMicroseconds()-P.snapshotVersion.toMicroseconds()>=SA?!0:j.addedDocuments.size+j.modifiedDocuments.size+j.removedDocuments.size>0})(g,w,B)&&u.push(t.ko.updateTargetData(i,w))}));let c=At(),l=Be();if(e.documentUpdates.forEach((B=>{e.resolvedLimboDocuments.has(B)&&u.push(t.persistence.referenceDelegate.updateLimboDocument(i,B))})),u.push(OA(i,o,e.documentUpdates).next((B=>{c=B.ou,l=B.au}))),!r.isEqual(ne.min())){let B=t.ko.getLastRemoteSnapshotVersion(i).next((d=>t.ko.setTargetsMetadata(i,i.currentSequenceNumber,r)));u.push(B)}return U.waitFor(u).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,c,l))).next((()=>c))})).then((i=>(t.tu=s,i)))}function OA(n,e,t){let r=Be(),s=Be();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let o=At();return t.forEach(((u,c)=>{let l=i.get(u);c.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(u)),c.isNoDocument()&&c.version.isEqual(ne.min())?(e.removeEntry(u,c.readTime),o=o.insert(u,c)):!l.isValidDocument()||c.version.compareTo(l.version)>0||c.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(c),o=o.insert(u,c)):W(kd,"Ignoring outdated watch update for ",u,". Current version:",l.version," Watch version:",c.version)})),{ou:o,au:s}}))}function xA(n,e){let t=le(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.ko.getTargetData(r,e).next((i=>i?(s=i,U.resolve(s)):t.ko.allocateTargetId(r).next((o=>(s=new ni(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.ko.addTargetData(r,s).next((()=>s)))))))})).then((r=>{let s=t.tu.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.tu=t.tu.insert(r.targetId,r),t.nu.set(e,r.targetId)),r}))}async function nd(n,e,t){let r=le(n),s=r.tu.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(o=>r.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!ai(o))throw o;W(kd,`Failed to update sequence numbers for target ${e}: ${o}`)}r.tu=r.tu.remove(e),r.nu.delete(s.target)}function e_(n,e,t){let r=le(n),s=ne.min(),i=Be();return r.persistence.runTransaction("Execute query","readwrite",(o=>(function(c,l,B){let d=le(c),g=d.nu.get(B);return g!==void 0?U.resolve(d.tu.get(g)):d.ko.getTargetData(l,B)})(r,o,je(e)?e:un(e)).next((u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,r.ko.getMatchingKeysForTargetId(o,u.targetId).next((c=>{i=c}))})).next((()=>r.eu.getDocumentsMatchingQuery(o,e,t?s:ne.min(),t?i:Be()))).next((u=>(FA(r,u),{documents:u,uu:i})))))}function FA(n,e){e.forEach(((t,r)=>{let s=r.key.getCollectionGroup(),i=n.ru.get(s)||ne.min();r.readTime.compareTo(i)>0&&n.ru.set(s,r.readTime)}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rd=class{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Pu=0,this.Iu=null,this.Ru=!0}Au(){this.Pu===0&&(this.Vu("Unknown"),this.Iu=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Iu=null,this.du("Backend didn't respond within 10 seconds."),this.Vu("Offline"),Promise.resolve()))))}fu(e){this.state==="Online"?this.Vu("Unknown"):(this.Pu++,this.Pu>=1&&(this.mu(),this.du(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.Vu("Offline")))}set(e){this.mu(),this.Pu=0,e==="Online"&&(this.Ru=!1),this.Vu(e)}Vu(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}du(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Ru?(vn(t),this.Ru=!1):W("OnlineStateTracker",t)}mu(){this.Iu!==null&&(this.Iu.cancel(),this.Iu=null)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var kn="RemoteStore",sd=class{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.pu=[],this.gu=new Map,this.yu=new Map,this.wu=new Map,this.bu=new es(1e3),this.Su=new es(1001),this.xu=new Set,this.vu=[],this.Du=i,this.Du.tn((o=>{r.enqueueAndForget((async()=>{$o(this)&&(W(kn,"Restarting streams for network reachability change."),await(async function(c){let l=le(c);l.xu.add(4),await Qo(l),l.Cu.set("Unknown"),l.xu.delete(4),await Ac(l)})(this))}))})),this.Cu=new rd(r,s)}};async function Ac(n){if($o(n))for(let e of n.vu)await e(!0)}async function Qo(n){for(let e of n.vu)await e(!1)}function id(n,e){return n.yu.get(e)||void 0}function ME(n,e){let t=le(n),r=id(t,e.targetId);if(r!==void 0&&t.gu.has(r))return;let s=(function(u,c){let l=id(u,c);l!==void 0&&u.wu.delete(l);let B=(function(g,w){return w%2!=0?g.Su.next():g.bu.next()})(u,c);return u.yu.set(c,B),u.wu.set(B,c),B})(t,e.targetId);W(kn,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);let i=new ni(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.gu.set(s,i),Ud(t)?Md(t):ui(t).ur()&&Vd(t,i)}function Ld(n,e){let t=le(n),r=ui(t),s=id(t,e);W(kn,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.gu.delete(s),t.yu.delete(e),t.wu.delete(s),r.ur()&&UE(t,s),t.gu.size===0&&(r.ur()?r.Er():$o(t)&&t.Cu.set("Unknown"))}function Vd(n,e){if(n.Fu.rt(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ne.min())>0){let t=n.wu.get(e.targetId);if(t===void 0)return void W(kn,"SDK target ID not found for remote ID: "+e.targetId);let r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}ui(n).yr(e)}function UE(n,e){n.Fu.rt(e),ui(n).wr(e)}function Md(n){n.Fu=new Qh({getRemoteKeysForTarget:e=>{let t=n.wu.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):Be()},Mt:e=>n.gu.get(e)||null,xt:()=>n.datastore.serializer.databaseId}),ui(n).start(),n.Cu.Au()}function Ud(n){return $o(n)&&!ui(n).ar()&&n.gu.size>0}function $o(n){return le(n).xu.size===0}function GE(n){n.Fu=void 0}async function kA(n){n.Cu.set("Online")}async function LA(n){n.gu.forEach(((e,t)=>{Vd(n,e)}))}async function VA(n,e){GE(n),Ud(n)?(n.Cu.fu(e),Md(n)):n.Cu.set("Unknown")}async function MA(n,e,t){if(n.Cu.set("Online"),e instanceof xu&&e.state===2&&e.cause)try{await(async function(s,i){let o=i.cause;for(let u of i.targetIds){if(s.gu.has(u)){let c=s.wu.get(u);c!==void 0&&(await s.remoteSyncer.rejectListen(c,o),s.yu.delete(c),s.wu.delete(u)),s.gu.delete(u)}s.Fu.removeTarget(u)}})(n,e)}catch(r){W(kn,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await t_(n,r)}else if(e instanceof vs?n.Fu.Tt(e):e instanceof Ou?n.Fu.ft(e):n.Fu.Rt(e),!t.isEqual(ne.min()))try{let r=await VE(n.localStore);t.compareTo(r)>=0&&await(function(i,o){let u=i.Fu.Dt(o);u.targetChanges.forEach(((l,B)=>{if(l.resumeToken.approximateByteSize()>0){let d=i.gu.get(B);d&&i.gu.set(B,d.withResumeToken(l.resumeToken,o))}})),u.targetMismatches.forEach(((l,B)=>{let d=i.gu.get(l);if(!d)return;i.gu.set(l,d.withResumeToken(Re.EMPTY_BYTE_STRING,d.snapshotVersion)),UE(i,l);let g=new ni(d.target,l,B,d.sequenceNumber);Vd(i,g)}));let c=(function(B,d){let g=new Map;d.targetChanges.forEach(((D,P)=>{let V=B.wu.get(P);V!==void 0&&g.set(V,D)}));let w=new Ne(ae);return d.targetMismatches.forEach(((D,P)=>{let V=B.wu.get(D);V!==void 0&&(w=w.insert(V,P))})),new wo(d.snapshotVersion,g,w,d.documentUpdates,d.augmentedDocumentUpdates,d.resolvedLimboDocuments)})(i,u);return i.remoteSyncer.applyRemoteEvent(c)})(n,t)}catch(r){W(kn,"Failed to raise snapshot:",r),await t_(n,r)}}async function t_(n,e,t){if(!ai(e))throw e;n.xu.add(1),await Qo(n),n.Cu.set("Offline"),t||(t=()=>VE(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{W(kn,"Retrying IndexedDB access"),await t(),n.xu.delete(1),await Ac(n)}))}async function n_(n,e){let t=le(n);t.asyncQueue.verifyOperationInProgress(),W(kn,"RemoteStore received new credentials");let r=$o(t);t.xu.add(3),await Qo(t),r&&t.Cu.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.xu.delete(3),await Ac(t)}async function UA(n,e){let t=le(n);e?(t.xu.delete(2),await Ac(t)):e||(t.xu.add(2),await Qo(t),t.Cu.set("Unknown"))}function ui(n){return n.Ou||(n.Ou=(function(t,r,s){let i=le(t);return i.Or(),new uB(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{pn:kA.bind(null,n),yn:LA.bind(null,n),bn:VA.bind(null,n),gr:MA.bind(null,n)}),n.vu.push((async e=>{e?(n.Ou.lr(),Ud(n)?Md(n):n.Cu.set("Unknown")):(await n.Ou.stop(),GE(n))}))),n.Ou}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var oc=class{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Nu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Nu(this.observer.error,e):vn("Uncaught Error in snapshot listener:",e.toString()))}Bu(){this.muted=!0}Nu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var od=class n{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new cn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){let o=Date.now()+r,u=new n(e,t,o,s,i);return u.start(r),u}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new J(L.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}};function HE(n,e){if(vn("AsyncQueue",`${e}: ${n}`),ai(n))return new J(L.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ac=class{constructor(){this.activeTargetIds=E0()}nc(e){this.activeTargetIds=this.activeTargetIds.add(e)}rc(e){this.activeTargetIds=this.activeTargetIds.delete(e)}tc(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}};var ad=class{constructor(){this.kc=new ac,this.Qc={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.kc.nc(e),this.Qc[e]||"not-current"}updateQueryState(e,t,r){this.Qc[e]=t}removeLocalQueryTarget(e){this.kc.rc(e)}isLocalQueryTarget(e){return this.kc.activeTargetIds.has(e)}clearQueryState(e){delete this.Qc[e]}getAllActiveQueryTargets(){return this.kc.activeTargetIds}isActiveQueryTarget(e){return this.kc.activeTargetIds.has(e)}start(){return this.kc=new ac,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sh(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Go=class n{static emptySet(e){return new n(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||ee.comparator(t.key,r.key):(t,r)=>ee.comparator(t.key,r.key),this.keyedMap=Es(),this.sortedSet=new Ne(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof n)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){let s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){let e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){let r=new n;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var uc=class{constructor(){this.qc=new Ne(ee.comparator)}track(e){let t=e.doc.key,r=this.qc.get(t);r?e.type!==0&&r.type===3?this.qc=this.qc.insert(t,e):e.type===3&&r.type!==1?this.qc=this.qc.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.qc=this.qc.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.qc=this.qc.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.qc=this.qc.remove(t):e.type===1&&r.type===2?this.qc=this.qc.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.qc=this.qc.insert(t,{type:2,doc:e.doc}):Y(63341,{Nt:e,Kc:r}):this.qc=this.qc.insert(t,e)}Wc(){let e=[];return this.qc.inorderTraversal(((t,r)=>{e.push(r)})),e}},ri=class n{constructor(e,t,r,s,i,o,u,c,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=u,this.excludesMetadataChanges=c,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,s,i){let o=[];return t.forEach((u=>{o.push({type:0,doc:u})})),new n(e,t,Go.emptySet(t),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Dc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ud=class{constructor(){this.Gc=void 0,this.jc=[]}zc(){return this.jc.some((e=>e.Hc()))}},cd=class{constructor(){this.queries=r_(),this.onlineState="Unknown",this.Jc=new Set}terminate(){(function(t,r){let s=le(t),i=s.queries;s.queries=r_(),i.forEach(((o,u)=>{for(let c of u.jc)c.onError(r)}))})(this,new J(L.ABORTED,"Firestore shutting down"))}};function r_(){return new On((n=>_E(n)),Dc)}async function qE(n,e){let t=le(n),r=3,s=e.query,i=t.queries.get(s);i?!i.zc()&&e.Hc()&&(r=2):(i=new ud,r=e.Hc()?0:1);try{switch(r){case 0:i.Gc=await t.onListen(s,!0);break;case 1:i.Gc=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){let u=HE(o,`Initialization of query '${je(e.query)?An(e.query):ao(e.query)}' failed`);return void e.onError(u)}t.queries.set(s,i),i.jc.push(e),e.Yc(t.onlineState),i.Gc&&e.Zc(i.Gc)&&Gd(t)}async function jE(n,e){let t=le(n),r=e.query,s=3,i=t.queries.get(r);if(i){let o=i.jc.indexOf(e);o>=0&&(i.jc.splice(o,1),i.jc.length===0?s=e.Hc()?0:1:!i.zc()&&e.Hc()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function GA(n,e){let t=le(n),r=!1;for(let s of e){let i=s.query,o=t.queries.get(i);if(o){for(let u of o.jc)u.Zc(s)&&(r=!0);o.Gc=s}}r&&Gd(t)}function HA(n,e,t){let r=le(n),s=r.queries.get(e);if(s)for(let i of s.jc)i.onError(t);r.queries.delete(e)}function Gd(n){n.Jc.forEach((e=>{e.next()}))}var ld;(function(n){n.Default="default",n.Cache="cache"})(ld||(ld={}));var cc=class{constructor(e,t,r){this.query=e,this.Xc=t,this.el=!1,this.tl=null,this.onlineState="Unknown",this.options=r||{}}Zc(e){if(!this.options.includeMetadataChanges){let r=[];for(let s of e.docChanges)s.type!==3&&r.push(s);e=new ri(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.el?this.nl(e)&&(this.Xc.next(e),t=!0):this.rl(e,this.onlineState)&&(this.il(e),t=!0),this.tl=e,t}onError(e){this.Xc.error(e)}Yc(e){this.onlineState=e;let t=!1;return this.tl&&!this.el&&this.rl(this.tl,e)&&(this.il(this.tl),t=!0),t}rl(e,t){if(!e.fromCache||!this.Hc())return!0;let r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}nl(e){if(e.docChanges.length>0)return!0;let t=this.tl&&this.tl.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}il(e){e=ri.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.el=!0,this.Xc.next(e)}Hc(){return this.options.source!==ld.Cache}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var lc=class{constructor(e){this.key=e}},hc=class{constructor(e){this.key=e}},hd=class{constructor(e,t){this.query=e,this.hl=t,this.Tl=null,this.hasCachedResults=!1,this.current=!1,this.Pl=Be(),this.mutatedKeys=Be(),this.Il=je(e)?Mf(e):Dd(e),this.Rl=new Go(this.Il)}get Al(){return this.hl}Vl(e,t){let r=t?t.dl:new uc,s=t?t.Rl:this.Rl,i=t?t.mutatedKeys:this.mutatedKeys,o=s,u=!1,[c,l]=this.fl(this.query,s);e.inorderTraversal(((d,g)=>{let w=s.get(d),D=bA(this.query,g)?g:null,P=!!w&&this.mutatedKeys.has(w.key),V=!!D&&(D.hasLocalMutations||this.mutatedKeys.has(D.key)&&D.hasCommittedMutations),j=!1;w&&D?w.data.isEqual(D.data)?P!==V&&(r.track({type:3,doc:D}),j=!0):this.ml(w,D)||(r.track({type:2,doc:D}),j=!0,(c&&this.Il(D,c)>0||l&&this.Il(D,l)<0)&&(u=!0)):!w&&D?(r.track({type:0,doc:D}),j=!0):w&&!D&&(r.track({type:1,doc:w}),j=!0,(c||l)&&(u=!0)),j&&(D?(o=o.add(D),i=V?i.add(d):i.delete(d)):(o=o.delete(d),i=i.delete(d)))}));let B=this.pl(this.query);if(B)if(je(this.query)){let d=[];o.forEach((D=>d.push(D)));let g=kE(this.query,d),w=new Go(Mf(this.query));for(let D of g)w=w.add(D);o.forEach((D=>{w.has(D.key)||(i=i.delete(D.key),r.track({type:1,doc:D}))})),o=w}else{let d=this.gl(this.query);for(;o.size>B;){let g=d==="F"?o.last():o.first();o=o.delete(g.key),i=i.delete(g.key),r.track({type:1,doc:g})}}return{Rl:o,dl:r,Za:u,mutatedKeys:i}}pl(e){return je(e)?Rh(e)?.limit:e.limit||void 0}gl(e){if(je(e)){let t=Rh(e);return t&&t.limit<0?"L":"F"}return e.limitType}fl(e,t){if(je(e)){let r=Rh(e)?.limit;return[t.size===r?t.last():null,null]}return[e.limitType==="F"&&t.size===this.pl(this.query)?t.last():null,e.limitType==="L"&&t.size===this.pl(this.query)?t.first():null]}ml(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){let i=this.Rl;this.Rl=e.Rl,this.mutatedKeys=e.mutatedKeys;let o=e.dl.Wc();o.sort(((B,d)=>(function(w,D){let P=V=>{switch(V){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Y(20277,{Nt:V})}};return P(w)-P(D)})(B.type,d.type)||this.Il(B.doc,d.doc))),this.yl(r),s=s??!1;let u=t&&!s?this.wl():[],c=this.Pl.size===0&&this.current&&!s?1:0,l=c!==this.Tl;return this.Tl=c,o.length!==0||l?{snapshot:new ri(this.query,e.Rl,i,o,e.mutatedKeys,c===0,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),bl:u}:{bl:u}}Yc(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Rl:this.Rl,dl:new uc,mutatedKeys:this.mutatedKeys,Za:!1},!1)):{bl:[]}}Sl(e){return!this.hl.has(e)&&!!this.Rl.has(e)&&!this.Rl.get(e).hasLocalMutations}yl(e){e&&(e.addedDocuments.forEach((t=>this.hl=this.hl.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.hl=this.hl.delete(t))),this.current=e.current)}wl(){if(!this.current)return[];let e=this.Pl;this.Pl=Be(),this.Rl.forEach((r=>{this.Sl(r.key)&&(this.Pl=this.Pl.add(r.key))}));let t=[];return e.forEach((r=>{this.Pl.has(r)||t.push(new hc(r))})),this.Pl.forEach((r=>{e.has(r)||t.push(new lc(r))})),t}xl(e){this.hl=e.uu,this.Pl=Be();let t=this.Vl(e.documents);return this.applyChanges(t,!0)}vl(){return ri.fromInitialDocuments(this.query,this.Rl,this.mutatedKeys,this.Tl===0,this.hasCachedResults)}},Hd="SyncEngine",Bd=class{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}},fd=class{constructor(e){this.key=e,this.Dl=!1}},dd=class{constructor(e,t,r,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Cl={},this.Fl=new On((u=>_E(u)),Dc),this.Ol=new Map,this.Ml=new Set,this.Nl=new Ne(ee.comparator),this.Bl=new Map,this.Ll=new Uo,this.$l={},this.Ul=new Map,this.kl=es.G_(),this.onlineState="Unknown",this.Ql=void 0}get isPrimaryClient(){return this.Ql===!0}};async function qA(n,e,t=!0){let r=QE(n),s,i=r.Fl.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.vl()):s=await KE(r,e,t,!0),s}async function jA(n,e){let t=QE(n);await KE(t,e,!0,!1)}async function KE(n,e,t,r){let s=await xA(n.localStore,je(e)?e:un(e)),i=s.targetId,o=n.sharedClientState.addLocalQueryTarget(i,t),u;return r&&(u=await KA(n,e,i,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&ME(n.remoteStore,s),u}async function KA(n,e,t,r,s){n.ql=(d,g,w)=>(async function(P,V,j,Q){let re=V.view.Vl(j);re.Za&&(re=await e_(P.localStore,V.query,!1).then((({documents:A})=>V.view.Vl(A,re))));let ue=Q&&Q.targetChanges.get(V.targetId),Oe=Q&&Q.targetMismatches.get(V.targetId)!=null,Ee=V.view.applyChanges(re,P.isPrimaryClient,ue,Oe);return i_(P,V.targetId,Ee.bl),Ee.snapshot})(n,d,g,w);let i=await e_(n.localStore,e,!0),o=new hd(e,i.uu),u=o.Vl(i.documents),c=Io.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),l=o.applyChanges(u,n.isPrimaryClient,c);i_(n,t,l.bl);let B=new Bd(e,t,o);return n.Fl.set(e,B),n.Ol.has(t)?n.Ol.get(t).push(e):n.Ol.set(t,[e]),l.snapshot}async function JA(n,e,t){let r=le(n),s=r.Fl.get(e),i=r.Ol.get(s.targetId);if(i.length>1)return r.Ol.set(s.targetId,i.filter((o=>!Dc(o,e)))),void r.Fl.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await nd(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Ld(r.remoteStore,s.targetId),pd(r,s.targetId)})).catch(yc)):(pd(r,s.targetId),await nd(r.localStore,s.targetId,!0))}async function zA(n,e){let t=le(n),r=t.Fl.get(e),s=t.Ol.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Ld(t.remoteStore,r.targetId))}async function JE(n,e){let t=le(n);try{let r=await NA(t.localStore,e);e.targetChanges.forEach(((s,i)=>{let o=t.Bl.get(i);o&&(X(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.Dl=!0:s.modifiedDocuments.size>0?X(o.Dl,14607):s.removedDocuments.size>0&&(X(o.Dl,42227),o.Dl=!1))})),await WE(t,r,e)}catch(r){await yc(r)}}function s_(n,e,t){let r=le(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){let s=[];r.Fl.forEach(((i,o)=>{let u=o.view.Yc(e);u.snapshot&&s.push(u.snapshot)})),(function(o,u){let c=le(o);c.onlineState=u;let l=!1;c.queries.forEach(((B,d)=>{for(let g of d.jc)g.Yc(u)&&(l=!0)})),l&&Gd(c)})(r.eventManager,e),s.length&&r.Cl.gr(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function WA(n,e,t){let r=le(n);r.sharedClientState.updateQueryState(e,"rejected",t);let s=r.Bl.get(e),i=s&&s.key;if(i){let o=new Ne(ee.comparator);o=o.insert(i,Rt.newNoDocument(i,ne.min()));let u=Be().add(i),c=new wo(ne.min(),new Map,new Ne(ae),o,At(),u);await JE(r,c),r.Nl=r.Nl.remove(i),r.Bl.delete(e),qd(r)}else await nd(r.localStore,e,!1).then((()=>pd(r,e,t))).catch(yc)}function pd(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(let r of n.Ol.get(e))n.Fl.delete(r),t&&n.Cl.Kl(r,t);n.Ol.delete(e),n.isPrimaryClient&&n.Ll.fo(e).forEach((r=>{n.Ll.containsKey(r)||zE(n,r)}))}function zE(n,e){n.Ml.delete(e.path.canonicalString());let t=n.Nl.get(e);t!==null&&(Ld(n.remoteStore,t),n.Nl=n.Nl.remove(e),n.Bl.delete(t),qd(n))}function i_(n,e,t){for(let r of t)r instanceof lc?(n.Ll.addReference(r.key,e),QA(n,r)):r instanceof hc?(W(Hd,"Document no longer in limbo: "+r.key),n.Ll.removeReference(r.key,e),n.Ll.containsKey(r.key)||zE(n,r.key)):Y(19791,{Wl:r})}function QA(n,e){let t=e.key,r=t.path.canonicalString();n.Nl.get(t)||n.Ml.has(r)||(W(Hd,"New document in limbo: "+t),n.Ml.add(r),qd(n))}function qd(n){for(;n.Ml.size>0&&n.Nl.size<n.maxConcurrentLimboResolutions;){let e=n.Ml.values().next().value;n.Ml.delete(e);let t=new ee(Ce.fromString(e)),r=n.kl.next();n.Bl.set(r,new fd(t)),n.Nl=n.Nl.insert(t,r),ME(n.remoteStore,new ni(un(Wo(t.path)),r,"TargetPurposeLimboResolution",$s.Br))}}async function WE(n,e,t){let r=le(n),s=[],i=[],o=[];r.Fl.isEmpty()||(r.Fl.forEach(((u,c)=>{o.push(r.ql(c,e,t).then((l=>{if((l||t)&&r.isPrimaryClient){let B=l?!l.fromCache:t?.targetChanges.get(c.targetId)?.current;r.sharedClientState.updateQueryState(c.targetId,B?"current":"not-current")}if(l){s.push(l);let B=Xf.ka(c.targetId,l);i.push(B)}})))})),await Promise.all(o),r.Cl.gr(s),await(async function(c,l){let B=le(c);try{await B.persistence.runTransaction("notifyLocalViewChanges","readwrite",(d=>U.forEach(l,(g=>U.forEach(g.$a,(w=>B.persistence.referenceDelegate.addReference(d,g.targetId,w))).next((()=>U.forEach(g.Ua,(w=>B.persistence.referenceDelegate.removeReference(d,g.targetId,w)))))))))}catch(d){if(!ai(d))throw d;W(kd,"Failed to update sequence numbers: "+d)}for(let d of l){let g=d.targetId;if(!d.fromCache){let w=B.tu.get(g),D=w.snapshotVersion,P=w.withLastLimboFreeSnapshotVersion(D);B.tu=B.tu.insert(g,P)}}})(r.localStore,i))}async function $A(n,e){let t=le(n);if(!t.currentUser.isEqual(e)){W(Hd,"User change. New user:",e.toKey());let r=await LE(t.localStore,e);t.currentUser=e,(function(i,o){i.Ul.forEach((u=>{u.forEach((c=>{c.reject(new J(L.CANCELLED,o))}))})),i.Ul.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await WE(t,r._u)}}function YA(n,e){let t=le(n),r=t.Bl.get(e);if(r&&r.Dl)return Be().add(r.key);{let s=Be(),i=t.Ol.get(e);if(!i)return s;for(let o of i??[]){let u=t.Fl.get(o);s=s.unionWith(u.view.Al)}return s}}function QE(n){let e=le(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=JE.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=YA.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=WA.bind(null,e),e.Cl.gr=GA.bind(null,e.eventManager),e.Cl.Kl=HA.bind(null,e.eventManager),e}var ts=class{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ec(e.databaseInfo.databaseId),this.sharedClientState=this.jl(e),this.persistence=this.zl(e),await this.persistence.start(),this.localStore=this.Hl(e),this.gcScheduler=this.Jl(e,this.localStore),this.indexBackfillerScheduler=this.Yl(e,this.localStore)}Jl(e,t){return null}Yl(e,t){return null}Hl(e){return PA(this.persistence,new ed,e.initialUser,this.serializer)}zl(e){return new sc(Yf.Ho,this.serializer)}jl(e){return new ad}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}};ts.provider={build:()=>new ts};var Bc=class extends ts{constructor(e){super(),this.cacheSizeBytes=e}Jl(e,t){X(this.persistence.referenceDelegate instanceof ic,46915);let r=this.persistence.referenceDelegate.garbageCollector;return new fB(r,e.asyncQueue,t)}zl(e){let t=this.cacheSizeBytes!==void 0?xt.withCacheSize(this.cacheSizeBytes):xt.DEFAULT;return new sc((r=>ic.Ho(r,t)),this.serializer)}};var si=class{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>s_(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=$A.bind(null,this.syncEngine),await UA(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new cd})()}createDatastore(e){let t=Ec(e.databaseInfo.databaseId),r=G0(e.databaseInfo);return H0(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,o,u){return new sd(r,s,i,o,u)})(this.localStore,this.datastore,e.asyncQueue,(t=>s_(this.syncEngine,t,0)),(function(){return Gu.cn()?new Gu:new rB})())}createSyncEngine(e,t){return(function(s,i,o,u,c,l,B){let d=new dd(s,i,o,u,c,l);return B&&(d.Ql=!0),d})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){let r=le(t);W(kn,"RemoteStore shutting down."),r.xu.add(5),await Qo(r),r.Du.shutdown(),r.Cu.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}};si.provider={build:()=>new si};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var gd=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new J(L.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;let t=await(async function(s,i){let o=le(s),u={documents:i.map((d=>Do(o.serializer,d)))},c=await o.dn("BatchGetDocuments",o.serializer.databaseId,Ce.emptyPath(),u,i.length),l=new Map;c.forEach((d=>{let g=v0(o.serializer,d);l.set(g.key.toString(),g)}));let B=[];return i.forEach((d=>{let g=l.get(d.toString());X(!!g,55234,{key:d}),B.push(g)})),B})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new js(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{let s=ee.fromPath(r);this.mutations.push(new Ru(s,this.precondition(s)))})),await(async function(r,s){let i=le(r),o={writes:s.map((u=>S0(i.serializer,u)))};await i.In("Commit",i.serializer.databaseId,Ce.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Y(50498,{Xl:e.constructor.name});t=ne.min()}let r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new J(L.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(ne.min())?qt.exists(!1):qt.updateTime(t):qt.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(ne.min()))throw new J(L.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return qt.updateTime(t)}return qt.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Cd=class{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.eE=r.maxAttempts,this._r=new Ao(this.asyncQueue,"transaction_retry")}tE(){this.eE-=1,this.nE()}nE(){this._r.Yn((async()=>{let e=new gd(this.datastore),t=this.rE(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.iE(s)}))))})).catch((r=>{this.iE(r)}))}))}rE(e){try{let t=this.updateFunction(e);return!Jo(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}iE(e){this.eE>0&&this.sE(e)?(this.eE-=1,this.asyncQueue.enqueueAndForget((()=>(this.nE(),Promise.resolve())))):this.deferred.reject(e)}sE(e){if(e?.name==="FirebaseError"){let t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!p0(t)}return!1}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var rr="FirestoreClient",md=class{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=Xe.UNAUTHENTICATED,this.clientId=Rs.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async o=>{W(rr,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(r,(o=>(W(rr,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new cn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){let r=HE(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}};async function Ph(n,e){n.asyncQueue.verifyOperationInProgress(),W(rr,"Initializing OfflineComponentProvider");let t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await LE(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function o_(n,e){n.asyncQueue.verifyOperationInProgress();let t=await XA(n);W(rr,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>n_(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>n_(e.remoteStore,s))),n._onlineComponents=e}async function XA(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){W(rr,"Using user provided OfflineComponentProvider");try{await Ph(n,n._uninitializedComponentsProvider._offline)}catch(e){let t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===L.FAILED_PRECONDITION||s.code===L.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Ft("Error using user provided cache. Falling back to memory cache: "+t),await Ph(n,new ts)}}else W(rr,"Using default OfflineComponentProvider"),await Ph(n,new Bc(void 0));return n._offlineComponents}async function $E(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(W(rr,"Using user provided OnlineComponentProvider"),await o_(n,n._uninitializedComponentsProvider._online)):(W(rr,"Using default OnlineComponentProvider"),await o_(n,new si))),n._onlineComponents}function ZA(n){return $E(n).then((e=>e.datastore))}async function _d(n){let e=await $E(n),t=e.eventManager;return t.onListen=qA.bind(null,e.syncEngine),t.onUnlisten=JA.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=jA.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=zA.bind(null,e.syncEngine),t}function YE(n,e,t,r){let s=new oc(r),i=new cc(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>qE(await _d(n),i))),()=>{s.Bu(),n.asyncQueue.enqueueAndForget((async()=>jE(await _d(n),i)))}}function XE(n,e,t={}){let r=new cn;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,u,c,l){let B=new oc({next:g=>{B.Bu(),o.enqueueAndForget((()=>jE(i,d)));let w=g.docs.has(u);!w&&g.fromCache?l.reject(new J(L.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&g.fromCache&&c&&c.source==="server"?l.reject(new J(L.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),d=new cc(Wo(u.path),B,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return qE(i,d)})(await _d(n),n.asyncQueue,e,t,r))),r.promise}function ZE(n,e,t){let r=new cn;return n.asyncQueue.enqueueAndForget((async()=>{let s=await ZA(n);new Cd(n.asyncQueue,s,t,e,r).tE()})),r.promise}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Yo=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Je(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){let e=new eb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){let t=this._document.data.field($r("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},eb=class extends Yo{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ho=class{convertValue(e,t="none"){switch(He(e)){case 0:return null;case 2:return e.booleanValue;case 3:if("mapValue"in e){if(Xn(e))return this.convertToInt32Value(e.mapValue);if(Lt(e))return this.convertToDecimal128Value(e.mapValue)}return Ae(e.integerValue||e.doubleValue);case 4:return this.convertTimestamp(e.timestampValue);case 6:return this.convertServerTimestamp(e,t);case 7:return e.stringValue;case 8:return"bytesValue"in e?this.convertBytes(Kt(e.bytesValue)):this.convertToBytesWithSubtype(e.mapValue);case 9:return this.convertReference(e.referenceValue);case 11:return this.convertGeoPoint(e.geoPointValue);case 13:return this.convertArray(e.arrayValue,t);case 15:return this.convertObject(e.mapValue,t);case 14:return this.convertVectorValue(e.mapValue);case 12:return this.convertToRegexValue(e.mapValue);case 10:return this.convertToBsonObjectId(e.mapValue);case 5:return this.convertToBsonTimestamp(e.mapValue);case 16:return zr.instance();case 1:return Wr.instance();default:throw Y(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return ns(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){let t=e.fields?.[Fr].arrayValue?.values?.map((r=>Ae(r.doubleValue)));return new vt(t)}convertToBsonObjectId(e){let t=e.fields?.[kr]?.stringValue??"";return new Js(t)}convertToBytesWithSubtype(e){let t=e.fields?.[ks],r=t?.bytesValue;if(!r)throw new Error("Received incorrect bytesValue for Bytes with subtype");let s=Kt(r).toUint8Array();if(s.length===0)throw new Error("Received empty bytesValue for Bytes with subtype");let i=s[0],o=s.slice(1);return new Jt(Re.fromUint8Array(o),i)}convertToBsonTimestamp(e){let t=e.fields?.[yn],r=Number(t?.mapValue?.fields?.[po]?.integerValue),s=Number(t?.mapValue?.fields?.[go]?.integerValue);return new zs(r,s)}convertToRegexValue(e){let t=e.fields?.[rn]?.mapValue?.fields?.[xs]?.stringValue??"",r=e.fields?.[rn]?.mapValue?.fields?.[Fs]?.stringValue??"";return new Ys(t,r)}convertToInt32Value(e){let t=Number(e.fields?.[or]?.integerValue);return new Qs(t)}convertToDecimal128Value(e){let t=e.fields?.[Sn]?.stringValue??"";return new Ws(t)}convertGeoPoint(e){return new Dn(Ae(e.latitude),Ae(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":let r=Ko(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(Ns(e));default:return null}}convertTimestamp(e){let t=Rn(e);return new Pe(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=Ce.fromString(e);X($_(r),9688,{name:e});let s=new fo(r.get(1),r.get(3)),i=new ee(r.popFirst(5));return s.isEqual(t)||vn(`A document reference to ${i} refers to a different database (${s.projectId}/${s.database}), which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ey(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}var fc=class extends Ho{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jt(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new Je(this.firestore,null,t)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var a_="AsyncQueue",dc=class{constructor(e=Promise.resolve()){this._E=[],this.oE=!1,this.aE=[],this.uE=null,this.cE=!1,this.lE=!1,this.EE=[],this._r=new Ao(this,"async_queue_retry"),this.hE=()=>{let r=Sh();r&&W(a_,"Visibility state changed to "+r.visibilityState),this._r.Xn()},this.TE=e;let t=Sh();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.hE)}get isShuttingDown(){return this.oE}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.PE(),this.IE(e)}enterRestrictedMode(e){if(!this.oE){this.oE=!0,this.lE=e||!1;let t=Sh();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.hE)}}enqueue(e){if(this.PE(),this.oE)return new Promise((()=>{}));let t=new cn;return this.IE((()=>this.oE&&this.lE?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this._E.push(e),this.RE())))}async RE(){if(this._E.length!==0){try{await this._E[0](),this._E.shift(),this._r.reset()}catch(e){if(!ai(e))throw e;W(a_,"Operation failed with retryable error: "+e)}this._E.length>0&&this._r.Yn((()=>this.RE()))}}IE(e){let t=this.TE.then((()=>(this.cE=!0,e().catch((r=>{throw this.uE=r,this.cE=!1,vn("INTERNAL UNHANDLED ERROR: ",u_(r)),r})).then((r=>(this.cE=!1,r))))));return this.TE=t,t}enqueueAfterDelay(e,t,r){this.PE(),this.EE.indexOf(e)>-1&&(t=0);let s=od.createAndSchedule(this,e,t,r,(i=>this.AE(i)));return this.aE.push(s),s}PE(){this.uE&&Y(47125,{VE:u_(this.uE)})}verifyOperationInProgress(){}async dE(){let e;do e=this.TE,await e;while(e!==this.TE)}fE(e){for(let t of this.aE)if(t.timerId===e)return!0;return!1}mE(e){return this.dE().then((()=>{this.aE.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(let t of this.aE)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.dE()}))}pE(e){this.EE.push(e)}AE(e){let t=this.aE.indexOf(e);this.aE.splice(t,1)}};function u_(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sr=class extends wc{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new dc,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new dc(e),this._firestoreClient=void 0,await e}}};function jd(n,e){let t=typeof n=="object"?n:Bs(),r=typeof n=="string"?n:e||bu,s=dr(t,"firestore").getImmediate({identifier:r});if(!s._initialized){let i=Ia("firestore");i&&rE(s,...i)}return s}function bc(n){if(n._terminated)throw new J(L.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||tb(n),n._firestoreClient}function tb(n){let e=n._freezeSettings(),t=j0(n._databaseId,n._app?.options.appId||"",n._persistenceKey,n._app?.options.apiKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new md(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(s){let i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(n._componentsProvider))}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ii=class extends Ho{constructor(e){super(),this.firestore=e}convertBytes(e){return new Jt(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new Je(this.firestore,null,t)}};/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var wn=class{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}},bn=class n extends Yo{constructor(e,t,r,s,i,o){super(e,t,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new Pr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let r=this._document.data.field($r("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new J(L.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e=this._document,t={};return t.type=n._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}};bn._jsonSchemaVersion="firestore/documentSnapshot/1.0",bn._jsonSchema={type:ke("string",bn._jsonSchemaVersion),bundleSource:ke("string","DocumentSnapshot"),bundleName:ke("string"),bundle:ke("string")};var Pr=class extends bn{data(e={}){return super.data(e)}},Nr=class n{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new wn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){let e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new Pr(this._firestore,this._userDataWriter,r.key,r,new wn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new J(L.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((u=>{je(s._snapshot.query)?Mf(s._snapshot.query):Dd(s.query._query);let c=new Pr(s._firestore,s._userDataWriter,u.doc.key,u.doc,new wn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:c,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>i||u.type!==3)).map((u=>{let c=new Pr(s._firestore,s._userDataWriter,u.doc.key,u.doc,new wn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter),l=-1,B=-1;return u.type!==0&&(l=o.indexOf(u.doc.key),o=o.delete(u.doc.key)),u.type!==1&&(o=o.add(u.doc),B=o.indexOf(u.doc.key)),{type:nb(u.type),doc:c,oldIndex:l,newIndex:B}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new J(L.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e={};e.type=n._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Rs.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}};function nb(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Y(61501,{type:n})}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Nr._jsonSchemaVersion="firestore/querySnapshot/1.0",Nr._jsonSchema={type:ke("string",Nr._jsonSchemaVersion),bundleSource:ke("string","QuerySnapshot"),bundleName:ke("string"),bundle:ke("string")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rb(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new J(L.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ty(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;let s=t;for(let i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var sb={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xo(n,e){if((n=pe(n)).firestore!==e)throw new J(L.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ib=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=iE(e)}get(e){let t=Xo(e,this._firestore),r=new fc(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return Y(24041);let i=s[0];if(i.isFoundDocument())return new Yo(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new Yo(this._firestore,r,t._key,null,t.converter);throw Y(18433,{doc:i})}))}set(e,t,r){let s=Xo(e,this._firestore),i=ey(s.converter,t,r),o=oE(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,o),this}update(e,t,r,...s){let i=Xo(e,this._firestore),o;return o=typeof(t=pe(t))=="string"||t instanceof Kr?uE(this._dataReader,"Transaction.update",i._key,t,r,s):aE(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){let t=Xo(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Kd=class extends ib{constructor(e,t){super(e,t),this._firestore=e}get(e){let t=Xo(e,this._firestore),r=new ii(this._firestore);return super.get(e).then((s=>new bn(this._firestore,r,t._key,s._document,new wn(!1,!1),t.converter)))}};function sy(n,e,t){n=ir(n,sr);let r={...sb,...t};(function(o){if(o.maxAttempts<1)throw new J(L.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);let s=bc(n);return ZE(s,(i=>e(new Kd(n,i))),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iy(n){n=ir(n,Je);let e=ir(n.firestore,sr),t=bc(e);return XE(t,n._key,{source:"server"}).then((r=>ay(e,n,r)))}function oy(n,...e){n=pe(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||ty(e[r])||(t=e[r++]);let s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(ty(e[r])){let l=e[r];e[r]=l.next?.bind(l),e[r+1]=l.error?.bind(l),e[r+2]=l.complete?.bind(l)}let i,o,u;if(n instanceof Je)o=ir(n.firestore,sr),u=Wo(n._key.path),i={next:l=>{e[r]&&e[r](ay(o,n,l))},error:e[r+1],complete:e[r+2]};else{let l=ir(n,bo);o=ir(l.firestore,sr),u=l._query;let B=new ii(o);i={next:d=>{e[r]&&e[r](new Nr(o,B,l,d))},error:e[r+1],complete:e[r+2]},rb(n._query)}let c=bc(o);return YE(c,u,s,i)}function ay(n,e,t){let r=t.docs.get(e._key),s=new ii(n);return new bn(n,s,e._key,r,new wn(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ny="@firebase/firestore",ry="4.19.1";(function(e,t=!0){c_(en),Zt(new gt("firestore",((r,{instanceIdentifier:s,options:i})=>{let o=r.getProvider("app").getImmediate(),u=new sr(new Vu(r.getProvider("auth-internal")),new Uu(o,r.getProvider("app-check-internal")),__(o,s),o);return i={useFetchStreams:t,...i},u._setSettings(i),u}),"PUBLIC").setMultipleInstances(!0)),Ct(ny,ry,e),Ct(ny,ry,"esm2020")})();/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var fy="firebasestorage.googleapis.com",dy="storageBucket",ob=120*1e3,ab=600*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Le=class n extends ht{constructor(e,t,r=0){super(Jd(e),`Firebase Storage: ${t} (${Jd(e)})`),this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,n.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Jd(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}},Ve;(function(n){n.UNKNOWN="unknown",n.OBJECT_NOT_FOUND="object-not-found",n.BUCKET_NOT_FOUND="bucket-not-found",n.PROJECT_NOT_FOUND="project-not-found",n.QUOTA_EXCEEDED="quota-exceeded",n.UNAUTHENTICATED="unauthenticated",n.UNAUTHORIZED="unauthorized",n.UNAUTHORIZED_APP="unauthorized-app",n.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",n.INVALID_CHECKSUM="invalid-checksum",n.CANCELED="canceled",n.INVALID_EVENT_NAME="invalid-event-name",n.INVALID_URL="invalid-url",n.INVALID_DEFAULT_BUCKET="invalid-default-bucket",n.NO_DEFAULT_BUCKET="no-default-bucket",n.CANNOT_SLICE_BLOB="cannot-slice-blob",n.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",n.NO_DOWNLOAD_URL="no-download-url",n.INVALID_ARGUMENT="invalid-argument",n.INVALID_ARGUMENT_COUNT="invalid-argument-count",n.APP_DELETED="app-deleted",n.INVALID_ROOT_OPERATION="invalid-root-operation",n.INVALID_FORMAT="invalid-format",n.INTERNAL_ERROR="internal-error",n.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Ve||(Ve={}));function Jd(n){return"storage/"+n}function Xd(){let n="An unknown error occurred, please check the error payload for server response.";return new Le(Ve.UNKNOWN,n)}function ub(n){return new Le(Ve.OBJECT_NOT_FOUND,"Object '"+n+"' does not exist.")}function cb(n){return new Le(Ve.QUOTA_EXCEEDED,"Quota for bucket '"+n+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function lb(){let n="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new Le(Ve.UNAUTHENTICATED,n)}function hb(){return new Le(Ve.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function Bb(n){return new Le(Ve.UNAUTHORIZED,"User does not have permission to access '"+n+"'.")}function fb(){return new Le(Ve.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function db(){return new Le(Ve.CANCELED,"User canceled the upload/download.")}function pb(n){return new Le(Ve.INVALID_URL,"Invalid URL '"+n+"'.")}function gb(n){return new Le(Ve.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+n+"'.")}function Cb(){return new Le(Ve.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+dy+"' property when initializing the app?")}function mb(){return new Le(Ve.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function _b(n){return new Le(Ve.UNSUPPORTED_ENVIRONMENT,`${n} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function zd(n){return new Le(Ve.INVALID_ARGUMENT,n)}function py(){return new Le(Ve.APP_DELETED,"The Firebase app was deleted.")}function Eb(n){return new Le(Ve.INVALID_ROOT_OPERATION,"The operation '"+n+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function ea(n,e){return new Le(Ve.INVALID_FORMAT,"String does not match format '"+n+"': "+e)}function Zo(n){throw new Le(Ve.INTERNAL_ERROR,"Internal error: "+n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Wt=class n{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){let e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let r;try{r=n.makeFromUrl(e,t)}catch{return new n(e,"")}if(r.path==="")return r;throw gb(e)}static makeFromUrl(e,t){let r=null,s="([A-Za-z0-9.\\-_]+)";function i(ue){ue.path.charAt(ue.path.length-1)==="/"&&(ue.path_=ue.path_.slice(0,-1))}let o="(/(.*))?$",u=new RegExp("^gs://"+s+o,"i"),c={bucket:1,path:3};function l(ue){ue.path_=decodeURIComponent(ue.path)}let B="v[A-Za-z0-9_]+",d=t.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",w=new RegExp(`^https?://${d}/${B}/b/${s}/o${g}`,"i"),D={bucket:1,path:3},P=t===fy?"(?:storage.googleapis.com|storage.cloud.google.com)":t,V="([^?#]*)",j=new RegExp(`^https?://${P}/${s}/${V}`,"i"),re=[{regex:u,indices:c,postModify:i},{regex:w,indices:D,postModify:l},{regex:j,indices:{bucket:1,path:2},postModify:l}];for(let ue=0;ue<re.length;ue++){let Oe=re[ue],Ee=Oe.regex.exec(e);if(Ee){let A=Ee[Oe.indices.bucket],_=Ee[Oe.indices.path];_||(_=""),r=new n(A,_),Oe.postModify(r);break}}if(r==null)throw pb(e);return r}},Wd=class{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yb(n,e,t){let r=1,s=null,i=null,o=!1,u=0;function c(){return u===2}let l=!1;function B(...V){l||(l=!0,e.apply(null,V))}function d(V){s=setTimeout(()=>{s=null,n(w,c())},V)}function g(){i&&clearTimeout(i)}function w(V,...j){if(l){g();return}if(V){g(),B.call(null,V,...j);return}if(c()||o){g(),B.call(null,V,...j);return}r<64&&(r*=2);let re;u===1?(u=2,re=0):re=(r+Math.random())*1e3,d(re)}let D=!1;function P(V){D||(D=!0,g(),!l&&(s!==null?(V||(u=2),clearTimeout(s),d(0)):V||(u=1)))}return d(0),i=setTimeout(()=>{o=!0,P(!0)},t),P}function wb(n){n(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ib(n){return n!==void 0}function Db(n){return typeof n=="object"&&!Array.isArray(n)}function gy(n){return typeof n=="string"||n instanceof String}function uy(n){return Zd()&&n instanceof Blob}function Zd(){return typeof Blob<"u"}function cy(n,e,t,r){if(r<e)throw zd(`Invalid value for '${n}'. Expected ${e} or greater.`);if(r>t)throw zd(`Invalid value for '${n}'. Expected ${t} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ep(n,e,t){let r=e;return t==null&&(r=`https://${e}`),`${t}://${r}/v0${n}`}function Tb(n){let e=encodeURIComponent,t="?";for(let r in n)if(n.hasOwnProperty(r)){let s=e(r)+"="+e(n[r]);t=t+s+"&"}return t=t.slice(0,-1),t}var rs;(function(n){n[n.NO_ERROR=0]="NO_ERROR",n[n.NETWORK_ERROR=1]="NETWORK_ERROR",n[n.ABORT=2]="ABORT"})(rs||(rs={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ab(n,e){let t=n>=500&&n<600,s=[408,429].indexOf(n)!==-1,i=e.indexOf(n)!==-1;return t||s||i}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Qd=class{constructor(e,t,r,s,i,o,u,c,l,B,d,g=!0,w=!1){this.url_=e,this.method_=t,this.headers_=r,this.body_=s,this.successCodes_=i,this.additionalRetryCodes_=o,this.callback_=u,this.errorCallback_=c,this.timeout_=l,this.progressCallback_=B,this.connectionFactory_=d,this.retry=g,this.isUsingEmulator=w,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((D,P)=>{this.resolve_=D,this.reject_=P,this.start_()})}start_(){let e=(r,s)=>{if(s){r(!1,new ci(!1,null,!0));return}let i=this.connectionFactory_();this.pendingConnection_=i;let o=u=>{let c=u.loaded,l=u.lengthComputable?u.total:-1;this.progressCallback_!==null&&this.progressCallback_(c,l)};this.progressCallback_!==null&&i.addUploadProgressListener(o),i.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&i.removeUploadProgressListener(o),this.pendingConnection_=null;let u=i.getErrorCode()===rs.NO_ERROR,c=i.getStatus();if(!u||Ab(c,this.additionalRetryCodes_)&&this.retry){let B=i.getErrorCode()===rs.ABORT;r(!1,new ci(!1,null,B));return}let l=this.successCodes_.indexOf(c)!==-1;r(!0,new ci(l,i))})},t=(r,s)=>{let i=this.resolve_,o=this.reject_,u=s.connection;if(s.wasSuccessCode)try{let c=this.callback_(u,u.getResponse());Ib(c)?i(c):i()}catch(c){o(c)}else if(u!==null){let c=Xd();c.serverResponse=u.getErrorText(),this.errorCallback_?o(this.errorCallback_(u,c)):o(c)}else if(s.canceled){let c=this.appDelete_?py():db();o(c)}else{let c=fb();o(c)}};this.canceled_?t(!1,new ci(!1,null,!0)):this.backoffId_=yb(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&wb(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}},ci=class{constructor(e,t,r){this.wasSuccessCode=e,this.connection=t,this.canceled=!!r}};function bb(n,e){e!==null&&e.length>0&&(n.Authorization="Firebase "+e)}function vb(n,e){n["X-Firebase-Storage-Version"]="webjs/"+(e??"AppManager")}function Rb(n,e){e&&(n["X-Firebase-GMPID"]=e)}function Sb(n,e){e!==null&&(n["X-Firebase-AppCheck"]=e)}function Pb(n,e,t,r,s,i,o=!0,u=!1){let c=Tb(n.urlParams),l=n.url+c,B=Object.assign({},n.headers);return Rb(B,e),bb(B,t),vb(B,i),Sb(B,r),new Qd(l,n.method,B,n.body,n.successCodes,n.additionalRetryCodes,n.handler,n.errorHandler,n.timeout,n.progressCallback,s,o,u)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nb(){return typeof BlobBuilder<"u"?BlobBuilder:typeof WebKitBlobBuilder<"u"?WebKitBlobBuilder:void 0}function Ob(...n){let e=Nb();if(e!==void 0){let t=new e;for(let r=0;r<n.length;r++)t.append(n[r]);return t.getBlob()}else{if(Zd())return new Blob(n);throw new Le(Ve.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function xb(n,e,t){return n.webkitSlice?n.webkitSlice(e,t):n.mozSlice?n.mozSlice(e,t):n.slice?n.slice(e,t):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fb(n){if(typeof atob>"u")throw _b("base-64");return atob(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var hn={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"},ta=class{constructor(e,t){this.data=e,this.contentType=t||null}};function kb(n,e){switch(n){case hn.RAW:return new ta(Cy(e));case hn.BASE64:case hn.BASE64URL:return new ta(my(n,e));case hn.DATA_URL:return new ta(Vb(e),Mb(e))}throw Xd()}function Cy(n){let e=[];for(let t=0;t<n.length;t++){let r=n.charCodeAt(t);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)===55296)if(!(t<n.length-1&&(n.charCodeAt(t+1)&64512)===56320))e.push(239,191,189);else{let i=r,o=n.charCodeAt(++t);r=65536|(i&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)===56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function Lb(n){let e;try{e=decodeURIComponent(n)}catch{throw ea(hn.DATA_URL,"Malformed data URL.")}return Cy(e)}function my(n,e){switch(n){case hn.BASE64:{let s=e.indexOf("-")!==-1,i=e.indexOf("_")!==-1;if(s||i)throw ea(n,"Invalid character '"+(s?"-":"_")+"' found: is it base64url encoded?");break}case hn.BASE64URL:{let s=e.indexOf("+")!==-1,i=e.indexOf("/")!==-1;if(s||i)throw ea(n,"Invalid character '"+(s?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let t;try{t=Fb(e)}catch(s){throw s.message.includes("polyfill")?s:ea(n,"Invalid character found")}let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}var Rc=class{constructor(e){this.base64=!1,this.contentType=null;let t=e.match(/^data:([^,]+)?,/);if(t===null)throw ea(hn.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");let r=t[1]||null;r!=null&&(this.base64=Ub(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-7):r),this.rest=e.substring(e.indexOf(",")+1)}};function Vb(n){let e=new Rc(n);return e.base64?my(hn.BASE64,e.rest):Lb(e.rest)}function Mb(n){return new Rc(n).contentType}function Ub(n,e){return n.length>=e.length?n.substring(n.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Sc=class n{constructor(e,t){let r=0,s="";uy(e)?(this.data_=e,r=e.size,s=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=s}size(){return this.size_}type(){return this.type_}slice(e,t){if(uy(this.data_)){let r=this.data_,s=xb(r,e,t);return s===null?null:new n(s)}else{let r=new Uint8Array(this.data_.buffer,e,t-e);return new n(r,!0)}}static getBlob(...e){if(Zd()){let t=e.map(r=>r instanceof n?r.data_:r);return new n(Ob.apply(null,t))}else{let t=e.map(o=>gy(o)?kb(hn.RAW,o).data:o.data_),r=0;t.forEach(o=>{r+=o.byteLength});let s=new Uint8Array(r),i=0;return t.forEach(o=>{for(let u=0;u<o.length;u++)s[i++]=o[u]}),new n(s,!0)}}uploadData(){return this.data_}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gb(n){let e;try{e=JSON.parse(n)}catch{return null}return Db(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hb(n){if(n.length===0)return null;let e=n.lastIndexOf("/");return e===-1?"":n.slice(0,e)}function qb(n,e){let t=e.split("/").filter(r=>r.length>0).join("/");return n.length===0?t:n+"/"+t}function _y(n){let e=n.lastIndexOf("/",n.length-2);return e===-1?n:n.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jb(n,e){return e}var rt=class{constructor(e,t,r,s){this.server=e,this.local=t||e,this.writable=!!r,this.xform=s||jb}},vc=null;function Kb(n){return!gy(n)||n.length<2?n:_y(n)}function Ey(){if(vc)return vc;let n=[];n.push(new rt("bucket")),n.push(new rt("generation")),n.push(new rt("metageneration")),n.push(new rt("name","fullPath",!0));function e(i,o){return Kb(o)}let t=new rt("name");t.xform=e,n.push(t);function r(i,o){return o!==void 0?Number(o):o}let s=new rt("size");return s.xform=r,n.push(s),n.push(new rt("timeCreated")),n.push(new rt("updated")),n.push(new rt("md5Hash",null,!0)),n.push(new rt("cacheControl",null,!0)),n.push(new rt("contentDisposition",null,!0)),n.push(new rt("contentEncoding",null,!0)),n.push(new rt("contentLanguage",null,!0)),n.push(new rt("contentType",null,!0)),n.push(new rt("metadata","customMetadata",!0)),vc=n,vc}function Jb(n,e){function t(){let r=n.bucket,s=n.fullPath,i=new Wt(r,s);return e._makeStorageReference(i)}Object.defineProperty(n,"ref",{get:t})}function zb(n,e,t){let r={};r.type="file";let s=t.length;for(let i=0;i<s;i++){let o=t[i];r[o.local]=o.xform(r,e[o.server])}return Jb(r,n),r}function Wb(n,e,t){let r=Gb(e);return r===null?null:zb(n,r,t)}function Qb(n,e){let t={},r=e.length;for(let s=0;s<r;s++){let i=e[s];i.writable&&(t[i.server]=n[i.local])}return JSON.stringify(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var na=class{constructor(e,t,r,s){this.url=e,this.method=t,this.handler=r,this.timeout=s,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $b(n){if(!n)throw Xd()}function yy(n,e){function t(r,s){let i=Wb(n,s,e);return $b(i!==null),i}return t}function wy(n){function e(t,r){let s;return t.getStatus()===401?t.getErrorText().includes("Firebase App Check token is invalid")?s=hb():s=lb():t.getStatus()===402?s=cb(n.bucket):t.getStatus()===403?s=Bb(n.path):s=r,s.status=t.getStatus(),s.serverResponse=r.serverResponse,s}return e}function Iy(n){let e=wy(n);function t(r,s){let i=e(r,s);return r.getStatus()===404&&(i=ub(n.path)),i.serverResponse=s.serverResponse,i}return t}function Yb(n,e,t){let r=e.fullServerUrl(),s=ep(r,n.host,n._protocol),i="GET",o=n.maxOperationRetryTime,u=new na(s,i,yy(n,t),o);return u.errorHandler=Iy(e),u}function Xb(n,e,t){let r=e.fullServerUrl(),s=ep(r,n.host,n._protocol)+"?alt=media",i="GET",o=n.maxOperationRetryTime,u=new na(s,i,(c,l)=>l,o);return u.errorHandler=Iy(e),t!==void 0&&(u.headers.Range=`bytes=0-${t}`,u.successCodes=[200,206]),u}function Zb(n,e){return n&&n.contentType||e&&e.type()||"application/octet-stream"}function ev(n,e,t){let r=Object.assign({},t);return r.fullPath=n.path,r.size=e.size(),r.contentType||(r.contentType=Zb(null,e)),r}function tv(n,e,t,r,s){let i=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function u(){let re="";for(let ue=0;ue<2;ue++)re=re+Math.random().toString().slice(2);return re}let c=u();o["Content-Type"]="multipart/related; boundary="+c;let l=ev(e,r,s),B=Qb(l,t),d="--"+c+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+B+`\r
--`+c+`\r
Content-Type: `+l.contentType+`\r
\r
`,g=`\r
--`+c+"--",w=Sc.getBlob(d,r,g);if(w===null)throw mb();let D={name:l.fullPath},P=ep(i,n.host,n._protocol),V="POST",j=n.maxUploadRetryTime,Q=new na(P,V,yy(n,t),j);return Q.urlParams=D,Q.headers=o,Q.body=w.uploadData(),Q.errorHandler=wy(e),Q}var dN=256*1024;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pc=class{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=rs.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=rs.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=rs.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,t,r,s,i){if(this.sent_)throw Zo("cannot .send() more than once");if(Yt(e)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),i!==void 0)for(let o in i)i.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,i[o].toString());return s!==void 0?this.xhr_.send(s):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Zo("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Zo("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Zo("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Zo("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}},$d=class extends Pc{initXhr(){this.xhr_.responseType="text"}};function Dy(){return new $d}var Yd=class extends Pc{initXhr(){this.xhr_.responseType="blob"}};function nv(){return new Yd}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var li=class n{constructor(e,t){this._service=e,t instanceof Wt?this._location=t:this._location=Wt.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new n(e,t)}get root(){let e=new Wt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return _y(this._location.path)}get storage(){return this._service}get parent(){let e=Hb(this._location.path);if(e===null)return null;let t=new Wt(this._location.bucket,e);return new n(this._service,t)}_throwIfRoot(e){if(this._location.path==="")throw Eb(e)}};function rv(n,e){n._throwIfRoot("getBlob");let t=Xb(n.storage,n._location,e);return n.storage.makeRequestWithTokens(t,nv).then(r=>e!==void 0?r.slice(0,e):r)}function sv(n,e,t){n._throwIfRoot("uploadBytes");let r=tv(n.storage,n._location,Ey(),new Sc(e,!0),t);return n.storage.makeRequestWithTokens(r,Dy).then(s=>({metadata:s,ref:n}))}function iv(n){n._throwIfRoot("getMetadata");let e=Yb(n.storage,n._location,Ey());return n.storage.makeRequestWithTokens(e,Dy)}function ov(n,e){let t=qb(n._location.path,e),r=new Wt(n._location.bucket,t);return new li(n.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function av(n){return/^[A-Za-z]+:\/\//.test(n)}function uv(n,e){return new li(n,e)}function Ty(n,e){if(n instanceof ra){let t=n;if(t._bucket==null)throw Cb();let r=new li(t,t._bucket);return e!=null?Ty(r,e):r}else return e!==void 0?ov(n,e):n}function cv(n,e){if(e&&av(e)){if(n instanceof ra)return uv(n,e);throw zd("To use ref(service, url), the first argument must be a Storage instance.")}else return Ty(n,e)}function ly(n,e){let t=e?.[dy];return t==null?null:Wt.makeFromBucketSpec(t,n)}function lv(n,e,t,r={}){n.host=`${e}:${t}`;let s=Yt(e);s&&hs(`https://${n.host}/b`).catch(()=>{}),n._isUsingEmulator=!0,n._protocol=s?"https":"http";let{mockUserToken:i}=r;i&&(n._overrideAuthToken=typeof i=="string"?i:Da(i,n.app.options.projectId))}var ra=class{constructor(e,t,r,s,i,o=!1){this.app=e,this._authProvider=t,this._appCheckProvider=r,this._url=s,this._firebaseVersion=i,this._isUsingEmulator=o,this._bucket=null,this._host=fy,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=ob,this._maxUploadRetryTime=ab,this._requests=new Set,s!=null?this._bucket=Wt.makeFromBucketSpec(s,this._host):this._bucket=ly(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=Wt.makeFromBucketSpec(this._url,e):this._bucket=ly(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){cy("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){cy("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;let e=this._authProvider.getImmediate({optional:!0});if(e){let t=await e.getToken();if(t!==null)return t.accessToken}return null}async _getAppCheckToken(){if(it(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new li(this,e)}_makeRequest(e,t,r,s,i=!0){if(this._deleted)return new Wd(py());{let o=Pb(e,this._appId,r,s,t,this._firebaseVersion,i,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,t){let[r,s]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,r,s).getPromise()}},hy="@firebase/storage",By="0.14.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ay="storage";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function by(n,e,t){return n=pe(n),sv(n,e,t)}function vy(n){return n=pe(n),iv(n)}function Ry(n,e){return n=pe(n),cv(n,e)}function Sy(n=Bs(),e){n=pe(n);let r=dr(n,Ay).getImmediate({identifier:e}),s=Ia("storage");return s&&hv(r,...s),r}function hv(n,e,t,r={}){lv(n,e,t,r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Py(n,e){return n=pe(n),rv(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bv(n,{instanceIdentifier:e}){let t=n.getProvider("app").getImmediate(),r=n.getProvider("auth-internal"),s=n.getProvider("app-check-internal");return new ra(t,r,s,e,en)}function fv(){Zt(new gt(Ay,Bv,"PUBLIC").setMultipleInstances(!0)),Ct(hy,By,""),Ct(hy,By,"esm2020")}fv();return gw(dv);})();
