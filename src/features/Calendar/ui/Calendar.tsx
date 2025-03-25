import React, { useCallback, useMemo, useState } from 'react'
import '../../../app/reservation/calendar.css'
import { Grid } from '@consta/uikit/Grid'
import Image from 'next/image'
import { Text } from '@consta/uikit/Text'
import hotelImage from '../hotel.svg'
import star from '../star.svg'
import cx from './style.module.css'
import { HotelDTO } from '@/shared/api/hotel/hotel'
import {
  CurrentReserveType,
  Nullable,
  Reserve,
  ReserveDTO,
  useCreateReserve,
  useDeleteReserve,
  useUpdateReserve,
} from '@/shared/api/reserve/reserve'
import {
  Room,
  useCreateRoom,
  useGetRoomsWithReservesByHotel,
} from '@/shared/api/room/room'
import {
  CustomHeader,
  SidebarHeader,
  Timeline,
  TimelineHeaders,
} from 'react-calendar-timeline'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/config/reactQuery'
import { Flex, Tooltip } from 'antd'
import { getDateFromUnix } from '@/shared/lib/date'
import { FullWidthLoader } from '@/shared/ui/Loader/Loader'
import moment from 'moment'
import { FaTelegram } from 'react-icons/fa'
import { LinkIcon } from '@/shared/ui/LinkIcon/LinkIcon'
import { CiSquarePlus } from 'react-icons/ci'
import { Button } from 'antd'
import { BiSortDown, BiSortUp } from 'react-icons/bi'
import { showToast } from '@/shared/ui/Toast/Toast'
import { nanoid } from 'nanoid'
import { RoomModal } from '@/features/RoomInfo/ui/RoomModal'
import { ReserveModal } from '@/features/ReserveInfo/ui/ReserveModal'
import 'moment/locale/ru'
import { Interval } from '@/features/Calendar/ui/Intervals'
import { $hotelsFilter } from '@/shared/models/hotels'
import { useUnit } from 'effector-react/compat' // Подключаем русскую локализацию

moment.locale('ru') // Для локализации дат

const keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end',
  groupLabelKey: 'title',
}

export interface CalendarProps {
  hotel: HotelDTO
}

const DAY = 24 * 60 * 60 * 1000
const WEEK = DAY * 7
const THREE_MONTHS = DAY * 30 * 24
// const THREE_MONTHS = 5 * 365.24 * 86400 * 1000;

