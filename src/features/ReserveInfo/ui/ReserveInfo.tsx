import React, {FC, useEffect, useMemo} from 'react'
import cx from '@/features/ReserveInfo/ui/style.module.css'
import {FieldGroup} from "@consta/uikit/FieldGroup";
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {DatePicker} from "@consta/uikit/DatePicker";
import {Controller, useForm} from "react-hook-form";
import {FORM_SIZE} from "@/shared/lib/const";
import {type CurrentReserveType, Nullable, Reserve, ReserveDTO, ReserveForm} from "@/shared/api/reserve/reserve";
import {useGetHotelsForRoom} from "@/shared/api/hotel/hotel";
import {useGetRoomsByHotel} from "@/shared/api/room/room";
import {adaptToOption} from "@/features/RoomInfo/lib/adaptHotel";
import {FormButtons} from "@/shared/ui/FormButtons/FormButtons";
import moment from "moment";
import {ReserveTotal} from "@/features/ReserveInfo/ui/ReserveTotal";
import {FormTitle} from "@/shared/ui/FormTitle/FormTitle";
import {showToast} from "@/shared/ui/Toast/Toast";
import {IoLogoWhatsapp} from "react-icons/io";
import {createWhatsappLink} from "@/shared/lib/links";
import {LinkIcon} from "@/shared/ui/LinkIcon/LinkIcon";
import {TextFieldPropStatus} from "@consta/uikit/__internal__/src/components/TextField/types";

export interface ReserveInfoProps {
    onClose: () => void;
    onAccept: (reserve: Reserve | ReserveDTO) => void;
    currentReserve?: Nullable<CurrentReserveType>
    isLoading: boolean
}

export const ReserveInfo: FC<ReserveInfoProps> = ({
                                                      onAccept,
                                                      onClose,
                                                      currentReserve,
                                                      isLoading,
                                                  }: ReserveInfoProps) => {

    const {data: hotels, isLoading: isHotelsLoading, status: hotelsStatus} = useGetHotelsForRoom()

    const getDefaultValues = ({
                                  reserve,
                                  room,
                                  hotel
                              }: CurrentReserveType): Partial<ReserveForm> => {


        const getReserveDefaults = ({start, end, price, prepayment, guest, phone, comment, quantity}: ReserveDTO) => {
            const currentDate: [Date, Date] = start && end ? [new Date(start), new Date(end)] : [new Date(), new Date()]
            return {
                date: currentDate,
                price,
                prepayment: prepayment ? String(prepayment) : String(0),
                guest,
                phone,
                comment,
                quantity
            }
        }

        let defaults = {
            date: [moment().toDate(), moment().add(1, 'days').toDate()] as [Date, Date],
            hotel_id: hotel ? adaptToOption({
                id: hotel?.id,
                title: hotel?.title
            }) : undefined,
            room_id: room ? adaptToOption({
                id: room?.id,
                title: room?.title
            }) : undefined,
        }

        if (!!reserve) {
            defaults = {...defaults, ...getReserveDefaults(reserve)}
        }

        return defaults

    }

    const {
        control,
        register,
        watch,
        formState: {errors},
        handleSubmit
    } = useForm<ReserveForm>({
        mode: 'onSubmit',
        defaultValues: currentReserve?.hotel ? getDefaultValues(currentReserve) : undefined
    })

    const formData = watch()


    const {
        data: rooms,
        isLoading: isRoomsLoading,
        refetch: fetchRoomsByHotel,
        status: roomsStatus,
    } = useGetRoomsByHotel(formData?.hotel_id?.id, false)


    const hotelOptions = useMemo(() => {
        const hotelsTmp = hotels?.map(adaptToOption)

        return hotelsTmp ?? []
    }, [hotels])

    const roomOptions = useMemo(() => {
        const hotelsTmp = rooms?.map(adaptToOption)

        return hotelsTmp ?? []
    }, [rooms])


    useEffect(() => {
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


    console.log({formData, errors})
    const onAcceptForm = (formData: ReserveForm) => {
        if (!formData?.date?.[0] || !formData?.date?.[1]) {
            showToast('Ошибка при создании брони, проверьте даты', "error")
            return
        }

        if (errors) {
            showToast('Ошибка при создании брони, проверьте корректность ввода данных', "error")
            console.log(errors)
        }
        const data = deserializeData(formData)
        onAccept(currentReserve ? {...data, id: currentReserve?.reserve?.id} : data)
    }

    const getError = (field: keyof ReserveDTO, errors: Record<string, unknown>) => {
        if (!errors?.[field]) {
            return {
                status: undefined,
                caption: undefined,
            }
        }

        return {
            status: 'alert' as TextFieldPropStatus,
            caption: errors[field],
        }
    }

    return (
        <>
            <FormTitle>
                Бронирование
            </FormTitle>

            <Controller
                name="date"
                control={control}
                rules={{required: true}}
                render={({field}) =>
                    <DatePicker
                        style={{zIndex: 999}}
                        required
                        value={field.value}
                        onChange={e => field.onChange(e)}
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
                render={({field}) =>
                    <Select
                        {...field}
                        style={{zIndex: 999}}
                        items={hotelOptions}
                        placeholder={'Выберите из списка'}
                        label={"Название отеля"} required size={FORM_SIZE}
                        dropdownClassName={cx.dropdown}
                        className={cx.fields}
                        disabled={loading || !!currentReserve?.hotel?.id}
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
                            className={cx.fields}
                            isLoading={isHotelsLoading || isRoomsLoading}
                            disabled={!!currentReserve}

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
                            incrementButtons={false}
                        />
                    }
                />
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/*// @ts-expect-error*/}
                <TextField
                    {...register('quantity')}
                    placeholder="Введите число"
                    label="Количество человек"
                    incrementButtons={false}
                    required
                    type={'number'}
                />
            </FieldGroup>
            <Controller
                name="guest"
                rules={{required: true}}
                control={control}
                render={({field}) => <TextField
                    {...field}
                    placeholder="Введите ФИО"
                    label="ФИО гостя"
                    required
                    size={FORM_SIZE}
                />}
            />
            <Controller
                name="phone"
                rules={{required: true}}
                control={control}
                render={({field}) => <TextField
                    {...field}
                    placeholder="+7 (...)"
                    required
                    label="Номер гостя"
                    type={'phone'}
                    size={FORM_SIZE}
                    rightSide={() => formData?.phone ? <LinkIcon icon={
                        <IoLogoWhatsapp
                            color="#5BD066"
                            size={'24px'}
                        />
                    } link={createWhatsappLink(formData?.phone, 'Добрый день')}/> : null}
                />}
            />

            <Controller
                name="comment"
                control={control}
                render={({field}) => <TextField
                    {...field}
                    className={cx.fields}
                    label="Комментарии"
                    type="textarea"
                    value={field?.value}
                    onChange={field?.onChange}
                    cols={200}
                    rows={3}
                    placeholder="Введите комментарий"
                    size={FORM_SIZE}
                />}
            />

            <ReserveTotal date={formData?.date} price={formData.price} prepayment={formData.prepayment}
                          className={cx.fields}
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
                                      value={String(field?.value)}
                                      onChange={field.onChange}
                                      type={'number'}
                                      incrementButtons={false}
                                      rightSide={'руб.'}
                                  />
                              }
                          />}/>

            <FormButtons isLoading={loading} onAccept={() => handleSubmit(onAcceptForm)} onClose={onClose}/>
            {/*<FormButtons isLoading={loading} onAccept={() => handleSubmit((data => console.log({data, errors})))}*/}
            {/*             onClose={onClose}/>*/}
        </>
    );
};
