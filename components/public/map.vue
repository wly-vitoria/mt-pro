<template>
  <div
    :id="id"
    :style="{width:width+'px',height:height+'px',margin:'34px auto'}"
    class="m-map"/>
</template>

<script>
export default {
  props: {
    width: {
      type:Number,
      default:300
    },
    height: {
      type:Number,
      default:300
    },
    point: {
      type:Array,
      default(){
        return [116.46,39.92]
      }
    }
  },
  data() {
    return {
      id: `map`,
      key: '0dbc0dfd7c775f2a927174493eab8220'
    }
  },
  watch: {
    point: function (val, old) {
      this.map.setCenter(val)
      this.marker.setPosition(val)
    }
  },
  // 这里是异步加载 获取数据
  mounted() {
    let self = this
    self.id = `map${Math.random().toString().slice(4, 6)}`

    //因为我们要访问 window 对象，所以要在 mounted 里写，要不然获取不到
    // SSR是获取不到 mounted 的
    //把这个事件放在mounted 是最合适的，因为mounted 是挂在浏览器端的，服务器端 Serve不会去执行这个事件
    //所以放在mounted 不会影响 serve端SSR的构建和编译，如果把放在其他地方有可能会影响
    window.onmaploaded = () => {
      let map = new window.AMap.Map(self.id, {
        resizeEnable: true,
        zoom: 11,
        center: self.point
      })
      self.map = map
      //插件 ToolBar 用来放大缩小的
      window.AMap.plugin('AMap.ToolBar', () => {
        let toolbar = new window.AMap.ToolBar()
        map.addControl(toolbar)
        //插件 Marker 显示悬浮地标
        let marker = new window.AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: self.point
        })
        self.marker = marker
        marker.setMap(map)
      })
    }
    const url = `https://webapi.amap.com/maps?v=1.4.10&key=${self.key}&callback=onmaploaded`
    let jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
  },
}
</script>
