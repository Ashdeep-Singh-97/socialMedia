// components/CreatePost.tsx
"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [content, setContent] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [authorId, setAuthorId] = useState<number | null>(null); // Initialize as null

  // Fetch the authorId from localStorage when the component mounts
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Changed from 'username' to 'userId'
    if (userId) {
      setAuthorId(Number(userId)); // Convert to number
    } else {
      console.error('No userId found in local storage');
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (authorId === null) {
      console.error('No authorId found');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('authorId', String(authorId)); // Use authorId from localStorage
    if (image) formData.append('image', image);

    try {
      const response = await axios.post('/api/auth/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Post created:', response.data);
      // Reset form or show success message
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error creating post:', error);
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
