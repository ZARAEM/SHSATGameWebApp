import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const students = await prisma.student.findMany();
    const sortedStudents = [...students].sort((a, b) => b.score - a.score);
    const midPoint = Math.ceil(sortedStudents.length / 2);

    await Promise.all([
      ...sortedStudents.slice(0, midPoint).map((student) =>
        prisma.student.update({
          where: { id: student.id },
          data: { teamNumber: 1 },
        })
      ),
      ...sortedStudents.slice(midPoint).map((student) =>
        prisma.student.update({
          where: { id: student.id },
          data: { teamNumber: 2 },
        })
      ),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create teams" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await prisma.student.updateMany({
      data: { teamNumber: null },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reset teams" },
      { status: 500 }
    );
  }
}
