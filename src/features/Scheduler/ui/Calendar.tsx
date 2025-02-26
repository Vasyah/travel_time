import React, {useCallback, useEffect, useState} from "react";
import 'react-calendar-timeline/style.css'
import './calendar.css'
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from "next/image";
import {Text} from "@consta/uikit/Text";
import hotelImage from '../hotel.svg';
import star from '../star.svg';
import cx from './style.module.css'
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";
import {fetchHotelWithRoomsAndReserves, Hotel, HotelDTO} from "@/shared/api/hotel/hotel";
import {CurrentReserveType, Reserve, useCreateReserve} from "@/shared/api/reserve/reserve";
import {useGetRoomsWithReservesByHotel} from "@/shared/api/room/room";
import {Timeline} from "react-calendar-timeline";
import moment from "moment";

const keys = {
    groupIdKey: "id",
    groupTitleKey: "title",
    groupRightTitleKey: "rightTitle",
    itemIdKey: "id",
    itemTitleKey: "title",
    itemDivTitleKey: "title",
    itemGroupKey: "group",
    itemTimeStartKey: "start",
    itemTimeEndKey: "end",
    groupLabelKey: "title",
};


export interface CalendarProps {
    hotel: HotelDTO;
}

const hotelReserves: {
    id: string
    group: string
    end: number
    start: number
    title: string | undefined
}[] = []

export const Calendar = ({hotel,}: CalendarProps) => {
    const {data, isPending} = useGetRoomsWithReservesByHotel(hotel.id)
    const [isHotelReserve, setIsHotelReserve] = useState(false);
    const [currentReserve, setCurrentReserve] = useState<CurrentReserveType>(null);

    const {
        isPending: isReserveLoading,
        isSuccess: isReserveLoaded,
        mutate: createReserve,
        error: reserveError,
    } = useCreateReserve(() => {
        setCurrentReserve(null)
        setIsHotelReserve(false)
    })


    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const THREE_MONTHS = 24 * 60 * 60 * 1000 * 30 * 12;

    const onReserveCreate = useCallback(async (reserve: Reserve) => {
        console.log('Calendar создание брони', {reserve, currentReserve})

        createReserve(reserve)
    }, [])
    const onClose = () => {
        setCurrentReserve(null)
        setIsHotelReserve(false)
    };

    // обработать ситуацию, когда отель ещё пустой
    if (!hotel) {
        return <div>Пустой...перезаряжаюсь</div>
    }


    const hotelRooms = data?.map(({id, title}) => ({
        id, title
    })) ?? [];
    //
    let hotelReserves: {
        id: string
        group: string
        end: number
        start: number
        title: string | undefined
    }[] = []

    data?.forEach(({id: room_id, reserves}) => {
        const reservesTmp = reserves.map(({id, end, start, title}) => ({
            id,
            group: room_id,
            end: end,
            start,
            title
        }));

        hotelReserves = hotelReserves.concat(reservesTmp)
    })

    console.log({hotelRooms, hotelReserves});
    // console.log({items, fakeGroups})
    return (
        <Grid cols={12} className={cx.container}>
            <GridItem col={2}>
                <div className={cx.hotelInfo}>
                    {/*<Grid cols={4} yAlign={'bottom'}>*/}
                    {/*    <GridItem col={2}>*/}
                    <Image className={cx.hotelIcon} src={hotelImage.src} alt={"Изображение отеля"} width={90}
                           height={240}/>
                    {/*</GridItem>*/}
                    {/*<GridItem col={1}>*/}

                    <div className={cx.stars}>
                        <Image src={star.src} alt={"Звезда отеля"} width={24}
                               height={24}/>
                        <Image src={star.src} alt={"Звезда отеля"} width={24}
                               height={24}/>
                        <Image src={star.src} alt={"Звезда отеля"}
                               width={24}
                               height={24}/>
                        <Image src={star.src} alt={"Звезда отеля"}
                               width={24}
                               height={24}/>
                        <Image src={star.src} alt={"Звезда отеля"}
                               width={24}
                               height={24}/></div>
                    {/*</GridItem>*/}
                    {/*<GridItem col={1}>*/}
                    <div><Text className={cx.title} transform={"uppercase"} weight={"medium"}>{hotel.title}</Text>
                    </div>
                    {/*</GridItem>*/}
                    {/*</Grid>*/}
                </div>
            </GridItem>
            <GridItem col={10}>
                <Timeline
                    className={'travel-timeline'}
                    groups={hotelRooms}
                    items={hotelReserves}
                    keys={keys}
                    sidebarWidth={280}
                    canMove
                    canResize="both"
                    canSelect
                    onItemSelect={(itemId, e, time) => console.log(itemId, e, time)}
                    // itemsSorted
                    itemTouchSendsClick={true}
                    stackItems
                    itemHeightRatio={0.75}
                    // showCursorLine
                    defaultTimeStart={moment().add(-12, 'hour')}
                    defaultTimeEnd={moment().add(12, 'hour')}
                    minZoom={WEEK}
                    maxZoom={THREE_MONTHS}
                    onCanvasDoubleClick={(groupId, time, e) => {
                        const currentGroup = hotelRooms.find(group => group.id === groupId);
                        setIsHotelReserve(true)
                        setCurrentReserve({room: {id: groupId, title: currentGroup?.title}, time, hotel})
                    }}
                >

                    {/*<TimelineHeaders className="sticky">*/}
                    {/*    <DateHeader unit="primaryHeader"/>*/}
                    {/*    <DateHeader/>*/}
                    {/*</TimelineHeaders>*/}
                </Timeline
                >
            </GridItem>
            {isHotelReserve && <ReserveInfo isOpen={isHotelReserve} onClose={onClose}
                                            onAccept={onReserveCreate} currentReserve={currentReserve} isLoading={false}
            />}
        </Grid>
    )
}

