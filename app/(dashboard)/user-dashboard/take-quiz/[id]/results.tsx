import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"

type QuizResultsProps = {
  score: number
  totalQuestions: number
  quizId: string
  onQuizMarkedAsDone: () => void
  canRetake: boolean
}

export default function QuizResults({ score, totalQuestions, quizId, onQuizMarkedAsDone }: QuizResultsProps) {
  const { toast } = useToast()
  const [isMarking, setIsMarking] = useState(false)
  const passed = score >= Math.ceil(totalQuestions / 2)

  const handleMarkAsDone = async () => {
    if (!passed) return

    setIsMarking(true)
    try {
      const response = await fetch(`/api/quizzes/${quizId}/mark-as-done`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to mark quiz as done')
      }

      toast({
        title: 'Success',
        description: 'Quiz marked as done!',
      })
      onQuizMarkedAsDone()
    } catch (error) {
      console.error('Error marking quiz as done:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark quiz as done. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsMarking(false)
    }
  }

  return (
    <div className="mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      <p className="text-xl mb-4">
        You scored {score} out of {totalQuestions} questions correctly.
      </p>
      {passed ? (
        <p className="text-green-500 mb-4">Congratulations! You passed the quiz.</p>
      ) : (
        <p className="text-red-500 mb-4">Unfortunately, you didn&apos;t pass the quiz. Keep practicing!</p>
      )}
      <Button
        onClick={handleMarkAsDone}
        disabled={!passed || isMarking}
      >
        {isMarking ? 'Marking...' : 'Mark Quiz as Done'}
      </Button>
    </div>
  )
}
