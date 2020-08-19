<template>
  <el-card>
    <div style="display: inline;float: right;">
      <span>当前是{{editBlogStatus?'编辑旧博客':'添加新博客'}}状态</span>&nbsp;
      <el-button @click="changeToAdd" v-if="editBlogStatus">点击为添加新博客</el-button>
    </div>
    <div style="display: inline;">
      博客标题：
      <el-input
        type="text"
        placeholder="请输入博客标题"
        v-model="title"
        clearable
        maxlength="32"
        show-word-limit
        style="width:60%;">
      </el-input>
    </div>
    
    <div class="block">
      博客分类：
      <el-select v-model="type_id" placeholder="请选择博客分类" >
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.type_name"
          :value="item.id">
        </el-option>
      </el-select>
      选择时间：
      <el-date-picker
        v-model="created_time"
        type="datetime"
        placeholder="选择日期时间"
        @change="changeDatePicker">
      </el-date-picker>
    </div>

    <EditorMd v-if="content || !editBlogStatus" :content="content" ref="md"/>

    <div class="block">
      <el-button @click="submitDraft" type="primary" plain>保存草稿</el-button>
      <el-button @click="submitRelease" type="success" plain>发布</el-button>
    </div>
  </el-card>
</template>

<script>
import axios from "axios"
import { Blog } from "@/utils/api"
import { mapState,mapMutations } from "vuex"
import { UP_URL } from '../../utils/config'
import EditorMd from './EditorMd'

export default {
  components: {
    EditorMd
  },
  data() {
    return {
      blog_id: 0,
      title:'',
      describe:'',
      types: '',
      type_id: '',
      created_time: '',
      content: null,  // 输入的markdown
      html: ''  // html
    }
  },
  computed:{
    ...mapState(['editBlogStatus','editBlogDetail'])
  },
  methods: {
    changeDatePicker(){
      this.created_time = this.$moment(this.created_time).format('YYYY-MM-DD HH:mm:ss')
    },
    changeToAdd(){
      this.changeEditBlogStatus(0)
      this.$router.go(0)
    },
    async submitAction(status, msgSuccess, msgError){
      let values = this.$refs.md.getValue()
      this.content = values.mdContent
      this.html = values.htmlContent
      //去掉空格，html标记，↵符号，回车换行，取前125位+...
      this.describe = this.html.replace(/\s*/g, "").replace(/<[^>]+>/g, "").replace(/↵/g, "").replace(/[\r\n]/g, "").slice(0,125) + '...'
      let result
      if(this.editBlogStatus){
        //编辑状态
        result = await Blog.updateBlogDetail({
          title: this.title,
          describe: this.describe,
          md_content: this.content,
          html_content: this.html,
          created_time: this.created_time,
          blog_type_id: this.type_id,
          id: this.blog_id,
          status: status
        })
      } else {
        //添加状态
        result = await Blog.addBlog([
          this.title,
          this.describe,
          this.content,
          this.html,
          this.created_time,
          this.type_id,
          status
        ])
      }
      if(result.data.meta.status){
        this.$message.success(msgSuccess)
        this.$router.push('/blogList')
      }else{
        this.$message.error(msgError)
      }
    },
    // 直接发布
    submitRelease(){
      this.submitAction(1,"发布成功","发布失败")  
    },
    // 保存草稿
    submitDraft(){
      this.submitAction(0,"保存成功","保存失败")
    },
    ...mapMutations(['changeEditBlogStatus'])
  },
  async created(){
    let result = await Blog.getBlogTypes()
    this.types = result.data.data
    if(this.editBlogStatus){
      //编辑状态
      this.blog_id = this.editBlogDetail.id
      this.title = this.editBlogDetail.title
      this.describe = this.editBlogDetail.describe
      this.type_name = this.editBlogDetail.type_name
      this.type_id = this.editBlogDetail.blog_type_id
      this.created_time = this.$moment(this.editBlogDetail.created_time).format('YYYY-MM-DD HH:mm:ss')
      this.content = this.editBlogDetail.md_content
    }
  }
}
</script>

<style scoped>
.block{
  display: block;
  margin: 15px 0;
}
.mavon{
  margin: 10px;
}
.edit-descibe{
  display: block;
  margin: 15px;
}
</style>
