import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const plans = [
  {
    name: "Free",
    price: "₹0",
    duration: "/forever",
    features: ["Create profile", "View limited matches", "Send 1 interest/day"],
    highlight: false,
  },
  {
    name: "Premium",
    price: "₹999",
    duration: "/month",
    features: [
      "Unlimited matches",
      "Unlimited messaging",
      "See who liked you",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    price: "₹2499",
    duration: "/month",
    features: [
      "Everything in Premium",
      "Profile boost 5x",
      "Dedicated relationship manager",
      "Verified badge ✅",
    ],
    highlight: false,
  },
];

function PremiumPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChoosePlan = async (plan) => {
    if (plan.price === "₹0") {
      alert("You are already on the Free plan!");
      return;
    }

    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      // Step 1: Create order on backend
      const { data } = await axios.post(
        "http://localhost:5001/api/payments/create-order",
        {
          userId: storedUser._id,
          plan: plan.name,
        },
      );

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Bandhan Matrimony",
        description: `${plan.name} Membership`,
        order_id: data.orderId,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await axios.post(
              "http://localhost:5001/api/payments/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: storedUser._id,
                plan: plan.name,
              },
            );

            // Update localStorage with new membership
            storedUser.membership = verifyRes.data.plan;
            localStorage.setItem("user", JSON.stringify(storedUser));

            alert(`Payment Successful! 🎉 You are now a ${plan.name} member.`);
            navigate("/home");
          } catch (err) {
            alert("Payment verification failed. Please contact support.");
            console.error(err);
          }
        },
        prefill: {
          contact: storedUser.phone,
        },
        theme: {
          color: "#db2777", // pink-600
        },
        modal: {
          ondismiss: function () {
            console.log("Payment cancelled by user");
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-pink-600">💍 Bandhan</h1>
        <button
          onClick={() => navigate("/home")}
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Back to Matches
        </button>
      </nav>

      {/* Header */}
      <div className="text-center py-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Upgrade to Premium 👑
        </h2>
        <p className="text-gray-500">
          Unlock more features and find your match faster
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 pb-16 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-8 shadow-md flex flex-col ${
              plan.highlight
                ? "bg-pink-600 text-white scale-105 shadow-2xl"
                : "bg-white text-gray-800"
            }`}
          >
            {plan.highlight && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full self-start mb-3">
                MOST POPULAR
              </span>
            )}

            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span
                className={plan.highlight ? "text-pink-100" : "text-gray-400"}
              >
                {plan.duration}
              </span>
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span>✅</span> {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleChoosePlan(plan)}
              disabled={loading}
              className={`w-full py-3 rounded-full font-semibold disabled:opacity-50 ${
                plan.highlight
                  ? "bg-white text-pink-600 hover:bg-gray-100"
                  : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
            >
              {loading
                ? "Processing..."
                : plan.price === "₹0"
                  ? "Current Plan"
                  : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PremiumPage;
