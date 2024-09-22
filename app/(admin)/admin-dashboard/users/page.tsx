"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast, { Toaster } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

type User = {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  photo: string | null;
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN" | "SUPER_ADMIN">("ALL");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: "USER" | "ADMIN") => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (!response.ok) throw new Error('Failed to update user role');
      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === userId ? updatedUser : user));
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteUserId }),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(user => user.id !== deleteUserId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setDeleteUserId(null);
    }
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Image
              className="h-10 w-10 rounded-full"
              src={user.photo || `https://api.dicebear.com/7.x/lorelei/svg?seed=${user.username}`}
              alt={`${user.username}'s avatar`}
              width={40}
              height={40}
            />
            <span>{user.username}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        if (user.role === "SUPER_ADMIN") {
          return <span className="font-semibold text-primary">{user.role}</span>;
        }
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {user.role} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "USER")}>
                USER
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "ADMIN")}>
                ADMIN
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setDeleteUserId(user.id);
              setIsDeleteDialogOpen(true);
            }}
            disabled={user.role === "SUPER_ADMIN"}
          >
            Delete
          </Button>
        );
      },
    },
  ];

  const filteredUsers = users.filter(user => {
    if (roleFilter === "ALL") return true;
    return user.role === roleFilter;
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Users" />
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filter by Role <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Select Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setRoleFilter("ALL")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("USER")}>Users</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("ADMIN")}>Admins</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRoleFilter("SUPER_ADMIN")}>Super Admins</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable columns={columns} data={filteredUsers} />
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  );
};

export default UsersPage;