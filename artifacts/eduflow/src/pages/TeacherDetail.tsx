import { useParams } from "wouter";
import { useGetTutor } from "@workspace/api-client-react";
import { CourseCard } from "@/components/shared/CourseCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, BookOpen } from "lucide-react";

export default function TeacherDetail() {
  const { id } = useParams();
  const tutorId = parseInt(id || "0", 10);

  const { data: tutor, isLoading } = useGetTutor(tutorId, {
    query: {
      enabled: !!tutorId,
      queryKey: ["tutor", tutorId]
    }
  });

  if (isLoading) {
    return (
      <div className="container py-10 space-y-10">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left bg-muted/30 p-8 rounded-3xl">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="container py-32 text-center">
        <h2 className="text-2xl font-bold mb-4">Teacher not found</h2>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-primary/5 py-12 md:py-20 border-b">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-lg">
              <AvatarImage src={tutor.image || ""} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {tutor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left space-y-4 max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{tutor.name}</h1>
              <p className="text-xl text-muted-foreground font-medium">
                {tutor.profession || "Instructor"}
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{tutor.playlistCount || 0} Courses published</span>
                </div>
                {tutor.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{tutor.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-16">
        <h2 className="text-2xl font-bold mb-8">Courses by {tutor.name}</h2>
        
        {tutor.playlists && tutor.playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tutor.playlists.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed rounded-xl bg-muted/10">
            <p className="text-muted-foreground">This teacher hasn't published any courses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
