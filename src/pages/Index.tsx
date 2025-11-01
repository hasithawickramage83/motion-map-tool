import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, Target, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Activity className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">FitTrack Pro</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="outline" className="h-10">Sign In</Button>
          </Link>
          <Link to="/register">
            <Button className="h-10 bg-gradient-to-r from-primary to-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Track Your Fitness,{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Transform Your Life
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Monitor your workouts, track calories, and achieve your fitness goals with our professional activity tracking platform.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-primary/90">
                Start Tracking Free
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-xl bg-card border hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your fitness journey with detailed activity logs and insights
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 mx-auto">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Set Goals</h3>
              <p className="text-muted-foreground">
                Plan your workouts and track calories to achieve your targets
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border hover:shadow-lg transition-all duration-300" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Stay Motivated</h3>
              <p className="text-muted-foreground">
                Keep your fitness momentum with organized activity tracking
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
