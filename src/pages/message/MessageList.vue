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
      <el-table :data="messageList" border>
        <el-table-column label="留言内容" prop="content" show-overflow-tooltip min-width='300'></el-table-column>
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
import {Message} from '../../utils/api'
export default {
  data() {
    return {
      pageSize: 10,
      total: 0,
      messageList: []
    }
  },
  methods: {
    async loadMessageList(currentPage){
      let result = await Message.getMessageList({
        currentPage,
        pageSize: this.pageSize
      })
      this.messageList = result.data.data.messageList
      this.total = result.data.data.total
      this.messageList.map( item => {
        item.createdTime = this.$moment(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
      })
    },
    currentPageChange(val){
      this.loadMessageList(val)
    },
    handleDelete(messageId){
      this.$confirm('确认删除此留言？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await Message.deleteMessage({messageId})
        if(result.data.meta.status === 1){
          this.$message.success('删除成功!')
          this.loadMessageList(1)
        } else {
          this.$message.error(result.data.meta.msg)
        }
      }).catch( () => {
        this.$message.info('取消删除')
      })
    }
  },
  created(){
    this.loadMessageList(1)
  }
}
</script>
