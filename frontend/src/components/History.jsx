import { useState } from "react";
import axios from "axios";

export default function History({ apiUrl }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadHistory = () => {
    setLoading(true);
    axios
      .get(`${apiUrl}/history`)
      .then((res) => {
        setHistory(res.data.data);
        setLoading(false);
        setLoaded(true);
      })
      .catch(() => setLoading(false));
  };

  const difficultyColor = {
    Easy: "text-green-400 bg-green-900/30",
    Medium: "text-yellow-400 bg-yellow-900/30",
    Hard: "text-red-400 bg-red-900/30",
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Workout History
          </h2>
          <p className="text-gray-400">
            All your logged sessions from Google Sheets
          </p>
        </div>
        <button
          onClick={loadHistory}
          className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          {loading ? "Loading..." : "Load History"}
        </button>
      </div>

      {!loaded && !loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-400">
            Click Load History to see your workouts
          </p>
        </div>
      )}

      {loaded && history.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <p className="text-gray-400">
            No workouts logged yet. Start logging!
          </p>
        </div>
      )}

      {loaded && history.length > 0 && (
        <div className="space-y-3">
          {history.map((entry, i) => {
            const difficulty = (
              entry[" Difficulty"] ||
              entry["Difficulty"] ||
              ""
            ).trim();
            const reps = entry[" Reps"] || entry["Reps"] || "—";
            const duration =
              entry[" Duration (sec)"] || entry["Duration (sec)"] || "—";
            const notes = entry[" Notes"] || entry["Notes"] || "";

            return (
              <div
                key={i}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-16">
                    <div className="text-xs text-gray-500">
                      {entry.Date?.split("-")[1]}/{entry.Date?.split("-")[2]}
                    </div>
                    <div className="text-xs text-gray-600">
                      {entry.Date?.split("-")[0]}
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {entry.Exercise}
                    </div>
                    <div className="text-gray-500 text-xs mt-0.5">
                      {entry.Sets} sets ·{" "}
                      {reps !== "—" ? `${reps} reps` : `${duration}s`}
                      {notes ? ` · ${notes.trim()}` : ""}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor[difficulty] || "text-gray-400 bg-gray-800"}`}
                >
                  {difficulty || "N/A"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
