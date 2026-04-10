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

// Build a system prompt for the solo AI from all council entries.
// Includes any PDF document content captured in entries.
function buildCouncilContext(councilEntries) {
  if (!councilEntries.length) return ''

  const blocks = councilEntries.map((entry, idx) => {
    const docSection = entry.docContent
      ? `**Document: ${entry.docName}**\n\n${entry.docContent}\n\n---\n\n`
      : ''

    const memberSection = entry.members
      .map((m, i) => {
        const response = entry.responses?.[i] ?? ''
        const status = entry.statuses?.[i]
        return `### ${m.name || `Member ${i + 1}`} (${m.model})\n${status === 'error' ? '[No response — error]' : response}`
      })
      .join('\n\n')

    const consolidatorSection =
      entry.consolidatorResponse && entry.consolidatorStatus === 'done'
        ? `\n\n### Council Analysis\n${entry.consolidatorResponse}`
        : ''

    return `${docSection}**Prompt ${idx + 1}:** ${entry.prompt}\n\n${memberSection}${consolidatorSection}`
  }).join('\n\n---\n\n')

  return `You have full access to a council deliberation record. Use it as your knowledge base and speak as a single, clear, synthesized voice. Be direct and actionable.\n\n${blocks}`
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
  // Solo AI mode
  const [mode, setMode] = useState('council')
  const [soloModel, setSoloModel] = useState('claude-sonnet-4-5')
  const [soloMessages, setSoloMessages] = useState([])
  const bottomRef = useRef()
  const abortRef = useRef(null)

  function handleStop() {
    abortRef.current?.abort()
  }

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
    setSoloMessages([])
    setMode('council')
    clearDoc()
  }

  function handleLoadSession(entry) {
    setEntries([entry])
  }

  function handleOpenSettings(section) {
    setSettingsSection(section)
    setSettingsOpen(true)
  }

  async function handleCouncilSubmit(prompt) {
    const controller = new AbortController()
    abortRef.current = controller

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
      docContent: docContent || null,
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
          signal: controller.signal,
        })
      )
    )

    const aborted = results.some((r) => r.reason?.name === 'AbortError')

    const responses = results.map((r) =>
      r.status === 'fulfilled' ? r.value
      : r.reason?.name === 'AbortError' ? ''
      : `Error: ${r.reason?.message ?? 'Unknown error'}`
    )
    const statuses = results.map((r) =>
      r.status === 'fulfilled' ? 'done'
      : r.reason?.name === 'AbortError' ? 'done'
      : 'error'
    )

    setEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, responses, statuses } : e))
    )

    let consolidatorResponse = ''
    let consolidatorStatus = null

    if (consolidatorEnabled && !aborted) {
      const councilSummary = memberSnapshots
        .map((m, i) => `## ${m.name || `Member ${i + 1}`} (${m.model})\n\n${responses[i]}`)
        .join('\n\n---\n\n')

      const consolidatorMessage = `The council was asked:\n\n"${prompt}"\n\nHere are the council members' responses:\n\n${councilSummary}`

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
          signal: controller.signal,
        })
        consolidatorStatus = 'done'
      } catch (e) {
        if (e.name !== 'AbortError') {
          consolidatorResponse = `Error: ${e.message}`
          consolidatorStatus = 'error'
        }
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
    if (!aborted) addToHistory(finalEntry)
    setRunning(false)
  }

  async function handleSoloSubmit(prompt) {
    const controller = new AbortController()
    abortRef.current = controller

    const userContent = docContent
      ? `[Document: ${docName}]\n\n${docContent}\n\n---\n\n${prompt}`
      : prompt

    const updatedMessages = [...soloMessages, { role: 'user', content: userContent }]

    const entryId = crypto.randomUUID()
    const newEntry = {
      id: entryId,
      type: 'solo',
      prompt,
      docName: docContent ? docName : null,
      model: soloModel,
      response: '',
      status: 'loading',
    }

    setEntries((prev) => [...prev, newEntry])
    setRunning(true)

    const councilEntries = entries.filter((e) => e.type !== 'solo')
    const councilContext = buildCouncilContext(councilEntries)

    try {
      const response = await callModel({
        model: soloModel,
        systemPrompt: councilContext || undefined,
        messages: updatedMessages,
        apiKeys,
        webSearch,
        useCache: !!councilContext,
        signal: controller.signal,
      })

      const finalEntry = { ...newEntry, response, status: 'done' }
      setSoloMessages([...updatedMessages, { role: 'assistant', content: response }])
      setEntries((prev) => prev.map((e) => (e.id === entryId ? finalEntry : e)))
      addToHistory(finalEntry)
    } catch (err) {
      if (err.name === 'AbortError') {
        // Remove the placeholder entry — nothing came back
        setEntries((prev) => prev.filter((e) => e.id !== entryId))
      } else {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entryId ? { ...e, response: `Error: ${err.message}`, status: 'error' } : e
          )
        )
      }
    }

    setRunning(false)
  }

  async function handleSubmit(prompt) {
    if (mode === 'solo') {
      await handleSoloSubmit(prompt)
    } else {
      await handleCouncilSubmit(prompt)
    }
  }

  const hasEntries = entries.length > 0

  const sharedInputProps = {
    onSubmit: handleSubmit,
    disabled: running,
    onStop: handleStop,
    docName,
    docLoading,
    onFileSelect: processFile,
    onFileClear: clearDoc,
    webSearch,
    onWebSearchToggle: () => setWebSearch(!webSearch),
    canToggleMode: true,
    mode,
    onModeChange: setMode,
    soloModel,
    onSoloModelChange: setSoloModel,
  }

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
            <ChatInput {...sharedInputProps} />
          </>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <h1 className="text-3xl font-semibold text-[var(--cc-tx1)] mb-10 tracking-tight">
                {getGreeting()}, Caser
              </h1>
              <div className="w-full max-w-3xl">
                <ChatInput {...sharedInputProps} />
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
