'use client'

import { useState } from 'react'

const HTMLStripper = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  const stripHTMLTags = (html) => {
    let text = html.replace(/<[^>]+>/g, '')
    text = text.replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ').trim()
    text=text.replaceAll('/>','')
    text=text.replaceAll('</','')
    return text.replace(/\/>/g, '') // Remove any remaining />
  }

  const handleStrip = () => {
    if (!input.trim()) {
      setError('Please enter some HTML to strip.')
      return
    }
    setOutput(stripHTMLTags(input))
    setError('')
  }

  const handleCopy = () => {
    if (!output) {
      setError('Nothing to copy.')
      return
    }
    navigator.clipboard.writeText(output)
      .then(() => {
        setError('Copied to clipboard!')
        setTimeout(() => setError(''), 3000)
      })
      .catch(() => setError('Failed to copy text.'))
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setError('')
  }

  return (
    <div>
      <h1>HTML Tag Stripper</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter HTML here"
        rows="10"
        cols="50"
      ></textarea>
      <button onClick={handleStrip}>Strip HTML Tags</button>
      <button onClick={handleReset}>Reset</button>
      <textarea
        value={output}
        readOnly
        placeholder="Stripped text will appear here"
        rows="10"
        cols="50"
      ></textarea>
      <button onClick={handleCopy}>Copy Stripped Text</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  )
}

export default HTMLStripper