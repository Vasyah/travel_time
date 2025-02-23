import supabase from "@/app/config/supabase";
import {QueryData} from "@supabase/supabase-js";
import {useMutation, useQuery} from "@tanstack/react-query";
import {QUERY_KEYS, queryClient} from "@/app/config/reactQuery";
import {Room} from "@/shared/api/room/room";
import {TravelOption} from "@/shared/api/reserve/reserve";
import {TABLE_NAMES} from "@/shared/api/const";


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

const hotelWithRoomsAndServesQuery = supabase.from('hotels').select(`
        id,
        title,
        type,
        rating,
        address,
        telegram_url,
        phone,
        description,
        rooms(id,
              hotel_id,
              title,
              price,
              quantity,
              image_title,
              image_path,
              comment,
              reserves(id,
                    room_id,
                    start,
                    end,
                    guest,
                    phone,
                    comment
                )
        )
        `);

type HotelsWithRoomsAndReserves = QueryData<typeof hotelWithRoomsAndServesQuery>

export async function getHotelsWithRoomsAndeServes(): Promise<HotelsWithRoomsAndReserves> {
    try {
        const {data} = await hotelWithRoomsAndServesQuery;
        return data as HotelsWithRoomsAndReserves; // Возвращаем массив отелей
    } catch (error) {
        console.error('Ошибка при получении отелей:', error);
        throw error;
    }
}

// export async function fetchHotelWithRoomsAndReserves(hotelId: string): Promise<Hotel | null> {
//     try {
//         // Шаг 1: Получить отель по ID
//         const hotelResponse = supabase.from(`hotel?id=eq.${hotelId}`).select(`
//         id,
//         title,
//         type,
//         rating,
//         address,
//         telegram_url,
//         phone,
//         description,
//         rooms(id,
//               hotel_id,
//               title,
//               price,
//               quantity,
//               image_title,
//               image_path,
//               comment,
//               reserves(id,
//                     room_id,
//                     start,
//                     end,
//                     guest,
//                     phone,
//                     comment
//                 )
//         )
//         `);
//         const {data} = await hotelWithRoomsAndServesQuery;
//         return data as Hotel
//
//         // return hotel;
//     } catch (error) {
//         console.error('Ошибка при получении данных отеля:', error);
//         throw error;
//     }
// }

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
export const useGetHotelsForRoom = () => {
    return useQuery({
        queryKey: QUERY_KEYS.hotelsForRoom,
        queryFn: getAllHotelsForRoom,
    })
}

export const useCreateHotel = () => {
    return useMutation({
        mutationFn: (hotel: Hotel) => {
            return createHotelApi(hotel)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: QUERY_KEYS.hotelsForRoom})
        },
    })
}
