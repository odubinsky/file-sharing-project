import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "antd/dist/antd.min.css";
import App from "./App";
import { UploadContextProvider } from "./context/UploadContext/UploadContext";
import { ModalContextProvider } from "./context/ModalContext/ModalContext";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ModalContextProvider>
      <UploadContextProvider>
        <App />
      </UploadContextProvider>
    </ModalContextProvider>
  </React.StrictMode>
);
