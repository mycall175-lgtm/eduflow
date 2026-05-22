import { useState } from "react";
import { useLocation } from "wouter";
import { useListPlaylists } from "@workspace/api-client-react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") || "";
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const { data: results, isLoading } = useListPlaylists(
    { search: activeQuery || undefined },
    {
      query: {
        enabled: !!activeQuery,
        queryKey: ["playlists", "search", activeQuery]
      }
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveQuery(searchInput);
      // Update URL without navigation
      window.history.replaceState(null, "", `/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Search Courses</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="What do you want to learn?" 
              className="pl-10 h-14 rounded-xl text-lg bg-muted/30"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8 rounded-xl">
            Search
          </Button>
        </form>
      </div>

      {activeQuery && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            {isLoading ? "Searching..." : `Results for "${activeQuery}"`}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[320px] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : results && results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed rounded-xl bg-muted/10">
              <SearchIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try different keywords or check your spelling.</p>
            </div>
          )}
        </div>
      )}
      
      {!activeQuery && (
        <div className="text-center py-20">
          <SearchIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-muted-foreground">Start typing to search</h3>
        </div>
      )}
    </div>
  );
}
