'use client'
import React, { useCallback, useMemo, useState } from 'react'
import { Text } from '@consta/uikit/Text'
import { nanoid } from 'nanoid'
import { Card } from '@consta/uikit/Card'
import Image from 'next/image'
import {
  Hotel,
  useCreateHotel,
  useGetAllCounts,
} from '@/shared/api/hotel/hotel'
import building from '../../public/main/building.svg'
import bed from '../../public/main/bed.svg'
import key from '../../public/main/key.svg'
import { Button } from '@consta/uikit/Button'
import { ToastContainer } from 'react-toastify'
import cx from './page.module.css'
import { Room, useCreateRoom } from '@/shared/api/room/room'
import { Reserve, useCreateReserve } from '@/shared/api/reserve/reserve'
import { showToast } from '@/shared/ui/Toast/Toast'
import { FullWidthLoader } from '@/shared/ui/Loader/Loader'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { Flex } from 'antd'
import { RoomModal } from '@/features/RoomInfo/ui/RoomModal'
import { ReserveModal } from '@/features/ReserveInfo/ui/ReserveModal'
import { HotelModal } from '@/features/HotelModal/ui/ReserveModal'

export default function Main() {
  const [isHotelOpen, setIsHotelOpen] = useState<boolean>(false)
  const [isRoomOpen, setIsRoomOpen] = useState<boolean>(false)
  const [isReserveOpen, setIsReserveOpen] = useState<boolean>(false)
  const { data: countsData, isFetching: isCountsLoading } = useGetAllCounts()

  const {
    isError: isHotelError,
    isPending: isHotelLoading,
    mutate: createHotel,
  } = useCreateHotel(
    () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotels })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotelsForRoom })
      setIsHotelOpen(false)
      showToast('Отель добавлен')
    },
    e => {
      showToast(`Ошибка при добавлении номера ${e}`, 'error')
    }
  )

  const {
    isPending: isRoomLoading,
    mutate: createRoom,
    error: roomError,
  } = useCreateRoom(
    () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotels })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roomsByHotel })
      setIsRoomOpen(false)
      showToast('Номер успешно добавлен')
    },
    e => {
      showToast(`Ошибка при добавлении номера ${e}`, 'error')
    }
  )

  const {
    isPending: isReserveLoading,
    mutate: createReserve,
    error: reserveError,
  } = useCreateReserve(
    () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.hotels })
      setIsReserveOpen(false)
      showToast('Бронь успешно добавлена')
    },
    e => {
      showToast(`Ошибка при добавлении брони ${e}`, 'error')
    }
  )

  const cards = useMemo(
    () => [
      {
        id: nanoid(),
        title: 'Отелей всего в базе',
        btn: { onClick: () => setIsHotelOpen(true), title: 'Добавить отель' },
        count: countsData?.[0]?.hotel_count ?? 0,
        image: <Image src={building.src} alt={''} width={115} height={140} />,
      },
      {
        id: nanoid(),
        title: 'Номеров всего в базе',
        btn: { onClick: () => setIsRoomOpen(true), title: 'Добавить номер' },
        count: countsData?.[0]?.room_count ?? 0,
        image: <Image src={bed.src} alt={''} width={115} height={140} />,
      },
      {
        id: nanoid(),
        title: 'Номеров забронировано',
        btn: { onClick: () => setIsReserveOpen(true), title: 'Добавить бронь' },
        count: countsData?.[0]?.reserve_count ?? 0,
        image: <Image src={key.src} alt={''} width={115} height={140} />,
      },
    ],
    [countsData, isCountsLoading]
  )

  const onHotelCreate = useCallback(async (hotel: Hotel) => {
    createHotel(hotel)
  }, [])

  const onRoomCreate = useCallback((room: Room) => {
    createRoom(room)
    console.log('Создаю ROOM', room)
  }, [])

  const onReserveCreate = useCallback((reserve: Reserve) => {
    console.log('создаю Reserve')
    createReserve(reserve)
  }, [])

  console.log({
    isHotelLoading,
    isRoomLoading,
    isReserveLoading,
    isCountsLoading,
  })
  const isLoading =
    isHotelLoading || isRoomLoading || isReserveLoading || isCountsLoading

  if (isCountsLoading) {
    return (
      <div>
        <FullWidthLoader />
      </div>
    )
  }
  return (
    <div>
      <HotelModal
        isOpen={isHotelOpen}
        onClose={() => setIsHotelOpen(false)}
        onAccept={onHotelCreate}
        isLoading={isHotelLoading}
        currentReserve={null}
      />
      <RoomModal
        isOpen={isRoomOpen}
        onClose={() => setIsRoomOpen(false)}
        onAccept={onRoomCreate}
        isLoading={isRoomLoading}
        currentReserve={null}
      />
      <ReserveModal
        isOpen={isReserveOpen}
        onClose={() => setIsReserveOpen(false)}
        onAccept={onReserveCreate}
        currentReserve={null}
        isLoading={isReserveLoading}
      />

      <Text
        size="2xl"
        weight={'semibold'}
        view={'success'}
        style={{ marginBottom: '2.25rem' }}
      >
        Все отели
      </Text>
      <Flex gap={'middle'} style={{ maxWidth: '1280px' }}>
        {cards.map(({ count, btn, image, title, id }) => {
          return (
            <Card key={id} shadow title={title} className={cx.card}>
              <div className={cx.image}>{image}</div>
              <div className={cx.count}>
                <Text view={'success'} size={'5xl'} weight={'semibold'}>
                  {count}
                </Text>
              </div>
              <div className={cx.container}>
                <div className={cx.info}>
                  <Text view={'primary'} size={'xl'} weight={'medium'}>
                    {title}
                  </Text>
                  <Button
                    className={cx.button}
                    label={btn.title}
                    onClick={btn.onClick}
                    view={'secondary'}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </Flex>
      <ToastContainer />
    </div>
  )
}
