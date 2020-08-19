<template>
<div>
  <el-table 
    v-if="blogList.length > 0"  
    :data="blogList" 
    style="width: 100%"
    :header-cell-style="{fontWeight:'bold',fontSize:'14px'}"
    :default-sort="{prop: 'date', order: 'descending'}">
    <el-table-column prop="title" align="left" label="博客标题" >
      <template slot-scope="scope">
        <span style="color: #409eff">{{ scope.row.title}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="type_name" align="center" label="博客类型" ></el-table-column>
    <el-table-column prop="created_time" align="center" label="创建时间" width="250"></el-table-column>
    <el-table-column prop="browsed_count" align="center" label="浏览次数" width="80"></el-table-column>
    <el-table-column prop="operation" label="操作" align="center" fixed="right" width="150">
      <template slot-scope="scope">
        <el-button type="warning" size="small" @click="handleEdit(scope.row)" icon="el-icon-edit"></el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
      :current-page="1"
      @current-change="currentPageChange"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, jumper"
      background>
    </el-pagination>
  </div>
</div>
</template>

<script>
import {Blog} from '@/utils/api'
import {mapMutations} from 'vuex'
export default {
  props: ['type'],
  data() {
    return {
      pageSize: 10,
      total: 0,
      blogTypeId: 0,
      blogList: []
    }
  },
  methods:{
    ...mapMutations(['changeEditBlogStatus','changeEditBlogDetail']),
    async reloadBlogList(currentPage,pageSize){
      let result
      switch(this.type){
        case 'release':
          if(this.blogTypeId == 0){
            result = await Blog.getBlogList(1,currentPage,pageSize)
          }else{
            result = await Blog.getBlogListByType(this.blogTypeId,1,currentPage,pageSize)
          }
          break;
        case 'draft':
          if(this.blogTypeId == 0){
            result = await Blog.getBlogList(0,currentPage,pageSize)
          }else{
            result = await Blog.getBlogListByType(this.blogTypeId,0,currentPage,pageSize)
          }
          break;
      }
      this.total = result.data.data.total
      this.blogList = result.data.data.blogList
      // 格式化时间
      this.blogList.map( item => {
        item.created_time = this.$moment(item.created_time).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    currentPageChange(val){
      this.reloadBlogList(val,this.pageSize)
    },
    async handleEdit(row){
      let result = await Blog.getBlogDetail(row.id)
      this.changeEditBlogStatus(1)
      this.changeEditBlogDetail(result.data.data.blogDetail)
      this.$router.push('/editblog')
    },
    handleDelete(row){
      this.$confirm('此操作将删除此博客，确认继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        let result = await Blog.deleteBlog(row.id)
        if(result.data.meta.status === 1){
          this.$message.success('删除成功!')
          this.reloadBlogList(1,this.pageSize)
        }else{
          this.$message.error(result.data.meta.msg)
        }
      }).catch(() => {
        this.$message.info('取消删除')
      })
    }
  },
  created(){
    this.reloadBlogList(1,this.pageSize)
  }
}
</script>
