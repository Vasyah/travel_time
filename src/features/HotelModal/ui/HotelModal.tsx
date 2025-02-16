import React, {FC, useEffect, useState} from 'react'
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

export interface HotelReserveProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve: CurrentReserveType
}

const types: Item[] = [
    {
        label: 'Первый',
        id: 1,
    },
    {
        label: 'Второй',
        id: 2,
    },
    {
        label: 'Третий',
        id: 3,
    },
    {
        label: 'Четвертый',
        id: "_5V-mnrTQcyY8dMg_Wh8_",
    },
];

type Inputs = {
    title: string
    type: string
    rating: number
    address: string
    telegramURL: string
    phone: string
    description: string
}

export const HotelModal: FC<HotelReserveProps> = ({
                                                      isOpen = false,
                                                      onAccept,
                                                      onClose,
                                                      currentReserve
                                                  }: HotelReserveProps) => {

    const {
        control,
        getValues,
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>()


    // количество ночей - считаем по выбранной дате
    // предоплата - сумма указанная вручную
    // итоговая сумма - сумма * количество ночей - предоплата
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
                size="3xl"
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
                size={'s'}

            />
            <Controller
                name="hotel"
                control={control}
                rules={{required: true}}
                render={({field}) => <Select {...field} items={types}
                                             placeholder={'Выберите из списка'}
                                             label={"Тип"} required size={'s'}
                                             dropdownClassName={cx.dropdown}
                />}
            />
            <TextField
                {...register('rating')}
                placeholder="Введите число"
                label="Количество звёзд"
                type="number"
                required
                size={'s'}

            />
            <TextField
                {...register('address')}
                placeholder="Введите адрес"
                label="Местоположение"
                required
                size={'s'}
            />
            <TextField
                {...register('telegramURL')}
                placeholder="Вставьте ссылку"
                label="Ссылка на отель в Telegram"
                size={'s'}
            />
            <TextField
                {...register('phone')}
                placeholder="+7 (...)"
                label="Номер владельца"
                required
                type={'phone'}
                size={'s'}
            />
            <TextField
                {...register('description')}
                label="Комментарии"
                type="textarea"
                cols={200}
                rows={3}
                placeholder="Введите комментарий"
                size={'s'}
            />
            <Text>Количество номеров: 12312</Text>
            <Button
                size="m"
                view="clear"
                label="Отмена"
                width="default"
                onClick={onClose}
            />
            <Button
                size="m"
                label="Добавить"
                width="default"
                onClick={() => {
                    console.log(getValues())
                    onAccept({'dolby': 'digital'})
                }}
            />
        </Modal>
    );
};
