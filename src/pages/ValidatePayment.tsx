import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

const ValidatePayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState<Session | null>(null);
  const [mpesaMessage, setMpesaMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const packageId = searchParams.get("package");
  const packageName = searchParams.get("name");
  const packagePrice = searchParams.get("price");

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
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !packageId) return;

    if (!mpesaMessage.trim()) {
      toast.error("Please paste your M-PESA message");
      return;
    }

    // Extract M-PESA code from message (10 characters, alphanumeric)
    const mpesaCodePattern = /\b[A-Z0-9]{10}\b/;
    const match = mpesaMessage.match(mpesaCodePattern);
    
    if (!match) {
      toast.error("Could not find valid M-PESA code in message. Please paste the complete SMS.");
      return;
    }

    const extractedCode = match[0];
    setSubmitting(true);

    try {
      // Insert pending payment for verification
      const { error } = await supabase
        .from("package_purchases")
        .insert({
          user_id: session.user.id,
          package_id: packageId,
          payment_code: extractedCode,
          mpesa_message: mpesaMessage.trim(),
          status: "pending",
        });

      if (error) throw error;

      toast.success("Payment submitted! Please wait for verification (up to 24 hours).");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Failed to submit payment verification");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="p-8 bg-card border-2 border-border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Validate Payment</h1>
            <p className="text-muted-foreground">Complete your package purchase</p>
          </div>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Package:</span>
              <span className="font-semibold text-primary">{packageName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount:</span>
              <span className="text-2xl font-bold text-success">Ksh {packagePrice}</span>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg mb-8">
            <h3 className="font-semibold mb-4 text-primary">How To Pay</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Go to M-PESA</li>
              <li>Select: <strong className="text-foreground">Lipa na M-PESA</strong></li>
              <li>Select: <strong className="text-foreground">Buy Goods and Services</strong></li>
              <li>Select: <strong className="text-foreground">Enter Till No: 567670</strong></li>
              <li>Enter amount: <strong className="text-foreground">Ksh {packagePrice}</strong></li>
              <li>Enter your M-PESA PIN and send</li>
              <li>You will receive a confirmation SMS with a payment code</li>
              <li>Enter the payment code below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mpesaMessage">M-PESA Confirmation Message</Label>
              <textarea
                id="mpesaMessage"
                placeholder="Paste your entire M-PESA confirmation SMS here..."
                value={mpesaMessage}
                onChange={(e) => setMpesaMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-xs text-muted-foreground">
                Paste the complete M-PESA confirmation SMS you received
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/packages")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-warning hover:bg-warning/90 text-black font-semibold"
              >
                {submitting ? "Verifying..." : "Verify Payment"}
              </Button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Note:</strong> Paste your complete M-PESA SMS. Verification takes up to 24 hours. You'll be notified when approved.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ValidatePayment;
