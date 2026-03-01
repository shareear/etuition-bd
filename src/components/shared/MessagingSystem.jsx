import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessagingSystem = ({ tutorId, studentId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(` https://etuition-bd-server.vercel.app//messages?tutorId=${tutorId}&studentId=${studentId}`);
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [tutorId, studentId]);

    const handleSendMessage = async () => {
        try {
            const response = await axios.post(' https://etuition-bd-server.vercel.app//send-message', {
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
        <div className="p-4 border rounded-lg bg-gray-50">
            <div className="h-64 overflow-y-auto border-b mb-4 bg-white p-4 rounded-lg">
                {messages.map((msg, index) => (
                    <div key={index} className="p-2 border-b">
                        <p className="font-bold text-blue-600">{msg.sender}:</p>
                        <p className="text-gray-700">{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="input input-bordered flex-1 bg-white"
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