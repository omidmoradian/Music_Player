import React, {createContext, useContext, useRef, useState, useEffect} from "react";

export interface SongType {
    id: number;
    title: string;
    artist: string;
    cover: string;
    source: string;
}

export interface Playlist {
    id: string;
    name: string;
    songs: SongType[];
}

export interface MusicContextType {
    isAudioPlaying: boolean;
    toggleAudio: () => void;
    library: SongType[];
    index: number;
    setIndex: (i: number) => void;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    duration: number;
    currentTime: number;
    setCurrentTime: (value: number) => void;
    volume: number;
    setVolume: (value: number) => void;
    openPanel: boolean;
    setOpenPanel: (value: boolean) => void;
    playlists: Playlist[];
    addToPlaylist: (playlistId: string, song: SongType) => void;
    createPlaylist: (name: string) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    handleSeek: (value: number) => void;
    handleVolume: (value: number) => void;
}

const MusicContext = createContext<MusicContextType>({} as MusicContextType);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [library] = useState<SongType[]>([
        {
            id: 1,
            title: "Shadow Nights",
            artist: "Arshyas",
            source: "/Assets/songs/BeKiBegam.mp3",
            cover: "/Assets/Images/Arshyas.jpg"
        },
        {
            id: 2,
            title: "Another Dream",
            artist: "Leito",
            source: "/Assets/songs/Leito.mp3",
            cover: "/Assets/Images/Leito.jpg"
        },
        {
            id: 3,
            title: "Last Words",
            artist: "Ashvan",
            source: "/Assets/songs/Ashvan.mp3",
            cover: "/Assets/Images/Ashvan.jpg"
        },
        {
            id: 4,
            title: "Be Joz To",
            artist: "Shayan YO",
            source: "/Assets/songs/BejozTo.mp3",
            cover: "/Assets/Images/ShayanYo.jpg"
        },
        {
            id: 5,
            title: "To Ke Midooni",
            artist: "Nivad",
            source: "/Assets/songs/Nivad.mp3",
            cover: "/Assets/Images/Nivad.jpg"
        },
        {
            id: 6,
            title: "Saltanat",
            artist: "Moharami",
            source: "/Assets/songs/Moharami.mp3",
            cover: "/Assets/Images/Moharamy.jpg"
        },
        {
            id: 7,
            title: "Hichvaght Naboodi",
            artist: "ArianFar",
            source: "/Assets/songs/Arianfar.mp3",
            cover: "/Assets/Images/ArianFar.jpg"
        },
        {
            id: 8,
            title: "Bi To Har Shab",
            artist: "Novan",
            source: "/Assets/songs/Novan.mp3",
            cover: "/Assets/Images/Novan.jpg"
        },
    ]);

    const [index, setIndex] = useState(0);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(50);
    const [openPanel, setOpenPanel] = useState(false);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const audioRef = useRef<HTMLAudioElement>(null);

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!isAudioPlaying) {
            audio.play().then(() => setIsAudioPlaying(true)).catch(() => setIsAudioPlaying(false));
        } else {
            audio.pause();
            setIsAudioPlaying(false);
        }
    };

    const toggleFavorite = (id: number) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const nextTrack = () => setIndex(prev => (prev + 1) % library.length);
    const prevTrack = () => setIndex(prev => (prev - 1 + library.length) % library.length);

    const handleSeek = (value: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = value;
        setCurrentTime(value);
    };

    const handleVolume = (value: number) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = value / 100;
        setVolume(value);
    };

    // وقتی ترک تغییر میکنه
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.src = library[index].source;
        audio.load();
        setCurrentTime(0);

        if (isAudioPlaying) {
            audio.play().catch(() => setIsAudioPlaying(false));
        }
    }, [index, library]);

    // مدیریت آپدیت زمان و پایان ترک
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoaded = () => setDuration(audio.duration);
        const handleTime = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => nextTrack();

        audio.addEventListener("loadedmetadata", handleLoaded);
        audio.addEventListener("timeupdate", handleTime);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoaded);
            audio.removeEventListener("timeupdate", handleTime);
            audio.removeEventListener("ended", handleEnded);
        };
    }, [audioRef]);

    const createPlaylist = (name: string) => {
        const newPlaylist: Playlist = {id: Date.now().toString(), name, songs: []};
        setPlaylists(prev => [...prev, newPlaylist]);
    };

    const addToPlaylist = (playlistId: string, song: SongType) => {
        setPlaylists(prev =>
            prev.map(p =>
                p.id === playlistId && !p.songs.find(s => s.id === song.id)
                    ? {...p, songs: [...p.songs, song]}
                    : p
            )
        );
    };

    return (
        <MusicContext.Provider
            value={{
                isAudioPlaying,
                toggleAudio,
                library,
                index,
                setIndex,
                favorites,
                toggleFavorite,
                audioRef,
                duration,
                currentTime,
                setCurrentTime,
                volume,
                setVolume,
                openPanel,
                setOpenPanel,
                playlists,
                addToPlaylist,
                createPlaylist,
                nextTrack,
                prevTrack,
                handleSeek,
                handleVolume,
            }}
        >
            {children}
            <audio ref={audioRef}/>
        </MusicContext.Provider>
    );
};

export const useAudioKit = () => useContext(MusicContext);
