'use client'

import React, { useState } from 'react'
import { useAuth, useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Toaster, toast } from 'react-hot-toast'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

const resetSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  code: z.string().min(6, { message: "Code must be at least 6 characters" }),
})

export default function ForgotPasswordPage() {
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const [secondFactor, setSecondFactor] = useState(false)

  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { isLoaded, signIn, setActive } = useSignIn()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      code: "",
    },
  })

  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    router.push('/')
    return null
  }

  async function onEmailSubmit(values: z.infer<typeof emailSchema>) {
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: values.email,
      })
      setSuccessfulCreation(true)
      toast.success("Reset code sent to your email")
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage)
      toast.error(err.errors[0].longMessage)
    }
  }

  async function onResetSubmit(values: z.infer<typeof resetSchema>) {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: values.code,
        password: values.password,
      })

      if (result?.status === 'needs_second_factor') {
        setSecondFactor(true)
        toast.error("2FA is required, but this UI does not handle that")
      } else if (result?.status === 'complete') {
        if(setActive) {
          setActive({ session: result.createdSessionId })
        }
        toast.success("Password reset successful")
        router.push('/')
      } else {
        console.log(result)
      }
    } catch (err: any) {
      console.error('error', err.errors[0].longMessage)
      toast.error(err.errors[0].longMessage)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Toaster position="top-center" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            {!successfulCreation
              ? "Enter your email to receive a password reset code"
              : "Enter your new password and the reset code sent to your email"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!successfulCreation ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Send Reset Code</Button>
              </form>
            </Form>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reset Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Reset Password</Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter>
          {secondFactor && (
            <p className="text-sm text-muted-foreground">2FA is required, but this UI does not handle that</p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}