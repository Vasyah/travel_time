import React from 'react';
import {cnMixSpace} from '@consta/uikit/MixSpace';
import {User} from '@consta/uikit/User';
import logo from '../../../public/main/logo.svg';
import Image from 'next/image'
import cx from './styles.module.css';
import {Layout} from '@consta/header/Layout';

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
            rowTop={{
                left: <Image src={logo.src} alt={'Лого'} width={130} height={65}/>,
                center: null,
                right: <RowCenterRight/>,
            }}
            placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}
        />
    );
};
