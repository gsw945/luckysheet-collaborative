<template>
  <div class="hello">
    <div
      id="luckysheet"
      style="margin:0px;padding:0px;position:absolute;width:100%;height:100%;left: 0px;top: 0px;"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    // In some cases, you need to use $nextTick
    // this.$nextTick(() => {
          $(function () {
            luckysheet.create({
              container: "luckysheet",
              lang: 'zh',
              title: 'Luckysheet Demo fishmint',
              column: 22,
              row: 30,
              allowUpdate: true,
              gridKey: '123456',
              loadUrl: '/api/list',
              loadSheetUrl: '/api/sheet',
              updateUrl: `ws://${window.location.hostname}:3000/ws/update`,
              updateImageUrl: '/api/thumbnail',
              fullscreenmode: false,
              userInfo: '<i style="font-size:16px;color:#ff6a00;" class="fa fa-taxi" aria-hidden="true"></i> fishmint',
              userMenuItem: [
                {url:"10.96.8.8:8976", "icon":'<i class="fa fa-folder" aria-hidden="true"></i>', "name":"我的表格"},
                {url:"10.96.8.8:8976", "icon":'<i class="fa fa-sign-out" aria-hidden="true"></i>', "name":"退出登陆"}
              ],
              myFolderUrl: "10.96.8.8:8976"
            });
          });
      
    // });
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
