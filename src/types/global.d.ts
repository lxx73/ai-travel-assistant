import { AxiosRequestConfig, AxiosResponse } from 'axios'

// 扩展Vue的全局属性
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $axios: any
    $http: {
      get: (url: string, params?: any) => Promise<any>
      post: (url: string, data?: any, params?: any) => Promise<any>
      put: (url: string, data?: any, params?: any) => Promise<any>
      delete: (url: string, params?: any) => Promise<any>
    }
    Get: (url: string, params?: any) => Promise<any>
    Post: (url: string, data?: any, params?: any) => Promise<any>
    Put: (url: string, data?: any, params?: any) => Promise<any>
    Delete: (url: string, params?: any) => Promise<any>
  }
}

// 扩展Window对象
declare global {
  interface Window {
    Get: (url: string, params?: any) => Promise<any>
    Post: (url: string, data?: any, params?: any) => Promise<any>
    Put: (url: string, data?: any, params?: any) => Promise<any>
    Delete: (url: string, params?: any) => Promise<any>
  }
}

export {}