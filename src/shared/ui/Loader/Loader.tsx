import React, {ComponentProps, CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {Loader as LoaderConsta} from "@consta/uikit/Loader";
import cx from './style.module.css'


export interface LoaderProps extends ComponentProps<typeof LoaderConsta> {
    style?: CSSProperties;
}


export const Loader: FC<LoaderProps> = ({style, ...props}) => {

    return (
        <LoaderConsta className={cx.loader} type={'dots'} size={'m'} {...props} />
    )
};

export const FullWidthLoader: FC<LoaderProps> = ({style, ...props}) => {

    return (
        <div className={cx.container}><Loader/></div>
    )
};
