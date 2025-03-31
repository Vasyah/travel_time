'use client'
import React, { useEffect, useState } from 'react'
import {
  HotelDTO,
  useDeleteHotel,
  useGetAllHotels,
  useUpdateHotel,
} from '@/shared/api/hotel/hotel'
import { Flex } from 'antd'
import { FullWidthLoader } from '@/shared/ui/Loader/Loader'
import { HotelHeading } from '@/shared/ui/Hotel/HotelHeading'
import style from './page.module.css'
import { HotelModal } from '@/features/HotelModal/ui/HotelModal'
import { Nullable, useDeleteReserve } from '@/shared/api/reserve/reserve'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { useGetRoomsWithReservesByHotel } from '@/shared/api/room/room'
import { useParams } from 'next/navigation'
import { Room } from '@/features/Room/Room'
import { RoomModal } from '@/features/RoomInfo/ui/RoomModal'

export interface PageProps {
  children?: React.ReactNode
  className?: string
}

export default function Rooms({ className }: PageProps) {
  const params = useParams()

  const [isHotelOpen, setIsHotelOpen] = useState(false)
  const [currentHotel, setIsCurrentHotel] = useState<Nullable<HotelDTO>>(null)
  const { data: rooms = [], isFetching: isRoomLoading } =
    useGetRoomsWithReservesByHotel(params?.slug)

  console.log(rooms)
  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel],
      })
    }
  }, [])
  // const isLoading = isHotelDeleting || isFetching || isHotelUpdating

  return (
    <div className={style.container}>
      {/*{isLoading && <FullWidthLoader />}*/}
      <HotelHeading
        // title={hotel}
        hotels={36}
        rooms={154}
        buttonProps={{
          label: 'Добавить номер',
          onClick: () => setIsHotelOpen(true),
        }}
      />
      <Flex wrap gap={'small'}>
        {rooms?.map(room => (
          <Room
            room={room}
            key={room.id}
            // onDelete={deleteHotel}
            onEdit={(hotel: HotelDTO) => {
              setIsCurrentHotel(hotel)
              setIsHotelOpen(true)
            }}
          />
        ))}
      </Flex>

      <RoomModal
        isOpen={isHotelOpen}
        onClose={() => {
          setIsCurrentHotel(null)
          setIsHotelOpen(false)
        }}
        currentReserve={{ hotel: currentHotel }}
      />
    </div>
  )
}
