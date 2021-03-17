<template>
  <div style="display:flex">
      <Form></Form>

      <bar-chart style="width: 45vw;" v-if="chartData" :chart-data="chartData">
      </bar-chart>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"
import BarChart from '../components/ReactiveBarChart'
import Form from '../components/Form.vue'

export default {
  components:{
    BarChart,
    Form
  },
  data(){
    return {
    // 테스트용 데이터
    //   chartData: null
    }
  },
  computed: {
    ...mapState(['chartData'])
  },
  methods:{
    ...mapActions(["generateChartData"]),
    //this.$store.dispatch

    // 테스트용 메소드
    generateData(){
      let newArray = [];
      let newArray2 = [];

      for(let i=0; i<10; i++){
        let randomValue = Math.floor(Math.random() * 10);
        newArray.push(randomValue);
      }
      for(let i=0; i<10; i++){
        let randomValue = Math.floor(Math.random() * 10);
        newArray2.push(randomValue);
      }

      // 테스트용 데이터
      this.chartData = {
          labels: ["Red", "Blue", "Yellow", "Green", "Puple", "Gray", "Orange"],
          datasets: [
              {
                  label: "Data One",
                  backgroundColor: "#f87979",
                  data: newArray,
                  fill: false,
              },
              {
                  label: "Data Two",
                  backgroundColor: "#f07294",
                  data: newArray2,
                  fill: false,
              },
          ]
      }
    }
  },
  async mounted() {
    //   this.generateData();
    //   setInterval(this.generateData, 2000);
    this.generateChartData();
  }
}
</script>

<style>
Form{
  border: 3px solid rgb(233, 233, 233);
  border-radius: 5px;
  padding: 15px;
  margin-right: 20px;
}
</style>