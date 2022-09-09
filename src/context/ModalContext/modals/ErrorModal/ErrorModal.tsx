import React, {useState} from 'react'
import { Result, Button,Alert,  Input, Modal } from 'antd'
import { CopyOutlined } from '@ant-design/icons'
import './ErrorModal.css'


export const ErrorModal = ({onCancel}: { onCancel: () => void}) => {
  return <Modal className="modalContainer" footer={null} open={true} onCancel={onCancel} >
  <Result
    status="error"
    title="Failed To Upload"
    subTitle="Please try again in a few minutes"
    />
  </Modal>
}