from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import plotly.express as px
import json
from datetime import datetime

from data_manager import get_workout_history, log_workout
from gemini_client import analyze_and_plan

app = FastAPI(
    title="AI Calisthenics Coach API",
    description="Backend API for the AI Workout Coach",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WorkoutLog(BaseModel):
    date: Optional[str] = None
    exercise: str
    sets: int
    reps: Optional[float] = None
    duration: Optional[float] = None
    difficulty: str
    notes: Optional[str] = ""

@app.get("/")
def root():
    return {"message": "AI Calisthenics Coach API v2.0", "status": "running"}

@app.get("/history")
def get_history():
    try:
        records = get_workout_history()
        return {"success": True, "data": records, "count": len(records)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/plan")
def get_plan():
    try:
        history = get_workout_history()
        if not history:
            raise HTTPException(status_code=404, detail="No workout history found")
        plan = analyze_and_plan(history)
        return {"success": True, "plan": plan}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/log")
def log_workout_entry(workout: WorkoutLog):
    try:
        date = workout.date or datetime.today().strftime("%Y-%m-%d")
        log_workout(
            date,
            workout.exercise,
            workout.sets,
            str(workout.reps) if workout.reps else "—",
            str(workout.duration) if workout.duration else "—",
            workout.difficulty,
            workout.notes or ""
        )
        return {"success": True, "message": f"Logged: {workout.exercise} on {date}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/charts")
def get_charts():
    try:
        records = get_workout_history()
        if not records:
            return {"success": True, "charts": {}}
        df = pd.DataFrame(records)
        df.columns = df.columns.str.strip()
        df['Date'] = pd.to_datetime(df['Date'])
        df['Reps'] = pd.to_numeric(df['Reps'], errors='coerce').fillna(0)
        df['Sets'] = pd.to_numeric(df['Sets'], errors='coerce').fillna(0)
        df['Volume'] = df['Reps'] * df['Sets']
        fig1 = px.line(df, x='Date', y='Reps', color='Exercise', title='Reps Over Time', markers=True)
        fig2 = px.bar(
            df.groupby('Exercise')['Volume'].sum().reset_index(),
            x='Exercise', y='Volume', title='Total Volume per Exercise',
            color='Volume', color_continuous_scale='Teal'
        )
        return {
            "success": True,
            "charts": {
                "reps_over_time": json.loads(fig1.to_json()),
                "volume_per_exercise": json.loads(fig2.to_json())
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats():
    try:
        records = get_workout_history()
        if not records:
            return {"success": True, "stats": {}}
        df = pd.DataFrame(records)
        df.columns = df.columns.str.strip()
        total_workouts = len(records)
        unique_exercises = df['Exercise'].nunique()
        unique_days = df['Date'].nunique()
        return {
            "success": True,
            "stats": {
                "total_workouts": total_workouts,
                "unique_exercises": int(unique_exercises),
                "workout_days": int(unique_days),
                "most_common": df['Exercise'].mode()[0] if len(df) > 0 else "None"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
