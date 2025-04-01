import React, { FC } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { CurrentReserveType, Nullable } from '@/shared/api/reserve/reserve'
import { HotelInfo } from '@/features/HotelModal/ui/HotelInfo'
import {
  Hotel,
  HotelDTO,
  useCreateHotel,
  useDeleteHotel,
  useUpdateHotel,
} from '@/shared/api/hotel/hotel'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { showToast } from '@/shared/ui/Toast/Toast'

export interface ReserveModalProps {
  isOpen: boolean
  onClose: () => void
  onAccept?: (hotel?: Hotel) => void
  currentReserve: Nullable<CurrentReserveType>
  isLoading?: boolean
}

export const HotelModal: FC<ReserveModalProps> = ({
  isOpen = false,
  onAccept,
  onClose,
  currentReserve = null,
  isLoading = false,
}: ReserveModalProps) => {
  const {
    isError: isHotelError,
    isPending: isHotelLoading,
    mutateAsync: createHotel,
  } = useCreateHotel(
    () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotels })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotelsForRoom })
      onClose()

      showToast('Отель добавлен')
    },
    e => {
      showToast(`Ошибка при добавлении номера ${e}`, 'error')
    }
  )
  const { isPending: isHotelUpdating, mutateAsync: updateHotel } =
    useUpdateHotel(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.hotels],
      })
      onClose()
      showToast('Информация в отели обновлена')
    })

  const { isPending: isHotelDeleting, mutateAsync: deleteHotel } =
    useDeleteHotel(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.hotels],
      })
      onClose()
      showToast('Отель удалён')
    })

  const onCreate = async (hotel: Hotel) => await createHotel(hotel)
  const onEdit = async (hotel: HotelDTO) => await updateHotel(hotel)
  const onDelete = async (id: string) => await deleteHotel(id)

  const isEdit = !!currentReserve?.hotel?.id

  return (
    <Modal
      hasOverlay
      isOpen={isOpen}
      onEsc={onClose}
      loading={
        isLoading || isHotelLoading || isHotelUpdating || isHotelDeleting
      }
    >
      <HotelInfo
        onClose={onClose}
        currentReserve={currentReserve}
        isEdit={isEdit}
        onAccept={isEdit ? onEdit : onCreate}
        onDelete={onDelete}
        isLoading={
          isLoading || isHotelLoading || isHotelUpdating || isHotelDeleting
        }
      />
    </Modal>
  )
}
