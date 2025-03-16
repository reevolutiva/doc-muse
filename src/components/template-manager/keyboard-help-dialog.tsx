"use client"

import { useState, useEffect } from 'react'
import { Command } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'

interface ShortcutInfo {
  key: string
  description: string
  modifier?: 'Cmd' | 'Ctrl' | 'Shift' | 'Alt'
  additionalModifier?: 'Cmd' | 'Ctrl' | 'Shift' | 'Alt'
}

const shortcuts: ShortcutInfo[] = [
  { key: 'S', description: 'Save template', modifier: 'Cmd' },
  { key: 'Z', description: 'Undo last change', modifier: 'Cmd' },
  { key: 'Z', description: 'Redo last change', modifier: 'Cmd', additionalModifier: 'Shift' },
  { key: 'D', description: 'Duplicate selected node', modifier: 'Cmd' },
  { key: 'Delete', description: 'Delete selected node' },
  { key: 'G', description: 'Toggle node grouping', modifier: 'Cmd' },
  { key: '?', description: 'Show/hide this help dialog' },
]

export function KeyboardHelpDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !event.shiftKey) {
        event.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Available keyboard shortcuts to help you work faster
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut) => (
            <div
              key={`${shortcut.key}-${shortcut.modifier || ''}`}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.modifier && (
                  <>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {isMac ? '⌘' : 'Ctrl'}
                    </kbd>
                    <span className="text-muted-foreground">+</span>
                  </>
                )}
                {shortcut.additionalModifier && (
                  <>
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {shortcut.additionalModifier === 'Shift' ? '⇧' : shortcut.additionalModifier}
                    </kbd>
                    <span className="text-muted-foreground">+</span>
                  </>
                )}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  {shortcut.key}
                </kbd>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}