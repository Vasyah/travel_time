import {DefaultNavbarRailItem, NavbarRail} from "@consta/header/Navbar";
import {IconHome} from "@consta/icons/IconHome";
import {IconCards} from "@consta/icons/IconCards";
import {IconCalendar} from "@consta/icons/IconCalendar";

const menu: DefaultNavbarRailItem[] = [
    {
        label: 'Главная',
        icon: IconHome,
        status: 'warning',
        active: true,
    },
    {
        label: 'Отели',
        icon: IconCards
        ,
    },
    {
        label: 'Бронирование',
        icon: IconCalendar,
    },

];

const onItemClick = (item: DefaultNavbarRailItem) => alert(item.label);

export const TravelMenu = () => (
    <NavbarRail items={menu} onItemClick={onItemClick}/>
);
