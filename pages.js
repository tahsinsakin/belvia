if(typeof window.t!=="function") window.t=function(k){ return k; };
if(typeof window.renderTicketBoard!=="function") window.renderTicketBoard=function(){ return ""; };
if(typeof window.goBtn!=="function") window.goBtn=function(id,label){ return '<button class="btn btn-g" type="button" data-act="go" data-go="'+id+'">'+label+'</button>'; };
function tip(s){ return '<p style="margin:-2px 14px 10px;font-size:9px;line-height:1.35;color:#fff;opacity:.92">'+s+'</p>'; }
function teach(title, body){
  return '<div class="card example-card" style="margin-top:18px"><div class="pad"><p class="kicker">How this works</p><h3>'+title+'</h3><p class="muted">'+body+'</p></div></div>';
}
function paintPlan(){
  const groups={}; S.reminders.forEach(r=>{ const k=r.at?r.at.slice(0,10):"prep"; (groups[k]||(groups[k]=[])).push(r); });
  const keys=Object.keys(groups).sort();
  let html='<p class="kicker">Day by day</p><h2>Times</h2><p class="muted">One row. One time.</p><div class="stack">';
  if(!keys.length) html+='<div class="banner">Nothing here yet.</div>'+goBtn("today","Open trip");
  keys.forEach(k=>{
    html+='<div class="card"><div class="pad"><p class="kicker">'+(k==="prep"?"Before you leave":k)+'</p><h3>'+(k==="prep"?"Do these first":fmtWhen(k+"T12:00").day)+'</h3></div>';
    groups[k].forEach(r=>{
      const w=fmtWhen(r.at), place=placeBy(r.place);
      const shot=(S.shots&&S.shots[r.id])?'<img class="example-shot" alt="" src="'+S.shots[r.id]+'"/>':'';
      html+='<div class="row'+(S.done[r.id]?' on':'')+'"><button type="button" class="check" data-act="toggle" data-id="'+esc(r.id)+'"></button><span class="when"><span>'+esc(w.day)+'</span><b>'+esc(w.time)+'</b></span><span style="flex:1"><p class="ttl">'+esc(r.title)+'</p>'+(r.notes?'<p class="note">'+esc(r.notes)+'</p>':'')+shot+'</span>'+(place?'<a class="act" href="'+esc(mapsUrl(place))+'" rel="noopener noreferrer" target="_blank">Map</a>':'')+'<button class="act" type="button" data-act="del-rem" data-id="'+esc(r.id)+'">Delete</button></div>';
    });
    html+='</div>';
  });
  html+='</div><div class="card" style="margin-top:14px"><div class="pad"><p class="kicker">New</p><h3>Add a reminder</h3></div>';
  html+='<div class="field"><label>What happens</label><input id="rTitle" placeholder="Leave for the airport" /></div>';
  html+=tip("The action. Example: Leave for the airport");
  html+='<div class="grid2"><div class="field"><label>Day</label><input id="rDate" type="date" /></div><div class="field"><label>Time</label><input id="rTime" type="time" /></div></div>';
  html+=tip("Day and clock. Example: 17 Sep \u00b7 04:45");
  html+='<div class="field"><label>List</label><select id="rList">'+LISTS.map(l=>'<option value="'+l[0]+'">'+l[1]+'</option>').join("")+'</select></div>';
  html+=tip("Where this belongs. Example: Flight or Before you leave");
  html+='<div class="field"><label>Notes</label><textarea id="rNotes" rows="2" placeholder="Take a taxi"></textarea></div>';
  html+=tip("Extra line. Example: Take a taxi. Do not walk at this hour.");
  html+=(typeof shotField==="function"?shotField("plan-new"):"");
  html+='<div class="pad"><button class="btn btn-a" type="button" data-act="add">Add reminder</button></div></div>';
  html+=teach("One row, one time","Tick when done. Delete if you do not need it.");
  $("page-plan").innerHTML=html;
}
function paintMap(){
  let html='<p class="kicker">Pins</p><h2>Places</h2><p class="muted">Write the name. The map opens the closest match.</p><div class="mapwrap card"><button class="mapclose" type="button" data-act="go" data-go="today">Close</button><div id="map"></div></div><div class="card" style="margin-top:12px">';
  if(!S.places.length) html+='<div class="pad"><p class="muted">No places yet.</p></div><div class="pad" style="padding-top:0">'+goBtn("today","Open trip")+'</div>';
  else S.places.forEach(p=>{ html+='<div class="row"><span style="flex:1"><p class="ttl">'+esc(p.name)+'</p><p class="note">'+esc(p.address)+'</p></span><a class="act" href="'+esc(mapsUrl(p))+'" rel="noopener noreferrer" target="_blank">Map</a><button class="act" type="button" data-act="del-place" data-id="'+esc(p.id)+'">Delete</button></div>'; });
  html+='</div>';
  if(S.routes.length){ html+='<div class="card" style="margin-top:12px"><div class="pad"><p class="kicker">Routes</p><h3>Saved routes</h3></div>'; S.routes.forEach(r=>{ html+='<div class="row"><span style="flex:1"><p class="ttl">'+esc(r.label)+'</p><p class="note">'+esc(r.when)+'</p></span><a class="act" href="'+esc(routeUrl(r))+'" rel="noopener noreferrer" target="_blank">Open</a><button class="act" type="button" data-act="del-route" data-id="'+esc(r.id)+'">Delete</button></div>'; }); html+='</div>'; }
  html+='<div class="card" style="margin-top:12px"><div class="pad"><p class="kicker">New</p><h3>Add a place</h3></div>';
  html+='<div class="field"><label>Name</label><input id="pName" placeholder="BUD Terminal 2B" /></div>';
  html+=tip("The name people use. Example: BUD Terminal 2B");
  html+='<div class="field"><label>Address</label><input id="pAddr" placeholder="Budapest Airport arrivals" /></div>';
  html+=tip("Street or hall. Example: Budapest Airport arrivals");
  html+=(typeof shotField==="function"?shotField("place-new"):"");
  html+='<div class="pad"><button class="btn btn-a" type="button" data-act="add-place">Add place</button></div></div>';
  html+=teach("Name finds the pin","Write the place name. The map jumps to the closest match. Map opens Apple Maps on a phone.");
  $("page-map").innerHTML=html; map=null; mapSig="";
  if(tab==="map") setTimeout(ensureMap, 80);
}
function ensureMap(){
  const el=$("map"); if(!el || typeof L==="undefined") return;
  const sig=S.places.map(p=>p.id+":"+(p.lat||"")+":"+(p.lng||"")).join(",");
  if(map && mapSig===sig){ map.invalidateSize(); return; }
  if(map){ try{ map.remove(); }catch(e){} map=null; }
  const start=S.places[0]||{lat:47.5,lng:19.05};
  map=L.map(el,{zoomControl:true,attributionControl:false});
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(map);
  const pts=[];
  S.places.forEach(function(p){
    if(typeof p.lat!=="number" || typeof p.lng!=="number") return;
    const mk=L.circleMarker([p.lat,p.lng],{radius:8,color:"#2a140a",weight:2,fillColor:"#d9782e",fillOpacity:1}).addTo(map);
    mk.bindPopup(esc(p.name));
    pts.push([p.lat,p.lng]);
  });
  if(pts.length>1) map.fitBounds(pts,{padding:[28,28]});
  else if(pts.length===1) map.setView(pts[0],13);
  else map.setView([start.lat,start.lng],5);
  mapSig=sig;
  setTimeout(function(){ if(map) map.invalidateSize(); },80);
  setTimeout(function(){ if(map) map.invalidateSize(); },320);
}
function paintPack(){
  const extra = S.packExtra || [];
  const done=PACK.reduce((n,g)=>n+g[1].filter(i=>S.packed[i[0]]).length,0)+extra.filter(i=>S.packed[i.id]).length;
  const total=PACK.reduce((n,g)=>n+g[1].length,0)+extra.length;
  let html='<p class="kicker" id="packCount">'+done+' / '+total+' packed</p><h2>Bag</h2><p class="muted">Tick what is in the bag.</p><div class="stack">';
  PACK.forEach(g=>{ html+='<div class="card"><div class="pad"><p class="kicker">Kit</p><h3>'+esc(g[0])+'</h3></div>'; g[1].forEach(item=>{ html+='<button type="button" class="row'+(S.packed[item[0]]?' on':'')+'" data-act="pack" data-id="'+item[0]+'"><span class="check"></span><span><p class="ttl">'+esc(item[1])+'</p>'+(item[2]?'<p class="note">'+esc(item[2])+'</p>':'')+'</span></button>'; }); html+='</div>'; });
  html+='<div class="card"><div class="pad"><p class="kicker">Yours</p><h3>Extra items</h3></div>';
  if(!extra.length) html+='<div class="pad"><p class="muted">None yet. Add one below.</p></div>';
  extra.forEach(item=>{
    html+='<div class="row'+(S.packed[item.id]?' on':'')+'"><button type="button" class="check" data-act="pack" data-id="'+esc(item.id)+'"></button><span style="flex:1"><p class="ttl">'+esc(item.title)+'</p></span><button class="act" type="button" data-act="del-pack" data-id="'+esc(item.id)+'">Delete</button></div>';
  });
  html+='<div class="field" style="padding-top:12px"><label>Item</label><input id="packTitle" placeholder="EU plug" /></div>';
  html+=tip("One extra thing. Example: EU plug");
  html+='<div class="pad"><button class="btn btn-a" type="button" data-act="add-pack">Add bag item</button></div></div>';
  html+='</div><div class="card" style="margin-top:12px"><div class="field" style="padding-top:14px"><label>Bag notes</label><textarea id="extra" rows="3" placeholder="Power bank in the small bag.">'+esc(S.extra)+'</textarea></div>'+tip("Short note. Example: Power bank in the small bag.")+(typeof shotField==="function"?shotField("bag-notes"):"")+'</div>';
  html+=teach("Packed / total","The number at the top is the whole bag.");
  $("page-pack").innerHTML=html;
}
function paintApps(){
  $("page-apps").innerHTML=renderTicketBoard()+
    '<div class="stack" style="margin-top:12px">'+goBtn("plan","Open times")+'</div>'+
    '<div class="card" style="margin-top:12px"><div class="pad"><p class="kicker">Contact</p><h3>BUD&VIA</h3><img class="example-shot" alt="BudVia otter brand photo by Tahsin Sakin" src="./0875CF7C-5ACB-48B1-B2CD-57E02C5C9B58.jpeg?v=en5"/><p class="note">An idiot admires complexity, a genius admires simplicity.</p><p class="note">\u2014 Terry A. Davis</p><p class="note">This stays on the phone. No login. No tracking.</p><p class="note">Made by Tahsin Sakin. Ankara.</p><p class="note"><a class="act" href="https://www.linkedin.com/in/tahsin-sakin-390961199" rel="noopener noreferrer" target="_blank">LinkedIn</a></p><p class="note"><a class="act" href="https://github.com/tahsinsakin/budvia" rel="noopener noreferrer" target="_blank">GitHub</a></p><p class="note"><a class="act" href="./privacy.html">Privacy</a> · <a class="act" href="./terms.html">Terms</a> · <a class="act" href="./cookies.html">Cookies</a> · <a class="act" href="./refund.html">Refunds</a></p></div></div>';
}
function paintAll(){ paintChrome(); paintToday(); paintPlan(); paintMap(); paintPack(); paintApps(); if(typeof paintExport==="function") paintExport(); }
