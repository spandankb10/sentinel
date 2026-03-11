# Sentinel

Monitors URLs every 5 minutes and sends Telegram notifications on failures. Includes a live dashboard with uptime stats and historical data.

## Features

- 🔍 Monitor multiple URLs every 5 minutes
- 📱 Telegram notifications on failures  
- 📊 Live dashboard with uptime charts
- 📈 Historical failure tracking
- 🆓 Completely free (GitHub Actions + Pages)

## Project Structure

```
├── .github/workflows/monitor.yml  # GitHub Actions workflow
├── docs/
│   ├── index.html                 # Dashboard UI
│   ├── history.json              # Monitoring data
│   └── .nojekyll                 # GitHub Pages config
├── monitor.py                    # Main monitoring script
├── config.json                   # URLs to monitor
└── requirements.txt              # Python dependencies
```

## Setup

1. **Create a Telegram Bot:**
   - Message [@BotFather](https://t.me/botfather) on Telegram
   - Send `/newbot` and follow instructions
   - Save the bot token

2. **Set up notifications (choose one):**
   
   **Option A: Personal notifications**
   - Message [@userinfobot](https://t.me/userinfobot) on Telegram
   - Save your chat ID
   
   **Option B: Channel notifications (recommended for teams)**
   - Create a new Telegram channel
   - Add your bot as an admin with "Post Messages" permission
   - Get the channel ID:
     - Forward any message from the channel to [@userinfobot](https://t.me/userinfobot)
     - Copy the channel ID (starts with -100)

3. **Configure GitHub Secrets:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add two secrets:
     - `TELEGRAM_BOT_TOKEN`: Your bot token
     - `TELEGRAM_CHAT_ID`: Your chat ID or channel ID (with -100 prefix)

4. **Update URLs:**
   - Edit `config.json` with your URLs to monitor

5. **Push to GitHub:**
   - The workflow runs automatically every 5 minutes
   - Or trigger manually from Actions tab

## Local Testing

```bash
pip install -r requirements.txt
export TELEGRAM_BOT_TOKEN="your_token"
export TELEGRAM_CHAT_ID="your_chat_id"
python monitor.py
```


## Dashboard

After setup, enable GitHub Pages:
1. Go to repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: /docs
4. Save

Your dashboard will be available at: `https://[username].github.io/[repo-name]/`

The dashboard shows:
- Current status of all URLs
- Uptime percentage
- 24-hour history chart
- Recent failures table

## Testing

The config includes a bogus URL that will always fail to test notifications. You can also:

**Test locally:**
```bash
pip install -r requirements.txt
export TELEGRAM_BOT_TOKEN="your_token"
export TELEGRAM_CHAT_ID="your_chat_id_or_channel_id"
python monitor.py
```

**Test on GitHub:**
- Go to Actions tab → Sentinel workflow
- Click "Run workflow" to trigger manually
- Check your Telegram for failure notifications

**Other ways to test:**
- Temporarily add `https://httpstat.us/500` (returns 500 error)
- Add `https://httpstat.us/404` (returns 404 error)
- Add any non-existent domain

Remove test URLs once you confirm everything works!

## Channel Setup Guide

**Creating a Telegram Channel for Team Notifications:**

1. **Create Channel:**
   - Open Telegram → New Channel
   - Choose a name like "Site Monitor Alerts"
   - Make it private (only invited users can join)

2. **Add Bot as Admin:**
   - Go to channel settings → Administrators
   - Add your bot with "Post Messages" permission

3. **Get Channel ID:**
   - Forward any message from the channel to [@userinfobot](https://t.me/userinfobot)
   - Copy the channel ID (looks like `-1001234567890`)
   - Use this as your `TELEGRAM_CHAT_ID`

4. **Invite Team Members:**
   - Add team members to the channel
   - They'll receive all monitoring alerts

**Benefits of using a channel:**
- ✅ Multiple team members get notifications
- ✅ Message history for all alerts
- ✅ Easy to add/remove team members
- ✅ No need to manage multiple chat IDs