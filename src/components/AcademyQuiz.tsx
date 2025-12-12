import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Award, Clock, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AcademyQuizProps {
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
  xpReward: number;
  onComplete: (score: number, xpEarned: number) => Promise<void>;
  onClose: () => void;
}

export default function AcademyQuiz({ lessonId, lessonTitle, questions, xpReward, onComplete, onClose }: AcademyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!showResults && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeRemaining, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowResults(true);

    const correctCount = questions.filter((q, idx) =>
      selectedAnswers[idx] === q.correctAnswer
    ).length;

    const score = Math.round((correctCount / questions.length) * 100);
    const earnedXP = score >= 70 ? xpReward : Math.round(xpReward * 0.5);

    try {
      await onComplete(score, earnedXP);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctCount = questions.filter((q, idx) =>
    selectedAnswers[idx] === q.correctAnswer
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const earnedXP = score >= 70 ? xpReward : Math.round(xpReward * 0.5);

  const currentQ = questions[currentQuestion];
  const currentAnswer = selectedAnswers[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-owl-navy via-owl-slate to-black border-2 border-gold-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-gold-glow">
        <div className="sticky top-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-glass border-b border-gold-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{lessonTitle} - Quiz</h2>
              <p className="text-sm text-gray-400">{questions.length} questions • {xpReward} XP reward</p>
            </div>
            {!showResults && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500 rounded-lg">
                <Clock size={18} className="text-red-400" />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>

        {showResults ? (
          <div className="p-8 space-y-6">
            <div className="text-center">
              <div className={`inline-flex p-6 rounded-full mb-4 ${
                score >= 70 ? 'bg-green-500/20 border-2 border-green-500' : 'bg-red-500/20 border-2 border-red-500'
              }`}>
                {score >= 70 ? (
                  <Award size={64} className="text-green-400" />
                ) : (
                  <XCircle size={64} className="text-red-400" />
                )}
              </div>
              <h3 className="text-3xl font-bold mb-2">
                {score >= 70 ? 'Congratulations!' : 'Keep Learning!'}
              </h3>
              <p className="text-xl text-gray-300 mb-4">
                You scored <span className="font-bold text-gold-400">{score}%</span>
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/20 border border-gold-500 rounded-xl">
                <Award size={24} className="text-gold-400" />
                <span className="text-xl font-bold">+{earnedXP} XP Earned!</span>
              </div>
            </div>

            <div className="bg-owl-slate/50 rounded-xl p-4 border border-gold-800">
              <div className="text-center mb-4">
                <div className="text-sm text-gray-400 mb-2">Your Performance</div>
                <div className="flex items-center justify-center gap-8">
                  <div>
                    <CheckCircle size={24} className="text-green-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-green-400">{correctCount}</div>
                    <div className="text-xs text-gray-500">Correct</div>
                  </div>
                  <div>
                    <XCircle size={24} className="text-red-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-red-400">{questions.length - correctCount}</div>
                    <div className="text-xs text-gray-500">Incorrect</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-lg">Review Answers:</h4>
              {questions.map((q, idx) => {
                const userAnswer = selectedAnswers[idx];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div key={q.id} className={`rounded-xl p-4 border-2 ${
                    isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-start gap-3 mb-3">
                      {isCorrect ? (
                        <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold mb-2">{idx + 1}. {q.question}</div>
                        <div className="space-y-1 text-sm">
                          {userAnswer !== undefined && (
                            <div className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                              Your answer: {q.options[userAnswer]}
                            </div>
                          )}
                          {!isCorrect && (
                            <div className="text-green-400">
                              Correct answer: {q.options[q.correctAnswer]}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-400 bg-black/30 rounded p-2">
                          {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-owl-gradient hover:shadow-gold-glow rounded-xl font-bold transition-all"
            >
              Back to Academy
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-400">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="flex gap-1">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentQuestion
                        ? 'bg-gold-400 w-6'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-owl-slate/50 rounded-xl p-6 border border-gold-800">
              <h3 className="text-xl font-bold mb-6">{currentQ.question}</h3>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      currentAnswer === idx
                        ? 'border-gold-500 bg-gold-500/20 shadow-gold-glow'
                        : 'border-gray-700 hover:border-gold-700 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        currentAnswer === idx
                          ? 'border-gold-500 bg-gold-500'
                          : 'border-gray-600'
                      }`}>
                        {currentAnswer === idx && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-all"
              >
                Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswers.filter(a => a !== undefined).length < questions.length || isSubmitting}
                  className="flex-1 py-3 bg-owl-gradient hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quiz
                      <Award size={20} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentAnswer === undefined}
                  className="flex-1 py-3 bg-owl-gradient hover:shadow-gold-glow disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                >
                  Next Question
                  <ArrowRight size={20} />
                </button>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              {selectedAnswers.filter(a => a !== undefined).length} of {questions.length} questions answered
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
