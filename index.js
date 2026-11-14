require('dotenv').config();
require("./settings");
const fs = require('fs');
const chalk = require("chalk");
const {
  handleMessages,
  handleGroupParticipantUpdate,
  handleStatus
} = require("./main");
const PhoneNumber = require('awesome-phonenumber');
const {
  imageToWebp,
  videoToWebp,
  writeExifImg,
  writeExifVid
} = require('./lib/exif');
const {
  smsg,
  isUrl,
  generateMessageTag,
  getBuffer,
  getSizeMedia,
  fetch,
  await,
  sleep,
  reSize
} = require('./lib/myfunc');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  generateForwardMessageContent,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  generateMessageID,
  downloadContentFromMessage,
  jidDecode,
  proto,
  jidNormalizedUser,
  makeCacheableSignalKeyStore,
  delay
} = require("@whiskeysockets/baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const readline = require("readline");
const {
  rmSync,
  existsSync
} = require('fs');
const store = require("./lib/lightweight_store");
store.readFromFile();
const settings = require("./settings");
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 0x2710);
setInterval(() => {
  if (global.gc) {
    global.gc();
    console.log("🧹 Garbage collection completed");
  }
}, 0xea60);
setInterval(() => {
  const _0x44bd89 = process.memoryUsage().rss / 0x400 / 0x400;
  if (_0x44bd89 > 0x190) {
    console.log("⚠️ RAM too high (>400MB), restarting bot...");
    process.exit(0x1);
  }
}, 0x7530);
let owner = JSON.parse(fs.readFileSync("./data/owner.json"));
global.botname = "SHAHZADA MD BOT";
global.themeemoji = '•';
const pairingCode = Boolean(process.env.TELEGRAM_BOT_TOKEN) || process.argv.includes("--pairing-code");
const useMobile = process.argv.includes("--mobile");
const rl = process.stdin.isTTY ? readline.createInterface({
  'input': process.stdin,
  'output': process.stdout
}) : null;
const question = _0x46a3ac => {
  return rl ? new Promise(_0x331911 => rl.question(_0x46a3ac, _0x331911)) : Promise.resolve(settings.ownerNumber || "923199915316");
};
async function startXeonBotInc() {
  let {
    version: _0x52aaf6,
    isLatest: _0x1d1795
  } = await fetchLatestBaileysVersion();
  const {
    state: _0x3df434,
    saveCreds: _0x32b16b
  } = await useMultiFileAuthState("./session");
  const _0x3270c5 = new NodeCache();
  const _0x39b64b = makeWASocket({
    'version': _0x52aaf6,
    'logger': pino({
      'level': 'silent'
    }),
    'printQRInTerminal': !pairingCode,
    'browser': ["Ubuntu", "Chrome", "20.0.04"],
    'auth': {
      'creds': _0x3df434.creds,
      'keys': makeCacheableSignalKeyStore(_0x3df434.keys, pino({
        'level': "fatal"
      }).child({
        'level': "fatal"
      }))
    },
    'markOnlineOnConnect': true,
    'generateHighQualityLinkPreview': true,
    'syncFullHistory': true,
    'getMessage': async _0x53725d => {
      const rawJid = _0x53725d.remoteJid;
      const normalizedJid = jidNormalizedUser(rawJid);
      // Retry decryption using the original chat JID first, then its normalized form.
      const storedMessage = await store.loadMessage(rawJid, _0x53725d.id)
        || await store.loadMessage(normalizedJid, _0x53725d.id);
      return storedMessage?.message || undefined;
    },
    'msgRetryCounterCache': _0x3270c5,
    'defaultQueryTimeoutMs': undefined
  });
  store.bind(_0x39b64b.ev);
  if (process.env.TELEGRAM_BOT_TOKEN) {
    const { startTelegramPairing, setPairingSocket } = require('./telegram-pair');
    setPairingSocket(_0x39b64b);
    startTelegramPairing(_0x39b64b);
  }
  _0x39b64b.ev.on('messages.upsert', async _0x10fba => {
    try {
      const _0xb0448d = _0x10fba.messages[0x0];
      if (!_0xb0448d.message) {
        return;
      }
      _0xb0448d.message = Object.keys(_0xb0448d.message)[0x0] === "ephemeralMessage" ? _0xb0448d.message.ephemeralMessage.message : _0xb0448d.message;
      if (_0xb0448d.key && _0xb0448d.key.remoteJid === "status@broadcast") {
        await handleStatus(_0x39b64b, _0x10fba);
        return;
      }
      if (!_0x39b64b["public"] && !_0xb0448d.key.fromMe && _0x10fba.type === "notify") {
        return;
      }
      if (_0xb0448d.key.id.startsWith("BAE5") && _0xb0448d.key.id.length === 0x10) {
        return;
      }
      try {
        await handleMessages(_0x39b64b, _0x10fba, true);
      } catch (_0x47e8ec) {
        console.error("Error in handleMessages:", _0x47e8ec);
        if (_0xb0448d.key && _0xb0448d.key.remoteJid) {
          await _0x39b64b.sendMessage(_0xb0448d.key.remoteJid, {
            'text': "❌ An error occurred while processing your message.",
            'contextInfo': {
              'forwardingScore': 0x1,
              'isForwarded': true,
              'forwardedNewsletterMessageInfo': {
                'newsletterJid': "",
                'newsletterName': "MH TECH MD BOT",
                'serverMessageId': -0x1
              }
            }
          })["catch"](console.error);
        }
      }
    } catch (_0x2eacfb) {
      console.error("Error in messages.upsert:", _0x2eacfb);
    }
  });
  _0x39b64b.decodeJid = _0x2914dd => {
    if (!_0x2914dd) {
      return _0x2914dd;
    }
    if (/:\d+@/gi.test(_0x2914dd)) {
      let _0x16685f = jidDecode(_0x2914dd) || {};
      return _0x16685f.user && _0x16685f.server && _0x16685f.user + '@' + _0x16685f.server || _0x2914dd;
    } else {
      return _0x2914dd;
    }
  };
  _0x39b64b.ev.on('contacts.update', _0x5c1b11 => {
    for (let _0x1e596f of _0x5c1b11) {
      let _0x5b29e2 = _0x39b64b.decodeJid(_0x1e596f.id);
      if (store && store.contacts) {
        store.contacts[_0x5b29e2] = {
          'id': _0x5b29e2,
          'name': _0x1e596f.notify
        };
      }
    }
  });
  _0x39b64b.getName = (_0x1db46b, _0x476b4f = false) => {
    id = _0x39b64b.decodeJid(_0x1db46b);
    _0x476b4f = _0x39b64b.withoutContact || _0x476b4f;
    let _0x156148;
    if (id.endsWith("@g.us")) {
      return new Promise(async _0x2c5543 => {
        _0x156148 = store.contacts[id] || {};
        if (!(_0x156148.name || _0x156148.subject)) {
          _0x156148 = _0x39b64b.groupMetadata(id) || {};
        }
        _0x2c5543(_0x156148.name || _0x156148.subject || PhoneNumber('+' + id.replace("@s.whatsapp.net", '')).getNumber("international"));
      });
    } else {
      _0x156148 = id === "0@s.whatsapp.net" ? {
        'id': id,
        'name': "WhatsApp"
      } : id === _0x39b64b.decodeJid(_0x39b64b.user.id) ? _0x39b64b.user : store.contacts[id] || {};
    }
    return (_0x476b4f ? '' : _0x156148.name) || _0x156148.subject || _0x156148.verifiedName || PhoneNumber('+' + _0x1db46b.replace('@s.whatsapp.net', '')).getNumber('international');
  };
  _0x39b64b["public"] = true;
  _0x39b64b.serializeM = _0x459b82 => smsg(_0x39b64b, _0x459b82, store);
  if (pairingCode && !_0x39b64b.authState.creds.registered && !process.env.TELEGRAM_BOT_TOKEN) {
    if (useMobile) {
      throw new Error("Cannot use pairing code with mobile api");
    }
    let _0x2683fa;
    if (!!global.phoneNumber) {
      _0x2683fa = global.phoneNumber;
    } else {
      _0x2683fa = await question(chalk.bgBlack(chalk.greenBright("Please type your WhatsApp number To connect SHAHZADA MD BOT💀\nFormat: 92XXXXXXXXX (without + or spaces) : ")));
    }
    _0x2683fa = _0x2683fa.replace(/[^0-9]/g, '');
    const _0x2723e2 = require("awesome-phonenumber");
    if (!_0x2723e2('+' + _0x2683fa).isValid()) {
      console.log(chalk.red("Invalid phone number. Please enter your full international number (e.g., 15551234567 for US, 447911123456 for UK, etc.) without + or spaces."));
      process.exit(0x1);
    }
    setTimeout(async () => {
      try {
        let _0x462f09 = await _0x39b64b.requestPairingCode(_0x2683fa);
        _0x462f09 = _0x462f09?.["match"](/.{1,4}/g)?.["join"]('-') || _0x462f09;
        console.log(chalk.black(chalk.bgGreen("Your Pairing Code : ")), chalk.black(chalk.white(_0x462f09)));
        console.log(chalk.yellow("\nPlease enter this code in your WhatsApp app:\n1. Open WhatsApp\n2. Go to Settings > Linked Devices\n3. Tap \"Link a Device\"\n4. Enter the code shown above"));
      } catch (_0x134da5) {
        console.error("Error requesting pairing code:", _0x134da5);
        console.log(chalk.red("Failed to get pairing code. Please check your phone number and try again."));
      }
    }, 0xbb8);
  }
  _0x39b64b.ev.on("connection.update", async _0x2d0d95 => {
    const {
      connection: _0x3a0046,
      lastDisconnect: _0x21dca5
    } = _0x2d0d95;
    if (_0x3a0046 == "open") {
      console.log(chalk.magenta(" "));
      console.log(chalk.yellow("🌿Connected to => " + JSON.stringify(_0x39b64b.user, null, 0x2)));
      const _0x68fea = _0x39b64b.user.id.split(':')[0x0] + "@s.whatsapp.net";
      await _0x39b64b.sendMessage(_0x68fea, {
        'text': "🤖SHAHZADA MD BOT Connected Successfully!\n\n⏰ Time: " + new Date().toLocaleString() + "\n✅ Status: Online and Ready!\n                \n✅Make sure to join our WhatsApp channel:\nhttps://whatsapp.com/channel/0029Vb7z4LxIN9imGhuSCi21",
        'contextInfo': {
          'forwardingScore': 0x1,
          'isForwarded': true,
          'forwardedNewsletterMessageInfo': {
            'newsletterJid': '',
            'newsletterName': 'SHAHZADA MD BOT',
            'serverMessageId': -0x1
          }
        }
      });
      await delay(0x7cf);
      console.log(chalk.yellow("\n\n                  " + chalk.bold.blue("[𝐌𝐑 𝐒𝐇𝐀𝐇𝐙𝐀𝐃𝐀]") + "\n\n"));
      console.log(chalk.cyan("< ================================================== >"));
      console.log(chalk.magenta("\n" + (global.themeemoji || '•') + " YT CHANNEL: https://youtube.com/@mrshahzada01"));
      console.log(chalk.magenta((global.themeemoji || '•') + " TELEGRAM : @shahzadaxsilent1"));
      console.log(chalk.magenta((global.themeemoji || '•') + " WA NUMBER: " + owner));
      console.log(chalk.magenta((global.themeemoji || '•') + " CREDIT: MR SHAHZADA"));
      console.log(chalk.green((global.themeemoji || '•') + " 🤖 𝗠𝗥 𝗦𝗛𝗔𝗛𝗭𝗔𝗗𝗔 🪾 Bot Connected Successfully! ✅"));
      console.log(chalk.blue("Bot Version: " + settings.version));
    }
    if (_0x3a0046 === "close") {
      const _0x38905c = _0x21dca5?.['error']?.["output"]?.['statusCode'];
      if (_0x38905c === DisconnectReason.loggedOut || _0x38905c === 0x191) {
        try {
          rmSync("./session", {
            'recursive': true,
            'force': true
          });
        } catch {}
        console.log(chalk.red("Session logged out. Please re-authenticate."));
        startXeonBotInc();
      } else {
        startXeonBotInc();
      }
    }
  });
  const _0x38dab0 = new Set();
  _0x39b64b.ev.on("call", async _0x17c69a => {
    try {
      const {
        readState: _0x10a960
      } = require('./commands/anticall');
      const _0x5bb68c = _0x10a960();
      if (!_0x5bb68c.enabled) {
        return;
      }
      for (const _0x290e32 of _0x17c69a) {
        const _0x4dfdc6 = _0x290e32.from || _0x290e32.peerJid || _0x290e32.chatId;
        if (!_0x4dfdc6) {
          continue;
        }
        try {
          try {
            if (typeof _0x39b64b.rejectCall === "function" && _0x290e32.id) {
              await _0x39b64b.rejectCall(_0x290e32.id, _0x4dfdc6);
            } else if (typeof _0x39b64b.sendCallOfferAck === 'function' && _0x290e32.id) {
              await _0x39b64b.sendCallOfferAck(_0x290e32.id, _0x4dfdc6, "reject");
            }
          } catch {}
          if (!_0x38dab0.has(_0x4dfdc6)) {
            _0x38dab0.add(_0x4dfdc6);
            setTimeout(() => _0x38dab0["delete"](_0x4dfdc6), 0xea60);
            await _0x39b64b.sendMessage(_0x4dfdc6, {
              'text': "📵 Anticall is enabled. Your call was rejected and you will be blocked."
            });
          }
        } catch {}
        setTimeout(async () => {
          try {
            await _0x39b64b.updateBlockStatus(_0x4dfdc6, 'block');
          } catch {}
        }, 0x320);
      }
    } catch (_0x331eb9) {}
  });
  _0x39b64b.ev.on("creds.update", _0x32b16b);
  _0x39b64b.ev.on("group-participants.update", async _0x259029 => {
    await handleGroupParticipantUpdate(_0x39b64b, _0x259029);
  });
  _0x39b64b.ev.on("messages.upsert", async _0x5c6597 => {
    if (_0x5c6597.messages[0x0].key && _0x5c6597.messages[0x0].key.remoteJid === "status@broadcast") {
      await handleStatus(_0x39b64b, _0x5c6597);
    }
  });
  _0x39b64b.ev.on("status.update", async _0x2cb4bb => {
    await handleStatus(_0x39b64b, _0x2cb4bb);
  });
  _0x39b64b.ev.on('messages.reaction', async _0x166b19 => {
    await handleStatus(_0x39b64b, _0x166b19);
  });
  return _0x39b64b;
}
startXeonBotInc()["catch"](_0x498956 => {
  console.error("Fatal error:", _0x498956);
  process.exit(0x1);
});
process.on('uncaughtException', _0x25d0d4 => {
  console.error("Uncaught Exception:", _0x25d0d4);
});
process.on("unhandledRejection", _0x4c97f0 => {
  console.error("Unhandled Rejection:", _0x4c97f0);
});
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update " + __filename));
  delete require.cache[file];
  require(file);
});