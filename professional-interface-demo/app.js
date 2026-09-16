const API = (function() {
  if (typeof window !== 'undefined' && window.__API_URL__) return window.__API_URL__;
  if (location.port === '8000') return '';
  if (location.pathname.includes('/local-tutor-connector/')) return '/local-tutor-connector/backend/api';
  return '/api';
})();
let data={tutors:[],requests:[],rooms:[]},tab='tutors',editing=null,currentRoom=null;
const $=s=>document.querySelector(s),cards=$('#cards');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const flag=c=>({'India':'🇮🇳','Singapore':'🇸🇬','Japan':'🇯🇵','South Korea':'🇰🇷','Malaysia':'🇲🇾','Indonesia':'🇮🇩','Philippines':'🇵🇭'}[c]||'🌏');

async function api(path,options={}){
 const response=await fetch(API+path,{headers:{'Content-Type':'application/json'},...options});
 const result=await response.json().catch(()=>({error:'Invalid server response'}));
 if(!response.ok)throw new Error(result.error||'Request failed');
 return result;
}
function normalizeTutor(t){return {...t,available:t.available_time,flag:flag(t.country),sessions:t.sessions_completed??0}}
function normalizeRequest(r){return {...r,student:r.student_name,time:r.preferred_time}}
function normalizeRoom(r){return {...r,host:r.host_name,time:r.scheduled_time,flag:flag(r.country),members:Number(r.members||0),capacity:Number(r.capacity)}}
function tutorPayload(x){return {name:x.name,department:x.department,subjects:x.subjects,available_time:x.available,mode:x.mode,contact:x.contact,bio:x.bio,country:x.country,languages:x.languages}}
function requestPayload(x){return {student_name:x.student,subject:x.subject,topic:x.topic,description:x.description,preferred_time:x.time,mode:x.mode,contact:x.contact,status:x.status||'Open',country:x.country,languages:x.languages}}

