import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Filter } from "lucide-react";
import { mediaGallery } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import GalleryUpload from "@/components/GalleryUpload";

interface GalleryImage {
  id: string;
  title: string;
  category: string;
  year: string;
  storage_path: string;
  created_at: string;
}

const GalleryPage = () => {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [dbImages, setDbImages] = useState<GalleryImage[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchImages = async () => {
    const { data } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setDbImages(data);
  };

  useEffect(() => {
    fetchImages();
    supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session?.user);
    });
  }, []);

  // Combine DB images grouped by year/category into album-like cards
  const albumsFromDb = dbImages.reduce<Record<string, { title: string; year: string; category: string; images: GalleryImage[] }>>((acc, img) => {
    const key = `${img.year}-${img.category}`;
    if (!acc[key]) {
      acc[key] = { title: `${img.category} ${img.year}`, year: img.year, category: img.category, images: [] };
    }
    acc[key].images.push(img);
    return acc;
  }, {});

  const allYears = Array.from(new Set([
    ...mediaGallery.map((m) => m.year),
    ...dbImages.map((img) => img.year),
  ])).sort().reverse();

  const years = ["all", ...allYears];

  const filteredMock = yearFilter === "all" ? mediaGallery : mediaGallery.filter((m) => m.year === yearFilter);
  const filteredAlbums = Object.values(albumsFromDb).filter((a) => yearFilter === "all" || a.year === yearFilter);

  const gradients = [
    "from-primary/30 to-accent/20",
    "from-accent/30 to-primary/20",
    "from-primary/20 to-secondary",
    "from-accent/20 to-secondary",
  ];

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Media <span className="text-gradient-accent">Gallery</span>
          </h1>
          <p className="text-muted-foreground mt-2">Relive our best moments, organized by year.</p>
        </div>
        {isLoggedIn && <GalleryUpload onUploadComplete={fetchImages} />}
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

      {/* DB Images - displayed as individual cards with real images */}
      {filteredAlbums.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-foreground">Uploaded Photos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlbums.flatMap((album) =>
              album.images.map((img, i) => (
                <motion.div
                  key={img.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-hover rounded-2xl overflow-hidden group"
                >
                  <div className="h-48 relative">
                    <img
                      src={getPublicUrl(img.storage_path)}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-foreground">{img.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                        {img.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{img.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mock placeholder albums */}
      {filteredMock.length > 0 && (
        <div className="space-y-4">
          {filteredAlbums.length > 0 && (
            <h2 className="font-display text-lg font-bold text-foreground">Past Albums</h2>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMock.map((album, i) => (
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
                    <Badge variant="secondary" className="text-xs">{album.imageCount} photos</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-foreground text-lg">{album.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">{album.category}</Badge>
                    <span className="text-xs text-muted-foreground">{album.year}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
