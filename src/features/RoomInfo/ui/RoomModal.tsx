import React, { FC } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { CurrentReserveType, Nullable } from '@/shared/api/reserve/reserve'
import { RoomInfo } from '@/features/RoomInfo/ui/RoomInfo'

export interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept: (args?: any) => void
  currentReserve: Nullable<CurrentReserveType>
  isLoading?: boolean
}

export const RoomModal: FC<RoomModalProps> = ({
  isOpen = false,
  onAccept,
  onClose,
  currentReserve,
  isLoading = false,
}: RoomModalProps) => {
  return (
    <Modal
      hasOverlay
      isOpen={isOpen}
      onClickOutside={onClose}
      onEsc={onClose}
      loading={isLoading}
    >
      <RoomInfo
        onClose={onClose}
        currentReserve={currentReserve}
        onAccept={onAccept}
        isLoading={isLoading}
      />
    </Modal>
  )
}
