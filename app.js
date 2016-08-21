var request = require('request');
var TelegramBot = require('node-telegram-bot-api');
var token = ''; // !!!
var bot = new TelegramBot(token, {polling: true});

var checkVkMembers = null;
var groupMembersUrl = 'https://api.vk.com/method/groups.getMembers?group_id=buknotes';
var groupMembersCount = 0;

bot.on('message', function (msg) {
  // var chatId = msg.chat.id;
});

bot.onText(/\/vkstart/, function (msg) {
  var chatId = msg.chat.id;

  bot.sendMessage(chatId, 'Запущено отслеживание событий ВКонтакте.');

  checkVkMembers = setInterval(function () {
    request(groupMembersUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var count = data.response.count;

        if (count !== groupMembersCount) {
          bot.sendMessage(chatId, 'Подписчиков группы ВКонтакте ' + data.response.count);
          groupMembersCount = count;
        }
      }
    })
  }, 1000);
});

bot.onText(/\/vkstop/, function (msg) {
  var chatId = msg.chat.id;

  clearInterval(checkVkMembers);
  bot.sendMessage(chatId, 'Отслеживание событий ВКонтакте приостановлено.');
});
