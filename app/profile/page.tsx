"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { authApi } from "@/features/auth/services/api";
import { setUser } from "@/features/auth/slices/auth.slice";
import { useToast } from "@/shared/components/ToastProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { User } from "@/features/auth/types/auth.definitions";

const profileSchema = z.object({
  firstName: z.string().trim().optional().or(z.literal("")),
  lastName: z.string().trim().optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  confirmPassword: z.string().trim().optional().or(z.literal("")),
}).refine(
  (data) => {
    // If password is provided, it must be at least 8 characters
    if (data.password && data.password.trim().length > 0) {
      return data.password.trim().length >= 8;
    }
    return true;
  },
  {
    message: "Password must be at least 8 characters",
    path: ["password"],
  }
).refine(
  (data) => {
    // If password is provided, confirmPassword must match
    if (data.password && data.password.trim().length > 0) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const initialized = useAppSelector((state) => state.auth.initialized);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  // Fetch fresh user data if Redux user has empty values
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user exists but has empty email (indicating incomplete data)
      if (initialized && user && user._id && (!user.email || !user.email.trim())) {
        try {
          const fetchedUser = await authApi.me();
          if (fetchedUser && fetchedUser.email && fetchedUser.email.trim()) {
            dispatch(setUser(fetchedUser));
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    if (initialized) {
      fetchUserData();
    }
  }, [initialized, user, dispatch]);

  // Update form values when user data is loaded or changes
  useEffect(() => {
    if (user && initialized && user._id && user.email && user.email.trim()) {
      // Only reset form if user has valid email (required field)
      const userData: ProfileFormData = {
        firstName: (user.firstName && typeof user.firstName === 'string' && user.firstName.trim().length > 0) 
          ? user.firstName.trim() 
          : "",
        lastName: (user.lastName && typeof user.lastName === 'string' && user.lastName.trim().length > 0) 
          ? user.lastName.trim() 
          : "",
        email: user.email.trim(),
        password: "",
        confirmPassword: "",
      };

      // Only reset form if we have at least an email
      if (userData.email) {
        form.reset(userData);
      }
      
      // Set avatar preview
      if (user?.avatar?.url) {
        setAvatarPreview(user.avatar.url);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user, initialized, form]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError("Please select a valid image file");
        return;
      }

      setSelectedAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);

      // Build payload
      const updatePayload: {
        firstName: string;
        lastName: string;
        email: string;
        password?: string;
        avatar?: File;
      } = {
        firstName: data.firstName?.trim() || "",
        lastName: data.lastName?.trim() || "",
        email: data.email?.trim() || "",
      };

      // Only include password if provided and meets requirements
      if (data.password?.trim() && data.password.trim().length >= 8) {
        updatePayload.password = data.password.trim();
      }

      // Include avatar if selected
      if (selectedAvatar) {
        updatePayload.avatar = selectedAvatar;
      }

      // Check if there's anything meaningful to update
      const hasChanges =
        updatePayload.firstName !== (user?.firstName || "") ||
        updatePayload.lastName !== (user?.lastName || "") ||
        updatePayload.email !== (user?.email || "") ||
        updatePayload.password ||
        selectedAvatar;

      if (!hasChanges) {
        showError("No changes to save");
        setIsLoading(false);
        return;
      }

      if (!user) {
        showError("User data not available. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      const updatedUser = await authApi.updateUser(updatePayload, user);
      dispatch(setUser(updatedUser));
      
      if (updatedUser.avatar?.url) {
        setAvatarPreview(updatedUser.avatar.url);
      }

      // Clear selected avatar after successful update
      setSelectedAvatar(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      success("Profile updated successfully!");
      
      // Reset form with updated values
      form.reset({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to update profile";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"
    : "U";

  // Show loading state if user data is not initialized yet
  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#112032] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="bg-white dark:bg-[#112032]">
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-12 gap-3">
                <Loader2 className="size-6 animate-spin text-blue-500" />
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    router.push("/auth/login");
    return null;
  }

  const passwordValue = form.watch("password");

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#112032] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="bg-white dark:bg-[#112032]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b">
                  <div className="relative group">
                    <Avatar className="size-32 border-4 border-blue-500">
                      <AvatarImage 
                        src={avatarPreview || "/assets/profile.png"} 
                        alt={user.firstName || "User"} 
                      />
                      <AvatarFallback className="text-2xl bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 size-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label="Change profile picture"
                    >
                      <Camera className="size-5 text-white" />
                    </button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      ref={fileInputRef}
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">
                      {(user.firstName || user.lastName) 
                        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                        : user.email?.split("@")[0] || "User"}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user.email || ""}</p>
                  </div>
                  {selectedAvatar && (
                    <p className="text-xs text-blue-500">New avatar selected - click Save to update</p>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            className="mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            className="mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Leave blank to keep current"
                            className="mt-1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground mt-1">
                          Must be at least 8 characters if provided
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="mt-1"
                            {...field}
                            disabled={!passwordValue || passwordValue.trim().length === 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="bg-blue-500 hover:bg-blue-600 min-w-[120px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="size-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}