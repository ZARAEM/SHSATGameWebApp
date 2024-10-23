"use client";

import * as React from "react";

type MultipleChoiceProps = {
  onChange?: (selectedId: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  selectedAnswer?: string;
  showCorrectness?: boolean;
};

export function MultipleChoice({
  onChange,
  disabled,
  correctAnswer,
  selectedAnswer,
  showCorrectness = false,
}: MultipleChoiceProps) {
  const choices = ["A", "B", "C", "D"];
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const getBubbleStyle = (choice: string) => {
    if (showCorrectness) {
      if (choice === correctAnswer) {
        return "border-green-500 bg-green-500 text-white";
      }
      if (choice === selectedAnswer) {
        return "border-red-500 bg-red-500 text-white";
      }
      return "border-gray-300 text-gray-500 opacity-50";
    }

    return selectedId === choice
      ? "border-primary bg-primary text-primary-foreground"
      : "border-gray-300 text-gray-500";
  };

  const handleSelect = (id: string) => {
    if (disabled) return;

    const newSelectedId = selectedId === id ? null : id;
    setSelectedId(newSelectedId);

    if (onChange && newSelectedId !== null) {
      onChange(newSelectedId);
    }
  };

  React.useEffect(() => {
    if (disabled) {
      setSelectedId(null);
    }
  }, [disabled]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {choices.map((choice) => (
        <button
          key={choice}
          onClick={() => handleSelect(choice)}
          className={`flex items-center space-x-4 w-full p-4 text-left rounded-lg border-2 transition-all ${
            disabled ? "cursor-not-allowed" : "hover:border-gray-300"
          } ${
            showCorrectness
              ? "pointer-events-none"
              : selectedId === choice
              ? "border-primary bg-primary-foreground"
              : "border-gray-200"
          }`}
          disabled={disabled}
        >
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold transition-all ${getBubbleStyle(
              choice
            )}`}
          >
            {choice}
          </div>
        </button>
      ))}
    </div>
  );
}