import React, { useState } from 'react';
import './Chatbot.css';

const responses = {
    greeting: "Hello! How can I assist you today?",
    help: "I can help you with Yoga poses, tips, and more!",
    goodbye: "Goodbye! Have a great day!",
    default: "I'm not sure how to respond to that. Could you please clarify?",
};

const getBotResponse = (input) => {
    const lowerCaseInput = input.toLowerCase();

    if (lowerCaseInput.includes('hi') || lowerCaseInput.includes('hello')) {
        return responses.greeting;
    } else if (lowerCaseInput.includes('help')) {
        return responses.help;
    } else if (lowerCaseInput.includes('bye')) {
        return responses.goodbye;
    } else {
        return responses.default;
    }
};

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            const newMessage = { text: input, sender: 'user' };
            setMessages([...messages, newMessage]);
            setInput('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = { text: getBotResponse(input), sender: 'bot' };
                setMessages((prevMessages) => [...prevMessages, botResponse]);
            }, 1000);
        }
    };

    return (
        <div className="chatbot-container">
            <h2 className="chatbot-heading">Chat with Us!</h2>
            <div className="chatbox">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="Type your message..." 
                        className="chat-input"
                    />
                    <button onClick={handleSend} className="send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
