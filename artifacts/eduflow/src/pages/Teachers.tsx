import { useListTutors } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";

export default function Teachers() {
  const { data: tutors, isLoading } = useListTutors({
    query: {
      queryKey: ["tutors"]
    }
  });

  return (
    <div className="container py-10">
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Our Expert Teachers</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn from industry professionals who are passionate about sharing their knowledge and helping you succeed.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-[280px]">
              <CardContent className="flex flex-col items-center justify-center p-6 pt-8 space-y-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tutors && tutors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tutors.map((tutor) => (
            <Link key={tutor.id} href={`/teachers/${tutor.id}`}>
              <Card className="h-full hover:shadow-md transition-all group hover:border-primary/50 text-center">
                <CardContent className="pt-8 pb-4 flex flex-col items-center">
                  <Avatar className="w-24 h-24 mb-4 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarImage src={tutor.image || ""} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {tutor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {tutor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 min-h-[20px]">
                    {tutor.profession || "Instructor"}
                  </p>
                </CardContent>
                <CardFooter className="justify-center border-t bg-muted/10 py-3 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {tutor.playlistCount || 0} Courses
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground">No teachers found.</p>
        </div>
      )}
    </div>
  );
}
