import React, { useState } from "react";
import "./Chatbot.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/chatbot";
const API_KEY =
  process.env.REACT_APP_OPENAI_API_KEY || "AIzaSyB-FXhfKV8PMkg8LAjUuM9XuRg4Gqk21JQ";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => setIsOpen(true);
  const closeChatbot = () => setIsOpen(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      if (!API_KEY) throw new Error("API key is missing");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Failed to get response from server");

      const data = await response.json();
      const botMessage = { text: data.text, sender: "assistant" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { text: error.message, sender: "assistant" },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div>
      {!isOpen && (
        <button className="chatbot-open-btn" onClick={toggleChatbot}>
          💬
        </button>
      )}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            AI Chatbot
            <button className="chatbot-close" onClick={closeChatbot}>
              ✖
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
