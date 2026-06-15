import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5001/api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/send-otp`, { phone });
      console.log("OTP (for testing):", res.data.otp); // remove later
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
      console.log("Logged in user:", res.data.user);

      // Save user info for later use
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.isProfileComplete) {
        navigate("/home");
      } else {
        navigate("/profile-setup");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-pink-600 text-center mb-2">
          💍 Bandhan
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Find your perfect life partner
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter your phone number
            </h2>

            <div className="flex items-center border rounded-lg px-3 py-3 mb-4">
              <span className="text-gray-500 mr-2">🇮🇳 +91</span>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="flex-1 outline-none text-gray-800"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Enter OTP
            </h2>
            <p className="text-gray-500 mb-4">Sent to +91 {phone}</p>
            <p className="text-xs text-gray-400 mb-4">
              💡 For testing: check your backend terminal for the OTP
            </p>

            <input
              type="text"
              placeholder="6-digit OTP"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full border rounded-lg px-3 py-3 mb-4 outline-none text-gray-800 tracking-widest text-center text-lg"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700 mb-3 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full text-pink-600 text-sm font-medium hover:underline"
            >
              ← Change phone number
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
