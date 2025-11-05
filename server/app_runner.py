import uvicorn
import webview
import threading
from dotenv import load_dotenv
import os
import time

# Load .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"))


def start_server():
    """Run FastAPI (Uvicorn) in a separate thread"""
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)


if __name__ == "__main__":
    # Start FastAPI in a background thread
    server_thread = threading.Thread(target=start_server, daemon=True)
    server_thread.start()

    # Wait a little for the server to start
    time.sleep(2)

    # Start pywebview in the main thread
    webview.create_window("Exam", "http://127.0.0.1:8000", width=1200, height=800)
    webview.start()
