"use client";
import React from "react";
import { Flex, Layout, Row } from "antd";
import { ToastContainer } from "react-toastify";

export interface LayoutProps {
  children?: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Flex style={{ minHeight: "100vh" }} align={"center"} justify={"center"}>
        <ToastContainer />
        {children}
      </Flex>
    </Layout>
  );
}
