// app/api/contact/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as z from 'zod'

const prisma = new PrismaClient()

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = formSchema.parse(json)

    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
      },
    })

    return NextResponse.json({ success: true, data: contactSubmission })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
