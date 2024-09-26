// /pages/user/chat.tsx
"use client"

import { useEffect, useState } from 'react';

interface Message {
    id: number;
    content: string;
    senderId: number;
}

const Chat: React.FC = () => {
    const userId = parseInt(localStorage.getItem('userId') || '0');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [friendId, setFriendId] = useState<number | null>(null);

    // Fetch friendId from URL parameters
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const friendIdParam = query.get('friendId');
        console.log(friendIdParam);
        if (friendIdParam) {
            setFriendId(parseInt(friendIdParam)); // Set friendId state
        }
    }, []);

    // Fetch chat history whenever friendId changes
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (friendId === null) return; // If friendId is not available

            try {
                const response = await fetch(`/api/auth/history?userId=${userId}&friendId=${friendId}`);
                if (!response.ok) throw new Error('Failed to fetch chat history');
                const data: Message[] = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, [friendId, userId]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage: Message = { id: Date.now(), content: input, senderId: userId };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInput('');

        await fetch('/api/auth/sendMessage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: input, senderId: userId, receiverId: friendId }),
        });
    };

    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-6 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Chat</h1>
            <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white">
                {messages.map(message => (
                    <div key={message.id} className={`mb-2 ${message.senderId === userId ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${message.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-lg"
                />
                <button
                    onClick={handleSend}
                    className="ml-2 bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
