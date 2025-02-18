'use client'

// import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {presetGpnDefault, Theme, ThemePreset,} from "@consta/uikit/Theme";
import {LayoutExampleBig} from "@/ui/Header/Header";
import React from "react";
import {TravelMenu} from "@/ui/Menu/Menu";
import '@consta/themes/Theme_color_highlightsGreenDefault';
import {Layout} from '@consta/uikit/Layout';
import {Grid, GridItem} from "@consta/uikit/Grid";
import "./globals.css";
import './lib/zIndexes.css'

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
// const myPreset: ThemePreset = {
//     ...presetGpnDefault,
//     color: {
//         primary: 'statusAlertDefault',
//         invert: 'statusAlertDark',
//         accent: 'statusAlertDark',
//     },
// };
console.log(presetGpnDefault);
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
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <Theme preset={preset}><LayoutExampleBig/>
            <Grid cols={24}>
                <GridItem col={2} style={{borderRight: '1px solid var(--color-bg-border)'}}>
                    <TravelMenu/>
                </GridItem>
                <GridItem col={22} style={{marginLeft: '2.5rem'}}>
                    {children}
                </GridItem>

            </Grid>
        </Theme>
        </body>
        </html>
    );
}
