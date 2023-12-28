import { useEffect } from "react"

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useClipboard(eventType, callback) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    const handle = (event) => {
      event.preventDefault()
      if (callback) callback()
    }

    // Bind the event listener
    document.addEventListener(eventType, handle)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener(eventType, handle)
    }
  }, [eventType, callback])
}
