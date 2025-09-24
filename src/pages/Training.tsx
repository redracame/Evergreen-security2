import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, CheckCircle, Clock, Download, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateCertificate, generateCertificateId, type CertificateData } from '@/utils/certificateGenerator';
import { useAuthStore } from '@/stores/authStore';

const trainingModules = [
  {
    id: 1,
    title: 'Workplace Safety Fundamentals',
    status: 'completed',
    description: 'Essential safety protocols and procedures',
    duration: '45 mins',
    completedAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Data Protection & GDPR Compliance',
    status: 'in_progress',
    description: 'Data handling and privacy regulations',
    duration: '60 mins',
    progress: 60
  },
  {
    id: 3,
    title: 'Environmental Sustainability',
    status: 'not_started',
    description: 'Green practices and environmental responsibility',
    duration: '30 mins'
  },
  {
    id: 4,
    title: 'Diversity & Inclusion Workshop',
    status: 'not_started',
    description: 'Building inclusive workplace culture',
    duration: '90 mins'
  }
];

const quizQuestions = [
  {
    id: 1,
    question: 'What is the first step when you notice a safety hazard in the workplace?',
    options: [
      'Ignore it if it seems minor',
      'Report it immediately to your supervisor',
      'Try to fix it yourself',
      'Wait for someone else to notice'
    ],
    correct: 1
  },
  {
    id: 2,
    question: 'How often should emergency exits be checked?',
    options: [
      'Monthly',
      'Quarterly',
      'Annually',
      'Weekly'
    ],
    correct: 0
  },
  {
    id: 3,
    question: 'What should you do if you witness workplace harassment?',
    options: [
      'Mind your own business',
      'Report it through proper channels',
      'Confront the person directly',
      'Tell your friends about it'
    ],
    correct: 1
  }
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
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <BookOpen className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const startModule = (moduleId: number) => {
    setSelectedModule(moduleId);
    const module = modules.find(m => m.id === moduleId);
    if (module?.status === 'completed') {
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
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = [...answers, parseInt(selectedAnswer)];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Calculate score
      const correctAnswers = newAnswers.filter((answer, index) => 
        answer === quizQuestions[index].correct
      ).length;
      const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
      setScore(finalScore);
      setQuizCompleted(true);
      
      if (finalScore >= 80) {
        // Update module status to completed
        setModules(prevModules => 
          prevModules.map(module => 
            module.id === selectedModule 
              ? { ...module, status: 'completed' as const, completedAt: new Date().toLocaleDateString(), progress: undefined }
              : module
          )
        );
        
        toast({
          title: "Congratulations!",
          description: `You passed with ${finalScore}%! Certificate available for download.`,
        });
      } else {
        toast({
          title: "Please retry",
          description: `You scored ${finalScore}%. You need 80% or higher to pass.`,
          variant: "destructive"
        });
      }
    }
  };

  const downloadCertificate = async () => {
    if (!selectedModule || !user) return;
    
    const module = trainingModules.find(m => m.id === selectedModule);
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
      
      toast({
        title: "Certificate Downloaded",
        description: "Your completion certificate has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setSelectedModule(null)}>
            ← Back to Modules
          </Button>
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
            {!showQuiz && module?.status === 'completed' ? (
              <div className="text-center space-y-4">
                <Trophy className="h-16 w-16 text-warning mx-auto" />
                <h3 className="text-xl font-semibold">Module Completed!</h3>
                <p className="text-muted-foreground">
                  You completed this module on {module.completedAt}
                </p>
                <Button onClick={downloadCertificate} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            ) : showQuiz && !quizCompleted ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Knowledge Check</h3>
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                </div>
                
                <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {quizQuestions[currentQuestion].question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    <Button onClick={handleAnswerSubmit} className="mt-4">
                      {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Submit Quiz'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : quizCompleted ? (
              <div className="text-center space-y-4">
                <div className={`text-6xl ${score >= 80 ? 'text-success' : 'text-destructive'}`}>
                  {score}%
                </div>
                <h3 className="text-xl font-semibold">
                  {score >= 80 ? 'Congratulations!' : 'Better luck next time'}
                </h3>
                <p className="text-muted-foreground">
                  {score >= 80 
                    ? 'You have successfully completed this training module.'
                    : 'You need 80% or higher to pass. Please review the material and try again.'
                  }
                </p>
                {score >= 80 && (
                  <Button onClick={downloadCertificate} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Certificate
                  </Button>
                )}
                {score < 80 && (
                  <Button onClick={() => {
                    setShowQuiz(true);
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setQuizCompleted(false);
                    setSelectedAnswer('');
                  }}>
                    Retry Quiz
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <BookOpen className="h-16 w-16 text-primary mx-auto" />
                <h3 className="text-xl font-semibold">Ready to Start?</h3>
                <p className="text-muted-foreground">
                  Complete this training module and take the quiz to earn your certificate.
                </p>
                <Button onClick={() => setShowQuiz(true)}>
                  Start Training
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Training Modules</h1>
        <p className="text-muted-foreground">Complete your required training and earn certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(module.status)}
                    {module.title}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
                {getStatusBadge(module.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Duration: {module.duration}
              </div>
              
              {module.status === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} />
                </div>
              )}
              
              {module.status === 'completed' && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Completed on {module.completedAt}
                  </AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={() => startModule(module.id)}
                className="w-full"
                variant={module.status === 'completed' ? 'outline' : 'default'}
              >
                {module.status === 'completed' ? 'View Certificate' : 
                 module.status === 'in_progress' ? 'Continue' : 'Start Module'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Training;