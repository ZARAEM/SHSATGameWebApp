"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Student } from "@/types/student";

interface StudentScoreboardProps {
  students: Student[];
  width?: number;
}

export function StudentScoreboard({
  students,
  width = 300,
}: StudentScoreboardProps) {
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  return (
    <Card
      className="h-full rounded-none border-l border-r-0 border-t-0 border-b-0"
      style={{ width: `${width}px` }}
    >
      <CardHeader className="p-4">
        <CardTitle>Student Scores</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <ul className="space-y-2 px-4">
            {sortedStudents.map((student) => (
              <li
                key={student.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <span className="font-medium">{student.name}</span>
                <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  {student.score}
                </span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
