// Работа с YandexGames SDK в старых играх GKProduction v1.0
"use strict";

// ================ Начало ================
// Инициализация SDK
function YGInit() {
    YaGames.init() // Инициализация
    .then(ysdk => {
        window.ysdk = ysdk; // Объект ysdk
        console.log('🟨Init complete');
        info_event = "YG: Init complete";
    })
    .catch(err => { // Ошибка при инициализации SDK
        console.log('🟨Init error: ', err);
        info_event = "YG: Init error";
    });

}

// ================ Статус игры ================
// Игра готова
function YGReady() { // Вызывать, когда загрузка игры завершена
    ysdk.features.LoadingAPI.ready(); // Готова
    ysdk.adv.showFullscreenAdv(); // Реклама при запуске игры
    console.log('🟨Game is ready');
    info_event = "YG: Ready";
    YGLeaderboardsInit(); // Инициировать лидерборды
}

// Игра идёт
function YGStart() { // Вызывать, когда игровой процесс начался
    ysdk.features.GameplayAPI.start();
    console.log('🟨Game started');
}

// Игра остановлена
function YGStop() { // Вызывать, когда игровой процесс остановлен или не идёт
    ysdk.features.GameplayAPI.stop();
    console.log('🟨Game stopped');
}

// Отслеживание моментов для паузы и возобновления игры
const pauseCallback = () => {
    console.log('🟨GAME PAUSED');
    info_event = "YG: Pause"; // Поставить игру на паузу
};
const resumeCallback = () => {
    console.log('🟨GAME RESUMED');
    info_event = "YG: Resume"; // Возобновить игру
};

ysdk.on('game_api_pause', pauseCallback); // Подписка на события 'game_api_pause'.
ysdk.on('game_api_resume', resumeCallback); // Подписка на события 'game_api_resume'.

// ================ Игрок ================
// Авторизация
function YGPlayerAuth() {
    var player;
    function initPlayer() { // Инициализация объекта player
        return ysdk.getPlayer().then(_player => {
            player = _player;
            return player;
        });
    }

    initPlayer().then(_player => {
        if (_player.getMode() === 'lite') {
            // Игрок не авторизован
            ysdk.auth.openAuthDialog().then(() => { // Вызвать окно для входа

                // Игрок успешно авторизован
                console.log('🟨Player - Auth complete');
                info_event = "YG: Player - Auth complete";

                initPlayer().catch(err => {
                    // Ошибка при инициализации объекта Player
                    console.log('🟨Player init error: ', err);
                    info_event = "YG: Player - Init error";
                });
            })
            .catch(() => {
                // Игрок не авторизован (Отмена авторизации)
                console.log('🟨Player - Auth cancelled');
                info_event = "YG: Player - Auth cancelled";
            });
        }
        else {
            // Игрок уже авторизован
            console.log('🟨Player - Auth complete');
            info_event = "YG: Player - Auth complete";
        }
    })
    .catch(err => {
        // Ошибка при инициализации объекта Player
        console.log('🟨Player init error: ', err);
        info_event = "YG: Player - Init error";
    });
}

// Внутриигровые данные
function YGPlayerSetData(data) { // Сохранить данные
    player.setData({
        gamedata: data,
    }, true /* Отправить данные немедленно */).then(() => {
        console.log('🟨Data is set');
        info_event = "YG: Player - Data is set";
    }).catch(err => {
        // Ошибка при отправке данных
        console.log('🟨Set data error: ', err);
        info_event = "YG: Player - Set data error";
    });
}

function YGPlayerGetData() { // Получить данные
    player.getData().then((result) => {
        let obj = parseJson(result); // Спарсить JSON
        let data = obj.data; // Получить data из JSON
        console.log('🟨Data received: ', data);
        info_event = "YG: Player - Data received",
        info_data = data;
    }).catch(err => {
        // Ошибка при получении данных
        console.log('🟨Get data error: ', err);
        info_event = "YG: Player - Get data error";
    });
}

// ================ Списки лидеров ================
// Инициализация лидербордов
function YGLeaderboardsInit() { // Вызвать один раз, чтобы инициализировать лидерборды
    var lb;
    ysdk.getLeaderboards()
    .then(_lb => lb = _lb);
    console.log('🟨Leaderboards initialized');
    info_event = "YG: Leaderboards - Init complete";
}

