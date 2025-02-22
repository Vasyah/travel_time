import React, {ComponentProps, CSSProperties, FC, useCallback, useEffect, useState} from 'react'
import {Button} from "@consta/uikit/Button";


export interface TravelButtonProps extends ComponentProps<typeof Button> {
    style?: CSSProperties;
}


export const TravelButton: FC<TravelButtonProps> = ({style, ...props}) => {

        return (
            <Button style={{...style, minWidth: '166px'}} {...props} />
        );
    }
;
