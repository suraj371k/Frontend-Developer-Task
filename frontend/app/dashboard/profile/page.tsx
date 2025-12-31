"use client";
import { DashboardHeader } from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { UpdateProfileData, useUserStore } from "@/store/userStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, updateProfile, loading, error, deleteAccount } = useUserStore();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("User not found");
      return;
    }
    await updateProfile(formData, user._id);
    const currentError = useUserStore.getState().error;
    if (currentError) {
      toast.error(currentError);
    } else {
      toast.success("Profile updated successfully");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "first-name" ? "firstName" : id === "last-name" ? "lastName" : "email"]: value,
    }));
  };

  const handleDeleteAccount = async () => {
    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    await deleteAccount(user._id);
    const currentError = useUserStore.getState().error;
    
    if (currentError) {
      toast.error(currentError);
      setDeleteDialogOpen(false);
    } else {
      toast.success("Account deleted successfully");
      setDeleteDialogOpen(false);
      router.push("/login");
    }
  };

  function avater(f: string, l: string) {
    return f
      .at(0)
      ?.toUpperCase()
      .concat(l.at(0)?.toUpperCase() ?? "");
  }

  return (
    <>
      <DashboardHeader title="Profile" />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h2>
            <p className="text-muted-foreground">
              Manage your account information and preferences.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-muted ring-offset-background transition-opacity hover:opacity-90">
                    {/* <AvatarImage
                      src="/diverse-user-avatars.png"
                      alt="User avatar"
                    /> */}
                    <AvatarFallback className="text-2xl">
                      {avater(user?.firstName ?? "", user?.lastName ?? "")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Separator />
              <form id="profile-form" onSubmit={handleSubmit}>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" form="profile-form" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </CardContent>
            <CardFooter className="border-t pt-6">
              {isMounted ? (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={loading}>
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button variant="destructive" disabled={loading}>
                  Delete Account
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </main>
    </>
  );
}
