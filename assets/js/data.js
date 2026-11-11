'use strict';
const demoNow = Date.now();
const hoursAgo = h => new Date(demoNow - h * 3600000).toISOString();
const startDeployments = [
 {id:'DEP-01',client:'Учебный центр «Орион»',product:'Система расписания',version:'v1.0.0',stage:'training',owner:'Алексей М.',plannedDate:'2026-11-20',done:2,total:3},
 {id:'DEP-02',client:'Студия «Вектор»',product:'Учёт заявок',version:'v1.0.0',stage:'setup',owner:'Марина К.',plannedDate:'2026-11-25',done:3,total:8},
 {id:'DEP-03',client:'Лаборатория «Спектр»',product:'База знаний',version:'v1.0.0',stage:'production',owner:'Денис Р.',plannedDate:'2026-11-10',done:5,total:5}
];
const startIncidents = [
 {id:'INC-001',title:'Не открывается сводный отчёт',priority:'critical',status:'in_progress',createdAt:hoursAgo(5),resolvedAt:null},
 {id:'INC-002',title:'Ошибка входа в личный кабинет',priority:'high',status:'new',createdAt:hoursAgo(2),resolvedAt:null},
 {id:'INC-003',title:'Не обновляется расписание',priority:'medium',status:'in_progress',createdAt:hoursAgo(10),resolvedAt:null},
 {id:'INC-004',title:'Опечатка в подсказке формы',priority:'low',status:'new',createdAt:hoursAgo(20),resolvedAt:null},
 {id:'INC-005',title:'Не сохраняется профиль',priority:'high',status:'resolved',createdAt:hoursAgo(30),resolvedAt:hoursAgo(25)},
 {id:'INC-006',title:'Задержка формирования выгрузки',priority:'medium',status:'resolved',createdAt:hoursAgo(60),resolvedAt:hoursAgo(30)}
];
const startRequests = [
 {id:'REQ-001',title:'Исправить загрузку большого отчёта',type:'corrective',status:'planned',targetVersion:'v1.1.1'},
 {id:'REQ-002',title:'Поддержать обновлённый браузер',type:'adaptive',status:'new',targetVersion:'v1.2.0'},
 {id:'REQ-003',title:'Добавить экспорт отчёта в PDF',type:'perfective',status:'planned',targetVersion:'v1.2.0'},
 {id:'REQ-004',title:'Проверить устаревшие зависимости',type:'preventive',status:'done',targetVersion:'v1.0.0'}
];
const startReleases = [
 {id:'REL-003',version:'v1.1.0',date:'2026-11-11',level:'minor',changes:['Добавлен точный срок SLA в таблицу инцидентов','Добавлен поиск по названию и ID совместно с фильтром статуса','Уточнены руководство и результаты проверки']},
 {id:'REL-002',version:'v1.0.0',date:'2026-11-11',level:'major',changes:['Реализованы пять страниц и навигация','Добавлены внедрения, инциденты и контроль SLA','Добавлены четыре вида заявок, графики и темы']},
 {id:'REL-001',version:'v0.9.0',date:'2026-11-10',level:'minor',changes:['Подготовлены структура и учебные данные (история продукта)']}
];
