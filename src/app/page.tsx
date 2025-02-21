"use client";
import React, {useCallback, useEffect, useState} from "react";
import {Text} from "@consta/uikit/Text";
import {nanoid} from "nanoid";
import {ReserveModal} from "@/features/ReserveModal/ui/ReserveModal";
import {Card} from "@consta/uikit/Card";
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from 'next/image'
import {createHotelApi, createRoomApi, Hotel, Room} from "@/shared/api/hotels/hotels";
import building from './building.svg'
import bed from './bed.svg'
import key from './key.svg'
import {HotelModal} from "@/features/HotelModal/ui/HotelModal";
import {Button} from "@consta/uikit/Button";
import {SnackBar} from "@consta/uikit/SnackBar";
import {ToastContainer, toast, Bounce, ToastOptions} from 'react-toastify';
import {useMutation} from "@tanstack/react-query";

const toastOptions: ToastOptions = {
    autoClose: 3000,
    pauseOnHover: true,
    theme: "light",
    transition: Bounce,
    type: 'success',
}

export default function Main() {
    const [isHotelModalOpen, setIsHotelModalOpen] = useState<boolean>(false);
    const [isRoomModalOpen, setIsRoomModalOpen] = useState<boolean>(false)
    const [isReserveModalOpen, setIsReserveModalOpen] = useState<boolean>(false)

    const {
        isError: isHotelError,
        isPending: isHotelLoading,
        isSuccess: isHotelLoaded,
        mutate: createHotel
    } = useMutation({
        mutationFn: (hotel: Hotel) => {
            return createHotelApi(hotel)
        },
    })

    const {isError: isRoomError, isPending: isRoomLoading, isSuccess: isRoomLoaded, mutate: createRoom} = useMutation({
        mutationFn: (room: Room) => {
            return createRoomApi(room)
        },
    })


    useEffect(() => {

        if (isHotelLoaded) {
            toast('Отель добавлен', toastOptions)
            setIsHotelModalOpen(false);
        }

    }, [isHotelLoaded])

    useEffect(() => {

        if (isRoomLoaded) {
            toast('Отель добавлен', toastOptions)
            setIsHotelModalOpen(false);
        }

    }, [isRoomLoaded])

    const cards = [{
        id: nanoid(),
        title: 'Отелей всего в базе',
        btn: {onClick: () => setIsHotelModalOpen(true), title: 'Добавить отель'},
        count: 25,
        image: <Image src={building.src} alt={''} width={115} height={140}/>
    }, {
        id: nanoid(),
        title: 'Номеров всего в базе',
        btn: {onClick: () => setIsRoomModalOpen(true), title: 'Добавить номер'},
        count: 25,
        image: <Image src={bed.src} alt={''} width={115} height={140}/>
    }, {
        id: nanoid(),
        title: 'Номеров забронировано',
        btn: {onClick: () => setIsReserveModalOpen(true), title: 'Добавить бронь'},
        count: 25,
        image: <Image src={key.src} alt={''} width={115} height={140}/>
    }]


    const onHotelCreate = useCallback(async (hotel: Hotel) => {
        createHotel(hotel)
    }, [])

    const items = [
        {
            key: 0,
            text: 'Это просто сообщение',
            status: 'success',
            autoClose: true,
            onAutoClose: (item) => console.log(item),
        },
    ];

    const onReserveCreate = useCallback((hotel: Hotel) => {
        console.log('создаю Reserve')
    }, [])

    return (
        <div>
            {isHotelModalOpen && <HotelModal isOpen={isHotelModalOpen} onClose={() => setIsHotelModalOpen(false)}
                                             onAccept={onHotelCreate} isLoading={isHotelLoading}/>}
            {isReserveModalOpen &&
                <ReserveModal isOpen={isReserveModalOpen} onClose={() => setIsReserveModalOpen(false)}
                              onAccept={onReserveCreate} currentReserve={null}/>}

            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            <Grid cols={3} colGap={'m'}>
                {
                    cards.map(({count, btn, image, title, id}) => {
                            return (
                                <GridItem>
                                    <Card key={id} shadow title={title} horizontalSpace={'2xl'}
                                          verticalSpace={'2xl'} style={{minHeight: '180px'}}>
                                        {count} {image}
                                        {title}
                                        <Button label={btn.title} onClick={btn.onClick} view={'secondary'}/>
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
