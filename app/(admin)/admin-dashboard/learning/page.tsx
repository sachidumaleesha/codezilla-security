// app/admin-dashboard/learning/page.tsx
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

type Learning = {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT";
  visibility: "PUBLIC" | "PRIVATE";
  jobRoles: { jobRole: { id: string; name: string } }[];
};

const learningSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),
  type: z.enum(["VIDEO", "TEXT"]),
});

type LearningFormData = z.infer<typeof learningSchema>;

export default function LearningPage() {
  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [learningToDelete, setLearningToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [contentTypeFilter, setContentTypeFilter] = useState<
    "ALL" | "VIDEO" | "TEXT"
  >("ALL");
  const router = useRouter();

  const form = useForm<LearningFormData>({
    resolver: zodResolver(learningSchema),
    defaultValues: {
      title: "",
      type: "VIDEO",
    },
  });

  useEffect(() => {
    fetchLearnings();
  }, []);

  const fetchLearnings = async () => {
    try {
      const response = await fetch("/api/learning");
      if (!response.ok) throw new Error("Failed to fetch learnings");
      const data = await response.json();
      setLearnings(data);
    } catch (error) {
      console.error("Error fetching learnings:", error);
      toast.error("Failed to fetch learnings");
    }
  };

  const handleAddLearning = async (data: LearningFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add learning");
      const addedLearning = await response.json();
      setLearnings([...learnings, addedLearning]);
      toast.success("Learning added successfully");
      setIsAddDialogOpen(false);
      form.reset();
      router.push(`/admin-dashboard/learning/${addedLearning.id}/edit`);
    } catch (error) {
      console.error("Error adding learning:", error);
      toast.error("Failed to add learning");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateVisibility = async (
    id: string,
    visibility: "PUBLIC" | "PRIVATE"
  ) => {
    try {
      const response = await fetch("/api/learning", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, visibility }),
      });
      if (!response.ok) throw new Error("Failed to update learning visibility");
      const updatedLearning = await response.json();
      setLearnings(
        learnings.map((learning) =>
          learning.id === updatedLearning.id ? updatedLearning : learning
        )
      );
      toast.success("Learning visibility updated successfully");
    } catch (error) {
      console.error("Error updating learning visibility:", error);
      toast.error("Failed to update learning visibility");
    }
  };

  const handleDeleteLearning = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/learning", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete learning");
      }
      setLearnings(learnings.filter((learning) => learning.id !== id));
      toast.success("Learning deleted successfully");
    } catch (error) {
      console.error("Error deleting learning:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete learning"
      );
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setLearningToDelete(null);
    }
  };

  const columns: ColumnDef<Learning>[] = [
    {
      accessorKey: "title",
      header: "Title of the Learning",
    },
    {
      accessorKey: "jobRoles",
      header: "Job",
      cell: ({ row }) => {
        const jobRoles = row.original.jobRoles;
        return jobRoles && jobRoles.length > 0
          ? jobRoles.map((jr) => jr.jobRole.name).join(", ")
          : "No job roles assigned";
      },
    },
    {
      accessorKey: "type",
      header: "Content Type",
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
              router.push(`/admin-dashboard/learning/${row.original.id}/edit`)
            }
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setLearningToDelete(row.original.id);
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredLearnings = learnings.filter((learning) => {
    if (contentTypeFilter === "ALL") return true;
    return learning.type === contentTypeFilter;
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Learning" />
      <div className="flex justify-between mb-4">
        <Select
          value={contentTypeFilter}
          onValueChange={(value: "ALL" | "VIDEO" | "TEXT") =>
            setContentTypeFilter(value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Content</SelectItem>
            <SelectItem value="VIDEO">Only Video Content</SelectItem>
            <SelectItem value="TEXT">Only Text Content</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          Add New Learning <CirclePlus size={20} className="ml-1 inline"/>
        </Button>
      </div>
      <DataTable columns={columns} data={filteredLearnings} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Learning</DialogTitle>
            <DialogDescription>
              Enter the title and select the type for the new learning content.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddLearning)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter learning title" {...field} />
                    </FormControl>
                    <FormDescription>
                      The title of the learning content (2-100 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIDEO">Video</SelectItem>
                          <SelectItem value="TEXT">Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Choose the type of learning content.
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
                  {isLoading ? "Adding..." : "Add Learning"}
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
              Are you sure you want to delete this learning content? This action
              cannot be undone.
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
                learningToDelete && handleDeleteLearning(learningToDelete)
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
