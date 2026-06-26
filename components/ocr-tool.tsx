'use client'

import * as React from 'react'
import {
  makeStyles,
  mergeClasses,
  tokens,
  Title3,
  Body1,
  Body1Strong,
  Caption1,
  Button,
  Spinner,
  MessageBar,
  MessageBarBody,
  Textarea,
  Switch,
  Badge,
  Tooltip,
  Divider,
  Dropdown,
  Option,
  Field,
  Link,
} from '@fluentui/react-components'
import {
  ArrowUpload24Regular,
  ImageAdd24Regular,
  ImageMultiple24Regular,
  ClipboardPaste24Regular,
  Copy24Regular,
  Checkmark24Regular,
  Dismiss20Regular,
  Delete20Regular,
  WeatherMoon20Regular,
  WeatherSunny20Regular,
  ScanText24Regular,
  ArrowClockwise20Regular,
  ArrowDownload24Regular,
  CheckmarkCircle20Filled,
  ErrorCircle20Filled,
  Clock20Regular,
} from '@fluentui/react-icons'
import { useThemeMode } from '@/app/providers'

type Status = 'ready' | 'queued' | 'processing' | 'done' | 'error'
// How Nemotron OCR groups detected text before returning it. Sent to the
// model as `merge_levels` — it changes what each returned line represents.
type MergeLevel = 'word' | 'sentence' | 'paragraph'
type Line = { id: number; text: string; confidence: number }

const MERGE_LEVELS: { value: MergeLevel; label: string; hint: string }[] = [
  { value: 'word', label: 'Word', hint: 'One entry per detected word' },
  { value: 'sentence', label: 'Sentence', hint: 'Group words into sentences' },
  {
    value: 'paragraph',
    label: 'Paragraph',
    hint: 'Group lines into paragraph blocks',
  },
]

const MERGE_LABELS: Record<MergeLevel, string> = {
  word: 'Word',
  sentence: 'Sentence',
  paragraph: 'Paragraph',
}

// Custom OpenFreeOCR mark: a scan frame with text lines, drawn with
// currentColor so it inherits the surrounding brand color.
function OpenFreeOcrLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="OpenFreeOCR logo"
    >
      <path
        d="M9 3H6.5A3.5 3.5 0 0 0 3 6.5V9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M23 3h2.5A3.5 3.5 0 0 1 29 6.5V9"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M29 23v2.5A3.5 3.5 0 0 1 25.5 29H23"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M9 29H6.5A3.5 3.5 0 0 1 3 25.5V23"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect x="8.5" y="11" width="15" height="2.6" rx="1.3" fill="currentColor" />
      <rect
        x="8.5"
        y="16"
        width="10.5"
        height="2.6"
        rx="1.3"
        fill="currentColor"
        opacity="0.7"
      />
      <rect
        x="8.5"
        y="21"
        width="13"
        height="2.6"
        rx="1.3"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  )
}
type Item = {
  id: string
  fileName: string
  preview: string
  status: Status
  text: string
  lines: Line[]
  mergeLevel: MergeLevel
  error?: string
}

const MAX_DIMENSION = 1600
const CONCURRENCY = 3

