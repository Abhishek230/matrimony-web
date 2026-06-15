import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProfileSetup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    religion: "",
    motherTongue: "",
    location: "",
    education: "",
    occupation: "",
    bio: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const res = await axios.put(
        "http://localhost:5001/api/users/update-profile",
        {
          userId: storedUser._id,
          ...formData,
        },
      );

      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Profile Created Successfully! 🎉");
      navigate("/home");
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        {/* Header */}
        <h1 className="text-2xl font-bold text-pink-600 text-center mb-2">
          Create Your Profile
        </h1>
        <p className="text-gray-500 text-center mb-6">Step {step} of 3</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-pink-600 h-2 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Basic Information
            </h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400 text-gray-600"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <button
              onClick={nextStep}
              className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Background Info */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Background Details
            </h2>

            <input
              type="text"
              name="religion"
              placeholder="Religion"
              value={formData.religion}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="text"
              name="motherTongue"
              placeholder="Mother Tongue"
              value={formData.motherTongue}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="text"
              name="location"
              placeholder="City, State"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="w-1/2 border border-pink-600 text-pink-600 py-3 rounded-full font-semibold hover:bg-pink-50"
              >
                ← Back
              </button>
              <button
                onClick={nextStep}
                className="w-1/2 bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Education & Bio */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Education & About You
            </h2>

            <input
              type="text"
              name="education"
              placeholder="Highest Education"
              value={formData.education}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            />

            <textarea
              name="bio"
              placeholder="Write a short bio about yourself..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
            ></textarea>

            <div className="flex gap-3">
              <button
                onClick={prevStep}
                className="w-1/2 border border-pink-600 text-pink-600 py-3 rounded-full font-semibold hover:bg-pink-50"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className="w-1/2 bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-pink-700"
              >
                Finish ✅
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileSetup;
