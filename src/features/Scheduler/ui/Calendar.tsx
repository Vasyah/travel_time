import React, {Component} from "react";
import moment from "moment";
import Timeline, {DateHeader, SidebarHeader, TimelineHeaders} from "react-calendar-timeline";
import {generateFakeData} from "../lib/generate-fake-data";
import 'react-calendar-timeline/style.css'
import './calendar.css'
import {Grid, GridItem} from "@consta/uikit/Grid";
import Image from "next/image";
import {Text} from "@consta/uikit/Text";
import hotel from '../hotel.svg';
import star from '../star.svg';
import cx from './style.module.css'

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

export default class CustomTimeline extends Component {
    constructor(props) {
        super(props);

        const {groups, items} = generateFakeData();
        const defaultTimeStart = moment().startOf("day").toDate();
        const defaultTimeEnd = moment().startOf("day").add(2, "month").toDate();

        // convert every 2 groups out of 3 to nodes, leaving the first as the root
        const newGroups = groups.map((group) => {
            const isRoot = (parseInt(group.id) - 1) % 3 === 0;
            const parent = isRoot
                ? null
                : Math.floor((parseInt(group.id) - 1) / 3) * 3 + 1;

            return Object.assign({}, group, {
                root: isRoot,
                parent: parent,
            });
        });

        this.state = {
            groups: newGroups,
            items,
            defaultTimeStart,
            defaultTimeEnd,
            openGroups: {},
        };
    }

    toggleGroup = (id) => {
        const {openGroups} = this.state;
        this.setState({
            openGroups: {
                ...openGroups,
                [id]: !openGroups[id],
            },
        });
    };

    render() {
        const {groups, items, defaultTimeStart, defaultTimeEnd, openGroups} =
            this.state;

        // hide (filter) the groups that are closed, for the rest, patch their "title" and add some callbacks or padding
        const newGroups = groups
            .filter((g) => g.root || openGroups[g.parent])
            .map((group) => {
                return Object.assign({}, group, {
                    title: group.root ? (
                        <div
                            onClick={() => this.toggleGroup(parseInt(group.id))}
                            style={{cursor: "pointer"}}
                        >
                            {openGroups[parseInt(group.id)] ? "[-]" : "[+]"} {group.title}
                        </div>
                    ) : (
                        <div style={{paddingLeft: 20}}>{group.title}</div>
                    ),
                });
            });

        const WEEK = 7 * 24 * 60 * 60 * 1000;
        const THREE_MONTHS = 24 * 60 * 60 * 1000 * 30 * 12;
        return (
            <Grid cols={12} className={cx.container}>
                <GridItem col={2}>
                    <div className={cx.hotelInfo}>
                        {/*<Grid cols={4} yAlign={'bottom'}>*/}
                        {/*    <GridItem col={2}>*/}
                        <Image className={cx.hotelIcon} src={hotel.src} alt={"Изображение отеля"} width={90}
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
                        <div><Text className={cx.title} transform={"uppercase"} weight={"medium"}>Название отеля</Text>
                        </div>
                        {/*</GridItem>*/}
                        {/*</Grid>*/}
                    </div>
                </GridItem>
                <GridItem col={10}>
                    <Timeline
                        className={'travel-timeline'}
                        groups={groups}
                        items={items}
                        keys={keys}
                        sidebarWidth={280}
                        canMove
                        canResize="both"
                        canSelect
                        itemsSorted
                        itemTouchSendsClick={false}
                        stackItems
                        itemHeightRatio={0.75}
                        showCursorLine
                        defaultTimeStart={defaultTimeStart}
                        defaultTimeEnd={defaultTimeEnd}
                        minZoom={WEEK}
                        maxZoom={THREE_MONTHS}
                    >
                        {/*<TimelineHeaders className="sticky">*/}
                        {/*    <DateHeader unit="primaryHeader"/>*/}
                        {/*    <DateHeader/>*/}
                        {/*</TimelineHeaders>*/}
                    </Timeline
                    ></GridItem>
            </Grid>
        );
    }
}
