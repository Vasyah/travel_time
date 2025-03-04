// userModel.ts
import {createEvent, createStore, createEffect, sample} from 'effector';

const changeTravelFilter = createEvent<{
    type?: string,
    quantity?: number,
    start?: number,
    end?: number
} | null>();
// Создаем стор для хранения пользователей
const $hotelsFilter = createStore(null as {
    type?: string,
    quantity?: number,
    start?: number,
    end?: number
} | null).on(changeTravelFilter, (state, newFilter) => {
    return {...newFilter}
});


// Экспортируем стор и событие
export {$hotelsFilter, changeTravelFilter};
