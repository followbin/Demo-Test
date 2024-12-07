import { Button, message, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useGiftExchangeContext } from "../../context/giftExchangeContext";
import gift1 from "../../assets/images/gift1.png";
import styles from "./index.module.css";
import { useDebounceFn } from "ahooks";
import cls from "classnames";

interface GiftInfoProps {
  giftInfo: GiftInfo;
  visible: boolean;
  onClose: () => void;
}

const GiftInfo: React.FC<GiftInfoProps> = ({ giftInfo, visible, onClose }) => {
  const { history, setHistory } = useGiftExchangeContext();
  const [isloading, setIsloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRedeemGift = useDebounceFn(
    () => {
      setIsloading(true);
      // 模拟领取礼包接口返回
      const mockResponse = {
        success: true,
        resultInfo: {
          orderNo: "123456",
          redeemTime: "2024-12-07",
        },
        error: {
          code: 500,
          message: "领取礼包失败",
        },
      };

      if (mockResponse.success) {
        console.log(
          `领取成功，订单号: ${mockResponse.resultInfo.orderNo}, 领取时间: ${mockResponse.resultInfo.redeemTime}`
        );
        // 更新历史记录
        const newHistory = [
          {
            time: new Date().toLocaleString(),
            giftName: giftInfo.name,
            status: "已领取",
          },
          ...history,
        ].slice(0, 5);
        setHistory(newHistory);
        setSuccess(true);
        message.success("领取成功");
        setTimeout(() => {
          setIsloading(false);
          onClose();
        }, 1000);
      } else {
        setIsloading(false);

        message.warning(
          `错误码: ${mockResponse.error.code}, 消息: ${mockResponse.error.message}`
        );
      }
    },
    { wait: 300 }
  );

  return (
    <Modal
      className={styles.container}
      title={"礼包详情"}
      open={visible}
      onCancel={onClose}
      okButtonProps={{ hidden: true }}
      cancelButtonProps={{ hidden: true }}
    >
      <div className="gift-basic-info">
        <p>
          <span className="label">名称：</span>
          <span>{giftInfo.name}</span>
        </p>
        <p>
          <span className="label">说明：</span>
          <span>{giftInfo.description}</span>
        </p>
        <p>
          <span className="label">有效期：</span>
          <span>{giftInfo.expireTime}</span>
        </p>
        <h3>礼包物品列表</h3>
        <div className={styles.giftList}>
          {giftInfo.items.map((item) => (
            <div
              key={item.id}
              className={cls({
                [styles.giftItem]: true,
                [styles.successItem]: success,
              })}
            >
              <img src={gift1} alt={item.name} />
              {item.name}: {item.amount}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.giftAction}>
        <Button
          type="primary"
          onClick={handleRedeemGift.run}
          disabled={isloading}
        >
          领取礼包
        </Button>
      </div>
    </Modal>
  );
};

export default GiftInfo;
