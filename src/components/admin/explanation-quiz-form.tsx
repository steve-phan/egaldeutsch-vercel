"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  CreateExplanationQuizRequest,
  QuizOption,
} from "@/types/explanation-quiz";

interface ExplanationQuizFormProps {
  onSubmit: (data: CreateExplanationQuizRequest) => Promise<void>;
  isLoading?: boolean;
}

export function ExplanationQuizForm({
  onSubmit,
  isLoading = false,
}: ExplanationQuizFormProps) {
  const [formData, setFormData] = useState<CreateExplanationQuizRequest>({
    title: "",
    question: "",
    context: "",
    category: "phrasen",
    options: [
      { text: "", explanation: "", isCorrect: false, commonMistake: "" },
      { text: "", explanation: "", isCorrect: false, commonMistake: "" },
      { text: "", explanation: "", isCorrect: false, commonMistake: "" },
    ],
  });

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, context: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category: e.target.value });
  };

  const handleOptionChange = (
    index: number,
    field: keyof Omit<QuizOption, "id">,
    value: string | boolean,
  ) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        { text: "", explanation: "", isCorrect: false, commonMistake: "" },
      ],
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (
      !formData.question ||
      !formData.category ||
      formData.options.length < 2
    ) {
      alert("Please fill in all required fields and have at least 2 options");
      return;
    }

    const hasCorrect = formData.options.some((opt) => opt.isCorrect);
    if (!hasCorrect) {
      alert("Please mark at least one option as correct");
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        title: "",
        question: "",
        context: "",
        category: "phrasen",
        options: [
          { text: "", explanation: "", isCorrect: false, commonMistake: "" },
          { text: "", explanation: "", isCorrect: false, commonMistake: "" },
          { text: "", explanation: "", isCorrect: false, commonMistake: "" },
        ],
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Create Explanation Quiz</CardTitle>
        <CardDescription>
          Add a new quiz question with explanations for each option
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Question */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title (Optional)</Label>
              <Input
                id="title"
                placeholder="e.g., Phrasal Verbs Lesson 1"
                value={formData.title}
                onChange={handleTitleChange}
              />
            </div>

            <div>
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                placeholder="e.g., Felix wollte seinen Augen nicht ___"
                value={formData.question}
                onChange={handleQuestionChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="context">Context (Optional)</Label>
              <Input
                id="context"
                placeholder="e.g., : Sein Fahrrad war weg!"
                value={formData.context}
                onChange={handleContextChange}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="phrasen">Phrasen</option>
                <option value="vocab">Vocabulary</option>
                <option value="grammar">Grammar</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Options</h3>
              <Button
                type="button"
                onClick={addOption}
                variant="outline"
                size="sm"
              >
                + Add Option
              </Button>
            </div>

            {formData.options.map((option, index) => (
              <Card key={index} className="p-4 bg-slate-50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={option.isCorrect}
                      onCheckedChange={(checked) =>
                        handleOptionChange(index, "isCorrect", checked)
                      }
                    />
                    <Label className="text-sm font-medium">
                      Correct Answer
                    </Label>
                  </div>

                  <div>
                    <Label className="text-sm">Option Text *</Label>
                    <Input
                      placeholder="e.g., trauen"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Explanation *</Label>
                    <Textarea
                      placeholder="Detailed explanation for this option..."
                      value={option.explanation}
                      onChange={(e) =>
                        handleOptionChange(index, "explanation", e.target.value)
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Common Mistake (Optional)</Label>
                    <Textarea
                      placeholder="Why learners might choose this incorrectly..."
                      value={option.commonMistake || ""}
                      onChange={(e) =>
                        handleOptionChange(
                          index,
                          "commonMistake",
                          e.target.value,
                        )
                      }
                      rows={2}
                    />
                  </div>

                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(index)}
                      variant="destructive"
                      size="sm"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Quiz"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
