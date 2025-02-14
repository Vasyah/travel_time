"use client";
import React from "react";
import CustomTimeline from "@/features/Scheduler/ui/Calendar";
import {Text} from "@consta/uikit/Text";
import {Layout} from "@consta/uikit/Layout";
import {HotelReserve} from "@/features/HotelReserve/ui/HotelReserve";
import {SearchFeature} from "@/features/Search/ui/Search";


export default function Home() {
    return (
        <div>
            <Layout>
                <Layout flex={2} style={{margin: '2.5rem 0'}}>
                    <SearchFeature/>
                </Layout>

                <Layout flex={2} direction={'column'} style={{margin: '1.5rem 0'}}>
                    <Text size="2xl" view={"success"}>Сегодня</Text>
                    <Text size="3xl" view={"success"}>Ср, 17 января 2020 г.</Text>
                </Layout>
            </Layout>
            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            <CustomTimeline/>
            <CustomTimeline/>
            <CustomTimeline/>
            <CustomTimeline/>
            <HotelReserve/>

        </div>
    );
}
