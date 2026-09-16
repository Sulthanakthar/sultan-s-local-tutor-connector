import React, {useEffect, useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BookOpen, Clock, Laptop, MapPin, Pencil, Plus, Search, Trash2, Users, X} from 'lucide-react';
import './style.css';

const API = import.meta.env.VITE_API_URL || (function() {
  if (typeof window !== 'undefined' && window.__API_URL__) return window.__API_URL__;
  if (location.port === '8000') return '';
  if (location.port === '5173') return 'http://127.0.0.1:8080/api';
  if (location.pathname.includes('/local-tutor-connector/')) return '/local-tutor-connector/backend/api';
  return '/api';
})();
const emptyTutor={name:'',department:'',subjects:'',available_time:'',mode:'Both',contact:'',bio:''};
const emptyRequest={student_name:'',subject:'',topic:'',description:'',preferred_time:'',mode:'Either',contact:'',status:'Open'};

const initialTutors = [
  { id: 1, name: 'Ananya Rao', department: 'MCA - Sacred Heart College', subjects: 'DBMS, SQL', available_time: 'Mon-Fri, 4:00-6:00 PM IST', mode: 'Both', contact: 'ananya@college.edu', bio: 'Database mentor focused on normalization and query practice.', country: 'India', languages: 'English, Tamil, Hindi', rating: 4.9, sessions_completed: 38 },
  { id: 2, name: 'Mei Lin', department: 'Computer Science - NUS', subjects: 'Python, Data Science', available_time: 'Tomorrow, 7:00 PM SGT', mode: 'Online', contact: 'mei@university.edu', bio: 'Practical support for pandas, statistics and machine learning.', country: 'Singapore', languages: 'English, Mandarin', rating: 4.8, sessions_completed: 52 },
  { id: 3, name: 'Haruto Sato', department: 'Engineering - University of Tokyo', subjects: 'Java, Algorithms', available_time: 'Saturday, 10:00 AM JST', mode: 'Online', contact: 'haruto@university.edu', bio: 'Java problem solving and algorithm walkthroughs.', country: 'Japan', languages: 'English, Japanese', rating: 4.9, sessions_completed: 44 }
];

const initialRequests = [
  { id: 1, student_name: 'Kavin M', subject: 'DBMS', topic: 'Normalization', description: 'Need help understanding 2NF, 3NF and practice questions.', preferred_time: 'Wednesday after 4 PM', mode: 'Offline', contact: 'kavin@college.edu', status: 'Open', country: 'India', languages: 'English, Tamil' },
  { id: 2, student_name: 'Meena P', subject: 'Java', topic: 'Exception handling', description: 'Looking for a one-hour session with simple coding examples.', preferred_time: 'Friday 5 PM', mode: 'Online', contact: 'meena@college.edu', status: 'Open', country: 'India', languages: 'English' }
];

async function call(path,options={}){
  const r=await fetch(API+path,{headers:{'Content-Type':'application/json'},...options});
  const contentType=r.headers.get('content-type')||'';
  if(!contentType.includes('application/json')) throw new Error('NON_JSON_RESPONSE');
  const d=await r.json();
  if(!r.ok)throw new Error(d.error||'Something went wrong');
  return d;
}

