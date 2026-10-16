import{auth,db,F,$}from"./fb.js";
import{onAuthStateChanged,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
let mode="login",busy=false;const T={login:"#tL",reg:"#tR",reset:"#tP"};
const err=t=>$("#err").textContent=t||"";
function setMode(m){mode=m;for(const k in T)$(T[k]).classList.toggle("on",k===m);
 $("#fU").style.display=(m==="reg"||m==="prof")?"block":"none";$("#fE").style.display=(m==="prof")?"none":"block";$("#fP").style.display=(m==="prof"||m==="reset")?"none":"block";
 $("#go").textContent={login:"دخول",reg:"إنشاء الحساب",reset:"ابعتلي لينك",prof:"كمّل التسجيل"}[m];err("")}
const msg=e=>typeof e==="string"?e:({"auth/invalid-credential":"الإيميل أو الباسورد غلط","auth/email-already-in-use":"الإيميل ده مسجل قبل كده","auth/weak-password":"الباسورد ضعيف (6 حروف على الأقل)","auth/invalid-email":"إيميل غير صحيح","auth/operation-not-allowed":"فعّل Email/Password من Authentication في Firebase Console","auth/too-many-requests":"محاولات كتير، استنى شوية","permission-denied":"Firestore رفض الطلب — انشر firestore.rules"}[e.code]||e.message||String(e));
async function claim(u,uname,name){const un=uname.trim().toLowerCase();
 if(!/^[a-z0-9_]{3,16}$/.test(un))throw"اليوزرنيم لازم 3-16 حرف إنجليزي/أرقام/_";
 await F.runTransaction(db,async t=>{const r=F.doc(db,"usernames",un);if((await t.get(r)).exists())throw"اليوزرنيم ده مستخدم، اختار غيره";
  t.set(r,{uid:u.uid});t.set(F.doc(db,"users",u.uid),{username:un,name:(name.trim()||un).slice(0,14),banned:false,createdAt:Date.now()})})}
$("#tL").onclick=()=>setMode("login");$("#tR").onclick=()=>setMode("reg");$("#tP").onclick=()=>setMode("reset");
$("#go").onclick=async()=>{err("");const em=$("#em").value.trim(),pw=$("#pw").value;$("#go").disabled=true;busy=true;
 try{
  if(mode==="login"){await signInWithEmailAndPassword(auth,em,pw);location.href="lobby.html"}
  else if(mode==="reg"){const c=await createUserWithEmailAndPassword(auth,em,pw);try{await claim(c.user,$("#un").value,$("#dn").value);location.href="lobby.html"}catch(e){setMode("prof");err(msg(e))}}
  else if(mode==="prof"){await claim(auth.currentUser,$("#un").value,$("#dn").value);location.href="lobby.html"}
  else{await sendPasswordResetEmail(auth,em);err("✅ اتبعت لينك إعادة الباسورد على إيميلك")}
 }catch(e){err(msg(e))}
 busy=false;$("#go").disabled=false};
onAuthStateChanged(auth,async u=>{if(!u||busy)return;const s=await F.getDoc(F.doc(db,"users",u.uid)).catch(()=>null);if(s&&s.exists())location.href="lobby.html";else setMode("prof")});
