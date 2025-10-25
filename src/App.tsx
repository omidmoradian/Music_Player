import React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import {useAudioKit} from "./components/MusicContext";
import "./App.css";

const App = () => {
    const {
        barProgress,
        onSeekChange,
        track,
        audioRef,
        isActive,
        nextTrack,
        prevTrack,
        toggleAudio,
        onAudioEnd,
        elapsed,
        duration,
    } = useAudioKit();

    return (
        <Box className="wrapper">
            <audio
                ref={audioRef}
                src={track.source}
                onEnded={onAudioEnd}
                preload="auto"
            />

            <video autoPlay muted loop className="bgClip">
                <source src="/Assets/songs/Video.mp4" type="video/mp4"/>
            </video>

            <Box className="overlay"/>

            <Box className="playerBox">
                <p className="titleTxt">{track.title}</p>
                <p className="artistTxt">{track.artist}</p>

                <div className={`visualBox ${isActive ? "on" : "off"}`}>
                    <div className="ringAnim"/>
                    <div className="waveAnim"/>
                    <img
                        src={track.cover}
                        alt="cover"
                        className="albumCover"
                        id="albumImg"
                    />
                </div>

                <Box className="timeInfo">
                    <p className="elapsed">{elapsed}</p>
                    <p className="duration">{duration}</p>
                </Box>

                <Box width={300}>
                    <Slider
                        value={barProgress}
                        onChange={onSeekChange}
                        min={0}
                        max={100}
                        aria-label="seek-bar"
                        sx={{
                            color: "#1c2954",
                            height: 6,
                            "& .MuiSlider-thumb": {
                                width: 14,
                                height: 14,
                                backgroundColor: "#f7f7f7",
                                "&:hover": {
                                    boxShadow: "0 0 0 6px rgba(41,121,255,0.16)",
                                },
                            },
                            "& .MuiSlider-track": {border: "none"},
                            "& .MuiSlider-rail": {
                                opacity: 0.4,
                                backgroundColor: "#000000",
                            },
                        }}
                    />
                </Box>

                <Box className="controlPanel">
                    <SkipPreviousOutlinedIcon
                        onClick={prevTrack}
                        sx={{marginRight: "1.5rem", cursor: "pointer"}}
                    />
                    {isActive ? (
                        <PauseCircleIcon
                            onClick={toggleAudio}
                            sx={{cursor: "pointer"}}
                        />
                    ) : (
                        <PlayCircleIcon
                            onClick={toggleAudio}
                            sx={{cursor: "pointer"}}
                        />
                    )}
                    <SkipNextOutlinedIcon
                        onClick={nextTrack}
                        sx={{marginLeft: "1.5rem", cursor: "pointer"}}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default App;
