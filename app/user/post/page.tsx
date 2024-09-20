"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Ensure environment variables are defined
const CLOUDINARY_UPLOAD_URL = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL as string;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET as string;

if (!CLOUDINARY_UPLOAD_URL) {
    console.error('Missing Cloudinary upload URL in environment variables');
}

if (!UPLOAD_PRESET) {
    console.error('Missing Cloudinary upload preset in environment variables');
}

const CreatePost = () => {
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let uploadedImageUrl: string | null = null;
        if (image && CLOUDINARY_UPLOAD_URL && UPLOAD_PRESET) {
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', UPLOAD_PRESET);

            try {
                const response = await fetch(CLOUDINARY_UPLOAD_URL, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Error uploading image');
                }

                const data = await response.json();
                uploadedImageUrl = data.secure_url;
                console.log('Uploaded Image URL:', uploadedImageUrl);
                
                if (!uploadedImageUrl) {
                    console.error('Unexpected response structure from Cloudinary:', data);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        }
        try {
            await axios.post('/api/auth/post', {
                content,
                authorId: localStorage.getItem('userId') || '',
                imageUrl: uploadedImageUrl,
            });

            console.log('Post created successfully');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create a Post</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                    rows={4}
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 file:cursor-pointer file:mr-2"
                />
            </div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Create Post
            </button>
        </form>
    );
};

export default CreatePost;
