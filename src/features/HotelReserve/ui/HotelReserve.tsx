import React, {FC} from 'react'
import {Modal} from "@consta/uikit/Modal";
import {Text} from "@consta/uikit/Text";
import {Button} from "@consta/uikit/Button";
import cx from '@/features/HotelReserve/ui/style.module.css'
import {cnDocsDecorator} from "@consta/icons/__internal__/src/uiKit/components/DocsDecorator/DocsDecorator";
import {Sidebar} from "@consta/uikit/Sidebar";

export interface HotelReserveProps {

}

export const HotelReserve: FC<HotelReserveProps> = (props: HotelReserveProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    return (
        <div className={cx.Section}>
            <Button
                size="m"
                view="primary"
                label="Открыть Sidebar"
                width="default"
                onClick={() => setIsSidebarOpen(true)}
            />
            <Sidebar
                className={cx.sidebar}
                rootClassName={cx.sidebarOverlay}
                isOpen={isSidebarOpen}
                onClickOutside={() => setIsSidebarOpen(false)}
                onEsc={() => setIsSidebarOpen(false)}
            >
                <Sidebar.Content className={cx.Content}>
                    <Text
                        as="p"
                        size="l"
                        view="primary"
                        weight="semibold"
                        className={cx.Title}
                    >
                        Бронирование
                    </Text>
                    <Text
                        as="p"
                        size="m"
                        view="secondary"
                        className={cx.body}
                    >
                        содержимое сайдбара
                    </Text>
                </Sidebar.Content>
                <Sidebar.Actions className={cx.Actions}>
                    <Button
                        size="m"
                        view="clear"
                        label="Понятно"
                        width="default"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <Button
                        size="m"
                        view="ghost"
                        label="Закрыть"
                        width="default"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                </Sidebar.Actions>
            </Sidebar>
        </div>
    );
};
