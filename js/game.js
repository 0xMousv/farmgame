import{auth,db as FS,F,guard,$,esc}from'./fb.js';
const{doc,getDoc,setDoc,updateDoc,deleteDoc,collection,onSnapshot,query,where,orderBy,limit,limitToLast,runTransaction,increment}=F;
let R='',sent=new Set(),W=null,PROF=null,LQ={},MQ={};
const NM='قمح,جزر,طماطم,درة,قرع,بطاطس,بصل,توم,خس,خيار,باذنجان,شطة,فلفل,بروكلي,فراولة,بطيخ,شمام,عنب,برتقال,ليمون,تفاح,كمثرى,خوخ,كرز,موز,أناناس,مانجو,جوز هند,كيوي,توت أزرق,فول,فول سوداني,مشروم,زيتون,دوار شمس,ورد,توليب'.split(',');
const EM=['🌾','🥕','🍅','🌽','🎃','🥔','🧅','🧄','🥬','🥒','🍆','🌶️','🫑','🥦','🍓','🍉','🍈','🍇','🍊','🍋','🍎','🍐','🍑','🍒','🍌','🍍','🥭','🥥','🥝','🫐','🫘','🥜','🍄','🫒','🌻','🌹','🌷'];
const CR=NM.map((n,i)=>{const c=Math.round(3*1.2**i);return{n,e:EM[i],g:Math.round(6*1.13**i),c,p:Math.round(c*2.1+i),l:1+(i>>1)}});
const AN=[{e:'🐔',n:'فراخ',pe:'🥚',pn:'بيض',c:100,t:40,p:7,l:1},{e:'🐄',n:'بقرة',pe:'🥛',pn:'لبن',c:400,t:80,p:24,l:4},{e:'🐑',n:'خروف',pe:'🧶',pn:'صوف',c:900,t:120,p:60,l:7},{e:'🐝',n:'نحل',pe:'🍯',pn:'عسل',c:1800,t:150,p:130,l:11}];
const QS=[['🌾','احصد 15 محصول','h',15,80],['💰','بيع بـ 300 $','s',300,120],['💧','اسقي 5 مرات لصحابك','w',5,70]];
const FA=[{e:'🏭',n:'مطحنة',lo:0,hi:9,k:4,t:30,out:'🍞',on:'خبز',p:70,l:5,c:600},{e:'🧃',n:'عصارة',lo:14,hi:29,k:4,t:50,out:'🧃',on:'عصير',p:190,l:15,c:3000},{e:'🫙',n:'مصنع مربى',lo:14,hi:36,k:5,t:80,out:'🫙',on:'مربى',p:480,l:40,c:15000},{e:'🏰',n:'مصنع فاخر',lo:20,hi:36,k:6,t:120,out:'👑',on:'منتج ملكي',p:1500,l:100,c:80000}];
const TM={c:1,g:5,d:30},TT=['مبتدئ','فلاح','مزارع','محترف','خواجة','معلّم','أسطورة','ملك المزارع','إمبراطور','إله الزراعة','خالد'];
const TABS=[['seed','🌱 بذور'],['shop','🛒 شوب'],['bag','🎒 مخزن'],['zoo','🐔 حيوانات'],['qs','📜 مهام'],['fa','🏭 مصانع'],['rq','🤝 أراضي']];
let seen=new Set(),first=1,onl={},cred='',db=null,room=null,uid='solo',srv='',me=null,others={},view='',sel=0,mode='plant',tab='seed',lg=[],fr=null,st=null,mod='new',AC;
const XL=L=>Math.round(40*(L-1)**1.7),lvl=x=>{let L=Math.floor(Math.pow(Math.max(0,x)/40,1/1.7))+1;while(XL(L+1)<=x)L++;while(L>1&&XL(L)>x)L--;return Math.min(L,999)},mm=i=>1+.35*Math.sin(Date.now()/90000+i*1.7),fmt=s=>s<60?s+'ث':Math.round(s/6)/10+'د';
const pl=d=>{try{const P=JSON.parse(d.p);while(P.length<36)P.push(null);return P}catch(e){return Array(36).fill(null)}};
const G=(p,d)=>CR[p.c].g*1000*.9**(d.s||0),pr=(p,d,n)=>Math.min(1,(n-p.t+(p.w||0))/G(p,d)),cost=(base,k)=>Math.round(base*k);
function snd(f,d=.08){try{AC=AC||new AudioContext();const o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(AC.destination);o.start();o.stop(AC.currentTime+d)}catch(e){}}
function gift(e){if(view===uid)return;if(me.coins<50)return pop('فلوسك مش كفاية',e);me.coins-=50;updateDoc(doc(FS,R+'/farms/'+view),{g:increment(50)}).catch(()=>{});log('🎁','بعت 50 $ لـ '+(others[view].name||''));pop('🎁 -50',e);snd(800);done()}
function burst(e,t){if(!e)return;for(let i=0;i<7;i++){const s=document.createElement('div');s.className='bs';s.textContent=t;s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';const a=i/7*6.28;s.style.setProperty('--dx',Math.cos(a)*70+'px');s.style.setProperty('--dy',Math.sin(a)*70-20+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),900)}}
function pop(t,e){const s=document.createElement('div');s.className='fl';s.textContent=t;s.style.left=(e?e.clientX:innerWidth/2)+'px';s.style.top=(e?e.clientY:200)+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),1000)}
async function H(pw,k){if(!(window.crypto&&crypto.subtle))throw'لازم تفتح اللعبة من https أو localhost';
 const m=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
 const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode('farm-v1:'+k),iterations:120000,hash:'SHA-256'},m,256);
 return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function mk(d){let z={};try{z=JSON.parse(d.z)}catch(e){}const n=Date.now(),an=Array.isArray(z.an)?z.an:[0,0,0,0],ac=Array.isArray(z.ac)?z.ac:[n,n,n,n],fa=Array.isArray(z.fa)?z.fa:FA.map(()=>({o:0,s:0}));while(an.length<AN.length)an.push(0);while(ac.length<AN.length)ac.push(n);while(fa.length<FA.length)fa.push({o:0,s:0});return{name:d.name,coins:d.coins??30,xp:d.xp||0,helped:d.helped||0,n:d.n||12,s:d.s||0,P:pl(d),inv:z.inv||{},an,ac,f:z.f||0,hv:z.hv||0,dl:z.dl||0,q:z.q||{},gr:z.gr||0,fa,hl:d.hl||[]}}
