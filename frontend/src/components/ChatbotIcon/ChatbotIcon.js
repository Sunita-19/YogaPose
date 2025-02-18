import React, { useState } from 'react';
import Chatbot from '../../pages/ChatBot/Chatbot';
import './ChatbotIcon.css';

const ChatbotIcon = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatbot-icon-container">
      <div className="chatbot-icon" onClick={toggleChatbot}>
        💬
      </div>
      {isOpen && <Chatbot />}
    </div>
  );
};

export default ChatbotIcon;