async function load(){
 try{
  const [tutors,requests,rooms]=await Promise.all([api('/tutors'),api('/requests'),api('/rooms')]);
  data={tutors:tutors.map(normalizeTutor),requests:requests.map(normalizeRequest),rooms:rooms.map(normalizeRoom)};render();
 }catch(error){showError(`Cannot connect to the database: ${error.message}. Check database.local.php and import schema-hosting.sql.`)}
}
function showError(text){const n=$('#notice');n.textContent=text;n.classList.remove('hidden');n.style.background='#fff0f1';n.style.color='#a32b38';n.style.borderColor='#f0c5cb'}
function toast(text){const n=$('#notice');n.textContent=text;n.style.cssText='';n.classList.remove('hidden');setTimeout(()=>n.classList.add('hidden'),2600)}
function visibleItems(){const q=$('#search').value.toLowerCase(),country=$('#country').value,language=$('#language').value;return data[tab].filter(x=>Object.values(x).join(' ').toLowerCase().includes(q)&&(!country||x.country===country)&&(!language||(x.languages||'').includes(language)))}
function render(){const items=visibleItems();$('#tutorCount').textContent=data.tutors.length;$('#requestCount').textContent=data.requests.filter(x=>x.status==='Open').length;$('#subjectCount').textContent=new Set(data.tutors.flatMap(x=>x.subjects.split(',').map(s=>s.trim()))).size;$('#results').textContent=`${items.length} result${items.length===1?'':'s'}`;cards.innerHTML=items.map(tab==='tutors'?tutorCard:tab==='requests'?requestCard:roomCard).join('');$('#empty').classList.toggle('hidden',items.length>0);bindCards()}
function tutorCard(t){
 const avatarHtml = t.name.includes('Sulthan') 
  ? `<div class="avatar" style="overflow:hidden;padding:0;"><img src="admin-sulthan.jpg" alt="Mohammed Sulthan Akthar" style="width:100%;height:100%;object-fit:cover;"></div>` 
  : `<div class="avatar">${esc(t.name.split(' ').map(x=>x[0]).join('').slice(0,2))}</div>`;
 const badgeHtml = t.name.includes('Sulthan') ? `<span class="verified" style="background:#185adb;color:#fff;">⭐ Lead Admin & Founder</span>` : `<span class="verified">✓ Verified</span>`;
 return `<article class="card"><div class="top">${avatarHtml}<div><h3>${esc(t.name)} ${badgeHtml}</h3><p class="muted location"><span>${esc(t.flag)}</span>${esc(t.department)}</p></div><div class="actions"><button class="icon edit" data-id="${t.id}" aria-label="Edit">✎</button><button class="icon delete" data-id="${t.id}" aria-label="Delete">⌫</button></div></div><div class="chips">${t.subjects.split(',').map(s=>`<span>${esc(s.trim())}</span>`).join('')}</div><p class="description">${esc(t.bio)}</p><div class="lang-row">${t.languages.split(',').map(s=>`<span>${esc(s.trim())}</span>`).join('')}</div><div class="meta"><span class="availability">Available ${esc(t.available)}</span><span>⌖ ${esc(t.mode)} · ${esc(t.country)}</span><span><b class="rating">★ ${esc(t.rating)}</b> · ${esc(t.sessions)} sessions</span></div><div class="cta-row"><a class="contact" href="mailto:${esc(t.contact)}">Message tutor</a><button class="secondary join-tutor" data-id="${t.id}">Join session</button></div></article>`
}
function requestCard(r){return `<article class="card"><div class="request-head"><span class="status ${r.status.toLowerCase()}">${esc(r.status)}</span><span class="muted">${esc(r.country)}</span><div class="actions"><button class="icon edit" data-id="${r.id}">✎</button><button class="icon delete" data-id="${r.id}">⌫</button></div></div><span class="subject">${esc(r.subject)}</span><h3>${esc(r.topic)}</h3><p class="description">${esc(r.description)}</p><div class="lang-row">${r.languages.split(',').map(s=>`<span>${esc(s.trim())}</span>`).join('')}</div><div class="meta"><span>♙ ${esc(r.student)}</span><span>◷ ${esc(r.time)}</span><span>⌖ ${esc(r.mode)}</span></div><div class="cta-row"><a class="contact" href="mailto:${esc(r.contact)}">Offer help</a><button class="secondary toggle" data-id="${r.id}">${r.status==='Open'?'Close':'Reopen'}</button></div></article>`}
function roomCard(r){const percent=Math.min(100,Math.round(r.members/r.capacity*100));return `<article class="card room-card"><div class="top"><div class="avatar">◉</div><div><span class="availability">${esc(r.status)} · ${esc(r.time)}</span><h3>${esc(r.title)}</h3><p class="muted">Hosted by ${esc(r.host)}</p></div></div><div class="chips"><span>${esc(r.subject)}</span><span>${esc(r.level)}</span></div><div class="meta"><span>${esc(r.flag)} ${esc(r.country)} · ${esc(r.languages)}</span><span>◎ Video-ready session and collaborative notes</span></div><div class="room-progress"><i style="width:${percent}%"></i></div><div class="room-info"><span>${r.members} students joined</span><span>${Math.max(0,r.capacity-r.members)} seats left</span></div><button class="contact join" data-id="${r.id}" ${r.members>=r.capacity?'disabled':''}>${r.members>=r.capacity?'Room full':'Join study room →'}</button></article>`}

