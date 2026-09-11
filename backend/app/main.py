import os
from fastapi import FastAPI, Request
import httpx

app = FastAPI(title="Telegram Condo Broadcast Engine")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
CHANNEL_ID = os.getenv("TARGET_CHANNEL_ID", "")

@app.get("/")
def read_root():
    return {"status": "Condo Bot Engine Active"}

@app.post("/webhook/supabase")
async def handle_supabase_webhook(request: Request):
    payload = await request.json()
    event_type = payload.get("type")
    record = payload.get("record", {})
    old_record = payload.get("old_record", {})

    async with httpx.AsyncClient() as client:
        # Handle New Listing Insertion
        if event_type == "INSERT":
            text = (
                f"🟢 [AVAILABLE]\n"
                f"🏢 **CONDO FOR {record.get('category', '').upper()}**\n\n"
                f"📍 **Location:** {record.get('site_name')} (Block {record.get('block_no')}, Floor {record.get('floor_no')})\n"
                f"🛌 **Bedrooms:** {record.get('bedrooms')}\n"
                f"💰 **Price:** {float(record.get('asking_price', 0)):,} ETB\n"
                f"🤝 **Commission:** {record.get('commission_percent')}%\n"
            )
            keyboard = {
                "inline_keyboard": [[
                    {"text": "📞 Contact Agent / Owner", "callback_data": f"contact_{record.get('phone_number')}"}
                ]]
            }
            
            await client.post(
                f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                json={
                    "chat_id": CHANNEL_ID,
                    "text": text,
                    "parse_mode": "Markdown",
                    "reply_markup": keyboard
                }
            )

        # Handle Status Updates (Available -> Sold / Rented)
        elif event_type == "UPDATE" and record.get("status") != old_record.get("status"):
            msg_id = record.get("telegram_message_id")
            if msg_id:
                status_emoji = "🟢" if record.get("status") == "available" else "🔴"
                updated_text = (
                    f"{status_emoji} **[STATUS: {record.get('status').upper()}]**\n"
                    f"🏢 **CONDO FOR {record.get('category').upper()}**\n\n"
                    f"📍 **Location:** {record.get('site_name')} (Block {record.get('block_no')})\n"
                    f"🛌 **Bedrooms:** {record.get('bedrooms')}\n"
                    f"💰 **Price:** {float(record.get('asking_price', 0)):,} ETB\n"
                )
                
                await client.post(
                    f"https://api.telegram.org/bot{BOT_TOKEN}/editMessageText",
                    json={
                        "chat_id": CHANNEL_ID,
                        "message_id": msg_id,
                        "text": updated_text,
                        "parse_mode": "Markdown"
                    }
                )

    return {"status": "processed"}