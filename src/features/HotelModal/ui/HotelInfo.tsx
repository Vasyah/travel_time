import React, {FC, useCallback} from 'react'
import {Text} from "@consta/uikit/Text";
import cx from './style.module.css'
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import {Controller, useForm} from "react-hook-form";
import {Hotel} from "@/shared/api/hotel/hotel";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TravelButton} from "@/shared/ui/Button/Button";
import {FORM_SIZE} from "@/shared/lib/const";
import {HOTEL_TYPES} from "@/features/HotelModal/lib/const";
import {FormTitle} from "@/shared/ui/FormTitle/FormTitle";
import {Modal} from "@/shared/ui/Modal/Modal";
import {CurrentReserveType} from "@/shared/api/reserve/reserve";
import {LinkIcon} from "@/shared/ui/LinkIcon/LinkIcon";
import {createTelegramLink} from "@/shared/lib/links";
import {FaTelegram} from "react-icons/fa";

export interface HotelInfoProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve?: CurrentReserveType
    isLoading?: boolean;
}

export type HotelForm = Hotel & { type: { label: string, id: string } };

export const HotelInfo: FC<HotelInfoProps> = ({
                                                  isOpen = false,
                                                  onAccept,
                                                  onClose,
                                                  currentReserve,
                                                  isLoading = false,
                                              }:
                                              HotelInfoProps
    ) => {

        const {
            control,
            getValues,
            register,
            handleSubmit,
            watch,
            formState: {errors}
        } = useForm<HotelForm>({defaultValues: {rating: 5, telegram_url: 'https://t.me/'}})

        const formData = watch()
        // количество ночей - считаем по выбранной дате
        // предоплата - сумма указанная вручную
        // итоговая сумма - сумма * количество ночей - предоплата

        const deserializeData = (data: HotelForm): Hotel => {
            return {...data, type: data.type.label}
        }
        const onAcceptForm = useCallback(() => {

            const serializedData = deserializeData(formData)

            onAccept(serializedData)
        }, [formData]);


        return (
            <Modal
                hasOverlay
                isOpen={isOpen}
                onClickOutside={onClose}
                onEsc={onClose}
                loading={isLoading}
            >
                <FormTitle>
                    Добавление отеля
                </FormTitle>
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
                            rules={{required: true}}
                            render={({field}) => <Select
                                {...field} items={HOTEL_TYPES}
                                placeholder={'Выберите из списка'}
                                label={"Тип"}
                                required
                                size={FORM_SIZE}
                                dropdownClassName={cx.dropdown}
                                disabled={isLoading}
                                className={cx.fields}
                            />
                            }
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
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*// @ts-expect-error*/}
                <TextField
                    {...register('address')}
                    placeholder="Введите адрес"
                    label="Местоположение"
                    required
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
                <Controller
                    name="telegram_url"
                    control={control}
                    render={({field}) => <TextField
                        {...field}
                        placeholder="Вставьте ссылку"
                        label="Ссылка на отель в Telegram"
                        size={FORM_SIZE}
                        disabled={isLoading}
                        className={cx.fields}
                        rightSide={() => formData?.telegram_url ? <LinkIcon icon={<FaTelegram
                            color="2AABEE"
                            size={'24px'}
                        />} link={formData?.telegram_url}/> : null}
                    />}
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
                <Grid cols={2}>
                    <GridItem>
                        <TravelButton
                            style={{color: 'red', borderColor: 'red'}}
                            size="m"
                            view="secondary"
                            label="Отмена"
                            onClick={onClose}
                            disabled={isLoading}

                        />
                    </GridItem>
                    <GridItem style={{alignSelf: 'end'}}>
                        <TravelButton
                            size="m"
                            label="Добавить"
                            onClick={onAcceptForm}
                            loading={isLoading}
                        /></GridItem>
                </Grid>
            </Modal>
        );
    }
;
