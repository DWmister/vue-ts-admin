<template>
  <div class="createPost-container">
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <div class="btn_publish">
        <el-button
          v-loading="loading"
          style="margin-left: 10px;"
          type="success"
          @click="submitForm"
        >
          发布
        </el-button>
      </div>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item
              style="margin-bottom: 40px;"
              prop="title"
            >
              <material-input
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
              >
                Title
              </material-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item
              label-width="60px"
              label="Author:"
            >
              <el-input
                v-model="postForm.author"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="author"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label-width="60px"
              label="Type:"
            >
              <el-select
                v-model="postForm.type"
                placeholder="type"
                clearable
                class="filter-item"
                @change="typeChange"
              >
                <el-option
                  v-for="item in articleType"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label-width="60px"
              label="Tag:"
            >
              <el-select
                v-model="postForm.tags"
                placeholder="tag"
                clearable
                multiple
              >
                <el-option
                  v-for="item in tagList"
                  :key="item.tag_id"
                  :label="item.tag_name"
                  :value="item.tag_id"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label-width="120px"
              label="Publish Time:"
            >
              <el-date-picker
                v-model="postForm.timestamp"
                type="date"
                format="yyyy-MM-dd"
                placeholder="Select date"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          style="margin-bottom: 40px;"
          label-width="70px"
          label="Summary:"
        >
          <el-input
            v-model="postForm.summary"
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="article summary"
          />
        </el-form-item>

        <el-form-item
          prop="content"
          style="margin-bottom: 30px;"
        >
          <tinymce
            v-if="tinymceActive"
            ref="editor"
            v-model="postForm.full_content"
            :height="500"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getArticle, defaultArticleData, addNews, getTagList } from '@/api/articles'
import { ITag } from '@/api/types'
import MaterialInput from '@/components/MaterialInput/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import { Form } from 'element-ui'
import { parseTime } from '@/utils/helper'

@Component({
  name: 'ArticleDetail',
  components: {
    MaterialInput,
    Tinymce
  }
})
export default class extends Vue {
  @Prop({ default: false }) private isEdit!: boolean
  @Prop({ default: false }) private total!: number

  private validateRequire = (rule: any, value: string, callback: Function) => {
    if (value === '') {
      if (rule.field === 'imageURL') {
        this.$message({
          message: 'Upload cover image is required',
          type: 'error'
        })
      } else {
        this.$message({
          message: rule.field + ' is required',
          type: 'error'
        })
      }
      callback(new Error(rule.field + ' is required'))
    } else {
      callback()
    }
  }

  private postForm = Object.assign({}, defaultArticleData)
  private loading = false
  private userListOptions = []
  private rules = {
    title: [{ validator: this.validateRequire }],
    full_content: [{ validator: this.validateRequire }]
  }

  private tagList: ITag[] = []
  private articleType = ['新闻', '公告', '活动', '攻略']

  private totalCopy = 0
  private tinymceActive = true
  // 监听接收父组件传来的异步数据
  @Watch('total')
  private dynamicTotal(total: number) {
    this.totalCopy = total
  }

  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(parseInt(id))
    }
    this.getTagList()
  }

  private async getTagList() {
    const res: any = await getTagList()
    if (res.code === '200') {
      this.tagList = res.data
    }
  }

  private async fetchData(id: number) {
    try {
      const res: any = await getArticle({
        id
      })
      if (res.code === '200') {
        this.postForm = res.data
      }
      const title = 'Edit Article'
      this.setPageTitle(title, id)
    } catch (err) {
      console.error(err)
    }
  }

  private setPageTitle(title: string, id: number) {
    document.title = `${title} - ${id}`
  }

  private typeChange(type: string) {
    if (type !== '攻略') {
      this.postForm.tags = []
    }
  }

  // 发布提交(新增/更新)
  private submitForm() {
    if (!this.isEdit) {
      this.postForm.order = this.totalCopy
    }
    this.postForm.timestamp = parseTime(this.postForm.timestamp, '{y}-{m}-{d}') as string
    (this.$refs.postForm as Form).validate(async valid => {
      if (valid) {
        this.loading = true
        const res: any = await addNews(this.postForm)
        if (res.code === '200') {
          this.$notify({
            title: 'Success',
            message: 'The post published successfully',
            type: 'success',
            duration: 1000
          })
          this.$router.push('/article/list')
        }
        this.loading = false
      } else {
        console.error('Submit Error!')
        return false
      }
    })
  }
}
</script>

<style lang="scss">
.article-textarea {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>

<style lang="scss" scoped>
.createPost-container {
  position: relative;

  .btn_publish {
    text-align: right;
    margin: 20px 45px 0;
  }

  .createPost-main-container {
    padding: 0 45px 20px 50px;
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
