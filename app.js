const TABS = ["today","plan","map","pack","apps"];
const LABELS = { today:"Trip", plan:"Plan", map:"Places", pack:"Bag", apps:"Tickets" };
const KEY = "budvia-v2";
const KEY_OLD = "belvia-v2";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const LISTS = [["prep","Before you leave"],["flight","Flight"],["bus","Bus"],["stay","Stay"],["city","In the city"],["social","People"]];
const PACK = [
  ["Tops",[["p1","5 T-shirts"],["p2","3 long-sleeve shirts"],["p3","2 light knits"],["p4","1 evening outfit"],["p5","1 rain jacket"],["p6","1 warm jacket"]]],
  ["Bottoms",[["p7","3 trousers"],["p8","1-2 joggers"],["p9","1 smarter pair"]]],
  ["Base layers",[["p10","9 underwear"],["p11","9 pairs of socks"],["p12","Sleep clothes"],["p13","Scarf and cap"]]],
  ["Shoes",[["p14","Walk shoes"],["p15","Everyday shoes"],["p16","Indoor slippers"]]],
  ["Toiletries",[["p17","Toothbrush and paste"],["p18","Travel shampoo"],["p19","Deodorant"],["p20","Sunscreen"],["p21","Face cream"],["p22","Tissues"]]],
  ["Tech",[["p23","Phone and charger"],["p24","Power bank","Keep in the small bag"],["p25","Headphones"],["p26","EU plug"]]],
  ["Papers",[["p27","Passport"],["p28","Boarding passes, offline"],["p29","Stay papers"],["p30","Cards and a little cash"]]]
];
const APPS = [
  ["wizz","Wizz Air","wizzair://","Check-in and boarding pass"],
  ["flixbus","FlixBus","flixbus://","Bus tickets"],
  ["airbnb","Airbnb","airbnb://","Stay details"],
  ["booking","Booking.com","booking://","Hotel stays"],
  ["bubi","MOL Bubi","bubi://","City bikes"],
  ["timeleft","Timeleft","timeleft://","Shared dinner tables"],
  ["nomad","Nomadtable","nomadtable://","Meet other travellers"]
];
function emptyState(){ return { meta:{title:"",start:"",end:"",pnr:"",sample:false}, reminders:[], places:[], routes:[], done:{}, packed:{}, extra:"" }; }
function P(id,name,address,lat,lng){ return {id,name,address,lat,lng}; }
function demoState(){
  const stay=P("stay-bp","Budapest stay","District XIII \u00b7 Lehel t\u00e9r area",47.5193,19.0608);
  const hostel=P("stay-vie","Vienna hostel","Marina Tower area, Vienna",48.2404,16.4137);
  const esb=P("esb","ESB Esenbo\u011fa","Ankara Airport",40.1281,32.9951);
  const bud=P("bud","BUD Terminal 2B","Budapest Airport",47.4369,19.2573);
  const nep=P("nep","N\u00e9pliget bus station","\u00dcll\u0151i \u00fat 131, Budapest",47.4762,19.099);
  const vib=P("vib","Vienna Erdberg (VIB)","Erdbergstra\u00dfe 200A",48.1915,16.4147);
  const hbf=P("hbf","Wien Hauptbahnhof","S\u00cddtiroler Platz, Vienna",48.185,16.377);
  return {
    meta:{ title:"Ankara \u2192 Budapest \u2192 Vienna", start:"2026-09-14", end:"2026-09-21", pnr:"\u2022\u2022\u2022\u2022\u2022\u2022", sample:true },
    done:{}, packed:{}, extra:"",
    places:[esb,bud,stay,nep,hostel,vib,hbf,
      P("par","Parliament","Kossuth Lajos t\u00e9r, Budapest",47.5071,19.0456),
      P("buda","Buda Castle","Szent Gy\u00f6rgy t\u00e9r",47.4962,19.0396),
      P("step","Stephansdom","Stephansplatz 3, Vienna",48.2085,16.3731),
      P("sch","Sch\u00f6nbrunn","Sch\u00f6nbrunner Schlo\u00dfstra\u00dfe 47",48.1849,16.3122)],
    routes:[
      {id:"r1",label:"BUD T2B \u2192 stay",when:"14 Sep 13:00",from:"bud",to:"stay-bp",mode:"d"},
      {id:"r2",label:"Stay \u2192 N\u00e9pliget",when:"17 Sep 04:45 \u00b7 taxi",from:"stay-bp",to:"nep",mode:"d"},
      {id:"r3",label:"VIB \u2192 hostel",when:"17 Sep 08:50",from:"vib",to:"stay-vie",mode:"r"},
      {id:"r4",label:"Hostel \u2192 Wien Hbf",when:"19 Sep 22:30",from:"stay-vie",to:"hbf",mode:"r"},
      {id:"r5",label:"N\u00e9pliget \u2192 stay",when:"20 Sep 02:50",from:"nep",to:"stay-bp",mode:"d"},
      {id:"r6",label:"Stay \u2192 BUD T2B",when:"21 Sep 03:30",from:"stay-bp",to:"bud",mode:"d"}
    ],
    reminders:[
      {id:"h1",list:"prep",title:"Online check-in",notes:"Opens about 24h before you fly.",at:"2026-09-13T17:00"},
      {id:"h2",list:"bus",title:"Save bus QR",notes:"17 Sep 06:00 N\u00e9pliget to Vienna."},
      {id:"h3",list:"bus",title:"Save night bus QR",notes:"19 Sep 23:45 Vienna to N\u00e9pliget."},
      {id:"h4",list:"stay",title:"Confirm Budapest stay",notes:"Sample stay.",place:"stay-bp"},
      {id:"h5",list:"stay",title:"Confirm Vienna second night",notes:"Hostel 17-18 Sep."},
      {id:"h6",list:"flight",title:"Return boarding pass",notes:"W6 2487 \u00b7 21 Sep 06:20 BUD."},
      {id:"h7",list:"prep",title:"Finish packing",notes:"Power bank in the small bag."},
      {id:"h8",list:"prep",title:"Some cash",notes:"About 20 euro plus HUF from an ATM."},
      {id:"d14a",list:"flight",title:"Arrive ESB",notes:"W6 2488.",at:"2026-09-14T07:30",place:"esb"},
      {id:"d14b",list:"flight",title:"ESB to BUD leaves",notes:"W6 2488.",at:"2026-09-14T10:25",place:"esb"},
      {id:"d14c",list:"flight",title:"Land BUD Terminal 2B",notes:"Arrivals hall.",at:"2026-09-14T11:55",place:"bud"},
      {id:"d14d",list:"city",title:"Local SIM",notes:"EU data.",at:"2026-09-14T12:30",place:"bud"},
      {id:"d14e",list:"city",title:"100E into the city",notes:"About 2,200 HUF.",at:"2026-09-14T13:00",place:"stay-bp"},
      {id:"d14f",list:"stay",title:"Budapest check-in",notes:"Sample pin only.",at:"2026-09-14T15:00",place:"stay-bp"},
      {id:"d14h",list:"social",title:"Book Wednesday Timeleft",at:"2026-09-14T16:00"},
      {id:"d14i",list:"city",title:"Set up MOL Bubi",at:"2026-09-14T16:30"},
      {id:"d15a",list:"social",title:"Nomadtable",at:"2026-09-15T11:00"},
      {id:"d15b",list:"social",title:"Evening meetup",at:"2026-09-15T20:00"},
      {id:"d16a",list:"social",title:"Timeleft dinner",at:"2026-09-16T20:00"},
      {id:"d17a",list:"bus",title:"Leave for N\u00e9pliget",notes:"Take a taxi.",at:"2026-09-17T04:45",place:"stay-bp"},
      {id:"d17b",list:"bus",title:"N\u00e9pliget stand",at:"2026-09-17T05:20",place:"nep"},
      {id:"d17c",list:"bus",title:"Bus to Vienna leaves",notes:"QR ready.",at:"2026-09-17T06:00",place:"nep"},
      {id:"d17d",list:"bus",title:"Arrive Vienna Erdberg",at:"2026-09-17T08:50",place:"vib"},
      {id:"d17e",list:"stay",title:"Leave bags at the hostel",at:"2026-09-17T09:30",place:"stay-vie"},
      {id:"d17f",list:"stay",title:"Vienna check-in",at:"2026-09-17T15:00",place:"stay-vie"},
      {id:"d17g",list:"social",title:"Vienna evening",at:"2026-09-17T21:00"},
      {id:"d18a",list:"stay",title:"Hostel check-out",at:"2026-09-18T11:00",place:"stay-vie"},
      {id:"d18b",list:"social",title:"Vienna Nomadtable",at:"2026-09-18T14:00"},
      {id:"d19a",list:"bus",title:"To Wien Hbf",at:"2026-09-19T22:30",place:"hbf"},
      {id:"d19b",list:"bus",title:"Night bus platform",at:"2026-09-19T23:15",place:"hbf"},
      {id:"d19c",list:"bus",title:"Night bus leaves",at:"2026-09-19T23:45",place:"hbf"},
      {id:"d20a",list:"bus",title:"N\u00e9pliget to stay",notes:"Take a taxi.",at:"2026-09-20T02:50",place:"stay-bp"},
      {id:"d20b",list:"city",title:"Easy Bubi loop",at:"2026-09-20T14:00"},
      {id:"d21a",list:"flight",title:"Leave for T2B",at:"2026-09-21T03:30",place:"stay-bp"},
      {id:"d21b",list:"flight",title:"BUD Terminal 2B",at:"2026-09-21T04:30",place:"bud"},
      {id:"d21c",list:"flight",title:"BUD to ESB leaves",notes:"W6 2487.",at:"2026-09-21T06:20",place:"bud"},
      {id:"d21d",list:"flight",title:"Land Esenbo\u011fa",at:"2026-09-21T09:50",place:"esb"}
    ]
  };
}
