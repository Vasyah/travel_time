import React, {ComponentProps, CSSProperties, FC, useEffect} from 'react'
import {Modal as ModalConsta} from "@consta/uikit/Modal";
import cx from './style.module.css'
import {Loader} from "@/shared/ui/Loader/Loader";

export interface ModalProps extends ComponentProps<typeof ModalConsta> {
    style?: CSSProperties;
    loading?: boolean;
}


export const Modal: FC<ModalProps> = ({children, loading = false, ...props}) => {
        const {isOpen} = props
        useEffect(() => {
            if (isOpen) {
                console.log(isOpen)
                document.body.style.overflow = 'hidden'
            }

            return () => {
                document.body.style.overflow = ''
            }
        }, [isOpen]);
        return (
            <ModalConsta  {...props} rootClassName={cx.sidebarOverlay}
                          className={`${cx.modal} ${loading ? cx.modalLoading : ''}`}>
                {children}
                {loading && <div className={cx.loading}><Loader/></div>}
            </ModalConsta>
        );
    }
;
