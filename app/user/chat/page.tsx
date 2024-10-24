"use client";

import Sidebar from '@/app/components/Sidebar';
import { useEffect, useState } from 'react';

interface Message {
    id: number;
    content: string;
    senderId: number;
}

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [friendId, setFriendId] = useState<number | null>(null);
    const [isBlocked, setIsBlocked] = useState<boolean>(false);
    const [isBlockingUser, setIsBlockingUser] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);

    // Fetch userId from localStorage in the client environment
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        setUserId(storedUserId ? parseInt(storedUserId) : null);
    }, []);

    // Fetch friendId from URL parameters
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const friendIdParam = query.get('friendId');
        if (friendIdParam) {
            setFriendId(parseInt(friendIdParam));
        }
    }, []);

    useEffect(() => {
        const fetchFriendshipStatus = async () => {
            if (friendId === null || userId === null) return;

            try {
                const response = await fetch(`/api/auth/friendshipStatus?userId=${userId}&friendId=${friendId}`);
                const data = await response.json();

                // Set the state based on the API response
                setIsBlocked(data.isBlocked || data.isBlockedByUser);
                setIsBlockingUser(data.isBlockingUser);
            } catch (error) {
                console.error('Error fetching friendship status:', error);
            }
        };

        fetchFriendshipStatus();
    }, [friendId, userId]);

    // Fetch chat history whenever friendId changes
    useEffect(() => {
        const fetchChatHistory = async () => {
            if (friendId === null || isBlocked || userId === null) return;

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
    }, [friendId, userId, isBlocked]);

    const handleSend = async () => {
        if (!input.trim() || isBlocked || userId === null) return;

        const newMessage: Message = { id: Date.now(), content: input, senderId: userId };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInput('');

        try {
            await fetch('/api/auth/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: input, senderId: userId, receiverId: friendId }),
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBlock = async () => {
        if (friendId === null || userId === null) return;

        try {
            const response = await fetch('/api/auth/blockUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setIsBlocked(true);
                setIsBlockingUser(true);
            } else {
                alert(data.error || 'Failed to block user.');
            }
        } catch (error) {
            console.error('Error blocking user:', error);
            alert('An error occurred while blocking the user.');
        }
    };

    const handleUnblock = async () => {
        if (friendId === null || userId === null) return;

        try {
            const response = await fetch('/api/auth/unblockUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, friendId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setIsBlocked(false);
                setIsBlockingUser(false);
            } else {
                alert(data.error || 'Failed to unblock user.');
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            alert('An error occurred while unblocking the user.');
        }
    };

    const isSendDisabled = isBlocked || (isBlockingUser && userId !== friendId);

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 bg-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold">Chat</h1>
                    {!isBlocked && !isBlockingUser && (
                        <button
                            onClick={handleBlock}
                            className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600"
                        >
                            Block
                        </button>
                    )}
                    {isBlockingUser && (
                        <button
                            onClick={handleUnblock}
                            className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600"
                        >
                            Unblock
                        </button>
                    )}
                </div>
                {isBlocked && isBlockingUser && (
                    <div className="mb-4 text-red-500">User blocked. You can unblock them.</div>
                )}
                <div className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-white mb-4">
                    {messages.map(message => (
                        <div key={message.id} className={`mb-2 ${message.senderId === userId ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-4 py-2 rounded-lg ${message.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            disabled={isSendDisabled}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        className="ml-2 bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600"
                        disabled={isSendDisabled}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
