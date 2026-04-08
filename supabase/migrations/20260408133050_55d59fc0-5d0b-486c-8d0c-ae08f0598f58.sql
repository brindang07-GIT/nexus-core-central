
-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  year TEXT NOT NULL DEFAULT to_char(now(), 'YYYY'),
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Everyone can view gallery images
CREATE POLICY "Gallery images are viewable by everyone"
  ON public.gallery_images FOR SELECT USING (true);

-- Authenticated users can insert (admin check will be app-level for now)
CREATE POLICY "Authenticated users can upload gallery images"
  ON public.gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

-- Users can delete their own uploads
CREATE POLICY "Users can delete their own gallery images"
  ON public.gallery_images FOR DELETE
  TO authenticated
  USING (auth.uid() = uploaded_by);

-- Create storage bucket for gallery
INSERT INTO storage.buckets (id, name, public)
  VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "Gallery images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload to gallery"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Users can delete their own gallery files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'gallery' AND auth.uid()::text = (storage.foldername(name))[1]);
