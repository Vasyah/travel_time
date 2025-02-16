"use client";
import React, {useEffect, useState} from "react";
import {CustomTimeline} from "@/features/Scheduler/ui/Calendar";
import {Text} from "@consta/uikit/Text";
import {Layout} from "@consta/uikit/Layout";
import {ReserveModal} from "@/features/ReserveModal/ui/ReserveModal";
import {SearchFeature} from "@/features/Search/ui/Search";
import supabase from "@/utils/supabase";
import {NewToDo} from "@/components/NewTodo";
import {nanoid} from "nanoid";


type Todo = { id: string, title: string };

const hotels = [
    {
        title: 'Отель №1',
        id: nanoid()
    },
    {
        title: 'Отель №2',
        id: nanoid()
    },
    {
        title: 'Отель №3',
        id: nanoid()
    }];

export default function Home() {
    const [todos, setTodos] = useState<Todo[]>([])

    const fetchTodos = async () => {
        const {data} = await supabase.from('todos').select('*')

        console.log(data)
        setTodos(data as Todo[])
    }

    useEffect(() => {
        fetchTodos()
    }, [])


    return (
        <div>
            <NewToDo reload={fetchTodos}/>
            {todos.map((todo) => (
                <p key={todo.id}>{todo.title}</p>
            ))}
            <Layout>
                <Layout flex={2} style={{margin: '2.5rem 0'}}>
                    <SearchFeature/>
                </Layout>

                <Layout flex={2} direction={'column'} style={{margin: '1.5rem 0'}}>
                    <Text size="2xl" view={"success"}>Сегодня</Text>
                    <Text size="3xl" view={"success"}>Ср, 17 января 2020 г.</Text>
                </Layout>
            </Layout>
            <Text size="2xl" weight={'semibold'} view={"success"} style={{marginBottom: '2.25rem'}}>Все отели</Text>
            {hotels.map((hotel) => <CustomTimeline hotel={hotel}/>)}


        </div>
    );
}
