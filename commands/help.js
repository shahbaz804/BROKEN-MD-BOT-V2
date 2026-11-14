const settings = require('../settings');
const fs = require('fs');
const path = require("path");

async function helpCommand(conn, chatId, m) {
  const menuText = `
╭───────────────────╮
   👑 𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔 𝗠𝗗 ☠️
╰───────────────────╯

╔═════〔 👤 𝙐𝙎𝙀𝙍 𝙄𝙉𝙁𝙊 〕════╗
┃ 🛡️ 𝙊𝙒𝙉𝙀𝙍 : 𝗠𝗥 𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔
┃ 📟 𝙑𝙀𝙍𝙎𝙄𝙊𝙉 : ${settings.version}
┃ 📡 𝙎𝙏𝘼𝙏𝙐𝙎 : ACTIVE
┃ 🧬 𝙈𝙊𝘿𝙀 : PUBLIC
╚════════════════════╝

   ◈─────〔 𝙈𝙀𝙉𝙐 𝙇𝙄𝙎𝙏 〕─────◈

┏━━〔 🤖 𝘼𝙄 𝙈𝙀𝙉𝙐 〕━━┓
┃ ➊ ⟿ .gpt
┃ ➋ ⟿ .gemini
┃ ➌ ⟿ .imagine
┃ ➍ ⟿ .tts
┃ ➎ ⟿ .sora
┗━━━━━━━━━━━━━━┛

┏━━〔 🌍 𝙂𝙀𝙉𝙀𝙍𝘼𝙇 〕━━┓
┃ ➊ ⟿ .alive
┃ ➋ ⟿ .ping
┃ ➌ ⟿ .help
┃ ➍ ⟿ .menu
┃ ➎ ⟿ .owner
┃ ➏ ⟿ .news
┃ ➐ ⟿ .weather
┃ ➑ ⟿ .quote
┃ ➒ ⟿ .joke
┃ ➓ ⟿ .fact
┃ ⓫ ⟿ .trt
┗━━━━━━━━━━━━━━┛

┏━━〔 🛡️ 𝘼𝘿𝙈𝙄𝙉 〕━━┓
┃ ➊ ☞ .groupinfo
┃ ➋ ☞ .tagall
┃ ➌ ☞ .mute
┃ ➍ ☞ .unmute
┃ ➎ ☞ .ban
┃ ➏ ☞ .kick
┃ ➐ ☞ .promote
┃ ➑ ☞ .demote
┃ ➒ ☞ .resetlink
┃ ➓ ☞ .antilink
┃ ⓫ ☞ .antibadwords
┃ ⓬ ☞ .anticall
┃ ⓭ ☞ .antitag
┃ ⓮ ☞ .antidelete
┃ ⓯ ☞ .welcome
┃ ⓰ ☞ .clear
┃ ⓱ ☞ .warn
┃ ⓲ ☞ .warnings
┃ ⓳ ☞ .staff
┃ ⓴ ☞ .tafnotadmin
┗━━━━━━━━━━━━━━━┛

┏━━〔 📥 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍 〕━━┓
┃ ➊ ⟿ .play
┃ ➋ ⟿ .video
┃ ➌ ⟿ .song
┃ ➍ ⟿ .movie
┃ ➎ ⟿ .xvideo
┃ ➏ ⟿ .spotify
┃ ➐ ⟿ .facebook
┃ ➑ ⟿ .instagram
┃ ➒ ⟿ .tiktok
┃ ➓ ⟿ .url
┃ ⓫ ⟿ .ss
┃ ⓬ ⟿ .ytmp3
┃ ⓭ ⟿ .ytmp4
┃ ⓮ ⟿ .lyrics
┃ ⓯ ⟿ .news
┃ ⓰ ⟿ .vv
┗━━━━━━━━━━━━━━┛

┏━━〔 🖼️ 𝙈𝙀𝘿𝙄𝘼 𝙏𝙊𝙊𝙇𝙎 〕━━┓
┃ ➊ ⟿ .sticker
┃ ➋ ⟿ .crop
┃ ➌ ⟿ .stickertelegram
┃ ➍ ⟿ .sticker-akt
┃ ➎ ⟿ .removebg
┃ ➏ ⟿ .remini
┃ ➐ ⟿ .blur
┃ ➑ ⟿ .img-blur
┃ ➒ ⟿ .simage
┃ ➓ ⟿ .gif
┗━━━━━━━━━━━━━━━┛

┏━━〔 🎭 𝙀𝙉𝙏𝙀𝙍𝙏𝘼𝙄𝙉 〕━━┓
┃ ➊ ⟿ .attp
┃ ➋ ⟿ .ship
┃ ➌ ⟿ .shayri
┃ ➍ ⟿ .sticker-alt
┃ ➎ ⟿ .compliment
┃ ➏ ⟿ .flirt
┃ ➐ ⟿ .simp
┃ ➑ ⟿ .simage
┃ ➒ ⟿ .stupid
┃ ➓ ⟿ .insult
┃ ⓫ ⟿ .goodbye
┃ ⓬ ⟿ .goodnight
┃ ⓭ ⟿ .roseday
┃ ⓮ ⟿ .character
┃ ⓯ ⟿ .meme
┃ ⓰ ⟿ .joke
┗━━━━━━━━━━━━━━┛

┏━━〔 🎮 𝙂𝘼𝙈𝙀𝙎 〕━━┓
┃ ➊ ⟿ .dare
┃ ➋ ⟿ .truth
┃ ➌ ⟿ .hangman
┃ ➍ ⟿ .tictactoe
┃ ➎ ⟿ .trivia
┃ ➏ ⟿ .pair
┃ ➐ ⟿ .rate
┃ ➑ ⟿ .pies
┃ ➒ ⟿ .topmember
┗━━━━━━━━━━━━━━┛

┏━━〔 ⛩️ 𝘼𝙉𝙄𝙈𝙀 〕━━┓
┃ ➊ ⟿ .anime
┃ ➋ ⟿ .animepic
┃ ➌ ⟿ .quote
┃ ➍ ⟿ .waifu
┃ ➎ ⟿ .sora
┃ ➏ ⟿ .animu
┃ ➐ ⟿ .nom
┃ ➑ ⟿ .kiss
┃ ➒ ⟿ .cry
┃ ➓ ⟿ .hug
┃ ⓫ ⟿ .pat
┃ ⓬ ⟿ .poke
┃ ⓭ ⟿ .wink
┃ ⓮ ⟿ .face-palm
┗━━━━━━━━━━━━━━┛

┏━━〔 🧪 𝙈𝙄𝙎𝘾 𝙇𝙄𝙎𝙏 〕━━┓
┃ ➊ ⟿ .heart
┃ ➋ ⟿ .horny
┃ ➌ ⟿ .circle
┃ ➍ ⟿ .lgbt
┃ ➎ ⟿ .lied
┃ ➏ ⟿ .lolice
┃ ➐ ⟿ .simpcard
┃ ➑ ⟿ .tonikawa
┃ ➒ ⟿ .its-so-stupid
┃ ➓ ⟿ .namecard
┃ ⓫ ⟿ .oogway
┃ ⓬ ⟿ .oogway2
┃ ⓭ ⟿ .tweet
┃ ⓮ ⟿ .youtube-comment
┃ ⓯ ⟿ .comrade
┃ ⓰ ⟿ .gay
┃ ⓱ ⟿ .glass
┃ ⓲ ⟿ .jail
┃ ⓳ ⟿ .passed
┃ ⓴ ⟿ .triggered
┗━━━━━━━━━━━━━━┛

┏━━〔 ✍️ 𝙏𝙀𝙓𝙏𝙈𝘼𝙆𝙀𝙍 〕━━┓
┃ ➊ ⟿ .metallic
┃ ➋ ⟿ .snow
┃ ➌ ⟿ .ice
┃ ➍ ⟿ .impressive
┃ ➎ ⟿ .matrix
┃ ➏ ⟿ .light
┃ ➐ ⟿ .neon
┃ ➑ ⟿ .devil
┃ ➒ ⟿ .purple
┃ ➓ ⟿ .thunder
┃ ⓫ ⟿ .leaves
┃ ⓬ ⟿ .1917
┃ ⓭ ⟿ .arena
┃ ⓮ ⟿ .hacker
┃ ⓯ ⟿ .sand
┃ ⓰ ⟿ .blackpink
┃ ⓱ ⟿ .glitch
┃ ⓲ ⟿ .fire
┗━━━━━━━━━━━━━━┛

┏━━〔 👑 𝙊𝙒𝙉𝙀𝙍 〕━━┓
┃ ➊ ⟿ .mode
┃ ➋ ⟿ .clearsession
┃ ➌ ⟿ .cleaetmp
┃ ➍ ⟿ .setpp
┃ ➎ ⟿ .autostatus
┃ ➏ ⟿ .autostatus react
┃ ➐ ⟿ .autoread
┃ ➑ ⟿ .autotyipng
┃ ➒ ⟿ .autoreply
┃ ➓ ⟿ .autorecording
┃ ⓫ ⟿ .autoreact
┃ ⓬ ⟿ .pmblocker
┃ ⓭ ⟿ .sudo
┗━━━━━━━━━━━━━━┛

╔═〔 🎯 𝙊𝙐𝙍 𝘾𝙃𝘼𝙉𝙉𝙀𝙇 & 𝙂𝙍𝙊𝙐𝙋𝙎〕═╗
┃ 🎯 : 𝙊𝙐𝙍 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝘾𝙃𝘼𝙉𝙉𝙀𝙇 1
┃ 🔗 : https://whatsapp.com/channel/0029Vb7z4LxIN9imGhuSCi21
┃ 🎯 : 𝙊𝙐𝙍 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝘾𝙃𝘼𝙉𝙉𝙀𝙇 2
┃ 🔗 : https://whatsapp.com/channel/0029Vb82QIz0QeanQjREAW0M
╚═══════════════════════════╝

> 𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗗 𝗕𝗬 𝗠𝗥 𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔☠️
`;

  try {
    const img1Path = path.join(__dirname, '../assets/bot_image.jpg');
    const img2Path = path.join(__dirname, '../assets/bot_image.jpg');

    const newsletterContext = {
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: "",
        newsletterName: "𝗠𝗥 𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔",
        serverMessageId: -1
      },
      externalAdReply: {
        title: "𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔 𝗠𝗗 𝙈𝙐𝙇𝙏𝙄-𝘿𝙀𝙑𝙄𝘾𝙀",
        body: "Developed by 𝗠𝗥 𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔",
        thumbnail: fs.existsSync(img1Path) ? fs.readFileSync(img1Path) : null,
        sourceUrl: "https://whatsapp.com/channel/0029Vb7z4LxIN9imGhuSCi21",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    };

    if (fs.existsSync(img1Path)) {
      // First Image with Menu
      await conn.sendMessage(chatId, {
        image: fs.readFileSync(img1Path),
        caption: menuText,
        contextInfo: newsletterContext
      }, { quoted: m });

      // Second Decorative Image (Dual Image Design)
      if (fs.existsSync(img2Path)) {
        await conn.sendMessage(chatId, {
          image: fs.readFileSync(img2Path),
          caption: "✨ *SHAHZADA MD BOT: THE NEXT GEN BOT*",
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "",
              newsletterName: "𝐌𝐑 𝐒𝐇𝐀𝐇𝐙𝐀𝐃𝐀",
              serverMessageId: -1
            }
          }
        }, { quoted: m });
      }
    } else {
      await conn.sendMessage(chatId, { text: menuText, contextInfo: newsletterContext });
    }

  } catch (err) {
    console.error("Error in help command:", err);
    await conn.sendMessage(chatId, { text: menuText });
  }
}

module.exports = helpCommand;
