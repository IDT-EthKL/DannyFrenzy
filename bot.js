import { Bot, InlineKeyboard } from "grammy";
// import { createToken } from "./jwt.js";
// import { registerUser } from "./operations.js";

// const token = process.env.BOT_TOKEN;
const token = "7643164087:AAEy9FM5KNObAHZMJijQ_kbkqSCem4ielFo";
console.log(token)
if (!token) throw new Error("BOT_TOKEN is unset");

export const bot = new Bot(token
    // , {
    // botInfo: {
    //     id: your_id,
    //     is_bot: true,
    //     first_name: "Settle Mints",
    //     username: "settle_mints_bot",
    //     can_join_groups: false,
    //     can_read_all_group_messages: false,
    //     supports_inline_queries: true,
    //     can_connect_to_business: false
    // }}
    );

// Commands - Start, Play, Leaderboard, About, Help
// bot.command("start", async (ctx) => {
//     const userDocId = await registerUser(ctx.from?.id.toString() || "", ctx.from?.first_name || "", ctx.from?.last_name || "", ctx.from?.username || "");
//     console.log("User doc id:", userDocId);
//     ctx.replyWithPhoto("https://img.etimg.com/thumb/msid-106967420,width-300,height-225,imgsize-478624,resizemode-75/my-life-with-the-walter-boys-season-2-see-everything-we-know-about-renewal-production-plot-and-more.jpg", {
//         "caption": `<b>Hi, ${ctx.from?.first_name}</b><br><p>Play the game now and become top players in the leaderboard!!!</p>`,
//         "parse_mode": "HTML"
//     })
// });
// bot.command("start", async (ctx) => {
//     const userDocId = await registerUser(ctx.from?.id.toString() || "", ctx.from?.first_name || "", ctx.from?.last_name || "", ctx.from?.username || "");
//     console.log("User doc id:", userDocId);
//     const keyboard = new InlineKeyboard().game("Play now!")
//         .row()
//         .text("Leaderboard", "leaderboard")
//         .text("About", "about");
//     ctx.replyWithGame("settle_mints_game", {
//         reply_markup: keyboard,
//         protect_content: true,
//         disable_notification: true
//     });
// });

bot.command("info", (ctx) => {
    ctx.reply(`
    Danny Frenzy - Fish Eat Fish Game\nBuilt by IDT
  `, { parse_mode: "HTML" })
});


bot.command("start", (ctx) => ctx.reply(
  ctx.replyWithGame("Danny")
));

bot.on("callback_query:game_short_name", async (ctx) => {
  await ctx.answerCallbackQuery({ url: "http://192.168.110.106:8080/" });
});


// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

bot.catch((err) => console.error(err));

bot.start();