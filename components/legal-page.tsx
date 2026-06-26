'use client'

import * as React from 'react'
import {
  makeStyles,
  tokens,
  Title1,
  Title3,
  Body1,
  Body1Strong,
  Caption1,
  Button,
  Link,
  Divider,
} from '@fluentui/react-components'
import {
  ArrowLeft20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
} from '@fluentui/react-icons'
import NextLink from 'next/link'
import { useThemeMode } from '@/app/providers'

function OpenFreeOcrLogo({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="OpenFreeOCR logo"
    >
      <path d="M9 3H6.5A3.5 3.5 0 0 0 3 6.5V9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M23 3h2.5A3.5 3.5 0 0 1 29 6.5V9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M29 23v2.5A3.5 3.5 0 0 1 25.5 29H23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 29H6.5A3.5 3.5 0 0 1 3 25.5V23" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <rect x="8.5" y="11" width="15" height="2.6" rx="1.3" fill="currentColor" />
      <rect x="8.5" y="16" width="10.5" height="2.6" rx="1.3" fill="currentColor" opacity="0.7" />
      <rect x="8.5" y="21" width="13" height="2.6" rx="1.3" fill="currentColor" opacity="0.45" />
    </svg>
  )
}

const useStyles = makeStyles({
  shell: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    height: '56px',
    flexShrink: 0,
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground1,
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    textDecorationLine: 'none',
    color: tokens.colorNeutralForeground1,
  },
  brandMark: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  main: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '760px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
    paddingTop: tokens.spacingVerticalXXXL,
    paddingBottom: tokens.spacingVerticalXXXL,
    boxSizing: 'border-box',
    '@media (max-width: 600px)': {
      paddingLeft: tokens.spacingHorizontalL,
      paddingRight: tokens.spacingHorizontalL,
      paddingTop: tokens.spacingVerticalXXL,
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    marginBottom: tokens.spacingVerticalXL,
  },
  updated: {
    color: tokens.colorNeutralForeground3,
  },
  intro: {
    color: tokens.colorNeutralForeground2,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXL,
    marginTop: tokens.spacingVerticalXL,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  paragraph: {
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalL,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase400,
  },
  footer: {
    flexShrink: 0,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalL,
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
    borderTopWidth: tokens.strokeWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
    color: tokens.colorNeutralForeground3,
  },
})

export function LegalSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  const styles = useStyles()
  return (
    <section className={styles.section}>
      <Title3 as="h2">{heading}</Title3>
      {children}
    </section>
  )
}

export function LegalParagraph({ children }: { children: React.ReactNode }) {
  const styles = useStyles()
  return <Body1 className={styles.paragraph}>{children}</Body1>
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  const styles = useStyles()
  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li key={i}>
          <Body1>{item}</Body1>
        </li>
      ))}
    </ul>
  )
}

export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  title: string
  updated: string
  intro: string
  children: React.ReactNode
}) {
  const styles = useStyles()
  const { mode, setMode } = useThemeMode()
  const isDark = mode === 'dark'

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <NextLink href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden>
            <OpenFreeOcrLogo size={20} />
          </span>
          <Body1Strong>OpenFreeOCR</Body1Strong>
        </NextLink>
        <div className={styles.topActions}>
          <Button
            as="a"
            href="/"
            appearance="subtle"
            icon={<ArrowLeft20Regular />}
          >
            Back to app
          </Button>
          <Button
            appearance="subtle"
            icon={isDark ? <WeatherSunny20Regular /> : <WeatherMoon20Regular />}
            onClick={() => setMode(isDark ? 'light' : 'dark')}
            aria-label="Toggle theme"
          />
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.header}>
          <Title1 as="h1">{title}</Title1>
          <Caption1 className={styles.updated}>Last updated: {updated}</Caption1>
        </div>
        <Body1 className={styles.intro}>{intro}</Body1>
        <div className={styles.sections}>{children}</div>
      </main>

      <footer className={styles.footer}>
        <Link href="/">Home</Link>
        <span aria-hidden>·</span>
        <Link href="/privacy">Privacy</Link>
        <span aria-hidden>·</span>
        <Link href="/terms">Terms</Link>
        <span aria-hidden>·</span>
        <Caption1>© {new Date().getFullYear()} openfreeocr.online</Caption1>
      </footer>
    </div>
  )
}
