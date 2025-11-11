import React, {useEffect, useRef} from "react";
import {Box, styled} from "@mui/material";

interface AlbumVisualizerProps {
    audioElementReference: React.RefObject<HTMLAudioElement | null>;
    isAudioPlaying: boolean;
    albumCoverImageUrl: string;
    visualizerSize: number;
}

const VisualizerWrapper = styled(Box)<{ size: number }>(({size}) => ({
    position: "relative",
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const RotatingRing = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isPlaying",
})<{ isPlaying: boolean }>(({isPlaying}) => ({
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    border: "6px solid rgba(255, 215, 0, 0.9)",  // طلایی تر و ضخیم تر
    boxShadow:
        "0 0 30px 8px rgba(255, 215, 0, 0.7), inset 0 0 30px 10px rgba(255, 255, 255, 0.15)",
    animation: isPlaying ? "spin 14s linear infinite" : "none",
    "@keyframes spin": {
        from: {transform: "rotate(0deg)"},
        to: {transform: "rotate(360deg)"},
    },
    transition: "border-color 0.3s ease",
}));

const GlowShadow = styled(Box)({
    position: "absolute",
    width: "92%",
    height: "92%",
    borderRadius: "50%",
    background:
        "radial-gradient(circle, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0) 75%)",
    filter: "blur(12px)",
    zIndex: 0,
});

const AlbumImage = styled("img")({
    width: "85%",           // کمی بزرگ‌تر
    height: "85%",
    borderRadius: "50%",
    objectFit: "cover",
    boxShadow: "0 15px 40px rgba(0,0,0,0.6)",  // سایه قوی‌تر و بهتر
    border: "4px solid rgba(255, 255, 255, 0.25)", // کادر سفید کم‌رنگ
    zIndex: 2,
    transition: "transform 0.3s ease",
});

const AlbumVisualizer: React.FC<AlbumVisualizerProps> = ({
                                                             albumCoverImageUrl,
                                                             visualizerSize = 280,
                                                             isAudioPlaying,
                                                             audioElementReference,
                                                         }) => {
    const imgRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const audio = audioElementReference.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (imgRef.current) {
                const scale = isAudioPlaying
                    ? 1 + Math.sin(audio.currentTime * 5) * 0.02
                    : 1;
                imgRef.current.style.transform = `scale(${scale})`;
            }
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
    }, [audioElementReference, isAudioPlaying]);

    return (
        <VisualizerWrapper size={visualizerSize}>
            <GlowShadow/>
            <RotatingRing isPlaying={isAudioPlaying}/>
            <AlbumImage ref={imgRef} src={albumCoverImageUrl} alt="Album Cover"/>
        </VisualizerWrapper>
    );
};

export default AlbumVisualizer;
