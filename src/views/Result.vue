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
              <span class="info-label">出行类型</span>
              <span class="info-value">{{ itinerary.travelType }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">出行人数</span>
              <span class="info-value">{{ itinerary.people }}人</span>
            </div>
            <div class="info-item">
              <span class="info-label">出发日期</span>
              <span class="info-value">{{ formatDate(itinerary.startDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 每日行程 -->
    <section class="daily-itinerary">
      <div class="container">
        <h2 class="section-title">每日行程</h2>
        <div class="daily-list">
          <div 
            v-for="(day, index) in itinerary.dailySchedule" 
            :key="index"
            class="daily-card"
          >
            <div class="daily-header">
              <h3 class="day-title">第{{ index + 1 }}天</h3>
              <span class="day-date">{{ day.date }}</span>
            </div>
            <div class="daily-activities">
              <div 
                v-for="(activity, activityIndex) in day.activities" 
                :key="activityIndex"
                class="activity-item"
              >
                <div class="activity-time">{{ activity.time }}</div>
                <div class="activity-content">
                  <h4 class="activity-title">{{ activity.title }}</h4>
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

    <!-- 推荐信息 -->
    <section class="recommendations">
      <div class="container">
        <h2 class="section-title">推荐信息</h2>
        <div class="recommendation-tabs">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="景点" name="attractions">
              <div class="recommendation-grid">
                <div 
                  v-for="(attraction, index) in itinerary.recommendations.attractions" 
                  :key="index"
                  class="recommendation-card"
                >
                  <div class="recommendation-image">
                    <img :src="attraction.image" :alt="attraction.name" />
                  </div>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">{{ attraction.name }}</h4>
                    <p class="recommendation-desc">{{ attraction.description }}</p>
                    <div class="recommendation-rating">
                      ⭐ {{ attraction.rating }}
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="酒店" name="hotels">
              <div class="recommendation-grid">
                <div 
                  v-for="(hotel, index) in itinerary.recommendations.hotels" 
                  :key="index"
                  class="recommendation-card"
                >
                  <div class="recommendation-image">
                    <img :src="hotel.image" :alt="hotel.name" />
                  </div>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">{{ hotel.name }}</h4>
                    <p class="recommendation-desc">{{ hotel.description }}</p>
                    <div class="recommendation-price">
                      ¥{{ hotel.price }}/晚
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="餐厅" name="restaurants">
              <div class="recommendation-grid">
                <div 
                  v-for="(restaurant, index) in itinerary.recommendations.restaurants" 
                  :key="index"
                  class="recommendation-card"
                >
                  <div class="recommendation-image">
                    <img :src="restaurant.image" :alt="restaurant.name" />
                  </div>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">{{ restaurant.name }}</h4>
                    <p class="recommendation-desc">{{ restaurant.description }}</p>
                    <div class="recommendation-price">
                      ¥{{ restaurant.price }}/人
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-info">
            <h3>AI旅游定制助手</h3>
            <p>让每一次旅行都成为难忘的回忆</p>
          </div>
          <div class="footer-links">
            <h4>快速链接</h4>
            <ul>
              <li><router-link to="/">首页</router-link></li>
              <li><router-link to="/customize">AI攻略定制</router-link></li>
              <li><router-link to="/chat">智能问答</router-link></li>
              <li><router-link to="/user">用户中心</router-link></li>
            </ul>
          </div>
          <div class="footer-contact">
            <h4>联系我们</h4>
            <p>邮箱：contact@aitravel.com</p>
            <p>电话：400-123-4567</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 AI旅游定制助手. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isFavorite = ref(false)
const activeTab = ref('attractions')

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 模拟行程数据
const itinerary = reactive({
  title: `${(route.query.destination as string) || '北京'}${(route.query.days as string) || 5}日${(route.query.travelType as string) || '自由'}行`,
  destination: (route.query.destination as string) || '北京',
  days: Number(route.query.days as string) || 5,
  nights: (Number(route.query.days as string) || 5) - 1,
  budget: (route.query.budget as string) || '舒适型',
  travelType: (route.query.travelType as string) || '自由行',
  people: Number(route.query.people as string) || 2,
  startDate: (route.query.startDate as string) || new Date().toISOString().split('T')[0],
  dailySchedule: [
    {
      date: '第一天',
      activities: [
        {
          time: '09:00',
          title: '抵达北京',
          description: '抵达北京首都国际机场，乘坐机场大巴前往市区',
          location: '北京首都国际机场'
        },
        {
          time: '12:00',
          title: '午餐',
          description: '品尝北京特色午餐',
          location: '王府井大街'
        },
        {
          time: '14:00',
          title: '故宫博物院',
          description: '游览世界文化遗产，感受中国古代皇家建筑的魅力',
          location: '故宫博物院'
        },
        {
          time: '18:00',
          title: '晚餐',
          description: '品尝北京烤鸭',
          location: '全聚德烤鸭店'
        }
      ]
    },
    {
      date: '第二天',
      activities: [
        {
          time: '08:00',
          title: '天安门广场',
          description: '观看升旗仪式，参观天安门广场',
          location: '天安门广场'
        },
        {
          time: '10:00',
          title: '八达岭长城',
          description: '游览中国标志性建筑，感受长城的雄伟',
          location: '八达岭长城'
        },
        {
          time: '16:00',
          title: '颐和园',
          description: '游览皇家园林，欣赏湖光山色',
          location: '颐和园'
        }
      ]
    },
    {
      date: '第三天',
      activities: [
        {
          time: '09:00',
          title: '圆明园',
          description: '参观历史遗迹，了解中国近代史',
          location: '圆明园'
        },
        {
          time: '13:00',
          title: '清华大学',
          description: '参观中国顶尖学府，感受学术氛围',
          location: '清华大学'
        },
        {
          time: '15:00',
          title: '北京大学',
          description: '参观中国顶尖学府，感受学术氛围',
          location: '北京大学'
        },
        {
          time: '18:00',
          title: '三里屯',
          description: '游览时尚街区，体验北京现代生活',
          location: '三里屯'
        }
      ]
    }
  ],
  recommendations: {
    attractions: [
      {
        name: '故宫博物院',
        description: '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一',
        rating: 4.9,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Forbidden%20City%20Beijing%2C%20Chinese%20imperial%20palace%2C%20historical%20landmark&image_size=landscape_4_3'
      },
      {
        name: '八达岭长城',
        description: '中国最具代表性的长城段落，以其宏伟的建筑和壮丽的自然风光闻名',
        rating: 4.8,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Great%20Wall%20of%20China%20Badaling%2C%20magnificent%20landscape%2C%20historical%20architecture&image_size=landscape_4_3'
      },
      {
        name: '颐和园',
        description: '中国现存规模最大、保存最完整的皇家园林，被誉为皇家园林博物馆',
        rating: 4.7,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Summer%20Palace%20Beijing%2C%20royal%20garden%2C%20traditional%20Chinese%20architecture&image_size=landscape_4_3'
      }
    ],
    hotels: [
      {
        name: '北京王府井希尔顿酒店',
        description: '位于市中心，交通便利，设施豪华',
        price: 1200,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Hilton%20hotel%20Beijing%2C%20luxury%20accommodation%2C%20modern%20interior&image_size=landscape_4_3'
      },
      {
        name: '北京国贸大酒店',
        description: '位于CBD核心区，视野开阔，服务一流',
        price: 1500,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=China%20World%20Hotel%20Beijing%2C%20upscale%20hotel%2C%20city%20view&image_size=landscape_4_3'
      }
    ],
    restaurants: [
      {
        name: '全聚德烤鸭店',
        description: '百年老字号，北京烤鸭的代表品牌',
        price: 200,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Peking%20duck%20restaurant%2C%20traditional%20Chinese%20cuisine%2C%20delicious%20food&image_size=landscape_4_3'
      },
      {
        name: '东来顺饭庄',
        description: '传统涮羊肉老字号，口味正宗',
        price: 150,
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Donglaishun%20restaurant%2C%20hot%20pot%20dining%2C%20traditional%20Chinese%20cuisine&image_size=landscape_4_3'
      }
    ]
  }
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
  background-color: var(--background-white);
}

.overview-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
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
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.itinerary-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.overview-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.info-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

/* 每日行程 */
.daily-itinerary {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
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
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  transition: all var(--transition-normal);
}

.daily-card:hover {
  box-shadow: var(--shadow-md);
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

/* 推荐信息 */
.recommendations {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.recommendation-tabs {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--border-color);
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