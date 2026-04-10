import { useState, useRef, useEffect } from 'react'
import CasingPromptsOverlay from './CasingPromptsOverlay'

// ── Icons ────────────────────────────────────────────────────────────────────

function IconNewChat() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
    </svg>
  )
}
function IconPrompts() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}
function IconCustomize() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41" />
    </svg>
  )
}
function IconKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  )
}
function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}
function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
function IconSun() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
function IconMoon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function IconDots() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  )
}
function IconStar({ filled }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  )
}

// ── Session row with hover menu ───────────────────────────────────────────────

function SessionRow({ entry, onLoad, onStar, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef()

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  return (
    <div
      className="relative flex items-center rounded-lg group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!menuOpen) setMenuOpen(false) }}
      style={{ backgroundColor: (hovered || menuOpen) ? 'var(--cc-hover)' : 'transparent' }}
    >
      {/* Session label */}
      <button
        onClick={() => onLoad(entry)}
        className="flex-1 flex items-center gap-2 px-3 py-2 text-left text-sm min-w-0"
        style={{ color: 'var(--cc-tx2)' }}
      >
        {entry.starred && (
          <span style={{ color: 'var(--cc-tx3)', flexShrink: 0 }}>
            <IconStar filled />
          </span>
        )}
        <span className="truncate leading-snug">
          {entry.prompt?.slice(0, 55) ?? 'Untitled'}
        </span>
      </button>

      {/* Three-dot button — visible on hover */}
      {(hovered || menuOpen) && (
        <div className="relative flex-shrink-0 pr-1" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }}
            className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
            style={{ color: 'var(--cc-tx3)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-border)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <IconDots />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              className="absolute right-0 top-7 z-50 w-36 rounded-xl overflow-hidden shadow-lg py-1"
              style={{
                backgroundColor: 'var(--cc-card)',
                border: '1px solid var(--cc-border)',
              }}
            >
              <button
                onClick={() => { onStar(entry.id); setMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors"
                style={{ color: 'var(--cc-tx1)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span style={{ color: entry.starred ? '#f59e0b' : 'var(--cc-tx3)' }}>
                  <IconStar filled={!!entry.starred} />
                </span>
                {entry.starred ? 'Unstar' : 'Star'}
              </button>
              <button
                onClick={() => { onDelete(entry.id); setMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors"
                style={{ color: '#dc2626' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <IconTrash />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

export default function Sidebar({ history, onNewChat, onLoadSession, onOpenSettings, onDeleteEntry, onStarEntry, darkMode, onToggleDark }) {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showCasingPrompts, setShowCasingPrompts] = useState(false)

  const btn = 'flex items-center justify-center rounded-lg transition-colors'
  const navItem = 'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors'

  // Starred entries first, then rest — both groups ordered by recency (array order)
  const sorted = [
    ...history.filter((e) => e.starred),
    ...history.filter((e) => !e.starred),
  ]
  const filtered = sorted.filter((e) =>
    e.prompt?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navItemStyle = { color: 'var(--cc-tx1)' }

  if (collapsed) {
    return (
      <div
        className="flex-shrink-0 w-12 flex flex-col items-center py-4 gap-3"
        style={{ borderRight: '1px solid var(--cc-border)', backgroundColor: 'var(--cc-sidebar)' }}
      >
        <button onClick={() => setCollapsed(false)} title="Expand sidebar"
          className={`${btn} w-8 h-8`} style={{ color: 'var(--cc-tx2)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconChevronRight />
        </button>
        <button onClick={onNewChat} title="New chat"
          className={`${btn} w-8 h-8`} style={{ color: 'var(--cc-tx2)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconNewChat />
        </button>
        <div className="flex-1" />
        <button onClick={onToggleDark} title={darkMode ? 'Light mode' : 'Dark mode'}
          className={`${btn} w-8 h-8`} style={{ color: 'var(--cc-tx2)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>
      </div>
    )
  }

  return (
    <div
      className="flex-shrink-0 w-64 flex flex-col h-full"
      style={{ borderRight: '1px solid var(--cc-border)', backgroundColor: 'var(--cc-sidebar)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--cc-border)' }}>
        <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--cc-tx1)' }}>Case AI</span>
        <button onClick={() => setCollapsed(true)} title="Collapse sidebar"
          className={`${btn} w-7 h-7`} style={{ color: 'var(--cc-tx2)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconChevronLeft />
        </button>
      </div>

      {/* Top actions */}
      <div className="px-3 py-3 space-y-1">
        <button onClick={onNewChat}
          className={`${navItem} font-medium`} style={navItemStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconNewChat />New chat
        </button>
        <button onClick={() => setShowSearch((s) => !s)}
          className={navItem} style={navItemStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconSearch />Search
        </button>
        <button onClick={() => setShowCasingPrompts(true)}
          className={navItem} style={navItemStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <IconPrompts />Casing Prompts
        </button>
      </div>

      {/* Search input */}
      {showSearch && (
        <div className="px-3 pb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            autoFocus
            className="w-full rounded-lg px-3 py-1.5 text-sm focus:outline-none transition-colors"
            style={{
              backgroundColor: 'var(--cc-card)',
              border: '1px solid var(--cc-border)',
              color: 'var(--cc-tx1)',
            }}
          />
        </div>
      )}

      {/* Session list */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {filtered.length > 0 && (
          <>
            {/* Starred section header */}
            {filtered.some((e) => e.starred) && (
              <p className="text-xs font-medium uppercase tracking-wider px-3 py-1.5" style={{ color: 'var(--cc-tx3)' }}>
                Starred
              </p>
            )}
            <div className="space-y-0.5">
              {filtered.map((entry, idx) => {
                // Insert "Recent" header before first non-starred entry
                const prevStarred = idx > 0 ? filtered[idx - 1].starred : true
                const showRecentHeader = !entry.starred && (idx === 0 || prevStarred)
                return (
                  <div key={entry.id}>
                    {showRecentHeader && filtered.some((e) => e.starred) && (
                      <p className="text-xs font-medium uppercase tracking-wider px-3 py-1.5 mt-2" style={{ color: 'var(--cc-tx3)' }}>
                        Recent
                      </p>
                    )}
                    {showRecentHeader && !filtered.some((e) => e.starred) && (
                      <p className="text-xs font-medium uppercase tracking-wider px-3 py-1.5" style={{ color: 'var(--cc-tx3)' }}>
                        Recent
                      </p>
                    )}
                    <SessionRow
                      entry={entry}
                      onLoad={onLoadSession}
                      onStar={onStarEntry}
                      onDelete={onDeleteEntry}
                    />
                  </div>
                )
              })}
            </div>
          </>
        )}
        {filtered.length === 0 && searchQuery && (
          <p className="text-xs px-3 py-2" style={{ color: 'var(--cc-tx3)' }}>No sessions found</p>
        )}
      </div>

      {showCasingPrompts && <CasingPromptsOverlay onClose={() => setShowCasingPrompts(false)} />}

      {/* Bottom actions */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid var(--cc-border)' }}>
        {[
          { label: 'Customize', icon: <IconCustomize />, section: 'customize' },
          { label: 'API Keys',  icon: <IconKey />,       section: 'apikeys'   },
        ].map(({ label, icon, section }) => (
          <button key={section} onClick={() => onOpenSettings(section)}
            className={navItem} style={navItemStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {icon}{label}
          </button>
        ))}
        <button onClick={onToggleDark}
          className={navItem} style={navItemStyle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--cc-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {darkMode ? <IconSun /> : <IconMoon />}
          {darkMode ? 'Light mode' : 'Dark mode'}
        </button>
      </div>
    </div>
  )
}
