'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import PageTitle from "@/components/PageTitle"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import QuizGrid from "./QuizGrid"

const filterSchema = z.object({
  search: z.string().optional(),
})

type FilterValues = z.infer<typeof filterSchema>

type Quiz = {
  id: string
  title: string
  jobRole?: {
    name: string
  }
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const router = useRouter()

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
    },
  })

  useEffect(() => {
    fetchQuizzes()
  }, [])

  const fetchQuizzes = async (filters?: FilterValues) => {
    let url = "/api/quizzes"
    if (filters?.search) {
      url += `?search=${encodeURIComponent(filters.search)}`
    }
    const response = await fetch(url)
    const data = await response.json()
    setQuizzes(data)
  }

  const onSubmit = (values: FilterValues) => {
    fetchQuizzes(values)
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Quizzes" />
      <Form {...form}>
        <form onChange={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Search</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Search quizzes or job roles..." 
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
      <QuizGrid
        quizzes={quizzes}
        onItemClick={(id) => router.push(`/user-dashboard/take-quiz/${id}`)}
      />
    </div>
  )
}