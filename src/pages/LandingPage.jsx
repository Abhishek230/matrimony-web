import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-md">
        <h1 className="text-2xl font-bold text-pink-600">💍 Bandhan</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-pink-50 to-white">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Find Your Perfect <span className="text-pink-600">Life Partner</span>
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-xl">
          Join thousands of happy couples who found their match on Bandhan.
          Simple, safe, and modern matrimony.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700"
        >
          Start for Free 💕
        </button>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-16 py-16 bg-white">
        <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-md hover:shadow-lg">
          <span className="text-5xl mb-4">🔒</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Safe & Secure
          </h3>
          <p className="text-gray-500">
            Phone verified profiles only. Your privacy is our priority.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-md hover:shadow-lg">
          <span className="text-5xl mb-4">💞</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Smart Matching
          </h3>
          <p className="text-gray-500">
            Our algorithm finds the most compatible profiles for you.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-2xl shadow-md hover:shadow-lg">
          <span className="text-5xl mb-4">💬</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Real-time Chat
          </h3>
          <p className="text-gray-500">
            Connect instantly with your matches through secure messaging.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-sm bg-gray-50">
        © 2025 Bandhan. Made with ❤️ for finding love.
      </footer>
    </div>
  );
}

export default LandingPage;
