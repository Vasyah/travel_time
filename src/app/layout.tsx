'use client'

import {Geist, Geist_Mono} from "next/font/google";
import {Theme, ThemePreset,} from "@consta/uikit/Theme";
import {LayoutExampleBig} from "@/ui/Header/Header";
import React, {useState} from "react";
import {TravelMenu} from "@/shared/ui/Menu/Menu";
import '@consta/themes/Theme_color_highlightsGreenDefault';
import {Grid, GridItem} from "@consta/uikit/Grid";
import "../shared/ui/globals.css";
import '@/features/lib/zIndexes.css'
import {SearchFeature} from "@/features/Search/ui/Search";
import {Text} from "@consta/uikit/Text";
import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/shared/config/reactQuery";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {FaCaretDown} from "react-icons/fa";
import moment from "moment";
import {DateTime} from "@consta/uikit/DateTime";
import cx from './layout.module.css'
import {ConfigProvider} from "antd";
import {SafeHydrate} from "@/components/SafeHydrate/SafeHydrate";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
//
// export const metadata: Metadata = {
//     title: "Create Next App",
//     description: "Generated by create next app",
// };

const preset: ThemePreset = {
    color: {
        primary: 'highlightsGreenDefault', //основная цветовая схема, указано значение модификатора _color
        accent: 'highlightsGreenDefault', //акцентная цветовая схема, указано значение модификатора _color
        invert: 'highlightsGreenDefault', //инвертная цветовая схема, указывается значение модификатора _color
    },
    control: "gpnDefault", // указывается значение модификатора _control
    font: 'gpnDefault', // указывается значение модификатора _font
    size: 'gpnDefault', // указывается значение модификатора _size
    space: 'gpnDefault', // указывается значение модификатора _space
    shadow: 'gpnDefault', // указывается значение модификатора _shadow
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorLink: '#00b96b',
                    colorPrimary: '#00b96b',
                    borderRadius: 2,

                    // Alias Token
                    colorBgContainer: '#f6ffed',
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <Theme preset={preset}>
                    <SafeHydrate>
                        <LayoutExampleBig/>
                        <Grid cols={24} style={{minHeight: `calc(100vh - 64px)`,}}>
                            <GridItem col={2} style={{
                                borderRight: '1px solid var(--color-bg-border)',
                                minWidth: '120px',
                                maxWidth: '120px'
                            }}>
                                <TravelMenu/>
                            </GridItem>
                            <GridItem col={22} style={{padding: '0 2.5rem'}}>
                                <Grid cols={11} gap={'l'}>
                                    <GridItem col={7} style={{margin: '2.5rem 0'}}>
                                        <SearchFeature/>
                                    </GridItem>
                                    <GridItem col={4} direction={'column'} style={{margin: '1.5rem 0'}}>
                                        <Text size="xl" view={"success"}>Сегодня</Text>
                                        <div onClick={() => setIsCalendarOpen(prev => !prev)}><Text size="2xl"
                                                                                                    view={"success"}
                                                                                                    cursor={'pointer'}
                                                                                                    className={cx.dateContainer}
                                        >{moment().locale('ru').format('ddd, MMMM D YYYY')}<FaCaretDown
                                            size={14}/>
                                            <DateTime type="date"
                                                      className={`${cx.date} ${isCalendarOpen ? cx.open : ''}`}/>
                                        </Text></div>

                                    </GridItem>
                                </Grid>
                                {children}
                            </GridItem>

                        </Grid>
                    </SafeHydrate>
                </Theme>
                <ReactQueryDevtools/>
            </QueryClientProvider>
        </ConfigProvider>
        </body>
        </html>
    );
}
