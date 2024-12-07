import { RouterProvider } from "react-router-dom";
import React, { useState } from "react";
import { App as AntdApp, ConfigProvider } from "antd";
import GiftExchange from "./pages/GiftExchange/GiftExchange";

function App() {
  return (
    <AntdApp>
      <GiftExchange></GiftExchange>
    </AntdApp>
  );
}

export default App;
