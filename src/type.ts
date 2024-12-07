// 验证兑换码
interface VerifyCodeRequest {
  code: string; // 完整兑换码
}

interface GiftInfo {
  id: string;
  name: string;
  description: string;
  expireTime: string;
  items: GiftItem[];
}

interface GiftItem {
  id: string;
  name: string;
  icon: string;
  amount: number;
}
interface VerifyCodeResponse {
  success: boolean;
  giftInfo?: GiftInfo;
  error?: {
    code: number;
    message: string;
  };
}
// 确认领取礼包
interface RedeemGiftRequest {
  code: string;
  giftId: string;
}
interface RedeemGiftResponse {
  success: boolean;
  resultInfo?: {
    orderNo: string;
    redeemTime: string;
  };
  error?: {
    code: number;
    message: string;
  };
}

interface HistoryRecordItem {
  time: string;
  giftName: string;
  status: string;
}