const ser=()=>({name:me.name,coins:me.coins,xp:me.xp,lv:lvl(me.xp),helped:me.helped,n:me.n,s:me.s,p:JSON.stringify(me.P),z:JSON.stringify({inv:me.inv,an:me.an,ac:me.ac,f:me.f,hv:me.hv,dl:me.dl,q:me.q,gr:me.gr,fa:me.fa}),hl:me.hl,at:Date.now()});
function qs(){const d=Math.floor(Date.now()/864e5);if(me.q.d!==d)me.q={d,h:0,s:0,w:0,c:[0,0,0]};return me.q}
function save(){if(!db||!R)return;clearTimeout(st);st=setTimeout(()=>{st=null;const payload=ser();me._at=payload.at;setDoc(doc(FS,R+'/farms/'+uid),payload,{merge:true}).catch(e=>log('⚠️','تعذر الحفظ: '+(e.message||'')))},350)}
const WID=new URLSearchParams(location.search).get('w');
const dashLink=document.querySelector('#dashboardLink');if(dashLink&&WID)dashLink.href='dashboard.html?w='+encodeURIComponent(WID);
(async()=>{const g=await guard();uid=g.u.uid;PROF=g.p;if(!WID)return location.href='lobby.html';
 R='worlds/'+WID;const ws=await getDoc(doc(FS,R)).catch(()=>null);
 if(!ws||!ws.exists()||!(ws.data().members||[]).includes(uid)){alert('مش عضو في العالم ده');return location.href='lobby.html'}
 W=ws.data();db=FS;const m=await getDoc(doc(FS,R+'/farms/'+uid));
 me=mk(m.exists()?m.data():{});me.name=PROF.name;srv=W.name;view=uid;others[uid]=me;$('#sName').textContent=srv;save();
 onSnapshot(collection(FS,R+'/farms'),sn=>{sn.docs.forEach(dc=>{const id=dc.id,x=dc.data();if(id!==uid){others[id]=x;if(!seen.has(id)){seen.add(id);if(!first)log('📢',(x.name||'لاعب')+' دخل السيرفر 🎉')}}else{if(!st&&x.p!==JSON.stringify(me.P))me.P=pl(x);if((x.g||0)>me.gr){me.coins+=x.g-me.gr;me.gr=x.g;log('🎁','وصلتك هدية $!');snd(800);hud();save()}if(x.at&&x.at>(me._at||0)){me._at=x.at;if(typeof x.coins==='number')me.coins=x.coins;if(typeof x.xp==='number')me.xp=x.xp;if(typeof x.n==='number')me.n=x.n;if(typeof x.s==='number')me.s=x.s;if(typeof x.hl!=='undefined')me.hl=x.hl;let zz={};try{zz=JSON.parse(x.z||'{}')}catch{};if(zz.inv)me.inv=zz.inv;if(zz.an)me.an=zz.an;if(zz.ac)me.ac=zz.ac;if(zz.fa)me.fa=zz.fa;if(typeof zz.f==='number')me.f=zz.f;if(typeof zz.hv==='number')me.hv=zz.hv;if(typeof zz.dl==='number')me.dl=zz.dl;hud();dashboard();panel()}}});first=0;plrs();grid();dashboard()},e=>log('⚠️','مشكلة في المزامنة: '+(e&&e.message||'')));
  onSnapshot(query(collection(FS,R+'/chat'),orderBy('t'),limitToLast(30)),sn=>sn.docChanges().forEach(c=>{if(c.type==='added'&&!sent.has(c.doc.id)){const x=c.doc.data();log(x.n,x.m)}}));
  const beat=()=>setDoc(doc(FS,R+'/online/'+uid),{n:me.name,t:Date.now()}).catch(()=>{});beat();setInterval(beat,20000);addEventListener('pagehide',()=>deleteDoc(doc(FS,R+'/online/'+uid)).catch(()=>{}));
  onSnapshot(collection(FS,R+'/online'),sn=>{onl={};sn.docs.forEach(dc=>onl[dc.id]=dc.data().t||0);plrs()});
 onSnapshot(query(collection(FS,'announcements'),orderBy('t','desc'),limit(1)),sn=>{const x=sn.docs[0]&&sn.docs[0].data();if(x){$('#ann').textContent='📢 '+x.m}},()=>{});
 onSnapshot(query(collection(FS,R+'/lreq'),where('owner','==',uid)),sn=>{LQ={};sn.docs.forEach(x=>LQ[x.id]=x.data());sn.docChanges().forEach(c=>{const x=c.doc.data();if(c.type==='added'&&x.status==='pending')log('🙋',(x.rname||'لاعب')+' طلب يلعب في أرضك — افتح تاب 🤝')});if(tab==='rq')panel()},()=>{});
 onSnapshot(query(collection(FS,R+'/lreq'),where('requester','==',uid)),sn=>{sn.docChanges().forEach(c=>{const x=c.doc.data();if(c.type!=='removed'){if(MQ[x.owner]!==x.status&&x.status==='ok')log('🤝','وافق '+((others[x.owner]||{}).name||'صاحب الأرض')+' إنك تلعب في أرضه!');MQ[x.owner]=x.status}})
  if(tab==='rq')panel()},()=>{});
 log('📢','أهلاً '+me.name+' في عالم '+srv+'! 🌾');hud();panel();grid();modes();plrs();dashboard();
 setInterval(grid,700);setInterval(()=>{if(tab==='bag'||tab==='zoo'||tab==='fa')panel();dashboard()},3000);sky();setInterval(sky,5000);setInterval(plrs,5000);
})().catch(e=>alert('مشكلة: '+(e&&e.message||e)));
const isOn=id=>id===uid||(onl[id]&&Date.now()-onl[id]<50000);const AV=['🧑‍🌾','👩‍🌾','🤠','👨‍🌾','🧔','👩‍🍳'];
function plrs(){if(!me)return;const ids=Object.keys(others).sort((a,b)=>(others[b].coins||0)-(others[a].coins||0));
 $('#plbar').innerHTML=ids.map(id=>{const o=others[id],on=isOn(id),av=id===uid?'🏡':AV[[...id].reduce((a,c)=>a+c.charCodeAt(0),0)%AV.length];
  return`<button class="chip ${id===view?'on':''}" data-a="view" data-k="${id}"><span class="av">${av}</span><span><b>${esc(o.name||'؟')}${id===uid?' (انت)':''}</b><small>${on?'<i class="dot"></i>أونلاين':'⚪ أوفلاين'} • ⭐${lvl(o.xp||0)} • $${o.coins||0}</small></span></button>`}).join('')}
