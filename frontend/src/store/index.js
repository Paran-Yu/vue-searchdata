import Vue from 'vue'
import Vuex from 'vuex'
import { dataLap } from "../utils/axios";

Vue.use(Vuex)

function makeColor(){
  return "#" + Math.round(Math.random() * 0xffffff).toString(16);
}

export default new Vuex.Store({
  state: {
    chartData: ""
  },
  mutations: {
    CHANGE_CHART_DATA(state, data){
      state.chartData = data;
    }
  },
  // actions: 비동기 처리를 할 때 actions에서 처리하고 commit을 통해 mutations에 보내서 state를 변경
  actions: {
    async generateChartData({ commit }) {
      const result = await dataLap.get();
      console.log(result);
      const chartData = {
        // x축은 날짜
        labels: result.data[0].data.map(li => li.period),
        datasets: result.data.reduce((acc, cur) => {
          let label = cur.title;
          let data = cur.data.map(li => li.ratio);
          let borderColor = makeColor();
          let backgourndColor = makeColor();
          acc.push({label, data, borderColor, backgourndColor, fill:false});
          return acc;
        },[])
      }

      commit("CHANGE_CHART_DATA", chartData);
    }
  },
  modules: {
  }
})
