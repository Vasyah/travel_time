import React, {ComponentProps, CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {Loader as LoaderConsta} from "@consta/uikit/Loader";
import cx from './style.module.css'


export interface TravelButtonProps extends ComponentProps<typeof LoaderConsta> {
    style?: CSSProperties;
}


export const Loader: FC<TravelButtonProps> = ({style, ...props}) => {

    return (
        <LoaderConsta className={cx.loader} type={'circle'} size={'m'}/>
    )
};
