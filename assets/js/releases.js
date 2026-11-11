'use strict';
$('#releaseList').innerHTML=[...startReleases].sort((a,b)=>compareVersions(b.version,a.version)).map(r=>`<article class="card release"><div><div class="version">${esc(r.version)}</div><div class="release-date">${formatDate(r.date+'T12:00:00')}</div>${badge(r.level.toUpperCase(),'green')}</div><div><h2>${r.version===currentVersion()?'Текущий выпуск':'Предыдущий выпуск'}</h2><ul>${r.changes.map(c=>`<li>${esc(c)}</li>`).join('')}</ul></div></article>`).join('');
function renderNextVersion(){$('#nextVersion').textContent=getNextVersion(currentVersion(),$('#releaseLevel').value);}
$('#releaseLevel').addEventListener('change',renderNextVersion);renderNextVersion();
