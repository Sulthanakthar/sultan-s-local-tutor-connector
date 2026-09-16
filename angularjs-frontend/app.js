 angular.module('peerBridge',[]).controller('MainController',function($http){
 const vm=this, API=(window.__API_URL__||(location.port==='8000'?'':(location.pathname.includes('/local-tutor-connector/')?'/local-tutor-connector/backend/api':location.origin+'/api'))); vm.tab='tutors';vm.tutors=[];vm.requests=[];
 vm.load=function(){Promise.all([$http.get(API+'/tutors'),$http.get(API+'/requests')]).then(([t,r])=>{vm.tutors=t.data;vm.requests=r.data}).catch(e=>vm.notice=e.data?.error||'Could not connect to API')};
 vm.openForm=function(){vm.editing=null;vm.form=vm.tab==='tutors'?'tutor':'request';vm.data=vm.form==='tutor'?{mode:'Both'}:{mode:'Either',status:'Open'}};
 vm.editTutor=t=>{vm.editing=t.id;vm.form='tutor';vm.data=angular.copy(t)}; vm.editRequest=r=>{vm.editing=r.id;vm.form='request';vm.data=angular.copy(r)};
 vm.save=function(){const resource=vm.form==='tutor'?'tutors':'requests',method=vm.editing?'put':'post',url=API+'/'+resource+(vm.editing?'/'+vm.editing:'');$http[method](url,vm.data).then(()=>{vm.form=null;vm.notice='Saved successfully';vm.load()}).catch(e=>vm.notice=e.data?.error||'Save failed')};
 vm.remove=function(type,id){if(!confirm('Delete this item permanently?'))return;$http.delete(API+'/'+type+'/'+id).then(()=>{vm.notice='Deleted successfully';vm.load()})};
 vm.toggle=function(r){$http.put(API+'/requests/'+r.id,{...r,status:r.status==='Open'?'Closed':'Open'}).then(vm.load)};vm.load();
});
