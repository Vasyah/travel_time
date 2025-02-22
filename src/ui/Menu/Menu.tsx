// 'use client'
import {DefaultNavbarRailItem} from "@consta/header/Navbar";
import {IconHome} from "@consta/icons/IconHome";
import {IconCards} from "@consta/icons/IconCards";
import {IconCalendar} from "@consta/icons/IconCalendar";
import {useCallback, useState} from "react";
import {PagesEnum, routes} from "@/app/config/routes";
import {useRouter} from "next/navigation";
import Link from "next/link";

const defaultMenu: DefaultNavbarRailItem[] = [
    {
        label: 'Главная',
        icon: IconHome,
        status: 'warning',
        active: true,
        href: routes[PagesEnum.MAIN],

    },
    {
        label: 'Отели',
        icon: IconCards,
        href: routes[PagesEnum.HOTELS],
    },
    {
        label: 'Бронирование',
        icon: IconCalendar,
        href: routes[PagesEnum.RESERVATION],
    },

];


export const TravelMenu = () => {
        // const router = useRouter()
        // const [menu, setMenu] = useState(defaultMenu)
        // const [activeItem, setActiveItem] = useState<string>(PagesEnum.MAIN)
        // const onItemClick = (item) => {
        //     // const activeItem = changeActive(true, item)
        //     // setActiveItem(activeItem.href)
        //     // console.log(item)
        //     router.push(item.href)
        //
        //
        // };
        // const changeActive = useCallback((active: boolean, item: DefaultNavbarRailItem) => {
        //     return {...item, active}
        // }, [])


        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <Link href={routes[PagesEnum.MAIN]}>Главная</Link>
                <Link href={routes[PagesEnum.HOTELS]}>Отели</Link>
                <Link href={routes[PagesEnum.RESERVATION]}>Бронирование</Link>
            </div>)
        // return (
        //     <Navbar items={defaultMenu} onItemClick={onItemClick} getItemActive={(item) => item.active}/>
        // )
    }
;
