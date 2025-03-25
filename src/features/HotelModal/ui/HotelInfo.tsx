import React, { FC, useCallback } from 'react'
import cx from './style.module.css'
import { TextField } from '@consta/uikit/TextField'
import { Select } from '@consta/uikit/Select'
import { Controller, useForm } from 'react-hook-form'
import { Hotel } from '@/shared/api/hotel/hotel'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { FORM_SIZE } from '@/shared/lib/const'
import { HOTEL_TYPES } from '@/features/HotelModal/lib/const'
import { FormTitle } from '@/shared/ui/FormTitle/FormTitle'
import { CurrentReserveType, Nullable } from '@/shared/api/reserve/reserve'
import { LinkIcon } from '@/shared/ui/LinkIcon/LinkIcon'
import { FaTelegram } from 'react-icons/fa'
import { FormButtons } from '@/shared/ui/FormButtons/FormButtons'

export interface HotelInfoProps {
  onClose: () => void
  onAccept: (args?: any) => void
  currentReserve: Nullable<CurrentReserveType>
  isLoading?: boolean
  isEdit: boolean
}

export type HotelForm = Hotel & { type: { label: string; id: string } }

export const HotelInfo: FC<HotelInfoProps> = ({
  onAccept,
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
    formState: { errors },
  } = useForm<HotelForm>({
    defaultValues: { rating: 5, telegram_url: 'https://t.me/' },
  })

  const formData = watch()
  // количество ночей - считаем по выбранной дате
  // предоплата - сумма указанная вручную
  // итоговая сумма - сумма * количество ночей - предоплата

  const deserializeData = (data: HotelForm): Hotel => {
    return { ...data, type: data.type.label }
  }
  const onAcceptForm = useCallback(() => {
    const serializedData = deserializeData(formData)

    onAccept(serializedData)
  }, [formData])

  return (
    <>
      <FormTitle>Добавление отеля</FormTitle>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-expect-error*/}
      <TextField
        {...register('title')}
        placeholder="Введите название"
        label="Название отеля"
        required
        size={FORM_SIZE}
        disabled={isLoading}
        className={cx.fields}
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
                placeholder={'Выберите из списка'}
                label={'Тип'}
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
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/*// @ts-expect-error*/}
          <TextField
            {...register('rating')}
            placeholder="Введите число"
            label="Кол-во звёзд"
            type="number"
            required
            size={FORM_SIZE}
            disabled={isLoading}
            className={cx.fields}
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
                  icon={<FaTelegram color="2AABEE" size={'24px'} />}
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
        {...register('phone')}
        placeholder="+7 (...)"
        label="Номер владельца"
        required
        type={'phone'}
        size={FORM_SIZE}
        disabled={isLoading}
        className={cx.fields}
      />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*// @ts-expect-error*/}
      <TextField
        {...register('description')}
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
        onDelete={() => console.log('Удаляю там всякое')}
        deleteText={'Удалить отель'}
        isEdit={isEdit}
        isLoading={isLoading}
        onAccept={() => handleSubmit(onAcceptForm)}
        onClose={onClose}
      />
    </>
  )
}
