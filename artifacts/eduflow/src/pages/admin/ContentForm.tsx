import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetContent, useCreateContent, useUpdateContent, useListAdminPlaylists } from "@workspace/api-client-react";
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

const contentSchema = z.object({
  playlistId: z.coerce.number().min(1, "Please select a playlist"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  videoUrl: z.string().url("Must be a valid URL (e.g., YouTube link)"),
  status: z.enum(["active", "inactive"]),
});

type ContentFormValues = z.infer<typeof contentSchema>;

export default function AdminContentForm({ params }: { params?: { id: string } }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isEditing = !!params?.id;
  const contentId = isEditing ? parseInt(params.id, 10) : 0;

  const { data: playlists } = useListAdminPlaylists({
    query: {
      queryKey: ["adminPlaylistsForForm"]
    }
  });

  const { data: content, isLoading } = useGetContent(contentId, {
    query: {
      enabled: isEditing,
      queryKey: ["content", contentId]
    }
  });

  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();

  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      playlistId: 0,
      title: "",
      description: "",
      videoUrl: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (content && isEditing) {
      form.reset({
        playlistId: content.playlistId || 0,
        title: content.title,
        description: content.description || "",
        videoUrl: content.videoUrl || "",
        status: (content.status as any) || "active",
      });
    }
  }, [content, isEditing, form]);

  const onSubmit = (data: ContentFormValues) => {
    if (isEditing) {
      updateMutation.mutate(
        { id: contentId, data },
        {
          onSuccess: () => {
            toast({ title: "Video updated successfully" });
            setLocation("/admin/content");
          },
          onError: () => toast({ title: "Failed to update video", variant: "destructive" })
        }
      );
    } else {
      createMutation.mutate(
        { data: data as any },
        {
          onSuccess: () => {
            toast({ title: "Video created successfully" });
            setLocation("/admin/content");
          },
          onError: () => toast({ title: "Failed to create video", variant: "destructive" })
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
        <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/content")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit Video" : "Add New Video"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? "Update your video lesson details." : "Add a new video lesson to a course."}
          </p>
        </div>
      </div>

      <div className="border rounded-xl bg-card p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="playlistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course / Playlist</FormLabel>
                  <Select 
                    onValueChange={(val) => field.onChange(parseInt(val, 10))} 
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {playlists?.map(p => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Introduction to HTML" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL (YouTube link recommended)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
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
                      placeholder="Details about this lesson..." 
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
                onClick={() => setLocation("/admin/content")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : (isEditing ? "Update Video" : "Add Video")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
