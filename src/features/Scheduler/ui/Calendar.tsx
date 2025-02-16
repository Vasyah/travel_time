import React, {useState} from "react";
import moment from "moment";
import Timeline, {Id} from "react-calendar-timeline";
import {generateFakeData} from "../lib/generate-fake-data";
import 'react-calendar-timeline/style.css'
import './calendar.css'
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from "next/image";
import {Text} from "@consta/uikit/Text";
import hotelImage from '../hotel.svg';
import star from '../star.svg';
import cx from './style.module.css'
import {ReserveModal} from "@/features/ReserveModal/ui/ReserveModal";

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


export interface Hotel {
    title: string,
    id: string
}

export type CurrentReserveType = { room: { id: Id, title: string }, time: number, hotel: Hotel } | null;

export interface CalendarProps {
    hotel: { title: string, id: string };
}

export const CustomTimeline = ({hotel}: CalendarProps) => {
    const {groups: fakeGroups, items} = generateFakeData();
    // convert every 2 groups out of 3 to nodes, leaving the first as the root
    const newFakeGroups = fakeGroups.map((group) => {
        const isRoot = (parseInt(group.id) - 1) % 3 === 0;
        const parent = isRoot
            ? null
            : Math.floor((parseInt(group.id) - 1) / 3) * 3 + 1;

        return Object.assign({}, group, {
            root: isRoot,
            parent: parent,
        });
    });
    const [groups, setGroups] = useState(newFakeGroups);
    const [openGroups, setOpenGroups] = useState({});
    const defaultTimeStart = moment().startOf("day").toDate();
    const defaultTimeEnd = moment().startOf("day").add(2, "month").toDate();
    const [isHotelReserve, setIsHotelReserve] = useState(false);
    const [currentReserve, setCurrentReserve] = useState<CurrentReserveType>(null);

    const toggleGroup = (id: string) => {
        setOpenGroups({
            ...openGroups,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            [id]: !openGroups[id],
        });

    };


    const getMark = (group: { id: string, title: string, rightTitle: string, bgColor: string } & {
        root: boolean
        parent: number | null
    }) => {

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return openGroups[parseInt(group?.id)] ? "[-]" : "[+]"

    }
// hide (filter) the groups that are closed, for the rest, patch their "title" and add some callbacks or padding
    const newGroups = groups
        // .filter((g) => g.root || openGroups[g?.parent ?? '0')
        .map((group) => {
            return Object.assign({}, group, {
                title: group.root ? (
                    <div
                        // onClick={() => toggleGroup(parseInt(group.id))}
                        style={{cursor: "pointer"}}
                    >
                        {group.title}
                    </div>
                ) : (
                    <div style={{paddingLeft: 20}}>{group.title}</div>
                ),
            });
        });

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
                    groups={newGroups}
                    items={items}
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
                    defaultTimeStart={defaultTimeStart.getTime()}
                    defaultTimeEnd={defaultTimeEnd.getTime()}
                    minZoom={WEEK}
                    maxZoom={THREE_MONTHS}
                    onCanvasDoubleClick={(groupId, time, e) => {
                        const currentGroup = groups.find(group => group.id === groupId);
                        setIsHotelReserve(true)
                        setCurrentReserve({room: {id: groupId, title: currentGroup?.title}, time, hotel})
                    }}
                >

                    {/*<TimelineHeaders className="sticky">*/}
                    {/*    <DateHeader unit="primaryHeader"/>*/}
                    {/*    <DateHeader/>*/}
                    {/*</TimelineHeaders>*/}
                </Timeline
                ></GridItem>
            {isHotelReserve && <ReserveModal isOpen={isHotelReserve} onClose={onClose}
                                             onAccept={onAccept} currentReserve={currentReserve}
            />}
        </Grid>
    )
}

