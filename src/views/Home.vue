<template>
  <div class="home-page">
    <!-- Banner -->
    <section class="banner">
      <div class="container">
        <div class="banner-content">
          <h1 class="banner-title">让AI为你定制完美旅行</h1>
          <p class="banner-subtitle">智能生成个性化旅游攻略，让每一次旅行都独一无二</p>
          <router-link to="/customize" class="btn btn-primary btn-lg">立即定制</router-link>
        </div>
      </div>
    </section>

    <!-- 快捷攻略生成 -->
    <section class="quick-customize">
      <div class="container">
        <h2 class="section-title">快捷攻略生成</h2>
        <div class="quick-options">
          <div class="quick-card" @click="goToCustomize('北京', 3, '经济型')">
            <div class="quick-card-icon">🏙️</div>
            <h3 class="quick-card-title">城市游</h3>
            <p class="quick-card-desc">3天2晚 · 北京</p>
          </div>
          <div class="quick-card" @click="goToCustomize('三亚', 4, '舒适型')">
            <div class="quick-card-icon">🏖️</div>
            <h3 class="quick-card-title">海滩游</h3>
            <p class="quick-card-desc">4天3晚 · 三亚</p>
          </div>
          <div class="quick-card" @click="goToCustomize('丽江', 5, '精品型')">
            <div class="quick-card-icon">🏞️</div>
            <h3 class="quick-card-title">古镇游</h3>
            <p class="quick-card-desc">5天4晚 · 丽江</p>
          </div>
          <div class="quick-card" @click="goToCustomize('长白山', 3, '豪华型')">
            <div class="quick-card-icon">❄️</div>
            <h3 class="quick-card-title">滑雪游</h3>
            <p class="quick-card-desc">3天2晚 · 长白山</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门推荐 -->
    <section class="hot-recommendations">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">热门推荐</h2>
          <router-link to="/customize" class="see-more">查看更多</router-link>
        </div>
        <div class="recommendation-list">
          <div class="recommendation-card" v-for="item in recommendations" :key="item.id">
            <div class="recommendation-image">
              <img :src="item.image" :alt="item.title" />
            </div>
            <div class="recommendation-content">
              <h3 class="recommendation-title">{{ item.title }}</h3>
              <p class="recommendation-desc">{{ item.description }}</p>
              <div class="recommendation-info">
                <span class="info-item">{{ item.days }}天{{ item.nights }}晚</span>
                <span class="info-item">{{ item.budget }}</span>
                <span class="info-item">{{ item.rating }}⭐</span>
              </div>
              <router-link to="/result" class="btn btn-outline">查看详情</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能介绍 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <div class="feature-list">
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3 class="feature-title">AI生成旅游攻略</h3>
            <p class="feature-desc">根据你的偏好和需求，智能生成个性化的旅游攻略</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🏨</div>
            <h3 class="feature-title">景点/酒店/机票推荐</h3>
            <p class="feature-desc">基于AI分析，为你推荐最适合的景点、酒店和机票</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3 class="feature-title">行程管理</h3>
            <p class="feature-desc">智能管理你的行程，实时调整和优化</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3 class="feature-title">智能问答</h3>
            <p class="feature-desc">随时解答你的旅行问题，提供专业建议</p>
          </div>
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
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Home'
})

const router = useRouter()

// 热门推荐数据
const recommendations = [
  {
    id: 1,
    title: '北京经典5日游',
    description: '探索北京的历史文化，感受帝都的魅力',
    days: 5,
    nights: 4,
    budget: '¥3000/人',
    rating: 4.8,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Beijing%20Forbidden%20City%20landscape%2C%20tourist%20attraction%2C%20beautiful%20scenery&image_size=landscape_16_9'
  },
  {
    id: 2,
    title: '三亚阳光海滩4日游',
    description: '享受阳光、沙滩和海浪的完美假期',
    days: 4,
    nights: 3,
    budget: '¥4000/人',
    rating: 4.9,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Sanya%20beach%20tropical%20paradise%2C%20clear%20blue%20water%2C%20white%20sand&image_size=landscape_16_9'
  },
  {
    id: 3,
    title: '丽江古镇3日游',
    description: '体验纳西族文化，漫步古镇小巷',
    days: 3,
    nights: 2,
    budget: '¥2500/人',
    rating: 4.7,
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Lijiang%20ancient%20town%2C%20traditional%20Chinese%20architecture%2C%20cobblestone%20streets&image_size=landscape_16_9'
  }
]

// 快捷定制跳转
const goToCustomize = (destination: string, days: number, budget: string) => {
  router.push({
    path: '/customize',
    query: { destination, days, budget }
  })
}
</script>

<style scoped>
.home-page {
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

/* Banner */
.banner {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  padding: var(--spacing-xxl) 0;
  position: relative;
  overflow: hidden;
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=travel%20landscape%20abstract%20background%2C%20blurred%20scenery&image_size=landscape_16_9') center/cover;
  opacity: 0.1;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.banner-title {
  font-size: var(--font-size-xxxl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
  line-height: 1.2;
}

.banner-subtitle {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--font-size-lg);
}

/* 快捷攻略生成 */
.quick-customize {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.section-title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-semibold);
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
}

.quick-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.quick-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
}

.quick-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
  border-color: var(--primary-color);
}

.quick-card-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.quick-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.quick-card-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* 热门推荐 */
.hot-recommendations {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-light);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
}

.see-more {
  color: var(--primary-color);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.see-more:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.recommendation-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.recommendation-card {
  background-color: var(--background-white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: all var(--transition-normal);
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
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-xs);
}

.recommendation-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.5;
}

.recommendation-info {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* 功能介绍 */
.features {
  padding: var(--spacing-xl) 0;
  background-color: var(--background-white);
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-lg);
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.feature-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-xs);
}

.feature-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 底部 */
.footer {
  background-color: var(--text-primary);
  color: white;
  padding: var(--spacing-xl) 0;
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
  
  .banner-title {
    font-size: var(--font-size-xxl);
  }
  
  .banner-subtitle {
    font-size: var(--font-size-md);
  }
  
  .quick-options,
  .recommendation-list,
  .feature-list,
  .footer-content {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
}
</style>