import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";
import { Check } from "lucide-react";

interface Package {
  id: string;
  name: string;
  price: number;
  surveys_allowed: number;
  description: string;
}

const Packages = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        loadPackages();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("price", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPackage = (pkg: Package) => {
    navigate(`/validate-payment?package=${pkg.id}&name=${encodeURIComponent(pkg.name)}&price=${pkg.price}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl text-muted-foreground">Loading packages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Choose Your Package</h1>
          <p className="text-lg text-muted-foreground">
            Unlock more surveys and earn even more rewards
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You've reached your daily free survey limit. Select a package to continue earning!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="p-6 bg-card border-2 border-border hover:border-primary transition-all hover:shadow-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-success mb-2">
                  Ksh {pkg.price.toFixed(0)}
                </div>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <span className="text-sm">Access to {pkg.surveys_allowed} additional surveys</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <span className="text-sm">No daily limits</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success mt-0.5" />
                  <span className="text-sm">Higher earning potential</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectPackage(pkg)}
                className="w-full bg-primary hover:bg-primary-hover"
              >
                Select Package
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="mx-auto"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Packages;
