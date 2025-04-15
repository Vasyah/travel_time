"use client";
import React from "react";
import { LayoutExampleBig } from "@/ui/Header/Header";
import { Col, Flex, Layout, Row } from "antd";
import { TravelMenu } from "@/shared/ui/Menu/Menu";
import { SearchFeature } from "@/features/Search/ui/Search";
import { Today } from "@/features/Today/Today";
import moment from "moment/moment";
import { useAuth } from "@/shared/lib/useAuth";
import styles from "./layout.module.css";

export interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
}

moment.locale("ru");

export default function MainLayout({ children }: LayoutProps) {
  useAuth();
  const currentDate = moment().locale("ru").format("dddd, D MMMM YYYY");
  return (
    <Layout>
      <LayoutExampleBig />
      <Row
        style={{ paddingRight: "1rem", backgroundColor: "#fff" }}
        gutter={[16, 16]}
        wrap={false}
      >
        <Col
          xs={{ flex: "auto", order: 1 }}
          sm={{ flex: "auto", order: 1 }}
          xl={{ flex: "80px", order: 0 }}
          // flex={156}
          // order={1}
          style={{
            backgroundColor: "#fff",
            borderRight: "1px solid var(--color-bg-border)",
          }}
        >
          <TravelMenu />
        </Col>
        <Col flex="auto" style={{ padding: "0 1rem" }}>
          <Layout
            className={styles.content}
            style={{ backgroundColor: "#fff" }}
          >
            <Flex gap={"middle"} wrap className={styles.widgetContainer}>
              <div style={{ paddingTop: "1rem" }}>
                <SearchFeature />
              </div>
              <Flex vertical>
                <Today
                  currentDate={currentDate}
                  // open={isCalendarOpen}
                  // onToggle={() =>
                  //   setIsCalendarOpen((prev) => !prev)
                  // }
                />
              </Flex>
            </Flex>
            {children}
          </Layout>
        </Col>
      </Row>
    </Layout>
  );
}
