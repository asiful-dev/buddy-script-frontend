"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Image as ImageIcon, X, Globe, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/shared/libs/redux.config";
import { feedApi } from "../services/api";
import { updatePost } from "../slices/feed.slice";
import { useToast } from "@/shared/components/ToastProvider";
import type { Post, CreatePostPayload } from "../types/feed.definitions";
import Image from "next/image";

const editPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  visibility: z.enum(["public", "private"]).optional(),
});

type EditPostFormData = z.infer<typeof editPostSchema>;

interface EditPostModalProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditPostModal({ post, open, onOpenChange }: EditPostModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { success, error: showError } = useToast();
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [selectedVisibility, setSelectedVisibility] = useState<"public" | "private">(post.visibility || "public");
  const [formData, setFormData] = useState<EditPostFormData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditPostFormData>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      content: post.content || "",
      visibility: post.visibility || "public",
    },
  });

  // Initialize form when modal opens or post changes
  useEffect(() => {
    if (open && post) {
      reset({
        content: post.content || "",
        visibility: post.visibility || "public",
      });
      setSelectedVisibility(post.visibility || "public");
      setImagePreview(post.image?.url || null);
      setSelectedImage(null);
      setFormData(null);
    }
  }, [open, post, reset]);

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
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('Image size must be less than 5MB. Please choose a smaller file.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(post.image?.url || null); // Reset to original image
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Show remove button only if a new image is selected (not the original)
  const showRemoveButton = selectedImage !== null;

  const onSubmit = async (data: EditPostFormData) => {
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

      const payload: Partial<CreatePostPayload> = {
        content: formData.content.trim(),
        visibility: visibility,
        image: selectedImage || undefined,
      };

      const updatedPost = await feedApi.updatePost(post._id, payload);
      
      dispatch(updatePost(updatedPost));
      success("Post updated successfully!");
      
      onOpenChange(false);
      reset();
      setSelectedImage(null);
      setImagePreview(null);
      setFormData(null);
      setSelectedVisibility("public");
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to update post";
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const currentImage = imagePreview || post.image?.url || null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#112032]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Post</DialogTitle>
            <DialogDescription>
              Update your post content, image, or visibility settings
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* User Avatar and Text Area */}
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar?.url || "/assests/profile.png"} alt={user?.firstName} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  {...register("content")}
                  placeholder="Write something..."
                  className="min-h-[120px] resize-none bg-gray-50 dark:bg-[#1A1F2E] border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                />
                {errors.content && (
                  <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>
                )}
              </div>
            </div>

            {/* Image Preview */}
            {currentImage && (
              <div className="relative">
                <Image
                  src={currentImage}
                  alt="Post image"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-lg max-h-96 object-cover"
                />
                {showRemoveButton && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                  <ImageIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="border-gray-300 dark:border-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? "Updating..." : "Update Post"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Visibility Selection Modal */}
      <Dialog 
        open={showVisibilityModal} 
        onOpenChange={(open) => {
          setShowVisibilityModal(open);
          if (!open && !isSubmitting) {
            setFormData(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#112032]">
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
    </>
  );
}

