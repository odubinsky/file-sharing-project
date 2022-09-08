import React, { useContext } from "react";
import "./UploadField.css";
import { useUpload } from "../../context/UploadContext/UploadContext";
import { Typography } from "antd";

const UploadField = ({}) => {
  const { getFile, openFileSelection, selectedFile } = useUpload();

  return selectedFile ? (
    <div className="uploadField">{selectedFile.file.name}</div>
  ) : (
    <div onClick={openFileSelection} onDrop={getFile} className="uploadField">
      <Typography.Title
        className="emptyStateText"
        level={3}
      >{`Upload Your File`}</Typography.Title>
    </div>
  );
};

export default UploadField;
