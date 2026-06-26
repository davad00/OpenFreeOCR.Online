'use client'

import * as React from 'react'
import {
  FluentProvider,
  SSRProvider,
  RendererProvider,
  createDOMRenderer,
  renderToStyleElements,
  createLightTheme,
  createDarkTheme,
  type BrandVariants,
} from '@fluentui/react-components'
import { useServerInsertedHTML } from 'next/navigation'

// A custom emerald/ink brand ramp so the app has its own identity
// instead of the default Fluent blue.
const brand: BrandVariants = {
  10: '#02130F',
  20: '#04211B',
  30: '#053227',
  40: '#074332',
  50: '#08543F',
  60: '#09654C',
  70: '#0A7359',
  80: '#0A7F66',
  90: '#149B7E',
  100: '#2DB397',
  110: '#4FC4AB',
  120: '#71D1BC',
  130: '#93DDCC',
  140: '#B5E9DC',
  150: '#D5F2EA',
  160: '#EEFAF6',
}

const lightTheme = createLightTheme(brand)
const darkTheme = createDarkTheme(brand)
// Sharpen the dark-theme accent so primary actions stay vivid on dark surfaces.
darkTheme.colorBrandForeground1 = brand[110]
darkTheme.colorBrandForeground2 = brand[120]

type ThemeMode = 'light' | 'dark'

const ThemeModeContext = React.createContext<{
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}>({ mode: 'light', setMode: () => {} })

export function useThemeMode() {
  return React.useContext(ThemeModeContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [renderer] = React.useState(() => createDOMRenderer())
  const didRenderRef = React.useRef(false)
  const [mode, setMode] = React.useState<ThemeMode>('light')

  useServerInsertedHTML(() => {
    if (didRenderRef.current) {
      return
    }
    didRenderRef.current = true
    return <>{renderToStyleElements(renderer)}</>
  })

  return (
    <RendererProvider renderer={renderer}>
      <SSRProvider>
        <ThemeModeContext.Provider value={{ mode, setMode }}>
          <FluentProvider
            theme={mode === 'light' ? lightTheme : darkTheme}
            id="__fluent-root"
          >
            {children}
          </FluentProvider>
        </ThemeModeContext.Provider>
      </SSRProvider>
    </RendererProvider>
  )
}
