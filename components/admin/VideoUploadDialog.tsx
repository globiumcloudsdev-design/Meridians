"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link as LinkIcon, User } from "lucide-react";
import { toast } from "sonner";
import {
  VideoFormData,
  VideoDialogProps,
  VideoStatus,
} from "@/lib/types/uploadVideo";

const CATEGORIES = [
  "General",
  "Announcement",
  "Success Story",
  "News",
  "Event",
  "Academic",
];
export function VideoUploadDialog({
  open,
  onClose,
  onSubmit,
  initialData,
}: VideoDialogProps) {
  const [formData, setFormData] = useState<Partial<VideoFormData>>({
    title: "",
    description: "",
    link: "",
    category: "General",
    status: "draft",
    author: "Admin",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        link: initialData.link || "",
        category: initialData.category || "General",
        status: initialData.status || "draft",
        author: initialData.author || "Admin",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        link: "",
        category: "General",
        status: "draft",
        author: "Admin",
      });
    }
  }, [initialData, open]);

  const handleChange = (field: keyof VideoFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.link) {
      toast.error("Please provide a video link");
      return;
    }

    setUploading(true);
    try {
      onSubmit(formData);
      toast.success("Video saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Video" : "Add New Video"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the video details below."
              : "Fill in the details to add a new video."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter video description"
              rows={4}
              required
            />
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label htmlFor="link">
              Video Link <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleChange("status", value as VideoStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder="Enter author name"
                className="pl-9"
              />
            </div>
          </div>

          {/* Dialog Footer Buttons */}
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading
                ? "Saving..."
                : initialData
                  ? "Update Video"
                  : "Add Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
