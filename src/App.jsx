import { useState, useRef, useEffect } from 'react'
import { useStore } from './useStore'
import { usePdf } from './usePdf'
import { callModel } from './api'
import Sidebar from './components/Sidebar'
import SettingsPanel from './components/SettingsPanel'
import ChatHistory from './components/ChatHistory'
import ChatInput from './components/ChatInput'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function loadDarkMode() {
  try {
    return JSON.parse(localStorage.getItem('council_dark_mode') ?? 'false')
  } catch {
    return false
  }
}

export default function App() {
  const store = useStore()
  const { members, consolidator, consolidatorEnabled, apiKeys, webSearch, setWebSearch, history, addToHistory, deleteEntry, starEntry } = store
  const { docContent, docName, loading: docLoading, processFile, clearDoc } = usePdf()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsSection, setSettingsSection] = useState('customize')
  const [entries, setEntries] = useState([])
  const [running, setRunning] = useState(false)
  const [darkMode, setDarkMode] = useState(loadDarkMode)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  function handleToggleDark() {
    setDarkMode((prev) => {
      const next = !prev
      localStorage.setItem('council_dark_mode', JSON.stringify(next))
      return next
    })
  }

  function handleNewChat() {
    setEntries([])
    clearDoc()
  }

  function handleLoadSession(entry) {
    setEntries([entry])
  }

  function handleOpenSettings(section) {
    setSettingsSection(section)
    setSettingsOpen(true)
  }

  async function handleSubmit(prompt) {
    const userMessage = docContent
      ? `[Document: ${docName}]\n\n${docContent}\n\n---\n\n${prompt}`
      : prompt

    const entryId = crypto.randomUUID()
    const memberSnapshots = members.map((m) => ({ ...m }))
    const consolidatorSnapshot = { ...consolidator }

    const newEntry = {
      id: entryId,
      prompt,
      docName: docContent ? docName : null,
      members: memberSnapshots,
      consolidator: consolidatorSnapshot,
      responses: memberSnapshots.map(() => ''),
      statuses: memberSnapshots.map(() => 'loading'),
      consolidatorResponse: '',
      consolidatorStatus: null,
    }

    setEntries((prev) => [...prev, newEntry])
    setRunning(true)

    const results = await Promise.allSettled(
      memberSnapshots.map((member) =>
        callModel({
          model: member.model,
          systemPrompt: member.systemPrompt,
          userMessage,
          apiKeys,
          webSearch,
        })
      )
    )

    const responses = results.map((r) =>
      r.status === 'fulfilled' ? r.value : `Error: ${r.reason?.message ?? 'Unknown error'}`
    )
    const statuses = results.map((r) => (r.status === 'fulfilled' ? 'done' : 'error'))

    // Flush member responses to UI
    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, responses, statuses } : e))
    )

    let consolidatorResponse = ''
    let consolidatorStatus = null

    if (consolidatorEnabled) {
      const councilSummary = memberSnapshots
        .map((m, i) => `## ${m.name || `Member ${i + 1}`} (${m.model})\n\n${responses[i]}`)
        .join('\n\n---\n\n')

      const consolidatorMessage = `The council was asked:\n\n"${prompt}"\n\nHere are the council members' responses:\n\n${councilSummary}`

      consolidatorStatus = 'loading'

      setEntries((prev) =>
        prev.map((e) =>
          e.id === entryId ? { ...e, responses, statuses, consolidatorStatus: 'loading' } : e
        )
      )

      try {
        consolidatorResponse = await callModel({
          model: consolidatorSnapshot.model,
          systemPrompt: consolidatorSnapshot.systemPrompt,
          userMessage: consolidatorMessage,
          apiKeys,
          webSearch,
        })
        consolidatorStatus = 'done'
      } catch (e) {
        consolidatorResponse = `Error: ${e.message}`
        consolidatorStatus = 'error'
      }
    }

    const finalEntry = {
      ...newEntry,
      responses,
      statuses,
      consolidatorResponse,
      consolidatorStatus,
    }

    setEntries((prev) => prev.map((e) => (e.id === entryId ? finalEntry : e)))
    addToHistory(finalEntry)
    setRunning(false)
  }

  const hasEntries = entries.length > 0

  return (
    <div className={`flex h-screen overflow-hidden bg-[var(--cc-bg)] ${darkMode ? 'dark' : ''}`}>
      <Sidebar
        history={history}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        onOpenSettings={handleOpenSettings}
        onDeleteEntry={deleteEntry}
        onStarEntry={starEntry}
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {hasEntries ? (
          <>
            <ChatHistory entries={entries} />
            <div ref={bottomRef} />
            <ChatInput
              onSubmit={handleSubmit}
              disabled={running}
              docName={docName}
              docLoading={docLoading}
              onFileSelect={processFile}
              onFileClear={clearDoc}
              webSearch={webSearch}
              onWebSearchToggle={() => setWebSearch(!webSearch)}
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <h1 className="text-3xl font-semibold text-[var(--cc-tx1)] mb-10 tracking-tight">
                {getGreeting()}, Caser
              </h1>
              <div className="w-full max-w-3xl">
                <ChatInput
                  onSubmit={handleSubmit}
                  disabled={running}
                  docName={docName}
                  docLoading={docLoading}
                  onFileSelect={processFile}
                  onFileClear={clearDoc}
                  webSearch={webSearch}
                  onWebSearchToggle={() => setWebSearch(!webSearch)}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 pb-6 flex-wrap px-4">
              {members.map((m, i) => (
                <span
                  key={m.id}
                  className="text-xs text-[var(--cc-tx3)] bg-[var(--cc-pill)] rounded-full px-3 py-1"
                >
                  {m.name || `Member ${i + 1}`}
                </span>
              ))}
              {consolidatorEnabled && (
                <span className="text-xs text-[var(--cc-tx3)] bg-[var(--cc-pill)] rounded-full px-3 py-1">
                  Consolidator
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {settingsOpen && (
        <SettingsPanel
          store={store}
          onClose={() => setSettingsOpen(false)}
          initialSection={settingsSection}
        />
      )}
    </div>
  )
}
