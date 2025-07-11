'use client'
import { HotelModal } from '@/features/HotelModal/ui/HotelModal'
import {
  HotelDTO,
  useDeleteHotel,
  useInfiniteHotelsQuery,
} from '@/shared/api/hotel/hotel'
import { Nullable } from '@/shared/api/reserve/reserve'
import { QUERY_KEYS, queryClient } from '@/shared/config/reactQuery'
import { useScreenSize } from '@/shared/lib/useScreenSize'
import { TravelButton } from '@/shared/ui/Button/Button'
import { FullWidthLoader } from '@/shared/ui/Loader/Loader'
import { PageTitle } from '@/shared/ui/PageTitle/PageTitle'
import { getHotelUrl } from '@/utils/getHotelUrl'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import { ResponsesNothingFound } from '@consta/uikit/ResponsesNothingFound'
import { Button, Space, Table, Tag, Typography } from 'antd'
import { ColumnsType } from 'antd/es/table'
import Link from 'next/link'
import { useState } from 'react'
import style from './page.module.css'

const { Text } = Typography

export default function Hotels() {
  const [isHotelOpen, setIsHotelOpen] = useState(false)
  const [currentHotel, setIsCurrentHotel] = useState<Nullable<HotelDTO>>(null)
  const { isMobile } = useScreenSize()

  // Используем бесконечный запрос
  const PAGE_SIZE = 20
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteHotelsQuery(undefined, PAGE_SIZE, true)

  const hotels = data?.pages.flatMap(page => page.data) ?? []

  const { isPending: isHotelDeleting, mutateAsync: deleteHotel } =
    useDeleteHotel(() => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.hotels],
      })
    })

  const loading = isLoading || isHotelDeleting

  // Обработчик удаления отеля
  const handleDelete = async (id: string) => {
    try {
      await deleteHotel(id)
    } catch (error) {
      console.error('Ошибка при удалении отеля:', error)
    }
  }

  // Обработчик редактирования отеля
  const handleEdit = (hotel: HotelDTO) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { rooms, ...rest } = hotel
    setIsCurrentHotel(rest)
    setIsHotelOpen(true)
  }

  // Колонки таблицы
  const columns: ColumnsType<HotelDTO> = [
    {
      title: 'Название',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (title: string, record) => (
        <Link href={getHotelUrl(record)}>
          <Text strong>{title}</Text>
        </Link>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: 'Номеров',
      key: 'roomsCount',
      width: 100,
      render: (_, record) => <Text>{record.rooms?.length ?? 0}</Text>,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            icon={<IconEdit />}
            type="text"
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Button
            icon={<IconTrash />}
            type="text"
            size="small"
            danger
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ]

  // Обработчик прокрутки для infinity scroll
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // Если достигли конца таблицы и есть следующая страница
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  if (loading) {
    return <FullWidthLoader />
  }

  if (!hotels.length) {
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
          currentReserve={null}
        />
      </div>
    )
  }

  const totalCount = {
    hotels: hotels.length,
    rooms: hotels.reduce((prev, curr) => {
      return (prev += curr?.rooms?.length ?? 0)
    }, 0),
  }

  return (
    <div className={style.container}>
      <PageTitle
        title={'Все отели'}
        hotels={totalCount.hotels}
        rooms={totalCount.rooms}
        buttonProps={{
          label: 'Добавить отель',
          onClick: () => setIsHotelOpen(true),
        }}
      />

      <Table
        columns={columns}
        dataSource={hotels}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800, y: 'calc(100vh - 300px)' }}
        onChange={handleTableChange}
        loading={isFetchingNextPage}
        virtual
        size={isMobile ? 'small' : 'middle'}
        className={style.hotelsTable}
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
