import request from '@/utils/request'
import { IArticleData } from './types'

export const defaultArticleData: IArticleData = {
  article_id: 0,
  order: 1,
  title: '',
  full_content: '',
  type: '新闻',
  summary: '',
  timestamp: new Date().getTime(),
  author: 'admin',
  tags: [],
  pageviews: 0
}

// 获取文章列表
export const getNewsList = (params: any) =>
  request({
    url: '/news/getNewsList',
    method: 'get',
    params
  })

// 获取某个字段的最值
export const getMax = (params?: any) =>
  request({
    url: '/news/getMax',
    method: 'get',
    params
  })

// 获取指定文章详情
export const getArticle = (params: any) => {
  return request({
    url: '/news/getNewsInfo',
    method: 'get',
    params
  })
}

// 添加文章
export const addNews = (data: IArticleData) =>
  request({
    url: '/news/addNews',
    method: 'post',
    data
  })

// 删除文章
export const delNews = (data: any) =>
  request({
    url: '/news/delNews',
    method: 'delete',
    data
  })

// 文章列表自定义排序
export const sortNewsList = (list: number[]) => {
  request({
    url: '/news/sortNewsList',
    method: 'post',
    data: { sort: list }
  })
}

// tag 获取
export const getTagList = () => {
  return request({
    url: '/news/getTagList',
    method: 'get'
  })
}
