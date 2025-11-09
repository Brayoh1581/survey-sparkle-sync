import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Session } from "@supabase/supabase-js";

const Withdraw = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [minWithdrawal, setMinWithdrawal] = useState(0);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "",
    accountNumber: "",
    accountName: "",
  });

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
        loadBalance(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadBalance = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("balance")
      .eq("id", userId)
      .single();

    if (data) setBalance(data.balance || 0);
    
    // Get user's active package to determine minimum withdrawal
    const { data: packagePurchase } = await supabase
      .from("package_purchases")
      .select("packages(name)")
      .eq("user_id", userId)
      .eq("status", "verified")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    if (packagePurchase?.packages) {
      const packageName = (packagePurchase.packages as any).name;
      // Set minimum withdrawal based on package
      if (packageName === 'Silver Package') setMinWithdrawal(3000);
      else if (packageName === 'Gold Package') setMinWithdrawal(2500);
      else if (packageName === 'Premium Package') setMinWithdrawal(2000);
      else if (packageName === 'Platinum Package') setMinWithdrawal(700);
      else setMinWithdrawal(0); // No package
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const amount = parseFloat(formData.amount);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (minWithdrawal > 0 && amount < minWithdrawal) {
      toast.error(`Minimum withdrawal amount is Ksh ${minWithdrawal} for your package`);
      return;
    }

    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (!formData.paymentMethod || !formData.accountNumber || !formData.accountName) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Create withdrawal request
      const { error: withdrawalError } = await supabase.from("withdrawals").insert({
        user_id: session.user.id,
        amount,
        payment_method: formData.paymentMethod,
        payment_details: {
          account_number: formData.accountNumber,
          account_name: formData.accountName,
        },
      });

      if (withdrawalError) throw withdrawalError;

      // Update balance
      await supabase
        .from("profiles")
        .update({ balance: balance - amount })
        .eq("id", session.user.id);

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: session.user.id,
        type: "withdrawal",
        amount: -amount,
        description: `Withdrawal via ${formData.paymentMethod}`,
        status: "pending",
      });

      toast.success("Withdrawal request submitted! Processing within 2-24 hours.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      toast.error("Failed to process withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="p-8 bg-card border-2 border-border">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">Withdraw Funds</h1>
            <p className="text-muted-foreground">
              Available Balance: <span className="text-success font-bold text-xl">Ksh {balance.toFixed(2)}</span>
            </p>
            {minWithdrawal > 0 && (
              <p className="text-muted-foreground text-sm mt-1">
                Minimum withdrawal: <span className="text-warning font-semibold">Ksh {minWithdrawal}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="amount">Amount to Withdraw</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={balance}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                placeholder="Enter account name"
                required
              />
            </div>

            <div>
              <Label htmlFor="accountNumber">
                {formData.paymentMethod === "mpesa"
                  ? "Phone Number"
                  : formData.paymentMethod === "paypal"
                  ? "PayPal Email"
                  : "Account Number"}
              </Label>
              <Input
                id="accountNumber"
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder={
                  formData.paymentMethod === "mpesa"
                    ? "e.g., 254712345678"
                    : formData.paymentMethod === "paypal"
                    ? "your@email.com"
                    : "Enter account number"
                }
                required
              />
            </div>

            <div className="bg-primary-light border-l-4 border-primary p-4 rounded">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Withdrawals are processed within 2-24 hours. You will receive a confirmation email once processed.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-warning hover:bg-warning/90 text-black font-semibold"
              disabled={loading}
            >
              {loading ? "Processing..." : "Submit Withdrawal Request"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Withdraw;