export const Calendar = ({ hotel }: CalendarProps) => {
  const { rating } = hotel
  const filter = useUnit($hotelsFilter)
  const queryClient = useQueryClient()
  const { data, isFetching: isRoomLoading } = useGetRoomsWithReservesByHotel(
    hotel.id,
    filter
  )
  const [currentReserve, setCurrentReserve] =
    useState<Nullable<CurrentReserveType>>(null)
  const [isRoomOpen, setIsRoomOpen] = useState<boolean>(false)
  const [isReserveOpen, setIsReserveOpen] = useState<boolean>(false)
  const [sort, setSort] = useState<'asc' | 'desc'>('asc')

  const {
    isPending: isReserveCreating,
    mutateAsync: createReserve,
    error: reserveError,
  } = useCreateReserve(() => {
    queryClient.invalidateQueries({
      queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel.id],
    })
    setCurrentReserve(null)
    setIsReserveOpen(false)
  })

  const { isPending: isReserveUpdating, mutateAsync: updateReserve } =
    useUpdateReserve(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel.id],
      })
      setCurrentReserve(null)
      setIsReserveOpen(false)
    })

  const { isPending: isReserveDeleting, mutateAsync: deleteReserve } =
    useDeleteReserve(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel.id],
      })
      setCurrentReserve(null)
      setIsReserveOpen(false)
    })

  const {
    isPending: isRoomCreating,
    mutate: createRoom,
    error: roomError,
  } = useCreateRoom(
    () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel.id],
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roomsByHotel })
      setCurrentReserve(null)
      setIsRoomOpen(false)
      showToast('Номер успешно добавлен')
    },
    e => {
      showToast(`Ошибка при добавлении номера ${e}`, 'error')
    }
  )

  const onRoomCreate = useCallback((room: Room) => {
    createRoom(room)
    console.log('Создаю ROOM', room)
  }, [])

  const onReserveAccept = async (reserve: Reserve) => {
    const isEdit = currentReserve?.reserve

    if (isEdit) {
      console.log('Пытаюсь обновить запись')
      await updateReserve(reserve as ReserveDTO)

      return
    }

    await createReserve(reserve)
  }

  const onReserveDelete = async (id: string) => {
    console.log('Пытаюсь удалить запись')
    await deleteReserve(id)

    return
  }

  const onClose = () => {
    // queryClient.invalidateQueries({queryKey: [QUERY_KEYS.hotelsForRoom]})
    // queryClient.invalidateQueries({queryKey: [QUERY_KEYS.roomsByHotel]})
    setIsReserveOpen(false)
    setCurrentReserve(null)
  }

  const hotelRooms = useMemo(() => {
    let rooms =
      data?.map(({ reserves, id, title, ...room }) => ({
        id,
        title: `${title}`,
        ...room,
      })) ?? []

    rooms = rooms.sort((a, b) => {
      if (sort === 'asc') {
        return a.title.localeCompare(b.title, undefined, { caseFirst: 'upper' })
      } else {
        return b.title.localeCompare(b.title, undefined, {
          caseFirst: 'upper',
          sensitivity: 'case',
        })
      }
    })

    return rooms
  }, [data, sort])
  //
  let hotelReserves: Array<ReserveDTO & { group: string }> = []

  data?.forEach(({ id: room_id, reserves }) => {
    const reservesTmp = reserves.map(({ end, start, ...reserve }) => ({
      ...reserve,
      id: reserve.id,
      group: room_id,
      // end: end,
      end: getDateFromUnix(end),
      // start: start,
      start: getDateFromUnix(start),
    }))

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    hotelReserves = hotelReserves.concat(reservesTmp)
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const itemRenderer = ({
    item,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()

    const onItemClick = (reserve: ReserveDTO, hotel: HotelDTO) => {
      const room = hotelRooms.find(room => room.id === reserve?.room_id)

      if (room) {
        setCurrentReserve({ room, reserve, hotel })
        setIsReserveOpen(true)
      }
    }

    return (
      <div
        {...getItemProps(item.itemProps)}
        key={nanoid()}
        onDoubleClick={() => {
          onItemClick(item, hotel)
          console.log('Ваще-та я кликнул сюда', item)
        }}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : ''}
        <Tooltip
          title={
            <Grid>
              <p>Гость: {item.guest}</p>
              <p>Номер: {item?.phone}</p>
              <p>Предоплата: {item?.prepayment}</p>
              <p>:{item.price}</p>
            </Grid>
          }
        >
          <div
            className={`${cx.calendarItem} rct-item-content`}
            style={{ maxHeight: `${itemContext.dimensions.height}` }}
          >
            {item?.guest} {item?.phone}
          </div>
        </Tooltip>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : ''}
      </div>
    )
  }

  const isLoading = isRoomLoading || isRoomCreating
  const reserveLoading = isReserveCreating || isReserveUpdating
  const stars = Array.from(Array(rating))

  const defaultTimeStart = moment().add(-15, 'day')
  const defaultTimeEnd = moment().add(15, 'day')

  const [currentUnit, setCurrentUnit] = useState('day')
  return (
    <>
      <Flex gap={'middle'} className={cx.container}>
        {isLoading && <FullWidthLoader />}
        <div className={cx.hotelInfo}>
          <Image
            className={cx.hotelIcon}
            src={hotelImage.src}
            alt={'Изображение отеля'}
            width={157}
            height={164}
          />
          <div className={cx.stars}>
            {stars?.map((_, index) => {
              return (
                <Image
                  src={star.src}
                  alt={'Звезда отеля'}
                  width={24}
                  height={24}
                  key={index}
                />
              )
            })}
          </div>
          <div>{hotel.type}</div>
          <div className={cx.hotelDescription}>
            <Text
              className={cx.title}
              transform={'uppercase'}
              weight={'semibold'}
              size={'xl'}
            >
              {hotel.title}
            </Text>
            <div>
              {hotel?.telegram_url && (
                <LinkIcon
                  icon={<FaTelegram color="2AABEE" size={'24px'} />}
                  link={hotel?.telegram_url}
                />
              )}
            </div>
          </div>
        </div>
        <div style={{ maxHeight: '280px', overflow: 'auto' }}>
          <Timeline
            onZoom={(context, unit) => setCurrentUnit(unit)}
            className={'travel-timeline'}
            groups={hotelRooms}
            items={hotelReserves}
            keys={keys}
            sidebarWidth={230}
            canMove
            canResize="both"
            canSelect
            itemTouchSendsClick={true}
            stackItems={false}
            itemHeightRatio={0.75}
            defaultTimeStart={defaultTimeStart as unknown as number}
            defaultTimeEnd={defaultTimeEnd as unknown as number}
            minZoom={WEEK}
            maxZoom={THREE_MONTHS}
            onCanvasDoubleClick={(groupId, time, e) => {
              const room = hotelRooms?.find(group => group.id === groupId)
              // setIsHotelReserve(true)
              console.log(room, groupId, time, e)
              if (room) {
                setCurrentReserve({ room, hotel })
                setIsReserveOpen(true)
              }
            }}
            itemRenderer={itemRenderer}
          >
            <TimelineHeaders>
              <SidebarHeader>
                {({ getRootProps }) => {
                  return (
                    <div {...getRootProps()} className={cx.calendarHeader}>
                      <Button
                        icon={<CiSquarePlus size={24} />}
                        type={'link'}
                        onClick={() => {
                          setCurrentReserve({ hotel: hotel })
                          setIsRoomOpen(true)
                        }}
                      />
                      {sort === 'asc' ? (
                        <Button
                          icon={<BiSortDown size={24} />}
                          type={'link'}
                          title={'В алфавитном порядке А-Я'}
                          onClick={() => {
                            setSort('desc')
                          }}
                        />
                      ) : (
                        <Button
                          icon={<BiSortUp size={24} />}
                          type={'link'}
                          title={'В алфавитном порядке А-Я'}
                          onClick={() => {
                            setSort('asc')
                          }}
                        />
                      )}
                    </div>
                  )
                }}
              </SidebarHeader>
              <CustomHeader unit={currentUnit === 'day' ? 'month' : 'year'}>
                {({
                  headerContext: { intervals, unit },

                  getRootProps,
                  getIntervalProps,
                  showPeriod,
                }) => {
                  const isYear = unit === 'year'
                  return (
                    <div {...getRootProps()}>
                      {intervals.map(interval => {
                        const dateText = isYear
                          ? moment(interval.startTime.toDate()).format('YYYY')
                          : moment(interval.startTime.toDate()).format('MMM')

                        return (
                          <Interval
                            interval={interval}
                            unit={unit}
                            getIntervalProps={getIntervalProps}
                            getRootProps={getRootProps}
                            dateText={dateText}
                            showPeriod={showPeriod}
                            intervalStyles={{
                              backgroundColor: 'var(--color-bg-success)',
                              color: 'var(--color-control-typo-primary)',
                            }}
                            key={nanoid()}
                          />
                        )
                      })}
                    </div>
                  )
                }}
              </CustomHeader>
              <CustomHeader headerData={{ someData: 'data' }}>
                {({
                  headerContext: { intervals, unit },
                  getRootProps,
                  getIntervalProps,
                  showPeriod,
                }) => {
                  return (
                    <div {...getRootProps()}>
                      {intervals.map(interval => {
                        const isMonth = unit === 'month'

                        const dateText = isMonth
                          ? moment(interval.startTime.toDate()).format('MMM')
                          : interval.startTime.format('DD')

                        return (
                          <Interval
                            interval={interval}
                            unit={unit}
                            getIntervalProps={getIntervalProps}
                            getRootProps={getRootProps}
                            dateText={dateText}
                            showPeriod={showPeriod}
                            key={nanoid()}
                          />
                        )
                      })}
                    </div>
                  )
                }}
              </CustomHeader>
            </TimelineHeaders>
          </Timeline>
        </div>
        <RoomModal
          isOpen={isRoomOpen}
          onClose={() => setIsRoomOpen(false)}
          onAccept={onRoomCreate}
          isLoading={isRoomCreating}
          currentReserve={currentReserve}
        />
      </Flex>
      <ReserveModal
        isOpen={isReserveOpen}
        onClose={onClose}
        onAccept={onReserveAccept}
        onDelete={onReserveDelete}
        currentReserve={currentReserve}
        isLoading={reserveLoading}
      />
    </>
  )
}
