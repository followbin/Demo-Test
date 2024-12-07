import React from "react";

export interface GiftExchangeContextProps {
    history: HistoryRecordItem[];
    setHistory: (history: HistoryRecordItem[]) => void;
}

export const GiftExchangeContext = React.createContext({
    history: [] as HistoryRecordItem[],
    setHistory: (history: HistoryRecordItem[]) => {
    },
});

export const  useGiftExchangeContext = () => React.useContext(GiftExchangeContext);