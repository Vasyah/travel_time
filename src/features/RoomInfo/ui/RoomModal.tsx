import React, { FC, useCallback } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { CurrentReserveType, Nullable } from '@/shared/api/reserve/reserve'
import { RoomInfo } from '@/features/RoomInfo/ui/RoomInfo'
import {
  Room,
  RoomDTO,
  useCreateRoom,
  useDeleteRoom,
  useUpdateRoom,
} from '@/shared/api/room/room'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { showToast } from '@/shared/ui/Toast/Toast'

export interface RoomModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: (args?: any) => void
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
  const {
    isPending: isRoomCreating,
    mutate: createRoom,
    error: roomError,
  } = useCreateRoom(
    () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotels })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roomsByHotel })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotelById })

      onClose()
      showToast('Номер успешно добавлен')
    },
    e => {
      showToast(`Ошибка при добавлении номера ${e}`, 'error')
    }
  )

  const { isPending: isRoomUpdating, mutateAsync: updateRoom } = useUpdateRoom(
    () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.hotelById,
      })
      onClose()
      showToast('Информация в отели обновлена')
    }
  )

  const { isPending: isRoomDeleting, mutateAsync: deleteRoom } = useDeleteRoom(
    () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.hotelById,
      })
      onClose()
      showToast('Отель удалён')
    }
  )
  const onCreate = useCallback(async (room: Room) => {
    await createRoom(room)
    console.log('Создаю ROOM', room)
  }, [])
  const onEdit = async (room: RoomDTO) => await updateRoom(room)
  const onDelete = async (id: string) => await deleteRoom(id)

  const loading =
    isLoading || isRoomCreating || isRoomUpdating || isRoomDeleting

  const isEdit = !!currentReserve?.room?.id
  console.log({ isEdit, currentReserve })
  return (
    <Modal hasOverlay isOpen={isOpen} onEsc={onClose} loading={loading}>
      <RoomInfo
        onClose={onClose}
        currentReserve={currentReserve}
        onAccept={isEdit ? onEdit : onCreate}
        onDelete={onDelete}
        isLoading={loading}
        isEdit={isEdit}
      />
    </Modal>
  )
}
