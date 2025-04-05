'use client'
import React, { useEffect, useState } from 'react'
import {
  HotelDTO,
  useDeleteHotel,
  useGetAllHotels,
  useHotelById,
  useUpdateHotel,
} from '@/shared/api/hotel/hotel'
import { Flex } from 'antd'
import { FullWidthLoader } from '@/shared/ui/Loader/Loader'
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle'
import style from './page.module.css'
import { Nullable, useDeleteReserve } from '@/shared/api/reserve/reserve'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { RoomDTO, useGetRoomsWithReservesByHotel } from '@/shared/api/room/room'
import { useParams } from 'next/navigation'
import { Room } from '@/features/Room/Room'
import { RoomModal } from '@/features/RoomInfo/ui/RoomModal'
import { ResponsesNothingFound } from '@consta/uikit/ResponsesNothingFound'
import { TravelButton } from '@/shared/ui/Button/Button'

export interface PageProps {
  children?: React.ReactNode
  className?: string
}

export default function Rooms({ className }: PageProps) {
  const params = useParams()

  const [isRoomOpen, setIsRoomOpen] = useState(false)
  const [currentHotel, setIsCurrentHotel] = useState<Nullable<HotelDTO>>(null)
  const [currentRoom, setIsCurrentRoom] = useState<Nullable<RoomDTO>>(null)

  const { data: hotel, isFetching } = useHotelById(params?.slug as string)

  useEffect(() => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel],
      })
    }
  }, [])

  if (isFetching) {
    return <FullWidthLoader />
  }

  const rooms: RoomDTO[] = hotel?.rooms ?? []

  if (!rooms?.length) {
    return (
      <div>
        <PageTitle title={'Все номера'} rooms={0} />
        <ResponsesNothingFound
          title={'Номер пока не добавлен'}
          description={'В настоящий момент не добавлено ни одного номера'}
          actions={
            <TravelButton
              label={'Добавить номер'}
              onClick={() => setIsRoomOpen(true)}
            />
          }
        />
        <RoomModal
          isOpen={isRoomOpen}
          onClose={() => {
            setIsCurrentHotel(null)
            setIsRoomOpen(false)
          }}
          currentReserve={{ hotel: hotel }}
        />
      </div>
    )
  }

  return (
    <div className={style.container}>
      {/*{isLoading && <FullWidthLoader />}*/}
      <PageTitle
        title={hotel?.title}
        rooms={hotel?.rooms?.length}
        buttonProps={{
          label: 'Добавить номер',
          onClick: () => setIsRoomOpen(true),
        }}
      />
      <Flex wrap gap={'small'}>
        {rooms?.map(room => (
          <Room
            room={room}
            key={room.id}
            onEdit={room => {
              setIsCurrentRoom(room)
              setIsRoomOpen(true)
            }}
          />
        ))}
      </Flex>

      <RoomModal
        isOpen={isRoomOpen}
        onClose={() => {
          setIsCurrentRoom(null)
          setIsRoomOpen(false)
        }}
        currentReserve={{ hotel: hotel, room: currentRoom }}
      />
    </div>
  )
}
