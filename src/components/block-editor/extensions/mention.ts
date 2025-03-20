"use client"

import { Mention } from '@tiptap/extension-mention'
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import MentionList from './mention-list'

export const CustomMention = Mention.configure({
  HTMLAttributes: {
    class: 'mention',
  },
  suggestion: {
    items: ({ query }: { query: string }) => {
      return [
        'Sarah Brown',
        'John Doe',
        'Michael Smith',
        'Jessica Wilson',
      ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
    },

    render: () => {
      let component: any
      let popup: any

      return {
        onStart: props => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          })

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },

        onUpdate(props: any) {
          component.updateProps(props)

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },

        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            popup[0].hide()
            return true
          }

          return component.ref?.onKeyDown(props)
        },

        onExit() {
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  },
})
