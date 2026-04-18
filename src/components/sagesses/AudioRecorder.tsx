import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

const MAX_DURATION = 60; // seconds

interface Props {
  onSaved?: (blob: Blob, durationSec: number) => void;
}

const AudioRecorder = ({ onSaved }: Props) => {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onSaved?.(blob, elapsed);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      setElapsed(0);
      intervalRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= MAX_DURATION) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
    } catch (e) {
      setError("Microphone inaccessible. Vérifie les autorisations du navigateur.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRecording(false);
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsed(0);
    setPlaying(false);
  };

  const togglePlay = () => {
    if (!audioElRef.current) return;
    if (playing) {
      audioElRef.current.pause();
      setPlaying(false);
    } else {
      audioElRef.current.play();
      setPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = (elapsed / MAX_DURATION) * 100;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ borderColor: "hsl(358, 75%, 52%)", background: "hsl(0, 0%, 100%)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "hsl(358, 75%, 52%)" }}>
            Enregistre ta réponse
          </p>
          <p className="text-xs mt-0.5" style={{ color: "hsl(30, 8%, 45%)" }}>
            1 minute maximum — pose ta voix sur ce cas.
          </p>
        </div>
        <span
          className="text-sm font-mono tabular-nums px-2 py-1 rounded-md"
          style={{
            background: recording ? "hsl(358, 75%, 52%)" : "hsl(40, 20%, 96%)",
            color: recording ? "hsl(0, 0%, 100%)" : "hsl(30, 8%, 35%)",
          }}
        >
          {formatTime(elapsed)} / 1:00
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "hsl(40, 20%, 92%)" }}>
        <motion.div
          className="h-full"
          style={{ background: "hsl(358, 75%, 52%)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {!audioUrl && !recording && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "hsl(358, 75%, 52%)", color: "hsl(0, 0%, 100%)" }}
          >
            <Mic size={16} /> Démarrer
          </button>
        )}
        {recording && (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "hsl(30, 30%, 12%)", color: "hsl(0, 0%, 100%)" }}
          >
            <Square size={14} /> Arrêter
          </button>
        )}
        {audioUrl && !recording && (
          <>
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "hsl(145, 55%, 38%)", color: "hsl(0, 0%, 100%)" }}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? "Pause" : "Écouter"}
            </button>
            <button
              onClick={resetRecording}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border"
              style={{
                borderColor: "hsl(358, 75%, 52%)",
                color: "hsl(358, 75%, 52%)",
                background: "hsl(0, 0%, 100%)",
              }}
            >
              <Trash2 size={14} /> Recommencer
            </button>
            <audio
              ref={audioElRef}
              src={audioUrl}
              onEnded={() => setPlaying(false)}
              className="hidden"
            />
          </>
        )}
      </div>

      {error && (
        <p className="mt-3 text-xs" style={{ color: "hsl(358, 75%, 52%)" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AudioRecorder;
