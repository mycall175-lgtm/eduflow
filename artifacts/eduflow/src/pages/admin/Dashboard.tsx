import { useGetAdminStats, useListAllComments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, Video, MessageSquare, ThumbsUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useGetAdminStats({
    query: {
      queryKey: ["adminStats"]
    }
  });

  const { data: recentComments, isLoading: commentsLoading } = useListAllComments({
    query: {
      queryKey: ["adminRecentComments"]
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform performance.</p>
      </div>

      {statsLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Playlists</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlaylists || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVideos || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments || 0}</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg bg-muted/10">Failed to load statistics.</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {commentsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentComments && recentComments.length > 0 ? (
              <div className="space-y-6">
                {recentComments.slice(0, 5).map((comment) => (
                  <div key={comment.id} className="flex flex-col gap-1 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{comment.userName || "Student"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt || "").toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-primary line-clamp-1">
                      On: {comment.contentTitle || "A video"}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{comment.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent comments
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
