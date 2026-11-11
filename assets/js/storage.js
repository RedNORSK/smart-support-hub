'use strict';
const STORAGE_PREFIX = 'ssh.';
function loadData(key, fallback) {
 try { const value = JSON.parse(localStorage.getItem(STORAGE_PREFIX+key)); return value === null ? structuredClone(fallback) : value; }
 catch { return structuredClone(fallback); }
}
function saveData(key, value) {
 try { localStorage.setItem(STORAGE_PREFIX+key, JSON.stringify(value)); return true; }
 catch { showToast('Не удалось сохранить данные: проверьте разрешения и свободное место браузера.'); return false; }
}
function loadRecords(key, fallback) {
 const records = loadData(key, fallback);
 if (!Array.isArray(records)) return structuredClone(fallback);
 return records;
}
function initializeData() {
 [['deployments',startDeployments],['incidents',startIncidents],['requests',startRequests]].forEach(([key,seed]) => {
  const list=loadRecords(key,seed); saveData(key,list);
 });
}