// Опубликовать счёт игрока
function YGPostScore(id, score, extra = "") { // id - ID списка, score - счёт, extra - доп. данные (необязательно)
    ysdk.getLeaderboards()
    .then(lb => {
        lb.setLeaderboardScore(id, score, extra);
        console.log('🟨Счёт опубликован: ', score, ' (', extra, ')');
        info_event = "YG: Leaderboards - Score sent";
    })
    .catch(err => {
        // Ошибка
        console.log('🟨Get data error: ', err);
        info_event = "YG: Leaderboards - Post score error";
    });
}

// Получить список лидеров
function YGGetScores(id) { // id - ID списка
    ysdk.getLeaderboards()
    .then(lb => {
        // Получение топ 10.
        lb.getLeaderboardEntries(id, {
            quantityTop: 10,
            includeUser: true
        });
    })
    .then(res => {
        console.log(res);
        info_event = "YG: Leaderboards - Scores received";
        info_data = res;
    })
    .catch(err => { // Ошибка
        console.log('🟨Get scores error: ', err);
        info_event = "YG: Leaderboards - Get scores error";
    });
}
// ================ Реклама ================
// Баннерная реклама
function YGShowBannerAd() { // Показать рекламный баннер
    ysdk.adv.getBannerAdvStatus()
    .then(({
            stickyAdvIsShowing,
            reason
        }) => { // Проверить, показывается ли баннер
        if (stickyAdvIsShowing) {
            // Реклама уже показывается.
            console.log('🟨Banner ad is already showing.');
            info_event = "YG: Banner Ad - Already showing";
        } else if (reason) {
            // Реклама не показывается.
            console.log(reason);
            console.log('🟨Banner ad is not showing.');
            info_event = "YG: Banner Ad - Not showing";
        } else {
            ysdk.adv.showBannerAdv(); // Показать баннер
            console.log('🟨Show Banner ad.');
            info_event = "YG: Banner Ad - On show";
        }
    })
    .catch((error) => {
        // Ошибка
        console.log('🟨Show Banner ad error: ', error);
        info_event = "YG: Banner Ad - Show error";
    });
}

// Скрыть рекламный баннер
function YGHideBannerAd() {
    ysdk.adv.hideBannerAdv()
    .then(() => {
        console.log('🟨Banner is hidden.');
        info_event = "YG: Banner Ad - On hide";
    })
    .catch((error) => {
        // Ошибка
        console.log('🟨Hide Banner ad error: ', error);
        info_event = "YG: Banner Ad - Hide error";
    });
}

// Полноэкранная реклама
function YGShowFullscreenAd() { // Показать полноэкранную рекламу
    ysdk.adv.showFullscreenAdv({ // Показать
        callbacks: {
            onOpen: () => { // Реклама была показана
                console.log('🟨Fullscreen ad open.');
                info_event = "YG: Fullscreen Ad - On open";
            },
            onClose: function (wasShown) { // Реклама была закрыта
                console.log('🟨Fullscreen ad close. ', wasShown);
                info_event = "YG: Fullscreen Ad - On close";
            },
            onError: function (error) { // Ошибка
                console.log('🟨Fullscreen ad error. ', error);
                info_event = "YG: Fullscreen Ad - Error";
            },
            onOffline: () => { // Соединение было потеряно
                console.log('🟨Fullscreen ad offline.');
                info_event = "YG: Fullscreen Ad - On offline";
            }
        }
    });
}

// Видеореклама с наградой
function YGShowVideoAd() { // Показать рекламное видео с наградой
    ysdk.adv.showRewardedVideo({ // Показать
        callbacks: {
            onOpen: () => { // Видео было открыто
                console.log('🟨Video ad open.');
                info_event = "YG: Video Ad - On open";
            },
            onClose: () => { // Видео было закрыто
                console.log('🟨Video ad closed.');
                info_event = "YG: Video Ad - On close";
            },
            onRewarded: () => { // Награда получена
                console.log('🟨Rewarded!');
                info_event = "YG: Video Ad - Reward";
            },
            onError: (e) => { // Ошибка
                console.log('🟨Error while open video ad:', e);
                info_event = "YG: Video Ad - Error";
            }
        }
    });
}

