import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, DollarSign, Users, Star, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DollarSign className="w-8 h-8 text-primary" />,
      title: "High Paying Surveys",
      description: "Earn Ksh 50-500 per survey - highest rates in the industry"
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "25% Referral Commission",
      description: "Earn lifetime commissions from your referrals"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Instant Payouts",
      description: "Get paid within 2-24 hours - no waiting"
    },
    {
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "No Minimum Threshold",
      description: "Withdraw any amount, anytime"
    },
    {
      icon: <Award className="w-8 h-8 text-primary" />,
      title: "100% Legitimate",
      description: "Trusted by 50,000+ users worldwide"
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "4.9★ Rating",
      description: "Rated excellent by our community"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mwanza",
      earned: "Kes 2,000",
      text: "surveypoll changed my life! I earn 2000+ weekly just by sharing my opinions.",
      avatar: "👩‍💼"
    },
    {
      name: "John Kinyua",
      earned: "Kes 4,500",
      text: "I'm so glad I found this site! The extra income has helped me pay my bills.",
      avatar: "👨‍💻"
    },
    {
      name: "Maria Lemayan",
      earned: "Kes 3,000",
      text: "As a student, this is perfect. I work whenever I want and get paid instantly.",
      avatar: "👩‍🎓"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light via-background to-secondary py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            Start Earning with surveypoll
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Join 50,000+ users earning real money daily
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary-hover"
            >
              START EARNING NOW
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6 border-2 border-primary text-primary hover:bg-primary-light"
            >
              ALREADY A MEMBER? LOGIN
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-12">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Instant payouts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>No experience needed</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card/80 backdrop-blur p-6 rounded-lg shadow-lg border border-border">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="bg-card/80 backdrop-blur p-6 rounded-lg shadow-lg border border-border">
              <div className="text-4xl font-bold text-primary mb-2">Ksh 200M+</div>
              <div className="text-muted-foreground">Total Payouts</div>
            </div>
            <div className="bg-card/80 backdrop-blur p-6 rounded-lg shadow-lg border border-border">
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-primary mb-16">
            Why Choose surveypoll?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-border">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-secondary">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-primary mb-16">
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 bg-card border-2 border-border hover:shadow-xl transition-all duration-300">
                <div className="text-5xl mb-4">{testimonial.avatar}</div>
                <h3 className="text-xl font-bold text-card-foreground mb-2">{testimonial.name}</h3>
                <p className="text-success font-semibold mb-4">Earned: {testimonial.earned}</p>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary to-primary-hover">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-8">
            Ready to Start Earning?
          </h2>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="text-lg px-12 py-6 bg-card text-primary hover:bg-card/90 shadow-xl"
          >
            Join Now - It's Free!
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
