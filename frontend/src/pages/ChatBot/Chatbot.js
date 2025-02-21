import React, { useState } from "react";
import "./Chatbot.css";
import API_URL from "../../config";



const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(true); // Ensures chatbot opens on first click
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        throw new Error('Failed to get chatbot response');
      }

      const data = await response.json();
      const botMessage = {
        text: data.text,
        sender: "assistant",
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        text: "Sorry, I'm having trouble responding. Please try again later.",
        sender: "assistant",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }


  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
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
            <button className="chatbot-close" onClick={closeChatbot}>✖</button>
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
