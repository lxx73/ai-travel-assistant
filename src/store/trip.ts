import { defineStore } from 'pinia'

interface Itinerary {
  id: string
  destination: string
  days: number
  nights: number
  budgetType: string
  budgetAmount: number
  budget: string
  planContent: string
  createdAt: string
  title: string
  // AI返回的结构化数据
  overview: {
    title: string
    description: string
    budget_summary: string
  }
  scheduleDays: Array<{
    day_number: number
    day_title: string
    schedule: Array<{
      time: string
      title: string
      description: string
      location: string
      icon: string
    }>
  }>
  accommodation: Array<{
    name: string
    description: string
    price_range: string
  }>
  budgetDetails: {
    total: string
    breakdown: Array<{
      item: string
      amount: string
    }>
  }
  tips: string
  // 扩展字段
  food: Array<{
    name: string
    description: string
    icon: string
  }>
  transportation: string
  // 保持兼容性的字段
  dailyActivities: Array<{
    day: number
    activities: Array<{
      time: string
      activity: string
      description: string
    }>
  }>
  recommendations: Array<{
    category: string
    items: string[]
  }>
}

interface TripState {
  currentItinerary: Itinerary | null
  recentItineraries: Itinerary[]
}

export const useTripStore = defineStore('trip', {
  state: (): TripState => ({
    currentItinerary: null,
    recentItineraries: []
  }),
  actions: {
    setCurrentItinerary(itinerary: Itinerary) {
      this.currentItinerary = itinerary
      // 添加到最近行程
      const existingIndex = this.recentItineraries.findIndex(item => item.id === itinerary.id)
      if (existingIndex !== -1) {
        this.recentItineraries.splice(existingIndex, 1)
      }
      this.recentItineraries.unshift(itinerary)
      // 限制最近行程数量为5个
      if (this.recentItineraries.length > 5) {
        this.recentItineraries = this.recentItineraries.slice(0, 5)
      }
    },
    clearCurrentItinerary() {
      this.currentItinerary = null
    },
    getItineraryById(id: string) {
      return this.recentItineraries.find(item => item.id === id)
    }
  }
})