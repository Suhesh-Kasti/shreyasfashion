'use client'

import { useEffect } from 'react'

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || ''
      
      // Suppress specific Sanity patch errors
      if (
        errorMessage.includes('Cannot apply deep operations on primitive values') ||
        errorMessage.includes('Received patch with type "set"') ||
        errorMessage.includes('that targeted the value "undefined"')
      ) {
        console.warn('Sanity patch error suppressed:', errorMessage)
        event.preventDefault()
        return
      }
      
      // Log other errors for debugging
      console.error('Unhandled promise rejection:', event.reason)
    }

    // Handle general JavaScript errors
    const handleError = (event: ErrorEvent) => {
      const errorMessage = event.message || ''
      
      // Suppress specific Sanity patch errors
      if (
        errorMessage.includes('Cannot apply deep operations on primitive values') ||
        errorMessage.includes('Received patch with type "set"') ||
        errorMessage.includes('that targeted the value "undefined"')
      ) {
        console.warn('Sanity patch error suppressed:', errorMessage)
        event.preventDefault()
        return
      }
      
      // Log other errors for debugging
      console.error('JavaScript error:', event.error || event.message)
    }

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  return null // This component doesn't render anything
}
