import { ReserveDTO } from '@/shared/api/reserve/reserve'
import { useMutation, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/config/reactQuery'
import supabase from '@/shared/config/supabase'
import { insertItem } from '@/shared/api/hotel/hotel'
import { TABLE_NAMES } from '@/shared/api/const'
import { TravelFilterType } from '@/shared/models/hotels'

export type RoomDTO = {
  id: string // Уникальный идентификатор номера
  hotel_id: string
  title: string // Название номера
  price: number // Цена за ночь
  quantity: number // Вместимость
  image_title: string // Название изображения
  image_path: string // Путь к изображению
  comment?: string // Комментарий к номеру
}

export type RoomReserves = {
  id: string // Уникальный идентификатор номера
  hotel_id: string
  title: string // Название номера
  price: number // Цена за ночь
  quantity: number // Количество номеров данного типа
  image_title: string // Название изображения
  image_path: string // Путь к изображению
  comment?: string // Комментарий к номеру
  reserves: ReserveDTO[] // Список бронирований для этого номера
}
export type Room = Omit<RoomDTO, 'id'>

export async function getRoomsByHotel(hotel_id?: string) {
  const response = await supabase
    .from(TABLE_NAMES.ROOMS)
    .select()
    .filter('hotel_id', 'eq', hotel_id)
  return response.data as RoomDTO[] // Возвращаем массив отелей
}

export async function getRoomsWithReservesByHotel(
  hotel_id?: string,
  filter?: TravelFilterType,
  withReserves?: boolean
) {
  const query = supabase.from(TABLE_NAMES.ROOMS).select(
    `
        id,
        title
    `
  )

  if (withReserves) {
    query.select(`        
      id,
      title,
      reserves(*)`)
  }

  query.filter('hotel_id', 'eq', hotel_id)

  if (filter?.quantity) {
    query.gte('quantity', filter?.quantity)
  }

  if (filter?.rooms_id && hotel_id) {
    const rooms_id = filter?.rooms_id.get(hotel_id)
    console.log(rooms_id)
    if (rooms_id) {
      query.in('id', rooms_id)
    }
  }

  const response = await query
  return response.data as unknown as RoomReserves[] // Возвращаем массив отелей
}

export const createRoomApi = async (room: Room) => {
  try {
    const { responseData } = await insertItem<Room>(TABLE_NAMES.ROOMS, room)
    return responseData
  } catch (error) {
    throw error
  }
}

export const useGetRoomsByHotel = (hotel_id?: string, enabled?: boolean) => {
  return useQuery({
    queryKey: QUERY_KEYS.roomsByHotel,
    queryFn: () => getRoomsByHotel(hotel_id),
    enabled,
  })
}

export const useGetRoomsWithReservesByHotel = (
  hotel_id?: string,
  filter?: TravelFilterType,
  withReserves?: boolean
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel_id],
    queryFn: () => getRoomsWithReservesByHotel(hotel_id, filter, withReserves),
  })
}
export const useCreateRoom = (
  onSuccess: () => void,
  onError?: (e: Error) => void
) => {
  return useMutation({
    mutationFn: createRoomApi,
    onSuccess,
    onError,
  })
}
