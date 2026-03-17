import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessagingSystem = ({ tutorId, studentId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(` https://etuition-bd-server.vercel.app/messages?tutorId=${tutorId}&studentId=${studentId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [tutorId, studentId]);

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(' https://etuition-bd-server.vercel.app/send-message', {
                tutorId,
                studentId,
                message: newMessage,
            });
            if (response.status === 200) {
                setMessages([...messages, response.data]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="p-4 border border-base-300 rounded-lg bg-base-200 transition-colors duration-300">
            <div className="h-64 overflow-y-auto border-b border-base-300 mb-4 bg-base-100 p-4 rounded-lg transition-colors duration-300">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 border-b border-base-300">
                        <p className="font-bold text-primary">{msg.sender}:</p>
                        <p className="text-base-content/80">{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input input-bordered flex-1 bg-base-100 text-base-content border-base-300"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSendMessage}
                    className="btn btn-primary text-white font-bold uppercase"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessagingSystem;