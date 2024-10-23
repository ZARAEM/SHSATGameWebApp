-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "timeAllowed" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "questionType" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "askedInSession" BOOLEAN NOT NULL DEFAULT false
);
