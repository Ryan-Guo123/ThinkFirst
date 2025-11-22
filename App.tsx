
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/ui/animated-hero';
import { Section } from './components/Section';
import { CodeBlock } from './components/CodeBlock';
import { Playground } from './components/Playground';
import { PROMPT_EXAMPLES } from './constants';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Sparkles, BrainCircuit, ShieldCheck, GraduationCap, Clock, Target, Zap, MessageSquare, GitMerge, ScanEye, Fingerprint, AlertTriangle } from 'lucide-react';

type ViewState = 'home' | 'playground';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleNavigation = (id: string) => {
    if (id === 'playground') {
      setCurrentView('playground');
    } else {
      setCurrentView('home');
      setTimeout(() => {
        if (id !== 'hero') {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const nextPrompt = () => setActivePromptIndex((prev) => (prev + 1) % PROMPT_EXAMPLES.length);
  const prevPrompt = () => setActivePromptIndex((prev) => (prev - 1 + PROMPT_EXAMPLES.length) % PROMPT_EXAMPLES.length);

  return (
    <div className="bg-stone-50 min-h-screen font-sans text-stone-800 selection:bg-brand-100 selection:text-brand-900">
      {/* Hide main header when in Playground for a cleaner "no logo" experience */}
      {currentView !== 'playground' && (
        <Header activeSection="hero" onNavigate={handleNavigation} />
      )}

      <main className={currentView === 'playground' ? '' : 'pt-16'}>
        {currentView === 'playground' ? (
          <Playground onBack={() => handleNavigation('hero')} />
        ) : (
          <>
            <div id="hero">
              <Hero 
                onStart={() => handleNavigation('playground')} 
                onLearnMore={() => handleNavigation('philosophy')}
              />
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <Section id="philosophy" title="What does it mean to think?" subtitle="It's not just about getting the answer." darker>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    {[
                      { title: "Synthesis", desc: "Combining disparate information into a new, unique understanding.", icon: <GitMerge className="w-10 h-10 text-brand-600" /> },
                      { title: "Critical Analysis", desc: "Questioning the validity of information, not just accepting it.", icon: <ScanEye className="w-10 h-10 text-brand-600" /> },
                      { title: "Original Voice", desc: "Expressing ideas through your unique perspective and experience.", icon: <Fingerprint className="w-10 h-10 text-brand-600" /> }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="mb-6 p-3 bg-brand-50 w-fit rounded-2xl">{card.icon}</div>
                        <h3 className="text-xl font-bold text-stone-900 mb-3">{card.title}</h3>
                        <p className="text-stone-600 leading-relaxed font-light">{card.desc}</p>
                      </div>
                    ))}
                </div>
              </Section>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <Section id="problem" className="bg-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <div className="inline-block px-3 py-1 bg-pastel-red/30 text-red-700 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">The Problem</div>
                    <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">The "Copy-Paste" Trap</h2>
                    <p className="text-lg text-stone-600 mb-6 leading-relaxed font-light">
                      When we ask AI to "write an essay on Shakespeare," we aren't learning about Shakespeare. We are learning how to be project managers for a robot.
                    </p>
                    <div className="p-6 bg-red-50/50 border-l-4 border-red-400 rounded-r-2xl">
                      <p className="text-red-900 font-medium flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risk: Cognitive Atrophy
                      </p>
                      <p className="text-red-800/70 text-sm mt-1">We outsource the struggle, but the struggle is where the learning happens.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="relative bg-stone-50 border border-stone-100 rounded-3xl p-8 shadow-lg">
                      <div className="space-y-4 opacity-30 blur-[1px]">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex-shrink-0"></div>
                            <div className="bg-white rounded-lg p-3 w-full shadow-sm">
                              <div className="h-2 w-3/4 bg-stone-200 rounded mb-2"></div>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 flex-row-reverse">
                            <div className="w-8 h-8 rounded-full bg-brand-200 flex-shrink-0"></div>
                            <div className="bg-brand-50 rounded-lg p-3 w-full">
                              <div className="h-2 w-full bg-brand-200 rounded mb-2"></div>
                              <div className="h-2 w-full bg-brand-200 rounded mb-2"></div>
                            </div>
                          </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl">
                          <div className="bg-stone-900 text-white px-6 py-3 rounded-xl transform -rotate-6 shadow-xl border-4 border-white">
                            <span className="text-xl font-bold font-mono">MISSING THE POINT</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Section>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <Section id="prompts" title="Example Prompts" subtitle="Swipe to see how to interact with AI productively.">
                <div className="relative w-full h-[450px] flex items-center justify-center perspective-1000">
                    {/* Navigation */}
                    <button 
                        onClick={prevPrompt}
                        className="absolute left-4 md:left-20 z-20 p-3 rounded-full bg-white/80 backdrop-blur shadow-lg text-stone-700 hover:scale-110 transition-all"
                    >
                        ←
                    </button>
                    <button 
                        onClick={nextPrompt}
                        className="absolute right-4 md:right-20 z-20 p-3 rounded-full bg-white/80 backdrop-blur shadow-lg text-stone-700 hover:scale-110 transition-all"
                    >
                        →
                    </button>

                    {/* 3D Stack */}
                    <div className="relative w-full max-w-xl h-full flex items-center justify-center">
                        <AnimatePresence initial={false}>
                            {PROMPT_EXAMPLES.map((prompt, index) => {
                                const isActive = index === activePromptIndex;
                                const offset = index - activePromptIndex;
                                // Handle circular logic for visual only (simplified for 4 items)
                                // Showing only active, next, prev
                                let visualOffset = offset;
                                if (offset < -1) visualOffset += PROMPT_EXAMPLES.length;
                                if (offset > 1) visualOffset -= PROMPT_EXAMPLES.length;

                                const isVisible = Math.abs(visualOffset) <= 1;

                                if (!isVisible) return null;

                                return (
                                    <motion.div
                                        key={prompt.id}
                                        className="absolute w-full md:w-[550px] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden cursor-pointer"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{
                                            scale: visualOffset === 0 ? 1 : 0.85,
                                            opacity: visualOffset === 0 ? 1 : 0.4,
                                            x: visualOffset * 120 + (visualOffset * 200), // Move left/right
                                            z: visualOffset === 0 ? 10 : 0,
                                            rotateY: visualOffset * -15, // 3D Rotation
                                        }}
                                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                        style={{
                                            zIndex: visualOffset === 0 ? 10 : 5,
                                            filter: visualOffset === 0 ? 'blur(0px)' : 'blur(2px)'
                                        }}
                                        onClick={() => setActivePromptIndex(index)}
                                    >
                                        <div className={`p-6 border-b ${
                                            prompt.category === 'critique' ? 'bg-red-50 border-red-100' :
                                            prompt.category === 'ideation' ? 'bg-yellow-50 border-yellow-100' :
                                            'bg-blue-50 border-blue-100'
                                        }`}>
                                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                                prompt.category === 'critique' ? 'bg-red-100 text-red-800' :
                                                prompt.category === 'ideation' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                                {prompt.category}
                                            </span>
                                            <h3 className="text-2xl font-bold mt-3">{prompt.title}</h3>
                                            <p className="text-stone-500 text-sm mt-1">{prompt.description}</p>
                                        </div>
                                        <div className="p-6 bg-white h-[240px] flex flex-col justify-center">
                                            <CodeBlock 
                                                code={prompt.content} 
                                                label="PROMPT" 
                                                maxHeight="160px"
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
              </Section>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={sectionVariants}
            >
              <Section id="teachers" title="For Teachers" subtitle="Turn AI from a threat into a teaching assistant." darker>
                
                <div className="max-w-6xl mx-auto">
                  {/* Main Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
                    
                    {/* Hero Card */}
                    <div className="col-span-1 md:col-span-8 bg-white rounded-[2.5rem] p-10 text-stone-900 flex flex-col justify-between relative overflow-hidden shadow-xl border border-stone-200 min-h-[320px]">
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-brand-50 via-blue-50 to-purple-50 rounded-full blur-[100px] opacity-80 -mr-20 -mt-20 animate-pulse" />
                      <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-stone-100/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold mb-8 text-brand-700 border border-stone-200 tracking-widest">
                          <ShieldCheck size={14} />
                          <span>ACADEMIC INTEGRITY 2.0</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight text-stone-900">
                          Stop policing. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600">Start partnering.</span>
                        </h3>
                      </div>
                      <p className="relative z-10 text-stone-600 font-light text-lg md:text-xl leading-relaxed max-w-xl">
                         The future isn't detecting AI. It's integrating it into the process so the <span className="text-stone-900 font-medium border-b border-brand-500/50 pb-0.5">dialogue itself</span> becomes the deliverable.
                      </p>
                    </div>

                    {/* Side Stack */}
                    <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-lg flex-1 flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300 group">
                           <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-100 transition-colors">
                              <Target size={28} />
                           </div>
                           <h4 className="text-xl font-bold text-stone-900 mb-2">Process Grading</h4>
                           <p className="text-stone-500 leading-relaxed text-sm">Grade the chat history, not just the essay. Did they ask good questions?</p>
                        </div>
                        
                        <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 shadow-lg flex-1 flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300 group">
                           <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-100 transition-colors">
                              <Zap size={28} />
                           </div>
                           <h4 className="text-xl font-bold text-stone-900 mb-2">Instant Feedback</h4>
                           <p className="text-stone-500 leading-relaxed text-sm">Students get critique before they submit, saving you hours of grading time.</p>
                        </div>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {/* Stat Card 1 */}
                     <div className="bg-white border border-stone-200 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-all group">
                        <Clock size={28} className="text-stone-300 mb-3 group-hover:text-brand-500 transition-colors" />
                        <div className="text-4xl font-extrabold text-stone-900 mb-1 group-hover:scale-110 transition-transform">60%</div>
                        <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Faster Grading</div>
                     </div>

                     {/* Stat Card 2 */}
                     <div className="bg-white border border-stone-200 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center shadow-sm hover:shadow-md transition-all group">
                        <GraduationCap size={28} className="text-stone-300 mb-3 group-hover:text-brand-500 transition-colors" />
                        <div className="text-4xl font-extrabold text-stone-900 mb-1 group-hover:scale-110 transition-transform">2x</div>
                        <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Critical Thinking</div>
                     </div>

                     {/* Action Card */}
                     <div 
                       className="col-span-1 md:col-span-2 bg-gradient-to-br from-brand-600 to-blue-600 rounded-[2rem] p-1 text-white cursor-pointer group shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                       onClick={() => handleNavigation('playground')}
                     >
                        <div className="bg-white/10 h-full w-full rounded-[1.8rem] p-6 flex items-center justify-between backdrop-blur-sm hover:bg-white/20 transition-colors">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-inner">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-2xl text-white">Launch Sandbox</h4>
                                    <p className="text-brand-100 text-sm opacity-90">Experience the student environment</p>
                                </div>
                             </div>
                             <div className="w-12 h-12 rounded-full bg-white text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                 <ArrowRight size={24} />
                             </div>
                        </div>
                     </div>
                  </div>

                </div>
              </Section>
            </motion.div>

            <footer className="bg-white border-t border-stone-200 py-12 px-4">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                       {/* Clean footer without logo */}
                    </div>
                    <div className="text-center md:text-right">
                    <p className="text-stone-500 text-sm">
                        Powered by Google Gemini. Designed to make humans smarter.
                    </p>
                    <p className="text-stone-400 text-xs mt-2">
                        © {new Date().getFullYear()} ThinkFirst. All rights reserved.
                    </p>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-stone-100 text-center">
                    <span className="inline-block px-4 py-2 rounded-full bg-stone-50 text-xs font-medium text-stone-400 uppercase tracking-widest border border-stone-100">
                      Made by Ryan Guo
                    </span>
                </div>
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}
