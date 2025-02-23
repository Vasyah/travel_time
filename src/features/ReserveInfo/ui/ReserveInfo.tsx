import React, {FC, useCallback, useEffect, useMemo, useState} from 'react'
import {Modal} from "@consta/uikit/Modal";
import {Text} from "@consta/uikit/Text";
import cx from '@/features/ReserveInfo/ui/style.module.css'
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {DatePicker} from "@consta/uikit/DatePicker";
import {Controller, useForm} from "react-hook-form";
import {Loader} from "@consta/uikit/Loader";
import {FORM_SIZE} from "@/shared/lib/const";
import {type CurrentReserveType, Reserve, ReserveForm, useCreateReserve} from "@/shared/api/reserve/reserve";
import {useGetHotelsForRoom} from "@/shared/api/hotel/hotel";
import {useGetRoomsByHotel} from "@/shared/api/room/room";
import {adaptToOption} from "@/features/RoomInfo/lib/adaptHotel";
import {FormButtons} from "@/shared/ui/FormButtons/FormButtons";
import {toast} from "react-toastify";
import moment from "moment";
import {ReserveTotal} from "@/features/ReserveInfo/ui/ReserveTotal";

export interface ReserveInfoProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (reserve: Reserve) => void;
    currentReserve?: CurrentReserveType
    isLoading: boolean
}

