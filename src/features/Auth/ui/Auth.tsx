"use client";
import React from "react";
import styles from "./style.module.css";
import cn from "classnames";

export interface AuthProps {
  children?: React.ReactNode;
  className?: string;
}

export const Auth = ({ className }: AuthProps) => {
  return <div className={cn(styles.container, className)}></div>;
};
