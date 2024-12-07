import { Button, Input } from 'antd';
import React, { useState, useRef } from'react';
import styles from './index.module.css';

const CodeInput:React.FC = () => {
    const [codeParts, setCodeParts] = useState(['', '', '', '']);
    const inputsRef = useRef([]);
    const [giftInfoVisible, setGiftInfoVisible] = useState(false);
    const [HistoryListVisible,setHistoryListVisible] =useState(false);
// 辅助函数：检查输入是否为有效的4位数字
const isValidFourDigits = (input) => /^\d{4}$/.test(input);

const handleInputChange = (index, value) => {
    const newCodeParts = [...codeParts];
    newCodeParts[index] = value.slice(0, 4); // 限制只取前4位，防止输入过多字符
    setCodeParts(newCodeParts);
    if (value.length === 4 && index < 3) {
        inputsRef.current[index + 1].focus();
    }
};

const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text').replace(/\s/g, ''); // 去除空格
    if (pastedText.length === 16 && /^\d{16}$/.test(pastedText)) {
        // 如果粘贴的内容是16位纯数字，按4位一组拆分并填充到输入框
        const newCodeParts:string[] = [];
        for (let i = 0; i < 16; i += 4) {
            newCodeParts.push(pastedText.substr(i, 4));
        }
        setCodeParts(newCodeParts);
        inputsRef.current.forEach((input, index) => input.value = newCodeParts[index]);
    } else {
        // 如果粘贴内容不符合要求，给出提示或者进行合适的处理，这里简单打印错误信息示例
        console.error('粘贴的兑换码格式不正确，请确保是16位数字');
    }
};


const handleVerifyCode = async (code) => {
    // 这里需要实际调用后端接口，暂时模拟返回数据
    const mockResponse = {
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
                    amount: 100
                },
                {
                    id: "item2",
                    name: "宝石",
                    icon: "gem.png",
                    amount: 10
                }
            ]
        },
        error: {
            code: 400,
            message: "兑换码格式错误"
        }
    };

    if (mockResponse.success) {
        setGiftInfo(mockResponse.giftInfo);
        setVerificationResult('验证成功');
        // 保存历史记录
        const newHistory = [
            {
                time: new Date().toLocaleString(),
                giftName: mockResponse.giftInfo.name,
                status: "验证成功"
            },
           ...history
        ].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('gift_exchange_history', JSON.stringify(newHistory));
    } else {
        setVerificationResult(`错误码: ${mockResponse.error.code}, 消息: ${mockResponse.error.message}`);
    }
};
const handleVerifyClick = () => {
    const code = codeParts.join('');
    if (code.length === 16 && isValidFourDigits(codeParts[0]) && isValidFourDigits(codeParts[1]) && isValidFourDigits(codeParts[2]) && isValidFourDigits(codeParts[3])) {
        handleVerifyCode(code)
    } else {
        console.error('请输入正确格式的兑换码');
    }
};
    return (
        <div className={styles.container}>
            <div className={styles.label}>请输入兑换码</div>
            <div className={styles.codeInputContainer}>
                {codeParts.map((part, index) => (
                    <Input
                        key={index}
                        type="text"
                        maxLength={4}
                        value={part}
                        style={{width: '100px', marginRight: '10px'}}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => {
                            if (e.key === 'Backspace' && part === '') {
                                inputsRef.current[Math.max(0, index - 1)].focus();
                            }
                        }}
                        ref={(el) => inputsRef.current[index] = el}
                    />
                    
                ))}
            </div>
            <Button type='primary' onClick={handleVerifyClick}>验证兑换码</Button>
        </div>
    );
};

export default CodeInput;