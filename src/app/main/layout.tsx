'use client'
import { SearchFeature } from '@/features/Search/ui/Search'
import { THEME_PRESET } from '@/shared/config/theme'
import { useAuth } from '@/shared/lib/useAuth'
import { useScreenSize } from '@/shared/lib/useScreenSize'
import { $hotelsFilter } from '@/shared/models/hotels'
import { setIsMobile } from '@/shared/models/mobile'
import { TravelMenu } from '@/shared/ui/Menu/Menu'
import { LayoutExampleBig } from '@/ui/Header/Header'
import { Theme } from '@consta/uikit/Theme'
import { Drawer } from 'antd'
import { useUnit } from 'effector-react/compat'
import moment from 'moment/moment'
import { usePathname } from 'next/navigation'
import React, { useLayoutEffect, useState } from 'react'
import styles from './layout.module.scss'

export interface LayoutProps {
  children?: React.ReactNode
  className?: string
}

moment.locale('ru')

export default function MainLayout({ children }: LayoutProps) {
  useAuth()
  const currentDate = moment().locale('ru').format('dddd, D MMMM YYYY')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isReservationSlug = usePathname().includes('reservation/')
  const filter = useUnit($hotelsFilter)
  const [onSetIsMobile] = useUnit([setIsMobile])
  const { isMobile } = useScreenSize()

  const onToggleFilter = (state: boolean) => {
    setIsFilterOpen(state)
  }
  useLayoutEffect(() => {
    onSetIsMobile(isMobile)
  }, [isMobile])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <LayoutExampleBig />{' '}
      </div>
      <div className={styles.sidebar}>
        <TravelMenu />
      </div>
      <div className={styles.content}>
        {isMobile ? (
          <Drawer
            title="Фильтр"
            placement={'bottom'}
            open={isFilterOpen}
            onClose={() => onToggleFilter(false)}
          >
            <Theme preset={THEME_PRESET}>
              <SearchFeature onSearchCb={() => onToggleFilter(false)} />
            </Theme>
          </Drawer>
        ) : (
          <div className={styles.searchContainer}>
            {!isReservationSlug && <SearchFeature />}
          </div>
        )}
        <div className={styles.childrenContainer}>{children}</div>
      </div>
    </div>
  )
}
