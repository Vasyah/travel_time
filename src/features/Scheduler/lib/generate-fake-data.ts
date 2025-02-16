import {faker} from '@faker-js/faker';
import moment from 'moment';
import {TimelineGroupBase, TimelineItemBase} from "react-calendar-timeline/dist/lib/types/main";

export const generateFakeData = (
    groupCount = 100,
    itemCount = 100,
    daysInPast = 30
) => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const groups: TimelineGroupBase[] = [];

    // Генерация групп
    for (let i = 0; i < groupCount; i++) {
        groups.push({
            id: `${i + 1}`,
            title: faker.person.firstName(), // Обновленный метод для имени
            rightTitle: faker.person.lastName(), // Обновленный метод для фамилии
            bgColor: '#000',
        });
    }

    let items: TimelineItemBase[] = [];

    // Генерация элементов
    for (let i = 0; i < itemCount; i++) {
        const startDate = faker.date.recent({days: daysInPast}).valueOf() + daysInPast * 0.3 * 86400 * 1000;
        const startValue = Math.floor(moment(startDate).valueOf() / 10000000) * 10000000;
        const endValue = moment(
            startDate + faker.number.int({min: 2, max: 20}) * 15 * 60 * 100000 // Обновленный метод для чисел
        ).valueOf();

        items.push({
            id: `${i}`,
            group: `${faker.number.int({min: 1, max: groups.length})}`, // Обновленный метод для чисел
            title: faker.hacker.phrase(),
            start: startValue,
            end: endValue,
            // canMove: startValue > new Date().getTime(),
            // canResize: startValue > new Date().getTime() ? (endValue > new Date().getTime() ? 'both' : 'left') : (endValue > new Date().getTime() ? 'right' : false),
            className:
                moment(startDate).day() === 6 || moment(startDate).day() === 0
                    ? "item-weekend"
                    : "",
            itemProps: {
                "data-tip": faker.hacker.phrase(),
                onDoubleClick: (e) => console.log(e.target)
            },
        });
    }

    // Сортировка элементов
    items = items.sort((a, b) => b - a); // Исправлена ошибка в сравнении

    return {groups, items};
};
