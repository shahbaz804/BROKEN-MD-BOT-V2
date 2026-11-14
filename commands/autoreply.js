const fs = require('fs');
const path = require('path');

// Path for storing auto-reply messages
const AUTO_REPLY_DATA = path.join(__dirname, '../data/autoReplyData.json');

// Load auto-reply messages from file
function loadAutoReplyMessages() {
  try {
    if (fs.existsSync(AUTO_REPLY_DATA)) {
      return JSON.parse(fs.readFileSync(AUTO_REPLY_DATA));
    }
  } catch (error) {
    console.error('Error loading auto-reply messages:', error);
  }
  return {};
}

// Save auto-reply messages to file
function saveAutoReplyMessages(messages) {
  try {
    fs.writeFileSync(AUTO_REPLY_DATA, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error('Error saving auto-reply messages:', error);
  }
}

// Store auto-reply messages
let autoReplyMessages = loadAutoReplyMessages();

// Predefined auto-reply messages
const predefinedMessages = {
  "hello": "Assalam o walakum!",
  "hi": "Hello!",
  "how are you": "I'm fine, thank you!",
  // ... (add the rest of the messages here)
  "how's life": "Life is good!",
  "how's everything": "Everything is fine!",
  "what's new": "Nothing much!",
  "what's happening": "Just chillin'!",
  // ... (add the rest of the messages here)
};

// Add predefined messages to auto-reply messages
Object.assign(autoReplyMessages, predefinedMessages);
saveAutoReplyMessages(autoReplyMessages);

// Variable to track the auto-reply status
let autoReplyEnabled = true;

// Function to handle auto-reply
async function handleAutoReply(sock, message) {
  try {
    if (!autoReplyEnabled) return;

    const text = message.message?.conversation;
    if (!text) return;

    // Check if message is a command
    if (text.startsWith('.')) {
      if (text === '.autoreply on') {
        autoReplyEnabled = true;
        await sock.sendMessage(message.key.remoteJid, { text: '✅ Auto-reply enabled', quoted: message });
      } else if (text === '.autoreply off') {
        autoReplyEnabled = false;
        await sock.sendMessage(message.key.remoteJid, { text: '✅ Auto-reply disabled', quoted: message });
      }
      return;
    }

    // Get reply message
    const replyMessage = autoReplyMessages[text.toLowerCase()];
    if (replyMessage) {
      await sock.sendMessage(message.key.remoteJid, { text: replyMessage, quoted: message });
    } else {
      // Default reply message
      const defaultReplies = [
        "Assalam o walakum!",
        "Hello!",
        "Hi!",
        "I'm here to help you!",
        "How can I assist you?"
      ];
      const randomReply = defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
      await sock.sendMessage(message.key.remoteJid, { text: randomReply, quoted: message });
    }
  } catch (error) {
    console.error('Error handling auto-reply:', error);
  }
}

module.exports = { handleAutoReply };