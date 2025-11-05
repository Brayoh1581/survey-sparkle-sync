import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "text";
  options?: string[];
}

interface SurveyData {
  id: string;
  title: string;
  description: string;
  payout: number;
  questions: Question[];
}

const Survey = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
        loadSurvey();
      }
    });

    return () => subscription.unsubscribe();
  }, [id, navigate]);

  const loadSurvey = async () => {
    try {
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setSurvey({
          ...data,
          questions: data.questions as unknown as Question[]
        });
      }
    } catch (error) {
      console.error("Error loading survey:", error);
      toast.error("Failed to load survey");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !survey) return;

    // Validate all questions are answered
    const allQuestionsAnswered = survey.questions.every((q) => answers[q.id]);
    if (!allQuestionsAnswered) {
      toast.error("Please answer all questions");
      return;
    }

    setSubmitting(true);

    try {
      // Submit response
      const { error: responseError } = await supabase
        .from("survey_responses")
        .insert({
          survey_id: survey.id,
          user_id: session.user.id,
          answers,
        });

      if (responseError) {
        if (responseError.message.includes("duplicate")) {
          toast.error("You have already completed this survey");
        } else {
          throw responseError;
        }
        return;
      }

      // Update balance and create transaction
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance, total_earned, referred_by")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        const newBalance = (profile.balance || 0) + survey.payout;
        const newTotalEarned = (profile.total_earned || 0) + survey.payout;

        await supabase
          .from("profiles")
          .update({
            balance: newBalance,
            total_earned: newTotalEarned,
          })
          .eq("id", session.user.id);

        // Create transaction
        await supabase.from("transactions").insert({
          user_id: session.user.id,
          type: "survey",
          amount: survey.payout,
          description: `Completed: ${survey.title}`,
        });

        // Handle referral commission (25%)
        if (profile.referred_by) {
          const { data: referrer } = await supabase
            .from("profiles")
            .select("id, balance, total_earned")
            .eq("referral_code", profile.referred_by)
            .single();

          if (referrer) {
            const commission = survey.payout * 0.25;
            await supabase
              .from("profiles")
              .update({
                balance: (referrer.balance || 0) + commission,
                total_earned: (referrer.total_earned || 0) + commission,
              })
              .eq("id", referrer.id);

            await supabase.from("transactions").insert({
              user_id: referrer.id,
              type: "referral",
              amount: commission,
              description: `Referral commission from survey completion`,
            });
          }
        }
      }

      toast.success(`Survey completed! You earned Ksh ${survey.payout.toFixed(2)}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Failed to submit survey");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl text-muted-foreground">Loading survey...</div>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-xl text-muted-foreground">Survey not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-background to-secondary py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Card className="p-8 bg-card border-2 border-border">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">{survey.title}</h1>
            <p className="text-muted-foreground mb-4">{survey.description}</p>
            <div className="inline-block bg-success text-white px-4 py-2 rounded-lg font-bold">
              Payout: Ksh {survey.payout.toFixed(2)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {survey.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <Label className="text-lg font-semibold">
                  {index + 1}. {question.question}
                </Label>

                {question.type === "multiple_choice" && question.options ? (
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onValueChange={(value) =>
                      setAnswers({ ...answers, [question.id]: value })
                    }
                  >
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                        <Label htmlFor={`${question.id}-${optIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [question.id]: e.target.value })
                    }
                    placeholder="Enter your answer"
                    rows={4}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary hover:bg-primary-hover"
              >
                {submitting ? "Submitting..." : "Submit Survey"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Survey;
