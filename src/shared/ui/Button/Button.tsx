import React, {CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {Button} from "@consta/uikit/Button";
import {
    ButtonProps
} from "@consta/uikit/__internal__/src/components/EventInterceptor/propsHandlers/useButtonEventHandler";


export interface TravelButtonProps extends ButtonProps {
    style?: CSSProperties;
}


export const TravelButton: FC<TravelButtonProps> = ({style, ...props}) => {

        return (
            <Button style={{...style, minWidth: '166px'}} {...props} />
        );
    }
;
