export interface Question {
  id: string;
  text: string;
  subject: string;
  timeAllowed: number;
  points: number;
  questionType: "multiple-choice" | "grid-in";
  correctAnswer: string;
  askedInSession: boolean;
  imageUrl?: string;
  choices?: {
    id: string;
    text: string;
    choiceId: string;
  }[];
}
