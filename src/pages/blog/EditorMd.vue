<template>
  <div>
    <div id="editor">
    </div>
  </div>
</template>

<script>
import {UP_URL} from '@/utils/config'
import $ from 'jquery'

export default {
  props: {
    content: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      // 生成的编辑器对象
      editor: null,
      // 配置
      config: {
        width: "100%",
        height: 600,
        path: "editor.md/lib/",
        theme: "default", // 工具栏颜色
        previewTheme: "default", // 预览颜色
        editorTheme: "default", // 编辑颜色
        markdown: this.content, // 默认填充内容
        lineWrapping: true, // 编辑框不换行
        codeFold: true, // 代码折叠
        placeholder: "请输入...",
        syncScrolling: true,
        saveHTMLToTextarea: true, // 保存 HTML 到 Textarea
        searchReplace: true,
        watch: true, // 实时预览
        htmlDecode: "style,script,iframe", // 开启 HTML 标签解析，为了安全性，默认不开启，过滤style,script,iframe
        toolbar: true, //工具栏
        previewCodeHighlight: true, // 预览 HTML 的代码块高亮，默认开启
        emoji: false,
        taskList: true,
        tocm: true, // Using [TOCM]
        tex: true, // 开启科学公式TeX语言支持，默认关闭
        flowChart: true, // 开启流程图支持，默认关闭
        sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
        imageUpload: true,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: UP_URL + "resource/uploadBlogImg",
        crossDomainUpload : true,
        // uploadCallbackURL : "http://xxxxxx/upload_callback.html?test=dfdf"
        // onchange: () => {
        //   console.log(this.getValue())
        // }
      }
    }
  },
  methods: {
    getValue() {
	    // 获取内容的基本方法
      let mdContent = this.editor.getMarkdown()
      let htmlContent = this.editor.getHTML()
      return {
        mdContent,
        htmlContent
      }
    },
    requireEditor(callback) {
      // 异步加载editormd，再执行初始化的回调
      $.getScript("editor.md/editormd.min.js", function(script) {
        callback()
      })
    },
  },
  mounted() {
    // 把jquery设置成全局变量，因为editormd依赖于它
    window.$ = window.jQuery = $
     //加载editormd
    this.requireEditor(() => {
	    // 第一个参数对应容器div的id
      this.editor = editormd("editor", this.config)
    })
  }
}
</script>

<style>
#editormarkdown-view{
  padding: 0;
}
#editormarkdown-view ol{
  list-style: decimal;
}
#editormarkdown-view ul{
  list-style: disc;
}
.editormd-html-preview .editormd-toc-menu>.markdown-toc>ul, .editormd-preview-container .editormd-toc-menu>.markdown-toc>ul {
  left: -1px;
  top: -1px;
  z-index: 100;
  background: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 3px 5px rgba(0,0,0,.2);
}
</style>
