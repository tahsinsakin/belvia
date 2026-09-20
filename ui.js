const $ = (id) => document.getElementById(id);
function esc(s){
  return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
    if(c === "&") return "\u0026amp;";
    if(c === "<") return "\u0026lt;";
    if(c === ">") return "\u0026gt;";
    if(c === '"') return "\u0026quot;";
    return "\u0026#39;";
  });
}
function goBtn(id, label){
  return '<button class="btn btn-g" type="button" data-act="go" data-go="'+id+'">'+label+'</button>';
}
function tip(s){
  return '<p style="margin:-2px 14px 10px;font-size:9px;line-height:1.35;color:#fff;opacity:.92">'+s+'</p>';
}
function nextStepTitle(){
  return '<p class="next-step" style="margin:0 0 12px;display:inline-block;padding:10px 12px;border:4px solid #000;font-size:24px;line-height:1.15;letter-spacing:.08em;text-transform:uppercase;color:#9b1218;font-weight:800">Do this next</p>';
}
function senecaQuote(){
  return '<p class="muted">There is no surer way to find out whether you like people or hate them than to travel with them.</p><p class="note">\u2014 Mark Twain</p>';
}
function davisQuote(){
  return '<p class="muted">An idiot admires complexity, a genius admires simplicity.</p><p class="note">\u2014 Terry A. Davis</p>';
}
function teach(title, body){
  return '<div class="card example-card" style="margin-top:18px"><div class="pad"><p class="kicker">How this works</p><h3>'+title+'</h3><p class="muted">'+body+'</p></div></div>';
}
function howCard(){
  return '<div class="card" style="margin-top:16px"><div class="pad"><p class="kicker">How to use</p><h3>One tap back into every app</h3><p class="muted">Buy the cheap ticket in Wizz, FlixBus, Airbnb, Booking. Then forget those apps. BudVia keeps the door. One tap here opens the same app that sold the ticket. Log the places you go with a photo and a note. The trip stays on this phone.</p></div><div class="pad" style="padding-top:0"><button class="btn btn-g" type="button" data-act="how">Read the full guide</button></div></div>';
}
function load(){ try { const raw = localStorage.getItem(KEY); return raw ? Object.assign(emptyState(), JSON.parse(raw)) : emptyState(); } catch(e){ return emptyState(); } }
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
let S = load();
let tab = "today";
let map = null;
let mapSig = "";
function hasTrip(){ return !!(S.meta.title || S.reminders.length); }
function placeBy(id){ return S.places.find(p => p.id === id); }
function deskLike(){
  return !/iPhone|iPad|iPod|Android.+Mobile/i.test(navigator.userAgent);
}
function webFor(scheme){
  const map={
    "wizzair://":"https://www.wizzair.com/",
    "flixbus://":"https://www.flixbus.com/",
    "airbnb://":"https://www.airbnb.com/",
    "booking://":"https://www.booking.com/",
    "bubi://":"https://molbubi.hu/",
    "timeleft://":"https://www.timeleft.com/",
    "nomadtable://":"https://www.nomadtable.com/"
  };
  return map[scheme]||"";
}
function mapsUrl(p){
  if(!p) return "";
  const q=encodeURIComponent(p.name+", "+p.address);
  if(deskLike() && !/Mac OS X|iPhone|iPad/.test(navigator.userAgent)) return "https://www.google.com/maps/search/?api=1&query="+q;
  return "https://maps.apple.com/?daddr="+q+"&dirflg=d&t=m";
}
function routeUrl(r){
  const a=placeBy(r.from), b=placeBy(r.to); if(!a||!b) return "";
  if(deskLike() && !/Mac OS X|iPhone|iPad/.test(navigator.userAgent)){
    return "https://www.google.com/maps/dir/?api=1&origin="+encodeURIComponent(a.name)+"&destination="+encodeURIComponent(b.name);
  }
  return "https://maps.apple.com/?saddr="+encodeURIComponent(a.name)+"&daddr="+encodeURIComponent(b.name)+"&dirflg="+(r.mode||"d")+"&t=m";
}
function fmtWhen(iso){
  if(!iso) return { day:"No time", time:"\u2014" };
  const parts = String(iso).split("T");
  const d = (parts[0]||"").split("-");
  if(d.length!==3) return { day:"No time", time:"\u2014" };
  const wd = new Date(Date.UTC(+d[0], +d[1]-1, +d[2])).getUTCDay();
  return { day: WEEK[wd] + " " + (+d[2]) + " " + MONTHS[+d[1]-1], time: (parts[1]||"\u2014").slice(0,5) };
}
function rangeLabel(){
  if(!S.meta.start) return "Saved on this phone";
  const a=S.meta.start.split("-"), b=(S.meta.end||S.meta.start).split("-");
  return (+a[2])+" "+MONTHS[+a[1]-1]+" \u2013 "+(+b[2])+" "+MONTHS[+b[1]-1];
}
function nextUp(){
  const now=Date.now();
  return S.reminders.filter(r=>r.at && !S.done[r.id]).map(r=>({r,t:Date.parse(r.at.length===16?r.at+":00":r.at)})).filter(x=>!Number.isNaN(x.t)&&x.t>=now-36e5).sort((a,b)=>a.t-b.t)[0];
}
function stamp(iso){ const [d,tm="09:00"]=String(iso).split("T"); return d.replace(/-/g,"")+"T"+tm.replace(":","")+"00"; }
function fold(s){ const txt=String(s).replace(/\n/g,"\\n").replace(/,/g,"\\,"); const o=[]; for(let i=0;i<txt.length;i+=74) o.push((i?" ":"")+txt.slice(i,i+74)); return o.join("\r\n"); }
function buildIcs(kind){
  const now=stamp(new Date().toISOString().slice(0,16));
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//BudVia//Travel//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:"+(S.meta.title||"BudVia")];
  S.reminders.filter(r=>r.at).forEach(r=>{
    const start=stamp(r.at);
    const hm=(r.at.split("T")[1]||"09:00").split(":");
    let eh=+hm[0], em=+hm[1]+40; if(em>=60){ eh+=1; em-=60; }
    const end=r.at.split("T")[0].replace(/-/g,"")+"T"+String(eh).padStart(2,"0")+String(em).padStart(2,"0")+"00";
    const place=placeBy(r.place);
    if(kind==="event"){
      lines.push("BEGIN:VEVENT","UID:"+r.id+"@budvia.app","DTSTAMP:"+now+"Z","DTSTART:"+start,"DTEND:"+end,fold("SUMMARY:"+r.title));
      if(r.notes) lines.push(fold("DESCRIPTION:"+r.notes));
      if(place){ lines.push(fold("LOCATION:"+place.address)); lines.push("GEO:"+place.lat+";"+place.lng); }
      lines.push("BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:-PT45M","DESCRIPTION:"+r.title,"END:VALARM","END:VEVENT");
    } else {
      lines.push("BEGIN:VTODO","UID:"+r.id+"-todo@budvia.app","DTSTAMP:"+now+"Z","DTSTART:"+start,"DUE:"+start,fold("SUMMARY:"+r.title),"STATUS:NEEDS-ACTION");
      if(r.notes) lines.push(fold("DESCRIPTION:"+r.notes));
      lines.push("BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:-PT30M","DESCRIPTION:"+r.title,"END:VALARM","END:VTODO");
    }
  });
  lines.push("END:VCALENDAR");
  return lines.join("\r\n")+"\r\n";
}
function downloadIcs(name,body){
  const blob=new Blob([body],{type:"text/calendar;charset=utf-8"});
  const file=new File([blob],name,{type:"text/calendar"});
  if(navigator.canShare && navigator.canShare({files:[file]})){ navigator.share({files:[file],title:name}).catch(function(){}); return; }
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove();
}
function openScheme(scheme){
  if(!scheme) return;
  const web=scheme.indexOf("http")===0?scheme:(webFor(scheme)||scheme);
  if(scheme.indexOf("http")===0 || deskLike()){
    window.open(web,"_blank","noopener,noreferrer");
    return;
  }
  var timer=setTimeout(function(){
    if(web && web!==scheme) window.open(web,"_blank","noopener,noreferrer");
  },800);
  try{ window.location.href=scheme; }catch(e){ clearTimeout(timer); window.open(web,"_blank","noopener,noreferrer"); }
}
function setTab(id){
  if(TABS.indexOf(id)<0) return;
  tab=id;
  document.querySelectorAll("#dock button").forEach(b=>b.classList.toggle("on", b.getAttribute("data-go")===id));
  const pager=$("pager");
  if(pager) pager.scrollLeft = TABS.indexOf(id) * pager.clientWidth;
  if(id==="map") setTimeout(ensureMap, 80);
}
function paintChrome(){
  $("hdrTitle").textContent = "BudVia";
  $("hdrSub").textContent = "Not all who wander are lost, especially with the right companion: Tolkien";
  if($("pills")) $("pills").innerHTML = "";
  if($("langBar")) $("langBar").innerHTML = "";
  const icons={
    today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
    plan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    pack:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 8V7a5 5 0 0 1 10 0v1M6 8h12l-1 13H7L6 8z"/></svg>',
    apps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>'
  };
  $("dock").innerHTML = TABS.map(id=>'<button type="button" data-go="'+id+'"'+(id===tab?' class="on"':'')+'>'+icons[id]+LABELS[id]+'</button>').join("");
}
function paintToday(){
  const root=$("page-today");
  const shot=teach("A trip is a name and two days","Write a name. Pick the first day and the last day.");
  const addBtn='<button class="btn btn-a" type="button" data-act="install">Add to Home Screen</button>';
  const tripShot=(typeof shotField==="function"?shotField("trip-new"):"");
  if(!hasTrip()){
    root.innerHTML='<p class="kicker">BUD&VIA</p><h2>Welcome to BudVia</h2>'+howCard()+'<div class="stack" style="margin-top:16px">'+addBtn+'<div class="card"><div class="pad"><p class="kicker">New trip</p><h3>Name your trip</h3></div><div class="field"><label>Name</label><input id="nTitle" placeholder="8-day trip to Luxembourg" /></div>'+tip("Write it like you say it. Example: 8-day trip to Luxembourg")+'<div class="grid2"><div class="field"><label>Starts</label><input id="nStart" type="date" /></div><div class="field"><label>Ends</label><input id="nEnd" type="date" /></div></div>'+tip("First day and last day. Example: 12 Dec to 20 Dec")+'<div class="field"><label>Code</label><input id="nPnr" placeholder="W6 2488" autocomplete="off" /></div>'+tip("Flight or booking code. Example: W6 2488. You can leave this empty.")+tripShot+'<div class="pad"><button class="btn btn-a" type="button" data-act="create">Save trip</button></div></div><button class="btn btn-g" type="button" data-act="demo">Load a sample trip</button></div>'+shot;
    return;
  }
  const n=nextUp();
  const nextCard=n
    ? '<div class="card"><div class="pad">'+nextStepTitle()+'<h3>'+esc(n.r.title)+'</h3><p class="note">'+esc(fmtWhen(n.r.at).day+' \u00b7 '+fmtWhen(n.r.at).time)+'</p>'+(n.r.notes?'<p class="note">'+esc(n.r.notes)+'</p>':'')+'</div><div class="pad" style="padding-top:0">'+goBtn("plan","Open times")+'</div></div>'
    : '<div class="card"><div class="pad">'+nextStepTitle()+'</div><div class="pad" style="padding-top:0">'+goBtn("plan","Open times")+'</div></div>';
  root.innerHTML=(S.meta.sample?'<div class="banner">This is a sample. Real codes are hidden.</div>':'')+'<p class="kicker">'+esc(rangeLabel())+'</p><h2>'+esc(S.meta.title || "BudVia")+'</h2>'+(S.meta.pnr?'<p class="muted">Code '+esc(S.meta.pnr)+'</p>':senecaQuote())+'<div class="stack" style="margin-top:16px">'+(typeof renderAirPair==="function"?renderAirPair():flightCard())+nextCard+addBtn+goBtn("apps","Open tickets")+'<button class="btn btn-g" type="button" data-act="how">How to use</button><button class="btn btn-g" type="button" data-act="wipe">Clear this phone</button></div>'+shot;
}
function flightCard(){
  const out=S.reminders.find(r=>r.id==="d14b"); const ret=S.reminders.find(r=>r.id==="d21c");
  if(!out) return "";
  const a=fmtWhen(out.at), b=ret?fmtWhen(ret.at):null;
  return '<div class="ticket"><p class="kicker">Flight</p><div class="codes"><div><div class="code">ESB</div><div class="city">Ankara</div></div><div class="mid">Wizz Air</div><div style="text-align:right"><div class="code">BUD</div><div class="city">Budapest</div></div></div><div class="meta"><div><span>Going</span><b>'+esc(a.day)+' \u00b7 '+esc(a.time)+'</b></div><div style="text-align:right"><span>Back</span><b>'+(b?esc(b.day+' \u00b7 '+b.time):'\u2014')+'</b></div></div></div>';
}
