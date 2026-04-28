<template>
  <div class="result-page">
    <!-- 行程概览 -->
    <section class="itinerary-overview">
      <div class="container">
        <div class="overview-card">
          <div class="overview-header">
            <h1 class="itinerary-title">{{ itinerary.title }}</h1>
            <div class="itinerary-actions">
              <button class="btn btn-outline" @click="favoriteItinerary">
                <span v-if="isFavorite">❤️</span>
                <span v-else>🤍</span>
                {{ isFavorite ? '已收藏' : '收藏' }}
              </button>
              <button class="btn btn-outline" @click="shareItinerary">
                📤 分享
              </button>
              <router-link to="/customize" class="btn btn-primary">
                重新定制
              </router-link>
            </div>
          </div>
          <div class="overview-info">
            <div class="info-item">
              <span class="info-label">目的地</span>
              <span class="info-value">{{ itinerary.destination }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">行程天数</span>
              <span class="info-value">{{ itinerary.days }}天{{ itinerary.nights }}晚</span>
            </div>
            <div class="info-item">
              <span class="info-label">预算</span>
              <span class="info-value">{{ itinerary.budget }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">创建时间</span>
              <span class="info-value">{{ formatDate(itinerary.createdAt) }}</span>
            </div>
          </div>
          <!-- AI返回的行程概览 -->
          <div v-if="itinerary.overview" class="overview-details">
            <h3 class="section-subtitle">行程概览</h3>
            <p class="overview-description">{{ itinerary.overview.description }}</p>
            <p class="overview-budget">{{ itinerary.overview.budget_summary }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 预算详情 -->
    <section v-if="itinerary.budgetDetails" class="budget-details">
      <div class="container">
        <h2 class="section-title">预算详情</h2>
        <div class="budget-card">
          <div class="budget-total">
            <span class="budget-label">总预算</span>
            <span class="budget-value">{{ itinerary.budgetDetails.total }}</span>
          </div>
          <div v-if="itinerary.budgetDetails.breakdown && itinerary.budgetDetails.breakdown.length > 0" class="budget-breakdown">
            <h3 class="section-subtitle">费用明细</h3>
            <div class="budget-list">
              <div v-for="(item, index) in itinerary.budgetDetails.breakdown" :key="index" class="budget-item">
                <span class="budget-item-name">{{ item.item }}</span>
                <span class="budget-item-amount">{{ item.amount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 住宿推荐 -->
    <section v-if="itinerary.accommodation && itinerary.accommodation.length > 0" class="accommodation">
      <div class="container">
        <h2 class="section-title">住宿推荐</h2>
        <div class="accommodation-list">
          <div v-for="(hotel, index) in itinerary.accommodation" :key="index" class="accommodation-card">
            <h3 class="hotel-name">{{ hotel.name }}</h3>
            <p class="hotel-description">{{ hotel.description }}</p>
            <p class="hotel-price">{{ hotel.price_range }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 每日行程 -->
    <section class="daily-itinerary">
      <div class="container">
        <h2 class="section-title">每日行程</h2>
        <div class="daily-list">
          <!-- 优先使用AI返回的scheduleDays数据 -->
          <div
            v-for="(day, index) in itinerary.scheduleDays || itinerary.dailyActivities"
            :key="day.day_number || day.day || index"
            class="daily-card"
          >
            <div class="daily-header">
              <h3 class="day-title">{{ day.day_title || `第${day.day_number || day.day || index + 1}天` }}</h3>
            </div>
            <div class="daily-activities">
              <div
                v-for="(activity, activityIndex) in day.schedule || day.activities"
                :key="activityIndex"
                class="activity-item"
              >
                <div class="activity-time">{{ activity.time }}</div>
                <div class="activity-content">
                  <h4 class="activity-title">{{ activity.title || activity.activity }} {{ activity.icon }}</h4>
                  <p class="activity-desc">{{ activity.description }}</p>
                  <div v-if="activity.location" class="activity-location">
                    📍 {{ activity.location }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 旅行提示 -->
    <section v-if="itinerary.tips" class="travel-tips">
      <div class="container">
        <h2 class="section-title">旅行提示</h2>
        <div class="tips-card">
          <p class="tips-content">{{ itinerary.tips }}</p>
        </div>
      </div>
    </section>

    <!-- 美食推荐 -->
    <section v-if="itinerary.food && itinerary.food.length > 0" class="food-recommendations">
      <div class="container">
        <h2 class="section-title">美食推荐</h2>
        <div class="food-list">
          <div v-for="(item, index) in itinerary.food" :key="index" class="food-card">
            <div class="food-icon">{{ item.icon || '🍽️' }}</div>
            <div class="food-info">
              <h3 class="food-name">{{ item.name }}</h3>
              <p class="food-desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 交通提示 -->
    <section v-if="itinerary.transportation" class="transportation-tips">
      <div class="container">
        <h2 class="section-title">交通提示</h2>
        <div class="transport-card">
          <p class="transport-content">{{ itinerary.transportation }}</p>
        </div>
      </div>
    </section>

    <!-- 推荐信息 -->
    <section class="recommendations">
      <div class="container">
        <h2 class="section-title">推荐信息</h2>
        <div class="recommendation-tabs">
          <el-tabs v-model="activeTab">
            <el-tab-pane
              v-for="(rec, index) in itinerary.recommendations"
              :key="index"
              :label="rec.category"
              :name="rec.category"
            >
              <div class="recommendation-grid">
                <div
                  v-for="(item, itemIndex) in rec.items"
                  :key="itemIndex"
                  class="recommendation-card"
                >
                  <div class="recommendation-image">
                    <img :src="`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(item + ', travel destination, beautiful scenery')}&image_size=landscape_4_3`" :alt="item" />
                  </div>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">{{ item }}</h4>
                    <p class="recommendation-desc">{{ item }}是{{ itinerary.destination }}的著名景点，值得一游。</p>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTripStore } from '@/store/trip'

const route = useRoute()
const router = useRouter()
const isFavorite = ref(false)
const activeTab = ref('attractions')
const tripStore = useTripStore()

// 行程数据
const itinerary = reactive({
  id: '',
  title: '',
  destination: '',
  days: 0,
  nights: 0,
  budgetType: '',
  budgetAmount: 0,
  budget: '',
  planContent: '',
  createdAt: '',
  overview: {
    title: '',
    description: '',
    budget_summary: ''
  },
  scheduleDays: [] as Array<{
    day_number: number
    day_title: string
    schedule: Array<{
      time: string
      title: string
      description: string
      location: string
      icon: string
    }>
  }>,
  accommodation: [] as Array<{
    name: string
    description: string
    price_range: string
  }>,
  budgetDetails: {
    total: '',
    breakdown: [] as Array<{
      item: string
      amount: string
    }>
  },
  tips: '',
  dailyActivities: [] as Array<{
    day: number
    activities: Array<{
      time: string
      activity: string
      description: string
    }>
  }>,
  recommendations: [] as Array<{
    category: string
    items: string[]
  }>,
  food: [] as Array<{
    name: string
    description: string
    icon: string
  }>,
  transportation: ''
})

// 从Pinia获取行程数据
const loadItineraryFromStore = () => {
  const currentItinerary = tripStore.currentItinerary
  console.log('从Pinia获取的行程数据:', currentItinerary);
  
  if (currentItinerary) {
    // 深度复制数据，避免引用问题
    Object.assign(itinerary, JSON.parse(JSON.stringify(currentItinerary)))
    
    // 确保所有必要的字段都存在
    if (!itinerary.overview) {
      itinerary.overview = {
        title: itinerary.title,
        description: '',
        budget_summary: itinerary.budget
      }
    }
    
    if (!itinerary.scheduleDays) {
      itinerary.scheduleDays = []
    }
    
    if (!itinerary.budgetDetails) {
      itinerary.budgetDetails = {
        total: itinerary.budget,
        breakdown: []
      }
    }
    
    if (!itinerary.accommodation) {
      itinerary.accommodation = []
    }
    
    if (!itinerary.tips) {
      itinerary.tips = ''
    }
    
    if (!itinerary.food) {
      itinerary.food = []
    }
    
    if (!itinerary.transportation) {
      itinerary.transportation = ''
    }
    
    // 处理AI返回的结构化数据
    console.log('处理前的scheduleDays:', itinerary.scheduleDays);
    
    if (itinerary.scheduleDays && itinerary.scheduleDays.length > 0) {
      // 转换scheduleDays为dailyActivities格式以保持兼容性
      itinerary.dailyActivities = itinerary.scheduleDays.map((day, index) => ({
        day: day.day_number || day.day || index + 1,
        activities: (day.schedule || day.activities || []).map(item => ({
          time: item.time || '',
          activity: item.title || item.activity || '',
          description: item.description || ''
        }))
      }))
      console.log('转换后的dailyActivities:', itinerary.dailyActivities);
    }
    
    // 生成推荐
    generateRecommendations()
  } else {
    // 如果没有行程数据，重定向到定制页面
    router.push('/customize')
  }
}

// 生成推荐
const generateRecommendations = () => {
  const destination = itinerary.destination
  itinerary.recommendations = [
    {
      category: '景点',
      items: [`${destination}古城`, `${destination}雪山`, `${destination}湖泊`]
    },
    {
      category: '美食',
      items: [`${destination}特色小吃`, `${destination}纳西族菜`, `${destination}火锅`]
    },
    {
      category: '住宿',
      items: [`${destination}古城客栈`, `${destination}星级酒店`, `${destination}民宿`]
    }
  ]
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 在组件激活时加载行程数据
onActivated(() => {
  loadItineraryFromStore()
})

// 在组件挂载时加载行程数据
onMounted(() => {
  loadItineraryFromStore()
})

// 收藏行程
const favoriteItinerary = () => {
  isFavorite.value = !isFavorite.value
}

// 分享行程
const shareItinerary = () => {
  if (navigator.share) {
    navigator.share({
      title: itinerary.title,
      text: `我的${itinerary.destination}${itinerary.days}日行程`,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
}

/* 导航栏 */
.navbar {
  background-color: var(--background-white);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}

.brand-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: var(--spacing-md);
}

.nav-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.nav-item:hover,
.nav-item.active {
  color: var(--primary-color);
  background-color: var(--primary-light);
}

/* 行程概览 */
.itinerary-overview {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.overview-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.itinerary-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.itinerary-actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.overview-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

/* 行程概览详情 */
.overview-details {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.overview-description {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.overview-budget {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

/* 预算详情 */
.budget-details {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.budget-card {
  background-color: var(--background-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
}

.budget-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--spacing-lg);
}

.budget-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.budget-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.budget-breakdown {
  margin-top: var(--spacing-lg);
}

.budget-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.budget-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.budget-item-name {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.budget-item-amount {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}

/* 住宿推荐 */
.accommodation {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.accommodation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.accommodation-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.accommodation-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.hotel-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.hotel-description {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}

.hotel-price {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

/* 旅行提示 */
.travel-tips {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.tips-card {
  background-color: var(--primary-light);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary-color);
}

.tips-content {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}

/* 每日行程 */
.daily-itinerary {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.section-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.daily-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.daily-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
  transition: all var(--transition-normal);
}

.daily-card:hover {
  box-shadow: var(--shadow-lg);
}

.daily-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--border-color);
}

.day-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.day-date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.daily-activities {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.activity-item {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}

.activity-item:hover {
  background-color: var(--background-light);
}

.activity-time {
  min-width: 80px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
  padding-top: 2px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.activity-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.5;
}

.activity-location {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 美食推荐 */
.food-recommendations {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.food-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.food-card {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
}

.food-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.food-icon {
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.food-info {
  flex: 1;
}

.food-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.food-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* 交通提示 */
.transportation-tips {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.transport-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid var(--primary-color);
}

.transport-content {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}

/* 推荐信息 */
.recommendations {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.recommendation-tabs {
  background-color: var(--background-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-lg);
}

.recommendation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.recommendation-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
}

.recommendation-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.recommendation-image {
  height: 200px;
  overflow: hidden;
}

.recommendation-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.recommendation-card:hover .recommendation-image img {
  transform: scale(1.05);
}

.recommendation-content {
  padding: var(--spacing-md);
}

.recommendation-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.recommendation-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.5;
}

.recommendation-rating,
.recommendation-price {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--primary-color);
}

/* 底部 */
.footer {
  background-color: var(--text-primary);
  color: white;
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.footer-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.footer-info p {
  font-size: var(--font-size-sm);
  opacity: 0.8;
}

.footer-links h4,
.footer-contact h4 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-sm);
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--spacing-xs);
}

.footer-links a {
  color: white;
  text-decoration: none;
  font-size: var(--font-size-sm);
  opacity: 0.8;
  transition: opacity var(--transition-fast);
}

.footer-links a:hover {
  opacity: 1;
  text-decoration: underline;
}

.footer-contact p {
  font-size: var(--font-size-sm);
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: var(--spacing-md);
  text-align: center;
  font-size: var(--font-size-xs);
  opacity: 0.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-menu {
    gap: var(--spacing-sm);
  }

  .nav-item {
    font-size: var(--font-size-sm);
    padding: var(--spacing-xs);
  }

  .overview-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .itinerary-actions {
    width: 100%;
    justify-content: space-between;
  }

  .overview-info {
    grid-template-columns: 1fr;
  }

  .activity-item {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .activity-time {
    min-width: auto;
  }

  .recommendation-grid {
    grid-template-columns: 1fr;
  }
}
</style>
