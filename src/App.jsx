import React from "react";
import "./App.css";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import {useMusic} from "./components/MusicContext.jsx";

const App = () => {
    const {
        progress,
        handleSeek,
        musicDetail,
        RefAudio,
        isPlaying,
        handleNextMusic,
        handlePrevMusic,
        togglePlay,
        handleEnded,
        currentTime,
        totalTime,
    } = useMusic();

    return (
        <Box className="container">

            <audio
                ref={RefAudio}
                src={musicDetail.songSrc}
                onEnded={handleEnded}
                preload="auto"
            />


            <video autoPlay muted loop className="backgroundVideo">
                <source src="/Assets/songs/Video.mp4" type="video/mp4"/>
            </video>


            <Box className="blackScreen"/>


            <Box className="music-Container">

                <p className="trackName">{musicDetail.songName}</p>
                <p className="artistName">{musicDetail.songArtist}</p>


                <div className={`visualizerWrapper ${isPlaying ? "playing" : "paused"}`}>
                    <div className="visualizerRing"/>
                    <div className="visualizerWave"/>
                    <img
                        src={musicDetail.songAvatar}
                        alt="Song"
                        className="visualizerAvatar"
                        id="songAvatar"
                    />
                </div>


                <Box className="TimerDiv">
                    <p className="currentTime">{currentTime}</p>
                    <p className="totalLength">{totalTime}</p>
                </Box>


                <Box width={300}>
                    <Slider
                        value={progress}
                        onChange={handleSeek}
                        min={0}
                        max={100}
                        sx={{
                            color: "#002e7e",
                            height: 6,
                            "& .MuiSlider-thumb": {
                                width: 14,
                                height: 14,
                                backgroundColor: "#fff8f8",
                                "&:hover": {boxShadow: "0 0 0 6px rgba(41,121,255,0.16)"},
                            },
                            "& .MuiSlider-track": {border: "none"},
                            "& .MuiSlider-rail": {
                                opacity: 0.4,
                                backgroundColor: "#000000",
                            },
                        }}
                    />
                </Box>


                <Box className="controls">
                    <SkipPreviousOutlinedIcon
                        onClick={handlePrevMusic}
                        sx={{marginRight: "1.5rem", cursor: "pointer"}}
                    />
                    {isPlaying ? (
                        <PauseCircleIcon
                            onClick={togglePlay}
                            sx={{cursor: "pointer"}}
                        />
                    ) : (
                        <PlayCircleIcon
                            onClick={togglePlay}
                            sx={{cursor: "pointer"}}
                        />
                    )}
                    <SkipNextOutlinedIcon
                        onClick={handleNextMusic}
                        sx={{marginLeft: "1.5rem", cursor: "pointer"}}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default App;
