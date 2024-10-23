"use client";

import { StudentScoreboard } from "@/components/student-scoreboard";
import { TeamScoreboard } from "@/components/team-scoreboard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [password, setPassword] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const router = useRouter();

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data: Student[] = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleTeamsSplit = async () => {
    try {
      const method = showTeams ? "DELETE" : "POST";
      const response = await fetch("/api/teams", { method });
      if (!response.ok) throw new Error("Failed to manage teams");
      await fetchStudents();
      setShowTeams(!showTeams);
    } catch (error) {
      console.error("Error managing teams:", error);
    }
  };

  const handleAdminAccess = () => {
    if (password === "admin123") {
      router.push("/admin");
    } else {
      alert("Incorrect password");
    }
    setPassword("");
    setIsDialogOpen(false);
  };

  return (
    <main className="flex h-screen">
      <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">SHSAT GAMESHOW</h1>
          <div className="space-x-4">
            <Link href="/game">
              <Button>Start Game</Button>
            </Link>
            <Button variant="secondary" onClick={handleTeamsSplit}>
              {showTeams ? "Reset Teams" : "Split Teams"}
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Admin Access</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enter Admin Password</DialogTitle>
                </DialogHeader>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <Button onClick={handleAdminAccess}>Submit</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="w-80">
        <TeamScoreboard students={students} showTeams={showTeams} />
      </div>
    </main>
  );
}
