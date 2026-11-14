const axios = require('axios');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

async function movieCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { text: '❗ Usage: .movie <movie name>' }, { quoted: message });
            return;
        }

        // Search for movie on YouTube
        const { videos } = await yts(searchQuery + ' movie');
        if (!videos || videos.length === 0) {
            await sock.sendMessage(chatId, { text: '❌ No movies found.' }, { quoted: message });
            return;
        }

        // Get the first video result
        const video = videos[0];
        const videoUrl = video.url;
        const videoTitle = video.title;
        const videoThumbnail = video.thumbnail;

        // Send thumbnail for better UX
        try {
            await sock.sendMessage(chatId, {
                image: { url: videoThumbnail },
                caption: `*${videoTitle}*\nDownloading...`
            }, { quoted: message });
        } catch (e) {
            console.warn('[MOVIE] thumb send failed', e?.message || e);
        }

        // Download the movie
        const tempFile = path.join(process.cwd(), `temp_movie_${Date.now()}.mp4`);
        await new Promise((resolve, reject) => {
            const stream = ytdl(videoUrl, { quality: 'highestvideo', filter: f => f.container === 'mp4' || !f.container });
            const ws = fs.createWriteStream(tempFile);
            stream.pipe(ws);
            stream.on('error', err => {
                ws.destroy();
                reject(err);
            });
            ws.on('finish', resolve);
            ws.on('error', err => {
                ws.destroy();
                reject(err);
            });
        });

        // Send the movie
        const buf = fs.readFileSync(tempFile);
        await sock.sendMessage(chatId, {
            video: buf,
            mimetype: 'video/mp4',
            fileName: `${videoTitle}.mp4`,
            caption: `*${videoTitle}*\n\n> _Downloaded by MH TECH MD_`
        }, { quoted: message });

        // Cleanup
        try {
            fs.unlinkSync(tempFile);
        } catch (e) { /* ignore */ }
    } catch (err) {
        console.error('[MOVIE] Generic error:', err?.message || err);
        await sock.sendMessage(chatId, { text: '❌ Download failed: ' + (err?.message || 'Unknown') }, { quoted: message });
    }
}

module.exports = movieCommand;