function bindCards(){
 document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>openForm(Number(b.dataset.id)));
 document.querySelectorAll('.delete').forEach(b=>b.onclick=async()=>{if(!confirm('Delete this listing permanently?'))return;try{await api(`/${tab}/${b.dataset.id}`,{method:'DELETE'});toast('Listing deleted');load()}catch(e){showError(e.message)}});
 document.querySelectorAll('.toggle').forEach(b=>b.onclick=async()=>{const r=data.requests.find(x=>x.id===Number(b.dataset.id));try{await api('/requests/'+r.id,{method:'PUT',body:JSON.stringify(requestPayload({...r,status:r.status==='Open'?'Closed':'Open'}))});toast('Request status updated');load()}catch(e){showError(e.message)}});
 document.querySelectorAll('.join').forEach(b=>b.onclick=()=>openRoom(data.rooms.find(x=>x.id===Number(b.dataset.id))));
 document.querySelectorAll('.join-tutor').forEach(b=>b.onclick=()=>{const t=data.tutors.find(x=>x.id===Number(b.dataset.id));const room=data.rooms.find(r=>r.host===t.name)||data.rooms[0];room?openRoom(room):toast('No open room for this tutor yet')});
}
function openRoom(room){currentRoom=room;$('#roomTitle').textContent=room.title;$('#roomMeta').textContent=`${room.time} · ${room.country}`;$('#roomOverlay').classList.remove('hidden')}
const tutorFields=[['name','Full name'],['department','University / department'],['subjects','Subjects'],['available','Available time'],['country','Country'],['languages','Languages'],['mode','Mode','select',['Online','Offline','Both']],['contact','Email or phone'],['bio','Professional introduction','textarea']];
const requestFields=[['student','Student name'],['subject','Subject'],['topic','Topic'],['time','Preferred time'],['country','Country'],['languages','Languages'],['mode','Mode','select',['Online','Offline','Either']],['contact','Email or phone'],['description','What help do you need?','textarea']];
function openForm(id=null){editing=id;const item=id?data[tab].find(x=>x.id===id):{};$('#formTitle').textContent=`${id?'Edit':'Create'} ${tab==='tutors'?'tutor profile':'help request'}`;$('#formEyebrow').textContent=id?'UPDATE LISTING':'NEW LISTING';const fields=tab==='tutors'?tutorFields:requestFields;$('#fields').innerHTML=`<div class="form-grid">${fields.map(([key,label,type='input',opts])=>type==='select'?`<label>${label}<select name="${key}">${opts.map(v=>`<option ${item[key]===v?'selected':''}>${v}</option>`).join('')}</select></label>`:type==='textarea'?`</div><label>${label}<textarea name="${key}" required>${esc(item[key]||'')}</textarea></label><div class="form-grid">`:`<label>${label}<input name="${key}" value="${esc(item[key]||'')}" required></label>`).join('')}</div>`;$('#overlay').classList.remove('hidden')}
$('#form').onsubmit=async e=>{e.preventDefault();const x=Object.fromEntries(new FormData(e.target)),resource=tab==='tutors'?'tutors':'requests',payload=tab==='tutors'?tutorPayload(x):requestPayload({...x,status:editing?data.requests.find(r=>r.id===editing).status:'Open'});try{await api(`/${resource}${editing?'/'+editing:''}`,{method:editing?'PUT':'POST',body:JSON.stringify(payload)});$('#overlay').classList.add('hidden');toast(editing?'Listing updated':'Listing created');load()}catch(error){showError(error.message)}};
const copy={tutors:['Learn together, across borders.','Find verified peer tutors by subject, language and time zone.','Become a tutor'],requests:['Ask clearly. Get help faster.','Post a learning need and connect with students across Asia.','Ask for help'],rooms:['Enter a room. Leave with clarity.','Join live, small-group sessions hosted by peer tutors.','Browse rooms']};
document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>{tab=b.dataset.tab;document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x===b));[$('#heading').textContent,$('#subheading').textContent,$('#create span').textContent]=copy[tab];$('#create').disabled=tab==='rooms';$('#create').style.opacity=tab==='rooms'?'.55':'1';$('#search').placeholder=tab==='rooms'?'Search subject, room or host':'Search tutor, subject or university';$('#search').value='';render()});
$('#create').onclick=()=>tab!=='rooms'&&openForm();$('#close').onclick=()=>$('#overlay').classList.add('hidden');$('#roomClose').onclick=()=>$('#roomOverlay').classList.add('hidden');
$('#confirmJoin').onclick=async()=>{const name=$('#joinName').value.trim();if(!name)return $('#joinName').focus();try{await api('/join-room',{method:'POST',body:JSON.stringify({room_id:currentRoom.id,student_name:name})});$('#roomOverlay').classList.add('hidden');toast(`${name}, your seat is confirmed!`);load()}catch(e){showError(e.message)}};
['search','country','language'].forEach(id=>$('#'+id).oninput=render);load();
