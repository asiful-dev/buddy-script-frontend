"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Image as ImageIcon, Video, Calendar, FileText, Send, Globe, Lock } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { feedApi } from "../services/api";
import { addPost, setLoading, setError } from "../slices/feed.slice";
import { useToast } from "@/shared/components/ToastProvider";
import type { CreatePostPayload } from "../types/feed.definitions";

const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  visibility: z.enum(["public", "private"]).optional(),
});

type CreatePostFormData = z.infer<typeof createPostSchema>;

export default function CreatePostBox() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<"public" | "private">("public");
  const [formData, setFormData] = useState<CreatePostFormData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { success, error: showError } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      visibility: "public",
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      showError('Please select a valid image file (JPG, PNG, GIF, or WebP).');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showError('Image size must be less than 5MB. Please choose a smaller file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Set the file and create preview
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.onerror = () => {
      showError('Failed to read the image file. Please try another file.');
      setSelectedImage(null);
      setImagePreview(null);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CreatePostFormData) => {
    setFormData(data);
    setShowVisibilityModal(true);
  };

  const handleVisibilitySelect = async (visibility: "public" | "private") => {
    if (!formData) return;
    
    setSelectedVisibility(visibility);
    setShowVisibilityModal(false);
    setIsSubmitting(true);
    
    try {
      if (selectedImage) {
        const maxSize = 5 * 1024 * 1024;
        if (selectedImage.size > maxSize) {
          showError('Image size must be less than 5MB. Please choose a smaller file.');
          setIsSubmitting(false);
          return;
        }
      }

      const payload: CreatePostPayload = {
        content: formData.content.trim(),
        visibility: visibility,
        image: selectedImage || undefined,
      };

      const newPost = await feedApi.createPost(payload);
      
      dispatch(addPost(newPost));
      success("Post created successfully!");
      
      reset();
      removeImage();
      setFormData(null);
      setSelectedVisibility("public");
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create post";
      dispatch(setError(errorMessage));
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <Card className="bg-card dark:bg-[#112032] rounded-none shadow-none">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* User Avatar and Text Area */}
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/assests/profile.png" alt={user?.firstName} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                {...register("content")}
                placeholder="Write something..."
                className="min-h-[80px] resize-none bg-muted/50 dark:bg-[#112032]"
              />
              {errors.content && (
                <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded-lg max-h-96 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                ×
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t bg-[#1890ff0d]">
            <div className="flex items-center gap-2 [&>button]:">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                <ImageIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Photo</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>

              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Video className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Video</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Calendar className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Event</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <FileText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm font-medium">Article</span>
              </button>
            </div>

            <div className="pb-2 pr-2">
              <Button type="submit" disabled={isSubmitting} size="lg" className="bg-blue-500 text-white">
                <Send className="h-4 w-4 mr-2" strokeWidth={1.5} />
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </div>
        </form>

        <Dialog 
          open={showVisibilityModal} 
          onOpenChange={(open) => {
            setShowVisibilityModal(open);
            if (!open && !isSubmitting) {
              setFormData(null);
            }
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Choose Post Visibility</DialogTitle>
              <DialogDescription>
                Select who can see this post
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 py-4">
              <Button
                onClick={() => handleVisibilitySelect("public")}
                variant={selectedVisibility === "public" ? "default" : "outline"}
                className={`w-full justify-start h-auto py-4 ${
                  selectedVisibility === "public"
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-full ${
                    selectedVisibility === "public"
                      ? "bg-blue-500 dark:bg-blue-600"
                      : "bg-blue-100 dark:bg-blue-900"
                  }`}>
                    <Globe className={`h-5 w-5 ${
                      selectedVisibility === "public"
                        ? "text-white"
                        : "text-blue-600 dark:text-blue-400"
                    }`} />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className={`font-semibold ${
                      selectedVisibility === "public"
                        ? "text-white dark:text-gray-900"
                        : "text-gray-900 dark:text-white"
                    }`}>Public</span>
                    <span className={`text-sm ${
                      selectedVisibility === "public"
                        ? "text-gray-300 dark:text-gray-600"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>Anyone can see this post</span>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleVisibilitySelect("private")}
                variant={selectedVisibility === "private" ? "default" : "outline"}
                className={`w-full justify-start h-auto py-4 ${
                  selectedVisibility === "private"
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                disabled={isSubmitting}
              >
                <div className="flex items-center gap-3 w-full">
                  <div className={`p-2 rounded-full ${
                    selectedVisibility === "private"
                      ? "bg-gray-500 dark:bg-gray-600"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}>
                    <Lock className={`h-5 w-5 ${
                      selectedVisibility === "private"
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }`} />
                  </div>
                  <div className="flex flex-col items-start flex-1">
                    <span className={`font-semibold ${
                      selectedVisibility === "private"
                        ? "text-white dark:text-gray-900"
                        : "text-gray-900 dark:text-white"
                    }`}>Private</span>
                    <span className={`text-sm ${
                      selectedVisibility === "private"
                        ? "text-gray-300 dark:text-gray-600"
                        : "text-gray-600 dark:text-gray-400"
                    }`}>Only you can see this post</span>
                  </div>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
