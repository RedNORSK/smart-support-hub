'use strict';
let charts=[];
function renderDashboard(){
 const deployments=loadRecords('deployments',startDeployments),incidents=loadRecords('incidents',startIncidents),requests=loadRecords('requests',startRequests);
 const values=[['Активные внедрения',deployments.filter(i=>i.stage!=='production').length,'В планировании, настройке и обучении','↗'],['Открытые инциденты',incidents.filter(i=>i.status!=='resolved').length,'Новые и находящиеся в работе','◎'],['Выполнение SLA',getSlaPercent(incidents)+'%','Среди решённых инцидентов','◷'],['Текущая версия',currentVersion(),'Последний выпущенный релиз','▣']];
 $('#kpis').innerHTML=values.map(([label,value,note,icon])=>`<article class="card kpi"><div class="kpi-top"><span>${label}</span><span class="kpi-icon" aria-hidden="true">${icon}</span></div><strong class="kpi-value">${value}</strong><small>${note}</small></article>`).join('');
 $('#deploymentOverview').innerHTML=deployments.map(i=>`<tr><td class="title-cell"><strong>${esc(i.client)}</strong><small>${esc(i.product)} · ${esc(i.version)}</small></td><td>${badge(names.stage[i.stage],i.stage==='production'?'green':'blue')}</td><td>${Math.round(i.done/i.total*100)}%<div class="progress"><i style="width:${i.done/i.total*100}%"></i></div></td><td>${formatDate(i.plannedDate+'T12:00:00')}</td></tr>`).join('');
 charts.forEach(c=>c.destroy());charts=[];
 if(typeof Chart==='undefined'){showToast('Не удалось загрузить библиотеку графиков.');return;}
 const color=getComputedStyle(document.documentElement).getPropertyValue('--muted').trim(),line=getComputedStyle(document.documentElement).getPropertyValue('--line').trim();
 const priority=Object.keys(names.priority),types=Object.keys(names.type);
 const pCounts=priority.map(p=>incidents.filter(i=>i.priority===p).length),tCounts=types.map(t=>requests.filter(i=>i.type===t).length);
 $('#priorityChart').setAttribute('aria-label',priority.map((p,i)=>names.priority[p]+': '+pCounts[i]).join(', '));
 $('#requestChart').setAttribute('aria-label',types.map((t,i)=>names.type[t]+': '+tCounts[i]).join(', '));
 charts.push(new Chart($('#priorityChart'),{type:'bar',data:{labels:priority.map(p=>names.priority[p]),datasets:[{label:'Инциденты',data:pCounts,backgroundColor:['#e27873','#e5b555','#578bb6','#49ab96'],borderRadius:5,maxBarThickness:46}]},options:{responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{stepSize:1,color},grid:{color:line}},x:{ticks:{color,font:{size:10}},grid:{display:false}}}}}));
 charts.push(new Chart($('#requestChart'),{type:'doughnut',data:{labels:types.map(t=>names.type[t]),datasets:[{data:tCounts,backgroundColor:['#258d7f','#5b9dba','#e3b962','#99b8a7'],borderWidth:3,borderColor:getComputedStyle(document.documentElement).getPropertyValue('--card').trim()}]},options:{responsive:true,maintainAspectRatio:false,animation:false,cutout:'72%',plugins:{legend:{position:'bottom',labels:{color,boxWidth:9,boxHeight:9,padding:12,font:{size:10}}}}}}));
}
renderDashboard();document.addEventListener('themechange',renderDashboard);window.addEventListener('storage',renderDashboard);
