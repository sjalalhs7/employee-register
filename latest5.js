
/* =====================================================================
   FIREBASE SETUP — do this once, then this section never needs editing.

   1. Go to https://console.firebase.google.com → Add project (free).
   2. In the project: Build → Authentication → Get started → enable
      the "Google" sign-in provider.
   3. Build → Firestore Database → Create database → start in
      "production mode" (we paste real security rules below).
   4. Project settings (gear icon) → General → "Your apps" → Add app → Web (</>) 
      → register it → copy the firebaseConfig object it shows you → paste
      it below, replacing the placeholder object.
   5. In Firestore → Rules tab, paste the rules from FIRESTORE_RULES.txt
      (provided alongside this file) and click Publish.
   6. Host this HTML file somewhere with a fixed address — Firebase Hosting
      is easiest and free (Build → Hosting → follow the steps; it deploys
      this exact file). Google Sign-In will only work on a real http(s)
      address, not when the file is just double-clicked on your computer.
   7. In Authentication → Settings → Authorized domains, make sure the
      domain you host on is listed (Firebase Hosting adds it automatically).
   8. Open the hosted page, sign in with YOUR Gmail — you'll land on the
      "Not authorized yet" screen. Go into the Firestore Database console,
      open the `authorizedUsers` collection, and manually add one document
      for yourself with id = your email (lowercase), fields:
        role: "parent"
      Reload the page — you're now the Parent/Admin and can add every
      other client/location's Gmail from the in-app "Admin: Access" tab.
   ===================================================================== */
const firebaseConfig = {
  // PASTE YOUR FIREBASE CONFIG HERE (from Firebase console → Project settings → Your apps)
  apiKey: "AIzaSyDJZ4AlqJ5Z7E2naih5rgwD_8OzD2Z7qLY",
  authDomain: "msm-security-guards-database.firebaseapp.com",
  projectId: "msm-security-guards-database",
  storageBucket: "msm-security-guards-database.firebasestorage.app",
  messagingSenderId: "570088336872",
  appId: "1:570088336872:web:bc0311d74dc419bc9b085d"
};

const FIREBASE_READY = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth, db, currentUser = null, currentAccess = null; // currentAccess = {role:'parent'|'client', clientproject?}
let recordsUnsub = null, adminUsersUnsub = null, auditUnsub = null;

function showOnly(id){
  ['setupGate','loginGate','notAuthorizedGate','appRoot'].forEach(g=>{
    document.getElementById(g).style.display = (g===id) ? (g==='appRoot' ? 'block' : '') : 'none';
  });
  const portal=document.getElementById('sectorPortal');
  if(portal) portal.style.display=(id==='appRoot')?'block':'none';
}

function initFirebase(){
  if(!FIREBASE_READY){ showOnly('setupGate'); return; }
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
    if(recordsUnsub){ recordsUnsub(); recordsUnsub=null; }
    if(adminUsersUnsub){ adminUsersUnsub(); adminUsersUnsub=null; }
    if(auditUnsub){ auditUnsub(); auditUnsub=null; }
    if(companySettingsUnsub){ try{companySettingsUnsub();}catch(e){} companySettingsUnsub=null; }
    if(!user){ currentUser=null; currentAccess=null; const seo=document.getElementById('publicSeoInfo'); if(seo) seo.style.display='none'; showOnly('loginGate'); return; }
    currentUser = user;
    const email = (user.email||'').toLowerCase();
    try{
      const doc = await db.collection('authorizedUsers').doc(email).get();
      if(!doc.exists){
        document.getElementById('notAuthorizedEmail').textContent = email;
        const seo=document.getElementById('publicSeoInfo'); if(seo) seo.style.display='block';
        showOnly('notAuthorizedGate');
        return;
      }
      currentAccess = doc.data(); // {role, clientproject}
      showOnly('appRoot');
      startApp();
      writeAuditLog('SIGN_IN', '', {email, method:'Google Sign-In'});
    }catch(err){
      console.error(err);
      document.getElementById('notAuthorizedEmail').textContent = email + ' — error checking access: ' + err.message;
      showOnly('notAuthorizedGate');
    }
  });
}

function togglePasswordLogin(){
  const box=document.getElementById('passwordLoginBox');
  const btn=document.getElementById('passwordLoginToggle');
  const show=box && box.style.display==='none';
  if(box) box.style.display=show?'block':'none';
  if(btn) btn.textContent=show?'Use Google / Gmail instead':'Use Email & Password instead';
}
function showLoginError(message){
  const el=document.getElementById('msmLoginError');
  if(!el) return;
  el.textContent=message;
  el.style.display='block';
}
function doGoogleSignIn(){
  const provider = new firebase.auth.GoogleAuthProvider();
  document.getElementById('msmLoginError').style.display='none';
  auth.signInWithPopup(provider).catch(err=>showLoginError('Google sign-in failed: ' + err.message));
}
function doPasswordSignIn(){
  const email=(document.getElementById('loginEmail')?.value||'').trim().toLowerCase();
  const password=document.getElementById('loginPassword')?.value||'';
  if(!email || !password){ showLoginError('Enter your authorized email and password.'); return; }
  document.getElementById('msmLoginError').style.display='none';
  auth.signInWithEmailAndPassword(email,password).catch(err=>showLoginError('Password sign-in failed: ' + err.message));
}
function sendPasswordReset(){
  const email=(document.getElementById('loginEmail')?.value||'').trim().toLowerCase();
  if(!email){ showLoginError('Enter the authorized email first.'); return; }
  auth.sendPasswordResetEmail(email)
    .then(()=>showLoginError('Password reset email sent if this email has a Firebase Authentication account.'))
    .catch(err=>showLoginError('Could not send reset email: ' + err.message));
}
function doSignOut(){
  auth.signOut();
}

initFirebase();

/* ===================== Column model (matches Long_roll_Format.xlsx sheet1 exactly) ===================== */
const COLUMNS = [
  {key:'sno', label:'S No'},
  {key:'msmno', label:'MSM No.'},
  {key:'doe', label:'D.O.E'},
  {key:'dischargemsm', label:'Discharge Date MSM'},
  {key:'cashreliever', label:'Cash / Reliver'},
  {key:'uniformdate', label:'Uniform Last Date of issue'},
  {key:'newold', label:'New / Old'},
  {key:'employmentStatus', label:'Employment Status'},
  {key:'supervisor', label:'Supervisor'},
  {key:'clientproject', label:'Client/Project'},
  {key:'location', label:'Location'},
  {key:'name', label:'Employee Name'},
  {key:'father', label:'Father Name'},
  {key:'cnic', label:'CNIC No.'},
  {key:'cnicexpiry', label:'CNIC Expiry Date'},
  {key:'armycivil', label:'Army / Civil'},
  {key:'dob', label:'D.O.B'},
  {key:'permaddr', label:'Permanent Address'},
  {key:'armyno', label:'CNIC/Army'},
  {key:'photo', label:'Photo'},
  {key:'policeverif', label:'Police Verification'},
  {key:'specialbranch', label:'Special Branch Form'},
  {key:'apsaa', label:'APSAA Training'},
  {key:'cell', label:'Contact Number'},
  {key:'education', label:'Education'},
  {key:'nokname', label:'Next of kin Name'},
  {key:'nokcontact', label:'Next of kin Contact number'},
  {key:'iban', label:'IBAN'},
  {key:'bank', label:'Bank Name'},
  {key:'actitle', label:'Account Title'},
  {key:'remarks', label:'Remarks'},
];

/* extra fields captured on the enrollment form that aren't long-roll columns
   but are worth keeping with the record (available in the exported sheet's
   hidden columns if you want them, and kept in local storage) */
const EXTRA_KEYS = ['co','mother','domicile','education2','blood','height','marital','children',
  'cnicissue','unitrank','enrolldate','dischargedate_army','homecell','policestation',
  'curraddr','joining','deployloc','acno','branchname','branchcode'];

/* ===================== Storage (Firestore, shared across authorized Gmail accounts) ===================== */
const RECORDS_COLLECTION = 'records';
const AUTHUSERS_COLLECTION = 'authorizedUsers';
const AUDIT_COLLECTION = 'auditLogs';
const TRANSFER_HISTORY_COLLECTION = 'transferHistory';
const COMPANY_SETTINGS_COLLECTION = 'companySettings';
const COMPANY_SETTINGS_DOC = 'main';
let companySettingsUnsub = null;
window.msmCompanySettings = {
  companyName:'MSM Security Guards (Pvt) Ltd',
  tagline:'Professional Security Nationwide Protection',
  address:'House No. 36-E, Cricketer Colony, Near NETSOL Technologies, Airport Road, Lahore.',
  phone1:'0423-7169344', phone2:'0301-1010959', email:'msmsecurity11@gmail.com',
  hours:'Mon – Sat : 09:00 AM to 06:00 PM', website:'https://msmsecurityguards.com/',
  regionalOffices:[
    {region:'North Region',office:'Office No 5, 1st Floor, 20-B Block, Kashif Blair Plaza, G-8, Islamabad',phone:'051-2340294'},
    {region:'Rawalpindi Region',office:'Plot No. I.89, 4th Floor, Iqbal Plaza, Alam Khan Road, Committee Chowk Near College Road, Rawalpindi.',phone:''},
    {region:'Faisalabad Region',office:'House No. 4w8, Madina Town, Faisalabad',phone:''},
    {region:'Multan Region',office:'Old Shujabad Road Near 21 No Chungi Gangla Chowk Niaz Town Multan',phone:''},
    {region:'South Region',office:'Flat No 5-C, 3rd Floor, Carlton Court, Plot No. 52, Near Hascol Pump, Korangi Road, Karachi',phone:'021-35386648'}
  ]
};
let transferHistoryUnsub = null;
window.transferHistory = [];
const META_KEY = 'longRollRegister_branding_v1'; // UI-only preference; ALL employee records remain in shared Firestore
let records = [];
let editingId = null;

function safeLoad(key, fallback){
  try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }
  catch(e){ return fallback; }
}
function safeSave(key, value){
  try{ localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch(e){ return false; }
}
function normalizeCompanySettings(raw){
  const x=raw||{};
  const base=window.msmCompanySettings||{};
  let regionalOffices=Array.isArray(x.regionalOffices)?x.regionalOffices:base.regionalOffices;
  regionalOffices=regionalOffices.map(o=>({region:String(o?.region||'').trim(),office:String(o?.office||'').trim(),phone:String(o?.phone||'').trim()})).filter(o=>o.region||o.office);
  return {...base,...x,regionalOffices};
}
function renderCompanySettingsForm(){
  const x=window.msmCompanySettings||{};
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v??'';};
  set('cs_companyName',x.companyName);set('cs_tagline',x.tagline);set('cs_address',x.address);set('cs_phone1',x.phone1);set('cs_phone2',x.phone2);set('cs_email',x.email);set('cs_hours',x.hours);set('cs_website',x.website);
  set('cs_regions',(x.regionalOffices||[]).map(o=>[o.region,o.office,o.phone].join(' | ')).join('\n'));
}
async function msmLoadCompanySettings(force=false){
  if(!db||!currentAccess)return;
  try{
    const snap=await db.collection(COMPANY_SETTINGS_COLLECTION).doc(COMPANY_SETTINGS_DOC).get();
    if(snap.exists){window.msmCompanySettings=normalizeCompanySettings(snap.data());}
    else if(isParent()){
      await db.collection(COMPANY_SETTINGS_COLLECTION).doc(COMPANY_SETTINGS_DOC).set({...window.msmCompanySettings,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:(currentUser?.email||'').toLowerCase()},{merge:true});
    }
    renderCompanySettingsForm();
    window.msmRenderTopMenu?.();
  }catch(e){console.warn('Company settings load failed:',e.message);}
}
async function msmSubscribeCompanySettings(){
  if(!db||!currentAccess)return;
  if(companySettingsUnsub){try{companySettingsUnsub();}catch(e){}}
  companySettingsUnsub=db.collection(COMPANY_SETTINGS_COLLECTION).doc(COMPANY_SETTINGS_DOC).onSnapshot(s=>{
    if(s.exists){window.msmCompanySettings=normalizeCompanySettings(s.data());renderCompanySettingsForm();window.msmRenderTopMenu?.();}
  },e=>console.warn('Company settings subscription:',e.message));
}
async function msmSaveCompanySettings(){
  if(!isParent())return showToast('Parent/Admin access is required.');
  const g=id=>String(document.getElementById(id)?.value||'').trim();
  const regionalOffices=g('cs_regions').split(/\r?\n/).map(line=>line.split('|').map(x=>x.trim())).filter(a=>a.some(Boolean)).map(a=>({region:a[0]||'',office:a[1]||'',phone:a[2]||''})).filter(o=>o.region||o.office);
  const payload={companyName:g('cs_companyName')||window.msmCompanySettings.companyName,tagline:g('cs_tagline'),address:g('cs_address'),phone1:g('cs_phone1'),phone2:g('cs_phone2'),email:g('cs_email'),hours:g('cs_hours'),website:g('cs_website'),regionalOffices,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:(currentUser?.email||'').toLowerCase()};
  try{await db.collection(COMPANY_SETTINGS_COLLECTION).doc(COMPANY_SETTINGS_DOC).set(payload,{merge:true});await writeAuditLog('UPDATE_COMPANY_SETTINGS','companySettings/main',{companyName:payload.companyName,address:payload.address});showToast('Company settings saved to shared cloud database.');}
  catch(e){showToast('Could not save company settings: '+(e.message||e));}
}
function companyInfoBody(){
  const x=window.msmCompanySettings||{};
  const offices=(x.regionalOffices||[]).map(o=>`${o.region}: ${o.office}${o.phone?' — '+o.phone:''}`).join('\n');
  return `${x.companyName||'MSM Security Guards'}\n${x.tagline||''}\n\nHead Office: ${x.address||'—'}\nPhone: ${[x.phone1,x.phone2].filter(Boolean).join(' | ')}\nEmail: ${x.email||'—'}\nHours: ${x.hours||'—'}\n\nRegional Offices:\n${offices||'—'}`;
}

function persistMeta(){
  safeSave(META_KEY, { companyName: document.getElementById('companyName').value });
}
document.getElementById('companyName').addEventListener('change', persistMeta);

/* isParent() = full visibility across every client/location.
   For a 'client' role user, every record they can see/write is locked to their own clientproject. */
function isParent(){ const role=String(currentAccess?.role||'').trim().toLowerCase(); return role==='parent' || role==='admin'; }
function myClientProject(){ return currentAccess ? (currentAccess.clientproject||'') : ''; }
function mySector(){ return currentAccess ? String(currentAccess.sector||'').trim() : ''; }
function msmCanonicalSector(v){
  const n=String(v||'').trim().toLowerCase();
  if(n.includes('islamabad')) return 'Islamabad';
  if(n.includes('rawalpindi')) return 'Rawalpindi';
  if(n==='kpk'||n.includes('khyber')) return 'KPK';
  if(n) return 'Other';
  return '';
}


/* ===================== Sector-branded post-login portal ===================== */
function normalizeSectorName(v){ return String(v||'').trim().replace(/\s+/g,' '); }
function sectorThemeFor(name){
  const n=normalizeSectorName(name).toLowerCase();
  if(n.includes('rawalpindi')) return 'rawalpindi';
  if(n.includes('islamabad')) return 'islamabad';
  if(n.includes('lahore')) return 'lahore';
  if(n.includes('karachi')) return 'karachi';
  return 'other';
}
function updateSectorPortal(){
  const portal=document.getElementById('sectorPortal');
  if(!portal || !currentAccess) return;
  const parent=isParent();
  const sector=parent ? 'MSM HEAD OFFICE / PARENT CONTROL CENTER' : (normalizeSectorName(mySector() || myClientProject()) || 'AUTHORIZED SECTOR');
  const theme=parent ? 'other' : sectorThemeFor(sector);
  document.body.classList.remove('sector-rawalpindi','sector-islamabad','sector-lahore','sector-karachi','sector-other');
  document.body.classList.add('sector-'+theme);
  portal.style.display='block';
  const title=document.getElementById('sectorPortalTitle');
  const sub=document.getElementById('sectorPortalSubtitle');
  const badge=document.getElementById('sectorPortalBadge');
  if(title) title.textContent=parent ? 'MSM SECURITY COMPANY' : sector.toUpperCase();
  if(sub) sub.textContent=parent ? 'WELCOME TO THE MSM LONGROLL DATABASE · PARENT MASTER ACCESS' : 'WELCOME TO THE MSM LONGROLL DATABASE';
  if(badge) badge.textContent=parent ? 'Parent Master Access · All Clients / Sectors' : 'Authorized Access · '+sector;
   const pc=document.getElementById('sectorPortalClient'); if(pc) pc.textContent=parent ? 'All Clients / Sectors' : sector;
   const pr=document.getElementById('sectorPortalRecordCount'); if(pr) pr.textContent=String(records?.length||0);
  const tick=()=>{
    const now=new Date();
    const date=document.getElementById('sectorDate'), time=document.getElementById('sectorTime');
    if(date) date.textContent='DATE: '+now.toLocaleDateString('en-PK',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
    if(time) time.textContent='TIME: '+now.toLocaleTimeString('en-PK',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true})+' PKT';
  };
  tick();
  clearInterval(window.sectorPortalClock); window.sectorPortalClock=setInterval(tick,1000);
}

