<template>
  <div class="upload-container">
    <el-button
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      upload
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
    >
      <el-upload
        :action="src"
        :multiple="true"
        :file-list="defaultFileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        accept="image/png,image/jpg,image/jpeg"
        class="editor-slide-upload"
        list-type="picture-card"
      >
        <el-button
          size="small"
          type="primary"
        >
          Click upload
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        Cancel
      </el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
      >
        Confirm
      </el-button>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ElUploadInternalRawFile } from 'element-ui/types/upload'

export interface IUploadObject {
  hasSuccess: boolean
  uid: number
  url: string
  // width: number
  // height: number
}

@Component({
  name: 'EditorImageUpload'
})
export default class extends Vue {
  private dialogVisible = false
  private listObj: { [key: string]: IUploadObject } = {}
  private defaultFileList = []
  private src = 'http://192.168.54.191:7001/file/uploadFile'

  private checkAllSuccess() {
    return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
  }

  private handleSubmit() {
    const arr = Object.keys(this.listObj).map(v => this.listObj[v])
    if (!this.checkAllSuccess()) {
      this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
      return
    }
    this.$emit('successCBK', arr)
    this.listObj = {}
    this.defaultFileList = []
    this.dialogVisible = false
  }

  private handleSuccess(response: any, file: ElUploadInternalRawFile) {
    const uid = file.uid
    if (response.code === '200') {
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.url
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    } else {
      this.$message('images uploaded failed. If there is a network problem, please refresh the page and upload again!')
    }
  }

  private handleRemove(file: ElUploadInternalRawFile) {
    const uid = file.uid
    const objKeyArr = Object.keys(this.listObj)
    for (let i = 0, len = objKeyArr.length; i < len; i++) {
      if (this.listObj[objKeyArr[i]].uid === uid) {
        delete this.listObj[objKeyArr[i]]
        return
      }
    }
  }

  private beforeUpload(file: ElUploadInternalRawFile) {
    const fileName = file.uid
    const img = new Image()
    img.src = window.URL.createObjectURL(file)
    // img.onload = () => {
    //   this.listObj[fileName] = {
    //     hasSuccess: false,
    //     uid: file.uid,
    //     url: '',
    //     width: img.width,
    //     height: img.height
    //   }
    // }
    this.listObj[fileName] = {
      hasSuccess: false,
      uid: file.uid,
      url: ''
    }
  }
}
</script>

<style lang="scss">
.editor-slide-upload {
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}
</style>
