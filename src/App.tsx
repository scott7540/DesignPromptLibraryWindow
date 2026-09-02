import { useState, useRef, useEffect } from 'react'

type Snippet = { id: string; name: string; pinned: boolean; content: string }
type Folder = { id: string; name: string; color: string; items: Snippet[] }

const FOLDERS: Folder[] = [
  {
    id: 'f1', name: '01-Prompt-Engineering', color: '#3B82F6',
    items: [
      {
        id: 's1', name: 'Prompt Quality Evaluator & Optimizer', pinned: true,
        content: `## Role Definition\n\nYou are a "Prompt Quality Evaluator" and "Prompt Optimization Advisor".\n\nYour task is to objectively, rationally, and structurally evaluate user-provided prompts, determine whether they are stable, clear, and controllable for AI task completion, and identify strengths, weaknesses, risks, and optimization directions.\n\nDo not flatter users or default to high quality just because the prompt is long, has complex role settings, or uses strong rhetoric. Evaluate it like a product requirements document, engineering spec, or strategic analysis framework — focus on its goals, inputs, steps, outputs, constraints, risks, and reusability.\n\n---\n\n## Evaluation Target\n\nThe user will provide a [Prompt to be Evaluated].\n\nYou need to evaluate:\n\n1. Whether the task goal is clear;\n\n2. Whether the input information and context are sufficient;\n\n3. Whether the steps and logic are reasonable;\n\n4. Whether the output format is specified;\n\n5. Whether the constraints and risk handling are complete;\n\n6. Whether the prompt is reusable and scalable.`
      },
      { id: 's2', name: 'Lyra, Your AI Prompt Optimizer', pinned: false, content: `# Lyra — AI Prompt Optimizer\n\nYou are Lyra, an expert AI prompt optimization specialist.\n\n## Core Capabilities\n\n- Analyze prompt structure and clarity\n- Identify ambiguities and missing context\n- Suggest concrete improvements\n- Rewrite prompts for maximum effectiveness\n\n## How to Use\n\nShare any prompt and I'll evaluate it across these dimensions:\n\n1. **Clarity** — Is the goal unambiguous?\n2. **Context** — Does the AI have enough information?\n3. **Constraints** — Are boundaries clearly defined?\n4. **Output format** — Is the expected response specified?` },
      { id: 's3', name: 'Lyra, Professional AI Prompt Optimizer', pinned: false, content: `# Lyra — Professional Edition\n\nAn advanced prompt optimization system for professional AI workflows.\n\nDesigned for teams and power users who need consistent, high-quality prompts.` },
    ],
  },
  {
    id: 'f2', name: '02-Thinking-Frameworks', color: '#8B5CF6',
    items: [
      { id: 's4', name: 'First-Principles Thinking Coach — Universal', pinned: false, content: `## First-Principles Thinking Framework\n\nBreak down complex problems to their fundamental truths and build up from there.\n\n### The Process\n\n1. **Identify the problem** — What are you really trying to solve?\n2. **Challenge assumptions** — Why do we believe this to be true?\n3. **Break to core elements** — What are the irreducible components?\n4. **Reconstruct** — Build the solution from the ground up\n5. **Validate** — Test against reality` },
      { id: 's5', name: 'Insight Expert', pinned: true, content: `# Insight Expert\n\nSpecialized in extracting deep, non-obvious insights from complex information.\n\n## Approach\n\nWhen given any content, I will:\n\n1. Surface the 3 most counter-intuitive findings\n2. Identify hidden patterns and connections\n3. Challenge the conventional interpretation\n4. Provide the "so what" — why this matters\n5. Suggest what questions to ask next` },
      { id: 's6', name: "Devil's Advocate Coach", pinned: false, content: `# Devil's Advocate\n\nI challenge assumptions and surface hidden blind spots in your thinking.\n\nPresent your idea, plan, or argument, and I will systematically stress-test it by finding its weakest points, strongest counterarguments, and hidden risks you may have missed.` },
      { id: 's7', name: 'Question Expert', pinned: false, content: `# Question Expert\n\nMaster the art of asking the right questions at the right time.\n\nGiven any topic, situation, or challenge, I will generate a structured set of questions across different dimensions to help you think more comprehensively.` },
    ],
  },
  {
    id: 'f3', name: '03-Research-Analysis', color: '#10B981',
    items: [
      { id: 's8', name: 'Scalable Analysis Framework', pinned: false, content: `# Scalable Analysis Framework\n\nA systematic approach to analyzing any topic at any level of depth.\n\nAdapts automatically to the complexity and scope of the subject.` },
      { id: 's9', name: 'Kimi Workflow — Original Prompt', pinned: false, content: `` },
      { id: 's10', name: 'Kimi 6-Step Research Flow', pinned: false, content: `` },
    ],
  },
  {
    id: 'f4', name: '04-Content-Summary', color: '#F59E0B',
    items: [
      { id: 's11', name: 'Blogger · Dense Manuscript Summary', pinned: false, content: `` },
      { id: 's12', name: 'Single Book Deep Dive 2', pinned: false, content: `` },
      { id: 's13', name: 'Single Book Deep Deconstruction Expert', pinned: false, content: `` },
      { id: 's14', name: 'Multi-Book Fusion', pinned: false, content: `` },
    ],
  },
  {
    id: 'f5', name: '05-Business-Startup', color: '#EF4444',
    items: [
      { id: 's15', name: 'Milestone — Five-Step Analysis', pinned: false, content: `` },
    ],
  },
  {
    id: 'f6', name: '06-AI-Build-Coding', color: '#06B6D4',
    items: [
      { id: 's16', name: 'Cursor Rules Generator', pinned: false, content: `` },
      { id: 's17', name: 'Code Review Expert', pinned: false, content: `` },
    ],
  },
]

