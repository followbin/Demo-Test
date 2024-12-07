import { Button, message, Modal } from 'antd';
import React from'react';
import { useGiftExchangeContext } from '../../context/giftExchangeContext';

interface GiftInfoProps {
    giftInfo: {
        name: string;
        description: string;
        expireTime: string;
        items: {
            id: number;
            name: string;
            icon: string;
            amount: number;
        }[];
    };
    visible: boolean;
    onClose: () => void;

}

const GiftInfo:React.FC<GiftInfoProps> = ({ giftInfo, visible,onClose }) => {
 const { history, setHistory } = useGiftExchangeContext();
    
const handleRedeemGift = async () => {
    // 模拟领取礼包接口返回
    const mockResponse = {
        success: true,
        resultInfo: {
            orderNo: "123456",
            redeemTime: "2024-12-07"
        },
        error: {
            code: 500,
            message: "领取礼包失败"
        }
    };

    if (mockResponse.success) {
        console.log(`领取成功，订单号: ${mockResponse.resultInfo.orderNo}, 领取时间: ${mockResponse.resultInfo.redeemTime}`);
        // 更新历史记录
        const newHistory = [
            {
                time: new Date().toLocaleString(),
                giftName: giftInfo.name,
                status: "领取成功"
            },
           ...history
        ].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('gift_exchange_history', JSON.stringify(newHistory));
    } else {
        message.warning(`错误码: ${mockResponse.error.code}, 消息: ${mockResponse.error.message}`);
    }
};


    return (
        <Modal className="gift-info-container" title={'礼包详情'} open={visible} onCancel={onClose}>
            <div className="gift-basic-info">
                <p><span className="label">名称：</span><span>{giftInfo.name}</span></p>
                <p><span className="label">说明：</span><span>{giftInfo.description}</span></p>
                <p><span className="label">有效期：</span><span>{giftInfo.expireTime}</span></p>
            </div>
            <h3>礼包物品列表</h3>
            <ul>
                {giftInfo.items.map(item => (
                    <li key={item.id}>
                        <img src={item.icon} alt={item.name} />
                        {item.name}: {item.amount}
                    </li>
                ))}
            </ul>
            <Button type='primary' onClick={handleRedeemGift}>领取礼包</Button>
        </Modal>
    );
};

export default GiftInfo;