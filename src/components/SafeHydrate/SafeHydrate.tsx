import {ReactNode} from "react";

export function SafeHydrate({children}: { children: ReactNode }) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}