$('#plbar').onclick=e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset,e)};
$('#send').onclick=e=>act('send',{},e);$('#msg').onkeydown=e=>{if(e.key==='Enter')act('send',{},e)};
document.querySelectorAll('.qk button').forEach(b=>b.onclick=e=>{if(!me)return;$('#msg').value=b.textContent;act('send',{},e)});
function sky(){
 // دورة لعب كاملة مدتها 4 دقائق: نهار، غروب، ليل، شروق.
 const cycle=(Date.now()%240000)/240000, phase=cycle*4;
 const stops=[[115,196,238],[255,177,112],[20,31,68],[255,199,133],[115,196,238]];
 const ix=Math.floor(phase),f=phase-ix,a=stops[ix],b=stops[ix+1];
 const rgb=(x,y)=>Math.round(x+(y-x)*f);
 const top=`rgb(${rgb(a[0],b[0])},${rgb(a[1],b[1])},${rgb(a[2],b[2])})`;
 const bottom=phase>=2&&phase<3?'#26385b':phase>=1&&phase<2?'#f7b77d':'#bde8b2';
 document.body.style.setProperty('--sky-top',top);document.body.style.setProperty('--sky-bottom',bottom);
 document.body.classList.toggle('night',phase>=2&&phase<3);document.body.classList.toggle('sunset',(phase>=1&&phase<2)||(phase>=3&&phase<4));
 const s=$('#sun');if(s){s.textContent=phase>=2&&phase<3?'🌙':phase>=1&&phase<2?'🌇':'☀️';const progress=(phase%2)/2;s.style.left=(5+progress*85)+'%';s.style.top=(8+Math.sin(progress*Math.PI)*18)+'%'}
 const label=phase>=2&&phase<3?'ليل':phase>=1&&phase<2?'غروب':'نهار';const el=$('#daytime');if(el)el.textContent=label;
}
function hud(){$('#coins').textContent=Number(me.coins||0).toLocaleString('en-US');const L=lvl(me.xp),a=XL(L),b=XL(L+1);$('#lvl').textContent='مستوى '+L+' • '+TT[Math.min(TT.length-1,Math.floor(L/50))];$('#xpb').style.width=(Math.max(0,Math.min(100,(me.xp-a)/(b-a)*100)))+'%';dashboard()}
function dashboard(){
 if(!me||!$('#farmDashboard'))return;
 const L=lvl(me.xp||0),now=Date.now(),plots=(me.P||[]).slice(0,me.n||12),planted=plots.filter(Boolean).length,ready=plots.filter(p=>p&&pr(p,me,now)>=1).length;
 const inv=me.inv||{};let stockCount=0,stockWorth=0;for(const [k,v0] of Object.entries(inv)){const v=Math.max(0,Number(v0)||0);stockCount+=v;if(v&&typeof val==='function')stockWorth+=val(k)*v}
 const factories=(me.fa||[]).filter(x=>x&&x.o).length,animals=(me.an||[]).reduce((a,n)=>a+(Number(n)||0),0),assetValue=(me.n||12)*80+(me.s||0)*150+(me.hv?400:0)+(me.fa||[]).reduce((a,x,i)=>a+(x&&x.o?FA[i].c:0),0)+(me.an||[]).reduce((a,n,i)=>a+(Number(n)||0)*AN[i].c,0),worth=(Number(me.coins)||0)+stockWorth+assetValue;
 $('#dashMoney').textContent=Math.floor(me.coins||0).toLocaleString('en-US');$('#dashWorth').textContent='$'+Math.floor(worth).toLocaleString('en-US');$('#dashCrops').textContent=planted+' / '+(me.n||12);$('#dashReady').textContent=ready+' محصول جاهز للحصاد';$('#dashFactories').textContent=factories+' / '+FA.length;$('#dashFactoryState').textContent=factories?((me.fa||[]).filter(x=>x&&x.s).length)+' خط إنتاج نشط':'أول مصنع متاح عند المستوى 5';$('#dashAnimals').textContent=animals.toLocaleString('en-US');$('#dashStock').textContent=stockCount.toLocaleString('en-US');$('#dashStockWorth').textContent='قيمة المخزون $'+Math.floor(stockWorth).toLocaleString('en-US');
 const a=XL(L),b=XL(L+1),pct=Math.max(0,Math.min(100,((me.xp||0)-a)/Math.max(1,b-a)*100));$('#dashLevel').textContent='المستوى '+L+' • '+TT[Math.min(TT.length-1,Math.floor(L/50))];$('#dashXp').textContent=(me.xp||0).toLocaleString('en-US')+' XP';$('#dashXpBar').style.width=pct+'%';$('#dashNext').textContent='متبقي '+Math.max(0,b-(me.xp||0)).toLocaleString('en-US')+' XP للمستوى التالي';
 const ids=Object.keys(others).sort((x,y)=>(Number(others[y].coins)||0)-(Number(others[x].coins)||0));const rank=ids.indexOf(uid)+1;$('#farmRank').textContent=rank>0?'🏅 ترتيبك #'+rank+' من '+ids.length:'🏅 جاري حساب ترتيبك';$('#dashLeaders').innerHTML=ids.slice(0,3).map((id,i)=>{const o=others[id]||{},isMe=id===uid;return `<div class="leader-chip ${isMe?'self':''}"><span>${['🥇','🥈','🥉'][i]}</span><b>${esc(o.name||'مزارع')}${isMe?' (أنت)':''}</b><small>$${Math.floor(Number(o.coins)||0).toLocaleString('en-US')} • Lv.${lvl(o.xp||0)}</small></div>`}).join('')||'<span>لسه مفيش ترتيب متاح.</span>';
}
$('#farmDashboard')?.addEventListener('click',e=>{const b=e.target.closest('[data-dash-tab]');if(!b)return;tab=b.dataset.dashTab;view=uid;panel();document.querySelector('.side')?.scrollIntoView({behavior:'smooth',block:'start'})});
function gain(x){const o=lvl(me.xp);me.xp+=x;if(lvl(me.xp)>o){log('🎉','وصلت مستوى '+lvl(me.xp)+'! بذور جديدة اتفتحت');snd(880,.3)}}
function log(n,m){lg.push([n,m]);if(lg.length>80)lg.shift();const l=$('#log');if(l){l.insertAdjacentHTML('beforeend',`<div><b>${esc(n)}:</b> ${esc(m)}</div>`);l.scrollTop=l.scrollHeight}}
function grid(){const mine=view===uid,d=mine?me:others[view];if(!d)return;const P=mine?me.P:pl(d),now=Date.now(),n=d.n||12;
 $('#who').textContent=mine?'🏡 مزرعتك':'👀 بتزور مزرعة '+(d.name||'');
 $('#grid').innerHTML=P.slice(0,n).map((p,i)=>{if(!p)return`<button class="plot" data-i="${i}"></button>`;const f=pr(p,d,now);
  return`<button class="plot ${f>=1?'rdy':''}" data-i="${i}"><u style="transform:scale(${.55+Math.min(f,1)*.6})">${f>=1?CR[p.c].e:f>.34?'🌿':'🌱'}</u>${f<1?`<b><i style="width:${f*100}%"></i></b>`:''}</button>`}).join('');
 $('#grid').querySelectorAll('.plot').forEach(b=>b.onclick=e=>tap(+b.dataset.i,e))}
