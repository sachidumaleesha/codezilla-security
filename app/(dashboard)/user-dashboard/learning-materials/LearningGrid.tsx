import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { PlayCircle, FileText, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Learning = {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT";
  jobRoles: { jobRole: { name: string } }[];
};

type KnowledgeGridProps = {
  learnings: Learning[];
  onItemClick: (id: string) => void;
};

export default function LearningGrid({
  learnings,
  onItemClick,
}: KnowledgeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {learnings.map((learning) => (
        <Card
          key={learning.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => onItemClick(learning.id)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {learning.type === "VIDEO" ? (
                <PlayCircle className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
              {learning.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              {learning.type === "VIDEO" ? "Video Content" : "Text Content"}
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex flex-wrap gap-2">
              {learning.jobRoles.map((jobRole, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Briefcase className="h-3 w-3" />
                  {jobRole.jobRole.name}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
