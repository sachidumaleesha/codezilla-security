"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";

const answerSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
});

const questionSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Question title is required"),
  answers: z.array(answerSchema)
    .min(2, "At least two answers are required")
    .refine((answers) => answers.some((answer) => answer.isCorrect), {
      message: "At least one answer must be correct",
    }),
});

const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  jobRoleId: z.string().nullable(),
  questions: z.array(questionSchema),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface JobRole {
  id: string;
  name: string;
}

interface QuizQuestion {
  id: string;
  title: string;
  answers: {
    text: string;
    isCorrect: boolean;
  }[];
}

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      jobRoleId: null,
      questions: [],
    },
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const fetchJobRoles = useCallback(async () => {
    try {
      const response = await fetch("/api/job-roles");
      if (!response.ok) throw new Error("Failed to fetch job roles");
      const data = await response.json();
      setJobRoles(data);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      toast.error("Failed to fetch job roles");
    }
  }, []);

  const fetchQuizData = useCallback(async () => {
    try {
      const response = await fetch(`/api/quiz/${params.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch quiz data");
      }
      const data = await response.json();
      form.reset({
        title: data.title,
        jobRoleId: data.jobRole?.id || null,
        questions: data.questions.map((q: QuizQuestion) => ({
          id: q.id,
          title: q.title,
          answers: q.answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        })),
      });
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch quiz data");
    }
  }, [params.id, form]);

  useEffect(() => {
    fetchJobRoles();
    fetchQuizData();
  }, [fetchJobRoles, fetchQuizData]);

  const onSubmit = async (data: QuizFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quiz/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update quiz");
      }
      toast.success("Quiz updated successfully");
      router.push("/admin-dashboard/quiz");
    } catch (error) {
      console.error("Error updating quiz:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update quiz");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Edit Quiz" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quiz Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter quiz title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jobRoleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Role</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                  value={field.value || "none"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No job role</SelectItem>
                    {jobRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            {questionFields.map((field, questionIndex) => (
              <Card key={field.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Question {questionIndex + 1}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeQuestion(questionIndex)}
                    >
                      Remove Question
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter question title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-4 space-y-2">
                    {form.watch(`questions.${questionIndex}.answers`)?.map((_, answerIndex) => (
                      <div key={answerIndex} className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.text`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormControl>
                                <Input placeholder="Enter answer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`questions.${questionIndex}.answers.${answerIndex}.isCorrect`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="ml-2">Correct</FormLabel>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const answers = form.getValues(`questions.${questionIndex}.answers`);
                            if (answers.length > 2) {
                              const newAnswers = [...answers];
                              newAnswers.splice(answerIndex, 1);
                              form.setValue(`questions.${questionIndex}.answers`, newAnswers);
                            } else {
                              toast.error("A question must have at least two answers");
                            }
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const answers = form.getValues(`questions.${questionIndex}.answers`) || [];
                      form.setValue(`questions.${questionIndex}.answers`, [
                        ...answers,
                        { text: "", isCorrect: false },
                      ]);
                    }}
                  >
                    Add Answer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => appendQuestion({ title: "", answers: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] })}
          >
            Add Question
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
