<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <h1 class="brand-title">AI旅游定制助手</h1>
      </div>
      <div class="navbar-menu">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">首页</router-link>
        <router-link to="/customize" class="nav-item" :class="{ active: $route.path === '/customize' }">AI攻略定制</router-link>
        <router-link to="/chat" class="nav-item" :class="{ active: $route.path === '/chat' }">智能问答</router-link>
        <router-link to="/user" class="nav-item" :class="{ active: $route.path === '/user' }">用户中心</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 导航栏组件
</script>

<style scoped>
.navbar {
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.navbar-menu {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-item {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: all var(--transition-fast);
  padding: 8px 0;
  position: relative;
}

.nav-item:hover {
  color: var(--primary-color);
}

.nav-item.active {
  color: var(--primary-color);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 1px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 16px;
  }

  .brand-title {
    font-size: 20px;
  }

  .navbar-menu {
    gap: 16px;
  }

  .nav-item {
    font-size: 14px;
  }
}
</style>