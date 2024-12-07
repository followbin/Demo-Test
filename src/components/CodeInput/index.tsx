import { Button, Input, message } from "antd";
import React, { useState, useRef, version } from "react";
import styles from "./index.module.css";
import GiftInfo from "../GiftInfo";
import { useGiftExchangeContext } from "../../context/giftExchangeContext";
import { useDebounceFn } from "ahooks";
import cls from "classnames";
import { Html5QrcodeScanner } from "html5-qrcode";

const CodeInput: React.FC = () => {
  const { history, setHistory } = useGiftExchangeContext();
  const [codeParts, setCodeParts] = useState(["", "", "", ""]);
  const inputsRef = useRef<any>([]);
  const [giftInfoVisible, setGiftInfoVisible] = useState(false);
  const [giftInfo, setGiftInfo] = useState<GiftInfo>();
  const [error, setError] = useState("");
  const [errorIndex, setErrorIndex] = useState(-1);

  // 辅助函数：检查输入是否为有效的4位数字
  const isValidFourDigits = (input: string) => /^\d{4}$/.test(input);

  const handleInputChange = (index: number, value: string) => {
    const newInput = value.replace(/\D/g, "");
    if (newInput.length < value.length) {
      setError("输入格式不正确，请输入4位数字");
      setErrorIndex(index);
    } else {
      setError("");
      setErrorIndex(-1);
    }
    const newCodeParts = [...codeParts];
    newCodeParts[index] = value.slice(0, 4); // 限制只取前4位，防止输入过多字符
    setCodeParts(newCodeParts);
    if (value.length === 4 && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
    //自动兑换
    if (index === 3) {
      handleVerifyCode.run(newCodeParts.join(""));
    }
  };

  const handlePaste = (e: any) => {
    const pastedText =
      e?.clipboardData?.getData("text").replace(/\s/g, "") || ""; // 去除空格
    if (pastedText.length === 16 && /^\d{16}$/.test(pastedText)) {
      // 如果粘贴的内容是16位纯数字，按4位一组拆分并填充到输入框
      const newCodeParts: string[] = [];
      for (let i = 0; i < 16; i += 4) {
        newCodeParts.push(pastedText.substr(i, 4));
      }
      setCodeParts(newCodeParts);
      inputsRef.current.forEach(
        (input: any, index: number) => (input.value = newCodeParts[index])
      );
      handleVerifyCode.run(newCodeParts.join(""));
    } else {
      setError("粘贴的兑换码格式不正确，请确保是16位数字");
    }
  };

  const handleVerifyCode = useDebounceFn(
    (code: string) => {
      // 这里需要实际调用后端接口，暂时模拟返回数据
      const mockResponse: VerifyCodeResponse = {
        success: true,
        giftInfo: {
          id: "123",
          name: "新手礼包",
          description: "包含一些基础道具，助力新手玩家",
          expireTime: "2025-12-31",
          items: [
            {
              id: "item1",
              name: "金币",
              icon: "coin.png",
              amount: 100,
            },
            {
              id: "item2",
              name: "宝石",
              icon: "gem.png",
              amount: 10,
            },
            {
              id: "item1",
              name: "金币",
              icon: "coin.png",
              amount: 100,
            },
            {
              id: "item2",
              name: "宝石",
              icon: "gem.png",
              amount: 10,
            },
            {
              id: "item1",
              name: "金币",
              icon: "coin.png",
              amount: 100,
            },
            {
              id: "item2",
              name: "宝石",
              icon: "gem.png",
              amount: 10,
            },
            {
              id: "item1",
              name: "金币",
              icon: "coin.png",
              amount: 100,
            },
            {
              id: "item2",
              name: "宝石",
              icon: "gem.png",
              amount: 10,
            },
          ],
        },
        error: {
          code: 400,
          message: "兑换码格式错误",
        },
      };

      if (mockResponse.success) {
        setGiftInfo(mockResponse.giftInfo);
        message.success("兑换成功");
        // 保存历史记录
        const newHistory: HistoryRecordItem[] = [
          {
            time: new Date().toLocaleString(),
            giftName: mockResponse.giftInfo?.name || "",
            status: "验证成功",
          },
          ...history,
        ];
        setHistory(newHistory?.slice(0, 5));
        setGiftInfoVisible(true);
      } else {
        message.warning(
          `错误码: ${mockResponse?.error?.code}, 消息: ${mockResponse?.error?.message}`
        );
      }
    },
    { wait: 300 }
  );

  // Luhn算法校验函数 demo:正确: 1034567890123454 / 错误:1234567890123454
  const luhnCheck = (code: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = code.length - 1; i >= 0; i--) {
      let digit = parseInt(code.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    console.log(sum, code);
    return sum % 10 === 0;
  };
  const handleVerifyClick = () => {
    const code = codeParts.join("");
    if (
      code.length === 16 &&
      isValidFourDigits(codeParts[0]) &&
      isValidFourDigits(codeParts[1]) &&
      isValidFourDigits(codeParts[2]) &&
      isValidFourDigits(codeParts[3])
    ) {
      if (luhnCheck(code)) {
        handleVerifyCode.run(code);
      } else {
        message.error("兑换码无效，请检查输入是否正确");
      }
    } else {
      message.error("请输入正确格式的兑换码");
    }
  };

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10, // 设置扫描帧率
        qrbox: { width: 250, height: 250 }, // 设置扫描区域大小
      },
      false
    );
    scanner.render(
      (success) => {
        if (success) {
          const scannedText = success;
          const parts = scannedText.match(/.{1,4}/g);
          if (parts && parts.length === 4) {
            const newCodeParts = parts.map((part) => part.padEnd(4, "0"));
            setCodeParts(newCodeParts);
            inputsRef.current.forEach(
              (input, index) => (input.value = newCodeParts[index])
            );
            scanner.clear(); // 扫描成功后关闭扫描器
          } else {
            message.error(
              "扫描到的兑换码格式不正确，请确保是16位且可按4位一组划分"
            );
            scanner.clear();
          }
        }
      },
      (error) => {
        // message.error("扫描失败，请重试");
      }
    );
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.label}>请输入兑换码</div>
        <div className={styles.codeInputContainer}>
          {codeParts.map((part, index) => (
            <Input
              key={index}
              type="text"
              maxLength={4}
              value={part}
              className={cls({ [styles.shake]: errorIndex === index && error })}
              style={{ width: "60px", marginRight: "10px" }}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onPaste={handlePaste}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && part === "") {
                  inputsRef.current[Math.max(0, index - 1)].focus();
                }
              }}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>
        <Button type="primary" onClick={handleVerifyClick}>
          验证兑换码
        </Button>
        <Button style={{marginLeft:10}} onClick={startScanner}>扫码输入</Button>

        {giftInfo && (
          <GiftInfo
            visible={giftInfoVisible}
            onClose={() => setGiftInfoVisible(false)}
            giftInfo={giftInfo}
          />
        )}
      </div>
      <div className={styles.error}>{error}</div>

      <div id="reader"></div>
    </>
  );
};

export default CodeInput;
