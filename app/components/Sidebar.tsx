"use client";

import { useEffect, useState, useCallback } from 'react'; // Import useCallback
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
    const [userId, setUserId] = useState<string | null>(null); // Use state for userId

    useEffect(() => {
        // Check for userId in localStorage
        if (typeof window !== 'undefined') {
            const id = localStorage.getItem('userId');
            setUserId(id);
        }
    }, []);

    // Wrap fetchFriends in useCallback to prevent re-creation on each render
    const fetchFriends = useCallback(async () => {
        if (!userId) return; // Prevent unnecessary API call if userId is null

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
    }, [userId]); // Add userId as a dependency

    useEffect(() => {
        if (userId) {
            fetchFriends();
        } else {
            console.error('User ID is not available.');
        }
    }, [userId, fetchFriends]); // Added fetchFriends to the dependency array

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
