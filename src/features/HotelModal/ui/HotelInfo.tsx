import React, {FC, useCallback} from 'react'
import {Modal} from "@consta/uikit/Modal";
import {Text} from "@consta/uikit/Text";
import cx from './style.module.css'
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import {type CurrentReserveType} from "@/features/Scheduler/ui/Calendar";
import {Controller, useForm} from "react-hook-form";
import {Hotel} from "@/shared/api/hotels/hotels";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TravelButton} from "@/shared/ui/Button/Button";
import {FORM_SIZE} from "@/shared/lib/const";
import {types} from "@/features/HotelModal/lib/const";
import {FormTitle} from "@/shared/ui/FormTitle/FormTitle";

export interface HotelInfoProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve?: CurrentReserveType
    isLoading?: boolean;
}

export type HotelForm = Hotel & { type: { label: string, id: string } };

export const HotelInfo: FC<HotelInfoProps> = ({
                                                  isOpen = false,
                                                  onAccept,
                                                  onClose,
                                                  currentReserve,
                                                  isLoading = false,
                                              }:
                                              HotelInfoProps
    ) => {

        const {
            control,
            getValues,
            register,
            handleSubmit,
            watch,
            formState: {errors}
        } = useForm<HotelForm>({defaultValues: {rating: 5, telegram_url: 'https://t.me/'}})


        // количество ночей - считаем по выбранной дате
        // предоплата - сумма указанная вручную
        // итоговая сумма - сумма * количество ночей - предоплата

        const serializeData = (data: HotelForm): Hotel => {
            return {...data, type: data.type.label}
        }
        const onAcceptForm = useCallback(() => {

            const serializedData = serializeData(getValues())

            onAccept(serializedData)
        }, []);

        return (
            <Modal
                hasOverlay
                className={cx.modal}
                rootClassName={cx.sidebarOverlay}
                isOpen={isOpen}
                onClickOutside={onClose}
                onEsc={onClose}
            >
                <FormTitle>
                    Добавление отеля
                </FormTitle>

                <TextField
                    {...register('title')}
                    placeholder="Введите название"
                    label="Название отеля"
                    required
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />

                <Grid cols={6} gap={FORM_SIZE}>
                    <GridItem col={4}>
                        <Controller
                            name="type"
                            control={control}
                            rules={{required: true}}
                            render={({field}) => <Select
                                {...field} items={types}
                                placeholder={'Выберите из списка'}
                                label={"Тип"}
                                required
                                size={FORM_SIZE}
                                dropdownClassName={cx.dropdown}
                                disabled={isLoading}
                                className={cx.fields}
                            />
                            }
                        />
                    </GridItem>
                    <GridItem col={2}>
                        <TextField
                            {...register('rating')}
                            placeholder="Введите число"
                            label="Рейтинг"
                            type="number"
                            required
                            size={FORM_SIZE}
                            disabled={isLoading}
                            className={cx.fields}
                        />
                    </GridItem>
                </Grid>
                <TextField
                    {...register('address')}
                    placeholder="Введите адрес"
                    label="Местоположение"
                    required
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
                <TextField
                    {...register('telegram_url')}
                    placeholder="Вставьте ссылку"
                    label="Ссылка на отель в Telegram"
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
                <TextField
                    {...register('phone')}
                    placeholder="+7 (...)"
                    label="Номер владельца"
                    required
                    type={'phone'}
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
                <TextField
                    {...register('description')}
                    label="Комментарии"
                    type="textarea"
                    cols={200}
                    rows={3}
                    placeholder="Введите комментарий"
                    size={FORM_SIZE}
                    disabled={isLoading}
                    className={cx.fields}
                />
                <Text> Количество номеров: 12312 Отображаем только для редактирования</Text>
                <Grid cols={2}>
                    <GridItem>
                        <TravelButton
                            style={{color: 'red', borderColor: 'red'}}
                            size="m"
                            view="secondary"
                            label="Отмена"
                            onClick={onClose}
                            disabled={isLoading}

                        />
                    </GridItem>
                    <GridItem style={{alignSelf: 'end'}}>
                        <TravelButton
                            size="m"
                            label="Добавить"
                            onClick={onAcceptForm}
                            loading={isLoading}
                        /></GridItem>
                </Grid>
            </Modal>
        );
    }
;
