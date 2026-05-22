import { useListAllComments, useDeleteComment } from "@workspace/api-client-react";
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
import { Trash2, ExternalLink, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminComments() {
  const { toast } = useToast();
  
  const { data: comments, isLoading, refetch } = useListAllComments({
    query: {
      queryKey: ["adminAllComments"]
    }
  });

  const deleteMutation = useDeleteComment();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: "Comment deleted successfully" });
        refetch();
      },
      onError: () => {
        toast({ title: "Failed to delete comment", variant: "destructive" });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
        <p className="text-muted-foreground">Manage student comments across your videos.</p>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Student</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead className="w-[200px]">Video</TableHead>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : comments && comments.length > 0 ? (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell className="font-medium text-sm">
                    {comment.userName || "Unknown Student"}
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-sm truncate" title={comment.comment}>
                      {comment.comment}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-primary group">
                      <Link href={`/watch/${comment.contentId}`} className="hover:underline truncate" title={comment.contentTitle || "Unknown Video"}>
                        {comment.contentTitle || "Unknown Video"}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt || "").toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment from {comment.userName}?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(comment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  No comments have been posted on your videos yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
