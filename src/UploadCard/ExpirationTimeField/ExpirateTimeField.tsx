import React, { useContext } from "react";
import "./ExpirationTimeField.css";
import { useUpload } from "../../context/UploadContext/UploadContext";
import { DatePicker, Typography, Alert } from "antd";
import moment, { Moment } from 'moment'

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

  const disabledDate = (current: Moment) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  };

  return (
    selectedFile?.expiration ? <div
      className={`datePickerContainer ${!!!selectedFile?.file ? "hidden" : ""}`}
    >
      <Typography.Title className="fieldTitle" level={5}>
        Remove On:{" "}
      </Typography.Title>
      <DatePicker
        defaultPickerValue={moment(new Date(selectedFile.expiration))}
        disabledDate={disabledDate}
        value={moment(new Date(selectedFile.expiration))}
        size="large"
        showTime
        onChange={changeExpirationTime} 
        onOk={() => {}}
      />
      {/* {showAlert && (
        <Alert type="error" message="Date is older than current date" />
      )} */}
    </div> : null
  );
};

export default ExpirationTimeField;
