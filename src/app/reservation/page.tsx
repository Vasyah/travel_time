"use client";
import React, {useEffect} from "react";
import {Text} from "@consta/uikit/Text";
import {
    getHotelsWithFreeRooms,
    useGetAllHotels
} from "@/shared/api/hotel/hotel";
import {Calendar} from "@/features/Calendar/ui/Calendar";
import {Loader} from "@/shared/ui/Loader/Loader";
import cx from './page.module.css'
import {useUnit} from "effector-react/compat";
import {$hotelsFilter} from "@/shared/models/hotels";
import 'react-calendar-timeline/style.css'
import './calendar.css'

export default function Home() {
    const {isLoading, error, data: hotels, refetch} = useGetAllHotels()
    // const filter = useUnit($hotelsFilter)
    // если добавили фильтр, то загрузить только отели в которых есть свободные места

    // useEffect(() => {
    //     // if (!filter?.start && !filter?.end) returnp
    //     //
    //     // const filteredHotels = getHotelsWithFreeRooms(filter?.start, filter?.end)
    //     //
    //     // filteredHotels.then(data => setFilteredHotels(data))
    //     if (!!filter?.end && !!filter?.start) {
    //         getHotelsWithFreeRooms(filter?.start, filter?.end)
    //
    //     }
    // }, [filter])

    if (isLoading) {
        return <div className={cx.loaderContainer}><Loader/></div>
    }

    return (
        <div>
            <Text size="2xl" weight={'semibold'} view={"success"}
                  style={{marginBottom: '2.25rem'}}>Все
                отели</Text>
            {hotels?.map((hotel) => <Calendar hotel={hotel} key={hotel.id}/>)}
        </div>
    );
}
