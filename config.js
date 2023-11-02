const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TGMEMBERSHIP_BOT_TOKEN: process.env.TGMEMBERSHIP_BOT_TOKEN,
    SHITCOINHQ_ACCESS_TELEGRAM_BOT_TOKEN: process.env.SHITCOINHQ_ACCESS_TELEGRAM_BOT_TOKEN,
    PAID_BOT_TOKEN: process.env.PAID_BOT_TOKEN,
    TELEGRAM_POLLING_ON: process.env.TELEGRAM_POLLING_ON,
    API_URL: process.env.API_URL,
    DEFINED_API_KEY: process.env.DEFINED_API_KEY
}