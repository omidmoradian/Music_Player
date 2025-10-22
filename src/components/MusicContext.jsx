import {createContext, useContext, useState, useRef, useEffect} from "react";

const MusicContext = createContext();

export const MusicProvider = ({children}) => {

    const musicAPI = [
        {
            songName: "Be Ki Begam",
            songArtist: "Arshyas",
            songSrc: "/Assets/songs/BeKiBegam.mp3",
            songAvatar: "/Assets/Images/Arshyas.jpg",
        },
        {
            songName: "Az Kooja Begam",
            songArtist: "Leito",
            songSrc: "/Assets/songs/Leito.mp3",
            songAvatar: "/Assets/Images/Leito.jpg",
        },
        {
            songName: "Delam Tange",
            songArtist: "Ashvan",
            songSrc: "/Assets/songs/Ashvan.mp3",
            songAvatar: "/Assets/Images/Ashvan.jpg",
        },
        {
            songName: "Be Joz To",
            songArtist: "Shayan YO",
            songSrc: "/Assets/songs/BejozTo.mp3",
            songAvatar: "/Assets/Images/ShayanYo.jpg",
        },
        {
            songName: "To Ke Midooni",
            songArtist: "Nivad",
            songSrc: "/Assets/songs/Nivad.mp3",
            songAvatar: "/Assets/Images/Nivad.jpg",
        },
        {
            songName: "Saltanat",
            songArtist: "Moharami",
            songSrc: "/Assets/songs/Moharami.mp3",
            songAvatar: "/Assets/Images/Moharamy.jpg",
        },
        {
            songName: "Hichvaght Naboodi",
            songArtist: "ArianFar",
            songSrc: "/Assets/songs/Arianfar.mp3",
            songAvatar: "/Assets/Images/ArianFar.jpg",
        },
        {
            songName: "Bi To Har Shab",
            songArtist: "Novan",
            songSrc: "/Assets/songs/Novan.mp3",
            songAvatar: "/Assets/Images/Novan.jpg",
        },
    ];


    const [musicIndex, setMusicIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState("00:00");
    const [totalTime, setTotalTime] = useState("00:00");
    const RefAudio = useRef(null);

    const musicDetail = musicAPI[musicIndex];

    //*************** pause or play ********************

    const togglePlay = () => {
        const audio = RefAudio.current;
        if (!audio) return;

        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

//***************Next Music*************
    const handleNextMusic = () => {
        setMusicIndex((prev) => (prev >= musicAPI.length - 1 ? 0 : prev + 1));
    };

    //************ prev Music **************
    const handlePrevMusic = () => {
        setMusicIndex((prev) => (prev <= 0 ? musicAPI.length - 1 : prev - 1));
    };

    const handleEnded = () => {
        handleNextMusic();
        setTimeout(() => {
            if (RefAudio.current) {
                RefAudio.current.play();
                setIsPlaying(true);
            }
        }, 200);
    };

    // *********  Skip forward or backward in a song********
    const handleSeek = (e) => {
        const value = e.target.value;
        if (RefAudio.current) {
            RefAudio.current.currentTime =
                (value / 100) * RefAudio.current.duration;
        }
        setProgress(value);
    };

    // ************** Update play music ****************
    useEffect(() => {
        const audio = RefAudio.current;
        if (!audio) return;

        const updateTime = () => {
            const current = audio.currentTime || 0;
            const duration = audio.duration || 0;

            setProgress((current / duration) * 100 || 0);
            setCurrentTime(formatTime(current));
            setTotalTime(formatTime(duration));
        };

        audio.addEventListener("timeupdate", updateTime);
        return () => audio.removeEventListener("timeupdate", updateTime);
    }, []);

    // ********** Auto Next Music **********
    useEffect(() => {
        if (isPlaying && RefAudio.current) {
            RefAudio.current.load();
            RefAudio.current.play();
        }
    }, [musicIndex]);

    // ********** Time **********
    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min.toString().padStart(2, "0")}:${sec
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <MusicContext.Provider
            value={{
                musicAPI,
                musicDetail,
                musicIndex,
                isPlaying,
                RefAudio,
                togglePlay,
                handleNextMusic,
                handlePrevMusic,
                handleEnded,
                progress,
                handleSeek,
                currentTime,
                totalTime,
            }}
        >
            {children}
        </MusicContext.Provider>
    );
};


export const useMusic = () => useContext(MusicContext);