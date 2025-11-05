-- Create packages table
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  surveys_allowed INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create package purchases table
CREATE TABLE IF NOT EXISTS public.package_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  payment_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_purchases ENABLE ROW LEVEL SECURITY;

-- Packages policies (everyone can view)
CREATE POLICY "Everyone can view packages"
  ON public.packages
  FOR SELECT
  USING (true);

-- Package purchases policies
CREATE POLICY "Users can view their own purchases"
  ON public.package_purchases
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own purchases"
  ON public.package_purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchases"
  ON public.package_purchases
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update purchases"
  ON public.package_purchases
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default packages
INSERT INTO public.packages (name, price, surveys_allowed, description) VALUES
  ('Basic Package', 500, 10, 'Access 10 additional surveys'),
  ('Standard Package', 1000, 25, 'Access 25 additional surveys'),
  ('Premium Package', 2000, 60, 'Access 60 additional surveys'),
  ('Ultimate Package', 5000, 200, 'Access 200 additional surveys')
ON CONFLICT DO NOTHING;