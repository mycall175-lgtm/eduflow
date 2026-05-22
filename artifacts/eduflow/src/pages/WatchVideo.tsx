import { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetContent, 
  useGetLikeStatus, 
  useToggleLike, 
  useListComments, 
  useAddComment,
  useGetPlaylist,
  useGetBookmarkStatus,
  useAddBookmark,
  useRemoveBookmark
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp, MessageSquare, PlayCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { format } from "date-fns";

export default function WatchVideo() {
  const { id } = useParams();
  const videoId = parseInt(id || "0", 10);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data: video, isLoading: isVideoLoading } = useGetContent(videoId, {
    query: {
      enabled: !!videoId,
      queryKey: ["content", videoId]
    }
  });

  const { data: playlist } = useGetPlaylist(video?.playlistId || 0, {
    query: {
      enabled: !!video?.playlistId,
      queryKey: ["playlist", video?.playlistId]
    }
  });

  const { data: likeStatus, refetch: refetchLikeStatus } = useGetLikeStatus(videoId, {
    query: {
      enabled: !!videoId,
      queryKey: ["like", videoId]
    }
  });

  const { data: comments, refetch: refetchComments } = useListComments(videoId, {
    query: {
      enabled: !!videoId,
      queryKey: ["comments", videoId]
    }
  });

  const { data: bookmarkStatus, refetch: refetchBookmark } = useGetBookmarkStatus(
    video?.playlistId || 0,
    { query: { enabled: !!video?.playlistId && !!user, queryKey: ["bookmark", video?.playlistId] } }
  );

  const toggleLike = useToggleLike();
  const addComment = useAddComment();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to like videos.",
        variant: "destructive"
      });
      return;
    }

    toggleLike.mutate(
      { data: { contentId: videoId } },
      {
        onSuccess: () => {
          refetchLikeStatus();
        }
      }
    );
  };

  const handleBookmark = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to bookmark courses.", variant: "destructive" });
      return;
    }
    if (!video?.playlistId) return;
    if (bookmarkStatus?.bookmarked) {
      removeBookmark.mutate({ playlistId: video.playlistId }, { onSuccess: () => refetchBookmark() });
    } else {
      addBookmark.mutate({ data: { playlistId: video.playlistId } }, { onSuccess: () => { refetchBookmark(); toast({ title: "Bookmarked!", description: "Course saved to your bookmarks." }); } });
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to comment.",
        variant: "destructive"
      });
      return;
    }

    if (!commentText.trim()) return;

    addComment.mutate(
      { contentId: videoId, data: { comment: commentText } },
      {
        onSuccess: () => {
          setCommentText("");
          refetchComments();
          toast({ title: "Comment added" });
        }
      }
    );
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

  if (isVideoLoading) {
    return (
      <div className="container py-6 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Video not found</h2>
        <Link href="/courses">
          <Button>Browse Courses</Button>
        </Link>
      </div>
    );
  }

  const isYouTube = video.videoUrl?.includes("youtube.com") || video.videoUrl?.includes("youtu.be");

  return (
    <div className="container py-6 grid lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        {/* Video Player */}
        <div className="rounded-xl overflow-hidden bg-black aspect-video shadow-lg ring-1 ring-border">
          {isYouTube ? (
            <iframe
              src={getEmbedUrl(video.videoUrl)}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={video.videoUrl}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Video Details */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border bg-muted">
                <AvatarFallback>{video.tutorName?.charAt(0) || "T"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none">{video.tutorName || "Unknown Tutor"}</p>
                <p className="text-sm text-muted-foreground mt-1">Instructor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={likeStatus?.liked ? "default" : "secondary"} 
                size="sm"
                className="gap-2 rounded-full"
                onClick={handleLike}
              >
                <ThumbsUp className={`h-4 w-4 ${likeStatus?.liked ? "fill-current" : ""}`} />
                {likeStatus?.count || 0} Likes
              </Button>
              <Button
                variant={bookmarkStatus?.bookmarked ? "default" : "secondary"}
                size="sm"
                className="gap-2 rounded-full"
                onClick={handleBookmark}
              >
                {bookmarkStatus?.bookmarked
                  ? <BookmarkCheck className="h-4 w-4" />
                  : <Bookmark className="h-4 w-4" />}
                {bookmarkStatus?.bookmarked ? "Bookmarked" : "Bookmark"}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-xl p-4 md:p-6 text-sm md:text-base leading-relaxed">
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="pt-6">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5" /> 
            {comments?.length || 0} Comments
          </h3>
          
          {user ? (
            <form onSubmit={handleSubmitComment} className="flex gap-4 mb-8">
              <Avatar className="h-10 w-10 border bg-muted shrink-0">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea 
                  placeholder="Add a comment..."
                  className="resize-none min-h-[80px]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={!commentText.trim()}>Comment</Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-muted p-4 rounded-xl mb-8 flex items-center justify-between">
              <p className="text-muted-foreground">Log in to add a comment</p>
              <Link href="/login">
                <Button variant="outline" size="sm">Log in</Button>
              </Link>
            </div>
          )}
          
          <div className="space-y-6">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10 border bg-muted shrink-0">
                    <AvatarFallback>{comment.userName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold">{comment.userName || "Unknown User"}</span>
                      <span className="text-xs text-muted-foreground">
                        {comment.createdAt ? format(new Date(comment.createdAt), 'MMM d, yyyy') : ''}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8 border border-dashed rounded-xl">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="lg:col-span-1 border rounded-xl bg-card sticky top-24 overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold text-lg line-clamp-1">{playlist?.title || video.playlistTitle || "Course Playlist"}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {video.tutorName || "Unknown Tutor"}
          </p>
        </div>
        
        <div className="overflow-y-auto p-2 space-y-1">
          {playlist?.videos ? (
            playlist.videos.map((v, idx) => {
              const isCurrent = v.id === videoId;
              return (
                <Link key={v.id} href={`/watch/${v.id}`} className="block">
                  <div className={`flex gap-3 p-3 rounded-lg transition-colors ${
                    isCurrent 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted"
                  }`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {isCurrent ? <PlayCircle className="h-4 w-4" /> : <span className="text-xs w-4 inline-block text-center">{idx + 1}</span>}
                    </div>
                    <div>
                      <p className={`text-sm line-clamp-2 ${isCurrent ? "font-semibold" : "font-medium"}`}>
                        {v.title}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading playlist content...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
