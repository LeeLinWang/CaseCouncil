import MemberCard from './MemberCard'
import ConsolidatorCard from './ConsolidatorCard'

function UserBubble({ prompt, docName }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="max-w-2xl">
        {docName && (
          <div className="text-right text-xs text-[var(--cc-tx3)] mb-1">{docName}</div>
        )}
        <div className="bg-[var(--cc-user-bubble)] text-[var(--cc-user-text)] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
          {prompt}
        </div>
      </div>
    </div>
  )
}

function CouncilResponse({ entry }) {
  const colClass =
    entry.members.length === 1
      ? 'grid-cols-1'
      : entry.members.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className="mb-8">
      <div className={`grid ${colClass} gap-4`}>
        {entry.members.map((m, i) => (
          <MemberCard
            key={m.id ?? i}
            member={m}
            response={entry.responses?.[i]}
            status={entry.statuses?.[i] ?? 'loading'}
          />
        ))}
      </div>
      {entry.consolidatorStatus && (
        <ConsolidatorCard
          consolidator={entry.consolidator}
          response={entry.consolidatorResponse}
          status={entry.consolidatorStatus}
        />
      )}
    </div>
  )
}

export default function ChatHistory({ entries }) {
  if (!entries.length) return null

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {entries.map((entry) => (
          <div key={entry.id}>
            <UserBubble prompt={entry.prompt} docName={entry.docName} />
            <CouncilResponse entry={entry} />
          </div>
        ))}
      </div>
    </div>
  )
}
