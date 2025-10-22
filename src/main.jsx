import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {MusicProvider} from "./components/MusicContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <MusicProvider>
        <App/>
    </MusicProvider>
);