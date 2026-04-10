import { useState, useCallback } from 'react'

export function usePdf() {
  const [docContent, setDocContent] = useState('')
  const [docName, setDocName] = useState('')
  const [loading, setLoading] = useState(false)

  const processFile = useCallback(async (file) => {
    setLoading(true)
    setDocName(file.name)
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const pdfjsLib = await import('pdfjs-dist')
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.mjs',
          import.meta.url
        ).toString()
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
        let text = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          text += content.items.map((item) => item.str).join(' ') + '\n'
        }
        setDocContent(text.trim())
      } else {
        const text = await file.text()
        setDocContent(text)
      }
    } catch (e) {
      setDocContent(`[Error reading file: ${e.message}]`)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearDoc = useCallback(() => {
    setDocContent('')
    setDocName('')
  }, [])

  return { docContent, docName, loading, processFile, clearDoc }
}
