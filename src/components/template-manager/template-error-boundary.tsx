"use client"

import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class TemplateErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Template editor error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="max-w-md p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              An error occurred while rendering the template editor. 
              Try refreshing the page or contact support if the problem persists.
            </p>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button
                variant="default"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </Button>
            </div>
            {this.state.error && (
              <pre className="mt-4 p-4 bg-muted rounded-lg text-left text-xs overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}