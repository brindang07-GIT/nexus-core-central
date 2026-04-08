import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GalleryUploadProps {
  onUploadComplete: () => void;
}

const categories = ["Competition", "Workshop", "Social", "Talk", "General"];

const GalleryUpload = ({ onUploadComplete }: GalleryUploadProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error("Please provide a title and select an image.");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload.");
        setUploading(false);
        return;
      }

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("gallery")
        .upload(path, file);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("gallery_images")
        .insert({
          title: title.trim(),
          category,
          year,
          storage_path: path,
          uploaded_by: user.id,
        });

      if (dbError) throw dbError;

      toast.success("Image uploaded successfully!");
      setTitle("");
      setCategory("General");
      setFile(null);
      setPreview(null);
      setOpen(false);
      onUploadComplete();
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Upload className="w-4 h-4" /> Upload Image
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-md space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-foreground">Upload to Gallery</h3>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Input
                placeholder="Image title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary border-border/50"
              />

              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 rounded-lg bg-secondary border border-border/50 px-3 py-2 text-sm text-foreground"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Input
                  placeholder="Year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-24 bg-secondary border-border/50"
                />
              </div>

              {/* File input */}
              <label className="flex flex-col items-center justify-center gap-2 h-40 rounded-xl border-2 border-dashed border-border/50 bg-secondary/30 cursor-pointer hover:border-primary/40 transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to select image</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              <Button onClick={handleUpload} disabled={uploading} className="w-full">
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryUpload;
