"use client";
import React from "react";
import PageTitle from "@/components/PageTitle";
import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Settings" />
      <UserProfile/>
    </div>
  );
}