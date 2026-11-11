const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../assets/js/common.js','utf8').split('initializeData();applyTheme();')[0];
const ctx=vm.createContext({});vm.runInContext(source,ctx);
let count=0;
function check(expr,want){assert.equal(vm.runInContext(expr,ctx),want);count++;}
check(`getNextVersion('v1.1.0','patch')`,'v1.1.1');
check(`getNextVersion('v1.1.9','minor')`,'v1.2.0');
check(`getNextVersion('v1.9.8','major')`,'v2.0.0');
check(`getSlaPercent([])`,100);
check(`getSlaState({priority:'high',createdAt:'2026-11-11T00:00:00Z',status:'new'},settings,Date.parse('2026-11-11T08:00:00Z'))`,'on_track');
check(`getSlaState({priority:'high',createdAt:'2026-11-11T00:00:00Z',status:'new'},settings,Date.parse('2026-11-11T08:00:00.001Z'))`,'breached');
check(`getSlaState({priority:'high',createdAt:'2026-11-11T00:00:00Z',status:'resolved',resolvedAt:'2026-11-11T08:00:00Z'})`,'met');
check(`getSlaState({priority:'critical',createdAt:'2026-11-11T00:00:00Z',status:'resolved',resolvedAt:'2026-11-11T04:00:01Z'})`,'breached');
check(`getSlaPercent([{priority:'high',createdAt:'2026-11-11T00:00:00Z',status:'resolved',resolvedAt:'2026-11-11T01:00:00Z'},{priority:'high',createdAt:'2026-11-11T00:00:00Z',status:'resolved',resolvedAt:'2026-11-11T10:00:00Z'}])`,50);
check(`compareVersions('v1.10.0','v1.9.9')>0`,true);
check(`validVersion('v01.1.0')`,false);
check(`nextId([{id:'INC-001'},{id:'INC-009'}],'INC-')`,'INC-010');
console.log(`${count} checks passed`);
