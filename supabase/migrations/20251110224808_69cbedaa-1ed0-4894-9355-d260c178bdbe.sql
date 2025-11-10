-- Add industry field to profiles table
ALTER TABLE public.profiles
ADD COLUMN industry TEXT;

-- Add industry and company fields to surveys table
ALTER TABLE public.surveys
ADD COLUMN industry TEXT NOT NULL DEFAULT 'General',
ADD COLUMN company TEXT;

-- Create index for faster industry filtering
CREATE INDEX idx_surveys_industry ON public.surveys(industry);
CREATE INDEX idx_profiles_industry ON public.profiles(industry);