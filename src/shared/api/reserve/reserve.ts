import {Hotel, insertItem} from "@/shared/api/hotel/hotel";
import {TABLE_NAMES} from "@/shared/api/const";
import {useMutation} from "@tanstack/react-query";
import {createRoomApi} from "@/shared/api";

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
    date: [Date?, Date?],
    hotel_id: TravelOption,
    room_id: TravelOption
};

export type CurrentReserveType =
    { room: { id: string, title: string }, time: number, hotel: { id: string, title: string } }
    | null;


export const createReserveApi = async (reserve: Reserve) => {
    const {responseData} = await insertItem<Reserve>(TABLE_NAMES.RESERVES, reserve)

    return responseData
}

export const useCreateReserve = () => {
    return useMutation({
        mutationFn: createReserveApi,
    })
}
