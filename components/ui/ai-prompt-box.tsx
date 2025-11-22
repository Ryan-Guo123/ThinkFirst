
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ArrowUp, Paperclip, Square, X, Globe, BrainCog, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAS, PersonaKey } from "../../constants";

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(" ");

const styles = `
  textarea::-webkit-scrollbar {
    width: 4px;
  }
  textarea::-webkit-scrollbar-track {
    background: transparent;
  }
  textarea::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 3px;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-md border-none bg-transparent px-3 py-2 text-base text-stone-800 placeholder:text-stone-400 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none scrollbar-thin",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out fade-in-0 fade-out-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] border-none bg-transparent p-0 shadow-none duration-200",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-64 rounded-xl border border-stone-100 bg-white p-1 text-stone-900 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;


interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[], mode?: 'default' | 'search' | 'think', persona?: PersonaKey) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  selectedPersona: PersonaKey;
  onPersonaChange: (persona: PersonaKey) => void;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(({ 
  onSend, 
  isLoading = false, 
  placeholder = "Type a message...", 
  className,
  selectedPersona,
  onPersonaChange
}, ref) => {
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [activeMode, setActiveMode] = React.useState<'default' | 'search' | 'think'>('default');
  const [isFocused, setIsFocused] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      setFiles(prev => [...prev, ...newFiles]);
      
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if ((!input.trim() && files.length === 0) || isLoading) return;
    
    if (onSend) {
      onSend(input, files, activeMode, selectedPersona);
    }
    
    setInput("");
    setFiles([]);
    setPreviews([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const containerStyles = {
    default: "border-stone-200 focus-within:border-stone-300 focus-within:ring-stone-100",
    search: "border-sky-200 bg-sky-50/30 focus-within:border-sky-300 focus-within:ring-sky-50",
    think: "border-purple-200 bg-purple-50/30 focus-within:border-purple-300 focus-within:ring-purple-50",
  };

  const glowStyles = {
    default: "shadow-sm",
    search: "shadow-[0_0_15px_rgba(14,165,233,0.15)]",
    think: "shadow-[0_0_15px_rgba(168,85,247,0.15)]",
  };

  const toggleMode = (mode: 'search' | 'think') => {
    setActiveMode(prev => prev === mode ? 'default' : mode);
  };

  return (
    <div className="relative w-full transition-all duration-500 z-50" ref={ref}>
      
      <div className="absolute -top-12 left-0 w-full flex justify-center pointer-events-none">
         <AnimatePresence>
            {activeMode !== 'default' && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: 10 }}
                 className={cn(
                   "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm backdrop-blur-md border",
                   activeMode === 'search' && "bg-sky-100/80 text-sky-700 border-sky-200",
                   activeMode === 'think' && "bg-purple-100/80 text-purple-700 border-purple-200",
                 )}
               >
                  {activeMode === 'search' && <Globe className="w-3 h-3" />}
                  {activeMode === 'think' && <BrainCog className="w-3 h-3" />}
                  {activeMode} Active
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      <TooltipProvider>
        <motion.div 
          layout
          className={cn(
            "relative rounded-3xl border bg-white transition-all duration-300 overflow-hidden", // overflow-hidden for perfect corners
            containerStyles[activeMode],
            isFocused ? glowStyles[activeMode] : "shadow-sm hover:shadow-md",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          
          <AnimatePresence>
            {previews.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex gap-3 p-3 overflow-x-auto scrollbar-thin bg-stone-50/50"
              >
                {previews.map((src, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative group flex-shrink-0"
                  >
                    <img 
                      src={src} 
                      alt="upload" 
                      className="h-16 w-16 rounded-xl object-cover border border-stone-100 cursor-pointer hover:opacity-90 transition-opacity" 
                      onClick={() => setPreviewImage(src)}
                    />
                    <button
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-white/90 text-stone-500 rounded-full p-0.5 shadow-sm border border-stone-100 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="px-4 py-3 transition-all">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                  activeMode === 'search' ? "Ask me to find something on the web..." :
                  activeMode === 'think' ? "Enter a complex topic to analyze..." :
                  placeholder
              }
              className={cn(
                "min-h-[24px] max-h-[200px] w-full bg-transparent",
                activeMode === 'search' && "placeholder:text-sky-400/70",
                activeMode === 'think' && "placeholder:text-purple-400/70",
              )}
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3 pt-1 gap-2">
            
            <div className="flex items-center gap-1 relative">
              
              {/* Persona Selector with Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="flex items-center gap-1.5 p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-200"
                  >
                    <span className="text-lg">{PERSONAS[selectedPersona].icon}</span>
                    <span className="hidden sm:inline">{PERSONAS[selectedPersona].name}</span>
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="top" align="start">
                   <div className="space-y-1 max-h-[300px] overflow-y-auto p-1 scrollbar-thin">
                      {(Object.entries(PERSONAS) as [PersonaKey, typeof PERSONAS[PersonaKey]][]).map(([key, persona]) => (
                          <button
                              key={key}
                              onClick={() => onPersonaChange(key)}
                              className={cn(
                                  "w-full flex items-start gap-3 p-2.5 rounded-lg text-left transition-colors",
                                  selectedPersona === key ? "bg-brand-50 text-brand-700" : "hover:bg-stone-50 text-stone-700"
                              )}
                          >
                              <span className="text-xl mt-0.5">{persona.icon}</span>
                              <div>
                                  <div className="font-semibold text-sm">{persona.name}</div>
                                  <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{persona.description}</div>
                              </div>
                          </button>
                      ))}
                   </div>
                </PopoverContent>
              </Popover>

              <div className="w-[1px] h-5 bg-stone-200 mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                    disabled={isLoading}
                  >
                    <Paperclip className="w-5 h-5" />
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileSelect} 
                      className="hidden" 
                      multiple 
                      accept="image/*"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Attach Image</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => toggleMode('search')}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-full transition-all duration-300 group",
                      activeMode === 'search' ? "bg-sky-100 text-sky-600 w-auto px-3 gap-2" : "text-stone-400 hover:text-sky-500 hover:bg-sky-50 w-9"
                    )}
                  >
                    <Globe className={cn("w-5 h-5", activeMode === 'search' && "animate-[spin_3s_linear_infinite]")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Web Search</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={() => toggleMode('think')}
                    className={cn(
                      "flex items-center justify-center p-2 rounded-full transition-all duration-300 group",
                      activeMode === 'think' ? "bg-purple-100 text-purple-600 w-auto px-3 gap-2" : "text-stone-400 hover:text-purple-500 hover:bg-purple-50 w-9"
                    )}
                  >
                    <BrainCog className={cn("w-5 h-5", activeMode === 'think' && "animate-pulse")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Deep Thinking</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center">
               <Tooltip key="send">
                 <TooltipTrigger asChild>
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      disabled={isLoading || (!input.trim() && files.length === 0)}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-full shadow-md transition-all",
                        activeMode === 'search' ? "bg-sky-500 hover:bg-sky-600 text-white" :
                        activeMode === 'think' ? "bg-purple-500 hover:bg-purple-600 text-white" :
                        (input.trim() || files.length > 0) ? "bg-brand-600 hover:bg-brand-700 text-white" : "bg-stone-200 text-stone-400 cursor-not-allowed"
                      )}
                    >
                       {isLoading ? (
                         <Square className="w-4 h-4 fill-current animate-pulse" />
                       ) : (
                         <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
                       )}
                    </motion.button>
                 </TooltipTrigger>
                 <TooltipContent>Send Message</TooltipContent>
               </Tooltip>
            </div>

          </div>
        </motion.div>
      </TooltipProvider>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent>
          {previewImage && (
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
              <img src={previewImage} alt="Full preview" className="w-full h-auto max-h-[80vh] object-contain" />
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
});

PromptInputBox.displayName = "PromptInputBox";
