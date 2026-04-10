import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_MEMBER, DEFAULT_CONSOLIDATOR, MEMBER_NAMES, MEMBER_PROMPTS } from './constants'

const STORAGE_KEYS = {
  members: 'council_members',
  consolidator: 'council_consolidator',
  apiKeys: 'council_api_keys',
  webSearch: 'council_web_search',
  history: 'council_history',
  consolidatorEnabled: 'council_consolidator_enabled',
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

function makeDefaultMembers(count = 3) {
  return Array.from({ length: count }, (_, i) => ({
    ...DEFAULT_MEMBER,
    name: MEMBER_NAMES[i] ?? `Member ${i + 1}`,
    systemPrompt: MEMBER_PROMPTS[i] ?? '',
    id: crypto.randomUUID(),
  }))
}

export function useStore() {
  const [members, setMembersState] = useState(() =>
    load(STORAGE_KEYS.members, makeDefaultMembers(3))
  )
  const [consolidator, setConsolidatorState] = useState(() =>
    load(STORAGE_KEYS.consolidator, DEFAULT_CONSOLIDATOR)
  )
  const [apiKeys, setApiKeysState] = useState(() =>
    load(STORAGE_KEYS.apiKeys, { openai: '', anthropic: '', google: '', seed: '' })
  )
  const [webSearch, setWebSearchState] = useState(() =>
    load(STORAGE_KEYS.webSearch, false)
  )
  const [consolidatorEnabled, setConsolidatorEnabledState] = useState(() =>
    load(STORAGE_KEYS.consolidatorEnabled, true)
  )
  const [history, setHistoryState] = useState(() =>
    load(STORAGE_KEYS.history, [])
  )

  // Persist helpers
  const setMembers = useCallback((v) => {
    setMembersState(v)
    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(v))
  }, [])
  const setConsolidator = useCallback((v) => {
    setConsolidatorState(v)
    localStorage.setItem(STORAGE_KEYS.consolidator, JSON.stringify(v))
  }, [])
  const setApiKeys = useCallback((v) => {
    setApiKeysState(v)
    localStorage.setItem(STORAGE_KEYS.apiKeys, JSON.stringify(v))
  }, [])
  const setWebSearch = useCallback((v) => {
    setWebSearchState(v)
    localStorage.setItem(STORAGE_KEYS.webSearch, JSON.stringify(v))
  }, [])
  const setConsolidatorEnabled = useCallback((v) => {
    setConsolidatorEnabledState(v)
    localStorage.setItem(STORAGE_KEYS.consolidatorEnabled, JSON.stringify(v))
  }, [])
  const addToHistory = useCallback((entry) => {
    setHistoryState((prev) => {
      const next = [entry, ...prev].slice(0, 50)
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(next))
      return next
    })
  }, [])
  const deleteEntry = useCallback((id) => {
    setHistoryState((prev) => {
      const next = prev.filter((e) => e.id !== id)
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(next))
      return next
    })
  }, [])
  const starEntry = useCallback((id) => {
    setHistoryState((prev) => {
      const next = prev.map((e) => e.id === id ? { ...e, starred: !e.starred } : e)
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(next))
      return next
    })
  }, [])
  const clearHistory = useCallback(() => {
    setHistoryState([])
    localStorage.removeItem(STORAGE_KEYS.history)
  }, [])

  // Member management
  const setCouncilSize = useCallback((size) => {
    setMembers((prev) => {
      if (size > prev.length) {
        const extra = Array.from({ length: size - prev.length }, (_, i) => ({
          ...DEFAULT_MEMBER,
          name: MEMBER_NAMES[prev.length + i] ?? `Member ${prev.length + i + 1}`,
          systemPrompt: MEMBER_PROMPTS[prev.length + i] ?? '',
          id: crypto.randomUUID(),
        }))
        return [...prev, ...extra]
      }
      return prev.slice(0, size)
    })
  }, [setMembers])

  const updateMember = useCallback((index, patch) => {
    setMembers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
  }, [setMembers])

  return {
    members, setMembers, setCouncilSize, updateMember,
    consolidator, setConsolidator,
    consolidatorEnabled, setConsolidatorEnabled,
    apiKeys, setApiKeys,
    webSearch, setWebSearch,
    history, addToHistory, deleteEntry, starEntry, clearHistory,
  }
}
