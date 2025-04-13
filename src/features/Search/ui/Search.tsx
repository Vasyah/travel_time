import React, { FC, useState } from "react";
import { Button } from "@consta/uikit/Button";
import { DatePicker } from "@consta/uikit/DatePicker";
import { IconCalendar } from "@consta/icons/IconCalendar";
import { FieldGroup } from "@consta/uikit/FieldGroup";
import { HOTEL_TYPES } from "@/features/HotelModal/lib/const";
import moment from "moment/moment";
import { changeTravelFilter, TravelFilterType } from "@/shared/models/hotels";
import { TextField } from "@consta/uikit/TextField";
import { useRouter } from "next/navigation";
import { getHotelsWithFreeRooms } from "@/shared/api/hotel/hotel";
import { Select } from "antd";
import styles from "./style.module.css";

export interface SearchFeatureProps {}

export const SearchFeature: FC<SearchFeatureProps> = (
  props: SearchFeatureProps,
) => {
  const [date, setValue] = useState<[Date?, Date?] | null>(null);
  const [category, setCategory] = useState<string | undefined>();
  const [quantity, setQuantity] = useState<number>();
  const router = useRouter();

  const onSearch = async () => {
    let start_time, end_time;
    if (date?.[0]) {
      start_time = moment(date[0]).hour(12).unix();
    }

    if (date?.[1]) {
      end_time = moment(date[1]).hour(11).unix();
    }

    let freeRoomData: Partial<TravelFilterType> = {
      hotels_id: undefined,
      rooms_id: undefined,
    };
    if (!!start_time && !!end_time) {
      // effector
      // TODO: сюда должна заехать вместимость
      const result = await getHotelsWithFreeRooms(start_time, end_time);

      freeRoomData = {
        hotels_id: result?.map((hotel) => hotel.hotel_id),
        rooms_id: new Map(
          result?.map((hotel) => [
            hotel.hotel_id,
            hotel.rooms.map((room) => room.room_id),
          ]),
        ),
      };
    }

    const filter: Partial<TravelFilterType> = {
      type: category ?? undefined,
      start: start_time,
      end: end_time,
      quantity: quantity ?? undefined,
      ...freeRoomData,
    };

    changeTravelFilter(filter);

    router.push("/reservation");
  };

  return (
    <FieldGroup form="default" size="m">
      <Select
        className={styles.type}
        style={{
          height: "40px",
          minWidth: 200,
          maxWidth: "200px",
        }}
        options={HOTEL_TYPES}
        value={category}
        onChange={(type) => {
          console.log(type);
          setCategory(type);
        }}
        placeholder={"Категория"}
        allowClear
      />
      <DatePicker
        style={{
          zIndex: 90,
          maxWidth: "378px",
          minWidth: "320px",
        }}
        type="date-range"
        value={date}
        onChange={(e) => setValue(e)}
        leftSide={[IconCalendar, IconCalendar]}
        placeholder={["Заезд", "Выезд"]}
        dateTimeView={"classic"}
        withClearButton
      />
      <TextField
        value={String(quantity)}
        onChange={(value) => setQuantity(value ? +value : undefined)}
        placeholder={"Гости"}
        type={"number"}
        withClearButton
        style={{ maxWidth: "100px" }}
        incrementButtons={false}
      />
      <Button label={"Найти"} onClick={onSearch} />
    </FieldGroup>
  );
};
