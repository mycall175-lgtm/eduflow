import { useListContent, useDeleteContent, useListAdminPlaylists } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminContent() {
  const { toast } = useToast();
  
  const { data: content, isLoading, refetch } = useListContent({
    query: {
      queryKey: ["adminContent"]
    }
  });

  const { data: playlists } = useListAdminPlaylists({
    query: {
      queryKey: ["adminPlaylistsForContent"]
    }
  });

  const deleteMutation = useDeleteContent();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Video deleted successfully" });
        refetch();
      },
      onError: () => {
        toast({ title: "Failed to delete video", variant: "destructive" });
      }
    });
  };

  const getPlaylistName = (playlistId?: number) => {
    if (!playlistId || !playlists) return "Unknown";
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist ? playlist.title : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Videos</h1>
          <p className="text-muted-foreground">Manage your video content across all courses.</p>
        </div>
        <Link href="/admin/content/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Video
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Video Title</TableHead>
              <TableHead>Playlist</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : content && content.length > 0 ? (
              content.map((video) => (
                <TableRow key={video.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">{video.title}</div>
                    <div className="text-xs text-muted-foreground max-w-[250px] truncate">{video.description}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {getPlaylistName(video.playlistId)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={video.status === 'active' ? "default" : "secondary"}>
                      {video.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(video.createdAt || "").toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/watch/${video.id}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View publicly">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </Link>
                      <Link href={`/admin/content/${video.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the video "{video.title}".
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(video.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No videos found. Click "Add Video" to create your first lesson.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
