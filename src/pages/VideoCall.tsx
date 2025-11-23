// ============================================
// CareSync • VideoCall.tsx
// Fullscreen Neon Glass Secure Call Room
// (Dark Futuristic UI, matches rest of app)
// ============================================

import { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Users,
} from "lucide-react";
import webRTCService from "../services/webrtc.service";
import type { ConnectionStatus } from "../types/webrtc.types";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  otherUser: {
    firstName: string;
    lastName: string;
    role?: string;
  };
  currentUser: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
    role: "doctor" | "patient";
  };
}

const VideoCall: React.FC<VideoCallProps> = ({
  isOpen,
  onClose,
  appointmentId,
  otherUser,
  currentUser,
}) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Initialize video call
  useEffect(() => {
    if (isOpen && appointmentId) {
      void initializeCall();
    }

    return () => {
      cleanupCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, appointmentId]);

  // Timer for call duration
  useEffect(() => {
    if (isCallStarted) {
      callStartTimeRef.current = Date.now();
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Math.floor(
          (Date.now() - (callStartTimeRef.current || 0)) / 1000
        );
        setCallDuration(elapsed);
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isCallStarted]);

  const initializeCall = async () => {
    try {
      setConnectionStatus("connecting");
      setErrorMessage("");

      const socketUrl =
        import.meta.env.VITE_SIGNALING_SERVER || "ws://localhost:3003";
      await webRTCService.initializeSocket(socketUrl);

      webRTCService.setEventHandlers({
        onRemoteStream: handleRemoteStream,
        onConnectionStateChange: handleConnectionStateChange,
        onUserJoined: handleUserJoined,
        onUserLeft: handleUserLeft,
      });

      const localStream = await webRTCService.getLocalStream({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const roomId = `appointment_${appointmentId}`;
      webRTCService.joinRoom(roomId, {
        userId: currentUser.id,
        userName: `${currentUser.profile.firstName} ${currentUser.profile.lastName}`,
        role: currentUser.role,
      });

      setConnectionStatus("connected");
    } catch (error) {
      console.error("Error initializing call:", error);
      setConnectionStatus("failed");
      setErrorMessage(
        "Unable to access camera or microphone. Please check your device permissions and try again."
      );
    }
  };

  const handleRemoteStream = (stream: MediaStream) => {
    console.log("Remote stream received");
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      setIsCallStarted(true);
    }
  };

  const handleConnectionStateChange = (state: RTCPeerConnectionState) => {
    console.log("Connection state changed:", state);
    if (state === "connected") {
      setConnectionStatus("connected");
    } else if (state === "disconnected" || state === "failed") {
      setConnectionStatus("disconnected");
    }
  };

  const handleUserJoined = () => {
    console.log("User joined");
    if (currentUser.role === "doctor") {
      webRTCService.createOffer(`appointment_${appointmentId}`);
    }
  };

  const handleUserLeft = () => {
    console.log("User left");
    setConnectionStatus("disconnected");
  };

  const toggleAudio = () => {
    const newState = !isAudioEnabled;
    webRTCService.toggleAudio(newState);
    setIsAudioEnabled(newState);
  };

  const toggleVideo = () => {
    const newState = !isVideoEnabled;
    webRTCService.toggleVideo(newState);
    setIsVideoEnabled(newState);
  };

  const endCall = () => {
    cleanupCall();
    onClose();
  };

  const cleanupCall = () => {
    webRTCService.closeConnection();
    setIsCallStarted(false);
    setCallDuration(0);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-emerald-500/20 border-emerald-400 text-emerald-200";
      case "connecting":
        return "bg-amber-500/20 border-amber-400 text-amber-200";
      case "disconnected":
      case "failed":
        return "bg-rose-500/20 border-rose-400 text-rose-200";
      default:
        return "bg-slate-500/20 border-slate-400 text-slate-200";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting…";
      case "disconnected":
        return "Disconnected";
      case "failed":
        return "Failed";
      default:
        return "Idle";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-50 overflow-hidden">
      {/* Glow blobs (triple neon) */}
      <div className="pointer-events-none absolute -top-40 -left-32 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />
      <div className="pointer-events-none absolute top-[-80px] right-[-40px] h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-emerald-500/25 blur-3xl" />

      <div className="relative flex h-full flex-col">
        {/* =========================
            HEADER (Glass)
        ========================== */}
        <header className="z-10 flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-slate-50 shadow-[0_0_22px_rgba(56,189,248,0.7)]">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-sky-300 font-semibold mb-0.5">
                CareSync / Secure Call
              </p>
              <h3 className="text-sm font-semibold text-white">
                {otherUser.firstName} {otherUser.lastName}
              </h3>
              <p className="text-[11px] text-slate-300">
                {otherUser.role && (
                  <span className="mr-1 capitalize text-slate-400">
                    {otherUser.role} •
                  </span>
                )}
                {isCallStarted && formatDuration(callDuration)}
                {!isCallStarted && connectionStatus === "connecting" && (
                  <> Initializing call…</>
                )}
                {!isCallStarted &&
                  connectionStatus === "connected" &&
                  " Waiting for other participant…"}
                {connectionStatus === "disconnected" && " Disconnected"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-200 md:inline-flex">
                You: {currentUser.profile.firstName}{" "}
                {currentUser.profile.lastName}
              </span>
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] ${getStatusColor()}`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                <span>{getStatusText()}</span>
              </div>
            </div>

            {errorMessage && (
              <div className="hidden rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-[11px] text-rose-100 md:block">
                {errorMessage}
              </div>
            )}
          </div>
        </header>

        {/* =========================
            MAIN VIDEO AREA
        ========================== */}
        <main className="relative flex-1 bg-black/90">
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Depth overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/40" />

          {/* Local PiP */}
          <div className="pointer-events-auto absolute right-6 top-6 h-40 w-64 overflow-hidden rounded-2xl border border-white/20 bg-black/70 shadow-[0_0_30px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full scale-x-[-1] object-cover"
            />
            {!isVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/85">
                <VideoOff size={32} className="text-slate-400" />
              </div>
            )}
            <div className="absolute bottom-2 left-2 rounded-full bg-black/75 px-2 py-0.5 text-[10px] text-slate-100">
              You
            </div>
          </div>

          {/* Connecting / Waiting overlay */}
          {(connectionStatus === "connecting" ||
            (connectionStatus === "connected" && !isCallStarted)) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 border-t-transparent animate-spin" />
                  <div className="absolute inset-3 rounded-full border border-emerald-400/40" />
                </div>
                <p className="text-sm text-slate-100 text-center">
                  {connectionStatus === "connecting"
                    ? "Connecting to secure CareSync room…"
                    : "Waiting for the other participant to join…"}
                </p>
                {errorMessage && (
                  <p className="max-w-md text-center text-[11px] text-rose-200">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Disconnected overlay (before call fully starts) */}
          {connectionStatus === "disconnected" && !isCallStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center">
                <p className="text-sm font-medium text-rose-200 mb-2">
                  The other participant has left the call.
                </p>
                <button
                  onClick={endCall}
                  className="mt-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition"
                >
                  Close call
                </button>
              </div>
            </div>
          )}
        </main>

        {/* =========================
            CONTROLS DOCK
        ========================== */}
        <footer className="border-t border-white/10 bg-black/75 px-6 py-5 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-md items-center justify-center gap-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-white transition 
                ${
                  isAudioEnabled
                    ? "border-white/20 bg-white/10 hover:bg-white/20"
                    : "border-rose-500/70 bg-rose-500/90 hover:bg-rose-600"
                }`}
            >
              {isAudioEnabled ? (
                <Mic size={22} />
              ) : (
                <MicOff size={22} />
              )}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`flex h-12 w-12 items-center justify-center rounded-full border text-white transition 
                ${
                  isVideoEnabled
                    ? "border-white/20 bg-white/10 hover:bg-white/20"
                    : "border-rose-500/70 bg-rose-500/90 hover:bg-rose-600"
                }`}
            >
              {isVideoEnabled ? (
                <Video size={22} />
              ) : (
                <VideoOff size={22} />
              )}
            </button>

            {/* End Call */}
            <button
              onClick={endCall}
              className="flex h-14 w-14 items-center justify-center rounded-full border-0 bg-rose-600 text-white shadow-[0_0_22px_rgba(248,113,113,0.7)] hover:bg-rose-700 transition"
            >
              <PhoneOff size={24} />
            </button>
          </div>

          {/* Mobile error banner */}
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-100 md:hidden">
              {errorMessage}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default VideoCall;
