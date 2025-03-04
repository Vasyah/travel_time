"use client";
import React, {Suspense, useEffect, useState} from "react";
import {Text} from "@consta/uikit/Text";
import {
    getFreeRooms,
    getHotelsWithFreeRooms,
    getHotelsWithRoomsAndeServes,
    useGetAllHotels
} from "@/shared/api/hotel/hotel";
import {Calendar} from "@/features/Scheduler/ui/Calendar";
import {Loader} from "@/shared/ui/Loader/Loader";
import cx from './page.module.css'
import {useUnit} from "effector-react/compat";
import {$hotelsFilter} from "@/shared/models/hotels";

export default function Home() {
    const {isPending, error, data: hotels, refetch} = useGetAllHotels()
    const filter = useUnit($hotelsFilter)
    // если добавили фильтр, то загрузить только отели в которых есть свободные места

    useEffect(() => {
        // if (!filter?.start && !filter?.end) return
        //
        // const filteredHotels = getHotelsWithFreeRooms(filter?.start, filter?.end)
        //
        // filteredHotels.then(data => setFilteredHotels(data))
        if (!!filter?.end && !!filter?.start) {
            getHotelsWithFreeRooms(filter?.start, filter?.end)

        }
    }, [filter])

    if (isPending) {
        return <div className={cx.loaderContainer}><Loader/></div>
    }
    return (
        <div>
            <code>{JSON.stringify(filter)}</code>
            <Text size="2xl" weight={'semibold'} view={"success"}
                  style={{marginBottom: '2.25rem'}}>Все
                отели</Text>
            {hotels?.map((hotel) => <Calendar hotel={hotel} key={hotel.id}/>)}
        </div>
    );
}
