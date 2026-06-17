import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/matches/${storedUser._id}`,
        );
        setMatches(res.data.matches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  const filteredMatches = matches.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-pink-600">💍 Bandhan</h1>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-full px-4 py-2 w-64 outline-none focus:ring-2 focus:ring-pink-400"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/premium")}
            className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-semibold hover:bg-yellow-500 text-sm"
          >
            👑 Upgrade
          </button>
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold cursor-pointer">
            👤
          </div>
        </div>
      </nav>

      {/* Page Title */}
      <div className="px-8 pt-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Matches 💞</h2>
        <p className="text-gray-500">People who match your preferences</p>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-400 py-20">Loading matches...</p>
      )}

      {/* Matches Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-8">
          {filteredMatches.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5 flex flex-col"
            >
              {/* Profile Image Placeholder */}
              <div className="w-full h-48 bg-pink-100 rounded-xl flex items-center justify-center text-6xl mb-4">
                👤
              </div>

              {/* Match % Badge */}
              <div className="self-start bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {person.match}% Match
              </div>

              {/* Name & Age */}
              <h3 className="text-lg font-bold text-gray-800">
                {person.name}, {person.age}
              </h3>

              {/* Details */}
              <p className="text-gray-500 text-sm mt-1">📍 {person.location}</p>
              <p className="text-gray-500 text-sm">💼 {person.occupation}</p>
              <p className="text-gray-500 text-sm">🎓 {person.education}</p>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate("/chat")}
                  className="flex-1 bg-pink-600 text-white py-2 rounded-full font-semibold hover:bg-pink-700"
                >
                  💬 Message
                </button>
                <button className="flex-1 border border-pink-600 text-pink-600 py-2 rounded-full font-semibold hover:bg-pink-50">
                  ❤️ Interest
                </button>
              </div>
            </div>
          ))}

          {filteredMatches.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-10">
              No matches found yet. Try creating more test profiles!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;
