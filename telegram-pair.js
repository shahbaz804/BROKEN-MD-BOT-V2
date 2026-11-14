const axios = require('axios');
const fs = require('fs');
const path = require('path');
const PhoneNumber = require('awesome-phonenumber');

const token = process.env.TELEGRAM_BOT_TOKEN;
const ownerId = String(process.env.TELEGRAM_OWNER_ID || '').trim();
const imagePath = path.join(__dirname, 'assets', 'bot_image.jpg');
const api = token ? `https://api.telegram.org/bot${token}` : null;
let offset = 0;
let polling = false;
let currentSock = null;
const waitingForNumber = new Set();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function setPairingSocket(sock) {
  currentSock = sock;
}

async function sendText(chatId, text) {
  await axios.post(`${api}/sendMessage`, { chat_id: chatId, text });
}

async function sendStart(chatId) {
  const caption = '𝐒𝐇𝐀𝐇𝐙𝐀𝐃𝐀 𝐌𝐃 𝐁𝐎𝐓\nᴘᴀɪʀ ʏᴏᴜʀ ɴᴜᴍ +920000000000';
  if (fs.existsSync(imagePath)) {
    const FormData = require('form-data');
    const form = new FormData();
    form.append('chat_id', String(chatId));
    form.append('caption', caption);
    form.append('photo', fs.createReadStream(imagePath));
    await axios.post(`${api}/sendPhoto`, form, { headers: form.getHeaders() });
  } else {
    await sendText(chatId, caption);
  }
  waitingForNumber.add(String(chatId));
}

async function waitForWhatsAppSocket(sock, timeoutMs = 25000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (sock !== currentSock) {
      throw new Error('WhatsApp connection restarted; please send /start and try again.');
    }
    if (sock.authState?.creds?.registered) {
      throw new Error('SESSION_ALREADY_REGISTERED');
    }
    // Baileys' WebSocketClient exposes `isOpen` (not the browser-style
    // `readyState` property). Checking readyState alone makes this wait
    // time out forever even when WhatsApp has completed its handshake.
    if (sock.ws && (sock.ws.isOpen === true || sock.ws.readyState === 1)) return;
    if (sock.ws && (sock.ws.isClosed === true || sock.ws.isClosing === true)) {
      throw new Error('WhatsApp WebSocket closed before pairing could start. Restart the bot and try again.');
    }
    await sleep(500);
  }
  throw new Error('WhatsApp connection is not ready yet. Check hosting logs/network and retry.');
}

async function handleUpdate(update) {
  const message = update.message;
  if (!message || !message.chat || !message.from) return;
  const chatId = message.chat.id;
  const senderId = String(message.from.id);
  if (!ownerId || senderId !== ownerId) {
    await sendText(chatId, '⛔ This pairing bot is private.');
    return;
  }
  const text = String(message.text || '').trim();
  if (text === '/start') return sendStart(chatId);
  if (text === '/cancel') {
    waitingForNumber.delete(String(chatId));
    return sendText(chatId, 'Pairing cancelled. Send /start to begin again.');
  }
  if (!waitingForNumber.has(String(chatId))) return;

  const number = text.replace(/[^0-9]/g, '');
  if (!/^\d{8,15}$/.test(number) || !PhoneNumber('+' + number).isValid()) {
    return sendText(chatId, 'Invalid number. Send your full WhatsApp number with country code, without + or spaces.');
  }

  const sock = currentSock;
  if (!sock) return sendText(chatId, 'WhatsApp is still starting. Wait a few seconds, then send /start again.');
  if (sock.authState?.creds?.registered) {
    waitingForNumber.delete(String(chatId));
    return sendText(chatId, 'This bot already has a saved WhatsApp session. Stop the bot, clear the old session, restart it, then send /start again.');
  }

  try {
    await sendText(chatId, '𝐂𝐎𝐍𝐍𝐄𝐂𝐓𝐈𝐍𝐆 𝐓𝐎 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏...');
    await waitForWhatsAppSocket(sock);
    // Give the Baileys handshake a short settling period before requesting code.
    await sleep(1500);
    if (sock !== currentSock) throw new Error('WhatsApp connection restarted; please retry.');
    let code = await sock.requestPairingCode(number);
    code = code.match(/.{1,4}/g)?.join('-') || code;
    waitingForNumber.delete(String(chatId));
    await sendText(chatId, `✨𝐘𝐎𝐔𝐑 𝐏𝐀𝐈𝐑𝐈𝐍𝐆 𝐂𝐎𝐃𝐄 𝐈𝐒👻💀\n\n${code}`);
  } catch (error) {
    console.error('Telegram pairing error:', error.stack || error.message || error);
    let reason = error.message || 'Unknown error';
    if (reason === 'SESSION_ALREADY_REGISTERED') {
      reason = 'A saved WhatsApp session is still registered on the hosting server. Stop the bot and clear the session folder before pairing again.';
    }
    await sendText(chatId, `Could not generate the pairing code.\n${reason}\n\nAfter fixing this, send /start again.`);
  }
}

async function startTelegramPairing(sock) {
  setPairingSocket(sock);
  if (!token) {
    console.error('Telegram pairing is not configured. Add TELEGRAM_BOT_TOKEN to your hosting environment.');
    return;
  }
  if (!ownerId) {
    console.error('Add TELEGRAM_OWNER_ID (your numeric Telegram user ID) to secure the pairing bot.');
    return;
  }
  if (polling) return;
  polling = true;
  console.log('Telegram WhatsApp-pairing bot started.');
  while (polling) {
    try {
      const response = await axios.get(`${api}/getUpdates`, {
        params: { offset, timeout: 25, allowed_updates: ['message'] },
        timeout: 30000
      });
      for (const update of response.data.result || []) {
        offset = update.update_id + 1;
        try { await handleUpdate(update); }
        catch (error) { console.error('Telegram update error:', error.stack || error.message || error); }
      }
    } catch (error) {
      console.error('Telegram polling error:', error.message);
      await sleep(3000);
    }
  }
}

module.exports = { startTelegramPairing, setPairingSocket };
