"use client";

import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
}

export default function ProfilePage() {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // State to hold user ID

    useEffect(() => {
        // This will run only on the client side
        if (typeof window !== 'undefined') {
            const storedUserId = localStorage.getItem('userId');
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            if (userId) {
                try {
                    // Fetch user data including profile image
                    const response = await axios.get(`/api/auth/profile?userId=${userId}`);
                    const userData = response.data;

                    // Set profile image from user data or null
                    setProfileImage(userData.profileImageUrl || null);
                    setPosts(userData.posts || []);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }
        };

        fetchPosts();
    }, [userId]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (imageFile) {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET || '');

            try {
                const response = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL || '', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Error uploading image');
                }

                const data = await response.json();
                const imageUrl = data.secure_url;
                setProfileImage(imageUrl);
                
                if (userId) { // Check if userId is available
                    await axios.put(`/api/auth/profile`, { profileImageUrl: imageUrl }, {
                        headers: {
                            userId // Send the user ID in headers
                        }
                    });
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-24">
            <h2 className="text-2xl font-semibold mb-4">Profile Page</h2>

            <div className="flex items-center mb-6">
                {profileImage ? (
                    <Image
                        src={profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover mr-4"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 mr-4"></div>
                )}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block text-sm text-gray-500"
                    />
                    <button
                        onClick={handleImageUpload}
                        className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Upload Image
                    </button>
                </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">Your Posts</h3>
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg shadow-sm">
                        <p>{post.content}</p>
                        {post.imageUrl && (
                            <Image
                                src={post.imageUrl}
                                alt="Post"
                                className="mt-2 w-full h-auto rounded-md"
                            />
                        )}
                        <p className="text-gray-500 text-sm mt-2">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                ))}
                {posts.length === 0 && <p>No posts found.</p>}
            </div>
        </div>
    );
}
