import { useState, useRef, useCallback, useEffect } from 'react'
import EditorHeader from './EditorHeader'
import Toolbar from './Toolbar'

export default function EditorView({ onSave, onNavigateList, initialHtml }) {
  const [listActive, setListActive] = useState(false)
  const [boldActive, setBoldActive] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    if (initialHtml && editorRef.current) {
      editorRef.current.innerHTML = initialHtml
      checkContent()
    }
  }, [])

  const syncState = useCallback(() => {
    setBoldActive(document.queryCommandState('bold'))
    const sel = window.getSelection()
    if (!sel.rangeCount) return
    let node = sel.focusNode
    while (node && node !== editorRef.current) {
      if (node.nodeName === 'UL' || node.nodeName === 'OL') {
        setListActive(true)
        return
      }
      node = node.parentElement
    }
    setListActive(false)
  }, [])

  const checkContent = useCallback(() => {
    const html = editorRef.current?.innerHTML
    if (!html) { setHasContent(false); return }
    const div = document.createElement('div')
    div.innerHTML = html
    setHasContent(!!div.textContent?.trim())
  }, [])

  const handleBold = useCallback(() => {
    document.execCommand('bold')
    editorRef.current?.focus()
    syncState()
  }, [syncState])

  const handleList = useCallback(() => {
    document.execCommand('insertUnorderedList')
    editorRef.current?.focus()
    const sel = window.getSelection()
    if (sel.rangeCount) {
      let node = sel.focusNode
      while (node && node.nodeName !== 'LI') {
        node = node.parentElement
      }
      if (node && node.nodeName === 'LI') {
        const range = document.createRange()
        range.selectNodeContents(node)
        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
    syncState()
  }, [syncState])

  const handleNewline = useCallback(() => {
    document.execCommand('insertLineBreak')
    editorRef.current?.focus()
  }, [])

  const handleTimestamp = useCallback(() => {
    const now = new Date()
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} — `
    document.execCommand('insertText', false, ts)
    editorRef.current?.focus()
  }, [])

  const handleFinish = useCallback(async () => {
    const html = editorRef.current?.innerHTML
    const div = document.createElement('div')
    div.innerHTML = html || ''
    if (!div.textContent?.trim()) return
    await onSave(html)
    if (editorRef.current) editorRef.current.innerHTML = ''
    onNavigateList()
  }, [onSave, onNavigateList])

  return (
    <div className="editor-wrapper">
      <EditorHeader onList={onNavigateList} />
      <div className="editor-body">
        <div
          ref={editorRef}
          className="editor-textarea"
          contentEditable
          suppressContentEditableWarning
          onKeyUp={syncState}
          onMouseUp={syncState}
          onInput={checkContent}
        />
          <Toolbar
          listActive={listActive}
          boldActive={boldActive}
          saveDisabled={!hasContent}
          onList={handleList}
          onBold={handleBold}
          onNewline={handleNewline}
          onTimestamp={handleTimestamp}
          onFinish={handleFinish}
        />
      </div>
    </div>
  )
}
