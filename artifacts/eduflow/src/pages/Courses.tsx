import { useState, useEffect } from "react";
import { useListPlaylists } from "@workspace/api-client-react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Input } from "@/components/ui/input";
import { Search, BookOpen } from "lucide-react";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: playlists, isLoading } = useListPlaylists(
    { search: debouncedSearch || undefined },
    {
      query: {
        queryKey: ["playlists", "search", debouncedSearch],
      },
    }
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Browse Courses</h1>
          <p className="text-muted-foreground">Find the perfect course to advance your skills.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10 h-12 rounded-full bg-muted/50 border-muted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[320px] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : playlists && playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 border border-dashed rounded-2xl bg-muted/10">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
}
