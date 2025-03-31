'use client'
import React, { useEffect } from 'react'
import { useGetAllHotels } from '@/shared/api/hotel/hotel'
import { Calendar } from '@/features/Calendar/ui/Calendar'
import { Loader } from '@/shared/ui/Loader/Loader'
import cx from './page.module.css'
import { useUnit } from 'effector-react/compat'
import { $hotelsFilter } from '@/shared/models/hotels'
import 'react-calendar-timeline/style.css'
import './calendar.css'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import {
  $isHotelsWithFreeRoomsLoading,
  getHotelsWithFreeRoomsFx,
} from '@/features/Reservation/model/reservationStore'
import { HotelHeading } from '@/shared/ui/Hotel/HotelHeading'

export default function Home() {
  const filter = useUnit($hotelsFilter)
  const isFreeHotelsLoading = useUnit($isHotelsWithFreeRoomsLoading)
  const {
    isPending,
    error,
    data: hotels,
    refetch,
  } = useGetAllHotels(!filter, filter)
  // если добавили фильтр, то загрузить только отели в которых есть свободные места

  useEffect(() => {
    if (!!filter?.end && !!filter?.start) {
      getHotelsWithFreeRoomsFx({ start: filter?.start, end: filter?.end })
    }
  }, [filter?.start, filter?.end])

  useEffect(() => {
    if (
      !!filter?.hotels_id ||
      !!filter?.rooms_id ||
      filter?.type ||
      filter?.quantity
    ) {
      refetch()
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel],
      })
    }
  }, [filter?.hotels_id, filter?.rooms_id, filter?.type, filter?.quantity])

  if (isPending || isFreeHotelsLoading) {
    return (
      <div className={cx.loaderContainer}>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <HotelHeading title={'Все отели'} hotels={36} rooms={154} />
      {hotels?.map(hotel => <Calendar hotel={hotel} key={hotel.id} />)}
    </div>
  )
}
