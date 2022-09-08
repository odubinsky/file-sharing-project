import React, { useRef, useContext, useState } from "react";
import axios from "axios";
import { SuccessModal } from "./SuccessModal";

type CurrentFileData = { file: File; expiration: number } | null;
type UploadContextState = {
  upload: (e: any) => void;
  openFileSelection: () => void;
  selectedFile?: CurrentFileData;
  setExpirationTime: (expiration: number) => void;
  setFile: (file: CurrentFileData) => void;
  clearSelection: () => void;
};

const UploadContext = React.createContext({});

export const UploadContextProvider = ({ children }: { children: any }) => {
  const [selectedFile, setFile] = useState<CurrentFileData>(null);
  const [urlReceived, setUrlReceived] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const getFile = (e: any) => {
    const files = (e.target?.files || e.dataTransfer?.files) as
      | FileList
      | undefined;
    const newFile = files && files[0];
    if (newFile) {
      setFile({ file: newFile, expiration: Date.now() + 10000000000 });
    }
  };

  const upload = (e: any) => {
    if (!selectedFile) {
      return;
    }
    const bodyFormData = new FormData();
    bodyFormData.append("file", selectedFile.file);
    const requestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        "Expiration-Time": selectedFile.expiration,
      },
    };
    axios.put("http://localhost/v1/file", bodyFormData, requestConfig).then(response => {
      setUrlReceived(response.data);
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const clearSelection = () => {
    setFile(null);
    setUrlReceived('')
  };

  const openFileSelection = () =>
    inputRef.current?.click && inputRef.current.click();

  const setExpirationTime = (time: number) => {
    if (!selectedFile) {
      return;
    }
    setFile({
      file: selectedFile.file,
      expiration: time,
    });
  };

  const state: UploadContextState = {
    upload,
    openFileSelection,
    selectedFile,
    setFile,
    setExpirationTime,
    clearSelection,
  };

  return (
    <UploadContext.Provider value={state}>
      {children}
      <input
        style={{ display: "none" }}
        onChange={getFile}
        onClick={(e) => {
          (e.target as HTMLInputElement).value = "";
        }}
        type="file"
        ref={inputRef}
      />
      {urlReceived && <SuccessModal url={urlReceived} onClose={() => {
        clearSelection()
      }} />}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  return useContext(UploadContext) as UploadContextState;
};
