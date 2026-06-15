import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

function ChatPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize: get current user, connect socket, fetch conversations
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setCurrentUser(storedUser);

    // Connect to socket
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("register", storedUser._id);

    // Listen for incoming messages
    socketRef.current.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for sent message confirmation
    socketRef.current.on("message_sent", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicator
    socketRef.current.on("user_typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    });

    // Fetch matches (people you can chat with)
    const fetchConversations = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/matches/${storedUser._id}`,
        );
        setConversations(res.data.matches);
        if (res.data.matches.length > 0) {
          setActiveChat(res.data.matches[0]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    return () => {
      socketRef.current.disconnect();
    };
  }, [navigate]);

  // Load message history when activeChat changes
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/messages/${currentUser._id}/${activeChat.id}`,
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [activeChat, currentUser]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() === "" || !activeChat) return;

    socketRef.current.emit("send_message", {
      senderId: currentUser._id,
      receiverId: activeChat.id,
      text: newMessage,
    });

    setNewMessage("");
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (activeChat) {
      socketRef.current.emit("typing", {
        senderId: currentUser._id,
        receiverId: activeChat.id,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading chats...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-md">
        <h1 className="text-xl font-bold text-pink-600">💍 Bandhan</h1>
        <button
          onClick={() => navigate("/home")}
          className="text-pink-600 font-semibold hover:underline"
        >
          ← Back to Matches
        </button>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Conversation List */}
        <div className="w-1/3 border-r bg-white overflow-y-auto">
          <h2 className="px-4 py-3 font-bold text-gray-800 border-b">
            Messages
          </h2>

          {conversations.length === 0 && (
            <p className="text-gray-400 text-sm px-4 py-6 text-center">
              No matches yet to chat with.
            </p>
          )}

          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveChat(conv)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-pink-50 border-b ${
                activeChat?.id === conv.id ? "bg-pink-50" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">
                👤
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold text-gray-800">{conv.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {conv.match}% Match
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-6 py-3 bg-white shadow-sm">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {activeChat.name}
                  </h3>
                  {isTyping && (
                    <p className="text-xs text-pink-500">typing...</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 mt-10">
                    No messages yet. Say hi! 👋
                  </p>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender === currentUser._id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        msg.sender === currentUser._id
                          ? "bg-pink-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 shadow rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span
                        className={`text-xs block mt-1 ${msg.sender === currentUser._id ? "text-pink-100" : "text-gray-400"}`}
                      >
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="flex items-center gap-3 px-6 py-4 bg-white border-t">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  onClick={handleSend}
                  className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
// secret - na2ZC7tUXu2v3qyqpVADfinG
