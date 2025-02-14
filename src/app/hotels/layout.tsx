"use client";
import {Button} from "@consta/uikit/Button";
import {IconForward} from "@consta/icons/IconForward";

export default async function Layout(props: {
    children: React.ReactNode;
    params: Promise<{ categorySlug: string }>;
}) {
    const {children} = props;

    return (
        <div className="space-y-9">
            <div className="flex justify-between">
                <Button label="Продолжить" iconRight={IconForward}/></div>

            {/*<div>{JSON.stringify(props ?? 'props is empty')}</div>*/}
            <div>{children}</div>
        </div>
    );
}
