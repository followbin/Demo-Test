import React, { useState, useEffect } from "react";
import CodeInput from "../../components/CodeInput";
import GiftInfo from "../../components/GiftInfo";
import HistoryList from "../../components/HistoryList";
import styles from "./index.module.css";
import Background from "../assets/background.jpg";
import { GiftExchangeContext } from "../../context/giftExchangeContext";
import { Button } from "antd";

function GiftExchange() {
  const [verificationResult, setVerificationResult] = useState(null);
  const [giftInfo, setGiftInfo] = useState(null);
  const [giftVisible,setGiftVisible] = useState(false)
  const [histotryVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage?.getItem("gift_exchange_history") || "{}") || [];
    setHistory(storedHistory);
  }, []);

  const handleHistory = (history) => {
    localStorage.setItem("gift_exchange_history", JSON.stringify(history));
    setHistory(history);
  };

  return (
    <GiftExchangeContext.Provider
      value={{ history, setHistory: handleHistory }}
    >
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>游戏礼包兑换系统</h1>
          <CodeInput />
          {giftInfo && <GiftInfo visible={ giftVisible} onClose={() => setGiftInfo(null)} giftInfo={giftInfo} />}
          <HistoryList  visible={histotryVisible} onClose={() => setHistoryVisible(false)}/>
         <Button onClick={() => setHistoryVisible(true)}>我的礼包</Button>
        </main>
      </div>
    </GiftExchangeContext.Provider>
  );
}

export default GiftExchange;
