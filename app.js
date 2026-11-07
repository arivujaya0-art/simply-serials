import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const demoSerials = [
 {id:'demo-1',title:'சிங்கப்பெண்ணே',channel:'Sun TV',description:'A family drama filled with emotion, relationships and memorable moments.',posterUrl:'',featured:true},
 {id:'demo-2',title:'பாண்டியன் ஸ்டோர்ஸ்',channel:'Vijay TV',description:'A story about family bonds, love and everyday life.',posterUrl:''},
 {id:'demo-3',title:'முத்தழகு',channel:'Colors Tamil',description:'An engaging Tamil family serial.',posterUrl:''},
 {id:'demo-4',title:'கயல்',channel:'Sun TV',description:'A story of courage, family and determination.',posterUrl:''},
 {id:'demo-5',title:'பாக்கியலட்சுமி',channel:'Vijay TV',description:'A family story about a woman finding her strength.',posterUrl:''},
 {id:'demo-6',title:'சிறகடிக்க ஆசை',channel:'Zee Tamil',description:'Relationships, dreams and new beginnings.',posterUrl:''}
];
let db=null, serials=demoSerials, episodes=[];
if(isFirebaseConfigured){try{const app=initializeApp(firebaseConfig);db=getFirestore(app);}catch(e){console.error('Firebase init failed',e);}}
const $=s=>document.querySelector(s);
function safeText(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function poster(url,title){return url?`<img src="${safeText(url)}" alt="${safeText(title)}" loading="lazy" onerror="this.remove()">`:`<span class="poster-placeholder">✿</span>`;}
async function loadData(){if(db){try{const s=await getDocs(query(collection(db,'serials'),orderBy('title')));serials=s.docs.map(d=>({id:d.id,...d.data()}));const e=await getDocs(query(collection(db,'episodes'),orderBy('createdAt','desc'),limit(12)));episodes=e.docs.map(d=>({id:d.id,...d.data()}));}catch(err){console.error(err);showNotice('Could not load Firebase data. Check Firestore setup and security rules.');}}
 renderSerials();renderEpisodes();}
function showNotice(msg){const n=document.createElement('div');n.className='notice';n.textContent=msg;document.querySelector('main')?.prepend(n);}
function renderSerials(){const grid=$('#serialGrid');if(!grid)return;const term=($('#searchInput')?.value||'').toLowerCase();const active=$('#channelPills .selected')?.dataset.channel||'All';const filtered=serials.filter(s=>(active==='All'||s.channel===active)&&(`${s.title} ${s.channel}`.toLowerCase().includes(term)));$('#serialCount').textContent=`${filtered.length} serials`;$('#emptyState').classList.toggle('hidden',filtered.length>0);grid.innerHTML=filtered.map(s=>`<article class="serial-card"><a href="serial.html?id=${encodeURIComponent(s.id)}"><div class="poster">${poster(s.posterUrl,s.title)}</div></a><div class="serial-info"><h3>${safeText(s.title)}</h3><div class="serial-meta">${safeText(s.channel||'Tamil Serial')}</div><div class="card-actions"><a class="small-btn primary" href="serial.html?id=${encodeURIComponent(s.id)}">View Episodes</a></div></div></article>`).join('')||'';}
function renderEpisodes(){const list=$('#latestEpisodes');if(!list)return;const rows=episodes.length?episodes:demoSerials.slice(0,4).map((s,i)=>({id:'demo-ep-'+i,serialId:s.id,serialTitle:s.title,episodeNumber:'Latest',createdAt:null,thumbnailUrl:s.posterUrl}));list.innerHTML=rows.map(e=>`<div class="episode-row"><div class="episode-thumb">${e.thumbnailUrl?`<img src="${safeText(e.thumbnailUrl)}" alt="">`:'▶'}</div><div class="episode-text"><strong>${safeText(e.serialTitle||'Tamil Serial')} · ${safeText(e.episodeNumber||'Episode')}</strong><small>${e.createdAt?.toDate?e.createdAt.toDate().toLocaleDateString('en-IN'):'Latest episode'}</small></div><a class="small-btn primary" href="watch.html?id=${encodeURIComponent(e.id)}">Watch</a></div>`).join('');}
$('#searchInput')?.addEventListener('input',renderSerials);$('#channelPills')?.addEventListener('click',e=>{const b=e.target.closest('button[data-channel]');if(!b)return;document.querySelectorAll('.channel-pill').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');renderSerials();});$('#menuToggle')?.addEventListener('click',()=>$('.main-nav').classList.toggle('open'));$('#year').textContent=new Date().getFullYear();
loadData();
