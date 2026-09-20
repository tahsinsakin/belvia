function scanStatus(msg){
  var el=$("scanStatus");
  if(el) el.textContent=msg||"";
}
function pad2(n){ return String(n).padStart(2,"0"); }
function knownCity(code){
  const map={ESB:"Ankara",IST:"Istanbul",SAW:"Istanbul",AYT:"Antalya",ADB:"Izmir",ADA:"Adana",ECN:"Ercan",COV:"Gazimagusa",BUD:"Budapest",DEB:"Debrecen",VIE:"Vienna",PRG:"Prague",KRK:"Krakow",WAW:"Warsaw",WMI:"Warsaw",KTW:"Katowice",GDN:"Gdansk",OTP:"Bucharest",SOF:"Sofia",BEG:"Belgrade",ZAG:"Zagreb",LJU:"Ljubljana",MXP:"Milan",BGY:"Milan",FCO:"Rome",CIA:"Rome",BCN:"Barcelona",MAD:"Madrid",AMS:"Amsterdam",BRU:"Brussels",CDG:"Paris",ORY:"Paris",LTN:"London",STN:"London",LGW:"London",LHR:"London",SEN:"London",FRA:"Frankfurt",MUC:"Munich",BER:"Berlin",DUS:"Dusseldorf",CGN:"Cologne",HAM:"Hamburg",ATH:"Athens",SKG:"Thessaloniki",TIA:"Tirana",SJJ:"Sarajevo",TZX:"Trabzon",GZT:"Gaziantep",VAN:"Van",DIY:"Diyarbakir",SZF:"Samsun",ASR:"Kayseri",BJV:"Bodrum",DLM:"Dalaman",NAV:"Nevsehir",KCM:"Kahramanmaras"};
  return map[code]||"";
}
function parseWhenList(text){
  const out=[];
  const raw=String(text||"").toUpperCase();
  const months={JAN:"01",FEB:"02",MAR:"03",APR:"04",MAY:"05",JUN:"06",JUL:"07",AUG:"08",SEP:"09",OCT:"10",NOV:"11",DEC:"12"};
  raw.replace(/\b(20\d{2})[-./](\d{1,2})[-./](\d{1,2})(?:[ T](\d{1,2})[:.](\d{2}))?/g, function(_,y,mo,d,h,mi){
    out.push(y+"-"+pad2(mo)+"-"+pad2(d)+"T"+pad2(h||"09")+":"+(mi||"00"));
    return _;
  });
  raw.replace(/\b(\d{1,2})[-./](\d{1,2})[-./](20\d{2})(?:[ T](\d{1,2})[:.](\d{2}))?/g, function(_,d,mo,y,h,mi){
    out.push(y+"-"+pad2(mo)+"-"+pad2(d)+"T"+pad2(h||"09")+":"+(mi||"00"));
    return _;
  });
  raw.replace(/\b(\d{1,2})\s+(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[A-Z]*\.?\s+(20\d{2})(?:\s+(\d{1,2})[:.](\d{2}))?/g, function(_,d,mon,y,h,mi){
    out.push(y+"-"+months[mon]+"-"+pad2(d)+"T"+pad2(h||"09")+":"+(mi||"00"));
    return _;
  });
  raw.replace(/\b(\d{1,2})[:.](\d{2})\b/g, function(_,h,mi){
    if(out.length && out[0].slice(-5)==="09:00") out[0]=out[0].slice(0,11)+pad2(h)+":"+mi;
    else if(out.length===1) out.push(out[0].slice(0,11)+pad2(h)+":"+mi);
    return _;
  });
  return out;
}
function parseTicketText(raw){
  const text=String(raw||"");
  const up=text.toUpperCase();
  const out={kind:"flight",carrier:"",code:"",from:"",to:"",fromCity:"",toCity:"",at:"",land:"",pnr:"",scheme:""};
  if(/FLIX|COACH|\bBUS\b/.test(up) && !/BOARDING|GATE|FLIGHT/.test(up)) out.kind="coach";
  if((/AIRBNB|BOOKING\.COM|\bHOTEL\b|CHECK-?IN/.test(up)) && !/BOARDING|FLIGHT NO/.test(up)) out.kind="stay";
  if(/WIZZ/.test(up)){ out.carrier="Wizz Air"; out.scheme="wizzair://"; }
  else if(/RYANAIR/.test(up)) out.carrier="Ryanair";
  else if(/PEGASUS/.test(up)) out.carrier="Pegasus";
  else if(/TURKISH|\bTHY\b|\bTK\b/.test(up)) out.carrier="Turkish Airlines";
  else if(/LUFTHANSA/.test(up)) out.carrier="Lufthansa";
  else if(/FLIX/.test(up)){ out.carrier="FlixBus"; out.scheme="flixbus://"; }
  else if(/AIRBNB/.test(up)){ out.carrier="Airbnb"; out.scheme="airbnb://"; }
  else if(/BOOKING/.test(up)){ out.carrier="Booking"; out.scheme="booking://"; }
  else if(/SUNEXPRESS|SUN EXPRESS/.test(up)) out.carrier="SunExpress";
  else if(/AJET|ANADOLUJET/.test(up)) out.carrier="AJet";
  const fl=up.match(/\b([A-Z]{2})\s?(\d{2,4})\b/);
  if(fl) out.code=fl[1]+" "+fl[2];
  const pnr=up.match(/\bPNR[:\s-]*([A-Z0-9]{5,7})\b/) || up.match(/\bBOOKING(?:\sREF(?:ERENCE)?)?[:\s-]*([A-Z0-9]{5,7})\b/);
  if(pnr) out.pnr=pnr[1];
  const stop={THE:1,AND:1,FOR:1,YOU:1,AIR:1,DAY:1,MON:1,TUE:1,WED:1,THU:1,FRI:1,SAT:1,SUN:1,JAN:1,FEB:1,MAR:1,APR:1,MAY:1,JUN:1,JUL:1,AUG:1,SEP:1,OCT:1,NOV:1,DEC:1,PNR:1,REF:1,GATE:1,SEAT:1,ROW:1,UTC:1,GMT:1,CET:1,EST:1,STD:1,STA:1,DEP:1,ARR:1,ETA:1,ETD:1,TO:1,VIA:1,APP:1,QR:1,PDF:1,WWW:1,COM:1,NET:1};
  const codes=[];
  up.replace(/\b([A-Z]{3})\b/g, function(_,c){ if(!stop[c] && knownCity(c)) codes.push(c); return _; });
  if(codes[0]) out.from=codes[0];
  if(codes[1]) out.to=codes[1];
  if(out.from) out.fromCity=knownCity(out.from);
  if(out.to) out.toCity=knownCity(out.to);
  const when=parseWhenList(up);
  if(when[0]) out.at=when[0];
  if(when[1]) out.land=when[1];
  return out;
}
function fillTicketForm(p){
  if(!p) return;
  function set(id,v){ const el=$(id); if(el && v) el.value=v; }
  set("tKind", p.kind);
  set("tCarrier", p.carrier);
  set("tFrom", p.from);
  set("tTo", p.to);
  set("tFromCity", p.fromCity);
  set("tToCity", p.toCity);
  set("tAt", p.at);
  set("tLand", p.land);
  set("tCode", p.code || p.pnr);
}
function loadTess(){
  if(window.Tesseract) return Promise.resolve();
  return new Promise(function(ok,err){
    var s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
    s.onload=function(){ ok(); };
    s.onerror=function(){ err(new Error("reader missing")); };
    document.head.appendChild(s);
  });
}
function shrinkShot(file){
  return new Promise(function(ok){
    const r=new FileReader();
    r.onload=function(){
      const img=new Image();
      img.onload=function(){
        const c=document.createElement("canvas");
        const max=1400; let w=img.width,h=img.height;
        if(w>max){ h=Math.round(h*max/w); w=max; }
        if(h>max){ w=Math.round(w*max/h); h=max; }
        c.width=w; c.height=h;
        const ctx=c.getContext("2d");
        ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h);
        ctx.drawImage(img,0,0,w,h);
        ok(c);
      };
      img.onerror=function(){ ok(null); };
      img.src=r.result;
    };
    r.onerror=function(){ ok(null); };
    r.readAsDataURL(file);
  });
}
async function readTicketPhoto(file){
  if(!file) return;
  scanStatus("Wait. Reading the photo on this phone.");
  if(typeof storeShot==="function") storeShot("ticket-scan", file);
  try{
    await loadTess();
    const canvas=await shrinkShot(file);
    if(!canvas || !window.Tesseract) throw new Error("no canvas");
    const worker=await Tesseract.createWorker("eng", 1, {
      logger: function(m){
        if(m && m.status==="recognizing text" && m.progress){
          scanStatus("Reading " + Math.round(m.progress*100) + "%");
        }
      }
    });
    const res=await worker.recognize(canvas);
    await worker.terminate();
    const parsed=parseTicketText(res && res.data && res.data.text);
    fillTicketForm(parsed);
    const got=parsed.carrier || parsed.code || parsed.from || parsed.at;
    scanStatus(got ? "Check the boxes. Then tap Add ticket." : "Could not read it. Type the boxes. Photo is saved.");
  }catch(e){
    scanStatus("Could not read it. Type the boxes. Photo is saved.");
  }
}
