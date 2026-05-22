import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetPlaylist, useCreatePlaylist, useUpdatePlaylist } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const playlistSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

type PlaylistFormValues = z.infer<typeof playlistSchema>;

export default function AdminPlaylistForm({ params }: { params?: { id: string } }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!params?.id;
  const playlistId = isEditing ? parseInt(params.id, 10) : 0;

  const { data: playlist, isLoading } = useGetPlaylist(playlistId, {
    query: {
      enabled: isEditing,
      queryKey: ["playlist", playlistId]
    }
  });

  const createMutation = useCreatePlaylist();
  const updateMutation = useUpdatePlaylist();

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (playlist && isEditing) {
      form.reset({
        title: playlist.title,
        description: playlist.description || "",
        image: playlist.image || "",
        status: (playlist.status as any) || "active",
      });
    }
  }, [playlist, isEditing, form]);

  const onSubmit = (data: PlaylistFormValues) => {
    // Convert empty string to undefined for optional fields
    const payload = {
      ...data,
      image: data.image === "" ? undefined : data.image
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: playlistId, data: payload },
        {
          onSuccess: () => {
            toast({ title: "Playlist updated successfully" });
            setLocation("/admin/playlists");
          },
          onError: () => toast({ title: "Failed to update playlist", variant: "destructive" })
        }
      );
    } else {
      createMutation.mutate(
        { data: payload as any },
        {
          onSuccess: () => {
            toast({ title: "Playlist created successfully" });
            setLocation("/admin/playlists");
          },
          onError: () => toast({ title: "Failed to create playlist", variant: "destructive" })
        }
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/playlists")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Playlist" : "Create New Playlist"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update your course details." : "Add a new course to your catalog."}
          </p>
        </div>
      </div>

      <div className="border rounded-xl bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Complete Web Development Bootcamp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What will students learn in this course?" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active (Visible)</SelectItem>
                      <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setLocation("/admin/playlists")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : (isEditing ? "Update Playlist" : "Create Playlist")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
