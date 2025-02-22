import React, {FC, useState} from 'react'
import {Modal} from "@consta/uikit/Modal";
import {Text} from "@consta/uikit/Text";
import {Button} from "@consta/uikit/Button";
import cx from '@/features/ReserveInfo/ui/style.module.css'
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
    currentReserve?: CurrentReserveType
}

const hotels: Item[] = [
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

const rooms: Item[] = [
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
];

type Inputs = {
    price: number
    quantity: number
    date: [Date?, Date?]
    hotel: string
    room: string
    guest: string
    phone: string
    comment: string
}

export const ReserveInfo: FC<HotelReserveProps> = ({
                                                       isOpen = false,
                                                       onAccept,
                                                       onClose,
                                                       currentReserve
                                                   }: HotelReserveProps) => {

    const [value, setValue] = useState<[Date?, Date?] | null>(currentReserve?.time ? [new Date(currentReserve?.time), undefined] : null);

    const {
        control,
        getValues,
        register,
        handleSubmit,
        watch,
        formState: {errors},
    } = useForm<Inputs>({
        defaultValues:
            {
                hotel: {id: currentReserve?.hotel.id, label: currentReserve?.hotel.title},
                room: {id: currentReserve?.room.id, label: currentReserve?.room.title}
            }
    })


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
                Бронирование
            </Text>

            <DatePicker
                {...register('date')}
                style={{zIndex: 90}}
                type="date-range"
                value={value}
                onChange={(d) => {
                    console.log(d)
                    setValue(d)
                }}
                leftSide={[IconCalendar, IconCalendar]}
                placeholder={['ДД.ММ.ГГГГ', 'ДД.ММ.ГГГГ']}
                dateTimeView={'slider'}
                withClearButton
                size={'s'}
            />
            <Controller
                name="hotel"
                control={control}
                rules={{required: true}}
                render={({field}) => <Select {...field} items={[...hotels, {
                    id: currentReserve?.hotel,
                    label: currentReserve?.hotel.title
                }]}
                                             placeholder={'Выберите из списка'}
                                             label={"Название отеля"} required size={'s'}
                                             dropdownClassName={cx.dropdown}
                />}
            />
            <Controller
                name="room"
                control={control}
                rules={{required: true}}
                render={({field}) => <Select {...field} items={[...rooms, {
                    id: currentReserve?.room.id,
                    label: currentReserve?.room.title
                }]}
                                             placeholder={'Выберите из списка'}
                                             label={"Номер"} required size={'s'}
                                             dropdownClassName={cx.dropdown}
                />}
            />
            <FieldGroup size="s">
                <TextField
                    {...register('price')}
                    placeholder="Введите стоимость"
                    label="Стоимость номера"
                    // rightSide="руб. / ночь"
                    required
                    size={'s'}

                />
                <TextField
                    {...register('quantity')}
                    placeholder="Введите число"
                    label="Количество человек"
                    required
                    size={'s'}

                />
            </FieldGroup>
            <TextField
                {...register('guest')}
                placeholder="Введите ФИО"
                label="ФИО гостя"
                required
                size={'s'}

            />
            <TextField
                {...register('phone')}
                placeholder="+7 (...)"
                label="Номер гостя"
                required
                type={'phone'}
                size={'s'}
            />

            <TextField
                {...register('comment')}
                label="Комментарии"
                type="textarea"
                cols={200}
                rows={3}
                placeholder="Введите комментарий"
                size={'s'}
            />
            <Text>Итого</Text>
            <Text>Количество ночей Значение</Text>
            <Text>Внесено Значение</Text>
            <Text>Остаток Значение</Text>
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
