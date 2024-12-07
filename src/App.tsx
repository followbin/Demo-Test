import { RouterProvider } from "react-router-dom";
import React, { useState } from "react";
import { App as AntdApp, ConfigProvider, FloatButton } from "antd";
import GiftExchange from "./pages/GiftExchange/GiftExchange";
import cls from "classnames";
import { MoonFilled, SunOutlined } from "@ant-design/icons";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: isDarkMode ? "black" : "#cb8aea",
          colorBgBase: isDarkMode ? "black" : "white",
          colorText: isDarkMode ? "white" : "black",
          colorIcon: isDarkMode ? "white" : "black",
        },
      }}
    >
      <AntdApp className={isDarkMode ? "dark-theme" : ""}>
        <GiftExchange></GiftExchange>
        <FloatButton
          icon={
            isDarkMode ? <SunOutlined></SunOutlined> : <MoonFilled></MoonFilled>
          }
          onClick={toggleDarkMode}
        ></FloatButton>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
