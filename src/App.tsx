import React from "react";
import {Box, Slider, IconButton, Typography, styled} from "@mui/material";
import SkipPreviousOutlinedIcon from "@mui/icons-material/SkipPreviousOutlined";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import {useAudioKit} from "./components/Context/MusicContext";
import AlbumVisualizer from "./components/Visualizer/AlbumVisualizer";

// 🧩 --- Styled Components ---
const Wrapper = styled(Box)({
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
});

const BackgroundVideo = styled("video")({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    zIndex: -2,
    filter: "saturate(2.5)",
});

const Overlay = styled(Box)({
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(17,17,17,0.2)",
    zIndex: -1,
});

const PlayerBox = styled(Box)({
    width: 350,
    padding: "35px 40px",
    borderRadius: "36px",
    backdropFilter: "blur(15px)",
    boxShadow:
        "0 0 20px rgba(26,26,26,0.1), 0 0 40px rgba(26,26,26,0.1), 0 0 80px rgba(26,26,26,0.1)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
});

const TimeInfo = styled(Box)({
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: "1.5rem",
    fontWeight: 500,
    fontSize: "0.9rem",
});

const Controls = styled(Box)({
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
});


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
        <Wrapper>
            <BackgroundVideo autoPlay muted loop>
                <source src="/Assets/songs/Video.mp4" type="video/mp4"/>
            </BackgroundVideo>
            <Overlay/>

            <PlayerBox>
                <Typography variant="h5" sx={{fontWeight: 700, mb: 0}}>
                    {track.title}
                </Typography>
                <Typography
                    sx={{
                        color: "rgb(28,28,28)",
                        mb: 2,
                        fontSize: "1.3rem",
                        fontWeight: 700,
                    }}
                >
                    {track.artist}
                </Typography>

                <AlbumVisualizer
                    audioElementReference={audioRef}
                    isAudioPlaying={isActive}
                    albumCoverImageUrl={track.cover}
                />

                <TimeInfo>
                    <Typography>{elapsed}</Typography>
                    <Typography>{duration}</Typography>
                </TimeInfo>

                <Slider
                    value={barProgress}
                    onChange={onSeekChange}
                    min={0}
                    max={100}
                    aria-label="seek-bar"
                    sx={{
                        width: "100%",
                        mt: 1,
                        color: "#00ffff",
                        height: 6,
                        "& .MuiSlider-thumb": {
                            width: 14,
                            height: 14,
                            backgroundColor: "#fff",
                            "&:hover": {boxShadow: "0 0 0 6px rgba(0,255,255,0.2)"},
                        },
                        "& .MuiSlider-rail": {
                            opacity: 0.3,
                            backgroundColor: "#000",
                        },
                    }}
                />

                <Controls>
                    <IconButton onClick={prevTrack} sx={{color: "#fff"}}>
                        <SkipPreviousOutlinedIcon fontSize="large"/>
                    </IconButton>

                    <IconButton onClick={toggleAudio} sx={{color: "#fff", mx: 2}}>
                        {isActive ? (
                            <PauseCircleIcon sx={{fontSize: 65}}/>
                        ) : (
                            <PlayCircleIcon sx={{fontSize: 65}}/>
                        )}
                    </IconButton>

                    <IconButton onClick={nextTrack} sx={{color: "#fff"}}>
                        <SkipNextOutlinedIcon fontSize="large"/>
                    </IconButton>
                </Controls>

                <audio
                    ref={audioRef}
                    src={track.source}
                    onEnded={onAudioEnd}
                    preload="auto"
                />
            </PlayerBox>
        </Wrapper>
    );
};

export default App;
