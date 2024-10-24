import React, { useEffect, useState } from 'react';
import CommentsPanel from './CommentsPanel'; // Ensure you import the CommentsPanel component
import Image from 'next/image';

interface Post {
  id: number;
  author: {
    username: string;
  };
  content: string;
  imageUrl?: string;
  likes: { id: number; userId: number }[];
  comments: { id: number; content: string; authorId: number }[];
}

interface PostListProps {
  userEmail: string | null;
}

const PostList: React.FC<PostListProps> = ({ userEmail }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null); // For the comments panel

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/auth/posts');
        if (!response.ok) {
          throw new Error("Failed to fetch posts.");
        }
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      const response = await fetch(`/api/auth/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }), // Send the user's email
      });
      if (!response.ok) {
        throw new Error("Failed to like the post.");
      }
      // Optionally update the local state after liking
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleComment = async (postId: number) => {
    const comment = prompt("Enter your comment:");
    if (!comment) return; // Exit if no comment was provided

    try {
      const response = await fetch(`/api/auth/posts/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, content: comment }), // Send email and comment
      });
      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to comment on the post.");
      }
      // Optionally update the local state after commenting
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const handleOpenComments = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {posts.length === 0 ? (
        <div>You are all caught up</div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg p-4 w-100 hover:shadow-lg transition-shadow duration-200">
            <h2 className="text-lg font-semibold">{post.author?.username}</h2>
            <p className="mt-2 text-gray-700">{post.content}</p>
            {post.imageUrl && <Image src={post.imageUrl} alt="Post" className="mt-2 rounded-md" width={800} height={300} />}
            <div className="mt-4 flex justify-between text-sm text-gray-500">
              <span>{post.likes.length} Likes</span>
              <span>{post.comments.length} Comments</span>
            </div>
            {userEmail ? (
              <div className="mt-4">
                <button 
                  className="text-indigo-600 hover:underline mr-2"
                  onClick={() => handleLike(post.id)}
                >
                  Like
                </button>
                <button 
                  className="text-indigo-600 hover:underline mr-2"
                  onClick={() => handleComment(post.id)}
                >
                  Comment
                </button>
                <button 
                  className="text-indigo-600 hover:underline"
                  onClick={() => handleOpenComments(post.id)}
                >
                  View Comments
                </button>
              </div>
            ) : (
              <p className="mt-2 text-gray-500">Please sign in to interact with this post.</p>
            )}
          </div>
        ))
      )}
      {selectedPostId && (
        <CommentsPanel postId={selectedPostId} onClose={handleCloseComments} />
      )}
    </div>
  );
};

export default PostList;
