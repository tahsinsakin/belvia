function knownPin(q){
  const u=String(q||"").toUpperCase();
  const pins={
    ESB:[40.1281,32.9951,"Ankara Esenboga"],IST:[41.2753,28.7519,"Istanbul Airport"],SAW:[40.8983,29.3092,"Sabiha Gokcen"],AYT:[36.8987,30.8005,"Antalya Airport"],ADB:[38.2924,27.1570,"Izmir Adnan Menderes"],ADA:[36.9822,35.2804,"Adana Airport"],ECN:[35.1547,33.4961,"Ercan"],BUD:[47.4394,19.2618,"Budapest Airport"],DEB:[47.4889,21.6153,"Debrecen"],VIE:[48.1103,16.5697,"Vienna Airport"],PRG:[50.1008,14.2600,"Prague Airport"],KRK:[50.0777,19.7848,"Krakow Airport"],WAW:[52.1657,20.9671,"Warsaw Chopin"],WMI:[52.4511,20.6518,"Warsaw Modlin"],OTP:[44.5711,26.0850,"Bucharest Otopeni"],SOF:[42.6967,23.4114,"Sofia Airport"],BEG:[44.8184,20.3091,"Belgrade Airport"],MXP:[45.6306,8.7281,"Milan Malpensa"],BGY:[45.6739,9.7042,"Milan Bergamo"],FCO:[41.8003,12.2389,"Rome Fiumicino"],CIA:[41.7994,12.5949,"Rome Ciampino"],BCN:[41.2971,2.0785,"Barcelona Airport"],MAD:[40.4983,-3.5676,"Madrid Barajas"],AMS:[52.3105,4.7683,"Amsterdam Schiphol"],BRU:[50.9014,4.4844,"Brussels Airport"],CDG:[49.0097,2.5479,"Paris CDG"],ORY:[48.7233,2.3794,"Paris Orly"],LHR:[51.4700,-0.4543,"London Heathrow"],LGW:[51.1537,-0.1821,"London Gatwick"],STN:[51.8860,0.2389,"London Stansted"],LTN:[51.8747,-0.3683,"London Luton"],FRA:[50.0379,8.5622,"Frankfurt Airport"],MUC:[48.3538,11.7861,"Munich Airport"],BER:[52.3667,13.5033,"Berlin Brandenburg"],ATH:[37.9364,23.9445,"Athens Airport"],TIA:[41.4147,19.7206,"Tirana Airport"],ANKARA:[39.9334,32.8597,"Ankara"],BUDAPEST:[47.4979,19.0402,"Budapest"],ISTANBUL:[41.0082,28.9784,"Istanbul"]
  };
  var k;
  for(k in pins){ if(u.indexOf(k)!==-1) return {lat:pins[k][0],lng:pins[k][1],label:pins[k][2]}; }
  return null;
}
function geocodePlace(name, addr){
  const q=(String(name||"")+" "+String(addr||"")).trim();
  const local=knownPin(q);
  const url="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q="+encodeURIComponent(q);
  return fetch(url,{headers:{Accept:"application/json"}}).then(function(r){ return r.json(); }).then(function(arr){
    if(arr && arr[0] && arr[0].lat){
      return {lat:+arr[0].lat,lng:+arr[0].lon,label:arr[0].display_name||q};
    }
    if(local) return local;
    return {lat:47.4979,lng:19.0402,label:q};
  }).catch(function(){ return local || {lat:47.4979,lng:19.0402,label:q}; });
}
function timedItems(){
  const out=[];
  (S.reminders||[]).forEach(function(r){
    if(r.at) out.push({id:r.id,title:r.title,at:r.at,end:"",notes:r.notes||"",place:r.place});
  });
  (S.tickets||[]).forEach(function(t){
    if(!t.at) return;
    const title=((t.carrier||"Ticket")+" "+(t.code||"")).trim();
    const notes=[t.from,t.to,t.fromCity,t.toCity].filter(Boolean).join(" · ");
    out.push({id:t.id,title:title,at:t.at,end:t.land||"",notes:notes,place:null});
  });
  return out;
}
function refreshMap(){
  paintMap();
  setTimeout(function(){ if(typeof ensureMap==="function") ensureMap(); }, 80);
  setTimeout(function(){ if(map) map.invalidateSize(); }, 280);
}
