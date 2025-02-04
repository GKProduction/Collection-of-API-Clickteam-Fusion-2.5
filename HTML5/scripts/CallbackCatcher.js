// Callback Catcher for Clickteam Fusion 2.5 HTML5
// v1.0
// Copyright (c) 2025 GKProduction

var info_event = null; // Переменная, в которую вы записываете, какое событие произошло в вашем JS коде
var info_data = null;  // Переменная для данных, которые вы получаете при событии
var info_int = 0; // Переменная для целого, которое вы получаете при событии

function GetEvent() {return info_event}; // Получить строку, означающую, какое событие произошло
function GetData() {return info_data}; // Получить данные, полученные при событии
function GetInt() {return info_int}; // Получить целое, полученное при событии

function ResetInfo() { // Сброс
    info_event = null;
    // info_data=null;
    info_int = 0;
};
