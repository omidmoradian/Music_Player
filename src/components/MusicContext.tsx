import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useEffect,
    ReactNode,
} from "react";

export type TrackInfo = {
    title: string;
    artist: string;
    source: string;
    cover: string;
};

export type MusicContextType = {
    library: TrackInfo[];
    track: TrackInfo;
    index: number;
    isActive: boolean;
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
    barProgress: number;
    elapsed: string;
    duration: string;
    toggleAudio: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    onSeekChange: (
        event: Event | React.SyntheticEvent,
        value: number | number[]
    ) => void;
    onAudioEnd: () => void;
};

// ✅ ساخت Context واقعی
const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const AudioKitProvider: React.FC<{ children: ReactNode }> = ({
                                                                        children,
                                                                    }) => {
    const library: TrackInfo[] = [
        {
            title: "Shadow Nights",
            artist: "Arshyas",
            source: "/Assets/songs/BeKiBegam.mp3",
            cover: "/Assets/Images/Arshyas.jpg",
        },
        {
            title: "Another Dream",
            artist: "Leito",
            source: "/Assets/songs/Leito.mp3",
            cover: "/Assets/Images/Leito.jpg",
        },
        {
            title: "Last Words",
            artist: "Ashvan",
            source: "/Assets/songs/Ashvan.mp3",
            cover: "/Assets/Images/Ashvan.jpg",
        },
        {
            title: "Be Joz To",
            artist: "Shayan YO",
            source: "/Assets/songs/BejozTo.mp3",
            cover: "/Assets/Images/ShayanYo.jpg",
        },
        {
            title: "To Ke Midooni",
            artist: "Nivad",
            source: "/Assets/songs/Nivad.mp3",
            cover: "/Assets/Images/Nivad.jpg",
        },
        {
            title: "Saltanat",
            artist: "Moharami",
            source: "/Assets/songs/Moharami.mp3",
            cover: "/Assets/Images/Moharamy.jpg",
        },
        {
            title: "Hichvaght Naboodi",
            artist: "ArianFar",
            source: "/Assets/songs/Arianfar.mp3",
            cover: "/Assets/Images/ArianFar.jpg",
        },
        {
            title: "Bi To Har Shab",
            artist: "Novan",
            source: "/Assets/songs/Novan.mp3",
            cover: "/Assets/Images/Novan.jpg",
        },
    ];

    const [index, setIndex] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [barProgress, setBarProgress] = useState(0);
    const [elapsed, setElapsed] = useState("00:00");
    const [duration, setDuration] = useState("00:00");

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const track = library[index];

    const toggleAudio = () => {
        const el = audioRef.current;
        if (!el) return;

        if (el.paused) {
            el.play().then(() => setIsActive(true)).catch(() => {
            });
        } else {
            el.pause();
            setIsActive(false);
        }
    };

    const nextTrack = () => {
        setIndex((i) => (i >= library.length - 1 ? 0 : i + 1));
    };

    const prevTrack = () => {
        setIndex((i) => (i <= 0 ? library.length - 1 : i - 1));
    };

    const onAudioEnd = () => {
        nextTrack();
        setTimeout(() => {
            const el = audioRef.current;
            if (el) {
                el.play().then(() => setIsActive(true)).catch(() => {
                });
            }
        }, 120);
    };

    const onSeekChange = (
        _: Event | React.SyntheticEvent,
        value: number | number[]
    ) => {
        const val = Array.isArray(value) ? value[0] : value;
        const el = audioRef.current;
        if (el && !isNaN(el.duration)) {
            el.currentTime = (val / 100) * el.duration;
            setBarProgress(val);
        }
    };

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds)) return "00:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const update = () => {
            const cur = el.currentTime || 0;
            const dur = el.duration || 0;
            setBarProgress(dur ? (cur / dur) * 100 : 0);
            setElapsed(formatTime(cur));
            setDuration(formatTime(dur));
        };

        el.addEventListener("timeupdate", update);
        el.addEventListener("loadedmetadata", update);

        return () => {
            el.removeEventListener("timeupdate", update);
            el.removeEventListener("loadedmetadata", update);
        };
    }, []);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        el.load();
        if (isActive) {
            el.play().catch(() => {
            });
        }
    }, [index, isActive]);

    const value: MusicContextType = {
        library,
        track,
        index,
        isActive,
        audioRef,
        barProgress,
        elapsed,
        duration,
        toggleAudio,
        nextTrack,
        prevTrack,
        onSeekChange,
        onAudioEnd,
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
            {/* اضافه کردن تگ audio برای کارکرد کامل */}
            <audio ref={audioRef} src={track.source} onEnded={onAudioEnd}/>
        </MusicContext.Provider>
    );
};

// ✅ هوک اختصاصی برای استفاده از context
export const useAudioKit = (): MusicContextType => {
    const ctx = useContext(MusicContext);
    if (!ctx)
        throw new Error("useAudioKit must be used within an <AudioKitProvider>");
    return ctx;
};
