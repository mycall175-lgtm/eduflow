import { useListAdminPlaylists, useDeletePlaylist } from "@workspace/api-client-react";
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

export default function AdminPlaylists() {
  const { toast } = useToast();
  const { data: playlists, isLoading, refetch } = useListAdminPlaylists({
    query: {
      queryKey: ["adminPlaylists"]
    }
  });

  const deleteMutation = useDeletePlaylist();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Playlist deleted successfully" });
        refetch();
      },
      onError: () => {
        toast({ title: "Failed to delete playlist", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Playlists</h1>
          <p className="text-muted-foreground">Manage your courses and playlists.</p>
        </div>
        <Link href="/admin/playlists/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Playlist
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Videos</TableHead>
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
            ) : playlists && playlists.length > 0 ? (
              playlists.map((playlist) => (
                <TableRow key={playlist.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {playlist.image ? (
                        <img src={playlist.image} alt="" className="w-10 h-10 rounded object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                          {playlist.title.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{playlist.title}</div>
                        <div className="text-xs text-muted-foreground max-w-[200px] truncate">{playlist.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{playlist.videoCount || 0}</TableCell>
                  <TableCell>
                    <Badge variant={playlist.status === 'active' ? "default" : "secondary"}>
                      {playlist.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(playlist.createdAt || "").toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/courses/${playlist.id}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View publicly">
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </Link>
                      <Link href={`/admin/playlists/${playlist.id}/edit`}>
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
                              This will permanently delete the playlist "{playlist.title}" and all its videos.
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(playlist.id)}
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
                  No playlists found. Create your first one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
