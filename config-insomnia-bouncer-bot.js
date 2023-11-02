// The bot that sends your Insomnia login link to you (We can't use the Insomnia Bouncer bot as it is controlled by TGMembership)
const config = require("./config.js")
const TelegramBot = require('node-telegram-bot-api');
const insomniaBouncerBot = new TelegramBot(config.TGMEMBERSHIP_BOT_TOKEN, { polling: Boolean(false) });
module.exports = { insomniaBouncerBot };