Здесь располагаются файлы со вспомогательными скриптами. При экспорте вашего приложения на конкретную платформу рекомендуется удалить лишние скрипты и удалить ссылки на них в файле index.html.

Например, если вы выпускаете приложение на Newgrounds, вам нужно будет удалить файлы:
- VKBridgeSDK.js
- YandexGamesSDK.js

Затем в файле index.html нужно будет удалить строки:
 	<!-- VK Bridge SDK -->
 	<script src="https://unpkg.com/@vkontakte/vk-bridge/dist/browser.min.js"></script>
	<script src="scripts/VKBridgeSDK.js"></script>
	
	<!-- Yandex Games SDK -->
	<script src="sdk.js"></script>
	<script src="scripts/YandexGamesSDK.js"></script>

Файл _README.txt следует удалить.