function startApp(){
  updateSectorPortal();
  const seo=document.getElementById('publicSeoInfo'); if(seo) seo.style.display='none';
  editingId = null;
  const meta = safeLoad(META_KEY, {});
  if(meta.companyName) document.getElementById('companyName').value = meta.companyName;

  document.getElementById('userBadge').textContent = `${currentUser.email} · ${isParent()?'Parent (all data)':('Client: '+myClientProject()+(mySector()?' · Sector: '+mySector():''))}`;
  document.getElementById('adminTabBtn').style.display = isParent() ? '' : 'none';
  document.getElementById('auditTabBtn').style.display = isParent() ? '' : 'none';
  const importBtn=document.getElementById('importLongRollBtn'); if(importBtn) importBtn.style.display='inline-flex';

  if(!isParent()){
    // Lock the top Client/Project field for client-role users so every entry they create stays theirs.
    const clientNameEl = document.getElementById('clientName');
    clientNameEl.value = myClientProject();
    clientNameEl.readOnly = true;
    const f_clientproject = document.getElementById('f_clientproject');
    f_clientproject.value = myClientProject();
    f_clientproject.readOnly = true;
  }

  subscribeRecords();
  if(isParent()){ subscribeAdminUsers(); subscribeAuditLogs(); subscribeTransferHistory(); }
  msmLoadCompanySettings();
  msmSubscribeCompanySettings();
  resetForm();
  switchTab('form');
  if(typeof msmEnsureUI==='function') msmEnsureUI();
}

function subscribeRecords(){
  if(recordsUnsub) { try{recordsUnsub();}catch(e){} recordsUnsub=null; }
  const applyRows = (rows)=>{
    const map=new Map(); rows.forEach(r=>map.set(r.id,r));
    let merged=[...map.values()];
    if(!isParent()){
      const client=myClientProject(), sector=mySector();
      merged=merged.filter(r=>{
        const rp=String(r.clientproject||'').trim();
        const rs=String(r.sector||'').trim();
        if(sector) return rs===sector || rp===sector || (!rs && rp===client);
        return rp===client;
      });
    }
    records=merged.sort((a,b)=>(Number(a.sno)||0)-(Number(b.sno)||0));
    updateStamp(); updateSectorPortal(); renderTable();
  };
  if(isParent()){
    recordsUnsub=db.collection(RECORDS_COLLECTION).onSnapshot(snap=>applyRows(snap.docs.map(d=>({id:d.id,...d.data()}))),err=>{console.error(err);showToast('Could not load the register: '+err.message);});
    return;
  }
  const client=myClientProject(), sector=mySector();
  let rowsClient=[], rowsSector=[];
  const merge=()=>applyRows([...rowsClient,...rowsSector]);
  const u1=db.collection(RECORDS_COLLECTION).where('clientproject','==',client).onSnapshot(s=>{rowsClient=s.docs.map(d=>({id:d.id,...d.data()}));merge();},e=>{console.error(e);showToast('Could not load client records: '+e.message);});
  const u2=sector ? db.collection(RECORDS_COLLECTION).where('sector','==',sector).onSnapshot(s=>{rowsSector=s.docs.map(d=>({id:d.id,...d.data()}));merge();},e=>{console.warn('Sector query unavailable:',e.message);}) : null;
  recordsUnsub=()=>{try{u1();}catch(e){} try{if(u2)u2();}catch(e){}};
}

