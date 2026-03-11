import requests
import json
import os
from datetime import datetime
from pathlib import Path

def load_config():
    with open('config.json', 'r') as f:
        return json.load(f)

def send_telegram_message(bot_token, chat_id, message):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML"
    }
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to send Telegram message: {e}")

def check_url(url, timeout=10):
    try:
        response = requests.get(url, timeout=timeout)
        return response.status_code == 200, response.status_code
    except requests.exceptions.RequestException as e:
        return False, str(e)

def save_history(results):
    history_file = Path('docs/history.json')
    history_file.parent.mkdir(exist_ok=True)
    
    history = []
    if history_file.exists():
        with open(history_file, 'r') as f:
            history = json.load(f)
    
    history.append(results)
    
    # Keep last 1000 checks
    history = history[-1000:]
    
    with open(history_file, 'w') as f:
        json.dump(history, f, indent=2)

def main():
    config = load_config()
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    
    if not bot_token or not chat_id:
        print("Error: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set")
        return
    
    timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
    failed_urls = []
    results = {
        "timestamp": timestamp,
        "checks": []
    }
    
    for url in config['urls']:
        is_up, status = check_url(url)
        results["checks"].append({
            "url": url,
            "status": "up" if is_up else "down",
            "code": status if isinstance(status, int) else None,
            "error": status if isinstance(status, str) else None
        })
        
        if is_up:
            print(f"✓ {url} - OK")
        else:
            print(f"✗ {url} - FAILED ({status})")
            failed_urls.append((url, status))
    
    save_history(results)
    
    if failed_urls:
        message = f"🚨 <b>Sentinel Alert</b>\n\n"
        message += f"Time: {timestamp} UTC\n\n"
        for url, status in failed_urls:
            message += f"❌ {url}\nStatus: {status}\n\n"
        
        send_telegram_message(bot_token, chat_id, message)

if __name__ == "__main__":
    main()