// ================ Покупки ================
// Инициализация
function YGPaymentsInit() {
    var payments = null;
    ysdk.getPayments({
        signed: true
    }).then(_payments => {
        // Покупки доступны.
        payments = _payments;
        console.log("🟨Payments is available. ");
        info_event = "YG: Payments - Init complete";
    }).catch(err => {
        console.log("🟨Payments is not available. ", err);
        info_event = "YG: Payments - Init error";
    });
}

// Покупка
function YGPaymentsBuy(item) {
    payments.purchase({
        id: item
    }).then(purchase => {
        // Покупка успешно совершена
        console.log("🟨Purchase complete! ", item);
        info_event = "YG: Payments - Purchase complete";
        info_data = item;
    }).catch(err => {
        // Покупка не удалась
        console.log("🟨Purchase error: ", err);
        info_event = "YG: Payments - Purchase error";
    });
}

// Проверить покупку
function YGPaymentsCheckItem(item, consumable = false) { // consumable - тратится товар или нет
    payments.getPurchases().then(purchases => { // Получение покупок
        if (purchases.some(purchase => purchase.productID === item)) { // Товар найден в списке покупок
            console.log("🟨Item purchased: ", item);
            info_event = "YG: Payments - Item purchased";
            info_data = item;
            if (consumable) { // Расходная?
                payments.consumePurchase(purchase.purchaseToken); // Потратить покупку, если она расходная
            }
        } else { // Товар не куплен
            console.log("🟨Item not purchased:", item);
            info_event = "YG: Payments - Item not purchased";
            info_data = item;
        }
    }).catch(err => {
        // Ошибка
        // Выбрасывает исключение USER_NOT_AUTHORIZED для неавторизованных пользователей.
        console.log("🟨Purchase check error: ", err);
        info_event = "YG: Payments - Purchase check error";
    });
}

// Потратить покупку
function YGPaymentsConsumeItem() {
    payments.consumePurchase(purchase.purchaseToken)
    .then(() => {
        // Товар потрачен
        console.log("🟨Item consumed: ", err);
        info_event = "YG: Payments - Item consumed";
    })
    .catch(err => {
        // Ошибка
        console.log("🟨Purchase consume error: ", err);
        info_event = "YG: Payments - Purchase consume error";
    });
}
// Получить каталог
function YGPaymentsGetCatalog() {
    info_data = payments.getCatalog()
        .then(() => {
            console.log("🟨Catalog received");
            console.log(info_data);
            info_event = "YG: Catalog received";
            var items_catalog = info_data;
        })
        .catch(err => {
            // Ошибка
            console.log("🟨YG: Get catalog error: ", err);
            info_event = "YG: Get catalog error";
        });
}

// Получить цену
// function YGPaymentsGetPrice() {
// item_data=items_catalog;
// info_event = "YG: Price received";
// }

// Получить иконку портальной валюты
function YGPaymentsGetCurrencyIcon(size = "small") {
    info_data = Product.getPriceCurrencyImage()
        .then(() => {
            console.log("🟨Currence icon URL received. ");
            info_event = "YG: Currency icon received";
        })
        .catch(err => {
            // Ошибка
            console.log("🟨Currency icon error: ", err);
            info_event = "YG: Currency icon error";
        });
}

// ================ Разное ================
// Получить время
function YGGetTime() {
    info_event = "YG: Time";
    info_int = ysdk.serverTime();
}

// Запросить оценку
function YGRateGame() {
    ysdk.feedback.canReview() // Проверка, может ли игрок оставить отзыв
    .then(({
            value,
            reason
        }) => { // value - Может (true) или не может (false), reason - Причина, почему не может
        if (value) { // Игрок может оставить отзыв
            ysdk.feedback.requestReview() // Предложить оставить отзыв
            .then(({
                    feedbackSent
                }) => { // feedbackSent - Игрок отправил отзыв  (true) или закрыл окно (false)
                console.log("🟨Review result: ", feedbackSent);
                info_event = "YG: Review - Result";
                info_int = feedbackSent;
            });
        } else { // Игрок не может оставить отзыв
            console.log("🟨Can't request review. ", reason);
            info_event = "YG: Review - Error";
        }
    });
}
