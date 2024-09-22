// app/admin-dashboard/contact-submissions/page.tsx
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
import toast, { Toaster } from "react-hot-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const ContactSubmissionsPage: React.FC = () => {
  const [contactSubmissions, setContactSubmissions] = useState<
    ContactSubmission[]
  >([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContactSubmissions();
  }, []);

  const fetchContactSubmissions = async () => {
    try {
      const response = await fetch("/api/contact-submissions");
      if (!response.ok) throw new Error("Failed to fetch contact submissions");
      const data = await response.json();
      setContactSubmissions(data);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteSubmission = async () => {
    if (!deleteSubmissionId) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/contact-submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteSubmissionId }),
      });
      if (!response.ok) throw new Error("Failed to delete contact submission");
      setContactSubmissions((submissions) =>
        submissions.filter((submission) => submission.id !== deleteSubmissionId)
      );
      toast.success("Successfully Deleted");
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteSubmissionId(null);
    }
  };

  const columns: ColumnDef<ContactSubmission>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const message = row.original.message;
        const truncatedMessage =
          message.length > 20 ? `${message.substring(0, 20)}...` : message;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>{truncatedMessage}</TooltipTrigger>
              <TooltipContent>
                <p>{message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted At",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleString();
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const submission = row.original;
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setDeleteSubmissionId(submission.id);
              setIsDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Contact Submissions" />
      <DataTable columns={columns} data={contactSubmissions} />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this contact submission?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              contact submission.
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
              onClick={handleDeleteSubmission}
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

export default ContactSubmissionsPage;