function borderAll(width: string, style: 'solid' | 'dashed', color: string) {
  return {
    borderTopWidth: width,
    borderRightWidth: width,
    borderBottomWidth: width,
    borderLeftWidth: width,
    borderTopStyle: style,
    borderRightStyle: style,
    borderBottomStyle: style,
    borderLeftStyle: style,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
  }
}

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    overflow: 'hidden',
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
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
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
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: tokens.lineHeightBase200,
  },
  wordmark: {
    letterSpacing: '-0.01em',
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  body: {
    display: 'flex',
    flexGrow: 1,
    minHeight: 0,
    '@media (max-width: 820px)': {
      flexDirection: 'column',
    },
  },
  sidebar: {
    width: '320px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    borderRightWidth: tokens.strokeWidthThin,
    borderRightStyle: 'solid',
    borderRightColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 820px)': {
      width: '100%',
      maxHeight: '42dvh',
      borderRightWidth: 0,
      borderBottomWidth: tokens.strokeWidthThin,
      borderBottomStyle: 'solid',
      borderBottomColor: tokens.colorNeutralStroke2,
    },
  },
  sidebarActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    paddingTop: tokens.spacingVerticalM,
    paddingBottom: tokens.spacingVerticalM,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
  },
  actionRow: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  grow: { flexGrow: 1 },
  queueHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  queue: {
    flexGrow: 1,
    overflowY: 'auto',
    minHeight: 0,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    paddingBottom: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  sidebarFooter: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalM,
    borderTopWidth: tokens.strokeWidthThin,
    borderTopStyle: 'solid',
    borderTopColor: tokens.colorNeutralStroke2,
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    color: tokens.colorNeutralForeground3,
  },
  footerNote: {
    color: tokens.colorNeutralForeground4,
  },
  queueItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    ...borderAll(tokens.strokeWidthThin, 'solid', 'transparent'),
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  queueItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ...borderAll(tokens.strokeWidthThin, 'solid', tokens.colorBrandStroke1),
    ':hover': { backgroundColor: tokens.colorBrandBackground2 },
  },
  thumb: {
    width: '42px',
    height: '42px',
    flexShrink: 0,
    borderRadius: tokens.borderRadiusSmall,
    objectFit: 'cover',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  thumbPlaceholder: {
    width: '42px',
    height: '42px',
    flexShrink: 0,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorNeutralForeground4,
  },
  queueMeta: {
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  queueName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    color: tokens.colorNeutralForeground3,
  },
  statusDone: { color: tokens.colorPaletteGreenForeground1 },
  statusError: { color: tokens.colorPaletteRedForeground1 },
  removeBtn: { flexShrink: 0 },
  detail: {
    flexGrow: 1,
    minWidth: 0,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  detailInner: {
    width: '100%',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    paddingTop: tokens.spacingVerticalL,
    paddingBottom: tokens.spacingVerticalXXL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  // Empty canvas
  canvas: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingHorizontalXL,
    backgroundColor: tokens.colorNeutralBackground2,
    backgroundImage: `radial-gradient(${tokens.colorNeutralStroke2} 1px, transparent 1px)`,
    backgroundSize: '22px 22px',
  },
  dropCard: {
    width: '100%',
    maxWidth: '520px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    textAlign: 'center',
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
    paddingLeft: tokens.spacingHorizontalXL,
    paddingRight: tokens.spacingHorizontalXL,
    borderRadius: tokens.borderRadiusXLarge,
    ...borderAll(tokens.strokeWidthThick, 'dashed', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  dropIconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  // Detail header
  detailHead: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  detailTitle: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
  },
  detailActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
  },
  previewWrap: {
    position: 'relative',
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
    ...borderAll(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground3,
  },
  previewImg: {
    display: 'block',
    width: '100%',
    maxHeight: '320px',
    objectFit: 'contain',
  },
  // Output editor
  editor: {
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
    ...borderAll(tokens.strokeWidthThin, 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  editorBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalM,
    paddingRight: tokens.spacingHorizontalS,
    borderBottomWidth: tokens.strokeWidthThin,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  editorStats: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
  },
  editorBody: {
    maxHeight: '440px',
    overflowY: 'auto',
  },
  lineRow: {
    display: 'grid',
    gridTemplateColumns: '44px 1fr auto',
    alignItems: 'baseline',
    gap: tokens.spacingHorizontalM,
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalXS,
    paddingRight: tokens.spacingHorizontalM,
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
  },
  gutter: {
    textAlign: 'right',
    paddingRight: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground4,
    fontFamily: tokens.fontFamilyMonospace,
    userSelect: 'none',
    borderRightWidth: tokens.strokeWidthThin,
    borderRightStyle: 'solid',
    borderRightColor: tokens.colorNeutralStroke2,
  },
  lineText: {
    fontFamily: tokens.fontFamilyMonospace,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  groupControl: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  groupLabel: {
    color: tokens.colorNeutralForeground3,
    whiteSpace: 'nowrap',
  },
  groupDropdown: {
    minWidth: '150px',
  },
  queueDropdown: {
    minWidth: 'unset',
    marginTop: tokens.spacingVerticalXXS,
  },
  plainArea: {
    width: '100%',
  },
  loadingBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacingVerticalM,
    minHeight: '220px',
  },
  readyBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: tokens.spacingVerticalM,
    minHeight: '220px',
    justifyContent: 'center',
    paddingLeft: tokens.spacingHorizontalL,
    paddingRight: tokens.spacingHorizontalL,
  },
  dragOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorBackgroundOverlay,
    pointerEvents: 'none',
  },
  dragOverlayCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalXXL,
    paddingBottom: tokens.spacingVerticalXXL,
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
    borderRadius: tokens.borderRadiusXLarge,
    ...borderAll(tokens.strokeWidthThick, 'dashed', tokens.colorBrandStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorBrandForeground1,
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
  },
})