/* ===================== Admin: Access (parent role only) ===================== */
function subscribeAdminUsers(){
  adminUsersUnsub = db.collection(AUTHUSERS_COLLECTION).onSnapshot(snap=>{
    const rows = snap.docs.map(d=>({email:d.id, ...d.data()}));
    rows.sort((a,b)=>a.email.localeCompare(b.email));
    document.getElementById('adminUsersTbody').innerHTML = rows.map(r=>`
      <tr>
        <td>${escapeHtml(r.email)}</td>
        <td>${r.role==='parent'?'Parent':'Client / Location'}</td>
        <td>${escapeHtml(r.clientproject||'')}</td>
        <td>${escapeHtml(r.sector||'—')}</td>
        <td class="row-actions">${r.role==='parent'
          ? '<span style="font-size:11px;color:var(--ink-soft);font-weight:600;">Protected Parent</span>'
          : `<button class="btn btn-sm btn-danger" onclick="removeAuthorizedUser('${r.email.replace(/'/g,"\\'")}')">Remove</button>`}</td>
      </tr>`).join('') || `<tr><td colspan="5" style="text-align:center;color:var(--ink-soft);padding:20px;">No one added yet.</td></tr>`;
  });
}

function addAuthorizedUser(){
  if(!isParent()){
    showToast('Only an authorized Parent Gmail account can manage access.');
    return;
  }
  const email = document.getElementById('adm_email').value.trim().toLowerCase();
  const clientproject = document.getElementById('adm_clientproject').value.trim();
  const sector = document.getElementById('adm_sector')?.value.trim() || '';
  if(!email || !email.includes('@')){ showToast('Enter a valid Gmail address.'); return; }
  if(!clientproject){ showToast('Enter the Client / Project name for this location.'); return; }

  // Parent/Admin is deliberately NOT editable from the web UI.
  // It is the protected account created in Firestore during first-time setup.
  const payload = {role:'client', clientproject, sector};
  db.collection(AUTHUSERS_COLLECTION).doc(email).set(payload)
    .then(()=>writeAuditLog('ADD_ACCESS', email, {targetEmail:email, clientproject}))
    .then(()=>{
      showToast(`Added access for ${email}.`);
      document.getElementById('adm_email').value='';
      document.getElementById('adm_clientproject').value=''; if(document.getElementById('adm_sector')) document.getElementById('adm_sector').value='';
    })
    .catch(err=>showToast('Could not add: ' + err.message));
}
async function removeAuthorizedUser(email){
  if(!isParent() || !currentUser){
    showToast('Only an authorized Parent Gmail account can manage access.');
    return;
  }
  const targetEmail=String(email||'').trim().toLowerCase();
  try{
    const target=await db.collection(AUTHUSERS_COLLECTION).doc(targetEmail).get();
    if(!target.exists){
      showToast('This Gmail account is already removed.');
      return;
    }
    if(target.data().role==='parent'){
      showToast('Parent/Admin Gmail is protected and cannot be removed here.');
      return;
    }
    if(!confirm(`Remove access for ${targetEmail}?`)) return;
    await db.collection(AUTHUSERS_COLLECTION).doc(targetEmail).delete();
    await writeAuditLog('REMOVE_ACCESS', targetEmail, {targetEmail});
    showToast(`Removed ${targetEmail}.`);
  }catch(err){
    console.error(err);
    showToast('Could not remove: ' + err.message);
  }
}

/* ===================== Tabs ===================== */
function switchTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b.dataset.tab===tab));
  ['form','register','instructions','admin','audit'].forEach(v=>{
    const el=document.getElementById('view-'+v);
    if(el) el.style.display = tab===v ? 'block' : 'none';
  });
  if(tab==='register') renderTable();
  if(tab==='audit'){ renderAuditLogs(); renderTransferHistory(); }
}

/* ===================== Photo / document uploads ===================== */
const uploadState = { photoData: '', policeVerifDoc: '', photoSettings: {scale:1,x:0,y:0} };
let photoEditorState = {scale:1,x:0,y:0};
let photoEditorBase = {scale:1,x:0,y:0};

function updatePhotoPreviewUI(key, previewImgId, emptyId, btnId){
  const val = uploadState[key];
  const img = document.getElementById(previewImgId);
  const empty = document.getElementById(emptyId);
  const btn = document.getElementById(btnId);
  if(!empty.dataset.defaultText) empty.dataset.defaultText = empty.textContent;
  const isImage = val && val.startsWith('data:image');

  img.style.display = isImage ? 'inline-block' : 'none';
  if(isImage) img.src = val;

  if(!val){
    empty.textContent = empty.dataset.defaultText;
    empty.style.display = 'inline';
  } else if(!isImage){
    empty.textContent = 'File attached (PDF).';
    empty.style.display = 'inline';
  } else {
    empty.style.display = 'none';
  }
  btn.style.display = val ? 'inline-flex' : 'none';
  if(key === 'photoData'){
    const adjustBtn = document.getElementById('photoAdjustBtn');
    const autoBtn = document.getElementById('photoAutoBtn');
    if(adjustBtn) adjustBtn.style.display = isImage ? 'inline-flex' : 'none';
    if(autoBtn) autoBtn.style.display = isImage ? 'inline-flex' : 'none';
  }
}

function handlePhotoUpload(inputEl, key, previewImgId){
  const file = inputEl.files && inputEl.files[0];
  if(!file) return;
  const emptyId = previewImgId + 'Empty';
  const btnId = previewImgId.replace('Preview','') + 'ClearBtn';

  if(file.type === 'application/pdf'){
    const reader = new FileReader();
    reader.onload = e => {
      uploadState[key] = e.target.result;
      updatePhotoPreviewUI(key, previewImgId, emptyId, btnId);
      if(e.target.result.length > 900000) showToast('This PDF is quite large — saving may be slow or fail. A smaller file works better.');
    };
    reader.readAsDataURL(file);
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      /*
       * Employee photos are normalized to a true passport portrait ratio (35:45).
       * This prevents a landscape/oversized source image from escaping the
       * enrollment photo box when printed.
       */
      const isEmployeePhoto = key === 'photoData';
      const TARGET_W = isEmployeePhoto ? 350 : 700;
      const TARGET_H = isEmployeePhoto ? 450 : null;

      let sx=0, sy=0, sw=img.naturalWidth, sh=img.naturalHeight;
      if(isEmployeePhoto){
        const targetRatio = TARGET_W / TARGET_H;
        const sourceRatio = sw / sh;
        if(sourceRatio > targetRatio){
          sw = Math.round(sh * targetRatio);
          sx = Math.round((img.naturalWidth - sw) / 2);
        }else{
          sh = Math.round(sw / targetRatio);
          sy = Math.round((img.naturalHeight - sh) / 2);
        }
      }else{
        const maxDim = TARGET_W;
        if(sw > sh && sw > maxDim){ sh = Math.round(sh * maxDim / sw); sw = maxDim; }
        else if(sh > maxDim){ sw = Math.round(sw * maxDim / sh); sh = maxDim; }
      }

      const canvas = document.createElement('canvas');
      canvas.width = isEmployeePhoto ? TARGET_W : sw;
      canvas.height = isEmployeePhoto ? TARGET_H : sh;
      const ctx = canvas.getContext('2d',{alpha:false});
      ctx.fillStyle='#fff';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.imageSmoothingEnabled=true;
      ctx.imageSmoothingQuality='high';
      ctx.drawImage(img,sx,sy,sw,sh,0,0,canvas.width,canvas.height);

      // Compress employee photo aggressively enough to stay below ~200 KB.
      let quality = isEmployeePhoto ? 0.82 : 0.70;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      if(isEmployeePhoto){
        while(dataUrl.length > 260000 && quality > 0.35){
          quality -= 0.05;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        // Safety fallback: lower resolution if an unusual image still exceeds target.
        if(dataUrl.length > 260000){
          const small=document.createElement('canvas');
          small.width=280; small.height=360;
          const sctx=small.getContext('2d',{alpha:false});
          sctx.fillStyle='#fff'; sctx.fillRect(0,0,280,360);
          sctx.drawImage(canvas,0,0,280,360);
          quality=0.72;
          dataUrl=small.toDataURL('image/jpeg',quality);
          while(dataUrl.length > 260000 && quality > 0.35){
            quality -= 0.05;
            dataUrl=small.toDataURL('image/jpeg',quality);
          }
        }
      }

      uploadState[key] = dataUrl;
      if(key === 'photoData') uploadState.photoSettings = {scale:1,x:0,y:0};
      updatePhotoPreviewUI(key, previewImgId, emptyId, btnId);
      if(isEmployeePhoto){
        const kb=Math.round((dataUrl.length*3/4)/1024);
        showToast(`Passport photo ready: 35×45 ratio, compressed to about ${kb} KB.`);
      }
    };
    img.onerror = () => showToast('Could not read this image. Please choose another photo.');
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function clearPhoto(key, previewImgId, emptyId, btnId, fileInputId){
  uploadState[key] = '';
  if(key === 'photoData') uploadState.photoSettings = {scale:1,x:0,y:0};
  document.getElementById(fileInputId).value = '';
  updatePhotoPreviewUI(key, previewImgId, emptyId, btnId);
}

/* ===================== Professional Photo Adjuster ===================== */
function normalizePhotoSettings(v){
  v = v || {};
  return {
    scale: Math.min(3, Math.max(0.75, Number(v.scale) || 1)),
    x: Math.min(100, Math.max(-100, Number(v.x) || 0)),
    y: Math.min(100, Math.max(-100, Number(v.y) || 0))
  };
}
function getPhotoSettings(){ return normalizePhotoSettings(uploadState.photoSettings); }
function setPhotoSettings(v){ uploadState.photoSettings = normalizePhotoSettings(v); }

function autoFitPhoto(){
  setPhotoSettings({scale:1,x:0,y:0});
  photoEditorState = {...getPhotoSettings()};
  syncPhotoEditorControls();
  updatePhotoPreviewUI('photoData','photoPreview','photoPreviewEmpty','photoClearBtn');
  if(document.getElementById('photoEditorBackdrop').style.display==='flex') renderPhotoEditor();
  showToast('Photo fitted automatically inside the passport-size box.');
}
function resetPhotoPositionOnly(){
  photoEditorState = {scale:getPhotoSettings().scale,x:0,y:0};
  syncPhotoEditorControls();
  renderPhotoEditor();
}
function openPhotoAdjuster(){
  if(!uploadState.photoData || !uploadState.photoData.startsWith('data:image')){
    showToast('Please upload an employee photo first.');
    return;
  }
  photoEditorState = {...getPhotoSettings()};
  const backdrop=document.getElementById('photoEditorBackdrop');
  backdrop.style.display='flex';
  document.body.style.overflow='hidden';
  const img=document.getElementById('photoEditorImage');
  img.onload=()=>{ requestAnimationFrame(()=>{ calculatePhotoEditorBase(); renderPhotoEditor(); }); };
  img.src=uploadState.photoData;
  if(img.complete && img.naturalWidth) requestAnimationFrame(()=>{ calculatePhotoEditorBase(); renderPhotoEditor(); });
}
function closePhotoAdjuster(){
  document.getElementById('photoEditorBackdrop').style.display='none';
  document.body.style.overflow='';
}
function calculatePhotoEditorBase(){
  const img=document.getElementById('photoEditorImage'), stage=document.getElementById('photoEditorStage');
  if(!img.naturalWidth || !img.naturalHeight || !stage.clientWidth || !stage.clientHeight) return;
  // Base scale makes the whole photo cover the crop area without leaving blank space.
  const sx=stage.clientWidth/img.naturalWidth;
  const sy=stage.clientHeight/img.naturalHeight;
  photoEditorBase.scale=Math.max(sx,sy);
}
function syncPhotoEditorControls(){
  const s=photoEditorState;
  document.getElementById('photoZoomRange').value=s.scale;
  document.getElementById('photoXRange').value=s.x;
  document.getElementById('photoYRange').value=s.y;
  document.getElementById('photoZoomValue').textContent=Number(s.scale).toFixed(2)+'×';
  document.getElementById('photoXValue').textContent=Math.round(s.x);
  document.getElementById('photoYValue').textContent=Math.round(s.y);
}
function renderPhotoEditor(){
  const img=document.getElementById('photoEditorImage');
  const stage=document.getElementById('photoEditorStage');
  if(!img || !img.naturalWidth || !stage.clientWidth) return;
  const px=(Number(photoEditorState.x)||0)*stage.clientWidth/100;
  const py=(Number(photoEditorState.y)||0)*stage.clientHeight/100;
  const scale=photoEditorBase.scale*(Number(photoEditorState.scale)||1);
  img.style.width=img.naturalWidth+'px';
  img.style.height=img.naturalHeight+'px';
  img.style.transform=`translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${scale})`;
  syncPhotoEditorControls();
}
function applyPhotoAdjuster(){
  setPhotoSettings(photoEditorState);
  closePhotoAdjuster();
  updatePhotoPreviewUI('photoData','photoPreview','photoPreviewEmpty','photoClearBtn');
  showToast('Photo adjustment saved. Save the employee record to keep it permanently.');
}
['photoZoomRange','photoXRange','photoYRange'].forEach(id=>{
  document.addEventListener('input',e=>{
    if(e.target.id!==id) return;
    if(id==='photoZoomRange') photoEditorState.scale=Number(e.target.value);
    if(id==='photoXRange') photoEditorState.x=Number(e.target.value);
    if(id==='photoYRange') photoEditorState.y=Number(e.target.value);
    renderPhotoEditor();
  });
});
(function enablePhotoDragging(){
  const stage=()=>document.getElementById('photoEditorStage');
  const img=()=>document.getElementById('photoEditorImage');
  let dragging=false,sx=0,sy=0,ox=0,oy=0;
  function down(e){
    if(!img().src) return;
    dragging=true;
    img().classList.add('dragging');
    const p=e;
    sx=p.clientX; sy=p.clientY;
    ox=photoEditorState.x; oy=photoEditorState.y;
    try{ e.currentTarget.setPointerCapture(e.pointerId); }catch(_e){}
    e.preventDefault();
  }
  function move(e){
    if(!dragging) return;
    const st=stage();
    photoEditorState.x=Math.max(-100,Math.min(100,ox+(e.clientX-sx)*100/st.clientWidth));
    photoEditorState.y=Math.max(-100,Math.min(100,oy+(e.clientY-sy)*100/st.clientHeight));
    renderPhotoEditor();
    e.preventDefault();
  }
  function up(){ dragging=false; img().classList.remove('dragging'); }
  document.addEventListener('pointerdown',e=>{if(e.target.id==='photoEditorImage') down(e);});
  document.addEventListener('pointermove',move,{passive:false});
  document.addEventListener('pointerup',up);
  document.addEventListener('pointercancel',up);
  document.addEventListener('wheel',e=>{
    if(e.target.id!=='photoEditorImage') return;
    e.preventDefault();
    photoEditorState.scale=Math.max(0.75,Math.min(3,photoEditorState.scale+(e.deltaY<0?0.05:-0.05)));
    renderPhotoEditor();
  },{passive:false});
})();
window.addEventListener('resize',()=>{
  if(document.getElementById('photoEditorBackdrop').style.display==='flex'){
    calculatePhotoEditorBase();
    renderPhotoEditor();
  }
});

/* ===================== Form <-> record mapping ===================== */
function readForm(){
  const g = id => document.getElementById(id).value.trim();
  const clientTop = document.getElementById('clientName').value.trim();
  return {
    // long-roll columns
    msmno: g('f_msmno'),
    doe: g('f_joining'),
    dischargemsm: g('f_dischargemsm'),
    cashreliever: g('f_cashreliever'),
    uniformdate: g('f_uniformdate'),
    newold: g('f_newold'),
    employmentStatus: g('f_employmentStatus') || 'Active',
    supervisor: g('f_supervisor'),
    clientproject: g('f_clientproject') || clientTop,
    location: g('f_deployloc'),
    name: g('f_name'),
    father: g('f_father'),
    cnic: g('f_cnic'),
    cnicexpiry: g('f_cnic_expiry'),
    armycivil: g('f_armycivil'),
    dob: g('f_dob'),
    permaddr: g('f_permaddr'),
    armyno: g('f_armyno'),
    photo: g('f_photo'),
    policeverif: g('f_policeverif'),
    specialbranch: g('f_specialbranch'),
    apsaa: g('f_apsaa'),
    cell: g('f_cell'),
    education: g('f_education'),
    nokname: g('f_nokname'),
    nokcontact: g('f_nokcontact'),
    iban: g('f_iban'),
    bank: g('f_bank'),
    actitle: g('f_actitle'),
    remarks: g('f_remarks'),
    // extras (kept, not shown in long roll export by default)
    co: g('f_co'), mother: g('f_mother'), domicile: g('f_domicile'),
    blood: g('f_blood'), height: g('f_height'), marital: g('f_marital'),
    children: g('f_children'), cnicissue: g('f_cnic_issue'), unitrank: g('f_unitrank'),
    enrolldate: g('f_enrolldate'), dischargedate_army: g('f_dischargedate_army'),
    homecell: g('f_homecell'), policestation: g('f_policestation'),
    curraddr: g('f_curraddr'), joining: g('f_joining'), deployloc: g('f_deployloc'),
    acno: g('f_acno'), branchname: g('f_branchname'), branchcode: g('f_branchcode'),
    photoData: uploadState.photoData || '', policeVerifDoc: uploadState.policeVerifDoc || '',
    photoSettings: uploadState.photoSettings || {scale:1,x:0,y:0},
  };
}

function fillForm(rec){
  const s = (id,val) => { const el=document.getElementById(id); if(el) el.value = val||''; };
  s('f_name', rec.name); s('f_co', rec.co); s('f_father', rec.father); s('f_mother', rec.mother);
  s('f_dob', rec.dob); s('f_domicile', rec.domicile); s('f_education', rec.education);
  s('f_blood', rec.blood); s('f_height', rec.height); s('f_marital', rec.marital); s('f_children', rec.children);
  s('f_cnic', rec.cnic); s('f_cnic_issue', rec.cnicissue); s('f_cnic_expiry', rec.cnicexpiry);
  s('f_armycivil', rec.armycivil); s('f_armyno', rec.armyno); s('f_apsaa', rec.apsaa);
  s('f_unitrank', rec.unitrank); s('f_enrolldate', rec.enrolldate); s('f_dischargedate_army', rec.dischargedate_army);
  s('f_cell', rec.cell); s('f_homecell', rec.homecell); s('f_policestation', rec.policestation);
  s('f_curraddr', rec.curraddr); s('f_permaddr', rec.permaddr);
  s('f_joining', rec.joining || rec.doe); s('f_deployloc', rec.deployloc || rec.location);
  s('f_policeverif', rec.policeverif);
  s('f_nokname', rec.nokname); s('f_nokcontact', rec.nokcontact);
  s('f_actitle', rec.actitle); s('f_acno', rec.acno); s('f_iban', rec.iban);
  s('f_bank', rec.bank); s('f_branchname', rec.branchname); s('f_branchcode', rec.branchcode);
  s('f_msmno', rec.msmno); s('f_dischargemsm', rec.dischargemsm); s('f_cashreliever', rec.cashreliever);
  s('f_uniformdate', rec.uniformdate); s('f_newold', rec.newold); s('f_employmentStatus', rec.employmentStatus || rec.status || 'Active'); s('f_supervisor', rec.supervisor);
  s('f_clientproject', rec.clientproject); s('f_photo', rec.photo); s('f_specialbranch', rec.specialbranch);
  s('f_remarks', rec.remarks);

  uploadState.photoData = rec.photoData || '';
  uploadState.policeVerifDoc = rec.policeVerifDoc || '';
  uploadState.photoSettings = normalizePhotoSettings(rec.photoSettings);
  updatePhotoPreviewUI('photoData', 'photoPreview', 'photoPreviewEmpty', 'photoClearBtn');
  updatePhotoPreviewUI('policeVerifDoc', 'policeVerifPreview', 'policeVerifPreviewEmpty', 'policeVerifClearBtn');
}

function resetForm(){
  document.getElementById('entryForm').reset();
  if(currentAccess && !isParent()){
    document.getElementById('f_clientproject').value = myClientProject();
  }
  const statusEl=document.getElementById('f_employmentStatus'); if(statusEl) statusEl.value='Active';
  uploadState.photoData = '';
  uploadState.policeVerifDoc = '';
  uploadState.photoSettings = {scale:1,x:0,y:0};
  updatePhotoPreviewUI('photoData', 'photoPreview', 'photoPreviewEmpty', 'photoClearBtn');
  updatePhotoPreviewUI('policeVerifDoc', 'policeVerifPreview', 'policeVerifPreviewEmpty', 'policeVerifClearBtn');
  cancelEdit();
}

function cancelEdit(){
  editingId = null;
  document.getElementById('editBanner').style.display = 'none';
}

/* ===================== Audit Trail ===================== */
function auditDetailsText(details){
  if(!details) return '';
  try{return typeof details==='string' ? details : JSON.stringify(details);}
  catch(e){return String(details);}
}

function writeExportAudit(details){
  return writeAuditLog('EXPORT', 'export', details || {});
}

function writeAuditLog(action, targetId, details){
  if(!currentUser || !currentAccess || !db) return Promise.resolve();
  const payload = {
    action: String(action||'').slice(0,80),
    targetId: String(targetId||''),
    details: auditDetailsText(details).slice(0,4000),
    userEmail: (currentUser.email||'').toLowerCase(),
    role: currentAccess.role || '',
    clientproject: currentAccess.clientproject || '',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  return db.collection(AUDIT_COLLECTION).add(payload).catch(err=>{
    console.warn('Audit log write failed:', err);
  });
}

function formatAuditTime(v){
  if(!v) return 'Pending…';
  let d=null;
  if(v.toDate) d=v.toDate(); else if(v.seconds) d=new Date(v.seconds*1000); else d=new Date(v);
  if(!d || isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function auditDateMs(v){
  if(!v) return 0;
  try{ if(v.toDate) return v.toDate().getTime(); if(v.seconds) return Number(v.seconds)*1000; const t=Date.parse(v); return isNaN(t)?0:t; }catch(e){ return 0; }
}
function auditClientOf(x){
  return String(x.clientproject || x.details || '').toLowerCase();
}
function refreshAuditClientFilter(){
  const el=document.getElementById('auditClientFilter'); if(!el) return;
  const current=el.value;
  const vals=[...new Set((window.auditLogs||[]).map(x=>String(x.clientproject||'').trim()).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}));
  el.innerHTML='<option value="">All Clients / Sectors</option>'+vals.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
  if(vals.includes(current)) el.value=current;
}
function subscribeAuditLogs(){
  if(auditUnsub){auditUnsub(); auditUnsub=null;}
  if(!isParent()) return;
  auditUnsub = db.collection(AUDIT_COLLECTION).orderBy('createdAt','desc').limit(1000).onSnapshot(snap=>{
    window.auditLogs = snap.docs.map(d=>({id:d.id,...d.data()}));
    refreshAuditClientFilter();
    renderAuditLogs();
  }, err=>{
    console.error(err);
    const el=document.getElementById('auditTbody');
    if(el) el.innerHTML=`<tr><td colspan="5">Could not load activity log: ${escapeHtml(err.message||'Unknown error')}</td></tr>`;
  });
}
function loadAuditLogs(){ subscribeAuditLogs(); }
function resetAuditFilters(){
  ['auditSearch','auditUserFilter','auditFrom','auditTo'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  ['auditActionFilter','auditClientFilter','auditSort'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=id==='auditSort'?'desc':'';});
  renderAuditLogs();
}
function renderAuditLogs(){
  const tbody=document.getElementById('auditTbody'); if(!tbody) return;
  const q=(document.getElementById('auditSearch')?.value||'').trim().toLowerCase();
  const action=(document.getElementById('auditActionFilter')?.value||'').trim();
  const client=(document.getElementById('auditClientFilter')?.value||'').trim().toLowerCase();
  const user=(document.getElementById('auditUserFilter')?.value||'').trim().toLowerCase();
  const fromVal=document.getElementById('auditFrom')?.value||'';
  const toVal=document.getElementById('auditTo')?.value||'';
  const from=fromVal?new Date(fromVal).getTime():0;
  const to=toVal?new Date(toVal).getTime():Infinity;
  const sort=(document.getElementById('auditSort')?.value||'desc')==='asc'?'asc':'desc';
  let rows=(window.auditLogs||[]).filter(x=>{
    const t=auditDateMs(x.createdAt);
    if(action && String(x.action||'')!==action) return false;
    if(client && !auditClientOf(x).includes(client)) return false;
    if(user && !String(x.userEmail||'').toLowerCase().includes(user)) return false;
    if(from && t && t<from) return false;
    if(to!==Infinity && t && t>to) return false;
    if(q && ![x.action,x.userEmail,x.targetId,x.details,x.clientproject,x.role].some(v=>String(v||'').toLowerCase().includes(q))) return false;
    return true;
  });
  rows.sort((a,b)=>{const d=auditDateMs(a.createdAt)-auditDateMs(b.createdAt);return sort==='asc'?d:-d;});
  const summary=document.getElementById('auditFilterSummary');
  if(summary) summary.textContent=`Showing ${rows.length} activity entr${rows.length===1?'y':'ies'} from ${ (window.auditLogs||[]).length } loaded entries.`;
  tbody.innerHTML=rows.map(x=>`<tr>
    <td>${escapeHtml(formatAuditTime(x.createdAt))}</td>
    <td class="audit-action">${escapeHtml(x.action||'—')}</td>
    <td>${escapeHtml(x.userEmail||'—')}<div class="audit-meta">${escapeHtml(x.role||'')}</div></td>
    <td>${escapeHtml(x.targetId||'—')}</td>
    <td>${escapeHtml(x.details||'—')}<div class="audit-meta">${escapeHtml(x.clientproject||'')}</div></td>
  </tr>`).join('') || '<tr><td colspan="5">No activity entries match the selected filters.</td></tr>';
}

/* ===================== Scoped CNIC lookup =====================
   Parent/Admin can search globally. Sector/Client users can only search inside
   their authorized scope, matching the Firestore security rules. This prevents
   permission-denied queries while preserving CNIC upsert behavior. */
async function findScopedRecordsByCnicKey(cnicKey){
  const key=normalizeCnicKey(cnicKey);
  if(!key) return [];
  const found=new Map();
  if(isParent()){
    const snap=await db.collection(RECORDS_COLLECTION).where('cnicKey','==',key).limit(10).get();
    snap.docs.forEach(d=>found.set(d.id,{id:d.id,...d.data()}));
  }else{
    const client=myClientProject();
    const sector=mySector();
    if(client){
      const snap=await db.collection(RECORDS_COLLECTION).where('clientproject','==',client).where('cnicKey','==',key).limit(10).get();
      snap.docs.forEach(d=>found.set(d.id,{id:d.id,...d.data()}));
    }
    if(sector){
      const snap=await db.collection(RECORDS_COLLECTION).where('sector','==',sector).where('cnicKey','==',key).limit(10).get();
      snap.docs.forEach(d=>found.set(d.id,{id:d.id,...d.data()}));
    }
  }
  // Legacy compatibility: older records may not have cnicKey yet. If the
  // indexed lookup found nothing, inspect only the caller's authorized scope.
  if(!found.size){
    let snaps=[];
    if(isParent()){
      snaps=[await db.collection(RECORDS_COLLECTION).get()];
    }else{
      const client=myClientProject(), sector=mySector();
      if(client) snaps.push(await db.collection(RECORDS_COLLECTION).where('clientproject','==',client).get());
      if(sector) snaps.push(await db.collection(RECORDS_COLLECTION).where('sector','==',sector).get());
    }
    snaps.forEach(snap=>snap.docs.forEach(d=>{
      const r=d.data()||{}, k=normalizeCnicKey(r.cnic);
      if(k===key) found.set(d.id,{id:d.id,...r});
    }));
  }
  return [...found.values()];
}

async function findScopedExistingByCnicKeys(keys){
  const cleanKeys=[...new Set(keys.map(normalizeCnicKey).filter(Boolean))];
  const found=new Map();
  if(!cleanKeys.length) return found;
  if(isParent()){
    for(let i=0;i<cleanKeys.length;i+=30){
      const chunk=cleanKeys.slice(i,i+30);
      const snap=await db.collection(RECORDS_COLLECTION).where('cnicKey','in',chunk).get();
      snap.docs.forEach(d=>found.set(String(d.data().cnicKey||''),{id:d.id,...d.data()}));
    }
  }else{
    const client=myClientProject();
    const sector=mySector();
    if(client){
      for(let i=0;i<cleanKeys.length;i+=30){
        const chunk=cleanKeys.slice(i,i+30);
        const snap=await db.collection(RECORDS_COLLECTION).where('clientproject','==',client).where('cnicKey','in',chunk).get();
        snap.docs.forEach(d=>found.set(String(d.data().cnicKey||''),{id:d.id,...d.data()}));
      }
    }
    if(sector){
      for(let i=0;i<cleanKeys.length;i+=30){
        const chunk=cleanKeys.slice(i,i+30);
        const snap=await db.collection(RECORDS_COLLECTION).where('sector','==',sector).where('cnicKey','in',chunk).get();
        snap.docs.forEach(d=>found.set(String(d.data().cnicKey||''),{id:d.id,...d.data()}));
      }
    }
  }
  // Legacy compatibility for records created before cnicKey was introduced.
  // Only Parent scans globally; client/sector users scan their own scope.
  if(found.size < cleanKeys.length){
    const scopeSnaps=[];
    if(isParent()){
      scopeSnaps.push(await db.collection(RECORDS_COLLECTION).get());
    }else{
      const client=myClientProject(), sector=mySector();
      if(client) scopeSnaps.push(await db.collection(RECORDS_COLLECTION).where('clientproject','==',client).get());
      if(sector) scopeSnaps.push(await db.collection(RECORDS_COLLECTION).where('sector','==',sector).get());
    }
    const wanted=new Set(cleanKeys);
    scopeSnaps.forEach(snap=>snap.docs.forEach(d=>{
      const r=d.data()||{}, k=normalizeCnicKey(r.cnic);
      if(k && wanted.has(k) && !found.has(k)) found.set(k,{id:d.id,...r});
    }));
  }
  return found;
}

/* ===================== Save / Edit / Delete (Firestore) ===================== */
async function saveEntry(){
  const name = document.getElementById('f_name').value.trim();
  if(!name){ showToast('Employee Name is required.'); document.getElementById('f_name').focus(); return; }
  const data = readForm();
  data.employmentStatus = data.employmentStatus || 'Active';
  data.cnicKey = normalizeCnicKey(data.cnic);
  data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
  if(!isParent()) { data.clientproject = myClientProject(); data.sector = mySector() || msmCanonicalSector(myClientProject()); }
  try{
    if(!editingId && data.cnicKey){
      const matches = await findScopedRecordsByCnicKey(data.cnicKey);
      if(matches.length){
        editingId=matches[0].id;
        const existing={id:editingId,...matches[0]};
        const patch=mergeNonEmptyFields({},data); delete patch.createdAt;
        await db.collection(RECORDS_COLLECTION).doc(editingId).update(patch);
        await writeAuditLog('UPDATE_RECORD_BY_CNIC',editingId,{name:data.name||'',cnic:data.cnic||'',clientproject:data.clientproject||'',employmentStatus:data.employmentStatus});
        showToast('Existing guard updated by CNIC — duplicate prevented.');
        persistMeta(); resetForm(); switchTab('register'); return;
      }
    }
    if(editingId){
      const targetId=editingId;
      await db.collection(RECORDS_COLLECTION).doc(targetId).update(data);
      await writeAuditLog('UPDATE_RECORD', targetId, {name:data.name||'', cnic:data.cnic||'', clientproject:data.clientproject||'', employmentStatus:data.employmentStatus});
      showToast('Record updated in the Long Roll register.');
    } else {
      const nextSno = records.length ? Math.max(...records.map(r=>Number(r.sno)||0))+1 : 1;
      const docRef=await db.collection(RECORDS_COLLECTION).add({sno: nextSno, createdAt: firebase.firestore.FieldValue.serverTimestamp(), ...data});
      await writeAuditLog('CREATE_RECORD', docRef.id, {sno:nextSno, name:data.name||'', cnic:data.cnic||'', clientproject:data.clientproject||'', employmentStatus:data.employmentStatus});
      showToast('Saved — added to the Long Roll register.');
      if(typeof msmCelebrateSave==='function') msmCelebrateSave(data.name);
    }
    persistMeta(); resetForm(); switchTab('register');
  }catch(err){showToast('Could not save: ' + err.message);}
}
function editRecord(id){
  const rec = records.find(r=>r.id===id);
  if(!rec) return;
  editingId = id;
  fillForm(rec);
  document.getElementById('editBannerText').textContent = `Editing record #${rec.sno} — ${rec.name}`;
  document.getElementById('editBanner').style.display = 'flex';
  switchTab('form');
  window.scrollTo({top:0, behavior:'smooth'});
}

async function deleteRecord(id){
  const rec = records.find(r=>r.id===id);
  if(!rec) return;
  if(!confirm(`Move record #${rec.sno||''} — ${rec.name||''} to the Recycle Bin?`)) return;
  await msmMoveToRecycle(id, false);
}

/* ===================== Table render ===================== */
function recordTimestampValue(v){
  if(!v) return 0;
  try{ if(v.toDate) return v.toDate().getTime(); if(v.seconds) return Number(v.seconds)*1000; const t=Date.parse(v); return isNaN(t)?0:t; }catch(e){ return 0; }
}
function normalizedStatus(r){
  const raw=String(r.employmentStatus||r.status||'').trim().toLowerCase();
  if(raw==='left job'||raw==='left-job'||raw==='leftjob'||raw==='on leave'||raw==='on-leave') return 'left-job';
  if(raw==='removed'||raw==='terminated') return 'removed';
  if(raw==='active'||!raw) return 'active';
  return raw==='new'?'new':(raw==='old'?'old':'active');
}
function employmentStatusLabel(r){
  const s=normalizedStatus(r);
  return s==='left-job'?'Left Job':s==='removed'?'Removed':'Active';
}
function uniqueFilterValues(key){
  return [...new Set(records.map(r=>String(r[key]??'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}));
}
function refreshRegisterFilters(){
  const defs=[['filterClient','clientproject','All Clients'],['filterLocation','location','All Locations'],['filterSupervisor','supervisor','All Supervisors'],['filterStation','deployloc','All Stations'],['filterRank','unitrank','All Ranks / Units']];
  defs.forEach(([id,key,label])=>{
    const el=document.getElementById(id); if(!el) return;
    const current=el.value; const vals=uniqueFilterValues(key);
    el.innerHTML=`<option value="">${label}</option>`+vals.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
    if(vals.includes(current)) el.value=current;
  });
}
function getSortValue(r,key){
  if(key==='createdAt'||key==='updatedAt') return recordTimestampValue(r[key]);
  if(key==='sno') return Number(r[key])||0;
  if(key==='doe') { const t=Date.parse(String(r[key]||'')); return isNaN(t)?String(r[key]||'').toLowerCase():t; }
  return String(r[key]??'').toLowerCase();
}
function updateRegisterDashboard(filtered){
  const all=records||[];
  const count=(arr,status)=>arr.filter(r=>normalizedStatus(r)===status).length;
  const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=String(val);};
  set('dashTotal',all.length);
  set('dashActive',count(all,'active'));
  set('dashLeave',count(all,'on-leave'));
  set('dashTerminated',count(all,'terminated'));
  set('dashFiltered',filtered.length);
}
function renderTable(){
  const thead = document.getElementById('theadRow');
  thead.innerHTML = `<th><input class="row-check" type="checkbox" title="Select all visible" onchange="selectAllVisible(this.checked)"></th>` + COLUMNS.map(c=>`<th class="sort-head">${escapeHtml(c.label)}</th>`).join('') + '<th>Actions</th>';
  refreshRegisterFilters();
  const q = (document.getElementById('searchBox')?.value||'').trim().toLowerCase();
  const fc=document.getElementById('filterClient')?.value||'', fl=document.getElementById('filterLocation')?.value||'', fs=document.getElementById('filterSupervisor')?.value||'', fstation=document.getElementById('filterStation')?.value||'', frank=document.getElementById('filterRank')?.value||'', fst=document.getElementById('filterStatus')?.value||'';
  const from=document.getElementById('filterDateFrom')?.value||'', to=document.getElementById('filterDateTo')?.value||'';
  const searchKeys=['name','cnic','clientproject','sector','supervisor','msmno','location','cell','deployloc','unitrank','employmentStatus'];
  let filtered=records.filter(r=>{
     if(typeof msmFilterSector==='function' && isParent() && msmActiveSector!=='full' && !msmFilterSector(r)) return false;
    if(q && !searchKeys.some(k=>String(r[k]??'').toLowerCase().includes(q))) return false;
    if(fc && String(r.clientproject||'')!==fc) return false;
    if(fl && String(r.location||'')!==fl) return false;
    if(fs && String(r.supervisor||'')!==fs) return false;
    if(fstation && String(r.deployloc||'')!==fstation) return false;
    if(frank && String(r.unitrank||'')!==frank) return false;
    if(fst && normalizedStatus(r)!==fst) return false;
    const dateVal=String(r.doe||'').slice(0,10);
    if(from && dateVal && dateVal<from) return false;
    if(to && dateVal && dateVal>to) return false;
    return true;
  });
  const sortField=document.getElementById('sortField')?.value||'sno';
  const sortOrder=document.getElementById('sortOrder')?.value||'asc';
  filtered.sort((a,b)=>{
    const av=getSortValue(a,sortField), bv=getSortValue(b,sortField);
    let cmp=0;
    if(typeof av==='number'&&typeof bv==='number') cmp=av-bv; else cmp=String(av).localeCompare(String(bv),undefined,{numeric:true,sensitivity:'base'});
    return sortOrder==='desc' ? -cmp : cmp;
  });
  updateRegisterDashboard(filtered);
  const selected=new Set(window.selectedRecordIds||[]);
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = filtered.map(r=>{
    const cells = COLUMNS.map(c=>`<td>${escapeHtml(c.key==='employmentStatus'?employmentStatusLabel(r):(r[c.key] ?? ''))}</td>`).join('');
    const photoLink = r.photoData ? `<a href="${r.photoData}" target="_blank" rel="noopener" title="View photo"><img src="${r.photoData}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;border:1px solid var(--line);vertical-align:middle;"></a>` : '';
    const verifLink = r.policeVerifDoc ? (r.policeVerifDoc.startsWith('data:image') ? `<a href="${r.policeVerifDoc}" target="_blank" rel="noopener" title="View police verification document"><img src="${r.policeVerifDoc}" style="width:32px;height:32px;object-fit:cover;border-radius:4px;border:1px solid var(--line);vertical-align:middle;"></a>` : `<a class="btn btn-sm" href="${r.policeVerifDoc}" target="_blank" rel="noopener">🛡 Verif Doc</a>`) : '';
    return `<tr><td><input class="row-check record-check" type="checkbox" value="${escapeHtml(r.id)}" ${selected.has(r.id)?'checked':''} onchange="toggleRecordSelection('${r.id}',this.checked)"></td>${cells}<td class="row-actions"><button class="btn btn-sm" onclick="editRecord('${r.id}')">Edit</button><button class="btn btn-sm" onclick="printRecordForm('${r.id}')">🖨 Print</button>${photoLink}${verifLink}<button class="btn btn-sm btn-danger" onclick="deleteRecord('${r.id}')">Delete</button></td></tr>`;
  }).join('');
  document.getElementById('rowCountPill').textContent = `${filtered.length} of ${records.length} entries`;
  document.getElementById('emptyState').style.display = records.length ? 'none' : 'block';
  document.getElementById('registerTable').style.display = (records.length && msmRegisterView!=='cards') ? 'table' : 'none';
  updateSelectionUI();
  if(typeof msmRenderCards==='function') msmRenderCards(filtered);
}

/* ===================== Cinematic Card View (original MSM mascot, no third-party IP) ===================== */
let msmRegisterView = 'table';
function msmSetRegisterView(mode){
  msmRegisterView = mode==='cards' ? 'cards' : 'table';
  document.getElementById('msmTableViewBtn')?.classList.toggle('active', msmRegisterView==='table');
  document.getElementById('msmCardViewBtn')?.classList.toggle('active', msmRegisterView==='cards');
  const grid=document.getElementById('msmCardsGrid'), tbl=document.getElementById('registerTable');
  if(grid) grid.style.display = msmRegisterView==='cards' ? 'grid' : 'none';
  if(tbl) tbl.style.display = (records.length && msmRegisterView==='table') ? 'table' : 'none';
}
function msmStatusClass(r){
  const s=normalizedStatus(r);
  if(s==='left-job') return 'msm-status-left';
  if(s==='removed') return 'msm-status-removed';
  return 'msm-status-active';
}
function msmRenderCards(filtered){
  const grid=document.getElementById('msmCardsGrid'); if(!grid) return;
  if(msmRegisterView!=='cards'){ grid.style.display='none'; return; }
  grid.style.display='grid';
  if(!filtered.length){ grid.innerHTML='<div class="empty-state">No records match the current filters.</div>'; return; }
  grid.innerHTML = filtered.map(r=>{
    const photo = r.photoData ? `<img src="${r.photoData}" alt="${escapeHtml(r.name||'Guard')}">` : `<div class="msm-card-mascot">🛡️</div>`;
    return `<div class="msm-3d-card ${msmStatusClass(r)}">
      <div class="msm-3d-card-inner">
        <div class="msm-card-photo">${photo}<span class="msm-card-status-badge">${escapeHtml(employmentStatusLabel(r))}</span></div>
        <div class="msm-card-body">
          <h4>${escapeHtml(r.name||'Unnamed Guard')}</h4>
          <div class="msm-card-row"><b>CNIC:</b> ${escapeHtml(r.cnic||'—')}</div>
          <div class="msm-card-row"><b>MSM No.:</b> ${escapeHtml(r.msmno||'—')}</div>
          <div class="msm-card-row"><b>Client:</b> ${escapeHtml(r.clientproject||'—')}</div>
          <div class="msm-card-row"><b>Sector:</b> ${escapeHtml(r.sector||'—')}</div>
          <div class="msm-card-row"><b>Location:</b> ${escapeHtml(r.location||'—')}</div>
        </div>
        <div class="msm-card-actions">
          <button class="btn btn-sm" onclick="editRecord('${r.id}')">Edit</button>
          <button class="btn btn-sm" onclick="printRecordForm('${r.id}')">🖨 Print</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRecord('${r.id}')">Delete</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
/* Friendly original mascot celebration — plays after a NEW guard is saved. No third-party characters used. */
function msmCelebrateSave(name){
  const old=document.getElementById('msmCelebrate'); if(old) old.remove();
  const box=document.createElement('div'); box.id='msmCelebrate'; box.className='msm-celebrate';
  box.innerHTML=`<div class="msm-celebrate-card">
      <div class="msm-mascot-guard">🐾<span class="msm-mascot-shield">🛡️</span></div>
      <div class="msm-celebrate-text"><b>${escapeHtml(name||'New guard')}</b> added to the Long Roll!</div>
    </div>`;
  document.body.appendChild(box);
  requestAnimationFrame(()=>box.classList.add('show'));
  setTimeout(()=>{ box.classList.remove('show'); setTimeout(()=>box.remove(),400); },2200);
}
function toggleRecordSelection(id,checked){
  if(!isParent()) { showToast('Only Parent can select records for bulk actions.'); return; }
  window.selectedRecordIds=window.selectedRecordIds||new Set(); checked?window.selectedRecordIds.add(id):window.selectedRecordIds.delete(id); updateSelectionUI();
}
function selectAllVisible(checked){
  if(!isParent()){ showToast('Only Parent can use bulk selection.'); return; }
  const q=(document.getElementById('searchBox')?.value||'').trim().toLowerCase();
  const fc=document.getElementById('filterClient')?.value||'', fl=document.getElementById('filterLocation')?.value||'', fs=document.getElementById('filterSupervisor')?.value||'', fstation=document.getElementById('filterStation')?.value||'', frank=document.getElementById('filterRank')?.value||'', fst=document.getElementById('filterStatus')?.value||'';
  const from=document.getElementById('filterDateFrom')?.value||'', to=document.getElementById('filterDateTo')?.value||'';
  const arr=records.filter(r=>{
    if(q && !['name','cnic','clientproject','sector','supervisor','msmno','location','cell','deployloc','unitrank','employmentStatus'].some(k=>String(r[k]??'').toLowerCase().includes(q))) return false;
    if(fc&&String(r.clientproject||'')!==fc) return false; if(fl&&String(r.location||'')!==fl) return false; if(fs&&String(r.supervisor||'')!==fs) return false; if(fstation&&String(r.deployloc||'')!==fstation) return false; if(frank&&String(r.unitrank||'')!==frank) return false; if(fst&&normalizedStatus(r)!==fst) return false;
    const d=String(r.doe||'').slice(0,10); if(from&&d&&d<from)return false; if(to&&d&&d>to)return false; return true;
  });
  window.selectedRecordIds=window.selectedRecordIds||new Set(); arr.forEach(r=>checked?window.selectedRecordIds.add(r.id):window.selectedRecordIds.delete(r.id)); renderTable();
}
function updateSelectionUI(){
  const n=window.selectedRecordIds?window.selectedRecordIds.size:0; const el=document.getElementById('selectedCount'); if(el) el.textContent=`${n} selected`; const b=document.getElementById('bulkDeleteBtn'); if(b) b.style.display=isParent()&&n?'inline-flex':'none'; const t=document.getElementById('bulkTransferBtn'); if(t) t.style.display=isParent()&&n?'inline-flex':'none';
}
async function bulkDeleteSelected(){
  if(!isParent()) return showToast('Only Parent can use bulk delete.');
  const ids=[...(window.selectedRecordIds||[])];
  const rows=records.filter(r=>ids.includes(r.id));
  if(!rows.length) return;
  if(!confirm(`Move ${rows.length} selected record(s) to the Recycle Bin?`)) return;
  try{
    for(let i=0;i<rows.length;i+=300){
      const batch=db.batch();
      rows.slice(i,i+300).forEach(r=>{
        batch.set(db.collection(MSM_RECYCLE_COLLECTION).doc(r.id), msmRecycleItemPayload(r));
        batch.delete(db.collection(RECORDS_COLLECTION).doc(r.id));
      });
      await batch.commit();
    }
    await writeAuditLog('BULK_DELETE', rows.length, {count:rows.length,destination:'recycleBin'});
    window.selectedRecordIds=new Set();
    renderTable();
    showToast(`${rows.length} records moved to Recycle Bin.`);
  }catch(e){console.error(e);showToast('Bulk delete failed: '+e.message);}
}

/* ===================== Parent: Bulk Client/Sector Transfer ===================== */
function transferSourceSummary(selectedRecords){
  const counts={};
  selectedRecords.forEach(r=>{ const k=String(r.clientproject||'Unassigned').trim()||'Unassigned'; counts[k]=(counts[k]||0)+1; });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]);
}

async function populateTransferTargets(){
  const el=document.getElementById('transferTargetClient');
  if(!el) return;
  const values=new Set(records.map(r=>String(r.clientproject||'').trim()).filter(Boolean));
  try{
    const snap=await db.collection(AUTHUSERS_COLLECTION).get();
    snap.docs.forEach(d=>{ const v=String((d.data()||{}).clientproject||'').trim(); if(v) values.add(v); });
  }catch(e){ console.warn('Could not load authorized client list for transfer:',e); }
  const current=[...values].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}));
  el.innerHTML='<option value="">Select new client / sector…</option>'+current.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
}

function openTransferModal(){
  if(!isParent()) return showToast('Only Parent can transfer guards between clients/sectors.');
  const ids=[...(window.selectedRecordIds||[])];
  const selected=records.filter(r=>ids.includes(r.id));
  if(!selected.length) return showToast('Select at least one guard first.');
  const summary=transferSourceSummary(selected);
  const total=selected.length;
  document.getElementById('transferSummary').innerHTML=`
    <div class="transfer-card"><span>Selected Guards</span><b>${total}</b></div>
    <div class="transfer-card"><span>Source Client(s)</span><b>${summary.length}</b></div>
    <div class="transfer-card"><span>Transfer Type</span><b>Bulk</b></div>`;
  document.getElementById('transferSourceList').innerHTML='<strong>Current assignment summary:</strong><br>'+summary.map(([k,n])=>`${escapeHtml(k)} — <strong>${n}</strong> guard${n===1?'':'s'}`).join('<br>');
  document.getElementById('transferTargetLocation').value='';
  document.getElementById('transferTargetStation').value='';
  document.getElementById('transferReason').value='';
  const modal=document.getElementById('transferModal');
  modal.style.display='flex';
  populateTransferTargets();
}
function closeTransferModal(){ const m=document.getElementById('transferModal'); if(m)m.style.display='none'; }

async function confirmBulkTransfer(){
  if(!isParent()) return showToast('Only Parent can perform transfers.');
  const target=String(document.getElementById('transferTargetClient')?.value||'').trim();
  if(!target) return showToast('Select the new Client / Sector.');
  const ids=[...(window.selectedRecordIds||[])];
  const selected=records.filter(r=>ids.includes(r.id));
  if(!selected.length) return showToast('No guards are selected.');
  const targetSector=(window.msmSectorCatalog||[]).find(n=>n.toLowerCase()===target.toLowerCase()) || '';
  const targetLocation=String(document.getElementById('transferTargetLocation')?.value||'').trim();
  const targetStation=String(document.getElementById('transferTargetStation')?.value||'').trim();
  const reason=String(document.getElementById('transferReason')?.value||'').trim();
  const sources=transferSourceSummary(selected);
  if(selected.every(r=>String(r.clientproject||'').trim()===target) && !targetLocation && !targetStation){
    return showToast('All selected guards are already assigned to this Client / Sector.');
  }
  const sourceText=sources.map(([k,n])=>`${k} (${n})`).join(', ');
  const locationText=targetLocation||'Keep current city/region';
  const stationText=targetStation||'Keep current station';
  const ok=confirm(`Transfer ${selected.length} guard(s)?\n\nFrom: ${sourceText}\nTo: ${target}\nCity/Region: ${locationText}\nStation: ${stationText}\n\nThe employee records will be updated in one database batch. Continue?`);
  if(!ok) return;

  const batchId='TR-'+Date.now()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
  const now=firebase.firestore.FieldValue.serverTimestamp();
  const batchSize=400;
  let moved=0;
  let updateError=null;

  try{
    // Each Firestore batch is atomic. We deliberately finish the record update first;
    // audit/history failures must NEVER make already-transferred guards appear lost.
    for(let i=0;i<selected.length;i+=batchSize){
      const chunk=selected.slice(i,i+batchSize);
      const batch=db.batch();
      chunk.forEach(r=>{
        const ref=db.collection(RECORDS_COLLECTION).doc(r.id);
        const update={
          clientproject:target,
          updatedAt:now,
          lastTransferBatchId:batchId,
          lastTransferAt:now,
          lastTransferFrom:String(r.clientproject||''),
          lastTransferBy:(currentUser.email||'').toLowerCase()
        };
        if(targetSector) update.sector=targetSector;
        if(targetLocation) update.location=targetLocation;
        if(targetStation) update.deployloc=targetStation;
        batch.update(ref,update);
      });
      await batch.commit();
      moved += chunk.length;
    }

    // Verify the moved records before clearing the selection.
    let verified=0;
    for(let i=0;i<selected.length;i+=30){
      const chunk=selected.slice(i,i+30);
      const snap=await db.collection(RECORDS_COLLECTION)
        .where(firebase.firestore.FieldPath.documentId(),'in',chunk.map(r=>r.id))
        .get();
      snap.docs.forEach(d=>{
        if(String((d.data()||{}).clientproject||'').trim()===target) verified++;
      });
    }
    if(verified!==selected.length){
      throw new Error(`Transfer verification failed: ${verified} of ${selected.length} records are in the destination. No additional records were changed.`);
    }

    const historyPayload={
      batchId,
      fromSummary:sources,
      toClient:target,
      toSector:targetSector,
      toLocation:targetLocation||'',
      toStation:targetStation||'',
      guardCount:selected.length,
      guardIds:selected.map(r=>r.id).slice(0,1000),
      guardNames:selected.map(r=>r.name||'').slice(0,1000),
      reason,
      performedBy:(currentUser.email||'').toLowerCase(),
      createdAt:firebase.firestore.FieldValue.serverTimestamp()
    };

    // History/audit are secondary logging operations. If their rules are not yet
    // published, the transfer itself remains successful and the user gets a clear warning.
    const logWarnings=[];
    try{
      await db.collection(TRANSFER_HISTORY_COLLECTION).add(historyPayload);
    }catch(e){
      console.warn('Transfer succeeded but history could not be saved:',e);
      logWarnings.push('Transfer History permission is not configured yet.');
    }
    try{
      await writeAuditLog('BULK_TRANSFER',batchId,{count:selected.length,from:sources,toClient:target,toLocation:targetLocation,toStation:targetStation,reason});
    }catch(e){
      console.warn('Transfer succeeded but audit log could not be saved:',e);
      logWarnings.push('Audit Trail permission is not configured yet.');
    }

    window.selectedRecordIds=new Set();
    closeTransferModal();
    // onSnapshot normally refreshes automatically; force a render as well so the
    // destination assignment is visible immediately.
    await new Promise(r=>setTimeout(r,250));
    renderTable();
    if(logWarnings.length){
      showToast(`${moved} guard(s) transferred successfully. ${logWarnings.join(' ')}`);
    }else{
      showToast(`${moved} guard(s) transferred successfully to ${target}.`);
    }
  }catch(err){
    console.error(err);
    showToast('Transfer failed: '+(err.message||err));
  }
}

function formatTransferSources(v){
  if(Array.isArray(v)) return v.map(x=>Array.isArray(x)?`${x[0]} (${x[1]})`:String(x)).join(', ');
  return String(v||'');
}
function subscribeTransferHistory(){
  if(transferHistoryUnsub){transferHistoryUnsub();transferHistoryUnsub=null;}
  if(!isParent()) return;
  transferHistoryUnsub=db.collection(TRANSFER_HISTORY_COLLECTION).orderBy('createdAt','desc').limit(300).onSnapshot(snap=>{
    window.transferHistory=snap.docs.map(d=>({id:d.id,...d.data()}));
    renderTransferHistory();
  },err=>{
    console.error(err);
    const el=document.getElementById('transferHistoryTbody');
    if(el) el.innerHTML=`<tr><td colspan="6">Could not load transfer history: ${escapeHtml(err.message||'Unknown error')}</td></tr>`;
  });
}
function loadTransferHistory(){subscribeTransferHistory();}
function renderTransferHistory(){
  const tbody=document.getElementById('transferHistoryTbody'); if(!tbody) return;
  const q=(document.getElementById('transferHistorySearch')?.value||'').trim().toLowerCase();
  const rows=(window.transferHistory||[]).filter(x=>{
    if(!q) return true;
    return [formatTransferSources(x.fromSummary),x.toClient,x.toLocation,x.toStation,x.performedBy,x.batchId,x.reason,(x.guardNames||[]).join(' ')].some(v=>String(v||'').toLowerCase().includes(q));
  });
  tbody.innerHTML=rows.map(x=>`<tr>
    <td>${escapeHtml(formatAuditTime(x.createdAt))}<div class="audit-meta">${escapeHtml(x.batchId||'')}</div></td>
    <td>${escapeHtml(formatTransferSources(x.fromSummary)||'—')}</td>
    <td>${escapeHtml(x.toClient||'—')}</td>
    <td><strong>${Number(x.guardCount)||0}</strong></td>
    <td>${escapeHtml(x.performedBy||'—')}</td>
    <td>${escapeHtml(x.toLocation||'Keep')} / ${escapeHtml(x.toStation||'Keep')}</td>
  </tr>`).join('') || '<tr><td colspan="6">No transfer history found.</td></tr>';
}

function resetRegisterFilters(){
  ['searchBox','filterDateFrom','filterDateTo'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  ['filterClient','filterSector','filterLocation','filterSupervisor','filterStatus'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  const sf=document.getElementById('sortField'); if(sf) sf.value='sno'; const so=document.getElementById('sortOrder'); if(so) so.value='asc';
  window.selectedRecordIds=new Set(); renderTable();
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function updateStamp(){
  document.getElementById('stampCount').textContent = records.length;
}

/* ===================== Import Long Roll ===================== */
function normalizeHeader(v){
  return String(v ?? '').toLowerCase().replace(/[^a-z0-9]+/g,'').trim();
}

const IMPORT_ALIASES = {
  sno:['sno','serialno','serialnumber','srno','srnumber','serial'],
  msmno:['msmno','msmnumber','msmno.','employee no','employeeno'],
  doe:['doe','dateofemployment','dateofjoining','joiningdate','datejoining'],
  dischargemsm:['dischargedatemsm','dischargedatemsm','msmdischarge','dischargedate'],
  cashreliever:['cashreliver','cashreliever','cashrelievername'],
  uniformdate:['uniformlastdateofissue','uniformdate','uniformissue','lastuniformdate'],
  newold:['newold','new/old'],
  employmentStatus:['employmentstatus','employment status','employment_status','status','employeestatus','guardstatus'],
  supervisor:['supervisor'],
  clientproject:['clientproject','client','project','clientname'],
  location:['location','deploymentlocation','deployloc'],
  name:['employeename','name','employee'],
  father:['fathername','father'],
  cnic:['cnicno','cnicnumber','cnic'],
  cnicexpiry:['cnicexpirydate','cnicexpiry','expirydate'],
  armycivil:['armycivil','army/civil'],
  dob:['dob','dateofbirth','birthdate'],
  permaddr:['permanentaddress','permaddr','address'],
  armyno:['cnicarmy','armyno','armycnic'],
  photo:['photo','photograph'],
  policeverif:['policeverification','policeverif'],
  specialbranch:['specialbranchform','specialbranch'],
  apsaa:['apsaatraining','apsaa'],
  cell:['contactnumber','cellno','cell','mobileno','phone','phonenumber'],
  education:['education','qualification'],
  nokname:['nextofkinname','nokname','nextofkin'],
  nokcontact:['nextofkincontactnumber','nokcontact','nokcontactnumber','nokcnic'],
  iban:['iban'],
  bank:['bankname','bank'],
  actitle:['accounttitle','actitle'],
  remarks:['remarks','remark'],
  co:['co','careof'],
  mother:['mothername','mother'],
  domicile:['domicile'],
  blood:['employeebloodgroup','bloodgroup','blood'],
  height:['height'],
  marital:['maritalstatus','marital'],
  children:['noofchildren','numberofchildren','children'],
  cnicissue:['cnicissue','cnicissuedate','issuedate'],
  unitrank:['unit','unitrank','rank'],
  enrolldate:['enrolldate','enrollmentdate'],
  dischargedate_army:['dateofdischarge','dischargedatearmy','armydischargedate'],
  homecell:['homecellno','homecellphone','homecell','homephonenumber','homephone'],
  policestation:['policestation','policestationname'],
  curraddr:['currentaddress','curraddr'],
  joining:['dateofjoining','joiningdate','doe'],
  deployloc:['deploymentlocation','deployloc','location'],
  acno:['acno','accountno','accountnumber','a/cno'],
  branchname:['branchname','bankbranch','branch'],
  branchcode:['branchcode','branchcodeno']
};

function findImportColumn(headers, aliases){
  const map = new Map(headers.map((h,i)=>[normalizeHeader(h),i]));
  for(const a of aliases){
    const idx = map.get(normalizeHeader(a));
    if(idx !== undefined) return idx;
  }
  return -1;
}

let pendingImport = null;
function closeImportPreview(){ pendingImport=null; const m=document.getElementById('importPreviewModal'); if(m)m.style.display='none'; }
function importKey(v){ return String(v||'').trim().toLowerCase().replace(/[^a-z0-9]/g,''); }
function normalizeCnicKey(v){
  return String(v||'').trim().replace(/\s+/g,'').replace(/-/g,'').toLowerCase();
}
function mergeNonEmptyFields(base, incoming){
  const out={...base};
  Object.keys(incoming||{}).forEach(k=>{
    if(k.startsWith('__')) return;
    const v=incoming[k];
    if(v!==undefined && v!==null && String(v).trim()!=='') out[k]=v;
  });
  return out;
}
function collapseImportByCnic(imported){
  const out=[]; const by=new Map();
  imported.forEach(rec=>{
    const key=normalizeCnicKey(rec.cnic);
    if(!key){ out.push({...rec}); return; }
    if(!by.has(key)){ const copy={...rec}; by.set(key,out.length); out.push(copy); }
    else out[by.get(key)]=mergeNonEmptyFields(out[by.get(key)],rec);
  });
  return out;
}
function validateImportRows(imported){
  const byCnic=new Map();
  records.forEach(r=>{ const c=normalizeCnicKey(r.cnic); if(c && !byCnic.has(c)) byCnic.set(c,r.id); });
  const normalized=collapseImportByCnic(imported);
  return normalized.map((rec,idx)=>{
    const reasons=[]; const c=normalizeCnicKey(rec.cnic);
    if(!rec.name) reasons.push('Guard name missing');
    if(!c) reasons.push('CNIC missing');
    if(byCnic.has(c)) reasons.push('CNIC already exists — will update this guard');
    return {...rec,__row:idx+1,__ok:!reasons.some(x=>/missing/i.test(x)),__reason:reasons.join('; ')||'Ready to upsert'};
  });
}
function showImportPreview(rows,fileName){
  pendingImport={rows,fileName};
  const valid=rows.filter(r=>r.__ok).length, blocked=rows.length-valid;
  document.getElementById('importPreviewSubtitle').textContent=`${fileName} — review before writing to the database`;
  document.getElementById('importPreviewSummary').innerHTML=`<div class="transfer-card"><span>Total rows</span><b>${rows.length}</b></div><div class="transfer-card"><span>Ready</span><b>${valid}</b></div><div class="transfer-card"><span>Blocked</span><b>${blocked}</b></div>`;
  document.getElementById('importPreviewTbody').innerHTML=rows.slice(0,500).map(r=>`<tr><td>${r.__row}</td><td>${escapeHtml(r.name||'—')}</td><td>${escapeHtml(r.cnic||'—')}</td><td>${escapeHtml(r.msmno||'—')}</td><td>${escapeHtml(r.clientproject||'—')}</td><td>${r.__ok?'✅ Ready':'❌ Blocked'}</td><td>${escapeHtml(r.__reason)}</td></tr>`).join('');
  const btn=document.getElementById('confirmImportBtn'); btn.disabled=valid===0; btn.textContent=valid?`Confirm ${valid} Valid Row(s)`:'Nothing to Import';
  document.getElementById('importPreviewModal').style.display='flex';
}
function importLongRoll(file){
  if(!file) return;
  if(!currentAccess){ showToast('Please sign in first.'); return; }
  if(typeof XLSX==='undefined'){ showToast('Excel library is not available.'); return; }
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const wb=XLSX.read(e.target.result,{type:'array',cellDates:false}); const ws=wb.Sheets[wb.SheetNames[0]];
      const aoa=XLSX.utils.sheet_to_json(ws,{header:1,defval:''}); if(!aoa.length){showToast('The selected file is empty.');return;}
      let headerRow=0,bestScore=-1;
      for(let r=0;r<Math.min(10,aoa.length);r++){const score=aoa[r].reduce((n,v)=>{const h=normalizeHeader(v);return n+(Object.values(IMPORT_ALIASES).some(list=>list.some(a=>normalizeHeader(a)===h))?1:0);},0);if(score>bestScore){bestScore=score;headerRow=r;}}
      const headers=aoa[headerRow],colMap={}; for(const key of Object.keys(IMPORT_ALIASES)) colMap[key]=findImportColumn(headers,IMPORT_ALIASES[key]);
      const imported=[];
      for(let r=headerRow+1;r<aoa.length;r++){
        const row=aoa[r]; if(!row||row.every(v=>String(v??'').trim()===''))continue;
        const rec={}; for(const key of Object.keys(IMPORT_ALIASES)){const idx=colMap[key];rec[key]=idx>=0?String(row[idx]??'').trim():'';}
        if(!rec.name&&!rec.cnic&&!rec.msmno)continue;
        rec.clientproject=rec.clientproject||''; imported.push(rec);
      }
      if(!imported.length){showToast('No employee rows were found. Check the Long Roll headers.');return;}
      imported.forEach(rec=>{
        rec.clientproject=rec.clientproject||myClientProject();
        if(!isParent() && mySector()) rec.sector=rec.sector||mySector();
      });
      showImportPreview(validateImportRows(imported),file.name||'Import file');
    }catch(err){console.error(err);showToast('Could not read this Long Roll file: '+err.message);}finally{const input=document.getElementById('longRollImport');if(input)input.value='';}
  }; reader.readAsArrayBuffer(file);
}
async function confirmLongRollImport(){
  if(!currentAccess||!pendingImport)return;
  const rows=pendingImport.rows.filter(r=>r.__ok); if(!rows.length)return;
  const btn=document.getElementById('confirmImportBtn'); btn.disabled=true; btn.textContent='Upserting…';
  try{
    // CNIC is the unique guard identifier. Parent/Admin can match globally;
    // sector/client users are queried only inside their authorized Firestore scope.
    // This keeps the upsert secure and prevents permission-denied queries.
    const keys=[...new Set(rows.map(r=>normalizeCnicKey(r.cnic)).filter(Boolean))];
    const existingByCnic=await findScopedExistingByCnicKeys(keys);
    let nextSno=records.length?Math.max(...records.map(r=>Number(r.sno)||0))+1:1,added=0,updated=0;
    for(let i=0;i<rows.length;i+=400){
      const batch=db.batch();
      rows.slice(i,i+400).forEach(rec=>{
        const clean={...rec}; delete clean.__row; delete clean.__ok; delete clean.__reason;
        const cnicKey=normalizeCnicKey(clean.cnic); clean.cnicKey=cnicKey;
        clean.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
        const existing=existingByCnic.get(cnicKey);
        if(existing){
          // Only non-empty imported fields overwrite existing values. Untouched fields survive.
          // A blank Employment Status must NOT turn Left Job/Removed back to Active.
          const patch=mergeNonEmptyFields({},clean);
          delete patch.sno; delete patch.createdAt;
          batch.update(db.collection(RECORDS_COLLECTION).doc(existing.id),patch); updated++;
        } else {
          const ref=db.collection(RECORDS_COLLECTION).doc();
          clean.employmentStatus=clean.employmentStatus||'Active';
          batch.set(ref,{sno:clean.sno?(Number(clean.sno)||nextSno):nextSno,createdAt:firebase.firestore.FieldValue.serverTimestamp(),...clean});
          nextSno++; added++;
        }
      });
      await batch.commit();
    }
    try{await writeAuditLog('CNIC_UPSERT_IMPORT',pendingImport.fileName||'import',{count:rows.length,added,updated,uniqueIdentifier:'CNIC'});}catch(e){console.warn('Import succeeded; audit write failed:',e);}
    closeImportPreview(); showToast(`Import complete: ${added} added, ${updated} updated by CNIC.`); renderTable();
  }catch(err){console.error(err);showToast('Import failed before completion: '+err.message);}finally{btn.disabled=false;}
}
function getFilteredRecordsForExport(){
  const q=(document.getElementById('searchBox')?.value||'').trim().toLowerCase();
  const client=document.getElementById('filterClient')?.value||'', loc=document.getElementById('filterLocation')?.value||'', sup=document.getElementById('filterSupervisor')?.value||'', status=document.getElementById('filterStatus')?.value||'';
  const from=document.getElementById('filterDateFrom')?.value||'', to=document.getElementById('filterDateTo')?.value||'';
  const arr=records.filter(r=>{
    const hay=[r.name,r.cnic,r.msmno,r.cell,r.clientproject,r.location,r.deployloc,r.supervisor,r.unitrank].join(' ').toLowerCase();
    if(q&&!hay.includes(q))return false; if(client&&String(r.clientproject||'')!==client)return false; if(loc&&String(r.location||r.deployloc||'')!==loc)return false; if(sup&&String(r.supervisor||'')!==sup)return false; if(status&&normalizedStatus(r)!==status.toLowerCase())return false;
    const d=String(r.doe||r.enrolldate||r.joining||'').slice(0,10); if(from&&(!d||d<from))return false; if(to&&(!d||d>to))return false; return true;
  }); return arr;
}

/* ===================== Export to Excel (matches Long_roll_Format.xlsx) ===================== */
function exportExcel(){
  if(!records.length){
    showToast('No records to export yet.');
    return;
  }
  const company = document.getElementById('companyName').value.trim() || 'Company';
  const client = document.getElementById('filterClient').value.trim() || 'All Clients';
  const titleRow = [`Long Roll — ${company} — ${client}`];

  const header = COLUMNS.map(c=>c.label);
  const visible = getFilteredRecordsForExport();
  const rows = visible.map(r => COLUMNS.map(c => r[c.key] ?? ''));

  const aoa = [titleRow, header, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // merge title row across all columns
  ws['!merges'] = [{ s:{r:0,c:0}, e:{r:0,c:COLUMNS.length-1} }];
  ws['!cols'] = COLUMNS.map(()=>({wch:16}));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'long roll');

  const dateStr = new Date().toISOString().slice(0,10);
  const safeClient = client.replace(/[\\\/:*?"<>|]+/g,'-');
  const filename = `${safeClient}_Long_Roll_${dateStr}.xlsx`;
  XLSX.writeFile(wb, filename);
  showToast(`Exported ${visible.length} filtered record(s): ${filename}`);
}

/* ===================== Print — Employee Enrollment Form ===================== */
let printSourceId = null; // null = print the live New Entry form; else a record id

function printLiveForm(){
  printSourceId = null;
  doPrint();
}
function printRecordForm(id){
  printSourceId = id;
  doPrint();
}
async function doPrint(){
  try{
    await populatePrintTemplate();
    const template=document.getElementById('printFormTemplate');
    template.style.display='block';

    // Wait for every image used by the print layout and for browser fonts.
    const images=[...template.querySelectorAll('img')];
    await Promise.all(images.map(img=>{
      if(img.complete){
        return img.decode ? img.decode().catch(()=>{}) : Promise.resolve();
      }
      return new Promise(resolve=>{
        img.onload=resolve; img.onerror=resolve;
      });
    }));
    if(document.fonts && document.fonts.ready) await document.fonts.ready;

    fitPrintValues();

    // Give the browser one paint cycle so dynamically created verification
    // pages/canvases are included in the print tree before opening the dialog.
    await new Promise(requestAnimationFrame);
    await new Promise(resolve=>setTimeout(resolve,80));

    window.print();
  }catch(err){
    console.error('Print preparation failed:',err);
    showToast('Print could not be prepared. Please try again.');
  }
}

function getPrintData(){
  if(printSourceId){
    const rec = records.find(r=>r.id===printSourceId);
    if(rec) return rec;
  }
  // fall back to whatever is currently in the New Entry form (unsaved draft included)
  return readForm();
}

async function populatePrintTemplate(){
  const d = getPrintData();
  const formatDate = (val) => {
    if(!val) return '';
    const m = String(val).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : String(val);
  };
  const set = (id,val,isDate=false) => { const el=document.getElementById(id); if(el) el.textContent=isDate?formatDate(val):(val||''); };
  set('pf_name',d.name); set('pf_co',d.co); set('pf_father',d.father); set('pf_cnic',d.cnic);
  set('pf_cnicissue',d.cnicissue,true); set('pf_cnicexpiry',d.cnicexpiry,true); set('pf_dob',d.dob,true); set('pf_domicile',d.domicile);
  set('pf_armycivil',d.armycivil); set('pf_apsaa',d.apsaa); set('pf_unit',d.unitrank); set('pf_dischargedate',d.dischargedate_army,true);
  set('pf_education',d.education); set('pf_cell',d.cell); set('pf_blood',d.blood); set('pf_height',d.height);
  set('pf_curraddr',d.curraddr); set('pf_permaddr',d.permaddr); set('pf_policestation',d.policestation); set('pf_homecell',d.homecell); set('pf_policeverif',d.policeverif);
  set('pf_joining',d.joining||d.doe,true); set('pf_deployloc',d.deployloc||d.location); set('pf_children',d.children); set('pf_marital',d.marital);
  set('pf_nokname',d.nokname); set('pf_nokcontact',d.nokcontact); set('pf_actitle',d.actitle); set('pf_bank',d.bank);
  set('pf_branchcode',d.branchcode); set('pf_acno',d.acno); set('pf_branchname',d.branchname); set('pf_officeno',d.msmno); set('pf_remarks',d.remarks);
  set('pf_officedate',new Date().toISOString().slice(0,10),true);

  // Employee photo: always clipped to the official photo box; saved custom
  // zoom/position is applied without allowing the image to escape the box.
  const photoFrame = document.getElementById('pf_employeePhotoFrame');
  const photoEl = document.getElementById('pf_employeePhoto');
  if(d.photoData && d.photoData.startsWith('data:image')){
    photoFrame.style.display='block';
    photoEl.src = d.photoData;
    const ps = normalizePhotoSettings(d.photoSettings);
    photoEl.style.objectPosition='50% 50%';
    photoEl.style.transform=`translate(${ps.x/2}%, ${ps.y/2}%) scale(${ps.scale})`;
    photoEl.style.transformOrigin='center center';
    photoEl.style.width='100%';
    photoEl.style.height='100%';
    photoEl.style.objectFit='cover';
  } else {
    photoEl.removeAttribute('src');
    photoFrame.style.display = 'none';
  }

  // Police verification document page: support BOTH images and PDFs.
  // PDFs are rendered to a canvas with PDF.js before printing; this fixes the
  // previous blank 3rd page problem caused by accepting PDFs but only printing images.
  const existingVerifPage = document.getElementById('pf_policeVerifPage');
  if(existingVerifPage) existingVerifPage.remove();
  if(d.policeVerifDoc && (d.policeVerifDoc.startsWith('data:image') || d.policeVerifDoc.startsWith('data:application/pdf'))){
    const page = document.createElement('div');
    page.className = 'pf-print-page';
    page.id = 'pf_policeVerifPage';
    page.style.background = '#fff';
    const img = document.createElement('img');
    img.style.position='absolute'; img.style.inset='0'; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='contain';
    page.appendChild(img);
    document.getElementById('printFormTemplate').appendChild(page);
    if(d.policeVerifDoc.startsWith('data:image')){
      img.src=d.policeVerifDoc;
      if(img.decode){
        try{ await img.decode(); }catch(_e){}
      } else {
        await new Promise(resolve=>{
          if(img.complete) resolve();
          else { img.onload=resolve; img.onerror=resolve; }
        });
      }
    } else {
      await renderPolicePdfForPrint(d.policeVerifDoc, img, page);
    }
  }
}

async function renderPolicePdfForPrint(dataUrl, imgEl, pageEl){
  try{
    if(!window.pdfjsLib) throw new Error('PDF renderer is not loaded');
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const raw=atob(dataUrl.split(',')[1]);
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);

    const pdf=await pdfjsLib.getDocument({data:bytes}).promise;

    // Render every PDF page into an actual print page. Nothing is sent to
    // window.print() until all canvases have finished rendering.
    for(let i=1;i<=pdf.numPages;i++){
      const target=i===1?pageEl:document.createElement('div');

      if(i>1){
        target.className='pf-print-page';
        target.style.background='#fff';
        target.id='pf_policeVerifPage_'+i;
        document.getElementById('printFormTemplate').appendChild(target);
      }

      const canvas=document.createElement('canvas');
      const page=await pdf.getPage(i);
      const base=page.getViewport({scale:1});
      const scale=Math.min(816/base.width,1056/base.height);
      const viewport=page.getViewport({scale});

      canvas.width=Math.ceil(viewport.width);
      canvas.height=Math.ceil(viewport.height);
      canvas.style.position='absolute';
      canvas.style.left='50%';
      canvas.style.top='50%';
      canvas.style.transform='translate(-50%,-50%)';
      canvas.style.maxWidth='100%';
      canvas.style.maxHeight='100%';

      await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;

      if(i===1) imgEl.replaceWith(canvas);
      else target.appendChild(canvas);

      target.dataset.ready='1';
    }
  }catch(err){
    pageEl.innerHTML='<div style="padding:36px;font-family:Arial,sans-serif;color:#9B3A31;font-size:16px;text-align:center;">Police Verification PDF could not be rendered for printing.<br><small>Please re-upload the certificate or use an image (JPG/PNG).</small></div>';
    pageEl.dataset.ready='error';
    console.error('Police verification PDF render error:',err);
  }
}

function fitPrintValues(){
  // The supplied artwork is 1232px wide and prints at 8.5in (816 CSS px).
  // Keep entered values close to the artwork's own label font, then shrink
  // only when a value would overflow its allotted printed line.
  const PAGE_PX = 816;
  const baseSize = 11;
  const minSize = 8.5;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  document.querySelectorAll('#printFormTemplate .pf-value').forEach(el=>{
    const m = (el.getAttribute('style')||'').match(/width\s*:\s*([0-9.]+)%/);
    const maxWidth = m ? PAGE_PX * parseFloat(m[1]) / 100 : PAGE_PX;
    const text = el.textContent || '';
    let size = baseSize;

    while(size > minSize){
      ctx.font = `400 ${size}px Arial`;
      if(ctx.measureText(text).width <= maxWidth - 3) break;
      size -= 0.25;
    }

    el.style.fontSize = size.toFixed(2) + 'px';
    el.style.lineHeight = '1.05';
    el.style.transform = 'translateY(-1px)';
  });
}

window.addEventListener('beforeprint', ()=>{
  document.getElementById('printFormTemplate').style.display='block';
  fitPrintValues();
});
window.addEventListener('afterprint', ()=>{
  printSourceId = null;
  document.getElementById('printFormTemplate').style.display='';
});

/* ===================== Toast ===================== */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}

/* ===================== Init =====================
   No manual init needed here — initFirebase() (called near the top of this
   script) drives everything: it shows the login screen, checks
   authorizedUsers after sign-in, and calls startApp() once access is
   confirmed, which itself subscribes to the live Firestore data and
   renders the table. */

/* ===================== MSM Region + Sector Management ===================== */
const MSM_RECYCLE_COLLECTION = 'recycleBin';
const MSM_SECTOR_COLLECTION = 'sectorCatalog';
const MSM_REGION_COLLECTION = 'regionCatalog';
const MSM_DEFAULT_SECTORS = ['Islamabad','Rawalpindi','KPK','Chakwal'];
const MSM_DEFAULT_REGIONS = ['North Region','South Region','East Region','West Region'];
window.msmActiveSector = 'full';
window.msmActiveRegion = 'all';
window.msmRecycleUnsub = null;
window.msmSectorUnsub = null;
window.msmRegionUnsub = null;
window.msmSectorCatalog = [...MSM_DEFAULT_SECTORS];
window.msmRegionCatalog = MSM_DEFAULT_REGIONS.map(name=>({name,sectors:[]}));
window.msmSectorLoading = false;
window.msmRegionLoading = false;

function msmNormSectorName(v){ return String(v||'').trim().replace(/\s+/g,' ').replace(/[^\p{L}\p{N} _-]/gu,'').trim(); }
function msmNormRegionName(v){ return String(v||'').trim().replace(/\s+/g,' ').replace(/[^\p{L}\p{N} _-]/gu,'').trim(); }
function msmSectorKeyFromName(v){ return msmNormSectorName(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'other'; }
function msmRegionKeyFromName(v){ return msmNormRegionName(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'other-region'; }
function msmSectorOf(r){
  const raw=String((r&&r.sector)|| (r&&r.clientproject)||'').trim(), low=raw.toLowerCase();
  const hit=(window.msmSectorCatalog||[]).find(name=>low===String(name).toLowerCase() || low.includes(String(name).toLowerCase()));
  return hit || (raw ? 'Other Sectors' : 'Other Sectors');
}
function msmSectorKey(r){ return msmSectorKeyFromName(msmSectorOf(r)); }
function msmSectorByKey(key){ if(key==='full'||!key)return null; return (window.msmSectorCatalog||[]).find(n=>msmSectorKeyFromName(n)===key) || null; }
function msmRegionByKey(key){ if(key==='all'||!key)return null; return (window.msmRegionCatalog||[]).find(x=>msmRegionKeyFromName(x.name)===key) || null; }
function msmRegionForSector(name){
  const low=String(name||'').toLowerCase();
  return (window.msmRegionCatalog||[]).find(r=>(r.sectors||[]).some(s=>String(s).toLowerCase()===low)) || null;
}
function msmSectorsForRegion(region){ return (region?.sectors||[]).filter(Boolean).sort((a,b)=>a.localeCompare(b)); }
function msmInjectStyle(){
  if(document.getElementById('msmPhase1Style'))return;
  const s=document.createElement('style');s.id='msmPhase1Style';s.textContent=`
    .sector-nav{display:flex;justify-content:center;gap:7px;flex-wrap:wrap;margin:15px auto 0;max-width:1180px}
    .sector-nav .btn{background:rgba(255,255,255,.10);color:#fff;border-color:rgba(210,173,85,.60);font-size:11px;padding:8px 12px}
    .sector-nav .btn:hover{background:rgba(255,255,255,.18);color:#fff}
    .sector-nav .btn.active{background:rgba(210,173,85,.25);box-shadow:0 0 0 1px rgba(210,173,85,.35) inset}
    .msm-top-menu{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin:16px auto 0;max-width:1180px}
    .msm-top-menu button{border:1px solid rgba(210,173,85,.72);background:rgba(2,8,14,.78);color:#fff;border-radius:9px;padding:9px 13px;font-weight:900;font-size:10px;letter-spacing:.5px;cursor:pointer}
    .msm-top-menu button:hover{background:rgba(210,173,85,.18);transform:translateY(-1px)}
    .msm-region-panel{position:relative;z-index:2;margin:20px 0 0;padding:20px 18px;border:1px solid rgba(202,166,83,.55);border-radius:16px;background:rgba(3,8,13,.68);box-shadow:inset 0 0 22px rgba(202,166,83,.04),0 8px 24px rgba(0,0,0,.24)}
    .msm-region-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
    .msm-region-title{color:#f0d88f;font-weight:900;letter-spacing:2px;text-transform:uppercase;font-size:18px}
    .msm-region-sub{color:#bfc8d0;font-size:11px;margin-top:4px}
    .msm-region-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
    .msm-region-card{min-height:92px;padding:15px;border:1px solid rgba(202,166,83,.55);border-radius:14px;background:linear-gradient(135deg,rgba(255,255,255,.07),rgba(202,166,83,.06));color:#fff;cursor:pointer;text-align:left;transition:.18s ease}
    .msm-region-card:hover{transform:translateY(-2px);background:rgba(202,166,83,.14);box-shadow:0 8px 18px rgba(0,0,0,.22)}
    .msm-region-card.active{background:linear-gradient(135deg,rgba(202,166,83,.22),rgba(64,155,111,.12));border-color:#e1c36c;box-shadow:0 0 0 1px rgba(202,166,83,.18) inset}
    .msm-region-card strong{display:block;font-size:15px;letter-spacing:1px;text-transform:uppercase}.msm-region-card span{display:block;margin-top:6px;font-size:10px;color:#bfc8d0}
    .msm-sector-inside{margin-top:14px;padding-top:14px;border-top:1px solid rgba(202,166,83,.28)}
    .msm-sector-inside-title{color:#f0d88f;font-weight:900;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:8px}
    .msm-sector-chips{display:flex;gap:8px;flex-wrap:wrap}.msm-sector-chip{border:1px solid rgba(202,166,83,.55);background:rgba(255,255,255,.06);color:#fff;border-radius:999px;padding:8px 11px;cursor:pointer;font-size:10px;font-weight:900}.msm-sector-chip:hover{background:rgba(202,166,83,.16)}
    .sector-manage{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin:10px auto 0}.sector-manage .btn{font-size:11px}
    .sector-manager{padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--paper);margin:12px 0}.sector-manager-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.sector-manager-row input,.sector-manager-row select{flex:1;min-width:180px}.sector-list{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.sector-chip{display:inline-flex;align-items:center;gap:7px;padding:6px 9px;border:1px solid var(--line);border-radius:999px;background:#fff;font-size:12px}.sector-chip button{border:0;background:transparent;cursor:pointer;font-weight:700}
    .region-manager{margin-top:14px;padding-top:14px;border-top:1px solid var(--line)}.region-manager-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:10px}.region-manager-card{border:1px solid var(--line);border-radius:10px;padding:10px;background:#fff}.region-manager-card strong{display:block;font-size:12px}.region-manager-card small{color:var(--ink-soft)}.region-manager-card .mini-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.region-manager-card select{flex:1;min-width:150px}
    .recycle-summary{display:grid;grid-template-columns:repeat(3,minmax(120px,1fr));gap:10px;margin:12px 0}.recycle-card{padding:14px;border:1px solid var(--line);border-radius:10px;background:var(--paper)}.recycle-card span{display:block;font-size:11px;color:var(--ink-soft);text-transform:uppercase}.recycle-card strong{display:block;font-size:22px;margin-top:4px}
    @media(max-width:850px){.msm-region-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.region-manager-grid{grid-template-columns:1fr}}
    @media(max-width:650px){.recycle-summary{grid-template-columns:1fr}.msm-region-title{font-size:15px}.msm-region-card{min-height:72px;padding:11px}.msm-region-card strong{font-size:11px}.msm-region-card span{font-size:9px}.msm-top-menu button{font-size:9px;padding:8px 9px}}
  `;document.head.appendChild(s);
}
function msmPopulateSectorFilter(){
  const fs=document.getElementById('filterSector');if(!fs)return;const current=fs.value;
  fs.innerHTML='<option value="">All Sectors</option>'+(window.msmSectorCatalog||[]).map(n=>`<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('')+'<option value="Other Sectors">Other Sectors</option>';
  if([...fs.options].some(o=>o.value===current))fs.value=current;
}
function msmRenderRegionPanel(){
  const box=document.getElementById('msmRegionPanel');if(!box||!currentAccess)return;
  const parent=isParent(),own=normalizeSectorName(mySector()||myClientProject());
  const regions=parent?(window.msmRegionCatalog||[]):(own?[{name:(msmRegionForSector(own)?.name||'MY REGION'),sectors:[own]}]:[]);
  const activeRegion=parent?window.msmActiveRegion:'my-region';
  const activeSector=parent?window.msmActiveSector:(own?msmSectorKeyFromName(own):'full');
  box.style.display='block';
  let html=`<div class="msm-region-head"><div><div class="msm-region-title">REGIONS &amp; SECTORS</div><div class="msm-region-sub">${parent?'Select a Region to reveal its Sectors. Add as many Regions/Sectors as needed.':'Your authorized Region and Sector are shown below.'}</div></div></div>`;
  if(parent){
    html+=`<div class="msm-region-grid"><button class="msm-region-card ${activeRegion==='all'?'active':''}" onclick="msmOpenRegion('all')"><strong>FULL DATABASE</strong><span>All regions and all sectors</span></button>${regions.map(r=>{const k=msmRegionKeyFromName(r.name),count=msmSectorsForRegion(r).length;return `<button class="msm-region-card ${activeRegion===k?'active':''}" onclick="msmOpenRegion('${k}')"><strong>${escapeHtml(r.name)}</strong><span>${count} sector${count===1?'':'s'} assigned · Click to open</span></button>`}).join('')}</div>`;
  } else {
    html+=`<div class="msm-region-grid">${regions.map(r=>`<button class="msm-region-card active" onclick="msmOpenSector('${msmSectorKeyFromName(own)}')"><strong>${escapeHtml(r.name)}</strong><span>Authorized region · Click to open sector</span></button>`).join('')}</div>`;
  }
  let region=null;if(parent&&activeRegion!=='all')region=msmRegionByKey(activeRegion);if(!parent)region=regions[0];
  if(region){
    const sectors=msmSectorsForRegion(region);
    html+=`<div class="msm-sector-inside"><div class="msm-sector-inside-title">${escapeHtml(region.name)} · SECTORS</div><div class="msm-sector-chips">${sectors.length?sectors.map(n=>{const k=msmSectorKeyFromName(n);return `<button class="msm-sector-chip ${activeSector===k?'active':''}" onclick="msmOpenSector('${k}')">${escapeHtml(String(n).toUpperCase())} SECTOR</button>`}).join(''):'<span class="msm-region-sub">No sectors assigned yet. Use the manager below to add or assign one.</span>'}</div></div>`;
  }
  if(parent){
    html+=`<div class="msm-sector-inside"><div class="msm-sector-inside-title">QUICK ACCESS</div><div class="msm-sector-chips"><button class="msm-sector-chip" onclick="msmOpenSector('full')">FULL DATABASE</button><button class="msm-sector-chip" onclick="msmOpenRecycle()">♻ RECYCLE BIN</button></div></div>`;
  }else{
    html+=`<div class="msm-sector-inside"><div class="msm-sector-inside-title">QUICK ACCESS</div><div class="msm-sector-chips"><button class="msm-sector-chip" onclick="msmOpenMySector()">MY SECTOR</button><button class="msm-sector-chip" onclick="msmShowTab('form')">NEW ENTRY</button><button class="msm-sector-chip" onclick="msmShowTab('register')">REGISTER</button><button class="msm-sector-chip" onclick="msmOpenRecycle()">♻ RECYCLE BIN</button></div></div>`;
  }
  box.innerHTML=html;
}
function msmRenderSectorNav(){
  const nav=document.getElementById('msmParentSectorNav');if(!nav)return;nav.innerHTML='';nav.style.display='none';return;
  const buttons=[];
  buttons.push(`<button class="btn btn-sm ${msmActiveSector==='full'?'active':''}" onclick="msmOpenSector('full')">FULL DATABASE</button>`);
  if(isParent()){
    const region=msmRegionByKey(window.msmActiveRegion);const names=region?msmSectorsForRegion(region):(window.msmSectorCatalog||[]);
    names.forEach(name=>{const key=msmSectorKeyFromName(name);buttons.push(`<button class="btn btn-sm ${msmActiveSector===key?'active':''}" onclick="msmOpenSector('${key}')">${escapeHtml(name).toUpperCase()} SECTOR</button>`);});
  } else {const own=normalizeSectorName(mySector()||myClientProject());if(own)buttons.push(`<button class="btn btn-sm active" onclick="msmOpenSector('${msmSectorKeyFromName(own)}')">${escapeHtml(own).toUpperCase()} SECTOR</button>`);}
  buttons.push(`<button class="btn btn-sm" onclick="msmOpenRecycle()">♻ RECYCLE BIN</button>`);nav.innerHTML=buttons.join('');nav.style.display='grid';
}
function msmRenderTopMenu(){
  const portal=document.getElementById('sectorPortal');if(!portal||!currentAccess)return;
  let menu=document.getElementById('msmTopMenu');
  if(!menu){menu=document.createElement('div');menu.id='msmTopMenu';menu.className='msm-top-menu';}
  const anchor=portal.querySelector('.msm-client-section');
  if(anchor && menu.parentNode!==anchor.parentNode) anchor.parentNode.insertBefore(menu,anchor);
  else if(anchor && menu.previousElementSibling!==portal.querySelector('.sector-badge-row')) anchor.parentNode.insertBefore(menu,anchor);
  if(isParent()){
    menu.innerHTML=`<button onclick="msmScrollHome()">HOME</button><button onclick="msmScrollRegions()">REGIONS / SECTORS</button><button onclick="msmOpenSector('full')">FULL DATABASE</button><button onclick="msmShowTab('instructions')">INSTRUCTIONS</button><button onclick="msmShowTab('admin')">ADMIN ACCESS</button><button onclick="msmShowTab('audit')">AUDIT TRAIL</button><button onclick="msmOpenRecycle()">♻ RECYCLE BIN</button>`;
  }else{
    menu.innerHTML=`<button onclick="msmScrollHome()">HOME</button><button onclick="msmOpenMySector()">MY SECTOR</button><button onclick="msmShowTab('form')">NEW ENTRY</button><button onclick="msmShowTab('register')">REGISTER</button><button onclick="msmShowTab('instructions')">INSTRUCTIONS</button><button onclick="msmShowTab('audit')">AUDIT TRAIL</button><button onclick="msmOpenRecycle()">♻ RECYCLE BIN</button>`;
  }
}
function msmScrollHome(){document.getElementById('sectorPortal')?.scrollIntoView({behavior:'smooth',block:'start'});}
function msmScrollRegions(){document.getElementById('msmRegionPanel')?.scrollIntoView({behavior:'smooth',block:'center'});}
function msmOpenMySector(){const own=normalizeSectorName(mySector()||myClientProject());if(own)msmOpenSector(msmSectorKeyFromName(own));else showToast('No sector is assigned to this account.');}
function msmRenderSectorManager(){
  const box=document.getElementById('msmSectorManager');if(!box||!isParent())return;
  const regions=window.msmRegionCatalog||[];
  box.innerHTML=`<div class="helper-note"><strong>REGION / SECTOR MANAGER:</strong> Create as many Regions and Sectors as needed. Add a sector, then assign it to any Region. Moving a sector only changes its menu grouping; existing employee records are not deleted.</div>
    <div class="sector-manager-row"><input id="msmNewRegionName" class="search-input" placeholder="New Region e.g. North Region" onkeydown="if(event.key==='Enter')msmAddRegion()"><button class="btn btn-sm btn-primary" onclick="msmAddRegion()">+ Add Region</button></div>
    <div class="sector-manager-row" style="margin-top:8px"><input id="msmNewSectorName" class="search-input" placeholder="New Sector e.g. Peshawar Sector" onkeydown="if(event.key==='Enter')msmAddSector()"><select id="msmNewSectorRegion"><option value="">No Region / Unassigned</option>${regions.map(r=>`<option value="${escapeHtml(r.name)}">${escapeHtml(r.name)}</option>`).join('')}</select><button class="btn btn-sm btn-primary" onclick="msmAddSector()">+ Add Sector</button></div>
    <div class="region-manager-grid">${regions.map(r=>{const sectors=msmSectorsForRegion(r);return `<div class="region-manager-card"><strong>${escapeHtml(r.name)}</strong><small>${sectors.length} sector${sectors.length===1?'':'s'} assigned</small><div class="mini-row"><select id="regionMove_${msmRegionKeyFromName(r.name)}"><option value="">Select sector to add</option>${(window.msmSectorCatalog||[]).filter(s=>!sectors.some(x=>x.toLowerCase()===s.toLowerCase())).map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}</select><button class="btn btn-sm" onclick="msmAssignSectorToRegion('${encodeURIComponent(r.name)}')">Assign</button></div><div class="sector-list">${sectors.map(s=>`<span class="sector-chip">${escapeHtml(s)} <button title="Remove from region" onclick="msmUnassignSectorFromRegion('${encodeURIComponent(r.name)}','${encodeURIComponent(s)}')">×</button></span>`).join('')||'<span class="msm-region-sub">No sectors yet.</span>'}</div></div>`}).join('')}</div>`;
}
async function msmLoadRegionCatalog(){
  if(!db||window.msmRegionLoading)return;window.msmRegionLoading=true;
  try{
    const snap=await db.collection(MSM_REGION_COLLECTION).get();
    const docs=snap.docs.map(d=>({name:msmNormRegionName(d.data()?.name),sectors:Array.isArray(d.data()?.sectors)?d.data().sectors.map(msmNormSectorName).filter(Boolean):[]})).filter(x=>x.name);
    const map=new Map(docs.map(x=>[x.name.toLowerCase(),x]));
    for(const name of MSM_DEFAULT_REGIONS)if(!map.has(name.toLowerCase()))map.set(name.toLowerCase(),{name,sectors:[]});
    // One-time repair and ongoing self-heal: if built-in sectors exist but are not assigned,
    // keep the records untouched and place only unassigned built-ins under North Region.
    if(isParent()){
      const north=map.get('north region');
      const assigned=new Set([...map.values()].flatMap(r=>r.sectors||[]).map(x=>x.toLowerCase()));
      const missing=MSM_DEFAULT_SECTORS.filter(s=>!assigned.has(s.toLowerCase()));
      if(north && missing.length){
        north.sectors=[...new Set([...(north.sectors||[]),...missing])];
        await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(north.name)).set({name:north.name,sectors:north.sectors,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
        for(const sector of missing)await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(sector)).set({name:sector,region:north.name,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      }
    }
    window.msmRegionCatalog=[...map.values()].sort((a,b)=>a.name.localeCompare(b.name));
  }catch(e){console.warn('Region catalog unavailable; using built-in regions.',e.message);window.msmRegionCatalog=MSM_DEFAULT_REGIONS.map(name=>({name,sectors:[]}));}
  finally{window.msmRegionLoading=false;window.msmRegionUnsub=true;msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();}
}
async function msmLoadSectorCatalog(){
  if(!db||window.msmSectorLoading)return;window.msmSectorLoading=true;
  try{const snap=await db.collection(MSM_SECTOR_COLLECTION).orderBy('name').get();const docs=snap.docs.map(d=>d.data()||{});const names=docs.map(x=>msmNormSectorName(x.name)).filter(Boolean);window.msmSectorCatalog=[...new Map([...MSM_DEFAULT_SECTORS,...names].map(n=>[n.toLowerCase(),n])).values()];
    for(const d of docs){const n=msmNormSectorName(d.name),region=msmNormRegionName(d.region);if(n&&region){let r=msmRegionByKey(msmRegionKeyFromName(region));if(r&&!r.sectors.some(s=>s.toLowerCase()===n.toLowerCase()))r.sectors.push(n);}}
  }catch(e){console.warn('Sector catalog unavailable; using built-in sectors.',e.message);window.msmSectorCatalog=[...MSM_DEFAULT_SECTORS];}
  finally{window.msmSectorLoading=false;window.msmSectorUnsub=true;msmPopulateSectorFilter();msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();}
}
async function msmAddRegion(){
  if(!isParent())return;const input=document.getElementById('msmNewRegionName'),name=msmNormRegionName(input?.value);if(!name)return showToast('Enter a region name.');if((window.msmRegionCatalog||[]).some(r=>r.name.toLowerCase()===name.toLowerCase()))return showToast('That region already exists.');
  try{await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(name)).set({name,sectors:[],createdBy:(currentUser.email||'').toLowerCase(),createdAt:firebase.firestore.FieldValue.serverTimestamp()});window.msmRegionCatalog.push({name,sectors:[]});window.msmRegionCatalog.sort((a,b)=>a.name.localeCompare(b.name));input.value='';msmRenderSectorManager();msmRenderRegionPanel();await writeAuditLog('ADD_REGION',name,{region:name});showToast(`${name} added.`);}catch(e){showToast('Could not add region: '+e.message);}
}
async function msmAddSector(){
  if(!isParent())return;const input=document.getElementById('msmNewSectorName'),name=msmNormSectorName(input?.value),region=msmNormRegionName(document.getElementById('msmNewSectorRegion')?.value);if(!name)return showToast('Enter a sector name.');if((window.msmSectorCatalog||[]).some(n=>n.toLowerCase()===name.toLowerCase()))return showToast('That sector already exists.');
  try{
    await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(name)).set({name,region:region||'',createdBy:(currentUser.email||'').toLowerCase(),createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    window.msmSectorCatalog.push(name);window.msmSectorCatalog.sort((a,b)=>a.localeCompare(b));
    if(region){const r=msmRegionByKey(msmRegionKeyFromName(region));if(r){if(!r.sectors.some(s=>s.toLowerCase()===name.toLowerCase()))r.sectors.push(name);await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(r.name)).set({name:r.name,sectors:r.sectors,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}}
    input.value='';msmPopulateSectorFilter();msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();await writeAuditLog('ADD_SECTOR',name,{sector:name,region});showToast(`${name} Sector added${region?' to '+region:''}.`);
  }catch(e){console.error(e);showToast('Could not add sector: '+e.message);}
}
async function msmAssignSectorToRegion(encodedRegion){
  if(!isParent())return;const regionName=decodeURIComponent(encodedRegion),sel=document.getElementById('regionMove_'+msmRegionKeyFromName(regionName)),sector=msmNormSectorName(sel?.value);if(!sector)return showToast('Select a sector first.');const target=msmRegionByKey(msmRegionKeyFromName(regionName));if(!target)return;
  try{for(const r of window.msmRegionCatalog||[]){if(r.sectors.some(s=>s.toLowerCase()===sector.toLowerCase())){r.sectors=r.sectors.filter(s=>s.toLowerCase()!==sector.toLowerCase());await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(r.name)).set({name:r.name,sectors:r.sectors},{merge:true});}}
    if(!target.sectors.some(s=>s.toLowerCase()===sector.toLowerCase()))target.sectors.push(sector);await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(target.name)).set({name:target.name,sectors:target.sectors},{merge:true});await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(sector)).set({name:sector,region:target.name},{merge:true});msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();await writeAuditLog('ASSIGN_SECTOR_REGION',sector,{sector,region:target.name});showToast(`${sector} assigned to ${target.name}.`);
  }catch(e){showToast('Could not assign sector: '+e.message);}
}
async function msmUnassignSectorFromRegion(encodedRegion,encodedSector){
  if(!isParent())return;const regionName=decodeURIComponent(encodedRegion),sector=decodeURIComponent(encodedSector),r=msmRegionByKey(msmRegionKeyFromName(regionName));if(!r)return;try{r.sectors=r.sectors.filter(s=>s.toLowerCase()!==sector.toLowerCase());await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(r.name)).set({name:r.name,sectors:r.sectors},{merge:true});await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(sector)).set({name:sector,region:''},{merge:true});msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();await writeAuditLog('UNASSIGN_SECTOR_REGION',sector,{sector,region:regionName});showToast(`${sector} removed from ${regionName}.`);}catch(e){showToast('Could not remove sector from region: '+e.message);}
}
async function msmRemoveSector(encoded){
  if(!isParent())return;const name=decodeURIComponent(encoded);if(MSM_DEFAULT_SECTORS.some(n=>n.toLowerCase()===name.toLowerCase()))return showToast('Built-in sectors cannot be removed here.');if(!confirm(`Remove the ${name} Sector from the catalog? Existing employee records will NOT be deleted.`))return;
  try{await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(name)).delete();for(const r of window.msmRegionCatalog||[]){if(r.sectors.some(s=>s.toLowerCase()===name.toLowerCase())){r.sectors=r.sectors.filter(s=>s.toLowerCase()!==name.toLowerCase());await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(r.name)).set({name:r.name,sectors:r.sectors},{merge:true});}}window.msmSectorCatalog=window.msmSectorCatalog.filter(n=>n.toLowerCase()!==name.toLowerCase());if(msmSectorByKey(msmActiveSector)===name)msmActiveSector='full';msmPopulateSectorFilter();msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();renderTable();await writeAuditLog('REMOVE_SECTOR',name,{sector:name});showToast(`${name} Sector removed from the catalog.`);}catch(e){showToast('Could not remove sector: '+e.message);}
}
function msmOpenRegion(key){
  if(!isParent()){msmScrollRegions();return;}window.msmActiveRegion=key||'all';if(key==='all'){msmActiveSector='full';}else{const r=msmRegionByKey(key),first=msmSectorsForRegion(r)[0];msmActiveSector=first?msmSectorKeyFromName(first):'full';}msmRenderRegionPanel();msmRenderSectorNav();msmScrollRegions();if(msmActiveSector!=='full')msmOpenSector(msmActiveSector);else {const fs=document.getElementById('filterSector');if(fs)fs.value='';renderTable();}
}
function msmEnsureUI(){
  msmInjectStyle();if(!currentAccess)return;const portal=document.getElementById('sectorPortal');
  const frame=portal?.querySelector('.msm-master-frame');
  if(portal&&!document.getElementById('msmParentSectorNav')){const nav=document.createElement('div');nav.id='msmParentSectorNav';nav.className='sector-nav';frame?.appendChild(nav);}
  if(portal&&!document.getElementById('msmSectorManager')&&isParent()){const box=document.createElement('div');box.id='msmSectorManager';box.className='sector-manager';frame?.appendChild(box);}
  if(currentAccess&&!document.getElementById('msmRecycleTab')){const tabs=document.querySelector('.tabs');if(tabs){const b=document.createElement('button');b.id='msmRecycleTab';b.className='tab-btn';b.dataset.tab='recycle';b.textContent='♻ Recycle Bin';b.onclick=msmOpenRecycle;tabs.appendChild(b);}}
  if(currentAccess&&!document.getElementById('view-recycle')){const sheet=document.querySelector('#appRoot main .sheet');if(sheet){const v=document.createElement('div');v.id='view-recycle';v.style.display='none';v.innerHTML=`<div class="helper-note"><strong>Recycle Bin:</strong> Deleted employees are retained here. Parent/Admin can manage all records; sector users can manage only records in their assigned scope.</div><div class="recycle-summary"><div class="recycle-card"><span>Deleted Records</span><strong id="msmRecycleCount">0</strong></div><div class="recycle-card"><span>Access</span><strong id="msmRecycleAccess">Authorized Scope</strong></div><div class="recycle-card"><span>Permanent Delete</span><strong>Controlled</strong></div></div><div class="bulk-toolbar"><input class="search-input" id="msmRecycleSearch" placeholder="Search deleted guard, CNIC, MSM No., client, sector..." oninput="msmRenderRecycle()"><button class="btn btn-sm" onclick="msmLoadRecycle()">↻ Refresh</button><button class="btn btn-sm btn-primary" onclick="msmRecoverAll()">Recover All</button><button class="btn btn-sm btn-danger" onclick="msmEmptyRecycle()">Empty Recycle Bin</button></div><div class="table-wrap"><table class="register"><thead><tr><th>Deleted</th><th>Guard</th><th>CNIC</th><th>Guard ID</th><th>Client</th><th>Sector</th><th>Location</th><th>Deleted By</th><th>Actions</th></tr></thead><tbody id="msmRecycleTbody"><tr><td colspan="9">Loading…</td></tr></tbody></table></div>`;const audit=document.getElementById('view-audit');audit?audit.parentNode.insertBefore(v,audit):sheet.appendChild(v);}}
  msmRenderTopMenu();msmRenderSectorNav();msmRenderRegionPanel();msmRenderSectorManager();msmPopulateSectorFilter();
  if(!window.msmRegionUnsub){
    window.msmRegionUnsub='loading';
    msmLoadRegionCatalog().then(()=>{ if(isParent()&&!window.msmSectorUnsub){window.msmSectorUnsub='loading';msmLoadSectorCatalog();} });
  }
}

function msmShowTab(tab){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  ['form','register','instructions','admin','audit','recycle'].forEach(v=>{const e=document.getElementById('view-'+v); if(e)e.style.display=tab===v?'block':'none';});
  if(tab==='register') renderTable();
  if(tab==='audit'){renderAuditLogs();renderTransferHistory();}
  if(tab==='recycle'){if(!currentAccess)return;msmLoadRecycle();}
}
function msmOpenRecycle(){msmEnsureUI();msmShowTab('recycle');}
function msmSetSectorFilter(label){
  if(!isParent()) return;
  const v=String(label||'').trim();
  msmActiveSector=v?msmSectorKeyFromName(v):'full';
  renderTable(); msmRenderSectorNav();
}
function msmOpenSector(key){
  if(!isParent()){
    const own=normalizeSectorName(mySector()||myClientProject());
    const ownKey=own?msmSectorKeyFromName(own):'';
    if((key||'')!==ownKey) return showToast('This account can open only its authorized sector.');
    msmActiveSector=ownKey;
    msmShowTab('register'); renderTable(); msmRenderSectorNav(); msmRenderRegionPanel();
    return;
  }
  msmActiveSector=key||'full';
  const name=msmSectorByKey(msmActiveSector);
  const fs=document.getElementById('filterSector');
  if(fs)fs.value=name||'';
  msmShowTab('register'); renderTable(); msmRenderSectorNav(); msmRenderRegionPanel();
}
function msmFilterSector(r){
  if(!isParent()||!msmActiveSector||msmActiveSector==='full')return true;
  if(msmActiveSector==='other-sectors')return !msmSectorByKey(msmSectorKey(r));
  return msmSectorKey(r)===msmActiveSector;
}
function msmRecycleItemPayload(rec){
  return {originalRecordId:rec.id,recordData:rec,deletedBy:(currentUser?.email||'').toLowerCase(),deletedByRole:currentAccess?.role||'',deletedAt:firebase.firestore.FieldValue.serverTimestamp(),clientproject:rec.clientproject||'',sector:msmSectorOf(rec)};
}
async function msmMoveToRecycle(id, ask=true){
  const rec=records.find(r=>r.id===id); if(!rec)return false;
  if(ask && !confirm(`Move record #${rec.sno||''} — ${rec.name||''} to the Recycle Bin?`))return false;
  try{
    const batch=db.batch();
    const rr=db.collection(MSM_RECYCLE_COLLECTION).doc(id);
    batch.set(rr,msmRecycleItemPayload(rec));
    batch.delete(db.collection(RECORDS_COLLECTION).doc(id));
    await batch.commit();
    await writeAuditLog('DELETE_RECORD',id,{name:rec.name||'',cnic:rec.cnic||'',msmno:rec.msmno||'',clientproject:rec.clientproject||'',sector:msmSectorOf(rec),destination:'recycleBin'});
    showToast('Record moved to Recycle Bin.');
    return true;
  }catch(e){console.error(e);showToast('Could not move record to Recycle Bin: '+e.message);return false;}
}
async function msmBulkRecycle(){
  if(!isParent())return showToast('Only Parent can use bulk delete.');
  const ids=[...(window.selectedRecordIds||[])], rows=records.filter(r=>ids.includes(r.id)); if(!rows.length)return;
  if(!confirm(`Move ${rows.length} selected record(s) to the Recycle Bin?`))return;
  try{for(let i=0;i<rows.length;i+=300){const batch=db.batch();rows.slice(i,i+300).forEach(r=>{batch.set(db.collection(MSM_RECYCLE_COLLECTION).doc(r.id),msmRecycleItemPayload(r));batch.delete(db.collection(RECORDS_COLLECTION).doc(r.id));});await batch.commit();}await writeAuditLog('BULK_DELETE',rows.length,{count:rows.length,destination:'recycleBin'});window.selectedRecordIds=new Set();renderTable();showToast(`${rows.length} records moved to Recycle Bin.`);}catch(e){console.error(e);showToast('Bulk delete failed: '+e.message);}
}
function msmLoadRecycle(){
  if(!currentAccess)return; msmEnsureUI(); if(window.msmRecycleUnsub)window.msmRecycleUnsub();
  if(isParent()){
    window.msmRecycleUnsub=db.collection(MSM_RECYCLE_COLLECTION).orderBy('deletedAt','desc').limit(1000).onSnapshot(s=>{window.msmRecycleRows=s.docs.map(d=>({id:d.id,...d.data()}));msmRenderRecycle();},e=>{const t=document.getElementById('msmRecycleTbody');if(t)t.innerHTML=`<tr><td colspan="9">Could not load Recycle Bin: ${escapeHtml(e.message||'Unknown error')}</td></tr>`;});
    return;
  }
  const client=myClientProject(), sector=mySector(); let a=[],b=[];
  const merge=()=>{const m=new Map([...a,...b].map(x=>[x.id,x])); window.msmRecycleRows=[...m.values()].filter(x=>{const r=x.recordData||{};const rp=String(r.clientproject||x.clientproject||'').trim();const rs=String(r.sector||x.sector||'').trim();return sector ? (rs===sector || rp===sector || (!rs&&rp===client)) : rp===client;}).sort((x,y)=>recordTimestampValue(y.deletedAt)-recordTimestampValue(x.deletedAt));msmRenderRecycle();};
  const u1=db.collection(MSM_RECYCLE_COLLECTION).where('clientproject','==',client).onSnapshot(s=>{a=s.docs.map(d=>({id:d.id,...d.data()}));merge();},e=>console.warn('Recycle client query:',e.message));
  const u2=sector?db.collection(MSM_RECYCLE_COLLECTION).where('sector','==',sector).onSnapshot(s=>{b=s.docs.map(d=>({id:d.id,...d.data()}));merge();},e=>console.warn('Recycle sector query:',e.message)):null;
  window.msmRecycleUnsub=()=>{try{u1();}catch(e){}try{if(u2)u2();}catch(e){}};
}
function msmRenderRecycle(){
  const t=document.getElementById('msmRecycleTbody');if(!t)return;const q=(document.getElementById('msmRecycleSearch')?.value||'').trim().toLowerCase();
  const rows=(window.msmRecycleRows||[]).filter(x=>{const r=x.recordData||{};return !q||[r.name,r.cnic,r.msmno,r.clientproject,r.location,r.deployloc,x.sector,x.deletedBy].some(v=>String(v||'').toLowerCase().includes(q));});
  const c=document.getElementById('msmRecycleCount');if(c)c.textContent=(window.msmRecycleRows||[]).length;
  t.innerHTML=rows.map(x=>{const r=x.recordData||{};return `<tr><td>${escapeHtml(formatAuditTime(x.deletedAt))}</td><td>${escapeHtml(r.name||'—')}</td><td>${escapeHtml(r.cnic||'—')}</td><td>${escapeHtml(r.msmno||'—')}</td><td>${escapeHtml(r.clientproject||'—')}</td><td>${escapeHtml(x.sector||msmSectorOf(r))}</td><td>${escapeHtml(r.location||r.deployloc||'—')}</td><td>${escapeHtml(x.deletedBy||'—')}</td><td class="row-actions"><button class="btn btn-sm btn-primary" onclick="msmRecover('${x.id}')">Recover</button><button class="btn btn-sm btn-danger" onclick="msmPermanent('${x.id}')">Permanent Delete</button></td></tr>`;}).join('')||'<tr><td colspan="9">Recycle Bin is empty.</td></tr>';
}
async function msmRecover(id){
  if(!currentAccess)return;try{const ref=db.collection(MSM_RECYCLE_COLLECTION).doc(id),s=await ref.get();if(!s.exists)return showToast('Recycle Bin item no longer exists.');const x=s.data()||{},r=x.recordData||{},oid=x.originalRecordId;if(!oid)throw Error('Original record ID missing.');const exists=await db.collection(RECORDS_COLLECTION).doc(oid).get();if(exists.exists)return showToast('Original record already exists.');const b=db.batch();b.set(db.collection(RECORDS_COLLECTION).doc(oid),{...r,recoveredAt:firebase.firestore.FieldValue.serverTimestamp(),recoveredBy:(currentUser.email||'').toLowerCase()});b.delete(ref);await b.commit();await writeAuditLog('RECOVER_RECORD',oid,{name:r.name||'',cnic:r.cnic||'',clientproject:r.clientproject||'',sector:msmSectorOf(r)});showToast('Record recovered.');}catch(e){console.error(e);showToast('Recover failed: '+e.message);}
}
async function msmPermanent(id){
  if(!currentAccess)return;if(!confirm('Permanently delete this record? This cannot be undone.'))return;try{const ref=db.collection(MSM_RECYCLE_COLLECTION).doc(id),s=await ref.get();if(!s.exists)return;const x=s.data()||{},r=x.recordData||{};await ref.delete();await writeAuditLog('PERMANENT_DELETE',x.originalRecordId||id,{name:r.name||'',cnic:r.cnic||'',clientproject:r.clientproject||'',sector:msmSectorOf(r)});showToast('Permanently deleted.');}catch(e){showToast('Permanent delete failed: '+e.message);}
}
async function msmRecoverAll(){
  if(!currentAccess)return; const rows=window.msmRecycleRows||[];if(!rows.length)return showToast('Recycle Bin is empty.');if(!confirm(`Recover ${rows.length} record(s)?`))return;let n=0;for(const x of rows){try{const oid=x.originalRecordId,r=x.recordData||{};if(!oid)continue;const ex=await db.collection(RECORDS_COLLECTION).doc(oid).get();if(ex.exists)continue;const b=db.batch();b.set(db.collection(RECORDS_COLLECTION).doc(oid),{...r,recoveredAt:firebase.firestore.FieldValue.serverTimestamp(),recoveredBy:(currentUser.email||'').toLowerCase()});b.delete(db.collection(MSM_RECYCLE_COLLECTION).doc(x.id));await b.commit();n++;}catch(e){console.warn(e);}}await writeAuditLog('RECOVER_ALL','recycleBin',{requested:rows.length,recovered:n});showToast(`Recovered ${n} record(s).`);
}
async function msmEmptyRecycle(){
  if(!currentAccess)return; const rows=window.msmRecycleRows||[];if(!rows.length)return showToast('Recycle Bin is empty.');if(!confirm(`PERMANENTLY DELETE all ${rows.length} Recycle Bin records?`))return;try{for(let i=0;i<rows.length;i+=400){const b=db.batch();rows.slice(i,i+400).forEach(x=>b.delete(db.collection(MSM_RECYCLE_COLLECTION).doc(x.id)));await b.commit();}await writeAuditLog('EMPTY_RECYCLE_BIN','recycleBin',{count:rows.length});showToast('Recycle Bin emptied.');}catch(e){showToast('Empty Recycle Bin failed: '+e.message);}
}

const msmBaseSwitchTab = switchTab;
switchTab = function(tab){
  if(tab==='recycle'){if(!currentAccess)return msmBaseSwitchTab('register');msmEnsureUI();msmLoadRecycle();document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab==='recycle'));['form','register','instructions','admin','audit','recycle'].forEach(v=>{const e=document.getElementById('view-'+v);if(e)e.style.display=v==='recycle'?'block':'none';});return;}
  return msmBaseSwitchTab(tab);
};
const msmBaseSelectAllVisible = selectAllVisible;
selectAllVisible = function(checked){
  if(!isParent()||msmActiveSector==='full')return msmBaseSelectAllVisible(checked);
  window.selectedRecordIds=window.selectedRecordIds||new Set();const ids=[...document.querySelectorAll('#tbody .record-check')].map(e=>e.value).filter(Boolean);ids.forEach(id=>checked?window.selectedRecordIds.add(id):window.selectedRecordIds.delete(id));renderTable();
};
const msmBaseRenderTable = renderTable;
renderTable = function(){
  msmBaseRenderTable();
  if(isParent()&&msmActiveSector!=='full'){
    let visible=0;document.querySelectorAll('#tbody tr').forEach(tr=>{const id=tr.querySelector('.record-check')?.value;const r=records.find(x=>x.id===id);const show=!r||msmFilterSector(r);tr.style.display=show?'':'none';if(show)visible++;});const pill=document.getElementById('rowCountPill');if(pill)pill.textContent=`${visible} of ${records.length} entries`;
  }
};
setInterval(msmEnsureUI,1500);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
