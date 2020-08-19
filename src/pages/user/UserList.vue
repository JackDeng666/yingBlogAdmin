<template>
  <div>
    <!-- 搜索框 -->
    <!-- <div class="search-box">
      <el-input
        placeholder="可以通过用户名搜索用户..."
        prefix-icon="el-icon-search"
        style="width: 400px"
        v-model="searchKeyWord"
        size="small">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="small" style="margin-left: 3px">搜索</el-button>
    </div> -->
    <!-- 用户列表 -->
    <div class="user-list-box">
      <!-- 用户卡片 -->
      <el-card v-for="(user,index) in userList" :key="index">
        <!-- 头部信息 -->
        <div slot="header">
          <span>{{user.nickName}}</span>
          <el-button class="delete-btn" type="text" icon="el-icon-delete" @click="handleDelete(user.id)">
            删除
          </el-button>
        </div>
        <!-- 主题信息 -->
        <div class="user-main">
          <!-- 头像 -->
          <div><img :src="user.avatar" style="width: 70px;height: 70px;border-radius: 50%;object-fit: cover;"></div>
          <!-- 基本信息 -->
          <div class="text">
            <span>性别：</span><span>{{sex(user.sex)}}</span>
          </div>
          <div class="text">
            <span>用户名：</span><span>{{user.userName}}</span>
          </div>
          <div class="text">
            <span>电子邮箱：</span><span>{{user.email}}</span>
          </div>
        </div>
      </el-card>
    </div>
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
  </div>
</template>
<script>
import {User} from '../../utils/api'
export default{
  data(){
    return {
      pageSize: 6,
      total: 0,
      userList: [],
    }
  },
  methods: {
    sex(num){
      switch(num){
        case 1:
          return '男'
        case 2:
          return '女'
        case 3:
          return '不详'
      }
    },
    async loadUserList(currentPage){
      let result = await User.getUserList({
        currentPage,
        pageSize: this.pageSize
      })
      this.userList = result.data.data.userList
      this.total = result.data.data.total
    },
    currentPageChange(val){
      this.loadUserList(val)
    },
    handleDelete(userId){
      this.$confirm('确认删除此用户？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await User.deleteUser({userId})
        if(result.data.meta.status === 1){
          this.$message.success('删除成功!')
          this.$router.go(0)
        }else{
          this.$message.error(result.data.meta.msg)
        }
      }).catch(() => {
        this.$message.info('取消删除')
      })
    }
  },
  created(){
    this.loadUserList(1)
  }
}
</script>
<style scoped>
.search-box {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
.el-card {
  width:330px;
  margin-top: 10px;
}
.user-list-box {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.delete-btn {
  float: right; 
  padding: 3px 0;
  color: #ff0509;
}
.user-main {
  text-align: center;
}
.user-main .text {
  text-align: left;
  color:#20a0ff;
  font-size: 12px;
  margin-top: 13px;
}
</style>
