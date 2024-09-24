"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import Confetti from "react-confetti";
import { useToast } from "@/hooks/use-toast";
import QuizResults from "./results";

type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  title: string;
  answers: Answer[];
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

type QuizAttempt = {
  id: string;
  score: number;
  totalQuestions: number;
  completed: boolean;
  attemptNumber: number;
};

export default function QuizTakingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [previousAttempt, setPreviousAttempt] = useState<QuizAttempt | null>(
    null
  );
  const [canRetake, setCanRetake] = useState(true);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [attemptsLeft, setAttemptsLeft] = useState(2);

  console.log(attemptNumber)

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/quizzes/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Quiz not found");
        }
        throw new Error("Failed to fetch quiz");
      }
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load quiz. Please try again.",
        variant: "destructive",
      });
      if (error instanceof Error && error.message === "Quiz not found") {
        router.push("/user-dashboard/take-quiz");
      }
    }
  }, [id, toast, router]);

  const fetchPreviousAttempt = useCallback(async () => {
    try {
      const response = await fetch(`/api/quizzes/${id}/attempt`);
      if (response.ok) {
        const data = await response.json();
        setPreviousAttempt(data.latestAttempt);
        setAttemptsLeft(data.attemptsLeft);
        if (data.latestAttempt) {
          const passThreshold = Math.ceil(data.latestAttempt.totalQuestions / 2);
          setCanRetake(data.attemptsLeft > 0 && data.latestAttempt.score < passThreshold);
          setAttemptNumber(data.latestAttempt.attemptNumber + 1);
        }
      }
    } catch (error) {
      console.error("Error fetching previous attempt:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchQuiz();
    fetchPreviousAttempt();
  }, [fetchQuiz, fetchPreviousAttempt]);

  const isMultipleChoice = (question: Question) => {
    return question.answers.filter((a) => a.isCorrect).length > 1;
  };

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswerSubmitted) return;

    const currentQuestion = quiz!.questions[currentQuestionIndex];
    if (isMultipleChoice(currentQuestion)) {
      setSelectedAnswers((prev) =>
        prev.includes(answerId)
          ? prev.filter((id) => id !== answerId)
          : [...prev, answerId]
      );
    } else {
      setSelectedAnswers([answerId]);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswers.length === 0) return;

    const currentQuestion = quiz!.questions[currentQuestionIndex];
    const correctAnswers = currentQuestion.answers.filter((a) => a.isCorrect);

    const isCorrect = isMultipleChoice(currentQuestion)
      ? correctAnswers.every((a) => selectedAnswers.includes(a.id)) &&
        selectedAnswers.length === correctAnswers.length
      : correctAnswers.some((a) => a.id === selectedAnswers[0]);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedAnswers([]);
      setIsAnswerSubmitted(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const totalQuestions = quiz!.questions.length;
    const passThreshold = Math.ceil(totalQuestions / 2);
    const passed = score >= passThreshold;

    if (passed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    try {
      const response = await fetch(`/api/quizzes/${id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, totalQuestions, passed }),
      });

      if (!response.ok) {
        throw new Error("Failed to record quiz completion");
      }

      const data = await response.json();
      setPreviousAttempt(data.quizAttempt);
      setQuizCompleted(true);
      setCanRetake(data.attemptsLeft > 0 && data.quizAttempt.score < passThreshold);
      setAttemptsLeft(data.attemptsLeft);
    } catch (error) {
      console.error("Error marking quiz as complete:", error);
      toast({
        title: "Error",
        description: "Failed to save quiz results. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!quiz) return <div>Loading...</div>;

  if (attemptsLeft === 0) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title={quiz.title} />
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Maximum Attempts Reached</h2>
            <p>You have exceeded the maximum number of attempts for this quiz.</p>
            {previousAttempt && (
              <p>Your best score: {previousAttempt.score} / {previousAttempt.totalQuestions}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/user-dashboard/take-quiz")}>Back to Quizzes</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (previousAttempt && !canRetake && previousAttempt.completed) {
    return (
      <div className="flex flex-col gap-5 w-full">
        <PageTitle title={quiz.title} />
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed</h2>
            <p>You have already completed this quiz and cannot retake it.</p>
            <p>Your best score: {previousAttempt.score} / {previousAttempt.totalQuestions}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/user-dashboard/take-quiz")}>Back to Quizzes</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title={quiz.title} />
      {previousAttempt && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">Previous Attempt</p>
          <p>
            Score: {previousAttempt.score} / {previousAttempt.totalQuestions}
          </p>
          <p>
            Attempt Number: {previousAttempt.attemptNumber}
          </p>
          <p>
            Attempts Left: {attemptsLeft}
          </p>
        </div>
      )}
      {!quizCompleted ? (
        quiz.questions.length > 0 ? (
          <>
            <Progress value={progress} className="w-full" />
            <Card>
              <CardHeader>
                <CardTitle>
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">
                  {currentQuestion.title}
                </h3>
                {isMultipleChoice(currentQuestion) ? (
                  currentQuestion.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <Checkbox
                        id={answer.id}
                        checked={selectedAnswers.includes(answer.id)}
                        onCheckedChange={() => handleAnswerSelect(answer.id)}
                        disabled={isAnswerSubmitted}
                        className={
                          isAnswerSubmitted
                            ? answer.isCorrect
                              ? "border-green-500"
                              : selectedAnswers.includes(answer.id)
                              ? "border-red-500"
                              : ""
                            : ""
                        }
                      />
                      <Label
                        htmlFor={answer.id}
                        className={
                          isAnswerSubmitted
                            ? answer.isCorrect
                              ? "text-green-500"
                              : selectedAnswers.includes(answer.id)
                              ? "text-red-500"
                              : ""
                            : ""
                        }
                      >
                        {answer.text}
                      </Label>
                    </div>
                  ))
                ) : (
                  <RadioGroup
                    value={selectedAnswers[0] || ""}
                    onValueChange={handleAnswerSelect}
                  >
                    {currentQuestion.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <RadioGroupItem
                          value={answer.id}
                          id={answer.id}
                          disabled={isAnswerSubmitted}
                          className={
                            isAnswerSubmitted
                              ? answer.isCorrect
                                ? "border-green-500"
                                : selectedAnswers[0] === answer.id
                                ? "border-red-500"
                                : ""
                              : ""
                          }
                        />
                        <Label
                          htmlFor={answer.id}
                          className={
                            isAnswerSubmitted
                              ? answer.isCorrect
                                ? "text-green-500"
                                : selectedAnswers[0] === answer.id
                                ? "text-red-500"
                                : ""
                              : ""
                          }
                        >
                          {answer.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {!isAnswerSubmitted ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswers.length === 0}
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < quiz.questions.length - 1
                      ? "Next Question"
                      : "Finish Quiz"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
              <p>Questions are not yet added to this quiz.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/user-dashboard/take-quiz")}>Back to Quizzes</Button>
            </CardFooter>
          </Card>
        )
      ) : (
        <QuizResults
          score={score}
          totalQuestions={quiz.questions.length}
          quizId={quiz.id}
          onQuizMarkedAsDone={() => router.push("/user-dashboard/take-quiz")}
          canRetake={canRetake}
        />
      )}
      {showConfetti && <Confetti />}
    </div>
  );
}