// app/admin-dashboard/job-roles/page.tsx
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
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CirclePlus } from "lucide-react";

type JobRole = {
  id: string;
  name: string;
};

const jobRoleSchema = z.object({
  name: z
    .string()
    .min(2, "Job role name must be at least 2 characters")
    .max(50, "Job role name must be at most 50 characters"),
});

type JobRoleFormData = z.infer<typeof jobRoleSchema>;

const JobRolesPage: React.FC = () => {
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [updateJobRole, setUpdateJobRole] = useState<JobRole | null>(null);
  const [deleteJobRoleId, setDeleteJobRoleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addForm = useForm<JobRoleFormData>({
    resolver: zodResolver(jobRoleSchema),
    defaultValues: {
      name: "",
    },
  });

  const updateForm = useForm<JobRoleFormData>({
    resolver: zodResolver(jobRoleSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    fetchJobRoles();
  }, []);

  useEffect(() => {
    if (updateJobRole) {
      updateForm.reset({ name: updateJobRole.name });
    }
  }, [updateJobRole, updateForm]);

  const fetchJobRoles = async () => {
    try {
      const response = await fetch("/api/job-roles");
      if (!response.ok) throw new Error("Failed to fetch job roles");
      const data = await response.json();
      setJobRoles(data);
    } catch (error) {
      console.error("Error fetching job roles:", error);
      toast.error("Failed to fetch job roles");
    }
  };

  const handleAddJobRole = async (data: JobRoleFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/job-roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add job role");
      const addedJobRole = await response.json();
      setJobRoles([...jobRoles, addedJobRole]);
      toast.success("Job role added successfully");
      setIsAddDialogOpen(false);
      addForm.reset();
    } catch (error) {
      console.error("Error adding job role:", error);
      toast.error("Failed to add job role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateJobRole = async (data: JobRoleFormData) => {
    if (!updateJobRole) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/job-roles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: updateJobRole.id, ...data }),
      });
      if (!response.ok) throw new Error("Failed to update job role");
      const updatedJobRole = await response.json();
      setJobRoles(
        jobRoles.map((role) =>
          role.id === updatedJobRole.id ? updatedJobRole : role
        )
      );
      toast.success("Job role updated successfully");
      setIsUpdateDialogOpen(false);
      setUpdateJobRole(null);
      updateForm.reset();
    } catch (error) {
      console.error("Error updating job role:", error);
      toast.error("Failed to update job role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJobRole = async () => {
    if (!deleteJobRoleId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/job-roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteJobRoleId }),
      });
      if (!response.ok) throw new Error("Failed to delete job role");
      setJobRoles(jobRoles.filter((role) => role.id !== deleteJobRoleId));
      toast.success("Job role deleted successfully");
    } catch (error) {
      console.error("Error deleting job role:", error);
      toast.error("Failed to delete job role");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteJobRoleId(null);
    }
  };

  const columns: ColumnDef<JobRole>[] = [
    {
      accessorKey: "name",
      header: "Job Role",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const jobRole = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUpdateJobRole(jobRole);
                setIsUpdateDialogOpen(true);
              }}
            >
              Update
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeleteJobRoleId(jobRole.id);
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Job Roles" />
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddDialogOpen(true)} className="w-fit">
          Add New Job Role <CirclePlus className="inline ml-2" size={20} />
        </Button>
      </div>
      <DataTable columns={columns} data={jobRoles} />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Job Role</DialogTitle>
            <DialogDescription>
              Enter the name of the new job role you want to add.
            </DialogDescription>
          </DialogHeader>
          <Form {...addForm}>
            <form
              onSubmit={addForm.handleSubmit(handleAddJobRole)}
              className="space-y-8"
            >
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter job role name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the job role (2-50 characters).
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
                  {isLoading ? "Adding..." : "Add Job Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Job Role</DialogTitle>
            <DialogDescription>
              Update the name of the selected job role.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(handleUpdateJobRole)}
              className="space-y-8"
            >
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter updated job role name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The updated name of the job role (2-50 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Job Role"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this job role?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the job
              role.
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
              onClick={handleDeleteJobRole}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default JobRolesPage;
