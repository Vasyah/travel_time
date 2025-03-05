import {ReserveDTO} from "@/shared/api/reserve/reserve";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {QUERY_KEYS, queryClient} from "@/app/config/reactQuery";
import supabase from "@/app/config/supabase";
import {insertItem} from "@/shared/api/hotel/hotel";
import {TABLE_NAMES} from "@/shared/api/const";

export type RoomDTO = {
    id: string; // Уникальный идентификатор номера
    hotel_id: string;
    title: string; // Название номера
    price: number; // Цена за ночь
    quantity: number; // Вместимость
    image_title: string  // Название изображения
    image_path: string; // Путь к изображению
    comment?: string; // Комментарий к номеру
};

export type RoomReserves = {
    id: string; // Уникальный идентификатор номера
    hotel_id: string;
    title: string; // Название номера
    price: number; // Цена за ночь
    quantity: number; // Количество номеров данного типа
    image_title: string  // Название изображения
    image_path: string; // Путь к изображению
    comment?: string; // Комментарий к номеру
    reserves: ReserveDTO[]; // Список бронирований для этого номера
};
export type Room = Omit<RoomDTO, "id">;

export async function getRoomsByHotel(hotel_id?: string) {
    const response = await supabase.from(TABLE_NAMES.ROOMS).select().filter('hotel_id', "eq", hotel_id);
    return response.data as RoomDTO[]; // Возвращаем массив отелей
}

export async function getRoomsWithReservesByHotel(hotel_id?: string) {
    const response = await supabase.from(TABLE_NAMES.ROOMS).select(
        `
        id,
        title,
        reserves(*)
)
    `)
        .filter('hotel_id', "eq", hotel_id);
    return response.data as RoomReserves[]; // Возвращаем массив отелей
}


export const createRoomApi = async (room: Room) => {
    try {
        const {responseData} = await insertItem<Room>(TABLE_NAMES.ROOMS, room)
        return responseData
    } catch (error) {
        throw error
    }
}


export const useGetRoomsByHotel = (hotel_id?: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.roomsByHotel,
        queryFn: () => getRoomsByHotel(hotel_id),
        enabled: false,
    })
}

export const useGetRoomsWithReservesByHotel = (hotel_id?: string) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.roomsWithReservesByHotel, hotel_id],
        queryFn: () => getRoomsWithReservesByHotel(hotel_id),
    })
}
export const useCreateRoom = (onSuccess: () => void, onError?: (e: Error) => void) => {
    return useMutation({
        mutationFn: createRoomApi,
        onSuccess, onError
    })
}

