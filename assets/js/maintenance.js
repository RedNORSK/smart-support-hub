'use strict';
let requests=loadRecords('requests',startRequests);
$('#type').innerHTML=options(names.type);$('#requestStatus').innerHTML=options(names.requestStatus);
function renderRequests(){
 $('#recordCount').textContent=`Всего: ${requests.length}`;
 $('#requestTable').innerHTML=requests.map(i=>`<tr><td class="title-cell"><strong>${esc(i.title)}</strong><small>${esc(i.id)}</small></td><td>${badge(names.type[i.type],'blue')}</td><td><select data-status="${esc(i.id)}" aria-label="Статус ${esc(i.id)}">${options(names.requestStatus,i.status)}</select></td><td>${esc(i.targetVersion)}</td></tr>`).join('');
}
$('#requestForm').addEventListener('submit',event=>{
 event.preventDefault();error('');const d=formValues(event.target);
 if(!d.title)return error('Введите описание изменения.');
 if(!validVersion(d.targetVersion))return error('Введите целевую версию в формате v1.2.0.');
 const item={...d,id:nextId(requests,'REQ-'),targetVersion:normalizeVersion(d.targetVersion)},next=[...requests,item];
 if(!saveData('requests',next))return;requests=next;renderRequests();event.target.reset();showToast('Заявка создана');
});
$('#requestTable').addEventListener('change',event=>{const id=event.target.dataset.status;if(!id)return;const next=structuredClone(requests);next.find(i=>i.id===id).status=event.target.value;if(saveData('requests',next)){requests=next;renderRequests();}});
renderRequests();
