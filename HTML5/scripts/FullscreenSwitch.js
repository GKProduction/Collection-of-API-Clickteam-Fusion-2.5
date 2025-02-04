// Fullscreen Switch

// Переключение полноэкранного режима
function setFullscreen(fullscreen_mode) {
    if (fullscreen_mode) {
        var el = document.documentElement,
        rfs = el.requestFullscreen
             || el.webkitRequestFullScreen
             || el.mozRequestFullScreen
             || el.msRequestFullscreen;
        rfs.call(el).catch((err) => err = null); ;
    } else {
        document.exitFullscreen().catch((err) => err = null);
    }
}

// Выход из полноэкранного режима
if (document.addEventListener) {
    document.addEventListener('fullscreenchange', exitHandler, false);
    document.addEventListener('mozfullscreenchange', exitHandler, false);
    document.addEventListener('MSFullscreenChange', exitHandler, false);
    document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        info_event = "On Exit Fullscreen";
        console.log("On Exit Fullscreen");
        console.log("!!!: "+info_event);
    }
}
