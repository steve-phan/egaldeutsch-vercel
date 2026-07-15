import { GermanGrammarProgressProvider } from "@/contexts/german-grammar-progress-context";

export default function GermanGrammarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GermanGrammarProgressProvider>{children}</GermanGrammarProgressProvider>;
}