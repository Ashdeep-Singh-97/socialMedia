"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link'; // Import Link from next/link

export interface Friend {
    id: number;
    username: string;
    email: string;
    profileImageUrl?: string;
    requestStatus?: 'none' | 'pending' | 'sent';
}

const FriendPage = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [friendRequests, setFriendRequests] = useState<Friend[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Friend[]>([]);
    const [loadingFriends, setLoadingFriends] = useState<boolean>(true);
    const [loadingRequests, setLoadingRequests] = useState<boolean>(true);
    const [noMatches, setNoMatches] = useState<boolean>(false);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            fetchFriends();
            fetchFriendRequests();
        } else {
            console.error('User ID is not available.');
        }
    }, [userId]);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`/api/auth/friends`, {
                params: { userId }
            });
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoadingFriends(false);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(`/api/auth/friend-requests`, {
                params: { userId }
            });
            const mappedRequests = response.data.map((request: any) => ({
                id: request.id,
                username: request.senderUsername,
                email: '',
                profileImageUrl: undefined,
                requestStatus: 'pending',
            }));

            setFriendRequests(mappedRequests);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        } finally {
            setLoadingRequests(false);
        }
    };

    const handleSearch = async () => {
        if (searchTerm.trim() === '') {
            setSuggestions([]);
            setNoMatches(false);
            return;
        }

        try {
            const response = await axios.post(`/api/auth/search?searchTerm=${searchTerm}`, {
                userId: userId,
            });
            setSuggestions(response.data);
            setNoMatches(response.data.length === 0);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const sendFriendRequest = async (receiverId: number) => {
        try {
            await axios.post('/api/auth/sendRequest', {
                userId,
                receiverId,
            });

            setSuggestions(prevSuggestions =>
                prevSuggestions.map(friend =>
                    friend.id === receiverId ? { ...friend, requestStatus: 'pending' } : friend
                )
            );

            alert('Friend request sent!');
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.error);
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const acceptFriendRequest = async (requestId: number) => {
        try {
            await axios.post('/api/auth/acceptRequest', {
                userId,
                requestId,
            });

            alert('Friend request accepted!');
            await fetchFriends();
            await fetchFriendRequests();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const rejectFriendRequest = async (requestId: number) => {
        try {
            await axios.post('/api/auth/rejectRequest', {
                userId,
                requestId,
            });

            alert('Friend request rejected!');
            await fetchFriendRequests();
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const unfriend = async (friendId: number) => {
        try {
            const response = await fetch('/api/auth/unfriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, friendId })
            });

            if (!response.ok) {
                throw new Error('Error unfriending user');
            }

            const data = await response.json();
            alert(data.message);
            await fetchFriends(); // Refresh the friends list
        } catch (error) {
            console.error('Error unfriending:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 mt-24 text-white">
            <h1 className="text-3xl font-bold mb-4 '">Friends</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search for friends"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full"
                />
                <button
                    onClick={handleSearch}
                    className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                >
                    Search
                </button>

                {noMatches && <p className="mt-2 text-red-500">No matches found.</p>}

                <ul className="mt-2 border border-gray-300 rounded-lg">
                    {suggestions.map((friend) => (
                        <li key={friend.id} className="flex justify-between p-2 border-b border-gray-200">
                            <div className="flex items-center">
                                {friend.profileImageUrl ? (
                                    <img
                                        src={friend.profileImageUrl}
                                        alt={friend.username}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                                )}
                                <span>{friend.username}</span>
                            </div>
                            <button
                                onClick={() => sendFriendRequest(friend.id)}
                                disabled={friend.requestStatus === 'pending' || friend.requestStatus === 'sent'}
                                className={`px-3 py-1 rounded-lg ${friend.requestStatus === 'pending' ? 'bg-yellow-400' : friend.requestStatus === 'sent' ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white`}
                            >
                                {friend.requestStatus === 'pending' ? 'Pending' : friend.requestStatus === 'sent' ? 'Request Sent' : 'Send Request'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {loadingFriends ? (
                <p>Loading friends...</p>
            ) : (
                <>
                    <h2 className="text-2xl font-semibold mb-2">Your Friends</h2>
                    <ul className="border border-gray-300 rounded-lg">
                        {friends.map((friend) => (
                            <li key={friend.id} className="flex justify-between p-2 border-b border-gray-200">
                                <span>{friend.username} - {friend.email}</span>
                                <div>
                                    <Link href={`/user/chat?friendId=${friend.id}`} className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2">
                                        Chat
                                    </Link>
                                    <button
                                        onClick={() => unfriend(friend.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {loadingRequests ? (
                        <p>Loading friend requests...</p>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold mb-2 mt-4">Friend Requests</h2>
                            {friendRequests.length === 0 ? (
                                <p>No friend requests.</p>
                            ) : (
                                <ul className="border border-gray-300 rounded-lg">
                                    {friendRequests.map((request) => (
                                        <li key={request.id} className="flex justify-between p-2 border-b border-gray-200">
                                            <div className="flex items-center">
                                                {request.profileImageUrl ? (
                                                    <img
                                                        src={request.profileImageUrl}
                                                        alt={request.username}
                                                        className="w-8 h-8 rounded-full mr-2"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                                                )}
                                                <span>{request.username}</span>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => acceptFriendRequest(request.id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 mr-2"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => rejectFriendRequest(request.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default FriendPage;
