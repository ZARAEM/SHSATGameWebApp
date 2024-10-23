import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuestionData = {
  text: string;
  subject: string;
  timeAllowed: number;
  points: number;
  questionType: string;
  correctAnswer: string;
  askedInSession: boolean;
  imageUrl?: string;
};

function validateQuestionData(
  data: Partial<QuestionData>
): data is QuestionData {
  const requiredFields: (keyof QuestionData)[] = [
    "text",
    "subject",
    "timeAllowed",
    "points",
    "questionType",
    "correctAnswer",
  ];
  return requiredFields.every(
    (field) => field in data && data[field] !== undefined && data[field] !== ""
  );
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const askedInSessionParam = searchParams.get("askedInSession");

  try {
    let questions;
    if (askedInSessionParam !== null) {
      const askedInSession = askedInSessionParam === "true";
      questions = await prisma.question.findMany({
        where: {
          askedInSession: askedInSession,
        },
      });
    } else {
      questions = await prisma.question.findMany();
    }

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!validateQuestionData(body)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newQuestion = await prisma.question.create({
      data: {
        ...body,
        timeAllowed: Number(body.timeAllowed),
        points: Number(body.points),
        imageUrl: body.imageUrl || null,
        askedInSession: false,
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error("Error adding question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await prisma.question.updateMany({
      data: {
        askedInSession: false,
      },
    });

    return NextResponse.json({ message: "All questions reset successfully" });
  } catch (error) {
    console.error("Error resetting questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
