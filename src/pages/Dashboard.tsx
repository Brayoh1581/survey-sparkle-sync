import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { DollarSign, Users, TrendingUp, LogOut, Copy, RefreshCw } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import IndustrySelection from "@/components/IndustrySelection";
import { INDUSTRIES } from "@/data/industries";
import { ensureSurveysAvailable, GeneratedSurvey } from "@/utils/surveyGenerator";

interface Profile {
  balance: number;
  total_earned: number;
  referral_code: string;
  full_name: string;
  industry: string | null;
}

interface CompanySurveys {
  company: string;
  code: string;
  color: string;
  surveys: GeneratedSurvey[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [surveys, setSurveys] = useState<GeneratedSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showIndustrySelection, setShowIndustrySelection] = useState(false);

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
      const profileRes = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileRes.data) {
        setProfile(profileRes.data);
        
        // Show industry selection if user hasn't selected one
        if (!profileRes.data.industry) {
          setShowIndustrySelection(true);
          setLoading(false);
          return;
        }

        // Load surveys filtered by user's industry
        const surveysRes = await supabase
          .from("surveys")
          .select("*")
          .eq("active", true)
          .eq("industry", profileRes.data.industry);

        // Use ensureSurveysAvailable to always have surveys
        const allSurveys = ensureSurveysAvailable(
          surveysRes.data || [],
          profileRes.data.industry
        );
        setSurveys(allSurveys);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSurveys = () => {
    if (!profile?.industry) return;
    setRefreshing(true);
    
    // Regenerate surveys for variety
    const allSurveys = ensureSurveysAvailable([], profile.industry);
    setSurveys(allSurveys);
    
    setTimeout(() => setRefreshing(false), 500);
    toast.success("Surveys refreshed!");
  };

  // Group surveys by company
  const companySurveys = useMemo((): CompanySurveys[] => {
    if (!profile?.industry) return [];
    
    const industry = INDUSTRIES.find(ind => ind.id === profile.industry);
    if (!industry) return [];

    const grouped: CompanySurveys[] = [];
    
    industry.companies.forEach(company => {
      const compSurveys = surveys.filter(s => s.company === company.name);
      if (compSurveys.length > 0) {
        grouped.push({
          company: company.name,
          code: company.code,
          color: company.color,
          surveys: compSurveys
        });
      }
    });

    return grouped;
  }, [surveys, profile?.industry]);

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

  const hasPendingPayment = async () => {
    if (!session?.user?.id) return false;

    const { data, error } = await supabase
      .from("package_purchases")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("status", "pending");

    if (error) {
      console.error("Error checking pending payments:", error);
      return false;
    }

    return (data?.length || 0) > 0;
  };

  const hasActivePackage = async () => {
    if (!session?.user?.id) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check for verified packages
    const { data, error } = await supabase
      .from("package_purchases")
      .select("*, packages(*)")
      .eq("user_id", session.user.id)
      .eq("status", "verified");

    if (error) {
      console.error("Error checking packages:", error);
      return false;
    }

    if (!data || data.length === 0) return false;

    // Get today's completed surveys count
    const { data: todayResponses } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("user_id", session.user.id)
      .gte("completed_at", today.toISOString());

    const todayCount = todayResponses?.length || 0;

    // Get the most recent package
    const latestPackage = data[0];
    const surveysAllowed = (latestPackage.packages as any)?.surveys_allowed || 0;

    // Check if user hasn't exceeded their package limit
    return todayCount < surveysAllowed;
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

  const handleStartSurvey = async (survey: GeneratedSurvey) => {
    const pending = await hasPendingPayment();
    
    if (pending) {
      toast.info("Wait for M-Pesa Payment Verification", {
        description: "Your payment is being verified. This may take up to 24 hours.",
        duration: 5000,
      });
      return;
    }

    const reachedLimit = await checkDailySurveyLimit();
    const hasPackage = await hasActivePackage();

    if (reachedLimit && !hasPackage) {
      toast.info("You've completed your free daily survey. Purchase a package to continue!");
      navigate("/packages");
    } else {
      // For generated surveys, store in sessionStorage and navigate
      if (survey.isGenerated) {
        sessionStorage.setItem("generatedSurvey", JSON.stringify(survey));
        navigate(`/survey/generated_${survey.id}`);
      } else {
        navigate(`/survey/${survey.id}`);
      }
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

  if (showIndustrySelection && session) {
    return (
      <IndustrySelection
        userId={session.user.id}
        onIndustrySelected={(industry) => {
          setShowIndustrySelection(false);
          loadDashboardData(session.user.id);
        }}
      />
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
            <Button className="w-full mt-4 bg-warning hover:bg-warning/90 text-black font-semibold" onClick={() => navigate("/withdraw")}>
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

        {/* Available Surveys by Company */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Available Surveys</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSurveys}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-8">
            {companySurveys.map((companyGroup) => (
              <div key={companyGroup.company} className="space-y-4">
                {/* Company Header */}
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: `hsl(${companyGroup.color})` }}
                  >
                    {companyGroup.code}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">
                      {companyGroup.company}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {companyGroup.surveys.length} surveys available
                    </p>
                  </div>
                </div>

                {/* Company Surveys Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companyGroup.surveys.map((survey) => (
                    <Card key={survey.id} className="p-5 bg-card border border-border hover:shadow-lg transition-all duration-300">
                      <h4 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-1">
                        {survey.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {survey.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-success">
                          Ksh {survey.payout.toFixed(2)}
                        </span>
                        <Button
                          onClick={() => handleStartSurvey(survey)}
                          className="bg-warning hover:bg-warning/90 text-black font-semibold"
                          size="sm"
                        >
                          Start
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
