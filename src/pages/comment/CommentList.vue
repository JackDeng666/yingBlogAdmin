<template>
  <div>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <!-- <el-col :span="8">
          <el-input placeholder="根据内容查询">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col> -->
      </el-row>
      
      <!-- 留言列表数据 -->
      <el-table :data="commentList" border>
        <el-table-column label="评论内容" prop="content" show-overflow-tooltip min-width='300'></el-table-column>
        <el-table-column label="留言用户" prop="userNickName" width='160'></el-table-column>
        <el-table-column label="留言时间" prop="createdTime" width='180'>
          <template slot-scope="scope">
            {{scope.row.createdTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width='80'>
          <template slot-scope="scope">
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
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
    </el-card>
  </div>
</template>

<script>
import {Comment} from '../../utils/api'
export default {
  data() {
    return {
      pageSize: 10,
      total: 0,
      commentList: []
    }
  },
  methods: {
    async loadCommentList(currentPage){
      let result = await Comment.getCommentList({
        currentPage,
        pageSize: this.pageSize
      })
      this.commentList = result.data.data.commentList
      this.total = result.data.data.total
      this.commentList.map( item => {
        item.createdTime = this.$moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    currentPageChange(val){
      this.loadCommentList(val)
    },
    handleDelete(commentId){
      this.$confirm('确认删除此评论？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await Comment.deleteComment({commentId})
        if(result.data.meta.status === 1){
          this.$message.success('删除成功!')
          this.loadCommentList(1)
        } else {
          this.$message.error(result.data.meta.msg)
        }
      }).catch( () => {
        this.$message.info('取消删除')
      })
    }
  },
  created(){
    this.loadCommentList(1)
  }
}
</script>
