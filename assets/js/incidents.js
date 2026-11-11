'use strict';
let incidents=loadRecords('incidents',startIncidents);
$('#priority').innerHTML=options(names.priority,'medium');
$('#statusFilter').insertAdjacentHTML('beforeend',options(names.incidentStatus));
function renderIncidents(){
 const status=$('#statusFilter').value,query=$('#incidentSearch').value.trim().toLocaleLowerCase('ru-RU');
 const list=incidents.filter(i=>(status==='all'||i.status===status)&&(!query||(i.title+' '+i.id).toLocaleLowerCase('ru-RU').includes(query)));
 $('#incidentCount').textContent=`Показано: ${list.length} из ${incidents.length}`;
 $('#incidentTable').innerHTML=list.map(i=>{
  const sla=getSlaState(i),slaColor=sla==='breached'?'red':'green';
  return `<tr><td class="title-cell"><strong>${esc(i.title)}</strong><small>${esc(i.id)} · ${formatDate(i.createdAt,true)}</small></td><td>${badge(names.priority[i.priority],{critical:'red',high:'amber',medium:'blue',low:''}[i.priority])}</td><td>${badge(names.incidentStatus[i.status],i.status==='resolved'?'green':i.status==='in_progress'?'blue':'')}</td><td>${badge(names.sla[sla],slaColor)}<small class="sla-date">До ${formatDate(getDeadline(i),true)}</small></td><td>${i.status!=='resolved'?`${i.status==='new'?`<button class="button small secondary" data-action="start" data-id="${esc(i.id)}">В работу</button> `:''}<button class="button small" data-action="resolve" data-id="${esc(i.id)}">Решить</button>`:'<span class="muted">'+formatDate(i.resolvedAt,true)+'</span>'}</td></tr>`;
 }).join('')||'<tr><td colspan="5" class="empty">Обращения не найдены</td></tr>';
}
$('#incidentForm').addEventListener('submit',event=>{
 event.preventDefault();error('');const d=formValues(event.target);
 if(!d.title)return error('Введите описание инцидента.');
 const item={id:nextId(incidents,'INC-'),title:d.title,priority:d.priority,status:'new',createdAt:new Date().toISOString(),resolvedAt:null};
 const next=[...incidents,item];if(!saveData('incidents',next))return;incidents=next;renderIncidents();event.target.reset();showToast('Инцидент зарегистрирован');
});
$('#statusFilter').addEventListener('change',renderIncidents);
$('#incidentSearch').addEventListener('input',renderIncidents);
$('#incidentTable').addEventListener('click',event=>{
 const id=event.target.dataset.id,action=event.target.dataset.action;if(!id||!action)return;
 const next=structuredClone(incidents),item=next.find(i=>i.id===id);if(!item||item.status==='resolved')return;
 item.status=action==='resolve'?'resolved':'in_progress';item.resolvedAt=action==='resolve'?new Date().toISOString():null;
 if(saveData('incidents',next)){incidents=next;renderIncidents();showToast(action==='resolve'?'Инцидент решён':'Инцидент взят в работу');}
});
renderIncidents();setInterval(renderIncidents,30000);
