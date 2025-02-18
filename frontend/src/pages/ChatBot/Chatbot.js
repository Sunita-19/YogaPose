import React, { useState } from "react";
import "./Chatbot.css";

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
      const response = await fetch("https://api.openai.com/v1/chat/completions", { // Actual OpenAI API link
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your actual API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Specify the model you want to use
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const botMessage = {
        text: data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.",
        sender: "assistant",
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response: ", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error fetching response. Please try again later.", sender: "assistant" },
      ]);
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
