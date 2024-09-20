"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CirclePlus } from "lucide-react";

type Quiz = {
  id: string;
  title: string;
  jobRole: { id: string; name: string };
  questions?: { id: string }[];
  visibility: "PUBLIC" | "PRIVATE";
};

const quizSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),
});

type QuizFormData = z.infer<typeof quizSchema>;

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quiz");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch quizzes");
      }
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error(error instanceof Error ? error.message : "Failed to fetch quizzes");
    }
  };

  const handleAddQuiz = async (data: QuizFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add quiz");
      }
      const addedQuiz = await response.json();
      setQuizzes([...quizzes, addedQuiz]);
      toast.success("Quiz added successfully");
      setIsAddDialogOpen(false);
      form.reset();
      router.push(`/admin-dashboard/quiz/${addedQuiz.id}/edit`);
    } catch (error) {
      console.error("Error adding quiz:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVisibility = async (
    id: string,
    visibility: "PUBLIC" | "PRIVATE"
  ) => {
    try {
      const response = await fetch("/api/quiz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visibility }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update quiz visibility");
      }
      const updatedQuiz = await response.json();
      setQuizzes(
        quizzes.map((quiz) =>
          quiz.id === updatedQuiz.id ? updatedQuiz : quiz
        )
      );
      toast.success("Quiz visibility updated successfully");
    } catch (error) {
      console.error("Error updating quiz visibility:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update quiz visibility");
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete quiz");
      }
      setQuizzes(quizzes.filter((quiz) => quiz.id !== id));
      toast.success("Quiz deleted successfully");
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete quiz");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setQuizToDelete(null);
    }
  };

  const columns: ColumnDef<Quiz>[] = [
    {
      accessorKey: "title",
      header: "Title of the Quiz",
    },
    {
      accessorKey: "jobRole.name",
      header: "Job Category",
    },
    {
      accessorKey: "questions",
      header: "Number of Questions",
      cell: ({ row }) => row.original.questions?.length || 0,
    },
    {
      accessorKey: "visibility",
      header: "Visibility",
      cell: ({ row }) => (
        <Select
          value={row.original.visibility}
          onValueChange={(value: "PUBLIC" | "PRIVATE") =>
            handleUpdateVisibility(row.original.id, value)
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              router.push(`/admin-dashboard/quiz/${row.original.id}/edit`)
            }
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setQuizToDelete(row.original.id);
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Quizzes" />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add New Quiz <CirclePlus size={20} className="ml-1 inline"/>
        </Button>
      </div>
      <DataTable columns={columns} data={quizzes} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Quiz</DialogTitle>
            <DialogDescription>
              Enter the title for the new quiz.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddQuiz)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter quiz title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The title of the quiz (2-100 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Quiz"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this quiz? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                quizToDelete && handleDeleteQuiz(quizToDelete)
              }
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}