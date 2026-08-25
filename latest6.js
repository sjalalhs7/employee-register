
/* MSM FINAL UI PATCH — Region/Sector manager, branded navigation, watermark, 3D record badge, PWA install */
(function(){
  'use strict';
  const style=document.createElement('style');
  style.id='msmFinalUiPatch';
  style.textContent=`
    /* ===== Brand / colour system ===== */
    #sectorPortal{background:
      radial-gradient(circle at 10% 8%,rgba(231,49,61,.20),transparent 28%),
      radial-gradient(circle at 90% 20%,rgba(37,83,177,.25),transparent 30%),
      linear-gradient(135deg,#07131f 0%,#11182a 46%,#260b1c 100%) !important;}
    .msm-master-frame{background:
      linear-gradient(135deg,rgba(6,17,30,.96),rgba(27,14,30,.95) 52%,rgba(8,23,42,.96)) !important;}
    .msm-master-frame:after{content:"";position:absolute;inset:0;pointer-events:none;z-index:-1;background:
      linear-gradient(120deg,rgba(226,42,61,.08),transparent 35%,rgba(36,91,190,.10) 72%,rgba(226,42,61,.06));}
    /* Real company-logo watermark on every signed-in home/sector portal */
    #sectorPortal .msm-master-frame:before{content:"";position:absolute;inset:16% 18% 10%;background:url('msm-security-guards-logo.png') center/520px auto no-repeat;opacity:.075;filter:grayscale(.15) saturate(1.15);pointer-events:none;z-index:0;mix-blend-mode:screen;}
    .msm-master-frame>*{position:relative;z-index:1;}

    /* ===== Upper navigation ===== */
    .msm-final-topnav{position:sticky;top:8px;z-index:50;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-6px 0 18px;padding:9px 10px;border:1px solid rgba(240,204,108,.60);border-radius:14px;background:linear-gradient(90deg,rgba(8,21,37,.96),rgba(76,13,35,.92),rgba(11,30,55,.96));box-shadow:0 10px 30px rgba(0,0,0,.28),inset 0 0 20px rgba(255,255,255,.035);backdrop-filter:blur(12px);}
    .msm-final-topnav .nav-brand{display:flex;align-items:center;gap:7px;margin-right:auto;color:#ffe39a;font-weight:1000;letter-spacing:.7px;font-size:11px;white-space:nowrap;}
    .msm-final-topnav .nav-brand img{width:34px;height:34px;object-fit:contain;border-radius:9px;background:#fff;padding:2px;box-shadow:0 0 0 1px rgba(240,204,108,.65);}
    .msm-final-topnav button{border:1px solid rgba(240,204,108,.68);background:linear-gradient(135deg,rgba(30,68,132,.72),rgba(124,17,43,.72));color:#fff;border-radius:9px;padding:8px 11px;font-size:10px;font-weight:1000;letter-spacing:.35px;cursor:pointer;transition:.16s ease;}
    .msm-final-topnav button:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(230,42,70,.22);}
    .msm-final-topnav .account{font-size:9px;color:#e9e1d1;opacity:.9;border-left:1px solid rgba(255,255,255,.15);padding-left:8px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
    #msmParentSectorNav{display:none !important;}
    .msm-company-strip{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:-8px 0 14px;padding:8px 10px;border:1px solid rgba(240,204,108,.35);border-radius:12px;background:linear-gradient(90deg,rgba(9,27,48,.92),rgba(50,10,32,.78));box-shadow:inset 0 0 18px rgba(255,255,255,.025);color:#e9e1d1;font-size:10px;}
    .msm-company-strip .company-main{font-weight:900;color:#ffe39a;letter-spacing:.4px;}
    .msm-company-strip .company-detail{opacity:.9;}
    .msm-company-strip .company-sector-links{display:flex;gap:5px;flex-wrap:wrap;margin-left:auto;}
    .msm-company-strip .sector-link{border:1px solid rgba(240,204,108,.45);border-radius:999px;padding:4px 8px;background:rgba(255,255,255,.05);color:#fff;cursor:pointer;font-weight:800;}
    .msm-company-strip .sector-link:hover{background:rgba(240,204,108,.14);transform:translateY(-1px);}
    .company-settings-grid textarea{width:100%;resize:vertical;font:inherit;padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--white);color:var(--ink);}
    @media(max-width:720px){.msm-company-strip{font-size:9px}.msm-company-strip .company-sector-links{width:100%;margin-left:0;overflow-x:auto;flex-wrap:nowrap;padding-bottom:2px}.msm-company-strip .sector-link{white-space:nowrap}.company-settings-grid{grid-template-columns:1fr !important;}}


    /* ===== Regions / manager ===== */
    .msm-region-panel{background:linear-gradient(135deg,rgba(9,34,55,.90),rgba(65,10,31,.78)) !important;border-color:rgba(240,204,108,.65) !important;}
    .msm-region-card{background:linear-gradient(135deg,rgba(21,70,117,.58),rgba(94,13,45,.56)) !important;border-color:rgba(240,204,108,.58) !important;color:#fff !important;min-height:84px !important;box-shadow:inset 0 0 20px rgba(255,255,255,.025),0 6px 18px rgba(0,0,0,.18);}
    .msm-region-card.active,.msm-region-card:hover{background:linear-gradient(135deg,rgba(32,104,174,.75),rgba(155,20,52,.70)) !important;transform:translateY(-1px);}
    .msm-sector-chip{background:linear-gradient(135deg,rgba(27,91,151,.72),rgba(122,16,45,.72)) !important;color:#fff !important;border-color:rgba(240,204,108,.65) !important;}
    .msm-sector-chip:hover,.msm-sector-chip.active{box-shadow:0 0 0 1px rgba(255,220,120,.28) inset,0 5px 15px rgba(220,30,65,.20);}
    .sector-manager{background:linear-gradient(135deg,rgba(12,34,54,.96),rgba(55,11,30,.94)) !important;border-color:rgba(240,204,108,.62) !important;box-shadow:0 12px 28px rgba(0,0,0,.22);}
    .sector-manager-row input,.sector-manager-row select,.region-manager-card select{background:#101e2e !important;color:#fff !important;border-color:rgba(240,204,108,.45) !important;}
    .region-manager-card{background:linear-gradient(135deg,rgba(19,64,104,.78),rgba(76,12,38,.75)) !important;border-color:rgba(240,204,108,.48) !important;color:#fff !important;}
    .region-manager-card small,.region-manager-card .msm-region-sub{color:#d8d3c7 !important;}
    .sector-chip{background:rgba(255,255,255,.08) !important;color:#fff !important;border-color:rgba(240,204,108,.45) !important;}
    .btn.btn-primary,.sector-manager .btn-primary{background:linear-gradient(135deg,#1f67b4,#b41f4a) !important;border-color:#f0cc6c !important;color:#fff !important;}

    /* ===== 3D diamond record counter ===== */
    .portal-record-stamp{width:102px !important;height:102px !important;min-width:102px !important;padding:0 !important;border:0 !important;border-radius:0 !important;background:linear-gradient(135deg,#122f55 0%,#6d1734 48%,#173e72 100%) !important;position:relative !important;clip-path:polygon(50% 0%,92% 50%,50% 100%,8% 50%);display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;text-align:center !important;box-shadow:0 0 0 2px rgba(240,204,108,.78),0 0 24px rgba(67,125,255,.28),0 0 35px rgba(231,49,61,.20) !important;animation:msmDiamondPulse 2.2s ease-in-out infinite;overflow:hidden;}
    .portal-record-stamp:before{content:"";position:absolute;inset:-30%;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.55) 49%,transparent 56%);animation:msmDiamondShine 2.7s linear infinite;}
    .portal-record-stamp .msm-record-top,.portal-record-stamp .n,.portal-record-stamp small{position:relative;z-index:2;text-shadow:0 1px 5px rgba(0,0,0,.65);}
    .portal-record-stamp .msm-record-top{font-size:8px !important;letter-spacing:1.5px;color:#ffe7a6 !important;}
    .portal-record-stamp .n{font-size:30px !important;font-weight:1000 !important;color:#fff !important;line-height:1 !important;}
    .portal-record-stamp small{font-size:7px !important;letter-spacing:1.5px;color:#ffe7a6 !important;}
    @keyframes msmDiamondPulse{0%,100%{filter:brightness(.98);box-shadow:0 0 0 2px rgba(240,204,108,.72),0 0 20px rgba(67,125,255,.22),0 0 24px rgba(231,49,61,.16)}50%{filter:brightness(1.18);box-shadow:0 0 0 2px rgba(255,232,146,.98),0 0 34px rgba(67,125,255,.40),0 0 42px rgba(231,49,61,.28)}}
    @keyframes msmDiamondShine{0%{transform:translateX(-55%) rotate(10deg)}100%{transform:translateX(55%) rotate(10deg)}}

    /* ===== Login/public navigation ===== */
    /* FINAL LOGIN HEADER FIX: keep public menu as a full-width top header, never beside the login card */
    #msmLoginPage{display:block !important;position:relative !important;min-height:100vh !important;padding:92px 14px 30px !important;}
    #msmLoginPage > .msm-public-nav{position:absolute !important;top:14px !important;left:50% !important;transform:translateX(-50%) !important;width:min(1100px,calc(100% - 28px)) !important;margin:0 !important;display:flex !important;flex-direction:row !important;align-items:center !important;justify-content:flex-start !important;z-index:50 !important;}
    #msmLoginPage > .msm-login-card{display:block !important;margin:0 auto !important;position:relative !important;z-index:2 !important;}
    @media(max-width:650px){
      #msmLoginPage{padding:126px 10px 24px !important;}
      #msmLoginPage > .msm-public-nav{top:10px !important;width:calc(100% - 20px) !important;}
      #msmLoginPage > .msm-public-nav .nav-brand{width:100% !important;margin-right:0 !important;justify-content:center !important;}
      #msmLoginPage > .msm-public-nav{justify-content:center !important;gap:5px !important;}
      #msmLoginPage > .msm-public-nav button{font-size:9px !important;padding:7px 8px !important;}
    }
    .msm-public-nav{position:relative;z-index:5;width:min(1100px,100%);display:flex;align-items:center;justify-content:flex-start;gap:7px;flex-wrap:wrap;margin:0 auto;padding:8px 10px;border:1px solid rgba(240,204,108,.55);border-radius:14px;background:linear-gradient(90deg,rgba(14,47,86,.94),rgba(105,15,43,.92),rgba(15,52,96,.94));box-shadow:0 8px 24px rgba(0,0,0,.25);backdrop-filter:blur(10px);}
    .msm-public-nav .nav-brand{display:flex;align-items:center;gap:8px;margin-right:auto;color:#ffe09a;font-weight:1000;letter-spacing:.7px;font-size:11px;white-space:nowrap;}
    .msm-public-nav .nav-brand img{width:34px;height:34px;object-fit:contain;border-radius:8px;background:#fff;padding:2px;}
    .msm-public-nav button{border:1px solid rgba(255,220,130,.55);background:rgba(0,0,0,.24);color:#fff;border-radius:8px;padding:8px 11px;font-weight:900;font-size:10px;cursor:pointer;}
    .msm-public-nav button:hover{background:rgba(255,255,255,.10);transform:translateY(-1px);}
    .msm-info-modal{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);}
    .msm-info-card{width:min(560px,94vw);max-height:85vh;overflow:auto;border:1px solid rgba(240,204,108,.72);border-radius:20px;padding:22px;background:linear-gradient(135deg,#0b2038,#431028);color:#fff;box-shadow:0 25px 80px rgba(0,0,0,.55);}
    .msm-info-card h2{margin:0 0 10px;color:#ffe09a;font-family:Georgia,serif;}
    .msm-info-card p,.msm-info-card li{color:#eee6d7;line-height:1.55;}
    .msm-info-close{float:right;border:1px solid rgba(255,220,130,.5);background:rgba(255,255,255,.08);color:#fff;border-radius:8px;padding:5px 9px;cursor:pointer;}
    @media(max-width:650px){.msm-public-nav .nav-brand{width:100%;margin-right:0}.msm-public-nav{justify-content:center}.msm-public-nav button{font-size:9px;padding:7px 8px}.msm-final-topnav .nav-brand{width:100%;margin-right:0}.msm-final-topnav{top:3px}.msm-final-topnav button{font-size:9px;padding:7px 8px}.portal-record-stamp{width:92px !important;height:92px !important;min-width:92px !important}.portal-record-stamp .n{font-size:26px !important;}}
  `;
  document.head.appendChild(style);

  let deferredInstallPrompt=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;});
  window.msmInstallApp=async function(){
    if(deferredInstallPrompt){deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice;}catch(_e){}deferredInstallPrompt=null;return;}
    if(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches){showToast('MSM Longroll is already installed as an app.');return;}
    showToast('Install option not shown yet. In Chrome use ⋮ > Add to Home screen / Install app.');
  };

  window.msmInfo=function(type){
    const data={
      about:{title:'About MSM Longroll',body:'MSM Security Company — MSM Longroll Database. A controlled employee enrollment, long-roll, region/sector and audit system designed for authorized users.'},
      services:{title:'Services',body:'Employee enrollment • Long Roll register • Region/Sector management • Excel import/export • Print forms • Audit trail • Recycle Bin • Authorized Gmail access.'},
      contact:{title:'Contact / Company',body:companyInfoBody()},
      company:{title:'Company Information',body:companyInfoBody()}
    }[type]||null;
    if(!data)return;
    const old=document.getElementById('msmInfoModal');if(old)old.remove();
    const modal=document.createElement('div');modal.id='msmInfoModal';modal.className='msm-info-modal';
    modal.innerHTML='<div class="msm-info-card"><button class="msm-info-close" onclick="document.getElementById(\'msmInfoModal\')?.remove()">✕</button><h2>'+escapeHtml(data.title)+'</h2><p>'+escapeHtml(data.body).replace(/\n/g,'<br>')+'</p><button class="btn btn-primary" onclick="document.getElementById(\'msmInfoModal\')?.remove()">Close</button></div>';
    modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});document.body.appendChild(modal);
  };

  function makePublicNav(){
    const page=document.getElementById('msmLoginPage');if(!page||document.getElementById('msmPublicNav'))return;
    const nav=document.createElement('div');nav.id='msmPublicNav';nav.className='msm-public-nav';
    nav.innerHTML='<div class="nav-brand"><img src="msm-security-guards-logo.png" alt="MSM logo"><span>MSM SECURITY GUARDS</span></div><button onclick="window.scrollTo({top:0,behavior:\'smooth\'})">HOME</button><button onclick="msmInfo(\'about\')">ABOUT</button><button onclick="msmInfo(\'services\')">SERVICES</button><button onclick="msmInfo(\'contact\')">CONTACT</button><button onclick="document.querySelector(\'.msm-google-btn\')?.click()">LOGIN</button><button onclick="msmInstallApp()">INSTALL APP</button>';
    page.insertBefore(nav,page.firstElementChild);
  }

  window.msmRenderTopMenu=function(){
    const portal=document.getElementById('sectorPortal');if(!portal||!currentAccess)return;
    const frame=portal.querySelector('.msm-master-frame');if(!frame)return;
    let nav=document.getElementById('msmFinalTopNav');
    if(!nav){nav=document.createElement('nav');nav.id='msmFinalTopNav';nav.className='msm-final-topnav';frame.insertBefore(nav,frame.firstElementChild);}
    const email=(currentUser&&currentUser.email)||'';
    const role=isParent()?'PARENT MASTER':'SECTOR USER';
    const x=window.msmCompanySettings||{};
    nav.innerHTML='<div class="nav-brand"><img src="msm-security-guards-logo.png" alt="MSM logo"><span>MSM LONGROLL</span></div>'+
      '<button onclick="msmScrollHome()">HOME</button><button onclick="msmScrollRegions()">REGIONS / SECTORS</button>'+
      (isParent()?'<button onclick="msmOpenSector(\'full\')">FULL DATABASE</button>':'<button onclick="msmOpenMySector()">MY SECTOR</button>')+
      '<button onclick="msmInfo(\'about\')">ABOUT</button><button onclick="msmInfo(\'services\')">SERVICES</button><button onclick="msmInfo(\'contact\')">CONTACT</button>'+
      '<button onclick="msmShowTab(\'instructions\')">INSTRUCTIONS</button>'+
      (isParent()?'<button onclick="msmShowTab(\'admin\');setTimeout(()=>document.getElementById(\'cs_companyName\')?.scrollIntoView({behavior:\'smooth\',block:\'center\'}),80)">COMPANY SETTINGS</button>':'')+
      (isParent()?'<button onclick="msmShowTab(\'admin\')">ADMIN</button>':'')+
      '<button onclick="msmShowTab(\'audit\')">AUDIT</button><button onclick="msmOpenRecycle()">♻ RECYCLE</button><button onclick="msmInstallApp()">INSTALL APP</button><button onclick="doSignOut()">SIGN OUT</button>'+
      '<span class="account" title="Authorized account">'+escapeHtml(email)+' · '+role+'</span>';
    let strip=document.getElementById('msmCompanyStrip');
    if(!strip){strip=document.createElement('div');strip.id='msmCompanyStrip';strip.className='msm-company-strip';nav.insertAdjacentElement('afterend',strip);}
    const sectors=(window.msmSectorCatalog||[]).slice(0,14);
    strip.innerHTML='<span class="company-main">'+escapeHtml(x.companyName||'MSM Security Guards')+'</span><span class="company-detail">'+escapeHtml(x.address||'')+'</span>'+
      '<span class="company-detail">☎ '+escapeHtml([x.phone1,x.phone2].filter(Boolean).join(' · '))+'</span>'+
      '<span class="company-sector-links">'+sectors.map(sec=>{const key=escapeHtml(msmSectorKeyFromName(sec));return '<button class="sector-link" data-sector="'+key+'">'+escapeHtml(sec)+'</button>';}).join('')+'</span>';
    strip.querySelectorAll('.sector-link').forEach(btn=>btn.addEventListener('click',()=>msmOpenSector(btn.dataset.sector)));
  };

  /* Robust region/sector operations: use the same Firestore collections but always refresh the UI. */
  window.msmAddRegion=async function(){
    if(!isParent())return showToast('Parent access is required to add a region.');
    if(!db)return showToast('Database is still loading. Try again in a moment.');
    const input=document.getElementById('msmNewRegionName'),name=msmNormRegionName(input?.value);
    if(!name)return showToast('Enter a region name.');
    if((window.msmRegionCatalog||[]).some(r=>String(r.name).toLowerCase()===name.toLowerCase()))return showToast('That region already exists.');
    try{
      const email=(currentUser&&currentUser.email||'').toLowerCase();
      await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(name)).set({name,sectors:[],createdBy:email,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      window.msmRegionCatalog=[...(window.msmRegionCatalog||[]),{name,sectors:[]}].sort((a,b)=>a.name.localeCompare(b.name));
      if(input)input.value='';msmRenderSectorManager();msmRenderRegionPanel();msmRenderTopMenu();showToast(name+' added successfully.');
    }catch(e){console.error('MSM Add Region failed',e); const msg=String(e?.code||'')==='permission-denied'?'Firebase permission denied. Publish the included firestore.rules to msm-security-guards-database, then refresh.':(e.message||e); showToast('Could not add region: '+msg);}
  };

  window.msmAddSector=async function(){
    if(!isParent())return showToast('Parent access is required to add a sector.');
    if(!db)return showToast('Database is still loading. Try again in a moment.');
    const input=document.getElementById('msmNewSectorName'),name=msmNormSectorName(input?.value),region=msmNormRegionName(document.getElementById('msmNewSectorRegion')?.value);
    if(!name)return showToast('Enter a sector name.');
    if((window.msmSectorCatalog||[]).some(n=>String(n).toLowerCase()===name.toLowerCase()))return showToast('That sector already exists.');
    try{
      const email=(currentUser&&currentUser.email||'').toLowerCase();
      await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(name)).set({name,region:region||'',createdBy:email,createdAt:firebase.firestore.FieldValue.serverTimestamp()});
      window.msmSectorCatalog=[...(window.msmSectorCatalog||[]),name].sort((a,b)=>a.localeCompare(b));
      if(region){let r=msmRegionByKey(msmRegionKeyFromName(region));if(!r){r={name:region,sectors:[]};window.msmRegionCatalog=[...(window.msmRegionCatalog||[]),r];await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(region)).set({name:region,sectors:[]},{merge:true});}if(!r.sectors.some(s=>s.toLowerCase()===name.toLowerCase()))r.sectors.push(name);await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(r.name)).set({name:r.name,sectors:r.sectors,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});}
      if(input)input.value='';msmPopulateSectorFilter();msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();msmRenderTopMenu();showToast(name+' Sector added'+(region?' to '+region:'')+'.');
    }catch(e){console.error('MSM Add Sector failed',e); const msg=String(e?.code||'')==='permission-denied'?'Firebase permission denied. Publish the included firestore.rules to msm-security-guards-database, then refresh.':(e.message||e); showToast('Could not add sector: '+msg);}
  };

  window.msmAssignSectorToRegion=async function(encodedRegion){
    if(!isParent())return showToast('Parent access is required.');
    const regionName=decodeURIComponent(encodedRegion||''),sel=document.getElementById('regionMove_'+msmRegionKeyFromName(regionName)),sector=msmNormSectorName(sel?.value),target=msmRegionByKey(msmRegionKeyFromName(regionName));
    if(!target)return showToast('Region not found. Refresh and try again.');
    if(!sector)return showToast('Select a sector first.');
    try{
      for(const r of window.msmRegionCatalog||[]){if(r.sectors.some(s=>s.toLowerCase()===sector.toLowerCase())){r.sectors=r.sectors.filter(s=>s.toLowerCase()!==sector.toLowerCase());await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(r.name)).set({name:r.name,sectors:r.sectors},{merge:true});}}
      if(!target.sectors.some(s=>s.toLowerCase()===sector.toLowerCase()))target.sectors.push(sector);
      await db.collection(MSM_REGION_COLLECTION).doc(msmRegionKeyFromName(target.name)).set({name:target.name,sectors:target.sectors,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
      await db.collection(MSM_SECTOR_COLLECTION).doc(msmSectorKeyFromName(sector)).set({name:sector,region:target.name},{merge:true});
      msmRenderSectorManager();msmRenderRegionPanel();msmRenderSectorNav();showToast(sector+' assigned to '+target.name+'.');
    }catch(e){console.error(e);showToast('Could not assign sector: '+(e.message||e));}
  };

  const originalManager=window.msmRenderSectorManager;
  window.msmRenderSectorManager=function(){
    if(!isParent()){return originalManager&&originalManager();}
    const box=document.getElementById('msmSectorManager');if(!box)return;
    const regions=window.msmRegionCatalog||[];
    box.innerHTML='<div class="helper-note"><strong>REGION / SECTOR MANAGER</strong><br>Create unlimited Regions and Sectors. Add a Sector directly into a Region, or move an existing Sector between Regions. Existing employee records are not deleted.</div>'+ 
      '<div class="sector-manager-row"><input id="msmNewRegionName" class="search-input" placeholder="New Region e.g. North Region"><button type="button" class="btn btn-sm btn-primary" id="msmAddRegionBtn">＋ Add Region</button></div>'+ 
      '<div class="sector-manager-row" style="margin-top:8px"><input id="msmNewSectorName" class="search-input" placeholder="New Sector e.g. Peshawar Sector"><select id="msmNewSectorRegion"><option value="">No Region / Unassigned</option>'+regions.map(r=>'<option value="'+escapeHtml(r.name)+'">'+escapeHtml(r.name)+'</option>').join('')+'</select><button type="button" class="btn btn-sm btn-primary" id="msmAddSectorBtn">＋ Add Sector</button></div>'+ 
      '<div class="region-manager-grid">'+regions.map(r=>{const sectors=msmSectorsForRegion(r);return '<div class="region-manager-card"><strong>'+escapeHtml(r.name)+'</strong><small>'+sectors.length+' sector'+(sectors.length===1?'':'s')+' assigned</small><div class="mini-row"><select id="regionMove_'+msmRegionKeyFromName(r.name)+'"><option value="">Select sector to add / move</option>'+ (window.msmSectorCatalog||[]).filter(s=>!sectors.some(x=>x.toLowerCase()===s.toLowerCase())).map(s=>'<option value="'+escapeHtml(s)+'">'+escapeHtml(s)+'</option>').join('') +'</select><button type="button" class="btn btn-sm" data-assign-region="'+encodeURIComponent(r.name)+'">Assign</button></div><div class="sector-list">'+(sectors.map(s=>'<span class="sector-chip">'+escapeHtml(s)+' <button type="button" title="Remove from region" data-unassign-region="'+encodeURIComponent(r.name)+'" data-unassign-sector="'+encodeURIComponent(s)+'">×</button></span>').join('')||'<span class="msm-region-sub">No sectors yet.</span>')+'</div></div>';}).join('')+'</div>';
    document.getElementById('msmAddRegionBtn')?.addEventListener('click',()=>window.msmAddRegion());
    document.getElementById('msmAddSectorBtn')?.addEventListener('click',()=>window.msmAddSector());
    document.getElementById('msmNewRegionName')?.addEventListener('keydown',e=>{if(e.key==='Enter')window.msmAddRegion();});
    document.getElementById('msmNewSectorName')?.addEventListener('keydown',e=>{if(e.key==='Enter')window.msmAddSector();});
    box.querySelectorAll('[data-assign-region]').forEach(b=>b.addEventListener('click',()=>window.msmAssignSectorToRegion(b.dataset.assignRegion)));
    box.querySelectorAll('[data-unassign-region]').forEach(b=>b.addEventListener('click',()=>window.msmUnassignSectorFromRegion(b.dataset.unassignRegion,b.dataset.unassignSector)));
  };

  function bootPublic(){makePublicNav();msmRenderTopMenu();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootPublic);else bootPublic();
})();

