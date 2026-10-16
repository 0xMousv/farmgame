// إعداد Firebase المشترك + حارس تسجيل الدخول. عدّل الإعدادات هنا بس.
import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getAuth,onAuthStateChanged,signOut}from"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import*as F from"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
export const CFG={apiKey:"AIzaSyArvGlHYTcBw4DmnuPjFdi6WhBcYIiMYhE",authDomain:"login-75ba4.firebaseapp.com",projectId:"login-75ba4",storageBucket:"login-75ba4.firebasestorage.app",messagingSenderId:"157555165004",appId:"1:157555165004:web:82a5e2bfe8b864993db1e9"};
export const app=initializeApp(CFG),auth=getAuth(app),db=F.getFirestore(app);
export{F};
export const $=s=>document.querySelector(s);
export const esc=s=>String(s).replace(/[&<>"\x27]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","\x27":"&#39;"}[c]));
export const out=()=>signOut(auth).then(()=>location.href="index.html");
// بيرجع {u: مستخدم Auth, p: بروفايله} أو بيحوّل لصفحة الدخول
export function guard(){return new Promise(res=>{let once=0;onAuthStateChanged(auth,async u=>{if(once++)return;
 if(!u)return location.href="index.html";
 const s=await F.getDoc(F.doc(db,"users",u.uid)).catch(()=>null);
 if(!s||!s.exists())return location.href="index.html";
 const p=s.data();if(p.banned){alert("الحساب ده محظور");await signOut(auth);return location.href="index.html"}
 res({u,p})})})}
