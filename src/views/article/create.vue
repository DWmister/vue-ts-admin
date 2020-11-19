<template>
  <article-detail
    :is-edit="false"
    :total="total"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ArticleDetail from './components/ArticleDetail.vue'
import { getMax } from '@/api/articles'

@Component({
  name: 'CreateArticle',
  components: {
    ArticleDetail
  }
})
export default class extends Vue {
  private total = 1
  created() {
    this.getList()
  }

  private async getList() {
    const res: any = await getMax({ prop: 'order', direction: 'desc' })
    if (res.code === '200') {
      this.total = res.data + 1
    } else {
      this.total = 0
    }
  }
}
</script>
