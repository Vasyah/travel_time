import React, {ComponentProps, CSSProperties, FC, useEffect} from 'react'
import {Modal as ModalConsta} from "@consta/uikit/Modal";
import st from './style.module.css'
import {Loader} from "@/shared/ui/Loader/Loader";
import cn from 'classnames'

export interface ModalProps extends ComponentProps<typeof ModalConsta> {
    style?: CSSProperties;
    loading?: boolean;
}


export const Modal: FC<ModalProps> = ({children, loading = false, ...props}) => {
        const {isOpen} = props

        useEffect(() => {
            if (isOpen) {
                document.body.style.overflow = 'hidden'
            }

            return () => {
                document.body.style.overflow = ''
            }
        }, [isOpen]);

        return (
            <ModalConsta  {...props} rootClassName={cn(st.sidebarOverlay, {[st.rootLoading]: loading})}
                          className={cn(st.modal, {[st.modalLoading]: loading, [st.opened]: isOpen})}>
                {loading &&
                    <div className={st.loading}>
                        <Loader/>
                    </div>}
                {children}
            </ModalConsta>
        );
    }
;