export const ReserveInfo: FC<ReserveInfoProps> = ({
                                                      isOpen = false,
                                                      onAccept,
                                                      onClose,
                                                      currentReserve,
                                                      isLoading,
                                                  }: ReserveInfoProps) => {

    const {data: hotels, isPending: isHotelsLoading, status: hotelsStatus} = useGetHotelsForRoom()


    const {
        control,
        register,
        watch,
    } = useForm<ReserveForm>({
        defaultValues:
            {
                date: [moment().toDate(), moment().toDate()],
                hotel_id: {id: currentReserve?.hotel.id, label: currentReserve?.hotel.title},
                room_id: {id: currentReserve?.room.id, label: currentReserve?.room.title}
            }
    })

    const formData = watch()


    const {
        data: rooms,
        isPending: isRoomsLoading,
        refetch: fetchRoomsByHotel,
        status: roomsStatus
    } = useGetRoomsByHotel(formData?.hotel_id?.id)

    const hotelOptions = useMemo(() => {
        const hotelsTmp = hotels?.map(adaptToOption)

        if (currentReserve?.hotel?.id) {
            hotelsTmp?.push({
                id: currentReserve?.hotel.id,
                label: currentReserve?.hotel.title
            })
        }

        return hotelsTmp ?? []
    }, [hotels])

    const roomOptions = useMemo(() => {
        const hotelsTmp = rooms?.map(adaptToOption)

        if (currentReserve?.room?.id) {
            hotelsTmp?.push({
                id: currentReserve?.room.id,
                label: currentReserve?.room.title
            })
        }

        return hotelsTmp ?? []
    }, [rooms])


    useEffect(() => {
        console.log('im here')
        if (hotelsStatus === 'success' && !!formData.hotel_id) {
            fetchRoomsByHotel()
        }
    }, [hotelsStatus, formData.hotel_id])

    const loading = isLoading || isHotelsLoading

    // количество ночей - считаем по выбранной дате
    // предоплата - сумма указанная вручную
    // итоговая сумма - сумма * количество ночей - предоплата

    // добавить удаление номера, при смене отеля

    const deserializeData = ({hotel_id, date, price, quantity, prepayment = 0, ...data}: ReserveForm) => {
        const start = moment(date[0]).hour(12).unix()
        const end = moment(date[1]).hour(11).unix()
        const room_id = data.room_id?.id
        const priceNumber = +price
        const quantityNumber = +quantity
        const prepaymentNumber = +prepayment

        return {
            ...data,
            room_id,
            start,
            end,
            price: priceNumber,
            quantity: quantityNumber,
            prepayment: prepaymentNumber
        }

    }


    const onAcceptForm = () => {
        if (!formData?.date?.[0] || !formData?.date?.[1]) {
            toast('Ошибка при создании брони, проверьте даты', {type: 'error'})
            return
        }
        const data = deserializeData(formData)
        console.log({formData, data})


        onAccept(data)
    }

    const convertToDate = ([start, end]: [Date?: number, Date?: number]) => {

        if (start) {

        }
    }

    return (
        <Modal
            hasOverlay
            className={cx.modal}
            rootClassName={cx.sidebarOverlay}
            isOpen={isOpen}
            onClickOutside={onClose}
            onEsc={onClose}
        >
            {loading && <Loader type="circle"/>}
            <Text
                as="p"
                size="3xl"
                view="primary"
                weight="semibold"
                className={cx.title}
            >
                Бронирование
            </Text>

            <Controller
                name="date"
                control={control}
                rules={{required: true}}
                render={({field}) =>
                    <DatePicker
                        value={field.value}
                        onChange={e => field.onChange(e)}
                        style={{zIndex: 90}}
                        type="date-range"
                        leftSide={[IconCalendar, IconCalendar]}
                        placeholder={['ДД.ММ.ГГГГ', 'ДД.ММ.ГГГГ']}
                        dateTimeView={'classic'}
                        withClearButton
                        size={FORM_SIZE}
                    />
                }
            />

            <Controller
                name="hotel_id"
                control={control}
                rules={{required: true}}
                render={({field}) => <
                    Select
                    {...field}
                    items={hotelOptions}
                    placeholder={'Выберите из списка'}
                    label={"Название отеля"} required size={FORM_SIZE}
                    dropdownClassName={cx.dropdown}
                    className={cx.fields}
                    disabled={loading}
                />}
            />
            <Controller
                name="room_id"
                control={control}
                rules={{required: true}}
                render={({field}) =>
                    <Select {...field} items={roomOptions}
                            placeholder={'Выберите из списка'}
                            label={"Номер"} required size={FORM_SIZE}
                            dropdownClassName={cx.dropdown}
                            isLoading={isHotelsLoading || isRoomsLoading}
                    />
                }
            />
            <FieldGroup size={FORM_SIZE}>
                <Controller
                    name="price"
                    control={control}
                    rules={{required: true}}
                    render={({field}) =>
                        <TextField
                            {...field}
                            placeholder="Введите стоимость"
                            label="Стоимость номера"
                            required
                            size={FORM_SIZE}
                            className={cx.fields}
                            disabled={loading}
                            value={String(field.value)}
                            onChange={field.onChange}
                            type="number"
                        />
                    }
                />
                <TextField
                    {...register('quantity')}
                    placeholder="Введите число"
                    label="Количество человек"
                    required
                />
            </FieldGroup>
            <TextField
                {...register('guest')}
                placeholder="Введите ФИО"
                label="ФИО гостя"
                required
                size={FORM_SIZE}

            />
            <TextField
                {...register('phone')}
                placeholder="+7 (...)"
                label="Номер гостя"
                required
                type={'phone'}
                size={FORM_SIZE}
            />

            <TextField
                {...register('comment')}
                label="Комментарии"
                type="textarea"
                cols={200}
                rows={3}
                placeholder="Введите комментарий"
                size={FORM_SIZE}
            />
            <ReserveTotal date={formData.date} price={formData.price} prepayment={formData.prepayment}
                          Prepayment={<Controller
                              name="prepayment"
                              control={control}
                              render={({field}) =>
                                  <TextField
                                      style={{maxWidth: '150px', maxHeight: '20px'}}
                                      {...field}
                                      labelPosition={'left'}
                                      required
                                      size={FORM_SIZE}
                                      className={cx.fields}
                                      disabled={loading}
                                      view={'clear'}
                                      value={String(field.value ?? '0')}
                                      onChange={field.onChange}
                                      // type={'number'}
                                      rightSide={'руб.'}
                                  />
                              }
                          />}/>

            <FormButtons isLoading={loading} onAccept={onAcceptForm} onClose={onClose}/>
        </Modal>
    );
};
