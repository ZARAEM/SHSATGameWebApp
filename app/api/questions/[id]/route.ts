import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { choices, ...questionData } = body;

    const updatedQuestion = await prisma.question.update({
      where: { id },
      data: {
        ...questionData,
        timeAllowed: Number(questionData.timeAllowed),
        points: Number(questionData.points),
        choices: {
          deleteMany: {},
          create: choices.map((choice: { text: string; choiceId: string }) => ({
            text: choice.text,
            choiceId: choice.choiceId,
          })),
        },
      },
      include: {
        choices: true,
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    const updatedQuestion = await prisma.question.update({
      where: { id: id },
      data: { ...body, askedInSession: body.askedInSession ?? false },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.question.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
