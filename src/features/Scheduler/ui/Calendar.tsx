import React, {useEffect, useState} from "react";
import moment from "moment";
import {Id} from "react-calendar-timeline";
import 'react-calendar-timeline/style.css'
import './calendar.css'
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from "next/image";
import {Text} from "@consta/uikit/Text";
import hotelImage from '../hotel.svg';
import star from '../star.svg';
import cx from './style.module.css'
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";
import {fetchHotelWithRoomsAndReserves, getAllHotels, Hotel} from "@/shared/api/hotels/hotels";

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


export type CurrentReserveType = { room: { id: Id, title: string }, time: number, hotel: Hotel } | null;

export interface CalendarProps {
    hotel: Hotel;
}

export const CustomTimeline = ({hotel,}: CalendarProps) => {

    const [hotelWithRooms, setHotelWithRooms] = useState<Hotel | null>()

    useEffect(() => {
            fetchHotelWithRoomsAndReserves(hotel.id).then((hotel) => {
                if (hotel) {
                    setHotelWithRooms(hotel)
                    console.log('Отель с номерами и бронированиями:', hotel);
                } else {
                    console.log('Отель не найден.');
                }
            });
        }
        // Пример использования
        , []
    )

    const [isHotelReserve, setIsHotelReserve] = useState(false);
    const [currentReserve, setCurrentReserve] = useState<CurrentReserveType>(null);


    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const THREE_MONTHS = 24 * 60 * 60 * 1000 * 30 * 12;

    const onAccept = (currentForm?: any) => {
        console.log(currentForm, currentReserve)
        setCurrentReserve(null)
        setIsHotelReserve(false)
    };
    const onClose = () => {
        setCurrentReserve(null)
        setIsHotelReserve(false)
    };

    // обработать ситуацию, когда отель ещё пустой
    if (!hotel) {
        return <div>Пустой...перезаряжаюсь</div>
    }

    // const hotelRooms = hotelWithRooms?.rooms.map(({id, title}) => ({
    //     id, title
    // })) ?? [];
    //
    // let hotelReserves: {
    //     id: string
    //     group: string
    //     end: number
    //     start: number
    //     title: string | undefined
    // }[] = []
    //
    // hotelWithRooms?.rooms.forEach(({reserves}) => {
    //     const reservesTmp = reserves.map(({id, room_id, end, start, title}) => ({
    //         id,
    //         group: room_id,
    //         end: end + Math.floor(Math.random() * 1000000000),
    //         start,
    //         title
    //     }));
    //
    //     hotelReserves = hotelReserves.concat(reservesTmp)
    // })
    //
    // console.log({hotelRooms, hotelReserves});
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
                {/*<Timeline*/}
                {/*    className={'travel-timeline'}*/}
                {/*    groups={hotelRooms}*/}
                {/*    items={hotelReserves}*/}
                {/*    keys={keys}*/}
                {/*    sidebarWidth={280}*/}
                {/*    canMove*/}
                {/*    canResize="both"*/}
                {/*    canSelect*/}
                {/*    onItemSelect={(itemId, e, time) => console.log(itemId, e, time)}*/}
                {/*    // itemsSorted*/}
                {/*    itemTouchSendsClick={true}*/}
                {/*    stackItems*/}
                {/*    itemHeightRatio={0.75}*/}
                {/*    // showCursorLine*/}
                {/*    defaultTimeStart={defaultTimeStart.getTime()}*/}
                {/*    defaultTimeEnd={defaultTimeEnd.getTime()}*/}
                {/*    minZoom={WEEK}*/}
                {/*    maxZoom={THREE_MONTHS}*/}
                {/*    onCanvasDoubleClick={(groupId, time, e) => {*/}
                {/*        const currentGroup = groups.find(group => group.id === groupId);*/}
                {/*        setIsHotelReserve(true)*/}
                {/*        setCurrentReserve({room: {id: groupId, title: currentGroup?.title}, time, hotel})*/}
                {/*    }}*/}
                {/*>*/}

                {/*    /!*<TimelineHeaders className="sticky">*!/*/}
                {/*    /!*    <DateHeader unit="primaryHeader"/>*!/*/}
                {/*    /!*    <DateHeader/>*!/*/}
                {/*    /!*</TimelineHeaders>*!/*/}
                {/*</Timeline*/}
                ></GridItem>
            {isHotelReserve && <ReserveInfo isOpen={isHotelReserve} onClose={onClose}
                                            onAccept={onAccept} currentReserve={currentReserve}
            />}
        </Grid>
    )
}

