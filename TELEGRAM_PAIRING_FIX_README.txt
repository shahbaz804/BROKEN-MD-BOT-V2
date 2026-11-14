SHAHZADA MD BOT — TELEGRAM PAIRING CODE FIX

Fixed the Telegram pairing wait check. Baileys uses WebSocketClient.isOpen; the old check looked only for readyState and could wait until timeout even when the WhatsApp WebSocket was open.

DEPLOY
1. Stop the bot in hosting.
2. Back up your current project and the session folder.
3. Upload/replace the project files from this ZIP. Keep your existing session folder for now.
4. Set TELEGRAM_BOT_TOKEN and TELEGRAM_OWNER_ID in hosting Environment Variables. Do not put real tokens in .env.example.
5. Start the bot, send /start to your Telegram pairing bot, then send the full WhatsApp number with country code (digits only).
6. Enter the returned code in WhatsApp > Linked devices > Link a device.

If the server reports that a session is already registered, stop the bot and only then clear the old session folder after making a backup; this forces a fresh pairing. Do not delete unrelated project data.

SECURITY
The token previously present in the uploaded .env.example should be considered exposed. Regenerate it with BotFather and update the hosting Environment Variable before restarting. Never share the pairing code.
