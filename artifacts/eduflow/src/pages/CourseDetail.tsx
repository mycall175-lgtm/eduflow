import { useParams } from "wouter";
import { Link } from "wouter";
import { useGetPlaylist, useGetBookmarkStatus, useAddBookmark, useRemoveBookmark } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  PlayCircle, 
  Bookmark, 
  BookmarkCheck, 
  User, 
  Calendar,
  BookOpen
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const playlistId = parseInt(id || "0", 10);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: course, isLoading: isCourseLoading } = useGetPlaylist(playlistId, {
    query: {
      enabled: !!playlistId,
      queryKey: ["playlist", playlistId]
    }
  });

  const { data: bookmarkStatus, refetch: refetchBookmark } = useGetBookmarkStatus(playlistId, {
    query: {
      enabled: !!user && !!playlistId,
      queryKey: ["bookmark", playlistId]
    }
  });

  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const handleBookmarkToggle = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to bookmark courses.",
        variant: "destructive"
      });
      return;
    }

    if (bookmarkStatus?.bookmarked) {
      removeBookmark.mutate(playlistId, {
        onSuccess: () => {
          refetchBookmark();
          toast({ title: "Removed from bookmarks" });
        }
      });
    } else {
      addBookmark.mutate({ data: { playlistId } }, {
        onSuccess: () => {
          refetchBookmark();
          toast({ title: "Added to bookmarks" });
        }
      });
    }
  };

  if (isCourseLoading) {
    return (
      <div className="container py-10 space-y-8">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <Link href="/courses">
          <Button variant="link" className="mt-4">Back to courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Header */}
      <div className="bg-primary/5 py-12 md:py-16 border-b">
        <div className="container grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              {course.videos && course.videos.length > 0 ? (
                <Link href={`/watch/${course.videos[0].id}`}>
                  <Button size="lg" className="h-12 px-8 text-base">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
              ) : (
                <Button size="lg" disabled className="h-12 px-8 text-base">
                  No videos yet
                </Button>
              )}
              
              <Button 
                size="lg" 
                variant="outline" 
                className={`h-12 px-8 text-base ${bookmarkStatus?.bookmarked ? 'border-primary text-primary bg-primary/5' : ''}`}
                onClick={handleBookmarkToggle}
              >
                {bookmarkStatus?.bookmarked ? (
                  <><BookmarkCheck className="mr-2 h-5 w-5" /> Saved</>
                ) : (
                  <><Bookmark className="mr-2 h-5 w-5" /> Save Course</>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{course.tutorName || "Unknown Tutor"}</span>
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4 w-4" />
                <span className="font-medium">{course.videoCount || 0} Videos</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Updated {new Date(course.createdAt || "").toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl overflow-hidden shadow-xl border bg-background">
            <AspectRatio ratio={16/9}>
              {course.image ? (
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                  <BookOpen className="h-20 w-20 opacity-40" />
                </div>
              )}
            </AspectRatio>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container py-16">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <PlayCircle className="text-primary h-6 w-6" /> Course Content
          </h2>
          
          <div className="space-y-4">
            {course.videos && course.videos.length > 0 ? (
              course.videos.map((video, index) => (
                <Link key={video.id} href={`/watch/${video.id}`} className="block group">
                  <div className="flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors shadow-sm">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{video.title}</h4>
                      <p className="text-muted-foreground text-sm line-clamp-1 mt-1">{video.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center border border-dashed rounded-xl bg-muted/10">
                <p className="text-muted-foreground text-lg">No lessons have been added to this course yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
