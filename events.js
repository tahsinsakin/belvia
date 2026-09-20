(function(){
  [["./desk.css?v=en5"],["./compact.css?v=en10"]].forEach(function(pair){
    var l=document.createElement("link");
    l.rel="stylesheet";
    l.href=pair[0];
    document.head.appendChild(l);
  });
})();
function closeHow(){
  var el=$("howHint");
  if(el) el.classList.remove("show");
  try{ localStorage.setItem("budvia-how-4","1"); }catch(e){}
}
function showHow(force){
  try{ if(!force && localStorage.getItem("budvia-how-4")) return false; }catch(e){}
  var el=$("howHint");
  if(!el){
    el=document.createElement("div");
    el.id="howHint";
    el.className="overlay";
    el.innerHTML='<div class="sheet stack" style="max-height:86dvh;overflow:auto">'+
      '<p class="kicker">How to use</p>'+
      '<h3>All tickets in one place</h3>'+
      '<p class="muted">You buy cheap tickets in many apps. Then you forget which app has which ticket.</p>'+
      '<p class="muted">Put every ticket here. Tap Open site. That app opens. You can forget the other apps after that.</p>'+
      '<p class="muted">You can also save a place with a photo and a short note. This stays on this phone.</p>'+
      '<p class="muted"><b>1.</b> Write the trip name and the days.</p>'+
      '<p class="muted"><b>2.</b> Add each ticket. Tap Open site when you need that app.</p>'+
      '<p class="muted"><b>3.</b> Write the times.</p>'+
      '<p class="muted"><b>4.</b> Add places. Add a photo if you want.</p>'+
      '<p class="muted"><b>5.</b> Tick what is in the bag.</p>'+
      '<p class="muted"><b>6.</b> Add to Home Screen.</p>'+
      '<button class="btn btn-a" type="button" data-act="how-ok">Start</button>'+
      '</div>';
    document.body.appendChild(el);
    el.addEventListener("click", function(e){ if(e.target.id==="howHint") closeHow(); });
  }
  el.classList.add("show");
  return true;
}
function closeBagHint(){
  var el=$("bagHint");
  if(el) el.classList.remove("show");
  try{ sessionStorage.setItem("budvia-bag-hint-2","1"); }catch(e){}
}
function showBagHint(){
  try{ if(sessionStorage.getItem("budvia-bag-hint-2")) return; }catch(e){}
  var el=$("bagHint");
  if(!el){
    el=document.createElement("div");
    el.id="bagHint";
    el.className="overlay";
    el.innerHTML='<div class="sheet stack">'+
      '<p class="kicker">Do this first</p>'+
      '<h3>Pack the bag first</h3>'+
      '<p class="muted">Tick what is in the bag.</p>'+
      '<p style="margin:0 0 4px;font-size:9px;line-height:1.4;color:#fff;opacity:.92">Example: passport, charger, EU plug.</p>'+
      '<p style="margin:0 0 12px;font-size:9px;line-height:1.4;color:#fff;opacity:.92">You can skip this and name the trip instead.</p>'+
      '<button class="btn btn-a" type="button" data-act="bag-go">Pack the bag</button>'+
      '<button class="btn btn-g" type="button" data-act="bag-skip">Name the trip first</button>'+
      '</div>';
    document.body.appendChild(el);
    el.addEventListener("click", function(e){ if(e.target.id==="bagHint") closeBagHint(); });
  }
  el.classList.add("show");
}
function shotField(key){
  S.shots=S.shots||{};
  const src=S.shots[key];
  return '<div class="field shotbox"><label>Photo</label><input type="file" accept="image/*" data-shot="'+key+'" />'+(src?'<img alt="Attached photo" src="'+src+'"/>':'')+'</div>';
}
function storeShot(key, file){
  if(!file) return;
  const r=new FileReader();
  r.onload=function(){
    const img=new Image();
    img.onload=function(){
      const c=document.createElement("canvas");
      const max=900; let w=img.width,h=img.height;
      if(w>max){ h=Math.round(h*max/w); w=max; }
      if(h>max){ w=Math.round(w*max/h); h=max; }
      c.width=w; c.height=h;
      c.getContext("2d").drawImage(img,0,0,w,h);
      S.shots=S.shots||{};
      S.shots[key]=c.toDataURL("image/jpeg",0.7);
      save(); paintAll();
    };
    img.src=r.result;
  };
  r.readAsDataURL(file);
}
document.addEventListener("click", function(e){
  const goEl=e.target.closest("[data-go]");
  const actEl=e.target.closest("[data-act]");
  if(goEl && (!actEl || actEl===goEl || actEl.getAttribute("data-act")==="go")){ e.preventDefault(); setTab(goEl.getAttribute("data-go")); return; }
  if(!actEl) return;
  const act=actEl.getAttribute("data-act");
  if(act==="toggle"){ const id=actEl.getAttribute("data-id"); S.done[id]=!S.done[id]; save(); paintPlan(); paintToday(); }
  else if(act==="pack"){ const id=actEl.getAttribute("data-id"); S.packed[id]=!S.packed[id]; save(); paintPack(); }
  else if(act==="create"){ S.meta.title=((($("nTitle")||{}).value)||"").trim()||"Trip"; S.meta.start=(($("nStart")||{}).value)||""; S.meta.end=(($("nEnd")||{}).value)||""; S.meta.pnr=((($("nPnr")||{}).value)||"").trim(); S.meta.sample=false; save(); paintAll(); }
  else if(act==="demo"){ S=demoState(); S.tickets=S.tickets||[]; S.sim=S.sim||[]; S.packExtra=S.packExtra||[]; S.shots=S.shots||{}; save(); paintAll(); }
  else if(act==="wipe"){ if(confirm("Delete this trip from this phone?")){ S=emptyState(); save(); paintAll(); } }
  else if(act==="add"){ const title=((($("rTitle")||{}).value)||"").trim(); if(!title) return; const date=($("rDate")||{}).value; const time=($("rTime")||{}).value; S.reminders.push({id:"u"+Date.now(),title,notes:((($("rNotes")||{}).value)||"").trim(),list:(($("rList")||{}).value)||"prep",at:date?(date+"T"+(time||"09:00")):""}); save(); paintPlan(); paintToday(); }
  else if(act==="del-rem"){ S.reminders=S.reminders.filter(r=>r.id!==actEl.getAttribute("data-id")); save(); paintPlan(); paintToday(); }
  else if(act==="del-place"){ S.places=S.places.filter(p=>p.id!==actEl.getAttribute("data-id")); save(); paintMap(); }
  else if(act==="del-route"){ S.routes=S.routes.filter(r=>r.id!==actEl.getAttribute("data-id")); save(); paintMap(); }
  else if(act==="add-place"){
    const name=((($("pName")||{}).value)||"").trim(); if(!name) return;
    S.places.push({id:"p"+Date.now(),name:name,address:((($("pAddr")||{}).value)||"").trim(),lat:47.4979,lng:19.0402});
    save(); paintMap();
  }
  else if(act==="del-pack"){ if(S.packExtra) S.packExtra=S.packExtra.filter(x=>x.id!==actEl.getAttribute("data-id")); save(); paintPack(); }
  else if(act==="add-pack"){
    S.packExtra=S.packExtra||[];
    const label=((($("packTitle")||{}).value)||"").trim(); if(!label) return;
    S.packExtra.push({id:"x"+Date.now(),title:label});
    save(); paintPack();
  }
  else if(act==="del-ticket"){ if(!S.tickets) S.tickets=[]; const id=actEl.getAttribute("data-id"); S.tickets=S.tickets.filter(x=>x.id!==id); if(id==="ex1") S.hideSample=true; save(); paintApps(); paintToday(); }
  else if(act==="add-ticket"){
    if(!S.tickets) S.tickets=[];
    S.hideSample=true;
    S.tickets.push({id:"t"+Date.now(),kind:(($("tKind")||{}).value)||"flight",carrier:((($("tCarrier")||{}).value)||"").trim()||"Company",code:((($("tCode")||{}).value)||"").trim(),from:((($("tFrom")||{}).value)||"").trim(),to:((($("tTo")||{}).value)||"").trim(),fromCity:((($("tFromCity")||{}).value)||"").trim(),toCity:((($("tToCity")||{}).value)||"").trim(),title:((($("tCarrier")||{}).value)||"").trim(),at:((($("tAt")||{}).value)||"").replace(" ","T"),land:((($("tLand")||{}).value)||"").replace(" ","T"),pnr:((($("tCode")||{}).value)||"").trim(),note:""});
    save(); paintApps(); paintToday();
  }
  else if(act==="del-sim"){ if(!S.sim) S.sim=[]; S.sim=S.sim.filter(x=>x.id!==actEl.getAttribute("data-id")); save(); paintApps(); }
  else if(act==="add-sim"){
    if(!S.sim) S.sim=[];
    const name=((($("simName")||{}).value)||"").trim(); if(!name) return;
    S.sim.push({id:"s"+Date.now(),name:name,scheme:((($("simLink")||{}).value)||"").trim(),note:((($("simNote")||{}).value)||"").trim()});
    save(); paintApps();
  }
  else if(act==="app"){ openScheme(actEl.getAttribute("data-scheme")); }
  else if(act==="export"){ if(typeof paintExport==="function") paintExport(); $("export").classList.add("show"); }
  else if(act==="export-close"){ $("export").classList.remove("show"); }
  else if(act==="ics-cal"){ if(!S.reminders.some(r=>r.at)){ alert("Add a time first."); return; } downloadIcs("BudVia-Calendar.ics", buildIcs("event")); }
  else if(act==="ics-rem"){ if(!S.reminders.some(r=>r.at)){ alert("Add a time first."); return; } downloadIcs("BudVia-Reminders.ics", buildIcs("todo")); }
  else if(act==="install"){ if(window.BudViaInstall) window.BudViaInstall.add(); }
  else if(act==="how-ok"){ closeHow(); setTimeout(showBagHint, 200); }
  else if(act==="how"){ showHow(true); }
  else if(act==="bag-go"){ closeBagHint(); setTab("pack"); }
  else if(act==="bag-skip"){ closeBagHint(); }
});
$("export").addEventListener("click", function(e){ if(e.target.id==="export") $("export").classList.remove("show"); });
document.addEventListener("keydown", function(e){
  if(e.key!=="Escape") return;
  $("export").classList.remove("show");
  closeHow();
  closeBagHint();
});
document.addEventListener("change", function(e){
  if(e.target && e.target.id==="extra"){ S.extra=e.target.value; save(); }
  if(e.target && e.target.getAttribute && e.target.getAttribute("data-shot") && e.target.files && e.target.files[0]){
    storeShot(e.target.getAttribute("data-shot"), e.target.files[0]);
  }
});
(function(){
  const pager=$("pager"); if(!pager) return; let x0=0,y0=0,skip=false;
  pager.addEventListener("touchstart", function(e){ if(e.target.closest("#map, input, textarea, select")){ skip=true; return; } skip=false; x0=e.changedTouches[0].clientX; y0=e.changedTouches[0].clientY; }, {passive:true});
  pager.addEventListener("touchend", function(e){ if(skip) return; const dx=e.changedTouches[0].clientX-x0, dy=e.changedTouches[0].clientY-y0; if(Math.abs(dx)<56 || Math.abs(dx)<Math.abs(dy)*1.25) return; const i=TABS.indexOf(tab); if(dx<0 && i<TABS.length-1) setTab(TABS[i+1]); if(dx>0 && i>0) setTab(TABS[i-1]); }, {passive:true});
})();
window.addEventListener("resize", function(){ const pager=$("pager"); if(pager) pager.scrollLeft=TABS.indexOf(tab)*pager.clientWidth; if(map) map.invalidateSize(); });
function loadScript(src){
  return new Promise(function(ok){
    var s=document.createElement("script");
    s.src=src;
    s.onload=function(){ ok(); };
    s.onerror=function(){ ok(); };
    document.body.appendChild(s);
  });
}
loadScript("./i18n.js?v=en5").then(function(){
  return loadScript("./tickets.js?v=en9");
}).then(function(){
  return loadScript("./install.js?v=en5");
}).then(function(){
  if(!S.tickets) S.tickets=[];
  if(!S.sim) S.sim=[];
  if(!S.packExtra) S.packExtra=[];
  if(!S.shots) S.shots={};
  paintAll();
  setTimeout(function(){
    if(!showHow(false)) showBagHint();
  }, 300);
});
