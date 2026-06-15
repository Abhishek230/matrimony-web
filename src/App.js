import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProfileSetup from "./pages/ProfileSetup";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import PremiumPage from "./pages/PremiumPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/premium" element={<PremiumPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
