import React, {useEffect, useRef} from "react";
import Box from "@mui/material/Box";

interface AlbumVisualizerProps {
    audioElementReference: React.RefObject<HTMLAudioElement> | React.MutableRefObject<HTMLAudioElement | null>;
    isAudioPlaying: boolean;
    albumCoverImageUrl: string;
    visualizerSize?: number;
}

const AlbumVisualizer: React.FC<AlbumVisualizerProps> = ({
                                                             audioElementReference,
                                                             isAudioPlaying,
                                                             albumCoverImageUrl,
                                                             visualizerSize = 220,
                                                         }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const audio = audioElementReference.current;
        if (!canvas || !audio) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = visualizerSize * dpr;
        canvas.height = visualizerSize * dpr;
        ctx.scale(dpr, dpr);

        if (!audioContextRef.current)
            audioContextRef.current = new AudioContext();

        const audioContext = audioContextRef.current;

        if (!analyserRef.current) {
            analyserRef.current = audioContext.createAnalyser();
            analyserRef.current.fftSize = 256;
            analyserRef.current.smoothingTimeConstant = 0.8;
        }

        const analyser = analyserRef.current;

        if (!sourceRef.current) {
            sourceRef.current = audioContext.createMediaElementSource(audio);
            sourceRef.current.connect(analyser);
            analyser.connect(audioContext.destination);
        }

        const frequencyData = new Uint8Array(analyser.frequencyBinCount);

        const renderFrame = () => {
            analyser.getByteFrequencyData(frequencyData);
            const width = visualizerSize;
            const height = visualizerSize;
            const cx = width / 2;
            const cy = height / 2;
            const baseRadius = visualizerSize / 3;

            ctx.clearRect(0, 0, width, height);

            const totalBars = 120;
            for (let i = 0; i < totalBars; i++) {
                const angle = (i / totalBars) * Math.PI * 2;
                const idx = Math.floor((i / totalBars) * frequencyData.length);
                const amplitude =
                    Math.max(frequencyData[idx] / 5, 2) +
                    Math.random() * 1.5;

                const x1 = cx + Math.cos(angle) * baseRadius;
                const y1 = cy + Math.sin(angle) * baseRadius;
                const x2 = cx + Math.cos(angle) * (baseRadius + amplitude);
                const y2 = cy + Math.sin(angle) * (baseRadius + amplitude);

                const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                gradient.addColorStop(0, `hsl(${i * 5}, 100%, 65%)`);
                gradient.addColorStop(1, `hsl(${i * 5 + 40}, 100%, 75%)`);

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            animationRef.current = requestAnimationFrame(renderFrame);
        };

        if (isAudioPlaying) {
            audioContext.resume();
            renderFrame();
        } else if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            ctx.clearRect(0, 0, visualizerSize, visualizerSize);
        }

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [audioElementReference, isAudioPlaying, visualizerSize]);

    return (
        <Box
            sx={{
                position: "relative",
                width: visualizerSize,
                height: visualizerSize,
                margin: "auto",
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    margin: "auto",
                    background: "transparent",
                    pointerEvents: "none",
                }}
            />
            <Box
                component="img"
                src={albumCoverImageUrl}
                alt="Album cover"
                sx={{
                    width: "75%",
                    height: "75%",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "12.5%",
                    left: "12.5%",
                    objectFit: "cover",
                    transition: "transform 0.4s ease-in-out",
                    transform: isAudioPlaying ? "scale(1.05)" : "scale(1)",
                    boxShadow: isAudioPlaying
                        ? "0 0 25px rgba(0,255,255,0.5)"
                        : "0 0 10px rgba(0,0,0,0.2)",
                }}
            />
        </Box>
    );
};

export default AlbumVisualizer;
