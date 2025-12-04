import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";

export interface Comment {
  id: string;
  lesson_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface UseCommentsResult {
  comments: Comment[];
  newComment: string;
  loading: boolean;
  submitting: boolean;
  setNewComment: (comment: string) => void;
  handleSubmitComment: (e: React.FormEvent) => Promise<void>;
}

export function useComments(lessonId: string): UseCommentsResult {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments?lesson_id=${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [lessonId]);

  const handleSubmitComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson_id: lessonId,
          content: newComment,
        }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments(prev => [...prev, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setSubmitting(false);
    }
  }, [newComment, lessonId, isAuthenticated]);

  return {
    comments,
    newComment,
    loading,
    submitting,
    setNewComment,
    handleSubmitComment,
  };
}
