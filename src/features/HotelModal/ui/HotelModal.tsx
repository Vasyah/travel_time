import React, {FC, useCallback, useEffect, useState} from 'react'
import {Modal} from "@consta/uikit/Modal";
import {Text} from "@consta/uikit/Text";
import {Button} from "@consta/uikit/Button";
import cx from '@/features/ReserveModal/ui/style.module.css'
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {DatePicker} from "@consta/uikit/DatePicker";
import Item from "react-calendar-timeline/dist/lib/items/Item";
import {type CurrentReserveType} from "@/features/Scheduler/ui/Calendar";
import {Controller, useForm} from "react-hook-form";
import {Hotel, HotelForm} from "@/shared/api/hotels/hotels";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TravelButton} from "@/shared/ui/Button/Button";

export interface HotelReserveProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve?: CurrentReserveType
    isLoading?: boolean;
}

const types: Item[] = [
    {
        label: 'Отели',
        id: 1,
    },
    {
        label: 'Гостевые Дома',
        id: 2,
    },
    {
        label: 'Домики',
        id: 3,
    },
    {
        label: 'Квартиры',
        id: "4",
    },
    {
        label: 'Дом Под Ключ',
        id: "5",
    },
];

const FORM_SIZE = 'm';

export type HotelForm = Hotel & { type: { label: string, id: string } };

export const HotelModal: FC<HotelReserveProps> = ({
                                                      isOpen = false,
                                                      onAccept,
                                                      onClose,
                                                      currentReserve,
                                                      isLoading = false,
                                                  }:
                                                  HotelReserveProps
    ) => {

        const {
            control,
            getValues,
            register,
            handleSubmit,
            watch,
            formState: {errors}
        } = useForm<HotelForm>({defaultValues: {rating: 5}})


        // количество ночей - считаем по выбранной дате
        // предоплата - сумма указанная вручную
        // итоговая сумма - сумма * количество ночей - предоплата

        const serializeData = (data: HotelForm): Hotel => {
            return {...data, type: data.type.label}
        }
        const onAcceptForm = useCallback(() => {

            const serializedData = serializeData(getValues())

            onAccept(serializedData)
        }, []);

        return (
            <Modal
                hasOverlay
                className={cx.modal}
                rootClassName={cx.sidebarOverlay}
                isOpen={isOpen}
                onClickOutside={onClose}
                onEsc={onClose}
            >
                <Text
                    as="p"
                    size="2xl"
                    view="primary"
                    weight="semibold"
                    className={cx.title}
                >
                    Добавление отеля
                </Text>

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
                                {...field} items={types}
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
                        <TextField
                            {...register('rating')}
                            placeholder="Введите число"
                            label="Рейтинг"
                            type="number"
                            required
                            size={FORM_SIZE}
                            disabled={isLoading}
                            className={cx.fields}
                        />
                    </GridItem>
                </Grid>
                <TextField
                    {...register('address')}
                    placeholder="Введите адрес"
                    label="Местоположение"
                    required
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
                <TextField
                    {...register('telegram_url')}
                    placeholder="Вставьте ссылку"
                    label="Ссылка на отель в Telegram"
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
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
                <Text> Количество номеров: 12312 Отображаем только для редактирования</Text>
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
