'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import PageTitle from "@/components/PageTitle"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import LearningGrid from "./LearningGrid"

const filterSchema = z.object({
  contentType: z.enum(["ALL", "VIDEO", "TEXT"]).default("ALL"),
  search: z.string().optional(),
})

type FilterValues = z.infer<typeof filterSchema>

export default function LearningMaterialsPage() {
  const [learnings, setLearnings] = useState([])
  const router = useRouter()

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      contentType: "ALL",
      search: "",
    },
  })

  useEffect(() => {
    fetchLearnings()
  }, [])

  const fetchLearnings = async (filters?: FilterValues) => {
    let url = "/api/learnings"
    if (filters) {
      const params = new URLSearchParams()
      if (filters.contentType !== "ALL")
        params.append("contentType", filters.contentType)
      if (filters.search) params.append("search", filters.search)
      url += `?${params.toString()}`
    }
    const response = await fetch(url)
    const data = await response.json()
    setLearnings(data)
  }

  const onSubmit = (values: FilterValues) => {
    fetchLearnings(values)
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Learning Materials" />
      <Form {...form}>
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Content Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.handleSubmit(onSubmit)()
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="VIDEO">Video</SelectItem>
                      <SelectItem value="TEXT">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Search content or job names..." 
                      {...field} 
                      onChange={(e) => {
                        field.onChange(e)
                        form.handleSubmit(onSubmit)()
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <LearningGrid
        learnings={learnings}
        onItemClick={(id) => router.push(`/user-dashboard/learning-materials/${id}`)}
      />
    </div>
  )
}