function Modal({title,onClose,children}){return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal"><div className="modal-head"><h2>{title}</h2><button className="icon" onClick={onClose}><X/></button></div>{children}</div></div>}
function App(){
 const [tab,setTab]=useState('tutors'),[tutors,setTutors]=useState([]),[requests,setRequests]=useState([]),[query,setQuery]=useState(''),[modal,setModal]=useState(null),[editing,setEditing]=useState(null),[notice,setNotice]=useState('');
 const load=async()=>{
   const localT = localStorage.getItem('peerbridge_tutors');
   const localR = localStorage.getItem('peerbridge_requests');
   const defaultT = localT ? JSON.parse(localT) : initialTutors;
   const defaultR = localR ? JSON.parse(localR) : initialRequests;
   try{
     const [t,r]=await Promise.all([call('/tutors'),call('/requests')]);
     setTutors(Array.isArray(t) && t.length ? t : defaultT);
     setRequests(Array.isArray(r) && r.length ? r : defaultR);
   }catch(e){
     setTutors(defaultT);
     setRequests(defaultR);
   }
 };

 useEffect(()=>{load()},[]);

 const shown=useMemo(()=>{
   const q=query.toLowerCase();
   return tab==='tutors'?tutors.filter(x=>(x.name+x.subjects+x.department).toLowerCase().includes(q)):requests.filter(x=>(x.student_name+x.subject+x.topic+x.status).toLowerCase().includes(q));
 },[tab,tutors,requests,query]);

 const save=async(e)=>{
   e.preventDefault();
   const isTutor=modal==='tutor';
   const data=Object.fromEntries(new FormData(e.currentTarget));
   try{
     await call(`/${isTutor?'tutors':'requests'}${editing?'/'+editing.id:''}`,{method:editing?'PUT':'POST',body:JSON.stringify(data)});
     setModal(null);
     setEditing(null);
     setNotice(editing?'Updated successfully':'Created successfully');
     load();
   }catch(x){
     if (isTutor) {
       let updated;
       if (editing) {
         updated = tutors.map(t => t.id === editing.id ? { ...t, ...data } : t);
       } else {
         const newTutor = { id: Date.now(), rating: 5.0, sessions_completed: 0, country: 'India', languages: 'English', bio: data.bio || 'Available to help fellow students.', ...data };
         updated = [newTutor, ...tutors];
       }
       setTutors(updated);
       localStorage.setItem('peerbridge_tutors', JSON.stringify(updated));
     } else {
       let updated;
       if (editing) {
         updated = requests.map(r => r.id === editing.id ? { ...r, ...data } : r);
       } else {
         const newReq = { id: Date.now(), status: 'Open', country: 'India', languages: 'English', ...data };
         updated = [newReq, ...requests];
       }
       setRequests(updated);
       localStorage.setItem('peerbridge_requests', JSON.stringify(updated));
     }
     setModal(null);
     setEditing(null);
     setNotice(editing ? 'Updated successfully' : 'Created successfully');
   }
 };

 const remove=async(type,id)=>{
   if(!confirm('Delete this item permanently?'))return;
   try{
     await call(`/${type}/${id}`,{method:'DELETE'});
     setNotice('Deleted successfully');
     load();
   }catch(e){
     if (type === 'tutors') {
       const updated = tutors.filter(t => t.id !== id);
       setTutors(updated);
       localStorage.setItem('peerbridge_tutors', JSON.stringify(updated));
     } else {
       const updated = requests.filter(r => r.id !== id);
       setRequests(updated);
       localStorage.setItem('peerbridge_requests', JSON.stringify(updated));
     }
     setNotice('Deleted successfully');
   }
 };

 const closeRequest=async(r)=>{
   try{
     await call('/requests/'+r.id,{method:'PUT',body:JSON.stringify({...r,status:r.status==='Open'?'Closed':'Open'})});
     load();
   }catch(e){
     const updated = requests.map(item => item.id === r.id ? { ...item, status: item.status === 'Open' ? 'Closed' : 'Open' } : item);
     setRequests(updated);
     localStorage.setItem('peerbridge_requests', JSON.stringify(updated));
   }
 };
 const open=(type,item=null)=>{setEditing(item);setModal(type)};
 return <><header><a className="brand"><span><BookOpen/></span><div>PeerBridge<small>Campus learning network</small></div></a><nav><button className={tab==='tutors'?'active':''} onClick={()=>setTab('tutors')}>Find tutors</button><button className={tab==='requests'?'active':''} onClick={()=>setTab('requests')}>Help requests</button></nav><button className="primary" onClick={()=>open(tab==='tutors'?'tutor':'request')}><Plus/> {tab==='tutors'?'Become a tutor':'Ask for help'}</button></header>
 <main><section className="intro"><div><p className="eyebrow">STUDENTS HELPING STUDENTS</p><h1>{tab==='tutors'?'Find the right peer tutor.':'See who needs your knowledge.'}</h1><p>{tab==='tutors'?'Search by subject and connect with someone from your campus.':'Browse open learning requests and offer timely peer support.'}</p></div><div className="stats"><div><b>{tutors.length}</b><span>Active tutors</span></div><div><b>{requests.filter(r=>r.status==='Open').length}</b><span>Open requests</span></div><div><b>{new Set(tutors.flatMap(t=>t.subjects.split(',').map(s=>s.trim()))).size}</b><span>Subjects</span></div></div></section>
 <section className="toolbar"><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tab==='tutors'?'Search name, department or subject':'Search student, subject or topic'}/></div><span>{shown.length} results</span></section>
 {notice&&<div className="notice" onClick={()=>setNotice('')}>{notice} <b>×</b></div>}
 <section className="grid">{shown.map(item=>tab==='tutors'?<article className="card" key={item.id}><div className="card-top"><div className="avatar">{item.name.charAt(0)}</div><div><h3>{item.name}</h3><p>{item.department}</p></div><div className="actions"><button onClick={()=>open('tutor',item)}><Pencil/></button><button onClick={()=>remove('tutors',item.id)}><Trash2/></button></div></div><div className="chips">{item.subjects.split(',').map(s=><span key={s}>{s.trim()}</span>)}</div><p className="bio">{item.bio||'Available to help fellow students.'}</p><div className="meta"><span><Clock/> {item.available_time}</span><span>{item.mode==='Online'?<Laptop/>:<MapPin/>} {item.mode}</span></div><a className="contact" href={`mailto:${item.contact}`}>Contact tutor</a></article>:<article className="card request" key={item.id}><div className="request-head"><span className={'status '+item.status.toLowerCase()}>{item.status}</span><div className="actions"><button onClick={()=>open('request',item)}><Pencil/></button><button onClick={()=>remove('requests',item.id)}><Trash2/></button></div></div><p className="subject">{item.subject}</p><h3>{item.topic}</h3><p className="bio">{item.description}</p><div className="meta"><span><Users/> {item.student_name}</span><span><Clock/> {item.preferred_time}</span><span><Laptop/> {item.mode}</span></div><div className="split"><a href={`mailto:${item.contact}`}>Offer help</a><button onClick={()=>closeRequest(item)}>{item.status==='Open'?'Close request':'Reopen'}</button></div></article>)}</section>
 {!shown.length&&<div className="empty"><BookOpen/><h2>No matches found</h2><p>Try another search or create a new listing.</p></div>}</main>
 {modal==='tutor'&&<Modal title={editing?'Edit tutor profile':'Create tutor profile'} onClose={()=>setModal(null)}><TutorForm value={editing||emptyTutor} save={save}/></Modal>}
 {modal==='request'&&<Modal title={editing?'Edit help request':'Create help request'} onClose={()=>setModal(null)}><RequestForm value={editing||emptyRequest} save={save}/></Modal>}</>;
}
const Input=({label,name,value,...p})=><label>{label}<input name={name} defaultValue={value} required {...p}/></label>;
function TutorForm({value,save}){return <form onSubmit={save}><div className="form-grid"><Input label="Full name" name="name" value={value.name}/><Input label="Department / year" name="department" value={value.department}/><Input label="Subjects (comma separated)" name="subjects" value={value.subjects}/><Input label="Available time" name="available_time" value={value.available_time}/><label>Mode<select name="mode" defaultValue={value.mode}><option>Online</option><option>Offline</option><option>Both</option></select></label><Input label="Email or phone" name="contact" value={value.contact}/></div><label>Short introduction<textarea name="bio" defaultValue={value.bio}/></label><button className="primary submit">Save tutor profile</button></form>}
function RequestForm({value,save}){return <form onSubmit={save}><div className="form-grid"><Input label="Student name" name="student_name" value={value.student_name}/><Input label="Subject" name="subject" value={value.subject}/><Input label="Topic" name="topic" value={value.topic}/><Input label="Preferred time" name="preferred_time" value={value.preferred_time}/><label>Mode<select name="mode" defaultValue={value.mode}><option>Online</option><option>Offline</option><option>Either</option></select></label><Input label="Email or phone" name="contact" value={value.contact}/></div><label>What help do you need?<textarea name="description" defaultValue={value.description} required/></label><input type="hidden" name="status" value={value.status}/><button className="primary submit">Save help request</button></form>}
createRoot(document.getElementById('root')).render(<App/>);
