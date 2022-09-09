import React, { useRef, useContext, useState } from "react";
import api from '../../api/uploadApi'
import { useModal } from "../ModalContext/ModalContext";
import {ModalTypes} from '../ModalContext/modals/consts'
type CurrentFileData = { file: File; expiration: number } | null;
type UploadContextState = {
  upload: (e: any) => void;
  openFileSelection: () => void;
  selectedFile?: CurrentFileData;
  setExpirationTime: (expiration: number) => void;
  setFile: (file: CurrentFileData) => void;
  clearSelection: () => void;
  getFile: (e: Event) => void;
};

const UploadContext = React.createContext({});

export const UploadContextProvider = ({ children }: { children: any }) => {
  const [selectedFile, setFile] = useState<CurrentFileData>(null);
  const [urlReceived, setUrlReceived] = useState('');
  const { showModal } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);

  const getFile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const files = (e.target?.files || e.dataTransfer?.files) as
      | FileList
      | undefined;
    const newFile = files && files[0];
    if (newFile) {
      setFile({ file: newFile, expiration: Date.now() + 10000000000 });
    }
  };

  const upload = async (e: any) => {
    if (!selectedFile) {
      return;
    }
    try {
      const res = await api.uploadFile(selectedFile)
      setUrlReceived(res);
      showModal({type: ModalTypes.success, props: {url: res, onClose: () => clearSelection()}})
    } catch(e) {
      showModal({type: ModalTypes.error, props: {}})
      console.error(e)
    }    
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
    getFile
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
      
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  return useContext(UploadContext) as UploadContextState;
};
