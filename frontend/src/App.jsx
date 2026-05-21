import { useState } from "react";
import Dashboard from "./components/Dashboard";
import WorkoutPlan from "./components/WorkoutPlan";
import LogWorkout from "./components/LogWorkout";
import History from "./components/History";

const API_URL =
  import.meta.env.VITE_API_URL || "https://workout-coach-api.onrender.com";
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "plan", label: "Weekly Plan", icon: "📅" },
    { id: "log", label: "Log Workout", icon: "➕" },
    { id: "history", label: "History", icon: "📋" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">
              🏋️ AI Calisthenics Coach
            </h1>
            <p className="text-gray-400 text-sm">Powered by Google Gemini</p>
          </div>
          <div className="text-right">
            <p className="text-green-400 text-sm font-medium">● Live</p>
            <p className="text-gray-500 text-xs">v2.0</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6">
        <div className="max-w-5xl mx-auto flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-green-400 text-green-400"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "dashboard" && <Dashboard apiUrl={API_URL} />}
        {activeTab === "plan" && <WorkoutPlan apiUrl={API_URL} />}
        {activeTab === "log" && <LogWorkout apiUrl={API_URL} />}
        {activeTab === "history" && <History apiUrl={API_URL} />}
      </main>
    </div>
  );
}
