import React from 'react';
import { Button } from './Button';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-stone-50">
      {/* Background Elements - Subtle, flat shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-brand-100 rounded-full opacity-60 blur-3xl" />
        <div className="absolute bottom-[10%] -left-[5%] w-[40%] h-[40%] bg-stone-200 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm">
          <span className="text-brand-600 text-xs font-bold tracking-widest uppercase">The AI Methodology for Students</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-stone-900 tracking-tight mb-8 leading-[1.1]">
          Don't let AI <br />
          <span className="text-brand-600">
            Replace Your Brain.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-xl md:text-2xl text-stone-500 mb-12 leading-relaxed font-light">
          Move from "copy-paste" to "constructive dialogue." 
          <br className="hidden md:block"/>
          Use AI as a thinking coach, not a homework machine.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" onClick={onStart} className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            Enter the Playground
          </Button>
          <Button variant="outline" size="lg" onClick={() => document.getElementById('philosophy')?.scrollIntoView({behavior: 'smooth'})} className="w-full sm:w-auto bg-white">
            Learn the Philosophy
          </Button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-2xl">
              🧠
            </div>
            <h3 className="text-stone-900 font-bold mb-1">My Brain First</h3>
            <p className="text-sm text-stone-500">Start with your own original thought.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md border border-brand-100 relative -top-4">
            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4 text-2xl text-brand-600">
              🤖
            </div>
            <h3 className="text-brand-700 font-bold mb-1">AI's Turn</h3>
            <p className="text-sm text-stone-500">Challenge, expand, and structure.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-2xl">
              🎓
            </div>
            <h3 className="text-stone-900 font-bold mb-1">My Brain Last</h3>
            <p className="text-sm text-stone-500">Synthesize and finalize the work.</p>
          </div>
        </div>
      </div>
    </div>
  );
};