
// tagList
export interface ITag {
  tag_id: string | number
  tag_name: string
}

/**
 * 字段描述
 * article_id: 文章id
 * order: 文章的排序
 * title： 文章标题
 * summary： 文章概要
 * full_content 文章内容
 * type: 文章类型
 * timestamp: 文章发表时间
 * author: 作者
 * pageviews: 阅读量
 */
export interface IArticleData {
  article_id?: number
  order?: number
  title: string
  summary?: string
  full_content?: string
  type: string
  timestamp?: string | number
  author: string
  pageviews?: number
  tags: ITag[] | number[]
  image_url?: string
}

export interface ICustomRes {
  code: string,
  msg: string,
  data: string | any[] | object
}
