import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard({ apiUrl }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${apiUrl}/stats`)
      .then((res) => {
        setStats(res.data.stats);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not load stats");
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 animate-pulse">Loading your stats...</div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );

  const statCards = [
    {
      label: "Total Workouts",
      value: stats?.total_workouts || 0,
      icon: "🏋️",
      color: "green",
    },
    {
      label: "Unique Exercises",
      value: stats?.unique_exercises || 0,
      icon: "💪",
      color: "blue",
    },
    {
      label: "Workout Days",
      value: stats?.workout_days || 0,
      icon: "📅",
      color: "purple",
    },
    {
      label: "Favorite Exercise",
      value: stats?.most_common || "None",
      icon: "⭐",
      color: "yellow",
    },
  ];

  const colorMap = {
    green: "bg-green-900/30 border-green-800 text-green-400",
    blue: "bg-blue-900/30 border-blue-800 text-blue-400",
    purple: "bg-purple-900/30 border-purple-800 text-purple-400",
    yellow: "bg-yellow-900/30 border-yellow-800 text-yellow-400",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Your Dashboard</h2>
        <p className="text-gray-400">
          Track your calisthenics progress over time
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`border rounded-xl p-5 ${colorMap[card.color]}`}
          >
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="text-2xl font-bold text-white mb-1">
              {card.value}
            </div>
            <div className="text-sm opacity-80">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm text-gray-300 font-medium">
              Get Weekly Plan
            </div>
            <div className="text-xs text-gray-500 mt-1">
              AI-generated program
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm text-gray-300 font-medium">
              Log a Workout
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Track today's session
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm text-gray-300 font-medium">
              View History
            </div>
            <div className="text-xs text-gray-500 mt-1">All your workouts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
