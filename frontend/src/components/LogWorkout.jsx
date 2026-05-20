import { useState } from "react";
import axios from "axios";

export default function LogWorkout({ apiUrl }) {
  const [form, setForm] = useState({
    date: "",
    exercise: "",
    sets: 3,
    reps: "",
    duration: "",
    difficulty: "Medium",
    notes: "",
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.exercise.trim()) {
      setStatus({ type: "error", message: "Please enter an exercise name" });
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        sets: parseInt(form.sets),
        reps: form.reps ? parseFloat(form.reps) : null,
        duration: form.duration ? parseFloat(form.duration) : null,
        date: form.date || null,
      };
      const res = await axios.post(`${apiUrl}/log`, payload);
      setStatus({ type: "success", message: res.data.message });
      setForm({
        date: "",
        exercise: "",
        sets: 3,
        reps: "",
        duration: "",
        difficulty: "Medium",
        notes: "",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: "Failed to log workout. Try again.",
      });
    }
    setLoading(false);
  };

  const exercises = [
    "Push-ups",
    "Bodyweight Squats",
    "Plank",
    "Jumping Jacks",
    "Mountain Climbers",
    "Glute Bridges",
    "Lunges",
    "Burpees",
    "Tricep Dips",
    "Superman Hold",
    "Hollow Body Hold",
    "Side Plank",
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Log a Workout</h2>
        <p className="text-gray-400">
          Record today's session — saves directly to Google Sheets
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg">
        {status && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-green-900/30 border border-green-800 text-green-400"
                : "bg-red-900/30 border border-red-800 text-red-400"
            }`}
          >
            {status.message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Date{" "}
              <span className="text-gray-600">(leave blank for today)</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Exercise</label>
            <input
              type="text"
              value={form.exercise}
              onChange={(e) => setForm({ ...form, exercise: e.target.value })}
              placeholder="e.g. Push-ups"
              list="exercises"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            />
            <datalist id="exercises">
              {exercises.map((ex) => (
                <option key={ex} value={ex} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Sets</label>
              <input
                type="number"
                value={form.sets}
                onChange={(e) => setForm({ ...form, sets: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Reps</label>
              <input
                type="number"
                value={form.reps}
                onChange={(e) => setForm({ ...form, reps: e.target.value })}
                placeholder="—"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Duration (sec)
              </label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="—"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-1 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="How did it feel?"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Logging..." : "Log Workout ➕"}
          </button>
        </div>
      </div>
    </div>
  );
}
