"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Student } from "@/types/student";

export default function EditStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editScore, setEditScore] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setEditName(student.name);
    setEditScore(student.score.toString());
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      const response = await fetch(`/api/students/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, score: parseInt(editScore) }),
      });
      if (!response.ok) throw new Error("Failed to update student");
      fetchStudents();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete student");
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleResetAllScores = async () => {
    setIsResetting(true);
    try {
      await Promise.all(
        students.map((student) =>
          fetch(`/api/students/${student.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score: 0 }),
          })
        )
      );

      await fetchStudents();
    } catch (error) {
      console.error("Error resetting scores:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">
      <AdminHeader title="Edit Students" />
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-end">
          <Button
            onClick={handleResetAllScores}
            variant="destructive"
            disabled={isResetting || students.length === 0}
          >
            {isResetting ? "Resetting..." : "Reset All Scores to 0"}
          </Button>
        </div>
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between mb-4"
          >
            {editingId === student.id ? (
              <>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mr-2"
                  placeholder="Name"
                />
                <Input
                  value={editScore}
                  onChange={(e) => setEditScore(e.target.value)}
                  className="mr-2"
                  placeholder="Score"
                  type="number"
                />
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <>
                <span>
                  {student.name} (Score: {student.score})
                </span>
                <div>
                  <Button onClick={() => handleEdit(student)} className="mr-2">
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(student.id)}
                    variant="destructive"
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
