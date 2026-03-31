import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseTextToTasks } from "@/lib/ai-parser";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

type MicState = "idle" | "recording" | "processing" | "review";

const MOCK_TRANSCRIPT = "I spoke with Ravi, he will send the report by Friday. I need to review it tomorrow. Follow up with Priya next week about onboarding issues.";

export function FloatingMic() {
  const [state, setState] = useState<MicState>("idle");
  const [timer, setTimer] = useState(0);
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
  const { state: appState, dispatch } = useStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // In a real app we'd use MediaRecorder here. We mock it for visual effect.
  
  const startRecording = async () => {
    try {
      // Just request permission for realism, even if we mock the output
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setState("recording");
      setTimer(0);
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    } catch (e) {
      alert("Microphone access needed.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState("processing");
    
    // Simulate AI processing delay
    setTimeout(() => {
      const parsed = parseTextToTasks(MOCK_TRANSCRIPT, appState.currentUser, appState.workspace.id);
      setGeneratedTasks(parsed);
      setState("review");
    }, 2000);
  };

  const cancelReview = () => {
    setState("idle");
    setGeneratedTasks([]);
  };

  const confirmTasks = () => {
    generatedTasks.forEach(task => {
      dispatch({ type: "ADD_TASK", payload: task });
      dispatch({ 
        type: "ADD_ACTIVITY", 
        payload: { id: generateId(), action: "Task Created via Voice AI", details: task.title, timestamp: new Date().toISOString(), user: appState.currentUser }
      });
    });
    setState("idle");
    setGeneratedTasks([]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <>
      {/* Transcript Review Dialog Overlay */}
      {state === "review" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-8">
            <button onClick={cancelReview} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-2 flex items-center">
              <SparklesIcon /> AI Processed Audio
            </h3>
            <div className="bg-muted/50 p-4 rounded-xl text-sm italic border-l-4 border-primary mb-6">
              "{MOCK_TRANSCRIPT}"
            </div>
            
            <h4 className="font-semibold text-sm mb-3">Generated Tasks ({generatedTasks.length}):</h4>
            <div className="space-y-2 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {generatedTasks.map((t, i) => (
                <div key={i} className="bg-background border border-border p-3 rounded-xl shadow-sm text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="flex space-x-2 mt-2 text-xs">
                    <span className="text-muted-foreground">👤 {t.owner}</span>
                    <span className="text-primary">📅 {new Date(t.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button onClick={cancelReview} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
                Discard
              </button>
              <button onClick={confirmTasks} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Add Tasks to Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center space-x-3">
        {state === "recording" && (
          <div className="glass-panel px-4 py-2 rounded-full flex items-center space-x-3 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-end space-x-1 h-4">
              <div className="w-1 bg-destructive rounded-t wave-bar h-full"></div>
              <div className="w-1 bg-destructive rounded-t wave-bar h-full"></div>
              <div className="w-1 bg-destructive rounded-t wave-bar h-full"></div>
              <div className="w-1 bg-destructive rounded-t wave-bar h-full"></div>
            </div>
            <span className="text-destructive font-mono font-bold tracking-wider">{formatTime(timer)}</span>
          </div>
        )}

        <button 
          onClick={state === "idle" ? startRecording : state === "recording" ? stopRecording : undefined}
          className={cn(
            "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
            state === "idle" ? "bg-gradient-to-tr from-primary to-accent text-white hover:scale-110 hover:shadow-primary/40" : "",
            state === "recording" ? "bg-destructive text-white animate-pulse-ring scale-110" : "",
            state === "processing" ? "bg-muted text-foreground" : "",
            state === "review" ? "hidden" : ""
          )}
        >
          {state === "idle" && <Mic className="w-7 h-7" />}
          {state === "recording" && <Square className="w-6 h-6 fill-current" />}
          {state === "processing" && <Loader2 className="w-7 h-7 animate-spin" />}
        </button>
      </div>
    </>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-5 h-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  )
}
