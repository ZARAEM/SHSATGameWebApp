"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface GridInProps {
  onChange: (answer: string) => void;
  disabled?: boolean;
  correctAnswer?: string;
  selectedAnswer?: string;
  showCorrectness?: boolean;
}

const GridButton = ({
  value,
  isSelected,
  disabled,
  onClick,
}: {
  value: string;
  isSelected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-xs font-medium transition-colors",
      isSelected
        ? "bg-primary text-primary-foreground"
        : "bg-background text-foreground hover:bg-primary/10",
      disabled && "opacity-50 cursor-not-allowed hover:bg-background"
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {value}
  </button>
);

const GridPlaceholder = ({ disabled }: { disabled?: boolean }) => (
  <div
    className={cn("w-8 h-8 bg-gray-900 rounded-full", disabled && "opacity-50")}
  />
);

const GridColumn = ({
  column,
  columnIndex,
  selectedAnswers,
  disabled,
  onBubbleClick,
}: {
  column: string[];
  columnIndex: number;
  selectedAnswers: number[];
  disabled?: boolean;
  onBubbleClick: (columnIndex: number, rowIndex: number) => void;
}) => (
  <div className="flex flex-col space-y-2">
    {column.map((value, rowIndex) =>
      value ? (
        <GridButton
          key={`${columnIndex}-${rowIndex}`}
          value={value}
          isSelected={selectedAnswers[columnIndex] === rowIndex}
          disabled={disabled}
          onClick={() => onBubbleClick(columnIndex, rowIndex)}
        />
      ) : (
        <GridPlaceholder
          key={`${columnIndex}-${rowIndex}`}
          disabled={disabled}
        />
      )
    )}
  </div>
);

export function GridIn({
  onChange,
  disabled = false,
  correctAnswer,
  selectedAnswer,
  showCorrectness = false,
}: GridInProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    Array(5).fill(-1)
  );

  const columns = [
    ["-", "", "", "", "", "", "", "", "", "", "", ""],
    ["", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    ["", ".", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  ];

  const getBubbleStyle = (columnIndex: number, rowIndex: number) => {
    if (!showCorrectness) {
      return selectedAnswers[columnIndex] === rowIndex
        ? "bg-primary text-primary-foreground"
        : "bg-background text-foreground hover:bg-primary/10";
    }

    const currentValue = columns[columnIndex][rowIndex];
    const isPartOfSelectedAnswer = selectedAnswer?.includes(currentValue);
    const isPartOfCorrectAnswer = correctAnswer?.includes(currentValue);

    if (isPartOfCorrectAnswer) {
      return "bg-green-500 text-white border-green-500";
    }
    if (isPartOfSelectedAnswer && !isPartOfCorrectAnswer) {
      return "bg-red-500 text-white border-red-500";
    }
    return "bg-background text-foreground opacity-50";
  };

  const handleBubbleClick = (columnIndex: number, rowIndex: number) => {
    if (disabled) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[columnIndex] =
      selectedAnswers[columnIndex] === rowIndex ? -1 : rowIndex;
    setSelectedAnswers(newAnswers);

    const answer = newAnswers
      .map((rowIndex, columnIndex) => columns[columnIndex][rowIndex] || "")
      .join("")
      .replace(/^-/, "-")
      .replace(/^\./, "0.")
      .trim();

    if (onChange && answer) {
      onChange(answer);
    }
  };

  useEffect(() => {
    if (disabled) {
      setSelectedAnswers(Array(5).fill(-1));
    }
  }, [disabled]);

  return (
    <div className="flex justify-center space-x-1 p-4 bg-background rounded-lg shadow-sm">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col space-y-2">
          {column.map((value, rowIndex) =>
            value ? (
              <button
                key={`${columnIndex}-${rowIndex}`}
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-xs font-medium transition-colors",
                  getBubbleStyle(columnIndex, rowIndex),
                  disabled && "cursor-not-allowed"
                )}
                onClick={() => handleBubbleClick(columnIndex, rowIndex)}
                disabled={disabled}
              >
                {value}
              </button>
            ) : (
              <div
                key={`${columnIndex}-${rowIndex}`}
                className={cn(
                  "w-8 h-8 bg-gray-900 rounded-full",
                  disabled && "opacity-50"
                )}
              />
            )
          )}
        </div>
      ))}
    </div>
  );
}
