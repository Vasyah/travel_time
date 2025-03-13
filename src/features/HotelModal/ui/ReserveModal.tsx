import React, {FC} from 'react'
import {Modal} from "@/shared/ui/Modal/Modal";
import {CurrentReserveType, Nullable} from "@/shared/api/reserve/reserve";
import {ReserveInfo} from "@/features/ReserveInfo/ui/ReserveInfo";
import {HotelInfo} from "@/features/HotelModal/ui/HotelInfo";

export interface ReserveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve: Nullable<CurrentReserveType>
    isLoading?: boolean;
}


export const HotelModal: FC<ReserveModalProps> = ({
                                                      isOpen = false,
                                                      onAccept,
                                                      onClose,
                                                      currentReserve = null,
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
                <HotelInfo
                    onClose={onClose}
                    currentReserve={currentReserve}
                    onAccept={onAccept}
                    isLoading={isLoading}
                />
            </Modal>
        );
    }
;
