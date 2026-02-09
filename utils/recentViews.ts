type RecentView = {
  id: number
  name: string
  image: string
  content?: string
  author?: string
  viewedAt: string
}


export const saveRecentView = (product: {
  _id: number
  name: string
  mainImages: { path: string }[]
  content?: string
  extra?: {
    author?: string
  }
}, userId?: number) => {
  if (typeof window === 'undefined') return


  const key = userId ? `recentViews_${userId}` : 'recentViews_guest'
  
  const saved = localStorage.getItem(key)
  const recents: RecentView[] = saved ? JSON.parse(saved) : []

  const newView: RecentView = {
    id: product._id,
    name: product.name,
    image: product.mainImages[0]?.path || '',
    content: product.content,
    author: product.extra?.author,
    viewedAt: new Date().toLocaleString('ko-KR')
  }

  
  const filtered = recents.filter(item => item.id !== product._id)


  const updated = [newView, ...filtered].slice(0, 20)

  localStorage.setItem(key, JSON.stringify(updated))
}


export const getRecentViews = (userId?: number): RecentView[] => {
  if (typeof window === 'undefined') return []

  const key = userId ? `recentViews_${userId}` : 'recentViews_guest'
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : []
}


export const clearRecentViews = (userId?: number) => {
  if (typeof window === 'undefined') return
  
  const key = userId ? `recentViews_${userId}` : 'recentViews_guest'
  localStorage.removeItem(key)
}