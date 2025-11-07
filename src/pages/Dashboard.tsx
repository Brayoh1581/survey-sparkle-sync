import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, Users, TrendingUp, LogOut, Copy } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface Profile {
  balance: number;
  total_earned: number;
  referral_code: string;
  full_name: string;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  payout: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
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
        loadDashboardData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadDashboardData = async (userId: string) => {
    try {
      const [profileRes, surveysRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("surveys").select("*").eq("active", true).limit(10),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (surveysRes.data) setSurveys(surveysRes.data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkDailySurveyLimit = async () => {
    if (!session?.user?.id) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("survey_responses")
      .select("completed_at")
      .eq("user_id", session.user.id)
      .gte("completed_at", today.toISOString());

    if (error) {
      console.error("Error checking daily limit:", error);
      return false;
    }

    return (data?.length || 0) >= 1;
  };

  const hasActivePackage = async () => {
    if (!session?.user?.id) return false;

    const { data, error } = await supabase
      .from("package_purchases")
      .select("*, packages(*)")
      .eq("user_id", session.user.id)
      .eq("status", "verified");

    if (error) {
      console.error("Error checking packages:", error);
      return false;
    }

    return (data?.length || 0) > 0;
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast.success("Referral code copied!");
    }
  };

  const handleStartSurvey = async (surveyId: string) => {
    const reachedLimit = await checkDailySurveyLimit();
    const hasPackage = await hasActivePackage();

    if (reachedLimit && !hasPackage) {
      toast.info("You've completed your free daily survey. Purchase a package to continue!");
      navigate("/packages");
    } else {
      navigate(`/survey/${surveyId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Nyota fund survey</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {profile?.full_name || "User"}!</span>
            <Button variant="outline" onClick={handleSignOut} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-card border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-primary">
                  Ksh {profile?.balance?.toFixed(2) || "0.00"}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-primary opacity-20" />
            </div>
            <Button className="w-full mt-4 bg-primary hover:bg-primary-hover" onClick={() => navigate("/withdraw")}>
              Withdraw
            </Button>
          </Card>

          <Card className="p-6 bg-card border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Earned</p>
                <p className="text-3xl font-bold text-success">
                  Ksh {profile?.total_earned?.toFixed(2) || "0.00"}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-success opacity-20" />
            </div>
          </Card>

          <Card className="p-6 bg-card border-2 border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Referral Code</p>
                <p className="text-2xl font-bold text-primary">
                  {profile?.referral_code || "N/A"}
                </p>
              </div>
              <Users className="w-12 h-12 text-primary opacity-20" />
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={copyReferralCode}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </Card>
        </div>

        {/* Available Surveys */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Available Surveys</h2>
          
          {surveys.length === 0 ? (
            <Card className="p-12 text-center bg-card border-2 border-border">
              <p className="text-muted-foreground text-lg">
                No surveys available at the moment. Check back soon!
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surveys.map((survey) => (
                <Card key={survey.id} className="p-6 bg-card border-2 border-border hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">
                    {survey.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {survey.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-success">
                      Ksh {survey.payout.toFixed(2)}
                    </span>
                    <Button
                      onClick={() => handleStartSurvey(survey.id)}
                      className="bg-primary hover:bg-primary-hover"
                    >
                      Start Survey
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
