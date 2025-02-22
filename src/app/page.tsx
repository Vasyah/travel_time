"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Text} from "@consta/uikit/Text";
import {nanoid} from "nanoid";
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";
import {Card} from "@consta/uikit/Card";
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from 'next/image'
import {createHotelApi, createRoomApi, Hotel, Room} from "@/shared/api/hotels/hotels";
import building from './building.svg'
import bed from './bed.svg'
import key from './key.svg'
import {HotelInfo} from "@/features/HotelModal/ui/HotelInfo";
import {Button} from "@consta/uikit/Button";
import {ToastContainer, toast, Bounce, ToastOptions} from 'react-toastify';
import {useMutation} from "@tanstack/react-query";
import {RoomInfo} from "@/features/RoomInfo/ui/RoomInfo";
import {QUERY_KEYS, queryClient} from "@/app/config/reactQuery";
import cx from './page.module.css'

const toastOptions: ToastOptions = {
    autoClose: 3000,
    pauseOnHover: true,
    theme: "light",
    transition: Bounce,
    type: 'success',
}

const toastErrorOptions: ToastOptions = {
    autoClose: 3000,
    pauseOnHover: true,
    theme: "light",
    transition: Bounce,
    type: 'error',
}
export default function Main() {
    const [isHotelOpen, setIsHotelOpen] = useState<boolean>(false);
    const [isRoomOpen, setIsRoomOpen] = useState<boolean>(false)
    const [isReserveOpen, setIsReserveOpen] = useState<boolean>(false)

    const {
        isError: isHotelError,
        isPending: isHotelLoading,
        isSuccess: isHotelLoaded,
        mutate: createHotel
    } = useMutation({
        mutationFn: (hotel: Hotel) => {
            return createHotelApi(hotel)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: QUERY_KEYS.hotelsForRoom})
        },
    })

    const {
        status,
        isPending: isRoomLoading,
        isSuccess: isRoomLoaded,
        mutate: createRoom,
        error: roomError
    } = useMutation({
        mutationFn: createRoomApi,
    })


    useEffect(() => {

        if (isHotelLoaded) {
            toast('Отель добавлен', toastOptions)
            setIsHotelOpen(false);
        }

    }, [isHotelLoaded])

    useEffect(() => {

        console.log({status, isRoomLoaded})
        if (status === 'error') {
            toast(`Ошибка при добавлении отеля ${roomError}`, toastErrorOptions)
            setIsHotelOpen(false);

            return;
        }

        if (isRoomLoaded) {
            toast('Номер успешно добавлен', toastOptions)
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

    const onReserveCreate = useCallback((hotel: Hotel) => {
        console.log('создаю Reserve')
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
                />
            }


            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            <Grid cols={3} colGap={'m'}>
                {
                    cards.map(({count, btn, image, title, id}) => {
                            return (
                                <GridItem>
                                    <Card key={id}
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