function modes(){const o=[`<button class="btn ${mode==='plant'?'on':''}" data-m="plant">🌱 زرع</button>`,`<button class="btn ${mode==='fert'?'on':''}" data-m="fert">🧪 سماد (${me.f})</button>`];
 if(view!==uid)o.push('<button class="btn alt" data-m="gift">🎁 ابعت 50 $</button>');if(me.hv)o.push('<button class="btn alt" data-m="all">✂️ حصاد الكل</button>','<button class="btn alt" data-m="sow">🌾 زرع الكل</button>');
 $('#modes').innerHTML=o.join('');$('#modes').querySelectorAll('button').forEach(b=>b.onclick=e=>{const m=b.dataset.m;if(m==='all'||m==='sow'){if(view!==uid)return;let k=0;
  if(m==='all')me.P.slice(0,me.n).forEach((p,i)=>{if(p&&(!p.by||p.by===uid)&&pr(p,me,Date.now())>=1){harv(i,0,1);k++}});
  else{const c=CR[sel];me.P.slice(0,me.n).forEach((p,i)=>{if(!p&&me.coins>=c.c&&lvl(me.xp)>=c.l){me.coins-=c.c;me.P[i]={c:sel,t:Date.now(),w:0};k++}})}
  pop((m==='all'?'✂️ ':'🌾 ')+k,e);snd(600);done()}else if(m==='gift')gift(e);else{mode=m;modes()}})}
