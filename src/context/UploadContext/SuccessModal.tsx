import React, {useState} from 'react'
import { Result, Button,Alert,  Input, Modal } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import './SuccessModal.css'


export const SuccessModal = ({url, onClose}: {url?: string, onClose: () => void}) => {
  const [showAlert, setShowAlert] = useState(false)
  return <Modal footer={null} open={!!url} onCancel={onClose} >
  <Result
    status="success"
    title="Successfully Uploaded"
    subTitle="You can download the file anytime from the following link"
    extra={<div className="linkDisplay">
        <Button icon={<CopyOutlined />} type="primary" onClick={() => {
        url && navigator.clipboard.writeText(url);
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
      }}>
      </Button>
      <Input value={url} />
    </div>
      }/>
    {showAlert && <Alert message="Copied To Clipboard!" type="success" />}
  </Modal>
}