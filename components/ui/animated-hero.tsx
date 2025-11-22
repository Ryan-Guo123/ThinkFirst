
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, Play, Sparkles, ArrowDown } from "lucide-react";
import { Button } from "./button";

interface HeroProps {
  onStart?: () => void;
  onLearnMore?: () => void;
}

function Hero({ onStart, onLearnMore }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  
  const titles = useMemo(
    () => [
      { text: "Different", className: "bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent" },
      { text: "Critically", className: "bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent" },
      { text: "Deeper", className: "bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent" },
      { text: "Smarter", className: "bg-gradient-to-r from-amber-400 to-orange-600 bg-clip-text text-transparent" },
      { text: "First", className: "bg-gradient-to-r from-brand-400 to-brand-700 bg-clip-text text-transparent" },
    ],
    []
  );

  useEffect(() => {
    if (titleNumber === titles.length - 1) return;

    const timeoutId = setTimeout(() => {
      setTitleNumber(titleNumber + 1);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-50 pt-20 pb-10 selection:bg-brand-100 selection:text-brand-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
           animate={{ 
             y: [0, -30, 0], 
             scale: [1, 1.05, 1],
             rotate: [0, 5, 0]
           }} 
           transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
           className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-pastel-blue/40 rounded-full opacity-60 blur-[120px]" 
         />
         <motion.div 
           animate={{ 
             y: [0, 30, 0], 
             scale: [1, 1.1, 1],
             rotate: [0, -5, 0]
           }} 
           transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
           className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pastel-red/30 rounded-full opacity-50 blur-[120px]" 
         />
         <motion.div 
           animate={{ 
             x: [0, 20, 0], 
             scale: [1, 0.95, 1],
           }} 
           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
           className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-pastel-yellow/30 rounded-full opacity-40 blur-[100px]" 
         />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onClick={onLearnMore} 
            className="cursor-pointer mb-8 group"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-brand-200 transition-all duration-300 text-stone-600 text-sm font-medium">
              <span className="relative flex h-2.5 w-2.5 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
              </span>
              The AI Methodology for Students
              <MoveRight className="w-3.5 h-3.5 ml-1 text-stone-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </motion.div>

          <div className="flex flex-col items-center justify-center text-center mb-8 relative">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="text-7xl md:text-9xl tracking-tighter font-extrabold text-stone-900 leading-none mb-2 md:mb-4"
            >
              Think
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="h-24 md:h-40 relative flex items-center justify-center overflow-visible w-full"
            >
              <span className="text-7xl md:text-9xl tracking-tighter font-extrabold text-transparent select-none leading-none opacity-0">
                First
              </span>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full flex items-center justify-center">
                 {titles.map((item, index) => (
                  <motion.span
                    key={index}
                    className={`absolute whitespace-nowrap font-extrabold text-7xl md:text-9xl tracking-tighter leading-none pb-2 ${item.className}`}
                    initial={{ opacity: 0, y: 80, filter: "blur(10px)" }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1, filter: "blur(0px)" }
                        : { y: titleNumber > index ? -80 : 80, opacity: 0, filter: "blur(10px)" }
                    }
                    transition={{ 
                      type: "spring", 
                      stiffness: 70, 
                      damping: 20,
                      mass: 1
                    }}
                  >
                    {item.text}
                  </motion.span>
                ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-2xl leading-relaxed text-stone-500 max-w-2xl text-center mb-10 font-light px-4"
          >
            Don't let AI replace your brain. <br className="hidden md:block"/>
            Move from "copy-paste" to <span className="text-stone-900 font-medium bg-stone-100 px-2 py-0.5 rounded-lg">constructive dialogue</span>.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
          >
            <Button 
              size="lg" 
              className="h-14 px-8 rounded-full text-lg gap-3 bg-brand-600 hover:bg-brand-700 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto group" 
              onClick={onStart}
            >
              Start Thinking
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-3 h-3 fill-current" />
              </div>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 rounded-full text-lg gap-3 bg-white/60 backdrop-blur-sm border-stone-200 hover:bg-white hover:border-stone-300 text-stone-600 w-full sm:w-auto transition-all duration-300" 
              onClick={onLearnMore}
            >
              Philosophy 
              <Sparkles className="w-4 h-4 text-stone-400" />
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="mt-24 w-full max-w-5xl px-4"
          >
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group p-8 bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-lg hover:border-pastel-yellow/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-pastel-yellow/50 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    🧠
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-yellow-700 transition-colors">1. My Brain First</h3>
                  <p className="text-stone-500 leading-relaxed font-light">Formulate your own thesis or rough ideas before opening the tool.</p>
                </div>

                <div className="group p-8 bg-white rounded-[2rem] border border-stone-100 shadow-lg relative md:-top-6 hover:shadow-xl hover:border-pastel-red/50 transition-all duration-300 hover:-translate-y-1 z-10">
                  <div className="w-14 h-14 rounded-2xl bg-pastel-red/50 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    🤖
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-red-700 transition-colors">2. AI's Turn</h3>
                  <p className="text-stone-500 leading-relaxed font-light">Ask for critiques, structure, and counter-arguments. <strong className="font-medium text-red-400">Never answers.</strong></p>
                </div>

                <div className="group p-8 bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-lg hover:border-pastel-blue/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-pastel-blue/50 flex items-center justify-center mb-6 text-3xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    ✍️
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-blue-700 transition-colors">3. My Brain Last</h3>
                  <p className="text-stone-500 leading-relaxed font-light">Synthesize the feedback and write the final work yourself.</p>
                </div>
             </div>
             
             <div className="flex justify-center mt-12">
                <button onClick={onLearnMore} className="animate-bounce text-stone-400 hover:text-stone-600 transition-colors">
                  <ArrowDown className="w-6 h-6" />
                </button>
             </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

export { Hero };
