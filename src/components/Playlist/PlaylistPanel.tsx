import React, {useState} from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    styled,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import {useAudioKit} from "../Context/MusicContext";

type PlaylistPanelProps = {
    open: boolean;
    onClose: () => void;
};

const StyledDrawer = styled(Drawer)({
    "& .MuiDrawer-paper": {
        width: 340,
        background: "rgba(18,18,18,0.88)",
        backdropFilter: "blur(20px) saturate(180%)",
        color: "#fff",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 30px rgba(0,0,0,0.25)",
        padding: 14,
    },
});

const SongItem = styled(ListItem)(() => ({
    cursor: "pointer",
    borderRadius: 14,
    marginBottom: 8,
    transition: "background 0.18s ease",
    "&:hover": {background: "rgba(255,255,255,0.06)"},
}));

const PlaylistPanel: React.FC<PlaylistPanelProps> = ({open, onClose}) => {
    const {
        library,
        index,
        audioRef,
        setIndex,
        favorites,
        toggleFavorite,
        playlists,
        createPlaylist,
        addToPlaylist,
    } = useAudioKit();

    const [openDialog, setOpenDialog] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [selectedSongForAdd, setSelectedSongForAdd] = useState<number | null>(
        null
    );

    const handleSelectSong = (i: number) => {
        setIndex(i);
        const audio = audioRef.current;
        if (audio) {
            audio.src = library[i].source;
            audio.load();
            audio.play().catch(() => {
            });
        }
        onClose();
    };

    const handleAddToPlaylist = (songId: number) => {
        setSelectedSongForAdd(songId);
        setOpenDialog(true);
    };

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName("");
        }
    };

    return (
        <>
            <StyledDrawer anchor="right" open={open} onClose={onClose}>
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: "center",
                        mt: 1,
                        mb: 1,
                        fontWeight: 700,
                        color: "#FFD95A",
                    }}
                >
                    Music
                </Typography>

                <List>
                    {library.map((song, i) => (
                        <SongItem key={song.id} onClick={() => handleSelectSong(i)}>
                            <ListItemAvatar>
                                <Avatar
                                    src={song.cover}
                                    alt={song.title}
                                    sx={{width: 52, height: 52}}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={song.title}
                                secondary={song.artist}
                                secondaryTypographyProps={{
                                    sx: {color: "#a9afb8", fontSize: "0.85rem"},
                                }}
                            />
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(song.id);
                                }}
                                sx={{color: favorites.includes(song.id) ? "#ff6b81" : "#fff"}}
                            >
                                {favorites.includes(song.id) ? (
                                    <FavoriteIcon/>
                                ) : (
                                    <FavoriteBorderIcon/>
                                )}
                            </IconButton>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToPlaylist(song.id);
                                }}
                                sx={{color: "#FFD95A"}}
                            >
                                <PlaylistAddIcon/>
                            </IconButton>
                        </SongItem>
                    ))}
                </List>

                <Divider sx={{my: 2, borderColor: "rgba(255,255,255,0.08)"}}/>

                <Typography variant="subtitle1" sx={{mb: 1, fontWeight: 600}}>
                    Your Playlists
                </Typography>

                <List>
                    {playlists.length === 0 && (
                        <Typography sx={{color: "#999", fontSize: "0.9rem", pl: 1}}>
                            No playlists yet
                        </Typography>
                    )}
                    {playlists.map((p) => (
                        <ListItem
                            key={p.id}
                            disablePadding
                            onClick={() => {
                                if (selectedSongForAdd !== null) {
                                    const song = library.find((s) => s.id === selectedSongForAdd);
                                    if (song) addToPlaylist(p.id, song);
                                    setSelectedSongForAdd(null);
                                    setOpenDialog(false);
                                }
                            }}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {background: "rgba(255,255,255,0.05)"},
                                borderRadius: 1,
                                mb: 1,
                                px: 2,
                            }}
                        >
                            <ListItemText primary={p.name} secondary={`${p.songs.length} songs`}/>
                        </ListItem>
                    ))}
                </List>
            </StyledDrawer>

            {/* Dialog for playlist management */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Create or Select Playlist</DialogTitle>
                <DialogContent>
                    <TextField
                        label="New Playlist Name"
                        variant="outlined"
                        fullWidth
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        sx={{mt: 1}}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleCreatePlaylist}
                        sx={{
                            mt: 2,
                            backgroundColor: "#FFD95A",
                            color: "#000",
                            "&:hover": {backgroundColor: "#FFC93C"},
                        }}
                    >
                        Create Playlist
                    </Button>

                    <Typography variant="subtitle2" sx={{mt: 3, mb: 1}}>
                        Existing Playlists
                    </Typography>
                    <List>
                        {playlists.map((p) => (
                            <ListItem
                                key={p.id}
                                disablePadding
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {background: "rgba(0,0,0,0.05)"},
                                    borderRadius: 1,
                                    mb: 1,
                                    px: 2,
                                }}
                                onClick={() => {
                                    const song = library.find((s) => s.id === selectedSongForAdd);
                                    if (song) addToPlaylist(p.id, song);
                                    setSelectedSongForAdd(null);
                                    setOpenDialog(false);
                                }}
                            >
                                <ListItemText primary={p.name} secondary={`${p.songs.length} songs`}/>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PlaylistPanel;
