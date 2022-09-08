import "./App.css";
import React from "react";
import UploadCard from "./UploadCard/UploadCard";
import { useEffect } from "react";
import { UploadContextProvider } from "./context/UploadContext";

function App() {
  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    window.addEventListener("dragover", preventDefault);
    window.addEventListener("drop", preventDefault);
    return () => {
      window.removeEventListener("drop", preventDefault);
      window.removeEventListener("dragover", preventDefault);
    };
  }, []);

  return (
    <UploadContextProvider>
      <div className="App">
        <UploadCard />
      </div>
    </UploadContextProvider>
  );
}

export default App;
