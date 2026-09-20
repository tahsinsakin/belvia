function tip(s){ return '<p style="margin:-2px 14px 10px;font-size:9px;line-height:1.35;color:#fff;opacity:.92">'+s+'</p>'; }
function liveTickets(){
  if(!S.tickets) S.tickets = [];
  return S.tickets;
}
function liveSim(){
  if(!S.sim) S.sim = [];
  return S.sim;
}
function sampleTicket(){
  return {id:"ex1",kind:"flight",carrier:"Wizz Air",code:"W6 2488",from:"ESB",to:"BUD",fromCity:"Ankara",toCity:"Budapest",at:"2026-09-14T10:25",land:"2026-09-14T11:55",pnr:"\u2022\u2022\u2022\u2022\u2022\u2022",scheme:"wizzair://",note:"Sample. Delete it. Add yours."};
}
function untilLabel(iso){
  if(!iso) return "";
  const ts = Date.parse(iso.length === 16 ? iso + ":00" : iso);
  if(Number.isNaN(ts)) return "";
  const d = ts - Date.now();
  if(d <= 0) return "Done";
  const days = Math.floor(d / 864e5);
  const hrs = Math.floor((d % 864e5) / 36e5);
  const min = Math.floor((d % 36e5) / 6e4);
  if(days >= 1) return days + "d " + hrs + "h";
  return hrs + "h " + min + "m";
}
function renderTicket(item){
  const a = fmtWhen(item.at);
  const b = item.land ? fmtWhen(item.land) : null;
  const wait = untilLabel(item.at);
  const kind = item.kind === "coach" ? "Bus" : item.kind === "stay" ? "Stay" : "Flight";
  const left = item.kind === "stay" ? (item.title || item.carrier) : (item.from || "");
  const right = item.kind === "stay" ? (item.toCity || "") : (item.to || "");
  const leftCity = item.fromCity || "";
  const rightCity = item.kind === "stay" ? item.carrier : (item.toCity || "");
  const depL = item.kind === "stay" ? "Check-in" : "Leaves";
  const arrL = item.kind === "stay" ? "Check-out" : "Lands";
  const note = item.note || item.notes_en || "";
  return '<div class="ticket" style="margin-top:10px"><p class="kicker">'+esc(kind)+(wait?" \u00b7 "+esc(wait):"")+'</p>'+
    '<div class="codes"><div><div class="code">'+esc(left)+'</div><div class="city">'+esc(leftCity)+'</div></div>'+
    '<div class="mid">'+esc(item.carrier||"")+(item.code?"<br/>"+esc(item.code):"")+'</div>'+
    '<div style="text-align:right"><div class="code">'+esc(right)+'</div><div class="city">'+esc(rightCity)+'</div></div></div>'+
    '<div class="meta"><div><span>'+esc(depL)+'</span><b>'+esc(a.day+" \u00b7 "+a.time)+'</b></div>'+
    '<div style="text-align:right"><span>'+esc(arrL)+'</span><b>'+(b?esc(b.day+" \u00b7 "+b.time):"\u2014")+'</b></div></div>'+
    (item.pnr?'<p class="note" style="margin-top:10px">Code '+esc(item.pnr)+'</p>':'')+
    (note?'<p class="note">'+esc(note)+'</p>':'')+
    '<button class="btn btn-a" type="button" data-act="export" style="margin-top:12px">Save to calendar</button>'+
    (item.scheme?'<button class="btn btn-g" type="button" data-act="app" data-scheme="'+esc(item.scheme)+'" style="margin-top:8px">Open site</button>':'')+
    '<button class="btn btn-g" type="button" data-act="del-ticket" data-id="'+esc(item.id)+'" style="margin-top:8px">Delete ticket</button>'+
    '</div>';
}
function renderAirPair(){
  const list = liveTickets();
  if(list[0]) return renderTicket(list[0]);
  if(S.hideSample) return "";
  return renderTicket(sampleTicket());
}
function renderSimGate(){
  const list = liveSim();
  let html = '<div class="card" style="margin-top:14px"><div class="pad"><p class="kicker">After the SIM</p><h3>Apps after the SIM</h3></div>';
  if(!list.length) html += '<div class="pad"><p class="muted">None yet. Add one below.</p></div>';
  list.forEach(function(app, i){
    html += '<div class="row"><span class="when"><b>'+(i+1)+'</b><span>After SIM</span></span><span style="flex:1"><p class="ttl">'+esc(app.name)+'</p><p class="note">'+esc(app.note||"")+'</p></span><button class="act" type="button" data-act="app" data-scheme="'+esc(app.scheme||"")+'">Open</button><button class="act" type="button" data-act="del-sim" data-id="'+esc(app.id)+'">Delete</button></div>';
  });
  html += '<div class="field" style="padding-top:12px"><label>Name</label><input id="simName" placeholder="Wizz Air" /></div>';
  html += tip("App name. Example: Wizz Air");
  html += '<div class="field"><label>Link</label><input id="simLink" placeholder="https://www.wizzair.com/" /></div>';
  html += tip("Site link. Example: https://www.wizzair.com/");
  html += '<div class="field"><label>Note</label><input id="simNote" placeholder="Open after the local number works" /></div>';
  html += tip("When to open it. Example: Open after the local number works");
  html += '<div class="pad"><button class="btn btn-a" type="button" data-act="add-sim">Add after SIM apps</button></div></div>';
  return html;
}
function renderAddTicket(){
  return '<div class="card" style="margin-top:14px"><div class="pad"><p class="kicker">New</p><h3>Add a ticket</h3></div>'+
    '<div class="field"><label>Type</label><select id="tKind"><option value="flight">Flight</option><option value="coach">Bus</option><option value="stay">Stay</option></select></div>'+
    tip("Flight, bus, or stay")+
    '<div class="field"><label>Company</label><input id="tCarrier" placeholder="Wizz Air" /></div>'+
    tip("Who sold it. Example: Wizz Air")+
    '<div class="grid2"><div class="field"><label>From</label><input id="tFrom" placeholder="ESB" /></div><div class="field"><label>To</label><input id="tTo" placeholder="BUD" /></div></div>'+
    tip("Airport or station codes. Example: ESB to BUD")+
    '<div class="grid2"><div class="field"><label>From city</label><input id="tFromCity" placeholder="Ankara" /></div><div class="field"><label>To city</label><input id="tToCity" placeholder="Budapest" /></div></div>'+
    tip("City names. Example: Ankara to Budapest")+
    '<div class="grid2"><div class="field"><label>Leaves</label><input id="tAt" type="datetime-local" /></div><div class="field"><label>Lands</label><input id="tLand" type="datetime-local" /></div></div>'+
    tip("When it leaves and lands. Example: 14 Sep 10:25")+
    '<div class="field"><label>Code</label><input id="tCode" placeholder="W6 2488" /></div>'+
    tip("Flight or booking code. Example: W6 2488")+
    '<div class="pad"><button class="btn btn-a" type="button" data-act="add-ticket">Add ticket</button></div></div>';
}
function renderTicketBoard(){
  const list = liveTickets();
  let html = '<p class="kicker">Your tickets</p><h2>Tickets</h2><p class="muted">One card for each ticket.</p>';
  if(list.length){
    list.forEach(function(item){ html += renderTicket(item); });
  } else if(!S.hideSample){
    html += '<div class="banner" style="margin-top:10px">Sample card. Delete it when you add a real ticket.</div>';
    html += renderTicket(sampleTicket());
  }
  html += renderAddTicket();
  html += renderSimGate();
  html += '<div class="card" style="margin-top:14px"><div class="pad"><p class="kicker">Home screen</p><h3>Add to Home Screen</h3><p class="note">Safari or Chrome. Share, then Add to Home Screen. The trip stays here.</p></div><div class="pad" style="padding-top:0"><button class="btn btn-a" type="button" data-act="install">Add to Home Screen</button></div></div>';
  html += '<div class="card" style="margin-top:12px"><div class="pad"><p class="kicker">Save</p><h3>Calendar</h3><p class="note">Saves a file on this phone. Nothing is sent away.</p></div><div class="pad" style="padding-top:0"><button class="btn btn-a" type="button" data-act="export">Add to Calendar</button></div></div>';
  return html;
}
