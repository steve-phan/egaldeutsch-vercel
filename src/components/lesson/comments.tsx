"use client";

import { useAuth } from "@/components/auth-provider";
import { useComments, Comment } from "@/hooks/use-comments";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CommentsProps {
  lessonId: string;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface CommentItemProps {
  comment: Comment;
}

function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="border-b pb-4 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{comment.user_name}</span>
        <span className="text-sm text-slate-500">
          {formatDate(comment.created_at)}
        </span>
      </div>
      <p className="text-slate-700">{comment.content}</p>
    </div>
  );
}

interface CommentFormProps {
  newComment: string;
  submitting: boolean;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

function CommentForm({ newComment, submitting, onCommentChange, onSubmit }: CommentFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-6">
      <textarea
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Write a comment..."
        className="w-full min-h-[80px] px-3 py-2 border rounded-md mb-2"
        disabled={submitting}
      />
      <Button type="submit" disabled={submitting || !newComment.trim()}>
        {submitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
}

export function Comments({ lessonId }: CommentsProps) {
  const { isAuthenticated } = useAuth();
  const {
    comments,
    newComment,
    loading,
    submitting,
    setNewComment,
    handleSubmitComment,
  } = useComments(lessonId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-slate-500">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {isAuthenticated ? (
          <CommentForm
            newComment={newComment}
            submitting={submitting}
            onCommentChange={setNewComment}
            onSubmit={handleSubmitComment}
          />
        ) : (
          <p className="text-sm text-slate-500 mt-4">
            Please log in to leave a comment.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
