import React, { useEffect, useState } from 'react';

// Define the structure of a comment
interface Comment {
  id: number;
  content: string;
  author: {
    username: string;
  };
}

interface CommentsPanelProps {
  postId: number;
  onClose: () => void;
}

const CommentsPanel: React.FC<CommentsPanelProps> = ({ postId, onClose }) => {
  // Use the Comment type for state
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/auth/posts/${postId}/comments`);
      const data = await response.json();
      setComments(data);
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
      <button onClick={onClose} className="text-red-500">Close</button>
      <h2 className="text-lg font-bold mt-2">Comments</h2>
      <div className="space-y-2 mt-2">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="p-2 bg-white rounded-lg shadow">
              <strong>{comment.author.username}</strong>: {comment.content}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default CommentsPanel;
