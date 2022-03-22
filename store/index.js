import axios from '../server/interface/utils/axios'
export  const actions={
    async nuxtServerInit({
      commit
    }, {req, app}) {
      const {
        status,
        data: {
          province,
          city
        }
      } = await app.$axios.get('/geo/getPosition')
      commit('geo/setPosition',status===200?{city,province}:{city:'三亚',province:'海南'})  //传参数，这个检查是在客户端做得
      const{status:status2,data:{menu}} = await app.$axios.get('geo/menu')
      commit('home/setMenu',status2 ===200?menu:[])
      // const{status:status3,data:{result}} = await app.$axios.get('/search/hotPlace',{
      //   params:{
      //     city:app.store.state.geo.position.city.replace('市','')
      //   }
      // }
      const{status:status3,data:{result}} = await app.$axios.get('/search/hotPlace'
      )
      commit('home/setHotPlace',status3==200?result:[])
    }
  }

