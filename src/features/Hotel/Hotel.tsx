"use client";
import React from "react";
import styles from "./style.module.css";
import cn from "classnames";
import { HotelDTO, HotelWithRoomsCount } from "@/shared/api/hotel/hotel";
import { Card } from "@consta/uikit/Card";
import { HotelImage } from "@/shared/ui/Hotel/HotelImage";
import hotelImage from "./hotel.svg";
import { HotelRating } from "@/shared/ui/Hotel/HotelRating";
import { HotelTitle } from "@/shared/ui/Hotel/HotelTitle";
import { Flex, Button } from "antd";
import { HotelTelegram } from "@/shared/ui/Hotel/HotelTelegram";
import { Button as ConstaButton } from "@consta/uikit/Button";
import { IconForward } from "@consta/icons/IconForward";
import { IconEdit } from "@consta/icons/IconEdit";
import Link from "next/link";
import { Text } from "@consta/uikit/Text";

export interface HotelProps {
  children?: React.ReactNode;
  className?: string;
  hotel: HotelWithRoomsCount;
  onDelete: (id: string) => void;
  onEdit: (hotel: HotelDTO) => void;
}

export const Hotel = ({ className, hotel, onDelete, onEdit }: HotelProps) => {
  const {
    telegram_url,
    id,
    title,
    rating,
    type,
    phone,
    address,
    description,
    image_id,
  } = hotel;

  const redirectUrl = `/hotels/${hotel?.id}`;
  return (
    <Card className={cn(styles.container, className)} shadow title={title}>
      <Flex gap={"large"}>
        <HotelImage src={hotelImage.src} width={260} height={216} type={type} />
        <div className={styles.infoContainer}>
          <Flex
            vertical
            justify="space-around"
            className={styles.verticalContainer}
          >
            <div>
              <Flex align={"center"} justify={"space-between"}>
                <HotelRating rating={rating} />{" "}
                <Button
                  icon={<IconEdit />}
                  color={"primary"}
                  type={"text"}
                  onClick={() => onEdit(hotel)}
                />
              </Flex>
              <HotelTitle>{title}</HotelTitle>
              <div className={styles.info}>
                <Text size={"m"}>{hotel?.rooms?.[0]?.count ?? 0} номеров</Text>
                <div
                  style={{
                    maxWidth: "200px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <Text size={"m"}>Адрес: {address}</Text>
                </div>
                <Text size={"m"}>Номер: {phone}</Text>
              </div>
            </div>

            <Flex className={styles.actions} align={"center"} gap={"small"}>
              {/*<ConfirmButton onConfirm={() => onDelete(id)} />*/}
              <div className={styles.telegram}>
                {telegram_url && <HotelTelegram url={telegram_url} />}
              </div>
              <div style={{ alignSelf: "end", marginLeft: "auto" }}>
                <Link href={redirectUrl}>
                  <ConstaButton
                    size={"m"}
                    view={"clear"}
                    iconRight={IconForward}
                    label={"Подробнее"}
                  />
                </Link>
              </div>
            </Flex>
          </Flex>
        </div>
      </Flex>
    </Card>
  );
};
