import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, CheckCircle, Clock, Download, Trophy, Star, Award, Target, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCertificate, generateCertificateId, type CertificateData } from '@/utils/certificateGenerator';
import { useAuthStore } from '@/stores/authStore';

const trainingModules = [
  { id: 1, title: 'Workplace Safety Fundamentals', status: 'completed', description: 'Essential safety protocols and procedures', duration: '45 mins', completedAt: '2025-09-15'},
  { id: 2, title: 'Data Protection & GDPR Compliance', status: 'in_progress', description: 'Data handling and privacy regulations', duration: '60 mins', progress: 60 },
  { id: 3, title: 'Environmental Sustainability', status: 'not_started', description: 'Green practices and environmental responsibility', duration: '30 mins' },
  { id: 4, title: 'Diversity & Inclusion Workshop', status: 'not_started', description: 'Building inclusive workplace culture', duration: '90 mins' }
];

const quizQuestions = [
  { id: 1, question: 'What is the first step when you notice a safety hazard in the workplace?', options: ['Ignore it if it seems minor','Report it immediately to your supervisor','Try to fix it yourself','Wait for someone else to notice'], correct: 1 },
  { id: 2, question: 'How often should emergency exits be checked?', options: ['Monthly','Quarterly','Annually','Weekly'], correct: 0 },
  { id: 3, question: 'What should you do if you witness workplace harassment?', options: ['Mind your own business','Report it through proper channels','Confront the person directly','Tell your friends about it'], correct: 1 }
];

