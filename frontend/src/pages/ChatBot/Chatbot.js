import React, { useState } from 'react';
import './Chatbot.css';

export default function Chatbot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSend = async () => {
        if (!input) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');

        const responseMessage = await getAIResponse(input);
        setMessages(prevMessages => [...prevMessages, responseMessage]);
    };

    const getAIResponse = async (userInput) => {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Use your API key from .env
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: userInput }],
                }),
            });

            const data = await response.json();
            console.log("API Response:", data); // Log the API response

            if (data.choices && data.choices.length > 0) {
                const aiMessage = { role: 'assistant', content: data.choices[0].message.content };
                return aiMessage;
            } else {
                return { role: 'assistant', content: "I couldn't get a response." };
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            return { role: 'assistant', content: "Sorry, I couldn't respond at the moment." };
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Chat with AI</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <span>{msg.content}</span>
                    </div>
                ))}
            </div>
            <div className="chatbot-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}
