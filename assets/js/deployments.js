'use strict';
let deployments=loadRecords('deployments',startDeployments);
$('#stage').innerHTML=options(names.stage,'planning');
function renderDeployments(){
 $('#recordCount').textContent=`Всего: ${deployments.length}`;
 $('#deploymentTable').innerHTML=deployments.map(i=>`<tr><td class="title-cell"><strong>${esc(i.client)}</strong><small>${esc(i.id)} · ${esc(i.product)} · ${esc(i.version)}</small></td><td>${esc(i.owner)}</td><td><select data-stage="${esc(i.id)}" aria-label="Этап ${esc(i.id)}">${options(names.stage,i.stage)}</select></td><td>${Math.round(i.done/i.total*100)}% · ${i.done}/${i.total}<div class="progress"><i style="width:${i.done/i.total*100}%"></i></div></td><td>${formatDate(i.plannedDate+'T12:00:00')}</td><td><button class="button small secondary" data-progress="${esc(i.id)}" ${i.done>=i.total?'disabled':''}>+1 задача</button></td></tr>`).join('');
}
$('#deploymentForm').addEventListener('submit',event=>{
 event.preventDefault();error('');const d=formValues(event.target),done=Number(d.done),total=Number(d.total);
 if(!d.client||!d.product||!d.owner||!d.plannedDate||!d.done||!d.total)return error('Заполните все поля.');
 if(!validVersion(d.version))return error('Введите версию в формате v1.0.0.');
 if(!Number.isInteger(done)||!Number.isInteger(total)||done<0||total<1||done>total)return error('Число выполненных задач должно быть от 0 до общего количества.');
 const item={...d,id:nextId(deployments,'DEP-',2),version:normalizeVersion(d.version),done,total};
 const next=[...deployments,item];if(!saveData('deployments',next))return;deployments=next;renderDeployments();event.target.reset();showToast('Внедрение добавлено');
});
$('#deploymentTable').addEventListener('change',event=>{const id=event.target.dataset.stage;if(!id)return;const next=structuredClone(deployments);next.find(i=>i.id===id).stage=event.target.value;if(saveData('deployments',next)){deployments=next;renderDeployments();}});
$('#deploymentTable').addEventListener('click',event=>{const id=event.target.dataset.progress;if(!id)return;const next=structuredClone(deployments),item=next.find(i=>i.id===id);item.done=Math.min(item.done+1,item.total);if(saveData('deployments',next)){deployments=next;renderDeployments();}});
renderDeployments();
