import React, {FC, useCallback, useMemo} from 'react'
import {Modal} from "@consta/uikit/Modal";
import cx from './style.module.css'
import {TextField} from "@consta/uikit/TextField";
import {Select} from "@consta/uikit/Select";
import Item from "react-calendar-timeline/dist/lib/items/Item";
import {type CurrentReserveType} from "@/features/Scheduler/ui/Calendar";
import {Controller, useForm} from "react-hook-form";
import {FormButtons} from "@/shared/ui/FormButtons/FormButtons";
import {getAllHotelsForRoom, Hotel, HotelDTO, HotelForRoom, Room} from "@/shared/api/hotels/hotels";
import {FormTitle} from "@/shared/ui/FormTitle/FormTitle";
import {FORM_GAP_SIZE, FORM_SIZE} from "@/shared/lib/const";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {DragNDropField} from "@consta/uikit/DragNDropField";
import {Button} from "@consta/uikit/Button";
import {Text} from "@consta/uikit/Text";
import {useQuery} from "@tanstack/react-query";
import {adaptHotelToForm} from "@/features/RoomInfo/lib/adaptHotel";
import {QUERY_KEYS} from "@/app/config/reactQuery";

export interface RoomInfoProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (args?: any) => void;
    currentReserve?: CurrentReserveType
    isLoading?: boolean;
}

export type RoomForm = Omit<Room, 'hotel_id'> & { hotel_id: { label: string, id: string } };

export const RoomInfo: FC<RoomInfoProps> = ({
                                                isOpen = false,
                                                onAccept,
                                                onClose,
                                                currentReserve,
                                                isLoading = false,
                                            }: RoomInfoProps) => {
        const {data: hotels, isPending} = useQuery({
            queryKey: QUERY_KEYS.hotelsForRoom,
            queryFn: getAllHotelsForRoom,
        })


        const loading = isLoading || isPending

    
        const hotelOptions = useMemo(() => {
            const hotelsTmp = hotels?.map(adaptHotelToForm)
            return hotelsTmp ?? []
        }, [hotels])

        const {
            control,
            getValues,
            register,
            formState: {errors},
        } = useForm<RoomForm>({
            defaultValues: {
                quantity: 3
            }
        })

        const deserializeData = (data: RoomForm): Room => {
            return {...data, hotel_id: data?.hotel_id.id, image_path: '', image_title: ''}
        }

        const onAcceptForm = useCallback(() => {

            const serializedData = deserializeData(getValues())

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
                    Бронирование
                </FormTitle>
                <Controller
                    name="hotel_id"
                    control={control}
                    rules={{required: true}}
                    render={({field}) => <
                        Select
                        {...field}
                        items={hotelOptions}
                        placeholder={'Выберите из списка'}
                        label={"Название отеля"} required size={FORM_SIZE}
                        dropdownClassName={cx.dropdown}
                        className={cx.fields}
                        disabled={loading}
                    />}
                />

                <TextField
                    {...register('title')}
                    placeholder="Введите название"
                    label="Название номера"
                    required
                    size={FORM_SIZE}
                    className={cx.fields}
                    disabled={loading}
                />
                <Grid cols={3} gap={FORM_GAP_SIZE}>
                    <GridItem col={2}>
                        <TextField
                            {...register('price')}
                            placeholder="Введите стоимость"
                            label="Стоимость номера"
                            required
                            size={FORM_SIZE}
                            className={cx.fields}
                            disabled={loading}
                        />
                    </GridItem>
                    <GridItem>
                        <TextField
                            {...register('quantity')}
                            placeholder="Введите число"
                            label="Вместимость"
                            required
                            type="number"
                            size={FORM_SIZE}
                            className={cx.fields}
                            disabled={loading}
                        />

                    </GridItem>
                </Grid>
                <DragNDropField onDropFiles={(files) => console.log(files)}
                                disabled={loading}>
                    {({openFileDialog}) => (
                        <>
                            <Text view="primary">Пример с Render Props, открывает окно для выбора файла из дочернего
                                блока</Text>
                            <br/>
                            <Button onClick={openFileDialog} label="Выбрать файл"/>
                        </>
                    )}
                </DragNDropField>
                <TextField
                    {...register('comment')} label="Комментарии" type="textarea" cols={200}
                    rows={3}
                    placeholder="Введите комментарий"
                    size={FORM_SIZE}
                    className={cx.fields}
                    disabled={loading}
                />
                <FormButtons isLoading={loading} onAccept={onAcceptForm} onClose={onClose}/>

            </Modal>
        );
    }
;
