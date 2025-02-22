"use client";
import React, {useEffect, useState} from "react";
import {CustomTimeline} from "@/features/Scheduler/ui/Calendar";
import {Text} from "@consta/uikit/Text";
import {getAllHotels, HotelDTO} from "@/shared/api/hotels/hotels";

export default function Home() {
    // const {loading, error, data} = useQuery(GET_HOTELS);

    const [hotels, setHotels] = useState<HotelDTO[]>([]);

    useEffect(() => {
            getAllHotels().then((hotels) => {
                console.log('Список отелей:', hotels);
                setHotels(hotels)
            });

        }
        , []
    )

    return (
        <div>

            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            {hotels.map((hotel) => <CustomTimeline hotel={hotel} key={hotel.id}/>)}
        </div>
    );
}
