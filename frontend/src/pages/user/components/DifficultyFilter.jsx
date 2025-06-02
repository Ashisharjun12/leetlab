import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";

const difficulties = [
  { value: "all", label: "All Difficulty" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const DifficultyFilter = ({ value, onChange }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="All Difficulty">
        {difficulties.find(d => d.value === value)?.label || "All Difficulty"}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      {difficulties.map(diff => (
        <SelectItem key={diff.value} value={diff.value}>
          {diff.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default DifficultyFilter; 