const INTER = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
const MONO = "'JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', monospace"

function TrafficLight({ color }: { color: string }) {
  return <div className="w-3 h-3 rounded-full cursor-pointer hover:brightness-90 transition-all" style={{ backgroundColor: color }} />
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className={`w-3 h-3 flex-shrink-0 text-zinc-400 transition-transform duration-150 ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function PinIcon({ on }: { on: boolean }) {
  return (
    <svg className={`w-3.5 h-3.5 ${on ? 'text-amber-500' : 'text-zinc-400'}`} fill={on ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  )
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-[6px] text-[12px] font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 active:bg-zinc-100 transition-colors leading-none">
      {children}
    </button>
  )
}

function DangerBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-[6px] text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors leading-none">
      {children}
    </button>
  )
}

function PrimaryBtn({ children, shortcut, onClick }: { children: React.ReactNode; shortcut?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-3 py-[6px] text-[12px] font-medium text-white bg-[#18181B] rounded-lg hover:bg-zinc-700 active:bg-zinc-800 transition-colors flex items-center gap-1.5 leading-none">
      {children}
      {shortcut && (
        <kbd className="text-[10px] bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded font-sans leading-none">{shortcut}</kbd>
      )}
    </button>
  )
}

function SmallBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-2.5 py-[5px] text-[11px] font-medium text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50 active:bg-zinc-100 transition-colors whitespace-nowrap leading-none">
      {children}
    </button>
  )
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex items-center h-[22px] w-[40px] rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 flex-shrink-0 ${on ? 'bg-amber-400' : 'bg-zinc-200'}`}
    >
      <span className={`absolute h-4 w-4 bg-white rounded-full shadow-sm transition-all duration-200 ${on ? 'left-[21px]' : 'left-[3px]'}`} />
    </button>
  )
}

