<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">关于项目</h3>
          <p class="footer-text">AI旅游定制助手是一款基于人工智能技术的旅游规划平台，为您提供个性化的旅行攻略和智能问答服务。</p>
        </div>
        <div class="footer-section">
          <h3 class="footer-title">快速链接</h3>
          <ul class="footer-links">
            <li><router-link to="/">首页</router-link></li>
            <li><router-link to="/customize">AI攻略定制</router-link></li>
            <li><router-link to="/chat">智能问答</router-link></li>
            <li><router-link to="/user">用户中心</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-title">联系我们</h3>
          <p class="footer-text">邮箱：support@tripsy.com</p>
          <p class="footer-text">电话：400-123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 AI旅游定制助手. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 页脚组件
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 40px 0 20px;
  margin-top: auto;
}

.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section {
  text-align: left;
}

.footer-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #fff;
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 16px;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .footer-section {
    text-align: center;
  }
}
</style>