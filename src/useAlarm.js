import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const useAlarm = (id) => {
  const [alarms, setAlarms] = useState([]);
  const triggered = useRef(new Set());
  const audioRef = useRef(null);
  const stopTimeoutRef = useRef(null);

  // 🔊 PLAY ALARM (EXACT 1 MINUTE)
  const playAlarm = (msg) => {
    const enabled = localStorage.getItem("alarmEnabled");

    let audio;

    // 🔊 SOUND
    if (enabled) {
      audio = new Audio("/alarm.mp3");
      audio.loop = true;
      audioRef.current = audio;

      audio.play().catch(() => {
        console.log("Sound blocked");
      });
    }

    // 🔊 VOICE MESSAGE
    const speech = new SpeechSynthesisUtterance(msg || "Alarm ringing");
    window.speechSynthesis.speak(speech);

    // ⏱️ STOP AFTER 1 MINUTE
    stopTimeoutRef.current = setTimeout(() => {
      stopAlarm();
    }, 60000);
  };

  // 🛑 MANUAL STOP FUNCTION
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    window.speechSynthesis.cancel();

    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }
  };

  // 📥 FETCH ALARMS FROM DATABASE
  useEffect(() => {
    if (!id) return;

    axios
      .get("http://127.0.0.1:5000/aldb", {
        params: { id },
      })
      .then((res) => {
        setAlarms(res.data || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ⏰ CHECK ALARM TIME
  useEffect(() => {
    if (alarms.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();

      alarms.forEach((alarm) => {
        const alarmTime = new Date(alarm.date);
        const diff = alarmTime - now;

        // Trigger only within ±5 seconds window
        if (
          diff <= 5000 &&
          diff >= -5000 &&
          !triggered.current.has(alarm._id)
        ) {
          playAlarm(alarm.ring);
          triggered.current.add(alarm._id);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [alarms]);

  // 🔄 RESET TRIGGERED WHEN USER CHANGES
  useEffect(() => {
    triggered.current.clear();
  }, [id]);

  // 🔓 ENABLE AUDIO AFTER FIRST USER CLICK
  useEffect(() => {
    const unlockAudio = () => {
      const audio = new Audio("/alarm.mp3");

      audio.volume = 0; // silent unlock

      audio
        .play()
        .then(() => {
          audio.pause();
          audio.currentTime = 0;
          localStorage.setItem("alarmEnabled", "true");
        })
        .catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  return { stopAlarm };
};