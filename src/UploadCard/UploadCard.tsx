import React from "react";
import UploadField from "./UploadField/UploadField";
import ActionButtons from "./ActionButtons/ActionButtons";
import ExpirationTimeField from "./ExpirationTimeField/ExpirateTimeField";
import "./UploadCard.css";

const UploadCard = ({}) => {
  return (
    <div className="uploadCard">
      <UploadField />
      <ExpirationTimeField />
      <ActionButtons />
    </div>
  );
};

export default UploadCard;
