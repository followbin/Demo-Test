import { Button, FloatButton, Modal } from 'antd';
import React, { useState } from'react';
import { useGiftExchangeContext } from '../../context/giftExchangeContext';
interface HistoryRecord {
    time: string;
    giftName: string;
    status: string;
}

interface GiftExchangeHistoryProps {
    visible: boolean;
    onClose: () => void;
}



const HistoryList:React.FC<GiftExchangeHistoryProps> = ({ visible,onClose }) => { 
 const {history,setHistory} = useGiftExchangeContext()
  
 

  const onClear = () => {
    setHistory([])
  }
  
    return (
        <Modal title="兑换记录" open = {visible} onCancel={onClose}  okButtonProps={{hidden:true}} cancelButtonProps={{hidden:true}}>
            <Button type="primary" onClick={onClear}>清除历史记录</Button>
            <ul>
                {history.map?.((record, index) => (
                    <li key={index}>
                        {record.time} - {record.giftName}: {record.status}
                    </li>
                ))}

            </ul>
        </Modal>
    );
};

export default HistoryList;