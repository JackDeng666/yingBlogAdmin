<template>
  <el-tabs type="border-card" value="release">
    <el-tab-pane label="已发布" name="release">
      <blog-table type="release"></blog-table>
    </el-tab-pane>
    <el-tab-pane label="草稿箱" name="draft">
      <blog-table type="draft"></blog-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import BlogTable from './BlogTable'
export default {
  components: {
    BlogTable
  }
}
</script>
