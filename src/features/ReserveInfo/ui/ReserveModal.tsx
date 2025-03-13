import React, {FC} from 'react'
import {Modal} from "@/shared/ui/Modal/Modal";
import {CurrentReserveType, Nullable} from "@/shared/api/reserve/reserve";
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";

export interface ReserveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve?: Nullable<CurrentReserveType>
    isLoading?: boolean;
}


export const ReserveModal: FC<ReserveModalProps> = ({
                                                        isOpen = false,
                                                        onAccept,
                                                        onClose,
                                                        currentReserve,
                                                        isLoading = false,
                                                    }: ReserveModalProps) => {

        return (
            <Modal
                hasOverlay
                isOpen={isOpen}
                onClickOutside={onClose}
                onEsc={onClose}
                loading={isLoading}
            >
                <ReserveInfo
                    onClose={onClose}
                    currentReserve={currentReserve}
                    onAccept={onAccept}
                    isLoading={isLoading}
                />
            </Modal>
        );
    }
;
