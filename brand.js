try{
  if(!localStorage.getItem("budvia-v2")){
    var old=localStorage.getItem("belvia-v2");
    if(old) localStorage.setItem("budvia-v2", old);
  }
}catch(e){}
window.BUDVIA_SHOT="data:image/jpeg;base64,"+(window._B1||"")+(window._B2||"");
