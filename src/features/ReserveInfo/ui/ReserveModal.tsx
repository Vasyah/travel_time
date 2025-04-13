import React, { FC } from "react";
import { Modal } from "@/shared/ui/Modal/Modal";
import { CurrentReserveType, Nullable } from "@/shared/api/reserve/reserve";
import { ReserveInfo } from "@/features/ReserveInfo/ui/ReserveInfo";

export interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (args?: any) => void;
  onDelete?: (id: string) => void;
  currentReserve?: Nullable<CurrentReserveType>;
  isLoading?: boolean;
}

export const ReserveModal: FC<ReserveModalProps> = ({
  isOpen = false,
  onAccept,
  onClose,
  onDelete,
  currentReserve,
  isLoading = false,
}: ReserveModalProps) => {
  return (
    <Modal
      hasOverlay
      isOpen={isOpen}
      // onClickOutside={onClose}
      onEsc={onClose}
      loading={isLoading}
      onClose={onClose}
    >
      <ReserveInfo
        isEdit={!!currentReserve?.reserve?.id}
        onClose={onClose}
        currentReserve={currentReserve}
        onAccept={onAccept}
        onDelete={onDelete}
        isLoading={isLoading}
      />
    </Modal>
  );
};
