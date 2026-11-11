'use strict';
const settings = {slaHours:{critical:4,high:8,medium:24,low:72}};
const names = {
 stage:{planning:'Планирование',setup:'Настройка',training:'Обучение',production:'Эксплуатация'},
 priority:{critical:'Критический',high:'Высокий',medium:'Средний',low:'Низкий'},
 incidentStatus:{new:'Новый',in_progress:'В работе',resolved:'Решён'},
 type:{corrective:'Корректирующее',adaptive:'Адаптивное',perfective:'Совершенствующее',preventive:'Профилактическое'},
 requestStatus:{new:'Новая',planned:'Запланирована',done:'Выполнена'},
 sla:{on_track:'В срок',breached:'Нарушен',met:'Решён вовремя'}
};
const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function options(map,selected){return Object.entries(map).map(([k,v])=>`<option value="${k}" ${k===selected?'selected':''}>${v}</option>`).join('');}
function badge(text,color=''){return `<span class="badge ${color}">${esc(text)}</span>`;}
function showToast(message){const el=$('#toast');if(!el)return;el.textContent=message;el.hidden=false;clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>el.hidden=true,3500);}
function formatDate(date, time=false){return new Date(date).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',year:'numeric',...(time?{hour:'2-digit',minute:'2-digit'}:{})});}
function getDeadline(incident){return new Date(incident.createdAt).getTime()+settings.slaHours[incident.priority]*3600000;}
function getSlaState(incident, config=settings, now=Date.now()) {
 const deadline=new Date(incident.createdAt).getTime()+config.slaHours[incident.priority]*3600000;
 if(incident.status==='resolved') return new Date(incident.resolvedAt).getTime()<=deadline?'met':'breached';
 return now>deadline?'breached':'on_track';
}
function getSlaPercent(incidents,config=settings){
 const resolved=incidents.filter(i=>i.status==='resolved');
 return resolved.length ? Math.round(resolved.filter(i=>getSlaState(i,config)==='met').length/resolved.length*100):100;
}
function getNextVersion(current,level){
 const [major,minor,patch]=current.replace(/^v/,'').split('.').map(Number);
 if(level==='major')return `v${major+1}.0.0`;
 if(level==='minor')return `v${major}.${minor+1}.0`;
 return `v${major}.${minor}.${patch+1}`;
}
function compareVersions(a,b){const x=a.replace(/^v/,'').split('.').map(Number),y=b.replace(/^v/,'').split('.').map(Number);for(let i=0;i<3;i++){if(x[i]!==y[i])return x[i]-y[i];}return 0;}
function currentVersion(){return startReleases.map(r=>r.version).sort(compareVersions).at(-1);}
function validVersion(v){return /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(v);}
function normalizeVersion(v){return v.startsWith('v')?v:'v'+v;}
function nextId(records,prefix,width=3){return prefix+String(Math.max(0,...records.map(i=>Number(i.id.split('-').at(-1))||0))+1).padStart(width,'0');}
function formValues(form){return Object.fromEntries([...new FormData(form)].map(([k,v])=>[k,String(v).trim()]));}
function error(text){$('#formError').textContent=text;}
function theme(){return loadData('theme','light')==='dark'?'dark':'light';}
function applyTheme(){document.documentElement.dataset.theme=theme();$('#themeButton').textContent=theme()==='dark'?'☀ Светлая тема':'◐ Тёмная тема';$('#themeButton').setAttribute('aria-label',$('#themeButton').textContent);}
initializeData();applyTheme();
$('#themeButton').addEventListener('click',()=>{if(saveData('theme',theme()==='dark'?'light':'dark')){applyTheme();document.dispatchEvent(new Event('themechange'));}});
document.querySelectorAll('[data-current-version]').forEach(el=>el.textContent=currentVersion());
$('#today').textContent=new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long',year:'numeric'});
