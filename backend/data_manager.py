import gspread
from google.oauth2.service_account import Credentials
import os
import json
import base64
from dotenv import load_dotenv

load_dotenv()

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

def get_credentials():
    """
    Load credentials from file locally or from
    base64 environment variable in production.
    """
    google_credentials = os.getenv("GOOGLE_CREDENTIALS")
    
    if google_credentials:
        # Running in production — decode from base64 secret
        credentials_json = base64.b64decode(google_credentials).decode("utf-8")
        credentials_dict = json.loads(credentials_json)
        return Credentials.from_service_account_info(
            credentials_dict,
            scopes=SCOPES
        )
    else:
        # Running locally — use credentials.json file
        return Credentials.from_service_account_file(
            "credentials.json",
            scopes=SCOPES
        )


def get_sheet():
    """Connect to Google Sheets."""
    creds = get_credentials()
    client = gspread.authorize(creds)
    sheet = client.open_by_key(os.getenv("GOOGLE_SHEET_ID"))
    return sheet.sheet1


def get_workout_history() -> list[dict]:
    """Read all workout data from the sheet."""
    sheet = get_sheet()
    records = sheet.get_all_records()
    return records


def log_workout(date: str, exercise: str, sets: int,
                reps: str, duration: str, difficulty: str, notes: str):
    """Add a new workout row to the sheet."""
    sheet = get_sheet()
    sheet.append_row([date, exercise, sets, reps, duration, difficulty, notes])


def test_connection():
    """Quick test to verify Google Sheets connection works."""
    records = get_workout_history()
    print(f"Connected! Found {len(records)} workout entries.")
    if records:
        print(f"Latest entry: {records[-1]}")