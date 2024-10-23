"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Student } from "@/types/student";
import { motion, AnimatePresence } from "framer-motion";

interface TeamScoreboardProps {
  students: Student[];
  showTeams: boolean;
  width?: number;
}

export function TeamScoreboard({
  students,
  showTeams,
  width = 300,
}: TeamScoreboardProps) {
  const sortedStudents = [...students].sort((a, b) => b.score - a.score);

  if (!showTeams) {
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

  const getTeams = () => {
    const shuffled = [...sortedStudents].sort(() => Math.random() - 0.5);
    const midPoint = Math.ceil(shuffled.length / 2);

    const team1 = shuffled.slice(0, midPoint).sort((a, b) => b.score - a.score);
    const team2 = shuffled.slice(midPoint).sort((a, b) => b.score - a.score);
    return { team1, team2 };
  };

  const { team1, team2 } = getTeams();
  const team1Score = team1.reduce((sum, student) => sum + student.score, 0);
  const team2Score = team2.reduce((sum, student) => sum + student.score, 0);

  const getOriginalY = (studentId: string) => {
    const index = sortedStudents.findIndex((s) => s.id === studentId);
    return index * 40;
  };

  return (
    <Card
      className="h-full rounded-none border-l border-r-0 border-t-0 border-b-0"
      style={{ width: `${width}px` }}
    >
      <CardHeader className="p-4">
        <CardTitle>Team Scores</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="px-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-bold text-primary">Team 1</span>
              <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {team1Score}
              </span>
            </div>
            <AnimatePresence>
              {team1.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ y: getOriginalY(student.id), opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.1,
                  }}
                  className="flex justify-between items-center py-2"
                >
                  <span className="font-medium">{student.name}</span>
                  <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {student.score}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="my-4 border-t-2 border-primary" />

            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-bold text-primary">Team 2</span>
              <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {team2Score}
              </span>
            </div>
            <AnimatePresence>
              {team2.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ y: getOriginalY(student.id), opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: index * 0.1,
                  }}
                  className="flex justify-between items-center py-2"
                >
                  <span className="font-medium">{student.name}</span>
                  <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {student.score}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
