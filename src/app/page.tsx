"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Text} from "@consta/uikit/Text";
import {nanoid} from "nanoid";
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";
import {Card} from "@consta/uikit/Card";
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from 'next/image'
import {Hotel, useCreateHotel} from "@/shared/api/hotel/hotel";
import building from './building.svg'
import bed from './bed.svg'
import key from './key.svg'
import {HotelInfo} from "@/features/HotelModal/ui/HotelInfo";
import {Button} from "@consta/uikit/Button";
import {ToastContainer} from 'react-toastify';
import {RoomInfo} from "@/features/RoomInfo/ui/RoomInfo";
import cx from './page.module.css'
import {Room, useCreateRoom} from "@/shared/api/room/room";
import {Reserve, useCreateReserve} from "@/shared/api/reserve/reserve";
import {showToast} from "@/shared/ui/Toast/Toast";


export default function Main() {
    const [isHotelOpen, setIsHotelOpen] = useState<boolean>(false);
    const [isRoomOpen, setIsRoomOpen] = useState<boolean>(false)
    const [isReserveOpen, setIsReserveOpen] = useState<boolean>(false)

    const {
        isError: isHotelError,
        isPending: isHotelLoading,
        isSuccess: isHotelLoaded,
        mutate: createHotel
    } = useCreateHotel()

    const {
        status,
        isPending: isRoomLoading,
        isSuccess: isRoomLoaded,
        mutate: createRoom,
        error: roomError
    } = useCreateRoom()

    const {
        isPending: isReserveLoading,
        isSuccess: isReserveLoaded,
        mutate: createReserve,
        error: reserveError
    } = useCreateReserve()

    useEffect(() => {

        if (isHotelLoaded) {
            showToast('Отель добавлен')
            setIsHotelOpen(false);
        }

    }, [isHotelLoaded])

    useEffect(() => {
        console.log({status, isRoomLoaded})
        if (status === 'error') {
            showToast(`Ошибка при добавлении отеля ${roomError}`, 'error')
            setIsHotelOpen(false);

            return;
        }

        if (isRoomLoaded) {
            showToast('Номер успешно добавлен')
            setIsHotelOpen(false);
        }

    }, [status])

    useEffect(() => {
        console.log({status, isRoomLoaded})
        if (status === 'error') {
            showToast(`Ошибка при добавлении отеля ${roomError}`, 'error')
            setIsHotelOpen(false);

            return;
        }

        if (isRoomLoaded) {
            showToast('Номер успешно добавлен')
            setIsHotelOpen(false);
        }

    }, [status])
    const cards = [{
        id: nanoid(),
        title: 'Отелей всего в базе',
        btn: {onClick: () => setIsHotelOpen(true), title: 'Добавить отель'},
        count: 25,
        image: <Image src={building.src} alt={''} width={115} height={140}/>
    }, {
        id: nanoid(),
        title: 'Номеров всего в базе',
        btn: {onClick: () => setIsRoomOpen(true), title: 'Добавить номер'},
        count: 25,
        image: <Image src={bed.src} alt={''} width={115} height={140}/>
    }, {
        id: nanoid(),
        title: 'Номеров забронировано',
        btn: {onClick: () => setIsReserveOpen(true), title: 'Добавить бронь'},
        count: 25,
        image: <Image src={key.src} alt={''} width={115} height={140}/>
    }]


    const onHotelCreate = useCallback(async (hotel: Hotel) => {
        createHotel(hotel)
    }, [])

    const onRoomCreate = useCallback((room: Room) => {
        createRoom(room)
        console.log('Создаю ROOM', room)
    }, [])

    const onReserveCreate = useCallback((reserve: Reserve) => {
        console.log('создаю Reserve')
        createReserve(reserve)
    }, [])


    return (
        <div>
            {isHotelOpen &&
                <HotelInfo
                    isOpen={isHotelOpen}
                    onClose={() => setIsHotelOpen(false)}
                    onAccept={onHotelCreate}
                    isLoading={isHotelLoading}
                />
            }
            {isRoomOpen &&
                <RoomInfo
                    isOpen={isRoomOpen}
                    onClose={() => setIsRoomOpen(false)}
                    onAccept={onRoomCreate}
                    currentReserve={null}
                    isLoading={isRoomLoading}
                />
            }
            {isReserveOpen &&
                <ReserveInfo
                    isOpen={isReserveOpen}
                    onClose={() => setIsReserveOpen(false)}
                    onAccept={onReserveCreate}
                    currentReserve={null}
                    isLoading={isReserveLoading}
                />
            }


            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            <Grid cols={2} colGap={'m'} rowGap={'m'} style={{maxWidth: '1280px'}}>
                {
                    cards.map(({count, btn, image, title, id}) => {
                            return (
                                <GridItem key={id} row={1}>
                                    <Card
                                        shadow
                                        title={title}
                                        horizontalSpace={'2xl'}
                                        verticalSpace={'2xl'}
                                        className={cx.card}
                                    >

                                        <div className={cx.image}>{image}</div>
                                        <div className={cx.container}>
                                            <div className={cx.count}>
                                                <Text view={'success'} size={'5xl'} weight={'semibold'}>{count}</Text>
                                            </div>
                                            <div className={cx.info}>
                                                <Text view={'primary'} size={'xl'} weight={'medium'}>{title}</Text>
                                                <Button className={cx.button} label={btn.title} onClick={btn.onClick}
                                                        view={'secondary'}/>
                                            </div>
                                        </div>


                                    </Card>
                                </GridItem>)

                        }
                    )
                }
            </Grid>
            <ToastContainer/>
        </div>
    );
}
