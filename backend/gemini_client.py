from google import genai
import os
from dotenv import load_dotenv
import json
from prompts import WORKOUT_COACH_PROMPT, ANALYSIS_PROMPT

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_and_plan(workout_history: list[dict]) -> dict:
    """
    Analyzes workout history and generates next week's program.
    """
    history_text = ""
    for entry in workout_history:
        history_text += f"- {entry}\n"

    prompt = ANALYSIS_PROMPT.format(
        system=WORKOUT_COACH_PROMPT,
        history=history_text
    )

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    cleaned = response.text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1]
        cleaned = cleaned.rsplit("```", 1)[0]

    return json.loads(cleaned)


def test_connection():
    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents="Say ready to coach in 4 words."
    )
    print("API connected! Gemini says:", response.text)