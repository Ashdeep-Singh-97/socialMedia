// components/Sidebar.tsx
"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

// Define the Friend interface directly in this component
export interface Friend {
    id: number;
    username: string;
    email: string;
    profileImageUrl?: string;
    requestStatus?: 'none' | 'pending' | 'sent';
}

const Sidebar: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loadingFriends, setLoadingFriends] = useState<boolean>(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchFriends();
        } else {
            console.error('User ID is not available.');
        }
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`/api/auth/friends`, {
                params: { userId }
            });
            setFriends(response.data); // Assuming the response data matches the Friend interface
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoadingFriends(false);
        }
    };

    return (
        <div className="w-64 border-r border-gray-300 p-4">
            <h2 className="text-2xl font-semibold mb-4">Friends</h2>
            {loadingFriends ? (
                <p>Loading friends...</p>
            ) : (
                <ul>
                    {friends.length === 0 ? (
                        <li>No friends found.</li>
                    ) : (
                        friends.map(friend => (
                            <li key={friend.id} className="mb-2">
                                <Link
                                    href={`/user/chat?friendId=${friend.id}`}
                                    className="block px-3 py-2 rounded-lg hover:bg-gray-200"
                                >
                                    {friend.username}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;