function harv(i,e,q){const p=me.P[i],k=Math.random()<.08?2:1,key='c'+p.c;me.inv[key]=(me.inv[key]||0)+k;qs().h+=k;gain(2+p.c*2);me.P[i]=null;if(!q){pop('+'+k+' '+CR[p.c].e+(k>1?' ✨':''),e);snd(660);burst(e,CR[p.c].e)}}
async function help(i,e,d,p){const tx=f=>runTransaction(FS,async t=>{const rf=doc(FS,R+'/farms/'+view),sn=await t.get(rf),Q=pl(sn.data()),r=f(Q);if(r)t.update(rf,{p:JSON.stringify(Q)});return r}).catch(()=>0);
 if(!p){const c=CR[sel];if(lvl(me.xp)<c.l)return pop('🔒 مستوى '+c.l,e);if(me.coins<c.c)return pop('فلوسك مش كفاية',e);
  if(await tx(Q=>{if(Q[i])return 0;Q[i]={c:sel,t:Date.now(),w:0,by:uid};return 1})){me.coins-=c.c;pop('🌱 زرعت في أرضه',e);snd(300);done()}}
 else{const c=p.c;if(await tx(Q=>{const q=Q[i];if(!q||q.by!==uid||pr(q,d,Date.now())<1)return 0;Q[i]=null;return 1})){me.inv['c'+c]=(me.inv['c'+c]||0)+1;qs().h++;gain(2+c*2);pop('+1 '+CR[c].e,e);snd(660);burst(e,CR[c].e);done()}}}
function done(){save();hud();grid();modes();panel();plrs();dashboard()}
function tap(i,e){const mine=view===uid,d=mine?me:others[view],P=mine?me.P:pl(d),p=P[i],now=Date.now();
 if(mine){
  if(!p){const c=CR[sel];if(lvl(me.xp)<c.l)return pop('🔒 مستوى '+c.l,e);if(me.coins<c.c)return pop('فلوسك مش كفاية',e);me.coins-=c.c;P[i]={c:sel,t:now,w:0};pop('-'+c.c+' $',e);snd(300)}
  else if(pr(p,me,now)>=1){if(p.by&&p.by!==uid)return pop('ده زرع صاحبه 🌱',e);harv(i,e)}
  else if(mode==='fert'){if(me.f<1)return pop('مفيش سماد! اشتري من الشوب',e);me.f--;p.w=(p.w||0)+(G(p,me)-(now-p.t+(p.w||0)))/2;pop('🧪 -50% وقت',e);snd(520)}
  else return;done()
 }else if((d.hl||[]).includes(uid)&&(!p||(pr(p,d,now)>=1&&p.by===uid)))return help(i,e,d,p);else{if(!p)return;if(pr(p,d,now)>=1)return pop('جاهز بالفعل',e);if((p.x||0)>=3)return pop('اتسقى كفاية 💦',e);
  p.w=(p.w||0)+G(p,d)*.25;p.x=(p.x||0)+1;d.p=JSON.stringify(P);me.coins++;me.helped++;qs().w++;gain(1);pop('💧 +1 $',e);snd(450);
  if(db)runTransaction(FS,async tr=>{const rf=doc(FS,R+'/farms/'+view),sn=await tr.get(rf);const Q=JSON.parse(sn.data().p);if(!Q[i]||(Q[i].x||0)>=3)return;Q[i].w=(Q[i].w||0)+G(Q[i],d)*.25;Q[i].x=(Q[i].x||0)+1;tr.update(rf,{p:JSON.stringify(Q)})}).catch(()=>{});done()}}
