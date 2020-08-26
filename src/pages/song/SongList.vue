<template>
  <div>
    <!-- 切换tab -->
    <el-tabs type="border-card" value="netease" @tab-click="switchTab">
      <el-tab-pane label="网易云" name="netease">
        <el-button type="primary" @click="addSongList">新增网易云歌单</el-button>
        <!-- 歌单列表数据 -->
        <el-table :data="songList" border>
          <el-table-column label="歌单名" prop="song_list_name"></el-table-column>
          <el-table-column label="歌单id" prop="song_list_id"></el-table-column>
          <el-table-column label="操作" align="center" width='180'>
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" 
              @click="editSongList(scope.row.id, scope.row.song_list_name,scope.row.song_list_id,scope.row.song_list_type)"/>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="本地" name="local">
        <el-button type="primary" @click="addSongList">新增本地歌单</el-button>
        <!-- 歌单列表数据 -->
        <el-table :data="songList" border>
          <el-table-column label="歌单名" prop="song_list_name"></el-table-column>
          <el-table-column label="歌单id" prop="song_list_id"></el-table-column>
          <el-table-column label="操作" align="center" width='180'>
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" 
              @click="editSongList(scope.row.id, scope.row.song_list_name,scope.row.song_list_id,scope.row.song_list_type)"/>
              <el-button 
                size="mini" 
                type="danger" 
                icon="el-icon-delete" 
                @click="handleDelete(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    
    <!-- 添加或修改歌单的对话框 -->
    <el-dialog :title="dialogStatus==1?'添加歌单':'修改歌单'" :visible.sync="isOpen" width="50%">
      <el-form :model="songListForm" label-width="100px" ref="songListFormRef">
        <el-form-item label="歌单名" prop="songListName">
          <el-input v-model="songListForm.songListName"></el-input>
        </el-form-item>
        <el-form-item v-if="tabStatus == 0" label="歌单id" prop="songListId">
          <el-input v-model="songListForm.songListId"></el-input>
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
import {Song} from '../../utils/api'
export default {
  data() {
    return {
      tabStatus: 0,
      dialogStatus: 0,
      songList: [],
      songListForm: {
        id: null,
        songListId: "",
        songListName: "",
        isLocal: false
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
    switchTab(event) {
      this.tabStatus = event.index
      this.songListForm.isLocal = event.index
      this.loadSongList()
    },
    async loadSongList(){
      let result
      if(this.tabStatus == 0){
        result = await Song.getSongList({songListType:1})
      } else if(this.tabStatus == 1) {
        result = await Song.getSongList({songListType:2})
      }
      this.songList = result.data.data.songList
    },
    handleDelete(row){
      this.$confirm('确认删除此歌单？','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await Song.deleteSongList({
          id: row.id,
          songListType: row.song_list_type,
          songListId: row.song_list_id
        })
        if(result.data.meta.status === 1){
          this.$message.success('删除成功!')
          this.loadSongList()
        } else {
          this.$message.error(result.data.meta.msg)
        }
      }).catch( () => {
        this.$message.info('取消删除')
      })
    },
    addSongList(){
      this.songListForm.id = null
      this.songListForm.songListId = ""
      this.songListForm.songListName = ""
      this.songListForm.songListType = ""
      this.dialogStatus = 1
    },
    editSongList(id,name,ids,type){
      this.songListForm.id = id
      this.songListForm.songListName = name
      this.songListForm.songListId = ids
      this.songListForm.songListType = type
      this.dialogStatus = 2
    },
    async confirm(){
      let res
      if(this.dialogStatus==1){
        res = await Song.addSongList(this.songListForm)
      } else {
        res = await Song.updateSongList(this.songListForm)
      }
      if(res.data.meta.status){
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.error(res.data.meta.msg)
      }
      this.dialogStatus = 0
      this.loadSongList()
    }
  },
  created(){
    this.loadSongList()
  }
}
</script>
