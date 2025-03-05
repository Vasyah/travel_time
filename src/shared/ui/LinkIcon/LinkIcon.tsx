import React, {FC, ReactNode} from 'react'
import {createWhatsappLink} from "@/shared/lib/links";


export interface LinkIconProps {
    icon: ReactNode
    link: string
}


export const LinkIcon: FC<LinkIconProps> = ({icon, link}) => {

        return (
            <a target={'_blank'} href={link}>{icon}</a>
        );
    }
;
