import { useCallback, useEffect, useState } from 'react'
import {
  LoadHistory,
  AddHistory,
  DeleteHistory,
  ClearHistory,
} from '../../wailsjs/go/main/App'

export function useHistory() {
  const [history, setHistory] = useState<string[]>([])

  const load = useCallback(async () => {
    const h = await LoadHistory()
    setHistory(h ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const add = useCallback(async (url: string) => {
    await AddHistory(url)
    await load()
  }, [load])

  const remove = useCallback(async (url: string) => {
    await DeleteHistory(url)
    await load()
  }, [load])

  const clear = useCallback(async () => {
    await ClearHistory()
    setHistory([])
  }, [])

  return { history, add, remove, clear, reload: load }
}