export default function App() {
  const [folders, setFolders] = useState<Folder[]>(FOLDERS)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['f1', 'f2']))
  const [selectedId, setSelectedId] = useState('s1')
  const [searchQuery, setSearchQuery] = useState('')
  const [vaultPath, setVaultPath] = useState('C:\\Users\\user\\Desktop\\PromptVault\\Prompts')
  const [hotkey, setHotkey] = useState('Shift+Ctrl+Z')
  const [isCapturingHotkey, setIsCapturingHotkey] = useState(false)
  const [editorTitle, setEditorTitle] = useState(FOLDERS[0].items[0].name)
  const [editorContent, setEditorContent] = useState(FOLDERS[0].items[0].content)
  const [editorPinned, setEditorPinned] = useState(FOLDERS[0].items[0].pinned)
  const [hasChanges, setHasChanges] = useState(false)
  const hotkeyRef = useRef<HTMLInputElement>(null)

  const currentFolder = folders.find(f => f.items.some(s => s.id === selectedId))

  const handleSnippetClick = (snippet: Snippet) => {
    setSelectedId(snippet.id)
    setEditorTitle(snippet.name)
    setEditorContent(snippet.content)
    setEditorPinned(snippet.pinned)
    setHasChanges(false)
  }

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSave = () => {
    setFolders(prev =>
      prev.map(f => ({
        ...f,
        items: f.items.map(s =>
          s.id === selectedId
            ? { ...s, name: editorTitle, content: editorContent, pinned: editorPinned }
            : s
        ),
      }))
    )
    setHasChanges(false)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [editorTitle, editorContent, editorPinned, selectedId])

  const handleHotkeyCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCapturingHotkey) return
    e.preventDefault()
    const parts: string[] = []
    if (e.ctrlKey) parts.push('Ctrl')
    if (e.shiftKey) parts.push('Shift')
    if (e.altKey) parts.push('Alt')
    if (e.metaKey) parts.push('Cmd')
    const key = e.key
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(key)) {
      parts.push(key.length === 1 ? key.toUpperCase() : key)
      setHotkey(parts.join('+'))
      setIsCapturingHotkey(false)
      hotkeyRef.current?.blur()
    }
  }

  const filteredFolders = searchQuery.trim()
    ? folders.map(f => ({ ...f, items: f.items.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())) })).filter(f => f.items.length > 0)
    : folders

  const wordCount = editorContent.trim() ? editorContent.trim().split(/\s+/).length : 0
  const charCount = editorContent.length

  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-300 p-4" style={{ fontFamily: INTER }}>
      {/* Window */}
      <div className="w-full max-w-[1180px] h-full max-h-[820px] flex flex-col rounded-xl overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.28),0_0_0_1px_rgba(0,0,0,0.08)] bg-white">

        {/* macOS Title Bar */}
        <div className="flex items-center px-4 h-11 bg-white border-b border-zinc-200 flex-shrink-0 select-none">
          <div className="flex items-center gap-2">
            <TrafficLight color="#FF5F57" />
            <TrafficLight color="#FFBD2E" />
            <TrafficLight color="#28C840" />
          </div>
          <span className="flex-1 text-center text-[12px] font-medium text-zinc-400 tracking-tight">Library</span>
        </div>

        {/* App Header */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0 border-b border-zinc-200 bg-white">
          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[18px] font-semibold text-zinc-900 tracking-tight">Library</h1>
            <div className="flex items-center gap-2">
              <GhostBtn>New Folder</GhostBtn>
              <GhostBtn>New Snippet</GhostBtn>
              <DangerBtn>Delete</DangerBtn>
              <PrimaryBtn shortcut="⌘S" onClick={handleSave}>Save Changes</PrimaryBtn>
            </div>
          </div>

          {/* Settings */}
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.08em] mb-2.5">Settings</p>
            <div className="space-y-2">
              {/* Vault directory */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-zinc-500 w-28 flex-shrink-0">Vault Directory</span>
                <input
                  value={vaultPath}
                  onChange={e => setVaultPath(e.target.value)}
                  className="flex-1 text-[12px] text-zinc-700 bg-[#F8FAFC] border border-zinc-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 focus:bg-white transition-colors"
                />
                <SmallBtn>Select Directory…</SmallBtn>
                <SmallBtn>Save Directory</SmallBtn>
              </div>

              {/* Hotkey */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-zinc-500 w-28 flex-shrink-0">Hotkey</span>
                <div className="relative">
                  <input
                    ref={hotkeyRef}
                    value={isCapturingHotkey ? 'Press keys...' : hotkey}
                    readOnly
                    onFocus={() => setIsCapturingHotkey(true)}
                    onBlur={() => setIsCapturingHotkey(false)}
                    onKeyDown={handleHotkeyCapture}
                    className={`w-44 text-[12px] text-zinc-700 bg-[#F8FAFC] border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 cursor-pointer select-none ${
                      isCapturingHotkey ? 'border-zinc-400 ring-1 ring-zinc-300 bg-white' : 'border-zinc-200'
                    }`}
                  />
                </div>
                <SmallBtn onClick={() => hotkeyRef.current?.focus()}>Save Hotkey</SmallBtn>
                <span className="text-[11px] text-zinc-400 ml-1">
                  Current: <span className="font-medium text-zinc-500">{hotkey}</span>
                  <span className="mx-1.5 text-zinc-300">·</span>
                  Disabled: Ctrl+Space / Alt+Space / Ctrl+Shift+P
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0 border-r border-zinc-200 flex flex-col bg-[#F8FAFC]">

            {/* Sidebar Search */}
            <div className="p-3 border-b border-zinc-200">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <SearchIcon />
                  </span>
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search snippets..."
                    className="w-full text-[12px] bg-white border border-zinc-200 rounded-lg pl-7 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-300 placeholder:text-zinc-400 text-zinc-700"
                  />
                </div>
                <SmallBtn>New File</SmallBtn>
                <SmallBtn>New Folder</SmallBtn>
              </div>
            </div>

            {/* Folder Tree */}
            <div className="flex-1 overflow-y-auto py-1.5 scrollbar-hide">
              {filteredFolders.map(folder => (
                <div key={folder.id}>
                  {/* Folder row */}
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="w-full flex items-center gap-2 px-3 py-[7px] hover:bg-white/70 text-left transition-colors group"
                  >
                    <ChevronIcon open={expandedFolders.has(folder.id)} />
                    <div
                      className="w-3.5 h-3.5 rounded-[3px] flex-shrink-0"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span className="text-[12px] font-medium text-zinc-700 flex-1 truncate">{folder.name}</span>
                    <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-200 rounded-full px-1.5 py-[2px] leading-none">
                      {folder.items.length}
                    </span>
                  </button>

                  {/* Snippet items */}
                  {expandedFolders.has(folder.id) && folder.items.map(snippet => (
                    <button
                      key={snippet.id}
                      onClick={() => handleSnippetClick(snippet)}
                      className={`w-full flex items-center gap-2 pl-[36px] pr-3 py-[6px] text-left transition-colors ${
                        selectedId === snippet.id
                          ? 'bg-zinc-200/80'
                          : 'hover:bg-white/60'
                      }`}
                    >
                      <span className={`text-[12px] flex-1 truncate leading-snug ${
                        selectedId === snippet.id ? 'text-zinc-900 font-medium' : 'text-zinc-500'
                      }`}>
                        {snippet.name}
                      </span>
                      {snippet.pinned && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 border border-amber-200/60 px-1.5 py-[2px] rounded-full flex-shrink-0 leading-none">
                          Pinned
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ))}

              {filteredFolders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center mb-3">
                    <SearchIcon />
                  </div>
                  <p className="text-[12px] text-zinc-400 font-medium">No results for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Editor Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white">

            {/* Title + Pin area */}
            <div className="px-6 pt-6 pb-5 flex-shrink-0 border-b border-zinc-100">
              {/* Title input */}
              <div className="mb-4">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.08em] block mb-1.5">
                  Title (filename)
                </label>
                <input
                  value={editorTitle}
                  onChange={e => { setEditorTitle(e.target.value); setHasChanges(true) }}
                  placeholder="Untitled Snippet"
                  className="w-full text-[15px] font-medium text-zinc-900 bg-white border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-300 transition-all"
                />
              </div>

              {/* Pin toggle row */}
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-medium text-zinc-500">Pin to top</span>
                <Toggle
                  on={editorPinned}
                  onToggle={() => { setEditorPinned(!editorPinned); setHasChanges(true) }}
                />
                {editorPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full leading-none">
                    <PinIcon on={true} />
                    Pinned
                  </span>
                )}
              </div>
            </div>

            {/* Body editor */}
            <div className="flex-1 flex flex-col px-6 py-5 overflow-hidden">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-[0.08em] mb-2 flex-shrink-0">
                Body
              </label>
              <textarea
                value={editorContent}
                onChange={e => { setEditorContent(e.target.value); setHasChanges(true) }}
                placeholder="Write your prompt here… Markdown is supported."
                className="flex-1 w-full resize-none text-[13px] text-zinc-700 leading-[1.75] bg-[#FAFAFA] border border-zinc-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent placeholder:text-zinc-300 transition-all scrollbar-hide"
                style={{ fontFamily: MONO }}
              />
            </div>

            {/* Status bar */}
            <div className="px-6 py-2.5 border-t border-zinc-200 bg-[#F8FAFC] flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-zinc-400">
                Current directory:{' '}
                <span className="text-zinc-600 font-medium">{currentFolder?.name ?? '—'}</span>
              </span>
              <div className="flex items-center gap-3">
                {hasChanges && (
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    Unsaved changes
                  </span>
                )}
                <span className="text-[11px] text-zinc-400">
                  {charCount.toLocaleString()} chars
                  <span className="mx-1.5 text-zinc-300">·</span>
                  {wordCount.toLocaleString()} words
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
