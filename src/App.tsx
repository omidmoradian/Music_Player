import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    IconButton,
    Slider,
    Stack,
    Typography,
    CssBaseline,
    styled,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import ColorThief from "colorthief";

import AlbumVisualizer from "./components/Visualizer/AlbumVisualizer";
import PlaylistPanel from "./components/Playlist/PlaylistPanel";
import {useAudioKit} from "./components/Context/MusicContext";

const Root = styled(Box)(() => ({
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background 1.2s ease",
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
}));

const PlayerCard = styled(Card)(() => ({
    width: "100%",
    maxWidth: 420,
    borderRadius: 30,
    background: "rgba(255, 255, 255, 0.1)", // شفاف سفید
    backdropFilter: "blur(20px)", // بلور قوی‌تر
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)", // سایه ملایم و نرم
    border: "none", // بدون خط حاشیه واضح
}));

const PlayPauseButton = styled(IconButton)(() => ({
    background: "#fff",
    color: "#000",
    width: 70,
    height: 70,
    borderRadius: "50%",
    boxShadow: "0 6px 15px rgba(0,0,0,0.2)", // سایه نرم‌تر
    transition: "background-color 0.3s ease",
    "&:hover": {background: "#f0f0f0"},
}));

const SmallButton = styled(IconButton)(() => ({
    color: "#fff",
    transition: "all 0.25s ease",
    "&:hover": {
        color: "#ffd700", // طلایی ملایم
        transform: "scale(1.15)",
    },
}));

const VolumeRow = styled(Stack)(() => ({
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
}));

const App: React.FC = () => {
    const {
        isAudioPlaying,
        toggleAudio,
        library,
        index,
        favorites,
        toggleFavorite,
        setOpenPanel,
        openPanel,
        duration,
        currentTime,
        handleSeek,
        volume,
        handleVolume,
        nextTrack,
        prevTrack,
        audioRef,
    } = useAudioKit();

    const track = library[index];
    const [bgColor, setBgColor] = useState<string>(
        "linear-gradient(180deg, #f4cc52 0%, #c18c00 100%)"
    );

    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = track.cover;
        img.onload = () => {
            try {
                const colorThief = new ColorThief();
                const [r, g, b] = colorThief.getColor(img);
                setBgColor(`linear-gradient(180deg, rgb(${r},${g},${b}) 0%, #000 100%)`);
            } catch {
                setBgColor("linear-gradient(180deg, #f4cc52 0%, #c18c00 100%)");
            }
        };
    }, [track.cover]);

    return (
        <>
            <CssBaseline/>
            <Root sx={{background: bgColor}}>
                <Container maxWidth="xs">
                    <Stack spacing={2} alignItems="center">
                        <AlbumVisualizer
                            audioElementReference={audioRef}
                            isAudioPlaying={isAudioPlaying}
                            albumCoverImageUrl={track.cover}
                            visualizerSize={280}
                        />

                        <PlayerCard>
                            <CardContent>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    sx={{mb: 1}}
                                >
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{fontWeight: 800, color: "#fff", lineHeight: 1.1}}
                                        >
                                            {track.title}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{color: "rgba(255,255,255,0.7)", fontWeight: 500}}
                                        >
                                            {track.artist}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <SmallButton onClick={() => toggleFavorite(track.id)}>
                                            {favorites.includes(track.id) ? (
                                                <FavoriteIcon sx={{color: "#ff6b81"}}/>
                                            ) : (
                                                <FavoriteBorderIcon/>
                                            )}
                                        </SmallButton>
                                        <SmallButton onClick={() => setOpenPanel(true)}>
                                            <QueueMusicIcon/>
                                        </SmallButton>
                                    </Box>
                                </Stack>

                                {/* اسلایدر زمان موزیک */}
                                <Slider
                                    value={currentTime}
                                    min={0}
                                    max={duration || 100}
                                    onChange={(_, value) => handleSeek(value as number)}
                                    sx={{
                                        color: "#fff",
                                        height: 4,
                                        "& .MuiSlider-thumb": {
                                            width: 16,
                                            height: 16,
                                            backgroundColor: "#fff",
                                            boxShadow: "0 0 5px rgba(255,255,255,0.7)",
                                            "&:hover": {
                                                boxShadow: "0 0 10px rgba(255,255,255,1)",
                                            },
                                        },
                                        "& .MuiSlider-rail": {
                                            opacity: 0.3,
                                            backgroundColor: "#fff",
                                        },
                                        "& .MuiSlider-track": {
                                            border: "none",
                                        },
                                    }}
                                />

                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" color="rgba(255,255,255,0.8)">
                                        {new Date(currentTime * 1000).toISOString().substr(14, 5)}
                                    </Typography>
                                    <Typography variant="caption" color="rgba(255,255,255,0.8)">
                                        {new Date((duration || 0) * 1000).toISOString().substr(14, 5)}
                                    </Typography>
                                </Stack>

                                <Stack
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{mt: 1.5, mb: 1}}
                                >
                                    <SmallButton onClick={prevTrack}>
                                        <SkipPreviousIcon fontSize="large"/>
                                    </SmallButton>
                                    <PlayPauseButton onClick={toggleAudio}>
                                        {isAudioPlaying ? (
                                            <PauseIcon fontSize="large"/>
                                        ) : (
                                            <PlayArrowIcon fontSize="large"/>
                                        )}
                                    </PlayPauseButton>
                                    <SmallButton onClick={nextTrack}>
                                        <SkipNextIcon fontSize="large"/>
                                    </SmallButton>
                                </Stack>

                                {/* اسلایدر ولوم */}
                                <VolumeRow direction="row" spacing={1}>
                                    <VolumeDown sx={{color: "#fff"}}/>
                                    <Slider
                                        value={volume}
                                        min={0}
                                        max={100}
                                        onChange={(_, value) => handleVolume(value as number)}
                                        sx={{
                                            color: "#fff",
                                            height: 4,
                                            "& .MuiSlider-thumb": {
                                                backgroundColor: "#fff",
                                                width: 14,
                                                height: 14,
                                                boxShadow: "0 0 4px rgba(255,255,255,0.7)",
                                                "&:hover": {
                                                    boxShadow: "0 0 8px rgba(255,255,255,1)",
                                                },
                                            },
                                            "& .MuiSlider-rail": {
                                                opacity: 0.3,
                                                backgroundColor: "#fff",
                                            },
                                            "& .MuiSlider-track": {
                                                border: "none",
                                            },
                                        }}
                                    />
                                    <VolumeUp sx={{color: "#fff"}}/>
                                </VolumeRow>
                            </CardContent>
                        </PlayerCard>

                        <audio ref={audioRef} hidden/>
                    </Stack>
                </Container>

                <PlaylistPanel open={openPanel} onClose={() => setOpenPanel(false)}/>
            </Root>
        </>
    );
};

export default App;
