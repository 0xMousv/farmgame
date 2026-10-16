import{guard,out,$,esc,F,db}from'./fb.js';
const{doc,getDoc,setDoc,updateDoc,deleteDoc,collection,query,where,onSnapshot,arrayUnion,addDoc}=F;
const{u,p}=await guard(),uid=u.uid;
$('#hi').textContent='أهلاً '+p.name+' (@'+p.username+')';$('#out').onclick=out;
getDoc(doc(db,'admins',uid)).then(s=>{if(s.exists())$('#adm').style.display='inline-block'}).catch(()=>{});
const say=t=>{$('#msg').textContent=t;setTimeout(()=>$('#msg').textContent='',4500)};
let W=[],FR=[],NMC={};
const nm=async id=>NMC[id]||(NMC[id]=((await getDoc(doc(db,'users',id)).catch(()=>null))?.data()||{}).name||'؟');
const it=(l,s,b)=>`<div class="it"><span>${l}<small>${s}</small></span><span>${b}</span></div>`;
// العوالم
onSnapshot(query(collection(db,'worlds'),where('members','array-contains',uid)),s=>{W=s.docs.map(d=>({id:d.id,...d.data()}));
 $('#worlds').innerHTML=W.length?W.map(w=>it('🌍 '+esc(w.name),w.members.length+' لاعب'+(w.owner===uid?' • انت المالك':''),`<a class="btn" href="game.html?w=${w.id}">دخول</a>${w.owner===uid?` <button class="btn off" data-del="${w.id}">حذف</button>`:''}`)).join(''):'<div class="mut">لسه معندكش عالم — اعمل واحد 👇</div>';rf()},e=>say('⚠️ '+e.message));
$('#worlds').onclick=async e=>{const id=e.target.dataset.del;if(id&&confirm('تحذف العالم ده نهائيًا؟'))await deleteDoc(doc(db,'worlds',id)).catch(x=>say(x.message))};
$('#mk').onclick=async()=>{const n=$('#wn').value.trim();if(!n)return say('اكتب اسم للعالم');
 try{const r=await addDoc(collection(db,'worlds'),{name:n.slice(0,24),owner:uid,members:[uid],createdAt:Date.now()});location.href='game.html?w='+r.id}catch(x){say('⚠️ '+x.message)}};
// الأصدقاء
onSnapshot(query(collection(db,'friendships'),where('members','array-contains',uid)),s=>{FR=s.docs.map(d=>({id:d.id,o:d.data().members.find(x=>x!==uid)}));rf()},e=>say('⚠️ '+e.message));
async function rf(){if(!FR.length){$('#frs').innerHTML='<div class="mut">لسه مفيش أصدقاء</div>';return}
 const names=await Promise.all(FR.map(f=>nm(f.o)));
 $('#frs').innerHTML=FR.map((f,i)=>it('🧑‍🌾 '+esc(names[i]),W.length?`<select id="s_${f.o}">${W.map(w=>`<option value="${w.id}">${esc(w.name)}</option>`).join('')}</select>`:'اعمل عالم الأول',
  (W.length?`<button class="btn" data-inv="${f.o}">ادعيه 📨</button> `:'')+`<button class="btn off" data-rm="${f.id}">إزالة</button>`)).join('')}
$('#frs').onclick=async e=>{const b=e.target;
 if(b.dataset.inv){const fid=b.dataset.inv,wid=$('#s_'+fid).value,w=W.find(x=>x.id===wid);if(w.members.includes(fid))return say('هو عضو في العالم ده بالفعل');
  try{await setDoc(doc(db,'invites',wid+'_'+fid),{wid,wname:w.name,from:uid,fromName:p.name,to:fid,status:'pending',t:Date.now()});say('✅ الدعوة اتبعتت')}catch(x){say('⚠️ '+x.message)}}
 if(b.dataset.rm&&confirm('تشيله من الأصدقاء؟'))deleteDoc(doc(db,'friendships',b.dataset.rm)).catch(x=>say(x.message))};
$('#fa').onclick=async()=>{const un=$('#fu').value.trim().toLowerCase();if(!un)return;
 try{const s=await getDoc(doc(db,'usernames',un));if(!s.exists())return say('اليوزر ده مش موجود');const tid=s.data().uid;if(tid===uid)return say('ده انت 😅');
  if(FR.some(f=>f.o===tid))return say('هو صديقك بالفعل');
  await setDoc(doc(db,'frq',uid+'_'+tid),{from:uid,to:tid,fromName:p.name,status:'pending',t:Date.now()});$('#fu').value='';say('✅ طلب الصداقة اتبعت')}catch(x){say('⚠️ '+x.message)}};
onSnapshot(query(collection(db,'frq'),where('to','==',uid)),s=>{const L=s.docs.map(d=>({id:d.id,...d.data()}));
 $('#reqs').innerHTML=L.length?L.map(r=>it('🙋 '+esc(r.fromName||'؟'),'عايز يبقى صديقك',`<button class="btn" data-ok="${r.id}" data-f="${r.from}">قبول</button> <button class="btn off" data-no="${r.id}">رفض</button>`)).join(''):'<div class="mut">مفيش طلبات</div>'},()=>{});
$('#reqs').onclick=async e=>{const b=e.target;try{
 if(b.dataset.ok){const f=b.dataset.f,id=uid<f?uid+'_'+f:f+'_'+uid;await setDoc(doc(db,'friendships',id),{members:[uid,f],since:Date.now()});await deleteDoc(doc(db,'frq',b.dataset.ok))}
 if(b.dataset.no)await deleteDoc(doc(db,'frq',b.dataset.no))}catch(x){say('⚠️ '+x.message)}};
// دعوات العوالم
onSnapshot(query(collection(db,'invites'),where('to','==',uid)),s=>{const L=s.docs.map(d=>({id:d.id,...d.data()})).filter(x=>x.status==='pending');
 $('#invs').innerHTML=L.length?L.map(r=>it('🌍 '+esc(r.wname),'من '+esc(r.fromName||'؟'),`<button class="btn" data-ok="${r.id}" data-w="${r.wid}">انضم</button> <button class="btn off" data-no="${r.id}">رفض</button>`)).join(''):'<div class="mut">مفيش دعوات</div>'},()=>{});
$('#invs').onclick=async e=>{const b=e.target;try{
 if(b.dataset.ok){await updateDoc(doc(db,'worlds',b.dataset.w),{members:arrayUnion(uid)});await updateDoc(doc(db,'invites',b.dataset.ok),{status:'ok'});location.href='game.html?w='+b.dataset.w}
 if(b.dataset.no)await deleteDoc(doc(db,'invites',b.dataset.no))}catch(x){say('⚠️ '+x.message)}};
