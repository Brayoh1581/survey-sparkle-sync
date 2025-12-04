import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INDUSTRIES } from "@/data/industries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Phone, Building2, Shield, Landmark, ShoppingCart, Factory, 
  Zap, Wheat, Home, Truck, Cpu, Tv
} from "lucide-react";

const industryIcons: Record<string, any> = {
  telecommunications: Phone,
  banking: Building2,
  insurance: Shield,
  government: Landmark,
  retail: ShoppingCart,
  manufacturing: Factory,
  energy: Zap,
  agriculture: Wheat,
  realestate: Home,
  transport: Truck,
  technology: Cpu,
  media: Tv,
};

interface IndustrySelectionProps {
  userId: string;
  onIndustrySelected: (industry: string) => void;
}

const IndustrySelection = ({ userId, onIndustrySelected }: IndustrySelectionProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
  };

  const handleConfirm = async () => {
    if (!selectedIndustry) {
      toast.error("Please select an industry");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ industry: selectedIndustry })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Industry preference saved!");
      onIndustrySelected(selectedIndustry);
    } catch (error) {
      console.error("Error saving industry:", error);
      toast.error("Failed to save industry preference");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome to Nyota Fund Survey!
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Which industry are you most familiar with?
          </p>
          <p className="text-sm text-muted-foreground">
            Select the industry you know best to see relevant surveys
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {INDUSTRIES.map((industry) => {
            const Icon = industryIcons[industry.id] || Building2;
            const isSelected = selectedIndustry === industry.id;

            return (
              <Card
                key={industry.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? "border-2 border-primary bg-primary/5"
                    : "border border-border hover:border-primary/50"
                }`}
                onClick={() => handleIndustrySelect(industry.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{industry.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      <p className="mb-1">Companies:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {industry.companies.slice(0, 3).map((company, idx) => (
                          <li key={idx}>{company.name}</li>
                        ))}
                        {industry.companies.length > 3 && (
                          <li className="text-xs">+{industry.companies.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleConfirm}
            disabled={!selectedIndustry || loading}
            className="bg-primary hover:bg-primary-hover px-8 py-6 text-lg"
          >
            {loading ? "Saving..." : "Continue to Surveys"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IndustrySelection;
