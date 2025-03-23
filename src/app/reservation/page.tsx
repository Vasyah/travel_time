'use client'
import React, { useEffect } from 'react'
import { Text } from '@consta/uikit/Text'
import {
  getHotelsWithFreeRooms,
  useGetAllHotels,
} from '@/shared/api/hotel/hotel'
import { Calendar } from '@/features/Calendar/ui/Calendar'
import { Loader } from '@/shared/ui/Loader/Loader'
import cx from './page.module.css'
import { useUnit } from 'effector-react/compat'
import { $hotelsFilter, changeTravelFilter } from '@/shared/models/hotels'
import 'react-calendar-timeline/style.css'
import './calendar.css'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'

export default function Home() {
  const filter = useUnit($hotelsFilter)
  const {
    isLoading,
    error,
    data: hotels,
    refetch,
  } = useGetAllHotels(!filter, filter)
  // если добавили фильтр, то загрузить только отели в которых есть свободные места

  console.log(filter)
  useEffect(() => {
    // if (!filter?.start && !filter?.end) returnp
    //
    // const filteredHotels = getHotelsWithFreeRooms(filter?.start, filter?.end)
    //
    // filteredHotels.then(data => setFilteredHotels(data))
    if (!!filter?.end && !!filter?.start) {
      getHotelsWithFreeRooms(filter?.start, filter?.end).then(
        result => {
          const hotels_id = result?.map(hotel => hotel.hotel_id)
          const rooms_id = new Map<string, string[]>()

          result?.forEach(hotel =>
            rooms_id.set(
              hotel.hotel_id,
              hotel.rooms.map(room => room.room_id)
            )
          )

          console.log({ hotels_id, rooms_id })
          changeTravelFilter({ hotels_id: hotels_id, rooms_id: rooms_id })
        }

        //
      )
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

  if (isLoading) {
    return (
      <div className={cx.loaderContainer}>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <Text
        size="2xl"
        weight={'semibold'}
        view={'success'}
        style={{ marginBottom: '2.25rem' }}
      >
        Все отели
      </Text>
      {hotels?.map(hotel => <Calendar hotel={hotel} key={hotel.id} />)}
    </div>
  )
}
