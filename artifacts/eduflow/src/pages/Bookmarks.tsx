import { useListBookmarks } from "@workspace/api-client-react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Bookmark, BookOpen } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Bookmarks() {
  const { data: bookmarks, isLoading } = useListBookmarks({
    query: {
      queryKey: ["bookmarks"]
    }
  });

  return (
    <div className="container py-10">
      <div className="mb-10 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Bookmark className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Courses</h1>
        </div>
        <p className="text-muted-foreground">
          Continue learning where you left off.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[320px] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((bookmark) => (
            <CourseCard 
              key={bookmark.playlistId} 
              course={{
                id: bookmark.playlistId,
                title: bookmark.title,
                description: bookmark.description || "",
                image: bookmark.image,
                status: "active",
                tutorName: bookmark.tutorName,
                videoCount: bookmark.videoCount,
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 max-w-md mx-auto space-y-6">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
            <BookOpen className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold">No saved courses yet</h3>
          <p className="text-muted-foreground">
            Explore our catalog and save courses you're interested in to view them later.
          </p>
          <Link href="/courses">
            <Button size="lg" className="w-full mt-4">Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
