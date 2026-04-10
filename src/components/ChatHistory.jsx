import MemberCard from './MemberCard'
import ConsolidatorCard from './ConsolidatorCard'
import SoloCard from './SoloCard'

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
  const count = entry.members.length
  // Cards have a min width so they stay readable; 1–2 members fill the space naturally
  const cardMinWidth = count >= 3 ? '360px' : count === 2 ? '280px' : '0px'

  return (
    <div className="mb-8">
      <div className="overflow-x-auto pb-2">
        <div
          className="flex gap-4"
          style={{ minWidth: '100%' }}
        >
          {entry.members.map((m, i) => (
            <div
              key={m.id ?? i}
              style={{ minWidth: cardMinWidth, flex: '1 1 0' }}
            >
              <MemberCard
                member={m}
                response={entry.responses?.[i]}
                status={entry.statuses?.[i] ?? 'loading'}
              />
            </div>
          ))}
        </div>
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

function SoloResponse({ entry }) {
  return (
    <div className="max-w-3xl mx-auto">
      <SoloCard model={entry.model} response={entry.response} status={entry.status} />
    </div>
  )
}

export default function ChatHistory({ entries }) {
  if (!entries.length) return null

  return (
    <div className="flex-1 overflow-y-auto py-6">
      {entries.map((entry) => (
        <div key={entry.id} className="mb-6">
          {/* User bubble stays narrow and centred */}
          <div className="max-w-3xl mx-auto px-4">
            <UserBubble prompt={entry.prompt} docName={entry.docName} />
          </div>
          {/* Council or solo response */}
          <div className={`mt-4 ${entry.type === 'solo' ? 'max-w-3xl mx-auto px-4' : 'px-4'}`}>
            {entry.type === 'solo'
              ? <SoloResponse entry={entry} />
              : <CouncilResponse entry={entry} />
            }
          </div>
        </div>
      ))}
    </div>
  )
}
