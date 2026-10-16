import{guard,$,esc,F,db}from'./fb.js';
const{doc,getDoc,getDocs,updateDoc,deleteDoc,collection,query,orderBy,limit,addDoc,getCountFromServer}=F;
const{u}=await guard();
const adm=await getDoc(doc(db,'admins',u.uid)).catch(()=>null);
if(!adm||!adm.exists()){alert('مش أدمن');location.href='lobby.html'}
const say=t=>{$('#msg').textContent=t;setTimeout(()=>$('#msg').textContent='',4500)};
const it=(l,s,b)=>`<div class="it"><span>${l}<small>${s}</small></span><span>${b}</span></div>`;
async function stats(){try{const[a,b]=await Promise.all([getCountFromServer(collection(db,'users')),getCountFromServer(collection(db,'worlds'))]);$('#stats').textContent='👥 '+a.data().count+' حساب • 🌍 '+b.data().count+' عالم'}catch(e){$('#stats').textContent=e.message}}
let U=[];
async function users(){U=(await getDocs(query(collection(db,'users'),limit(300)))).docs.map(d=>({id:d.id,...d.data()}));ru()}
function ru(){const q=$('#q').value.trim().toLowerCase();
 $('#users').innerHTML=U.filter(x=>!q||(x.username+' '+x.name).toLowerCase().includes(q)).map(x=>it((x.banned?'🚫 ':'🧑‍🌾 ')+esc(x.name)+' (@'+esc(x.username)+')',x.id,`<button class="btn ${x.banned?'':'off'}" data-b="${x.id}" data-v="${x.banned?0:1}">${x.banned?'فك الحظر':'حظر'}</button>`)).join('')}
$('#q').oninput=ru;
$('#users').onclick=async e=>{const id=e.target.dataset.b;if(!id)return;const v=e.target.dataset.v==='1';try{await updateDoc(doc(db,'users',id),{banned:v});U.find(x=>x.id===id).banned=v;ru();say(v?'🚫 اتحظر':'✅ اتفك الحظر')}catch(x){say(x.message)}};
async function worlds(){const L=(await getDocs(query(collection(db,'worlds'),limit(100)))).docs;
 $('#worlds').innerHTML=L.map(d=>{const w=d.data();return it('🌍 '+esc(w.name),(w.members||[]).length+' لاعب',`<button class="btn" data-c="${d.id}">الشات</button> <button class="btn off" data-d="${d.id}">حذف</button>`)}).join('')||'<div class="mut">مفيش عوالم</div>'}
async function onWorlds(e){const b=e.target;try{
 if(b.dataset.d&&confirm('حذف العالم؟')){await deleteDoc(doc(db,'worlds',b.dataset.d));worlds();stats()}
 if(b.dataset.c){const w=b.dataset.c;const L=(await getDocs(query(collection(db,'worlds',w,'chat'),orderBy('t','desc'),limit(50)))).docs;
  $('#chat').innerHTML='<hr>'+(L.map(d=>it('<b>'+esc(d.data().n)+'</b>: '+esc(d.data().m),'',`<button class="btn off" data-m="${w}/${d.id}">مسح</button>`)).join('')||'<div class="mut">مفيش رسائل</div>')}
 if(b.dataset.m){const[w,m]=b.dataset.m.split('/');await deleteDoc(doc(db,'worlds',w,'chat',m));b.closest('.it').remove()}}catch(x){say(x.message)}}
$('#worlds').onclick=onWorlds;$('#chat').onclick=onWorlds;
$('#sa').onclick=async()=>{const m=$('#an').value.trim();if(!m)return;try{await addDoc(collection(db,'announcements'),{m,t:Date.now(),by:u.uid});$('#an').value='';say('✅ اتنشر')}catch(x){say(x.message)}};
stats();users();worlds();
