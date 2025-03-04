import React from 'react';
import {TextField} from '@consta/uikit/TextField';
import {IconSearchStroked} from '@consta/icons/IconSearchStroked';
import {IconEye} from '@consta/icons/IconEye';
import {IconTrash} from '@consta/icons/IconTrash';
import {IconDiamond} from '@consta/icons/IconDiamond';
import {cnMixSpace} from '@consta/uikit/MixSpace';
import {User} from '@consta/uikit/User';
import {Layout} from '@consta/header/Layout';
import {Notifications, NotificationsListDefaultItem} from '@consta/header/Notifications';
import {TileMenu, TileMenuListDefaultItem} from '@consta/header/TileMenu';
import logo from '../../app/logo.svg';
import Image from 'next/image'
import cx from './styles.module.css';

const emptyFunction = () => {
};

const tiles: TileMenuListDefaultItem[] = [
    {
        label: 'Портал',
        description: 'Сводная информация обо мне и подразделении, новости компании',
        image: 'https://avatars.githubusercontent.com/u/13190808?v=4',
    },
];

const notifications: NotificationsListDefaultItem[] = [
    {
        label: 'Иванов Иван Иванович',
        description: 'Добавил файлы в проект, план/факт по расчету предварительные',
        image: 'https://avatars.githubusercontent.com/u/13190808?v=4',
        date: new Date(2021, 10, 12, 13, 57, 0),
        read: false,
        badges: [
            {
                label: 'отчеты 1',
                status: 'normal',
            },
            {
                label: 'файлы 2',
                status: 'warning',
            },
            {
                label: 'система 3',
                status: 'success',
            },
            {
                label: 'отчеты 4',
                status: 'normal',
            },
            {
                label: 'файлы 5',
                status: 'warning',
            },
            {
                label: 'система 6',
                status: 'success',
            },
        ],
        onClick: emptyFunction,
        actions: [
            {
                label: 'Удалить',
                onClick: emptyFunction,
                icon: IconTrash,
            },
            {
                label: 'Отметить как прочитанное',
                onClick: emptyFunction,
                icon: IconEye,
            },
        ],
        view: 'user',
        group: 'd',
    },
];

const RowCenterRight = () => (
    <div>
        {/*<Notifications items={notifications}/>*/}
        {/*<TileMenu items={tiles}/>*/}
        <User
            className={cnMixSpace({mL: 'xs'})}
            avatarUrl="https://avatars.githubusercontent.com/u/13190808?v=4"
            name="Имя Фамилия"
            info="Доп. информация"
        />
    </div>
);

export const LayoutExampleBig = () => {
    return (
        <Layout
            className={cx.header}

            //   rowTop={{
            //     left: (
            //       <div >
            //         {/* <Logo /> */}
            //       </div>
            //     ),
            //     center: <RowTopCenter />,
            //     right: <RowTopRight />,
            //   }}
            rowCenter={{
                left: <Image src={logo.src} alt={'Лого'} width={130} height={65}/>,
                // center: <TextField rightSide={IconSearchStroked} placeholder='Я чёто там ищу'/>,
                right: <RowCenterRight/>,
            }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            //   rowBottom={{
            //     left: (
            //       <Breadcrumbs
            //         onlyIconRoot
            //         items={breadcrumbs}
            //       />
            //     ),
            //     center: undefined,
            //     right: undefined,
            //   }}
        />
    );
};
