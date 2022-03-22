//写 Vuex 的相关内容

const state = () => ({position: {}})

const mutations = {
  setPosition(state, val) {
    state.position = val
  }
}

const actions = {
  setPosition: ({
    commit
  }, position) => {
    commit('setPosition', position)
  }
}

export default {namespaced: true, state, mutations, actions}