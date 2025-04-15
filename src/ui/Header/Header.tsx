"use client";

import React, { useEffect, useRef, useState } from "react";
import { cnMixSpace } from "@consta/uikit/MixSpace";
import { User } from "@consta/uikit/User";
import logo from "../../../public/main/logo.svg";
import Image from "next/image";
import cx from "./styles.module.css";
import { Layout } from "@consta/header/Layout";
import { useSignOut, useUser } from "@/shared/api/auth/auth";
import { useUnit } from "effector-react/compat";
import { $user, setUser } from "@/shared/models/auth";
import { Menu } from "@consta/header/Menu";
import { Button, Dropdown, MenuProps, Popover } from "antd";
import { ContextMenu } from "@consta/uikit/ContextMenu";
import { LogoutOutlined, SettingOutlined } from "@ant-design/icons";
import supabase from "@/shared/config/supabase";
import { useAuth } from "@/shared/lib/useAuth";
import { redirect } from "next/navigation";

const RowCenterRight = () => {
  const user = useUnit($user);
  const { mutateAsync, isPending } = useSignOut();
  const items: MenuProps["items"] = [
    // {
    //   key: "1",
    //   label: "Профиль",
    //   extra: "⌘B",
    // },
    {
      key: "2",
      label: "Выйти",
      icon: <LogoutOutlined />,
      onClick: async () => {
        console.log("asdasd");
        await mutateAsync();
        // await setUser(null);
        redirect("/login");
      },
    },
  ];

  return (
    <div>
      {/*<Notifications items={notifications}/>*/}
      {/*<TileMenu items={tiles}/>*/}
      <Dropdown menu={{ items }} trigger={["click"]}>
        <User
          onClick={() => {
            console.log();
          }}
          className={cnMixSpace({ mL: "xs" })}
          avatarUrl="https://avatars.githubusercontent.com/u/13190808?v=4"
          name={user?.name}
          info={user?.surname}
          withArrow={true}
        />
      </Dropdown>
    </div>
  );
};
export const LayoutExampleBig = () => {
  // const { data } = useUser();

  return (
    <Layout
      className={cx.header}
      rowTop={{
        left: <Image src={logo.src} alt={"Лого"} width={130} height={65} />,
        right: <RowCenterRight />,
      }}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    />
  );
};