const Training = () => {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [modules, setModules] = useState(trainingModules);
  const { toast } = useToast();
  const { user } = useAuthStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Award className="h-5 w-5 text-success" />;
      case 'in_progress': return <Target className="h-5 w-5 text-warning animate-pulse" />;
      default: return <BookOpen className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-success/20 text-success border-success/30 font-medium">✓ Completed</Badge>;
      case 'in_progress': return <Badge className="bg-warning/20 text-warning border-warning/30 font-medium animate-pulse">In Progress</Badge>;
      default: return <Badge variant="outline" className="font-medium">Not Started</Badge>;
    }
  };

  const startModule = (moduleId: number) => {
    setSelectedModule(moduleId);
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    if (module.status === 'completed') {
      setShowQuiz(false);
    } else {
      setShowQuiz(true);
      setCurrentQuestion(0);
      setAnswers([]);
      setQuizCompleted(false);
      setScore(0);
      setSelectedAnswer('');
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === '') {
      toast({ title: "Please select an answer", variant: "destructive" });
      return;
    }

    const newAnswers = [...answers, parseInt(selectedAnswer)];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      const correctAnswers = newAnswers.filter((a, i) => a === quizQuestions[i].correct).length;
      const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
      setScore(finalScore);
      setQuizCompleted(true);

      if (finalScore >= 80) {
        setModules(prev => prev.map(m => m.id === selectedModule ? { ...m, status: 'completed', completedAt: new Date().toLocaleDateString(), progress: undefined } : m));
        toast({ title: "Congratulations!", description: `You passed with ${finalScore}%! Certificate available for download.` });
      } else {
        toast({ title: "Please retry", description: `You scored ${finalScore}%. You need 80% or higher to pass.`, variant: "destructive" });
      }
    }
  };

  const downloadCertificate = async () => {
    if (!selectedModule || !user) return;
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return;

    try {
      const certificateData: CertificateData = {
        recipientName: user.name,
        courseName: module.title,
        completionDate: module.completedAt || new Date().toLocaleDateString(),
        score: score || 100,
        certificateId: generateCertificateId()
      };
      await generateCertificate(certificateData);
      toast({ title: "Certificate Downloaded", description: "Your completion certificate has been downloaded successfully." });
    } catch {
      toast({ title: "Download Failed", description: "Failed to generate certificate. Please try again.", variant: "destructive" });
    }
  };

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="mb-6">
            <Button variant="outline" onClick={() => setSelectedModule(null)} className="gap-2">← Back to Training Academy</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {module?.title}
              </CardTitle>
              <CardDescription>{module?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Completed Module */}
              {!showQuiz && module?.status === 'completed' && (
                <div className="text-center space-y-4">
                  <Trophy className="h-16 w-16 text-warning mx-auto" />
                  <h3 className="text-xl font-semibold">Module Completed!</h3>
                  <p className="text-muted-foreground">You completed this module on {module.completedAt}</p>
                  <Button onClick={downloadCertificate} className="gap-2"><Download className="h-4 w-4" /> Download Certificate</Button>
                </div>
              )}

              {/* Quiz */}
              {showQuiz && !quizCompleted && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Knowledge Check</h3>
                    <span className="text-sm text-muted-foreground">Question {currentQuestion + 1} of {quizQuestions.length}</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} />
                  <Card>
                    <CardHeader><CardTitle className="text-base">{quizQuestions[currentQuestion].question}</CardTitle></CardHeader>
                    <CardContent>
                      <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                        {quizQuestions[currentQuestion].options.map((opt, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                            <Label htmlFor={`option-${i}`}>{opt}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button onClick={handleAnswerSubmit} className="mt-4">{currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}</Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Quiz Completed */}
              {quizCompleted && (
                <div className="text-center space-y-4">
                  <div className={`text-6xl ${score >= 80 ? 'text-success' : 'text-destructive'}`}>{score}%</div>
                  <h3 className="text-xl font-semibold">{score >= 80 ? 'Congratulations!' : 'Better luck next time'}</h3>
                  <p className="text-muted-foreground">{score >= 80 ? 'You have successfully completed this training module.' : 'You need 80% or higher to pass. Please retry.'}</p>
                  {score >= 80 ? <Button onClick={downloadCertificate} className="gap-2"><Download className="h-4 w-4" /> Download Certificate</Button> :
                    <Button onClick={() => { setShowQuiz(true); setCurrentQuestion(0); setAnswers([]); setQuizCompleted(false); setSelectedAnswer(''); }}>Retry Quiz</Button>}
                </div>
              )}

              {/* Ready to start */}
              {!showQuiz && module?.status === 'not_started' && (
                <div className="text-center space-y-4">
                  <BookOpen className="h-16 w-16 text-primary mx-auto" />
                  <h3 className="text-xl font-semibold">Ready to Start?</h3>
                  <p className="text-muted-foreground">Complete this training module and take the quiz to earn your certificate.</p>
                  <Button onClick={() => setShowQuiz(true)}>Start Training</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedCount = modules.filter(m => m.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center relative">
            <GraduationCap className="h-16 w-16 text-primary" />
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-warning rounded-full flex items-center justify-center">
              <Star className="h-3 w-3 text-warning-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Training Academy</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Master essential skills, earn certifications, and advance your career with our comprehensive training modules</p>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl"><Trophy className="h-5 w-5 text-success" /> Your Learning Journey</CardTitle>
              <CardDescription>Track the modules you’ve successfully completed</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardHeader>
        </Card>

        {/* Training Modules Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Training Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {modules.map(module => (
              <Card key={module.id} className="group hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-0 bg-gradient-to-br from-card via-card to-card/80 hover:from-accent/5 hover:to-primary/5">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">{getStatusIcon(module.status)}</div>
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{module.title}</CardTitle>
                        <CardDescription className="text-sm">{module.description}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(module.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>{module.duration}</span></div>
                  {module.status === 'in_progress' && (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-medium"><span>Progress</span><span className="text-warning">{module.progress}%</span></div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}
                  {module.status === 'completed' && <Alert className="border-success/20 bg-success/5"><Award className="h-4 w-4 text-success" /><AlertDescription className="text-success">Completed on {module.completedAt}</AlertDescription></Alert>}
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300" variant={module.status === 'completed' ? 'outline' : 'default'} size="lg" onClick={() => startModule(module.id)}>
                    {module.status === 'completed' ? <><Download className="h-4 w-4 mr-2" /> View Certificate</> : module.status === 'in_progress' ? <><Target className="h-4 w-4 mr-2" /> Continue Learning</> : <><BookOpen className="h-4 w-4 mr-2" /> Start Module</>}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;
