import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

import {MusicProvider} from "./components/Context/MusicContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <MusicProvider>
            <App/>
        </MusicProvider>
    </React.StrictMode>
);
