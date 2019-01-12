export const strict = false

export const state = () => ({
  ranking: [],
})

export const mutations = {
  setRanking (state, payload) {
    state.ranking = payload
  }
}

export const actions = {
  setRanking ({ commit }, payload) {
    commit('setRanking', payload)
  }
}
