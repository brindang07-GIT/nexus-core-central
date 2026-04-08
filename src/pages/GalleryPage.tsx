import { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Filter } from "lucide-react";
import { mediaGallery } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const GalleryPage = () => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const years = ["all", ...Array.from(new Set(mediaGallery.map((m) => m.year)))];

  const filtered = yearFilter === "all" ? mediaGallery : mediaGallery.filter((m) => m.year === yearFilter);

  // Generate gradient colors for placeholder thumbnails
  const gradients = [
    "from-primary/30 to-accent/20",
    "from-accent/30 to-primary/20",
    "from-primary/20 to-secondary",
    "from-accent/20 to-secondary",
    "from-primary/30 to-secondary",
    "from-secondary to-accent/20",
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Media <span className="text-gradient-accent">Gallery</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Relive our best moments, organized by year.
        </p>
      </motion.div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setYearFilter(year)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              yearFilter === year
                ? "bg-primary text-primary-foreground"
                : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((album, i) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-hover rounded-2xl overflow-hidden cursor-pointer group"
          >
            <div className={`h-48 bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center relative`}>
              <ImageIcon className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
              <div className="absolute bottom-3 right-3">
                <Badge variant="secondary" className="text-xs">
                  {album.imageCount} photos
                </Badge>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold text-foreground text-lg">{album.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {album.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{album.year}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;
