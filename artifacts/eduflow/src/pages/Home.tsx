import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useListPlaylists } from "@workspace/api-client-react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { data: playlists, isLoading } = useListPlaylists({
    query: { queryKey: ["playlists", "home"] }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="container px-4 py-16 mx-auto max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Learn from expert tutors
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
          Browse video courses on EduFlow and grow your skills at your own pace.
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <div className="flex justify-center gap-3">
          <Link href="/courses">
            <Button>Browse Courses</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline">Join for Free</Button>
          </Link>
        </div>
      </div>

      {/* Latest Courses */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Latest Courses</h2>
          <Link href="/courses" className="text-sm text-primary hover:underline">View all</Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : playlists && playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground border rounded-lg">
            No courses available yet.
          </div>
        )}
      </div>
    </div>
  );
}
