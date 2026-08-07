import { Search } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: SearchInputProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
      />
    </div>
  );
}
