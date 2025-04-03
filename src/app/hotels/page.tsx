'use client'
import React, { useState } from 'react'
import {
  HotelDTO,
  useDeleteHotel,
  useGetAllHotels,
  useUpdateHotel,
} from '@/shared/api/hotel/hotel'
import { Hotel } from '@/features/Hotel/Hotel'
import { Flex } from 'antd'
import { FullWidthLoader } from '@/shared/ui/Loader/Loader'
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle'
import style from './page.module.css'
import { HotelModal } from '@/features/HotelModal/ui/HotelModal'
import { Nullable } from '@/shared/api/reserve/reserve'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { ResponsesNothingFound } from '@consta/uikit/ResponsesNothingFound'
import { TravelButton } from '@/shared/ui/Button/Button'

export interface PageProps {
  children?: React.ReactNode
  className?: string
}

export default function Hotels({ className }: PageProps) {
  const { isFetching, error, data: hotels, refetch } = useGetAllHotels()
  const [isHotelOpen, setIsHotelOpen] = useState(false)
  const [currentHotel, setIsCurrentHotel] = useState<Nullable<HotelDTO>>(null)

  const { isPending: isHotelDeleting, mutateAsync: deleteHotel } =
    useDeleteHotel(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.hotels],
      })
    })

  const { isPending: isHotelUpdating, mutateAsync: updateHotel } =
    useUpdateHotel(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.hotels],
      })
    })
  const isLoading = isHotelDeleting || isFetching || isHotelUpdating

  console.log(hotels)
  if (isFetching) {
    return <FullWidthLoader />
  }

  if (!hotels?.length) {
    return (
      <div>
        <PageTitle title={'Все отели'} hotels={0} rooms={0} />
        <ResponsesNothingFound
          title={'Отели пока не добавлены'}
          description={'В настоящий момент не добавлено ни одного отеля'}
          actions={
            <TravelButton
              label={'Добавить отель'}
              onClick={() => setIsHotelOpen(true)}
            />
          }
        />
        <HotelModal
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

  const totalCount = {
    hotels: hotels?.length,
    rooms: hotels?.reduce((prev, curr) => {
      return (prev += curr?.rooms?.[0].count ?? 0)
    }, 0),
  }

  return (
    <div className={style.container}>
      {isLoading && <FullWidthLoader />}

      <PageTitle
        title={'Все отели'}
        hotels={totalCount?.hotels}
        rooms={totalCount?.rooms}
        buttonProps={{
          label: 'Добавить отель',
          onClick: () => setIsHotelOpen(true),
        }}
      />
      <Flex wrap gap={'small'}>
        {hotels?.map(hotel => (
          <Hotel
            hotel={hotel}
            key={hotel.id}
            onDelete={deleteHotel}
            onEdit={(hotel: HotelDTO) => {
              setIsCurrentHotel(hotel)
              setIsHotelOpen(true)
            }}
          />
        ))}
      </Flex>

      <HotelModal
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
