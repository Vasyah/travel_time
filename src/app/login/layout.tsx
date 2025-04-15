"use client";
import React from "react";
import { Col, Flex, Layout, Row } from "antd";
import moment from "moment/moment";
import { ToastContainer } from "react-toastify";

export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
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
