import React, { FC, useCallback } from "react";
import cx from "./style.module.css";
import { TextField } from "@consta/uikit/TextField";
import { Select } from "@consta/uikit/Select";
import { Controller, useForm } from "react-hook-form";
import { Hotel, HotelDTO } from "@/shared/api/hotel/hotel";
import { Grid, GridItem } from "@consta/uikit/Grid";
import { FORM_SIZE } from "@/shared/lib/const";
import { HOTEL_TYPES } from "@/features/HotelModal/lib/const";
import { FormTitle } from "@/shared/ui/FormTitle/FormTitle";
import {
  CurrentReserveType,
  Nullable,
  TravelOption,
} from "@/shared/api/reserve/reserve";
import { LinkIcon } from "@/shared/ui/LinkIcon/LinkIcon";
import { FaTelegram } from "react-icons/fa";
import { FormButtons } from "@/shared/ui/FormButtons/FormButtons";
import { adaptToOption } from "@/shared/lib/adaptHotel";
import { DragNDropField } from "@consta/uikit/DragNDropField";
import { Button } from "@consta/uikit/Button";
import { Text } from "@consta/uikit/Text";
import { nanoid } from "nanoid";

export interface HotelInfoProps {
  onClose: () => void;
  onAccept: (hotel: Hotel | HotelDTO) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  currentReserve: Nullable<CurrentReserveType>;
  isLoading?: boolean;
  isEdit: boolean;
}

export type HotelForm = Omit<Hotel, "type" | "rating"> & {
  rating: string;
  type?: TravelOption;
};

const DEFAULT_VALUE = { rating: "5", telegram_url: "https://t.me/" };

const getInitialValue = (hotel?: Nullable<HotelDTO>): Partial<HotelForm> => {
  const rating = String(hotel?.rating) ?? DEFAULT_VALUE.rating;
  return {
    ...DEFAULT_VALUE,
    ...hotel,
    rating,
    type: hotel?.type
      ? adaptToOption({ title: hotel?.type, id: hotel?.type })
      : undefined,
  };
};
export const HotelInfo: FC<HotelInfoProps> = ({
  onAccept,
  onDelete,
  onClose,
  currentReserve,
  isLoading = false,
  isEdit = false,
}: HotelInfoProps) => {
  const {
    control,
    getValues,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HotelForm>({
    defaultValues: getInitialValue(currentReserve?.hotel),
  });

  const formData = watch();

  const deserializeData = (data: HotelForm): Hotel | undefined => {
    if (!data?.type) {
      console.error("Не выбран отель");
      return;
    }

    return { ...data, type: data?.type?.label, rating: +data?.rating };
  };
  const onAcceptForm = useCallback(async () => {
    const serializedData = deserializeData(formData);

    if (!serializedData) {
      console.error("Не выбран отель");
      return;
    }

    console.log(serializedData);
    await onAccept(serializedData);
  }, [formData]);

  return (
    <>
      {/*{isLoading && <FullWidthLoader />}*/}
      <FormTitle>
        {isEdit ? "Редактирование отеля" : "Добавление отеля"}
      </FormTitle>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            placeholder="Введите название"
            label="Название отеля"
            required
            size={FORM_SIZE}
            disabled={isLoading}
            className={cx.fields}
          />
        )}
      />

      <Grid cols={6} gap={FORM_SIZE}>
        <GridItem col={4}>
          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                items={HOTEL_TYPES}
                placeholder={"Выберите из списка"}
                label={"Тип"}
                required
                size={FORM_SIZE}
                dropdownClassName={cx.dropdown}
                disabled={isLoading}
                className={cx.fields}
              />
            )}
          />
        </GridItem>
        <GridItem col={2}>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Введите число"
                label="Кол-во звёзд"
                type="number"
                required
                min={1}
                max={5}
                size={FORM_SIZE}
                disabled={isLoading}
                className={cx.fields}
              />
            )}
          />
        </GridItem>
      </Grid>
      <Controller
        name="address"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            placeholder="Введите адрес"
            label="Местоположение"
            required
            size={FORM_SIZE}
            disabled={isLoading}
            className={cx.fields}
          />
        )}
      />

      <Controller
        name="telegram_url"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            placeholder="Вставьте ссылку"
            label="Ссылка на отель в Telegram"
            size={FORM_SIZE}
            disabled={isLoading}
            className={cx.fields}
            rightSide={() =>
              formData?.telegram_url ? (
                <LinkIcon
                  icon={<FaTelegram color="2AABEE" size={"24px"} />}
                  link={formData?.telegram_url}
                />
              ) : null
            }
          />
        )}
      />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-expect-error*/}
      <TextField
        {...register("phone")}
        placeholder="+7 (...)"
        label="Номер владельца"
        required
        type={"phone"}
        size={FORM_SIZE}
        disabled={isLoading}
        className={cx.fields}
      />
      <DragNDropField
        accept={"image/*"}
        onDropFiles={(files) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          setValue("image_id", { id: nanoid(), file: files[0] });
        }}
        multiple={false}
      >
        {({ openFileDialog }) => (
          <>
            <Button onClick={openFileDialog} label="Выбрать файл" />
            <br />
            <Text view="primary">Перетащите изображения или загрузите</Text>
            <Text view="secondary">Поддерживаемые форматы: PNG, TIFF, JPG</Text>
          </>
        )}
      </DragNDropField>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-expect-error*/}
      <TextField
        {...register("description")}
        label="Комментарии"
        type="textarea"
        cols={200}
        rows={3}
        placeholder="Введите комментарий"
        size={FORM_SIZE}
        disabled={isLoading}
        className={cx.fields}
      />
      <FormButtons
        onDelete={() =>
          currentReserve?.hotel && onDelete(currentReserve?.hotel.id)
        }
        deleteText={"Удалить отель"}
        isEdit={isEdit}
        isLoading={isLoading}
        onAccept={() => onAcceptForm()}
        onClose={onClose}
      />
    </>
  );
};
