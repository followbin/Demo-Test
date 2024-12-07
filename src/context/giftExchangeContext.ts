import React from "react";
import {Locale} from "antd/es/locale";
interface HistoryRecordItem {
    id: string;
name: string;
icon: string;
amount: number;
}
export interface GiftExchangeContextProps {
    history: HistoryRecordItem[];
    setHistory: (history: HistoryRecordItem[]) => void;
}

export const GiftExchangeContext = React.createContext({
    history: [],
    setHistory: (history: HistoryRecordItem[]) => {
    },
});

export const  useGiftExchangeContext = () => React.useContext(GiftExchangeContext);