import { Nullable } from '@/shared/api/reserve/reserve'
import { createEvent, createStore } from 'effector'
import { HotelForRoom } from '@/shared/api/hotel/hotel'

export type TravelFilterType = Nullable<{
  type?: string
  quantity?: number
  start?: number
  end?: number
  // информация о найденных свободных номерах отелей
  freeHotels?: Map<string, string[]>
  freeHotels_id?: string[]

  // список отелей для поиска
  hotels?: HotelForRoom[]
}>

const changeTravelFilter = createEvent<TravelFilterType>()

// Создаем стор для хранения пользователей
const $hotelsFilter = createStore<TravelFilterType>(null).on(
  changeTravelFilter,
  (state, newFilter) => {
    return { ...state, ...newFilter }
  }
)

// Экспортируем стор и событие
export { $hotelsFilter, changeTravelFilter }
