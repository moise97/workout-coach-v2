import { useState } from "react";
import axios from "axios";

export default function WorkoutPlan({ apiUrl }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlan = () => {
    setLoading(true);
    setError(null);
    axios
      .get(`${apiUrl}/plan`)
      .then((res) => {
        setPlan(res.data.plan);
        setLoading(false);
      })
      .catch((err) => {
        setError("Could not generate plan. Try again.");
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">
          Weekly Workout Plan
        </h2>
        <p className="text-gray-400">
          AI-generated program based on your history
        </p>
      </div>

      {!plan && !loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Ready to generate your plan
          </h3>
          <p className="text-gray-400 mb-6 text-sm">
            Gemini will analyze your workout history and create a personalized
            next-week program
          </p>
          <button
            onClick={fetchPlan}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Generate My Weekly Plan 💪
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4 animate-bounce">🤖</div>
          <p className="text-gray-400 animate-pulse">
            Gemini is analyzing your workouts...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400 mb-4">
          {error}
        </div>
      )}

      {plan && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-6">
            <h3 className="text-green-400 font-semibold mb-2">
              📊 Progress Summary
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {plan.summary}
            </p>
          </div>

          {/* Wins */}
          <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6">
            <h3 className="text-blue-400 font-semibold mb-3">
              🏆 What You Did Well
            </h3>
            <ul className="space-y-2">
              {plan.wins?.map((win, i) => (
                <li key={i} className="text-gray-300 text-sm flex gap-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {win}
                </li>
              ))}
            </ul>
          </div>

          {/* Weekly Program */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              📅 Next Week's Program
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.next_week?.map((day, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-semibold text-sm">
                      {day.day}
                    </h4>
                    <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                      {day.focus}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {day.exercises?.map((ex, j) => (
                      <div key={j} className="border-l-2 border-green-500 pl-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-sm font-medium">
                            {ex.name}
                          </span>
                          <span className="text-green-400 text-xs">
                            {ex.reps_or_duration} × {ex.sets}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5 italic">
                          {ex.progression_note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rest days + tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">😴 Rest Days</h3>
              <p className="text-gray-400 text-sm">{plan.rest_days}</p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-5">
              <h3 className="text-yellow-400 font-semibold mb-2">
                🎯 Coach's Tip
              </h3>
              <p className="text-gray-300 text-sm">{plan.motivational_tip}</p>
            </div>
          </div>

          <button
            onClick={fetchPlan}
            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-6 py-3 rounded-lg transition-colors text-sm"
          >
            Regenerate Plan
          </button>
        </div>
      )}
    </div>
  );
}
