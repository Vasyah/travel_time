"use client";
import React from "react";
import {Text} from "@consta/uikit/Text";
import {useGetAllHotels} from "@/shared/api/hotel/hotel";
import {Calendar} from "@/features/Scheduler/ui/Calendar";

export default function Home() {
    const {isLoading, error, data: hotels} = useGetAllHotels()


    return (
        <div>
            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            {hotels?.slice(0, 2)?.map((hotel) => <Calendar hotel={hotel} key={hotel.id}/>)}
        </div>
    );
}
