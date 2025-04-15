"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Login } from "@/features/Auth/ui/Login";
import { Register } from "@/features/Auth/ui/Register";
import { Tabs, TabsProps } from "antd";
import { Card } from "@consta/uikit/Card";
import { FORM_SIZE } from "@/shared/lib/const";
import { setUser } from "@/shared/models/auth";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Вход",
    children: <Login />,
  },
  {
    key: "2",
    label: "Регистрация",
    children: <Register />,
  },
];

export default function LoginPage() {
  const onChange = (key: string) => {
    console.log(key);
  };

  useEffect(() => {
    setUser(null);
  }, []);
  return (
    <Card
      style={{
        padding: "1rem",
        maxWidth: "568px",
        minWidth: "568px",
        position: "relative",
      }}
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        style={{ width: "100%" }}
      />
    </Card>
  );
}
