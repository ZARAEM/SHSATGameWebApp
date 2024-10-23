import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { score } = body;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { score },
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error("Error updating student score:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
