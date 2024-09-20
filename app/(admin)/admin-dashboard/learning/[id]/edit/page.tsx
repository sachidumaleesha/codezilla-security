// app/admin-dashboard/learning/[id]/edit/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
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
import { Editor } from "@tinymce/tinymce-react";

const videoLearningSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),
  jobRoles: z.array(z.string()).min(1, "Select at least one job role"),
  type: z.literal("VIDEO"),
  videoUrl: z.string().url("Must be a valid URL"),
  videoTitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
});

const textLearningSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(100, "Title must be at most 100 characters"),
  jobRoles: z.array(z.string()).min(1, "Select at least one job role"),
  type: z.literal("TEXT"),
  content: z.string().min(1, "Content is required"),
});

const learningSchema = z.discriminatedUnion("type", [
  videoLearningSchema,
  textLearningSchema,
]);

type LearningFormData = z.infer<typeof learningSchema>;

export default function EditLearningPage() {
  const params = useParams();
  const router = useRouter();
  const [jobRoles, setJobRoles] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState<"VIDEO" | "TEXT">("TEXT");

  const form = useForm<LearningFormData>({
    resolver: zodResolver(learningSchema),
    defaultValues: {
      title: "",
      jobRoles: [],
      type: "TEXT",
      content: "",
    },
  });

  useEffect(() => {
    fetchJobRoles();
  }, []);

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

  const fetchLearningData = useCallback(async () => {
    try {
      const response = await fetch(`/api/learning/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch learning data');
      const data = await response.json();
      setContentType(data.type);
      if (data.type === "VIDEO") {
        form.reset({
          title: data.title,
          jobRoles: data.jobRoles.map((jr: { jobRole: { id: string } }) => jr.jobRole.id),
          type: "VIDEO",
          videoUrl: data.videoContent?.videoUrl || "",
          videoTitle: data.videoContent?.videoTitle || "",
          content: data.videoContent?.content || "",
        });
      } else {
        form.reset({
          title: data.title,
          jobRoles: data.jobRoles.map((jr: { jobRole: { id: string } }) => jr.jobRole.id),
          type: "TEXT",
          content: data.textContent?.content || "",
        });
      }
    } catch (error) {
      console.error('Error fetching learning data:', error);
      toast.error('Failed to fetch learning data');
    }
  }, [params.id, form]);

  useEffect(() => {
    fetchLearningData();
  }, [fetchLearningData]);

  const onSubmit = async (data: LearningFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/learning/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update learning");
      toast.success("Learning updated successfully");
      router.push("/admin-dashboard/learning");
    } catch (error) {
      console.error("Error updating learning:", error);
      toast.error("Failed to update learning");
    } finally {
      setIsLoading(false);
    }
  };

  const getEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle
        title={`Edit ${contentType === "VIDEO" ? "Video" : "Text"} Content`}
      />
      <div
        className={
          contentType === "VIDEO"
            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
            : "flex justify-center"
        }
      >
        {contentType === "VIDEO" && (
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 bg-slate-200 rounded-lg overflow-hidden">
              {form.watch("videoUrl") ? (
                <iframe
                  title="Video Preview"
                  src={
                    getEmbedUrl(form.watch("videoUrl")) ||
                    form.watch("videoUrl")
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-96"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center text-slate-500 h-96">
                  Enter a video URL to preview
                </div>
              )}
            </div>
          </div>
        )}
        <div className={contentType === "TEXT" ? "w-full max-w-2xl" : ""}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobRoles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Roles</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange([...field.value, value])
                        }
                        value={field.value[field.value.length - 1]}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job roles" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobRoles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Selected roles:{" "}
                      {field.value
                        .map(
                          (id) => jobRoles.find((role) => role.id === id)?.name
                        )
                        .join(", ")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {contentType === "VIDEO" && (
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter video URL" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Editor
                        apiKey="5vol2pvf40c61wf1zbbc83rfk5z0r5f9flmhrw0i0os9d7pu"
                        init={{
                          height: 500,
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help",
                        }}
                        onEditorChange={(content) => field.onChange(content)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Updating..." : "Update Learning"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
