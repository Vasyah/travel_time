import React, {FC, ReactNode} from 'react'
import cx from "./style.module.css";
import {Text, TextProps} from "@consta/uikit/Text";

export interface FormTitleProps extends TextProps {
    children: ReactNode;
}


export const FormTitle: FC<FormTitleProps> = ({children, ...rest}: FormTitleProps) => {
    return (
        <Text
            as="p"
            size="2xl"
            view="primary"
            weight="semibold"
            className={cx.title}
            {...rest}
        >
            {children}
        </Text>
    )
}
