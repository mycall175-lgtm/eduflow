import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUpdateAdminProfile } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { getGetAdminMeQueryKey } from "@workspace/api-client-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  profession: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required to set a new password",
  path: ["currentPassword"]
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AdminProfile() {
  const { admin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const updateMutation = useUpdateAdminProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      profession: "",
      image: "",
      currentPassword: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (admin) {
      form.reset({
        name: admin.name,
        profession: admin.profession || "",
        image: admin.image || "",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [admin, form]);

  const onSubmit = (data: ProfileFormValues) => {
    // Only include password fields if they are filled out
    const payload: any = {
      name: data.name,
      profession: data.profession,
      image: data.image === "" ? undefined : data.image,
    };

    if (data.newPassword && data.currentPassword) {
      payload.currentPassword = data.currentPassword;
      payload.newPassword = data.newPassword;
    }

    updateMutation.mutate(
      { data: payload },
      {
        onSuccess: () => {
          toast({ title: "Profile updated successfully" });
          queryClient.invalidateQueries({ queryKey: getGetAdminMeQueryKey() });
          
          // Reset password fields
          form.setValue("currentPassword", "");
          form.setValue("newPassword", "");
        },
        onError: (error: any) => {
          toast({ 
            title: "Failed to update profile", 
            description: error?.response?.data?.error || "Unknown error occurred",
            variant: "destructive" 
          });
        }
      }
    );
  };

  if (!admin) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutor Profile</h1>
        <p className="text-muted-foreground">Manage your public information visible to students.</p>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <div className="bg-primary/5 p-6 border-b flex items-center gap-6">
          <Avatar className="w-24 h-24 border-2 border-background shadow-md">
            <AvatarImage src={admin.image || ""} />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {admin.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{admin.name}</h2>
            <p className="text-muted-foreground">{admin.email}</p>
          </div>
        </div>
        
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Public Information</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession / Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Software Engineer" {...field} />
                      </FormControl>
                      <FormDescription>This will appear under your name on the teachers page.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/avatar.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-6">
                <h3 className="font-semibold text-lg border-b pb-2">Change Password</h3>
                <p className="text-sm text-muted-foreground mb-4">Leave these blank if you don't want to change your password.</p>
                
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
