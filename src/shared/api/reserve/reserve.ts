import {Hotel, HotelDTO, insertItem} from "@/shared/api/hotel/hotel";
import {TABLE_NAMES} from "@/shared/api/const";
import {MutationOptions, useMutation} from "@tanstack/react-query";
import {createRoomApi} from "@/shared/api";
import {RoomDTO} from "@/shared/api/room/room";
import supabase from "@/shared/config/supabase";
import {showToast} from "@/shared/ui/Toast/Toast";
import {QUERY_KEYS, queryClient} from "@/shared/config/reactQuery";

export type ReserveDTO = {
    id: string; // Уникальный идентификатор брони
    room_id: string;  // ID номера, к которому относится бронь
    start: number; // Начало бронирования (Unix timestamp)
    end: number; // Конец бронирования (Unix timestamp)
    title?: string; // Обязательное название брони
    prepayment?: number; // Предоплата (опционально, используется для внутренних расчетов)
    guest: string; // Имя гостя
    phone: string; // Телефон гостя
    comment?: string; // Комментарий к брони
    price: number,
    quantity: number;
};
export type TravelOption = {
    label: string;
    id: string
}

//для формы
export type Reserve = Omit<ReserveDTO, "id">;
//для формы
export type ReserveForm = Omit<ReserveDTO, "id" | "start" | "end" | "room_id"> & {
    date: [Date, Date],
    hotel_id: TravelOption,
    room_id: TravelOption
};

export type Nullable<Type> = Type | null

export type CurrentReserveType =
    { room?: RoomDTO, hotel: HotelDTO, reserve?: ReserveDTO }

export const createReserveApi = async (reserve: Reserve) => {
    const {responseData} = await insertItem<Reserve>(TABLE_NAMES.RESERVES, reserve)

    return responseData
}

export const updateReserveApi = async ({id, ...reserve}: ReserveDTO) => {
    try {
        await supabase.from('reserves')
            .update(reserve)
            .eq('id', id)

    } catch (error) {
        console.error(error)
        showToast('Ошибка при обновлении брони', 'error')
    }
}
export const useUpdateReserve = (onSuccess?: () => void, onError?: (e: Error) => void) => {
    return useMutation({
        mutationFn: updateReserveApi,
        onSuccess, onError
    })
}

export const useCreateReserve = (onSuccess?: () => void, onError?: (e: Error) => void) => {
    return useMutation({
        mutationFn: createReserveApi,
        onSuccess, onError,
    })
}
