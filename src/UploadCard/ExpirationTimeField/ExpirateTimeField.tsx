import React, { useContext } from "react";
import "./ExpirationTimeField.css";
import { useUpload } from "../../context/UploadContext";
import { DatePicker, Typography, Alert } from "antd";

const ExpirationTimeField = ({}) => {
  const { setExpirationTime, selectedFile } = useUpload();
  // const [showAlert, setShowAlert] = useState(false);

  const changeExpirationTime = (value: any) => {
    const timeGotten = value.toDate().getTime() as number;
    // if (Date.now() > timeGotten) {
    //   setShowAlert(true);
    //   setTimeout(() => setShowAlert(false), )
    //   return;
    // }
    setExpirationTime(timeGotten);
  };

  return (
    <div
      className={`datePickerContainer ${!!!selectedFile?.file ? "hidden" : ""}`}
    >
      <Typography.Title className="fieldTitle" level={5}>
        Remove On:{" "}
      </Typography.Title>
      <DatePicker
        size="large"
        showTime
        onChange={changeExpirationTime}
        onOk={() => {}}
      />
      {/* {showAlert && (
        <Alert type="error" message="Date is older than current date" />
      )} */}
    </div>
  );
};

export default ExpirationTimeField;