function confidenceColor(c: number): 'success' | 'warning' | 'danger' {
  if (c >= 0.9) return 'success'
  if (c >= 0.7) return 'warning'
  return 'danger'
}

async function fileToResizedDataUrl(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Could not read the image file.'))
      image.src = objectUrl
    })

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
    )
    const width = Math.max(1, Math.round(img.naturalWidth * scale))
    const height = Math.max(1, Math.round(img.naturalHeight * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas is not supported in this browser.')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)

    let quality = 0.92
    let dataUrl = canvas.toDataURL('image/jpeg', quality)
    while (dataUrl.length > 180_000 && quality > 0.3) {
      quality -= 0.1
      dataUrl = canvas.toDataURL('image/jpeg', quality)
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

let idSeq = 0
function nextId() {
  idSeq += 1
  return `img-${Date.now()}-${idSeq}`
}

function StatusIndicator({ item }: { item: Item }) {
  const styles = useStyles()
  if (item.status === 'processing') {
    return (
      <div className={styles.statusRow}>
        <Spinner size="extra-tiny" />
        <Caption1>Reading…</Caption1>
      </div>
    )
  }
  if (item.status === 'ready') {
    return (
      <div className={styles.statusRow}>
        <Clock20Regular />
        <Caption1>Ready · {MERGE_LABELS[item.mergeLevel]}</Caption1>
      </div>
    )
  }
  if (item.status === 'queued') {
    return (
      <div className={styles.statusRow}>
        <Clock20Regular />
        <Caption1>Queued</Caption1>
      </div>
    )
  }
  if (item.status === 'error') {
    return (
      <div className={mergeClasses(styles.statusRow, styles.statusError)}>
        <ErrorCircle20Filled />
        <Caption1>Failed</Caption1>
      </div>
    )
  }
  return (
    <div className={mergeClasses(styles.statusRow, styles.statusDone)}>
      <CheckmarkCircle20Filled />
      <Caption1>
        {item.lines.length} {item.lines.length === 1 ? 'line' : 'lines'}
      </Caption1>
    </div>
  )
}

export function OcrTool() {
  const styles = useStyles()
  const { mode, setMode } = useThemeMode()
  const isDark = mode === 'dark'

  const [items, setItems] = React.useState<Item[]>([])
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [showConfidence, setShowConfidence] = React.useState(true)
  const [mergeLevel, setMergeLevel] = React.useState<MergeLevel>('paragraph')
  const [copied, setCopied] = React.useState(false)
  const [notice, setNotice] = React.useState<string | null>(null)
  const [dragActive, setDragActive] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const itemsRef = React.useRef<Item[]>([])
  React.useEffect(() => {
    itemsRef.current = items
  }, [items])
  const activeRef = React.useRef(0)
  const queueRef = React.useRef<
    { id: string; dataUrl: string; level: MergeLevel }[]
  >([])
  const dragDepth = React.useRef(0)

  const updateItem = React.useCallback(
    (id: string, patch: Partial<Item>) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      )
    },
    [],
  )

  const processOne = React.useCallback(
    async (id: string, dataUrl: string, level: MergeLevel) => {
      updateItem(id, { status: 'processing', error: undefined, mergeLevel: level })
      try {
        const res = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageDataUrl: dataUrl, mergeLevel: level }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? 'Something went wrong.')
        const lines: Line[] = Array.isArray(data.lines) ? data.lines : []
        updateItem(id, {
          status: 'done',
          text: data.text ?? '',
          lines,
          error: lines.length === 0 ? 'No text detected in this image.' : undefined,
        })
      } catch (e) {
        updateItem(id, {
          status: 'error',
          error: e instanceof Error ? e.message : 'Something went wrong.',
        })
      }
    },
    [updateItem],
  )

  const pump = React.useCallback(() => {
    while (activeRef.current < CONCURRENCY && queueRef.current.length > 0) {
      const job = queueRef.current.shift()!
      activeRef.current += 1
      void processOne(job.id, job.dataUrl, job.level).finally(() => {
        activeRef.current -= 1
        pump()
      })
    }
  }, [processOne])

  const enqueue = React.useCallback(
    (id: string, dataUrl: string, level: MergeLevel) => {
      queueRef.current.push({ id, dataUrl, level })
      pump()
    },
    [pump],
  )

  const addFiles = React.useCallback(
    async (files: File[]) => {
      const images = files.filter((f) => f.type.startsWith('image/'))
      if (images.length === 0) {
        setNotice('Those files were not images. Try PNG, JPG, or WEBP.')
        return
      }
      setNotice(null)
      const created = images.map((f) => ({
        id: nextId(),
        fileName: f.name || 'pasted-image.png',
        preview: '',
        status: 'ready' as Status,
        text: '',
        lines: [] as Line[],
        mergeLevel,
      }))
      setItems((prev) => [...prev, ...created])
      setSelectedId((cur) => cur ?? created[0].id)

      // Load previews only — images wait as "ready" until the user starts them,
      // so grouping can be chosen (globally or per image) before processing.
      await Promise.all(
        created.map(async (item, i) => {
          try {
            const dataUrl = await fileToResizedDataUrl(images[i])
            updateItem(item.id, { preview: dataUrl })
          } catch (e) {
            updateItem(item.id, {
              status: 'error',
              error: e instanceof Error ? e.message : 'Could not read the image.',
            })
          }
        }),
      )
    },
    [updateItem, mergeLevel],
  )

  // Re-run OCR for a single item at a new merge level, reusing its image.
  const rerunItem = React.useCallback(
    (id: string, level: MergeLevel) => {
      const item = itemsRef.current.find((it) => it.id === id)
      if (!item || !item.preview) return
      updateItem(id, { status: 'queued' })
      enqueue(id, item.preview, level)
    },
    [enqueue, updateItem],
  )

  // Change the global grouping default and apply it to every ready (not yet
  // started) image at once.
  const setAllLevel = React.useCallback((level: MergeLevel) => {
    setMergeLevel(level)
    setItems((prev) =>
      prev.map((it) => (it.status === 'ready' ? { ...it, mergeLevel: level } : it)),
    )
  }, [])

  // Change grouping for a single ready image before it starts.
  const setItemLevel = React.useCallback(
    (id: string, level: MergeLevel) => updateItem(id, { mergeLevel: level }),
    [updateItem],
  )

  // Start every ready image, each at its own chosen grouping level.
  const startAll = React.useCallback(() => {
    const ready = itemsRef.current.filter(
      (it) => it.status === 'ready' && it.preview,
    )
    if (ready.length === 0) return
    setItems((prev) =>
      prev.map((it) =>
        it.status === 'ready' && it.preview ? { ...it, status: 'queued' } : it,
      ),
    )
    for (const it of ready) enqueue(it.id, it.preview, it.mergeLevel)
  }, [enqueue])

  // Global paste-to-add support.
  React.useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? [])
      const images = files.filter((f) => f.type.startsWith('image/'))
      if (images.length > 0) {
        e.preventDefault()
        void addFiles(images)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [addFiles])

  const pasteFromButton = React.useCallback(async () => {
    try {
      if (!navigator.clipboard?.read) {
        setNotice('Clipboard paste is not supported here. Press Ctrl/Cmd+V instead.')
        return
      }
      const clipboardItems = await navigator.clipboard.read()
      const files: File[] = []
      for (const ci of clipboardItems) {
        const type = ci.types.find((t) => t.startsWith('image/'))
        if (type) {
          const blob = await ci.getType(type)
          files.push(new File([blob], `pasted-${Date.now()}.png`, { type }))
        }
      }
      if (files.length === 0) {
        setNotice('No image found on the clipboard. Copy an image first.')
        return
      }
      await addFiles(files)
    } catch {
      setNotice('Could not read the clipboard. Press Ctrl/Cmd+V instead.')
    }
  }, [addFiles])

  const removeItem = React.useCallback(
    (id: string) => {
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id)
        setSelectedId((cur) =>
          cur === id ? (next.length ? next[next.length - 1].id : null) : cur,
        )
        return next
      })
    },
    [],
  )

  const clearAll = React.useCallback(() => {
    queueRef.current = []
    setItems([])
    setSelectedId(null)
    setNotice(null)
  }, [])

  const selected = items.find((it) => it.id === selectedId) ?? null

  const copyText = React.useCallback(async () => {
    if (!selected?.text) return
    try {
      await navigator.clipboard.writeText(selected.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setNotice('Could not copy to clipboard.')
    }
  }, [selected])

  const downloadText = React.useCallback(
    (item: Item) => {
      const blob = new Blob([item.text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download =
        (item.fileName.replace(/\.[^.]+$/, '') || 'extracted-text') + '.txt'
      a.click()
      URL.revokeObjectURL(url)
    },
    [],
  )

  const downloadAll = React.useCallback(() => {
    const done = items.filter((it) => it.status === 'done' && it.text)
    if (done.length === 0) return
    const combined = done
      .map((it) => `===== ${it.fileName} =====\n${it.text}`)
      .join('\n\n')
    const blob = new Blob([combined], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'extracted-text-batch.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [items])

  // Drag-and-drop anywhere in the app.
  const onDragEnter = React.useCallback((e: React.DragEvent) => {
    if (!Array.from(e.dataTransfer.types).includes('Files')) return
    dragDepth.current += 1
    setDragActive(true)
  }, [])
  const onDragLeave = React.useCallback(() => {
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragActive(false)
  }, [])
  const onDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dragDepth.current = 0
      setDragActive(false)
      void addFiles(Array.from(e.dataTransfer.files ?? []))
    },
    [addFiles],
  )

  const doneCount = items.filter((it) => it.status === 'done').length
  const readyCount = items.filter((it) => it.status === 'ready').length
  const avgConfidence =
    selected && selected.lines.length > 0
      ? selected.lines.reduce((s, l) => s + l.confidence, 0) /
        selected.lines.length
      : 0

  return (
    <div
      className={styles.shell}
      onDragEnter={onDragEnter}
      onDragOver={(e) => {
        if (Array.from(e.dataTransfer.types).includes('Files')) e.preventDefault()
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden>
            <OpenFreeOcrLogo size={20} />
          </span>
          <div className={styles.brandText}>
            <Body1Strong className={styles.wordmark}>OpenFreeOCR</Body1Strong>
            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
              powered by NVIDIA
            </Caption1>
          </div>
        </div>
        <div className={styles.topActions}>
          {doneCount > 0 && (
            <Tooltip content="Download all results as one .txt" relationship="label">
              <Button
                appearance="subtle"
                icon={<ArrowDownload24Regular />}
                onClick={downloadAll}
              >
                Export all
              </Button>
            </Tooltip>
          )}
          <Tooltip
            content={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            relationship="label"
          >
            <Button
              appearance="subtle"
              icon={isDark ? <WeatherSunny20Regular /> : <WeatherMoon20Regular />}
              onClick={() => setMode(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
            />
          </Tooltip>
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarActions}>
            <Button
              appearance="primary"
              icon={<ImageAdd24Regular />}
              onClick={() => inputRef.current?.click()}
            >
              Add images
            </Button>
            <div className={styles.actionRow}>
              <Button
                className={styles.grow}
                appearance="secondary"
                icon={<ClipboardPaste24Regular />}
                onClick={pasteFromButton}
              >
                Paste
              </Button>
              {items.length > 0 && (
                <Tooltip content="Remove all images" relationship="label">
                  <Button
                    appearance="secondary"
                    icon={<Delete20Regular />}
                    onClick={clearAll}
                    aria-label="Clear all"
                  />
                </Tooltip>
              )}
            </div>
            {notice && (
              <MessageBar intent="warning">
                <MessageBarBody>{notice}</MessageBarBody>
              </MessageBar>
            )}

            <Field label="Group text by (applies to all pending)" size="small">
              <Dropdown
                size="small"
                value={MERGE_LABELS[mergeLevel]}
                selectedOptions={[mergeLevel]}
                onOptionSelect={(_, d) =>
                  setAllLevel((d.optionValue as MergeLevel) ?? 'paragraph')
                }
                aria-label="Group text by for all pending images"
              >
                {MERGE_LEVELS.map((m) => (
                  <Option key={m.value} value={m.value} text={m.label}>
                    {m.label}
                  </Option>
                ))}
              </Dropdown>
            </Field>

            {readyCount > 0 && (
              <Button
                appearance="primary"
                icon={<ScanText24Regular />}
                onClick={startAll}
              >
                {`Extract text (${readyCount})`}
              </Button>
            )}
          </div>

          <Divider />

          <div className={styles.queueHead}>
            <Caption1>Queue</Caption1>
            <Caption1>
              {items.length > 0 ? `${doneCount}/${items.length} done` : 'empty'}
            </Caption1>
          </div>

          <div className={styles.queue}>
            {items.length === 0 ? (
              <Caption1
                style={{
                  color: tokens.colorNeutralForeground4,
                  paddingTop: tokens.spacingVerticalS,
                }}
              >
                Add or paste images to build a batch. Pick a grouping, then
                press Extract text to process them.
              </Caption1>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={mergeClasses(
                    styles.queueItem,
                    item.id === selectedId && styles.queueItemActive,
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedId(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedId(item.id)
                    }
                  }}
                >
                  {item.preview ? (
                    <img
                      src={item.preview || '/placeholder.svg'}
                      alt=""
                      className={styles.thumb}
                    />
                  ) : (
                    <span className={styles.thumbPlaceholder} aria-hidden>
                      <ImageMultiple24Regular />
                    </span>
                  )}
                  <div className={styles.queueMeta}>
                    <Caption1 className={styles.queueName}>
                      {item.fileName}
                    </Caption1>
                    <StatusIndicator item={item} />
                    {item.status === 'ready' && (
                      <Dropdown
                        className={styles.queueDropdown}
                        size="small"
                        value={MERGE_LABELS[item.mergeLevel]}
                        selectedOptions={[item.mergeLevel]}
                        onClick={(e) => e.stopPropagation()}
                        onOptionSelect={(_, d) =>
                          setItemLevel(
                            item.id,
                            (d.optionValue as MergeLevel) ?? 'paragraph',
                          )
                        }
                        aria-label={`Group text by for ${item.fileName}`}
                      >
                        {MERGE_LEVELS.map((m) => (
                          <Option key={m.value} value={m.value} text={m.label}>
                            {m.label}
                          </Option>
                        ))}
                      </Dropdown>
                    )}
                  </div>
                  <Tooltip content="Remove" relationship="label">
                    <Button
                      className={styles.removeBtn}
                      appearance="subtle"
                      size="small"
                      icon={<Dismiss20Regular />}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      aria-label={`Remove ${item.fileName}`}
                    />
                  </Tooltip>
                </div>
              ))
            )}
          </div>

          <div className={styles.sidebarFooter}>
            <div className={styles.footerLinks}>
              <Link href="/privacy">Privacy</Link>
              <span aria-hidden>·</span>
              <Link href="/terms">Terms</Link>
            </div>
            <Caption1 className={styles.footerNote}>
              © {new Date().getFullYear()} openfreeocr.online · Powered by NVIDIA
            </Caption1>
          </div>
        </aside>

        <main className={styles.detail}>
          {!selected ? (
            <div className={styles.canvas}>
              <div className={styles.dropCard}>
                <span className={styles.dropIconWrap} aria-hidden>
                  <OpenFreeOcrLogo size={34} />
                </span>
                <Title3>Drop, paste, or upload an image</Title3>
                <Body1 style={{ color: tokens.colorNeutralForeground2 }}>
                  Extract clean, copyable text from photos, screenshots, and
                  scans. Add several at once for batch processing — everything is
                  read securely and never stored.
                </Body1>
                <div className={styles.actionRow}>
                  <Button
                    appearance="primary"
                    icon={<ArrowUpload24Regular />}
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload images
                  </Button>
                  <Button
                    appearance="secondary"
                    icon={<ClipboardPaste24Regular />}
                    onClick={pasteFromButton}
                  >
                    Paste from clipboard
                  </Button>
                </div>
                <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                  Tip: press Ctrl / Cmd + V anywhere to paste a screenshot.
                </Caption1>
              </div>
            </div>
          ) : (
            <div className={styles.detailInner}>
              <div className={styles.detailHead}>
                <div className={styles.detailTitle}>
                  <Title3>{selected.fileName}</Title3>
                  <StatusIndicator item={selected} />
                </div>
                <div className={styles.detailActions}>
                  {(selected.status === 'done' || selected.status === 'error') && (
                    <Tooltip content="Re-run OCR" relationship="label">
                      <Button
                        appearance="subtle"
                        icon={<ArrowClockwise20Regular />}
                        onClick={() =>
                          rerunItem(selected.id, selected.mergeLevel)
                        }
                        disabled={!selected.preview}
                      >
                        Re-run
                      </Button>
                    </Tooltip>
                  )}
                  <Button
                    appearance="subtle"
                    icon={<Delete20Regular />}
                    onClick={() => removeItem(selected.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {selected.preview && (
                <div className={styles.previewWrap}>
                  <img
                    src={selected.preview || '/placeholder.svg'}
                    alt={`Preview of ${selected.fileName}`}
                    className={styles.previewImg}
                  />
                </div>
              )}

              {selected.status === 'error' && (
                <MessageBar intent="error">
                  <MessageBarBody>{selected.error}</MessageBarBody>
                </MessageBar>
              )}

              <div className={styles.editor}>
                <div className={styles.editorBar}>
                  <div className={styles.editorStats}>
                    <Body1Strong>Extracted text</Body1Strong>
                    {selected.lines.length > 0 && (
                      <>
                        <Badge appearance="tint" color="informative">
                          {selected.lines.length}{' '}
                          {selected.lines.length === 1 ? 'line' : 'lines'}
                        </Badge>
                        <Badge
                          appearance="tint"
                          color={confidenceColor(avgConfidence)}
                        >
                          {Math.round(avgConfidence * 100)}% avg
                        </Badge>
                      </>
                    )}
                  </div>
                  <div className={styles.editorStats}>
                    {selected.lines.length > 0 && (
                      <>
                        <div className={styles.groupControl}>
                          <Caption1 className={styles.groupLabel}>
                            Group text by
                          </Caption1>
                          <Dropdown
                            className={styles.groupDropdown}
                            size="small"
                            value={MERGE_LABELS[selected.mergeLevel]}
                            selectedOptions={[selected.mergeLevel]}
                            onOptionSelect={(_, d) => {
                              const level =
                                (d.optionValue as MergeLevel) ?? 'paragraph'
                              setMergeLevel(level)
                              rerunItem(selected.id, level)
                            }}
                            aria-label="Group text by"
                          >
                            {MERGE_LEVELS.map((m) => (
                              <Option
                                key={m.value}
                                value={m.value}
                                text={m.label}
                              >
                                {m.label}
                              </Option>
                            ))}
                          </Dropdown>
                        </div>
                        <Switch
                          checked={showConfidence}
                          onChange={(_, d) => setShowConfidence(d.checked)}
                          label="Confidence"
                        />
                        <Tooltip
                          content={copied ? 'Copied' : 'Copy text'}
                          relationship="label"
                        >
                          <Button
                            appearance="subtle"
                            icon={
                              copied ? <Checkmark24Regular /> : <Copy24Regular />
                            }
                            onClick={copyText}
                            aria-label="Copy text"
                          />
                        </Tooltip>
                        <Tooltip content="Download .txt" relationship="label">
                          <Button
                            appearance="subtle"
                            icon={<ArrowDownload24Regular />}
                            onClick={() => downloadText(selected)}
                            aria-label="Download text"
                          />
                        </Tooltip>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.editorBody}>
                  {selected.status === 'ready' ? (
                    <div className={styles.readyBox}>
                      <Body1 style={{ color: tokens.colorNeutralForeground2 }}>
                        Ready to extract. Choose how detected text should be
                        grouped, then run it.
                      </Body1>
                      <div className={styles.groupControl}>
                        <Caption1 className={styles.groupLabel}>
                          Group text by
                        </Caption1>
                        <Dropdown
                          className={styles.groupDropdown}
                          size="small"
                          value={MERGE_LABELS[selected.mergeLevel]}
                          selectedOptions={[selected.mergeLevel]}
                          onOptionSelect={(_, d) =>
                            setItemLevel(
                              selected.id,
                              (d.optionValue as MergeLevel) ?? 'paragraph',
                            )
                          }
                          aria-label="Group text by"
                        >
                          {MERGE_LEVELS.map((m) => (
                            <Option key={m.value} value={m.value} text={m.label}>
                              {m.label}
                            </Option>
                          ))}
                        </Dropdown>
                      </div>
                      <Button
                        appearance="primary"
                        icon={<ScanText24Regular />}
                        onClick={() =>
                          rerunItem(selected.id, selected.mergeLevel)
                        }
                        disabled={!selected.preview}
                      >
                        Extract this image
                      </Button>
                    </div>
                  ) : selected.status === 'processing' ||
                    selected.status === 'queued' ? (
                    <div className={styles.loadingBox}>
                      <Spinner
                        size="large"
                        label={
                          selected.status === 'queued'
                            ? 'Waiting in queue…'
                            : 'Reading your image…'
                        }
                      />
                    </div>
                  ) : selected.lines.length > 0 ? (
                    showConfidence ? (
                      <div>
                        {selected.lines.map((line) => (
                          <div key={line.id} className={styles.lineRow}>
                            <span className={styles.gutter}>{line.id}</span>
                            <span className={styles.lineText}>{line.text}</span>
                            <Badge
                              appearance="tint"
                              color={confidenceColor(line.confidence)}
                            >
                              {Math.round(line.confidence * 100)}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Textarea
                        className={styles.plainArea}
                        value={selected.text}
                        onChange={(_, d) =>
                          updateItem(selected.id, { text: d.value })
                        }
                        resize="vertical"
                        textarea={{ style: { minHeight: '220px' } }}
                      />
                    )
                  ) : (
                    <div className={styles.loadingBox}>
                      <Body1 style={{ color: tokens.colorNeutralForeground3 }}>
                        No text detected in this image.
                      </Body1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className={styles.srOnly}
        onChange={(e) => {
          void addFiles(Array.from(e.target.files ?? []))
          if (inputRef.current) inputRef.current.value = ''
        }}
      />

      {dragActive && (
        <div className={styles.dragOverlay}>
          <div className={styles.dragOverlayCard}>
            <ImageAdd24Regular fontSize={40} />
            <Title3>Drop images to extract text</Title3>
          </div>
        </div>
      )}
    </div>
  )
}
