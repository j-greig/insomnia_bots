// The bot that sends your Insomnia login link to you (We can't use the Insomnia Bouncer bot as it is controlled by TGMembership)
const config = require("./config.js")
const TelegramBot = require('node-telegram-bot-api');
const accessBot = new TelegramBot(config.SHITCOINHQ_ACCESS_TELEGRAM_BOT_TOKEN, { polling: Boolean(config.TELEGRAM_POLLING_ON ?? false) });
module.exports = { accessBot };