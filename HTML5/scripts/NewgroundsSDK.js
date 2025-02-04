// Collection of API - Newgrounds SDK
// v2.0

// Значения от объекта Newgrounds в игре
var appVersion = "0.0.0";
var appID = "null";
var aesKey = "null"; // AES-128 Base64

function setAppVersion(newVersion) {
    appVersion = newVersion;
}

function setAppID(newID) {
    appID = newID;
}
function setCipher(newCipher) {
    aesKey = newCipher;
}

// =====================================

// Инициализация SDK (автоматическая)
function NGInit() {
    console.log('🟧Init start...');
    NGIO.init(appID, aesKey, {
        version: appVersion,
        debugMode: false,
        checkHostLicense: false,
        autoLogNewView: false,
        preloadMedals: true,
        preloadScoreBoards: true,
        preloadSaveSlots: true,
    });
}

function NGStatusCheck() {
    // ... in game loop ...

    // Note: the callback function only fires if there's a change in status
    NGIO.getConnectionStatus(function (status) {

        // You could hide any login/preload UI elements here (we'll show what we need later).

        // This is a generic check to see if we're waiting for something...
        if (NGIO.isWaitingStatus) {
            // We're either waiting for the server to respond, or the user to sign in on Newgrounds.
            // Show a "please wait" message and/or a spinner so the player knows something is happening
        }

        // check the actual connection status
        switch (status) {

            // we have version and license info
        case NGIO.STATUS_LOCAL_VERSION_CHECKED:

            if (NGIO.isDeprecated) {
                // this copy of the game is out of date
                // (or you forgot to update the version number in your init() call)

                // Show a 'new version available' button that calls
                // NGIO.loadOfficialUrl();
            }

            if (!NGIO.legalHost) {
                // the site hosting this copy has been blocked

                // show the player a message ("This site is illegally hosting this game") , and add a button that calls
                // NGIO.loadOfficialUrl();
            }

            break;

            // user needs to log in
        case NGIO.STATUS_LOGIN_REQUIRED:

            // present the user with a message ("This game uses features that require a Newgrounds account")
            // along with 2 buttons:

            // A "Log In" button that calls NGIO.openLoginPage();
            // A "No Thanks: button that calls NGIO.skipLogin();

            NGIO.skipLogin();
            console.log('🟧Init complete');
            info_event = "NG: Init complete";
            break;

            // We are waiting for the user to log in (they should have a login page in a new browser tab)
        case NGIO.STATUS_WAITING_FOR_USER:

            // It's possible the user may close the login page without signing in.
            // Show a "Cancel Login" button that calls NGIO.cancelLogin();

            break;

            // user needs to log in
        case NGIO.STATUS_READY:
            console.log('🟧Init and auth complete');
            info_event = "NG: Auth complete";
            // Everything should be loaded.

            // If NGIO.hasUser is false, the user opted not to sign in, so you may
            // need to do some special handling in your game.

            break;
        }
    });
}

// Разблокировать медаль
function NGUnlockMedal(medal_id) {
    if (NGIO.getMedal(medal_id).unlocked) {
        console.log('🟧Medal already unlocked');
        info_event = "NG: Medal already unlocked";
        return
    }
    NGIO.unlockMedal(medal_id, NGonMedalUnlocked);
}
function NGonMedalUnlocked(medal) {
    console.log('🟧Medal received');
    info_event = "NG: Medal received";
    /*.catch(error => {
    console.log('🟧Medal error ', error);
    info_event = "NG: Medal error";
    }); */
}

// Опубликовать счёт
function NGPostScore(scoreboard_id, score_value) {
    NGIO.postScore(scoreboard_id, score_value, NGonScorePosted);
}

function NGonScorePosted(board, score) {
    console.log('🟧Score sent');
    info_event = "NG: Score sent";
    /*
    .catch(error => {
    console.log('🟧Score error ', error);
    info_event = "NG: Post score error";
    }); */
}

// Получить рекорды
function NGGetScores(board_id) {
    NGIO.getScores(parseInt(board_id), {
        period: NGIO.PERIOD_ALL_TIME
    }, function (board, scores, options) {
        if (!scores || scores.length < 1) {
            console.log("No scores available.");
            console.log('🟧Get Scores Error');
            info_event = "NG: Get scores error";
        } else {
            var board_list = "";
            for (let i = 0; i < scores.length; i++) {
                board_list = board_list + (i + 1) + ";" + scores[i].user.name + ";" + scores[i].formatted_value + "|";
                console.log("🏆" + (i + 1) + ". " + scores[i].user.name + " - " + scores[i].formatted_value);
            }
            console.log('🟧Рекорды: ' + board_list);
            console.log('🟧Scores received');
            info_event = "NG: Scores received";
            info_data = board_list;
        }
    });
}
// Прочитать облако
function NGCloudCheck() {
    if (NGIO.getSaveSlot(1).hasData) { // Сохранение в облаке есть
        console.log('🟧There is a save in the cloud');
        info_event = "NG: Cloud save exist";
    } else { // Сохранения в облаке нет
        console.log('🟧There is NO save in the cloud');
        info_event = "NG: Cloud save not exist";
    }
}

// Сохранить в облако
function NGCloudSave(save_data) {
    // Note: the 2nd parameter has to be a string. Try using JSON.serialize!
    NGIO.setSaveSlotData(1, save_data, NGonSaveComplete);
    console.log('🟧Attempt to save...');

    // callback
    function NGonSaveComplete(slot) {
        console.log('🟧Save complete');
        info_event = "NG: On data save";
    }
}

// Загрузить из облака
function NGCloudLoad() {
    // load the data
    NGIO.getSaveSlotData(1, NGonSaveDataLoaded);

    // handler function
    function NGonSaveDataLoaded(data) {
        console.log('🟧Save loaded');
        info_event = "NG: On data load";
        info_data = data;
    }
}

// Получить время
function NGGetTime() {
    NGIO.getDateTime(NGgetDateTime);
    function NGgetDateTime(lastTimeStamp) {
        info_int = lastTimeStamp;
        info_data = lastTimeStamp;
        info_event = "NG: On get time";
    }
}
