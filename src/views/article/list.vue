<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        placeholder="type"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="typeChange"
      >
        <el-option
          v-for="item in articleType"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-input
        v-model="listQuery.title"
        placeholder="title"
        clearable
        class="filter-item"
        style="width: 300px"
        @change="titleChange"
      />
      <el-select
        v-model="listQuery.tag"
        placeholder="tag"
        clearable
        class="filter-item"
        style="width: 130px"
        @change="tagChange"
      >
        <el-option
          v-for="item in tagList"
          :key="item.tag_id"
          :label="item.tag_name"
          :value="item.tag_id"
        />
      </el-select>
      <el-button
        v-show="showSave"
        type="primary"
        class="filter-item"
        @click="saveSort"
      >
        sort save
      </el-button>
    </div>
    <el-table
      ref="draggableTable"
      v-loading="listLoading"
      :data="list"
      row-key="article_id"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- <el-table-column
        width="80"
        align="center"
        label="Order"
      >
        <template slot-scope="{row}">
          <span>{{ row.order }}</span>
        </template>
      </el-table-column> -->

      <el-table-column
        min-width="300px"
        label="Title"
      >
        <template slot-scope="{row}">
          <router-link
            :to="'/article/edit/'+row.article_id"
            class="link-type"
          >
            <span>{{ row.title }}</span>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="Author"
        prop="author"
      />

      <el-table-column
        width="150px"
        align="center"
        label="Type"
      >
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="Tag"
      >
        <template slot-scope="{row}">
          <span>{{ arrToStr(row.tags, 'tag_name') }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="Date"
        prop="timestamp"
      />

      <el-table-column
        align="center"
        label="Actions"
        width="150"
      >
        <template slot-scope="{row}">
          <router-link :to="'/article/edit/'+row.article_id">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
            />
          </router-link>
          <el-button
            class="btn_del"
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteRow(row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getNewsList, delNews, getTagList } from '@/api/articles'
import { ITag } from '@/api/types'
import Pagination from '@/components/Pagination/index.vue'
import Sortable from 'sortablejs'
import { arrToStr } from '@/utils/helper'

@Component({
  name: 'ArticleList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private total = 0
  private list: any[] = []
  private tagList: ITag[] = []
  private newIdList: number[] = []
  private listLoading = true
  private showSave = false
  private articleType = ['新闻', '公告', '活动', '攻略']
  private listQuery = {
    page: 1,
    limit: 10,
    type: '新闻',
    title: '',
    tag: ''
  }

  private arrToStr = arrToStr
  private sortable: Sortable | null = null

  @Watch('listQuery', { immediate: true, deep: true })
  private isShowSave(query: any) {
    this.showSave = !query.type && query.page === 1 && !query.tag
  }

  created() {
    this.getList()
    this.getTagList()
  }

  private async getTagList() {
    const res: any = await getTagList()
    if (res.code === '200') {
      this.tagList = res.data
    }
  }

  private tagChange(type: string) {
    this.listQuery.tag = type
    this.listQuery.page = 1
    this.getList()
  }

  private typeChange(type: string) {
    this.listQuery.type = type
    this.listQuery.page = 1
    this.getList()
  }

  private titleChange(title: string) {
    this.listQuery.title = title
    this.listQuery.page = 1
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const res: any = await getNewsList(this.listQuery)
    if (res.code === '200') {
      this.list = res.data.list
      this.total = res.data.count
      this.newIdList = this.list.map((v) => v.article_id)
    }
    this.listLoading = false
    // this.$nextTick(() => {
    //   this.setSort()
    // })
  }

  private setSort() {
    const el = (this.$refs.draggableTable as Vue).$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0] as HTMLElement
    this.sortable = Sortable.create(el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder
      // 拖拽结束事件
      onEnd: evt => {
        if (typeof (evt.oldIndex) !== 'undefined' && typeof (evt.newIndex) !== 'undefined') {
          const idIndex = this.newIdList.splice(evt.oldIndex, 1)[0]
          this.newIdList.splice(evt.newIndex, 0, idIndex)
        }
      }
    })
  }

  // todo: 保存新的排序
  private async saveSort() {
    console.log(this.newIdList)
  }

  private async deleteRow(row: any) {
    return this.$confirm(`确定删除 ${row.title}？`, {
      closeOnClickModal: false
    })
      .then(async() => {
        this.listLoading = true
        const res: any = await delNews({ id: row.article_id })
        if (res.code === '200') {
          this.getList()
        }
        this.listLoading = false
      })
      .catch(() => {
        console.log('取消')
      })
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.btn_del {
  margin-left: 10px;
}
</style>
<style lang="scss">
.sortable-ghost {
  opacity: .8;
  color: #fff!important;
  background: #42b983!important;
}
</style>
