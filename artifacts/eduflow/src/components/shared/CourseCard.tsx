import { Link } from "wouter";
import { PlaylistSummary, Playlist } from "@workspace/api-client-react/src/generated/api.schemas";
import { BookOpen } from "lucide-react";

export function CourseCard({ course }: { course: PlaylistSummary | Playlist }) {
  const videoCount = 'videoCount' in course ? course.videoCount : undefined;
  const tutorName = 'tutorName' in course ? course.tutorName : undefined;

  return (
    <Link href={`/courses/${course.id}`} className="group block border rounded-lg overflow-hidden hover:border-primary transition-colors">
      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
        {course.image ? (
          <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <BookOpen className="h-8 w-8 text-muted-foreground/40" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {course.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{tutorName}</span>
          {videoCount !== undefined && <span>{videoCount} {videoCount === 1 ? 'video' : 'videos'}</span>}
        </div>
      </div>
    </Link>
  );
}
