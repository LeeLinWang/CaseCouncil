import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getModelMeta } from '../constants'

export default function ConsolidatorCard({ consolidator, response, status }) {
  const meta = getModelMeta(consolidator.model)

  return (
    <div
      className="rounded-2xl overflow-hidden mt-4 shadow-sm"
      style={{
        backgroundColor: 'var(--cc-card)',
        border: '1px solid var(--cc-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-2.5 flex items-center gap-3"
        style={{
          backgroundColor: 'var(--cc-subtle)',
          borderBottom: '1px solid var(--cc-border)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: 'var(--cc-tx3)' }}
        />
        <div className="flex-1">
          <div
            className="text-sm font-semibold"
            style={{ color: 'var(--cc-tx1)' }}
          >
            Council Analysis
          </div>
          <div
            className="text-xs"
            style={{ color: 'var(--cc-tx2)' }}
          >
            {meta.modelLabel}
          </div>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            backgroundColor: 'var(--cc-hover)',
            color: 'var(--cc-tx2)',
          }}
        >
          Consolidator
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        {status === 'loading' && (
          <div
            className="flex items-center gap-2 text-sm"
            style={{ color: 'var(--cc-tx2)' }}
          >
            <span
              className="inline-block w-4 h-4 border-2 rounded-full animate-spin"
              style={{
                borderColor: 'var(--cc-border)',
                borderTopColor: 'var(--cc-tx2)',
              }}
            />
            Analysing council responses...
          </div>
        )}
        {status === 'error' && (
          <div
            className="text-sm rounded-lg p-3"
            style={{
              color: '#dc2626',
              backgroundColor: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.2)',
            }}
          >
            {response}
          </div>
        )}
        {status === 'done' && (
          <div className="markdown-content text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
