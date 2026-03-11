import axios from 'axios';
import fs from 'fs';
import path from 'path';

const config = {
  urls: [
    "https://vultrconf.com",
    "https://vultrconf.com/telecommunications",
    "https://vultrconf.com/hospitality", 
    "https://vultrconf.com/finance",
    "https://vultrconf.com/healthcare",
    "https://bogus-url.com"
  ]
};

async function sendTelegramMessage(botToken, chatId, message) {
  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML"
    });
  } catch (error) {
    console.error('Failed to send Telegram message:', error.message);
  }
}

async function checkUrl(url, timeout = 10000) {
  try {
    const response = await axios.get(url, { timeout });
    return { isUp: response.status === 200, status: response.status };
  } catch (error) {
    return { isUp: false, status: error.message };
  }
}

function getTimezoneTime() {
  const now = new Date();
  
  // IST (UTC+5:30)
  const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  
  // US Eastern (UTC-5 or UTC-4 depending on DST)
  const usTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  
  return {
    ist: istTime.toISOString().slice(0, 19).replace('T', ' '),
    us: usTime.toISOString().slice(0, 19).replace('T', ' ')
  };
}

export default async function handler(req, res) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!botToken || !chatId) {
    return res.status(500).json({ error: 'Missing Telegram credentials' });
  }
  
  const times = getTimezoneTime();
  const failedUrls = [];
  const results = {
    timestamp: new Date().toISOString(),
    checks: []
  };
  
  // Check all URLs
  for (const url of config.urls) {
    const { isUp, status } = await checkUrl(url);
    
    results.checks.push({
      url,
      status: isUp ? 'up' : 'down',
      code: typeof status === 'number' ? status : null,
      error: typeof status === 'string' ? status : null
    });
    
    if (!isUp) {
      failedUrls.push({ url, status });
    }
  }
  
  // Save history (in production, you'd use a database)
  // For now, we'll just log it
  console.log('Monitoring results:', results);
  
  // Send notifications for failures
  if (failedUrls.length > 0) {
    let message = "🚨 <b>Sentinel Alert</b>\n\n";
    message += `🇮🇳 IST: ${times.ist}\n`;
    message += `🇺🇸 EST: ${times.us}\n\n`;
    
    for (const { url, status } of failedUrls) {
      message += `❌ ${url}\nStatus: ${status}\n\n`;
    }
    
    await sendTelegramMessage(botToken, chatId, message);
  }
  
  res.status(200).json({ 
    success: true, 
    checked: config.urls.length,
    failed: failedUrls.length,
    results 
  });
}