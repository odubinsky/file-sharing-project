import React, { useContext } from "react";
import "./ActionButtons.css";
import { useUpload } from "../../context/UploadContext";
import { Button } from "antd";

const ActionButtons = ({}) => {
  const { upload, selectedFile, clearSelection } = useUpload();

  return (
    <div className="buttonsContainer">
      <Button
        size={"large"}
        disabled={!!!selectedFile?.file}
        onClick={clearSelection}
      >
        Clear
      </Button>
      <Button
        type="primary"
        disabled={!!!selectedFile?.file}
        size={"large"}
        className={"submitButton"}
        onClick={upload}
      >
        Submit
      </Button>
    </div>
  );
};

export default ActionButtons;
