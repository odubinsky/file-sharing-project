import "./App.css";
import React from "react";
import UploadCard from "./UploadCard/UploadCard";
import { useEffect } from "react";

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
    <div className="App">
        <UploadCard />
    </div>
  );
}

export default App;
