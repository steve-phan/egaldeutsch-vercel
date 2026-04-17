import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ tags, onChange }: TagsInputProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = value.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-bold text-slate-800">Tags</Label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[32px]">
        {tags.map((tag) => (
          <span 
            key={tag} 
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
          >
            #{tag}
            <button 
              onClick={() => removeTag(tag)}
              className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-slate-400 italic">No tags added</span>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a tag and press Enter"
        className="w-full"
      />
    </div>
  );
}
