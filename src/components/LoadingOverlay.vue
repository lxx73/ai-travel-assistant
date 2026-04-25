<template>
  <div v-if="visible" class="loading-overlay" :class="{ 'fullscreen': fullscreen }">
    <div class="loading-content" :style="contentStyle">
      <!-- 加载动画 -->
      <div class="loading-spinner" :class="spinnerType">
        <div v-if="spinnerType === 'default'" class="spinner-default">
          <div class="spinner-circle"></div>
        </div>
        <div v-else-if="spinnerType === 'dots'" class="spinner-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
        <div v-else-if="spinnerType === 'pulse'" class="spinner-pulse">
          <div class="pulse-circle"></div>
        </div>
      </div>
      
      <!-- 提示文字 -->
      <div v-if="text" class="loading-text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 是否显示加载遮罩
  visible: {
    type: Boolean,
    default: false
  },
  // 是否全屏显示
  fullscreen: {
    type: Boolean,
    default: true
  },
  // 提示文字
  text: {
    type: String,
    default: '加载中...'
  },
  // 加载动画类型：default, dots, pulse
  spinnerType: {
    type: String,
    default: 'default',
    validator: (value: string) => {
      return ['default', 'dots', 'pulse'].includes(value)
    }
  },
  // 自定义样式
  contentStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped lang="scss">
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  
  &.fullscreen {
    position: fixed;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  min-width: 120px;
}

.loading-spinner {
  margin-bottom: 16px;
}

/* 默认加载动画 */
.spinner-default {
  .spinner-circle {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary-color, #1677FF);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
}

/* 点状加载动画 */
.spinner-dots {
  display: flex;
  gap: 8px;
  
  .dot {
    width: 12px;
    height: 12px;
    background-color: var(--primary-color, #1677FF);
    border-radius: 50%;
    animation: dot-bounce 1.4s ease-in-out infinite both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

/* 脉冲加载动画 */
.spinner-pulse {
  .pulse-circle {
    width: 40px;
    height: 40px;
    background-color: var(--primary-color, #1677FF);
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
}

.loading-text {
  font-size: 14px;
  color: var(--text-primary, #333);
  text-align: center;
  margin-top: 12px;
}

/* 动画定义 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dot-bounce {
  0%, 80%, 100% {
    transform: scale(0);
  } 40% {
    transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>