const base=k=>{const t=k[0],i=+k.slice(1);if(t==='a')return AN[i].p;if(t==='f')return FA[i].p;return Math.round(CR[i].p*mm(i)*TM[t])};
const val=k=>Math.max(1,Math.round(base(k)*Math.max(1,lvl(me.xp))));
const nmOf=k=>{const t=k[0],i=+k.slice(1);if(t==='a')return{e:AN[i].pe,n:AN[i].pn};if(t==='f')return{e:FA[i].out,n:FA[i].on};return{e:(t==='g'?'✨':t==='d'?'💎':'')+CR[i].e,n:(t==='g'?'ذهبي ':t==='d'?'ماسي ':'')+CR[i].n}};
const mg=k=>me.inv[k]>=3&&(k[0]==='c'||k[0]==='g')?`<div style="text-align:left;padding-bottom:6px"><button class="btn alt" data-a="merge" data-k="${k}">🔮 دمج 3 ← ${k[0]==='c'?'ذهبي ✨ (x5)':'ماسي 💎 (x30)'}</button></div>`:'';
function eat(f){let need=f.k;const ks=[];for(let i=f.lo;i<=f.hi&&need>0;i++){const k='c'+i,n=me.inv[k]||0;if(n>0){const t=Math.min(n,need);ks.push([k,t]);need-=t}}if(need>0)return 0;ks.forEach(([k,t])=>me.inv[k]-=t);return 1}
function panel(){
 $('#tabs').innerHTML=TABS.map(([k,l])=>`<button class="tb ${k===tab?'on':''}" data-t="${k}">${l}</button>`).join('');
 $('#tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;panel()});
 const P=$('#panel'),L=lvl(me.xp),it=(e,n,s,a,price,off)=>`<div class="it"><span>${e} ${n}<small>${s}</small></span><button class="btn ${off?'off':''}" ${a}>${price}</button></div>`;let h='';
 if(tab==='seed'){const c=CR[sel];h=`<div class="shop">${CR.map((c,i)=>`<button class="crop ${i===sel?'on':''} ${L<c.l?'lock':''}" data-a="sel" data-i="${i}" title="${c.n}"><span>${c.e}</span>${L<c.l?'🔒'+c.l:'$'+c.c}</button>`).join('')}</div>
  <div class="mut" style="margin-top:8px">${c.e} <b>${c.n}</b> — بياخد ${fmt(Math.round(c.g*.9**me.s))} • تكلفة $${c.c} • سعر السوق دلوقتي $${val('c'+sel)} • مضاعف المستوى ×${Math.max(1,L)}</div>`}
 if(tab==='shop'){const lc=cost(40,1.18**(me.n-12)),sc=cost(150,2.5**me.s),dlr=Date.now()-me.dl>=864e5;
  h=it('🌍','أرض جديدة','قطع أرض أكتر ('+me.n+'/36)',`data-a="land"`,me.n>=36?'خلص':'$'+lc,me.n>=36)+
  it('⚡','سرعة النمو','كل مستوى -10% وقت ('+me.s+'/5)',`data-a="spd"`,me.s>=5?'خلص':'$'+sc,me.s>=5)+
  it('🧪','سماد','بيقلل نص الوقت المتبقي • معاك '+me.f,`data-a="fert"`,'$25')+
  it('🚜','حصّادة وبذّارة','أزرار حصاد الكل وزرع الكل',`data-a="hv"`,me.hv?'✔ معاك':'$400',me.hv)+it('🎁','مكافأة يومية','$ '+40*L+' كل 24 ساعة',`data-a="daily"`,dlr?'استلم':'بعد '+fmt(Math.ceil((864e5-(Date.now()-me.dl))/1000)),!dlr)}
 if(tab==='bag'){const ks=Object.keys(me.inv).filter(k=>me.inv[k]>0);let tot=0;
  h=ks.length?ks.map(k=>{const o=nmOf(k),v=val(k),m=k[0]==='c'?mm(+k.slice(1)):1;tot+=v*me.inv[k];return it(o.e,o.n+' ×'+me.inv[k],'سعر الوحدة $'+v+(m>1.08?' 📈':m<.92?' 📉':''),`data-a="sell" data-k="${k}"`,'بيع الكل')+mg(k)}).join('')+`<div style="margin-top:10px"><button class="btn alt" data-a="sellall" style="width:100%">💰 بيع كل حاجة ($${tot})</button></div>`:'<div class="mut">المخزن فاضي — احصد محاصيل الأول 🌾</div>'}
 if(tab==='zoo')h=AN.map((a,i)=>{const n=me.an[i],r=Math.min(8*n,Math.floor((Date.now()-me.ac[i])/(a.t*1000))*n),bc=cost(a.c,1.6**n);
  return it(a.e,a.n+' ×'+n,a.pe+' '+a.pn+' كل '+fmt(a.t)+' لكل واحد • جاهز: '+r+(L<a.l?' • 🔒 مستوى '+a.l:''),`data-a="${r?'col':'abuy'}" data-i="${i}"`,r?'اجمع '+a.pe:(n>=6?'خلص':'شراء $'+bc),!r&&(n>=6||L<a.l))}).join('')+`<div class="mut" style="padding-top:8px">اضغط شراء، ولما ينتجوا اجمع وبيع من المخزن.</div>`+(AN.some((a,i)=>me.an[i]>0)?`<button class="btn alt" data-a="colall" style="width:100%;margin-top:6px">اجمع الكل</button>`:'');
 if(tab==='qs'){const q=qs();h=QS.map((x,i)=>it(x[0],x[1],Math.min(q[x[2]],x[3])+'/'+x[3]+' • مكافأة $'+x[4],`data-a="claim" data-i="${i}"`,q.c[i]?'✔ اتسلمت':q[x[2]]>=x[3]?'استلم':'🔒',q.c[i]||q[x[2]]<x[3])).join('')+'<div class="mut" style="padding-top:8px">المهام بتتجدد كل يوم 🌅</div>'}
 if(tab==='fa')h=`<button class="btn alt" style="width:100%;margin-bottom:8px" data-a="factorytab">🏭 فتح مركز المصانع في تاب مستقل</button>`+FA.map((f,i)=>{const x=me.fa[i];if(!x.o)return it(f.e,f.n,'🔒 مستوى '+f.l+' • بيحوّل '+f.k+' محاصيل ('+CR[f.lo].e+'→'+CR[f.hi].e+') إلى '+f.out,`data-a="fbuy" data-i="${i}"`,'$'+f.c,L<f.l||me.coins<f.c);const rem=x.s?Math.max(0,f.t-(Date.now()-x.s)/1000):0;
  if(x.s)return rem>0?it(f.e,f.n,'شغال... '+f.out,'data-a="x"','⏳ '+fmt(Math.ceil(rem)),1):it(f.e,f.n,'خلّص!',`data-a="fcol" data-i="${i}"`,'استلم '+f.out);
  return it(f.e,f.n,'يستهلك '+f.k+' محاصيل ('+CR[f.lo].e+'→'+CR[f.hi].e+') ويطلّع '+f.out+' ($'+f.p+')',`data-a="frun" data-i="${i}"`,'▶ تشغيل')}).join('');
 if(tab==='rq'){const d=others[view]||{};h='';
  if(view!==uid){const hp=(d.hl||[]).includes(uid),s0=MQ[view];h+=it('🌱','أرض '+esc(d.name||''),hp?'انت شغال فيها: ازرع واحصد اللي زرعته':s0==='pending'?'طلبك مستني الموافقة':'عايز تلعب في أرضه؟','data-a="lreq"',hp?'✔ مقبول':s0==='pending'?'⏳':'🙏 اطلب',hp||s0==='pending')}
  Object.values(LQ).filter(x=>x.status==='pending').forEach(x=>h+=it('🙋',esc(x.rname||'؟'),'عايز يلعب في أرضك',`data-a="lok" data-k="${x.requester}"`,'✔ قبول')+`<div style="text-align:left"><button class="btn off" data-a="lno" data-k="${x.requester}">رفض</button></div>`);
  (me.hl||[]).forEach(id=>h+=it('🧑‍🌾',esc((others[id]||{}).name||'؟'),'شغال في أرضك',`data-a="lrm" data-k="${id}"`,'إزالة'));
  if(!h)h='<div class="mut">زور مزرعة صاحبك من شريط اللاعبين فوق واطلب تلعب فيها 🤝</div>'}
 P.innerHTML=h}
$('#panel').onclick=e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset,e)};
function buy(c,e){if(me.coins<c){pop('فلوسك مش كفاية',e);return 0}me.coins-=c;snd(400);return 1}
function col(i){const a=AN[i],n=me.an[i],r=Math.min(8*n,Math.floor((Date.now()-me.ac[i])/(a.t*1000))*n);if(r>0){me.inv['a'+i]=(me.inv['a'+i]||0)+r;me.ac[i]=Date.now();return r}return 0}
function act(a,d,e){const L=lvl(me.xp);
 if(a==='factorytab'){const win=window.open('factory.html?w='+encodeURIComponent(WID),'factory_center');if(!win)location.href='factory.html?w='+encodeURIComponent(WID);return}
 if(a==='sel'){if(L>=CR[+d.i].l){sel=+d.i;mode='plant';panel();modes()}else pop('🔒 مستوى '+CR[+d.i].l,e);return}
 if(a==='view'){view=d.k;grid();panel();plrs();modes();return}
 if(a==='send'){const m=$('#msg').value.trim();if(!m)return;$('#msg').value='';log(me.name,m);{const r=doc(collection(FS,R+'/chat'));sent.add(r.id);setDoc(r,{u:uid,n:me.name,m,t:Date.now()}).catch(()=>{})}return}
 if(a==='land'&&me.n<36&&buy(cost(40,1.18**(me.n-12)),e))me.n++;
 else if(a==='spd'&&me.s<5&&buy(cost(150,2.5**me.s),e))me.s++;
 else if(a==='fert'&&buy(25,e))me.f++;
 else if(a==='hv'&&!me.hv&&buy(400,e))me.hv=1;
 else if(a==='sell'){const v=val(d.k)*me.inv[d.k];me.coins+=v;qs().s+=v;gain(Math.ceil(v/20));me.inv[d.k]=0;pop('+'+v+' $',e);snd(760,.15)}
 else if(a==='sellall'){let v=0;for(const k in me.inv){v+=val(k)*me.inv[k];me.inv[k]=0}me.coins+=v;qs().s+=v;gain(Math.ceil(v/20));pop('+'+v+' $',e);snd(760,.2)}
 else if(a==='abuy'){const i=+d.i;if(L<AN[i].l)return pop('🔒 مستوى '+AN[i].l,e);if(me.an[i]<6&&buy(cost(AN[i].c,1.6**me.an[i]),e)){col(i);if(!me.an[i])me.ac[i]=Date.now();me.an[i]++;}}
 else if(a==='col'){const r=col(+d.i);pop('+'+r+' '+AN[+d.i].pe,e);snd(700)}
 else if(a==='colall'){let r=0;AN.forEach((x,i)=>r+=col(i));pop('+'+r,e);snd(700)}
 else if(a==='claim'){const q=qs(),x=QS[+d.i];if(q[x[2]]>=x[3]&&!q.c[+d.i]){q.c[+d.i]=1;me.coins+=x[4];gain(8);pop('+'+x[4]+' $',e);snd(800,.2)}}
 else if(a==='daily'&&Date.now()-me.dl>=864e5){me.dl=Date.now();const b=40*L;me.coins+=b;pop('🎁 +'+b+' $',e);snd(800,.25)}
 else if(a==='merge'){const k=d.k,t=k[0],i=+k.slice(1);if((me.inv[k]||0)>=3&&(t==='c'||t==='g')){me.inv[k]-=3;const nk=(t==='c'?'g':'d')+i;me.inv[nk]=(me.inv[nk]||0)+1;gain(10+i*3*(t==='c'?1:6));pop('🔮 دمج!',e);snd(900,.25)}}
 else if(a==='fbuy'){const i=+d.i,f=FA[i];if(L<f.l)return pop('🔒 مستوى '+f.l,e);if(!me.fa[i].o&&buy(f.c,e)){me.fa[i].o=1;save();const win=window.open('factory.html?w='+encodeURIComponent(WID)+'&f='+i,'factory_'+i);if(!win)location.href='factory.html?w='+encodeURIComponent(WID)+'&f='+i;}}
 else if(a==='frun'){const f=FA[+d.i],st=me.fa[+d.i];if(!st.s){if(eat(f)){st.s=Date.now();snd(500)}else pop('محتاج '+f.k+' محاصيل من '+CR[f.lo].e+' لـ '+CR[f.hi].e,e)}}
 else if(a==='fcol'){const f=FA[+d.i],st=me.fa[+d.i];if(st.s&&Date.now()-st.s>=f.t*1000){me.inv['f'+d.i]=(me.inv['f'+d.i]||0)+1;st.s=0;gain(Math.ceil(f.p/3));pop('+1 '+f.out,e);snd(760)}}
 else if(a==='lreq'){if(view!==uid&&MQ[view]!=='pending'){MQ[view]='pending';setDoc(doc(FS,R+'/lreq/'+view+'_'+uid),{owner:view,requester:uid,rname:me.name,status:'pending',t:Date.now()}).then(()=>pop('اتبعت الطلب 🤝',e)).catch(()=>{})}}
 else if(a==='lok'||a==='lno'||a==='lrm'){const k=d.k;updateDoc(doc(FS,R+'/lreq/'+uid+'_'+k),{status:a==='lok'?'ok':'no'}).catch(()=>{});if(a==='lok'){if(!me.hl.includes(k))me.hl.push(k)}else me.hl=me.hl.filter(x=>x!==k)}
 done()}
