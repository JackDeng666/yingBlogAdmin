<template>
  <div>
    <el-card>
      <el-button type="primary" @click="addType">新增分类</el-button>
      <!-- 分类列表数据 -->
      <el-table :data="blogTypeList" border>
        <el-table-column label="分类名" prop="type_name"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editType(scope.row.id, scope.row.type_name)"/>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"/>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改分类的对话框 -->
    <el-dialog :title="dialogStatus==1?'添加分类':'修改分类'" :visible.sync="isOpen" width="50%">
      <el-form :model="typeForm" label-width="100px" ref="typeFormRef">
        <el-form-item label="分类名" prop="typeName">
          <el-input v-model="typeForm.typeName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogStatus = 0">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {Blog} from '../../utils/api'
export default {
  data() {
    return {
      blogTypeList: [],
      dialogStatus: 0,
      typeForm: {
        id: null,
        typeName: ""
      }
    }
  },
  computed: {
    isOpen(){
      if(this.dialogStatus == 0){
        return false
      }
      return true
    }
  },
  methods: {
    async loadBlogTypeList(){
      let result = await Blog.getBlogTypes()
      this.blogTypeList = result.data.data
    },
    handleDelete(typeId){
      this.$confirm('确认删除此分类？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await Blog.deleteBlogTypes({typeId})
        if(result.data.meta.status === 1){
          this.$message.success('删除成功!')
          this.loadBlogTypeList()
        } else {
          this.$message.error(result.data.meta.msg)
        }
      }).catch( () => {
        this.$message.info('取消删除')
      })
    },
    addType(){
      this.typeForm.id = null
      this.typeForm.typeName = ""
      this.dialogStatus = 1
    },
    editType(id, typeName){
      this.typeForm.id = id
      this.typeForm.typeName = typeName
      this.dialogStatus = 2
    },
    async confirm(){
      let res
      if(this.dialogStatus==1){
        res = await Blog.addBlogTypes(this.typeForm)
      } else {
        res = await Blog.updateBlogTypes(this.typeForm)
      }
      if(res.data.meta.status){
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
      this.dialogStatus = 0
      this.loadBlogTypeList()
    }
  },
  created(){
    this.loadBlogTypeList()
  }
}
</script>

<style>
.el-table th>.cell{
  font-weight: bold;
  font-size: 16px;
}
</style>
