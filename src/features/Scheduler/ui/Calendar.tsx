import React, {useState} from "react";
import 'react-calendar-timeline/style.css'
import './calendar.css'
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from "next/image";
import {Text} from "@consta/uikit/Text";
import hotelImage from '../hotel.svg';
import star from '../star.svg';
import cx from './style.module.css'
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";
import {HotelDTO} from "@/shared/api/hotel/hotel";
import {
    CurrentReserveType,
    Nullable,
    Reserve,
    ReserveDTO,
    useCreateReserve,
    useUpdateReserve
} from "@/shared/api/reserve/reserve";
import {useGetRoomsWithReservesByHotel} from "@/shared/api/room/room";
import {Timeline} from "react-calendar-timeline";
import {useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS} from "@/shared/config/reactQuery";
import {Tooltip} from "antd";
import {getDateFromUnix} from "@/shared/lib/date";
import {FullWidthLoader} from "@/shared/ui/Loader/Loader";

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

export const Calendar = ({hotel}: CalendarProps) => {
    const {data, isFetching: isRoomLoading} = useGetRoomsWithReservesByHotel(hotel.id)
    const [currentReserve, setCurrentReserve] = useState<Nullable<CurrentReserveType>>(null);

    const queryClient = useQueryClient();

    const {
        isPending: isReserveLoading,
        mutateAsync: createReserve,
        error: reserveError,
    } = useCreateReserve(() => {
        queryClient.invalidateQueries({queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel.id]})
        setCurrentReserve(null)
    })

    const {
        isPending: isReserveUpdating,
        mutateAsync: updateReserve,
    } = useUpdateReserve(() => {
        queryClient.invalidateQueries({queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel.id]})
        setCurrentReserve(null)
    })

    const WEEK = 7 * 24 * 60 * 60 * 1000;
    const THREE_MONTHS = 24 * 60 * 60 * 1000 * 30 * 12;

    const onReserveAccept = async (reserve: Reserve) => {

        const isEdit = currentReserve?.reserve

        if (isEdit) {
            console.log('Пытаюсь обновить запись')
            await updateReserve(reserve as ReserveDTO)

            return
        }

        await createReserve(reserve)
    }
    const onClose = () => {
        setCurrentReserve(null)
    };

    const hotelRooms = data?.map(({reserves, id, title, ...room}) => ({
        id, title: `${title}`, ...room
    })) ?? [];
    //
    let hotelReserves: Array<ReserveDTO & { group: string }> = []

    data?.forEach(({id: room_id, reserves}) => {
        const reservesTmp = reserves.map(({end, start, ...reserve}) => ({
            group: room_id,
            end: getDateFromUnix(end),
            start: getDateFromUnix(start),
            ...reserve
        }));

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        hotelReserves = hotelReserves.concat(reservesTmp)
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const itemRenderer = ({item, itemContext, getItemProps, getResizeProps}) => {
        const {left: leftResizeProps, right: rightResizeProps} = getResizeProps()

        const onItemClick = (reserve: ReserveDTO, hotel: HotelDTO) => {
            const room = hotelRooms.find(room => room.id === reserve?.room_id);

            if (room) {
                setCurrentReserve({room, reserve, hotel})
            }
        }

        return (
            <div {...getItemProps(item.itemProps)} onDoubleClick={() => {
                onItemClick(item, hotel)
                console.log('Ваще-та я кликнул сюда', item)
            }}>
                {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}
                <Tooltip
                    title={<Grid><p>Гость: {item.guest}</p>
                        <p>Номер: {item?.phone}</p>
                        <p>Предоплата: {item?.prepayment}</p>
                        <p>:{item.price}</p>
                    </Grid>}>
                    <div
                        className="rct-item-content"
                        style={{maxHeight: `${itemContext.dimensions.height}`}}

                    >
                        {item?.guest} {item?.phone}
                    </div>
                </Tooltip>

                {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
            </div>
        )
    }

    const isLoading = isRoomLoading
    const reserveLoading = isReserveLoading || isReserveUpdating
    return (
        <Grid cols={12} className={cx.container}>
            {isLoading && <FullWidthLoader/>}
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
                    // onItemSelect={(itemId, e, time) => console.log(itemId, e, time)}
                    // itemsSorted
                    itemTouchSendsClick={true}
                    stackItems
                    itemHeightRatio={0.75}
                    // defaultTimeStart={moment().unix()}
                    // defaultTimeEnd={moment().add(2, 'month').unix()}
                    minZoom={WEEK}
                    maxZoom={THREE_MONTHS}
                    onCanvasDoubleClick={(groupId, time, e) => {
                        const room = hotelRooms?.find(group => group.id === groupId);
                        // setIsHotelReserve(true)
                        console.log(room, groupId, time, e);
                        if (room) {
                            setCurrentReserve({room, hotel})
                        }
                    }}
                    itemRenderer={itemRenderer}
                >

                    {/*<TimelineHeaders className="sticky">*/}
                    {/*    <DateHeader unit="primaryHeader"/>*/}
                    {/*    <DateHeader/>*/}
                    {/*</TimelineHeaders>*/}
                </Timeline
                >
            </GridItem>
            {!!currentReserve && <ReserveInfo isOpen={!!currentReserve} onClose={onClose}
                                              onAccept={onReserveAccept} currentReserve={currentReserve}
                                              isLoading={reserveLoading}
            />}
        </Grid>
    )
}

