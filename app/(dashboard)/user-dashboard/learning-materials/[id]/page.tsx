"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, FileText } from "lucide-react";

type Learning = {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT";
  videoContent?: {
    videoUrl: string;
    videoTitle?: string;
    content: string;
  };
  textContent?: {
    content: string;
  };
};

const getEmbedUrl = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

export default function LearningDetailsPage() {
  const { id } = useParams();
  const [learning, setLearning] = useState<Learning | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLearning = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/learnings/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch learning");
      }
      const data = await response.json();
      setLearning(data);
    } catch (error) {
      console.error("Error fetching learning:", error);
      setError("Failed to load learning content. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLearning();
  }, [fetchLearning]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!learning) {
    return <div>No learning content found.</div>;
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title={learning.title} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {learning.type === "VIDEO" ? (
              <PlayCircle className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
            {learning.type === "VIDEO" ? "Video Content" : "Text Content"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {learning.type === "VIDEO" && learning.videoContent && (
            <div className="space-y-4">
              <div className="w-full h-[450px]">
                <iframe
                  title={learning.videoContent.videoTitle || "Video content"}
                  src={getEmbedUrl(learning.videoContent.videoUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
              <h3 className="text-xl font-semibold">
                {learning.videoContent.videoTitle}
              </h3>
              <div
                className="prose max-w-full w-full"
                dangerouslySetInnerHTML={{
                  __html: learning.videoContent.content,
                }}
              ></div>
            </div>
          )}
          {learning.type === "TEXT" && learning.textContent && (
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: learning.textContent.content }}
            ></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
