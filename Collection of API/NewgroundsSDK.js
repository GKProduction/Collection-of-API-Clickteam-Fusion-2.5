"use strict";

var appID = "null";
var encryptionCipher = "null"; // AES-128 Base64
var debug = 0;

function setAppID(newID) {
    appID = newID;
}
function setCipher(newCipher) {
    encryptionCipher = newCipher;
}
function setDebug(newDebug) {
    debug = newDebug;
}

// =====================================

// Инициализация SDK
function NGInit() {
    Newgrounds.Init(appID, encryptionCipher, debug)
/*     .then(() => {
        console.log('🟧Init complete');
        info_event = "NG: Init complete";
    })
    .catch(error => {
        console.log('🟧Init error ', error);
        info_event = "NG: Init error";
    }); */
}

// Разблокировать медаль
function NGUnlockMedal(id) {
    Newgrounds.UnlockMedal(parseInt(id))
/*     .then(() => {
        console.log('🟧Medal received');
        info_event = "NG: Medal received";
    })
    .catch(error => {
        console.log('🟧Medal error ', error);
        info_event = "NG: Medal error";
    }); */
}

// Опубликовать счёт
function NGPostScore(id, score) {
    Newgrounds.PostScore(id, parseInt(score))
/*     .then(() => {
        console.log('🟧Score sent');
        info_event = "NG: Score sent";
    })
    .catch(error => {
        console.log('🟧Score error ', error);
        info_event = "NG: Post score error";
    }); */
}

// Получить рекорды
function NGGetScores(id) {
    result = Newgrounds.GetScores(id)
/*         .then(() => {
            console.log('🟧Scores received', result);
            info_event = "NG: Scores received";
            info_data = result;
        })
        .catch(error => {
            console.log('🟧Score error ', error);
            info_event = "NG: Get scores error";
        }); */
}
