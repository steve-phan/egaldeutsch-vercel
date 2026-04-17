import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LocalizedTextFieldProps {
  label: string;
  deValue: string;
  enValue: string;
  viValue: string;
  onDeChange: (val: string) => void;
  onEnChange: (val: string) => void;
  onViChange: (val: string) => void;
  multiline?: boolean;
}

export function LocalizedTextField({
  label,
  deValue,
  enValue,
  viValue,
  onDeChange,
  onEnChange,
  onViChange,
  multiline = false
}: LocalizedTextFieldProps) {
  const InputComponent = multiline ? Textarea : Input;

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <Label className="text-base font-bold text-slate-800 mb-2 block">{label}</Label>
      
      <div className="space-y-4">
         <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold uppercase text-slate-400 select-none">DE</span>
            <InputComponent 
               value={deValue} 
               onChange={(e) => onDeChange(e.target.value)} 
               className={`pl-10 ${multiline ? 'min-h-[80px]' : ''}`}
               placeholder={`${label} in German...`}
            />
         </div>
         <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold uppercase text-slate-400 select-none">EN</span>
            <InputComponent 
               value={enValue} 
               onChange={(e) => onEnChange(e.target.value)} 
               className={`pl-10 ${multiline ? 'min-h-[80px]' : ''}`}
               placeholder={`${label} in English...`}
            />
         </div>
         <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs font-bold uppercase text-slate-400 select-none">VI</span>
            <InputComponent 
               value={viValue} 
               onChange={(e) => onViChange(e.target.value)} 
               className={`pl-10 ${multiline ? 'min-h-[80px]' : ''}`}
               placeholder={`${label} in Vietnamese...`}
            />
         </div>
      </div>
    </div>
  );
}
