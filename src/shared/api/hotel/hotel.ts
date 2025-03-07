import supabase from "@/shared/config/supabase";
import {useMutation, useQuery} from "@tanstack/react-query";
import {QUERY_KEYS} from "@/shared/config/reactQuery";
import {Room} from "@/shared/api/room/room";
import {TravelOption} from "@/shared/api/reserve/reserve";
import {TABLE_NAMES} from "@/shared/api/const";
import {PostgrestError} from "@supabase/supabase-js";


// Тип Hotel
export type HotelDTO = {
    id: string; // Уникальный идентификатор отеля
    title: string; // Название отеля
    type: string; // Тип объекта размещения (например, "hotel", "apartment")
    rating: number; // Рейтинг отеля
    address: string; // Адрес отеля
    telegram_url?: string; // Ссылка на Telegram (опционально)
    phone: string; // Телефон отеля
    description: string; // Описание отеля
};

//для создания отеля
export type Hotel = Omit<HotelDTO, "id">;
//для формы
export type RoomForm = Omit<Room, 'hotel_id'> & {
    hotel_id: TravelOption
};
//для формы Room и Reserve
export type HotelForRoom = Pick<HotelDTO, 'id' | 'title'>

const hotelWithRoomsAndServesQuery = supabase.from('hotels').select(`*, rooms(*, reserves(*))`);

export async function getAllHotels(): Promise<HotelDTO[]> {
    try {
        const response = await supabase.from('hotels').select();
        return response.data as HotelDTO[]; // Возвращаем массив отелей
    } catch (error) {
        console.error('Ошибка при получении отелей:', error);
        throw error;
    }
}

export async function getAllHotelsForRoom(): Promise<HotelForRoom[]> {
    const response = await supabase.from('hotels').select('id, title');
    return response.data as HotelForRoom[]; // Возвращаем массив отелей
}

export async function getAllCounts() {
    const {data, error} = await supabase.rpc('get_hotel_room_reserve_counts');

    if (error) throw error;

    return data as { hotel_count: number, room_count: number, reserve_count: number }[]; // Возвращаем массив отелей
}


export async function insertItem<Type>(tableName: string, data: Type, options?: {
    count?: "exact" | "planned" | "estimated"
}) {
    try {
        const {data: responseData, error} = await supabase
            .from(tableName)
            .insert(data, options)
        return {responseData, error};
    } catch (error) {
        console.error('im here', error);

        throw error;
    }


}

export const createHotelApi = async (hotel: Hotel) => {
    const {responseData} = await insertItem<Hotel>(TABLE_NAMES.HOTELS, hotel)

    return responseData
}

export const useGetAllHotels = () => {
    return useQuery({
        queryKey: QUERY_KEYS.hotels,
        queryFn: getAllHotels,
    })
}

export const useGetAllCounts = () => {
    return useQuery({
        queryKey: QUERY_KEYS.allCounts,
        queryFn: getAllCounts,
    })
}
export const useGetHotelsForRoom = () => {
    return useQuery({
        queryKey: QUERY_KEYS.hotelsForRoom,
        queryFn: getAllHotelsForRoom,
    })
}

export const useCreateHotel = (onSuccess: () => void, onError?: (e: Error) => void) => {
    return useMutation({
        mutationFn: (hotel: Hotel) => {
            return createHotelApi(hotel)
        },
        onSuccess, onError
    })
}

export async function getHotelsWithFreeRooms(start_time: number, end_time: number) {
    try {
        const {data, error} = await supabase.rpc('get_hotels_with_free_rooms_in_period', {
            start_time,
            end_time,
        });

        if (error) throw error;
        return data ?? [];
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        console.error('Ошибка при получении отелей с свободными номерами:', error?.message);
        throw error;
    }
}

