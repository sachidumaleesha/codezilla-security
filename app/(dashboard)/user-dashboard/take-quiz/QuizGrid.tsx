import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Quiz = {
  id: string;
  title: string;
  jobRole?: {
    name: string;
  };
};

type QuizGridProps = {
  quizzes: Quiz[];
  onItemClick: (id: string) => void;
};

export default function QuizGrid({ quizzes, onItemClick }: QuizGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quizzes.map((quiz) => (
        <Card
          key={quiz.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onItemClick(quiz.id)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {quiz.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Click to start the quiz</p>
          </CardContent>
          {quiz.jobRole && (
            <CardFooter>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {quiz.jobRole.name}
              </Badge>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
