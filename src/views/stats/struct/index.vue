<template>
  <div class="app-container">
    <div id="TB1"></div>
    <div id="TB2"></div>
    <!-- <echarts class="charts"-->
    <!--  :options="option"></echarts>-->
    <ve-pie :data="chartData">

    </ve-pie>
    <ve-histogram :data="chartData">
    </ve-histogram>
  </div>
</template>
<script>
import {countCustomerMakeList} from "@/api/stats";

export default {
  data() {
    return {
      reuseList: [0,0,0,0],
      chartData: {
        columns: ['date', '客户构成'],
        rows: [
        ]
      },
    }
  },
  create(){
  },
  mounted() {
    this.getList();

      console.log("mounted里this.$store.state.list"+this.$store.state.list)
    setTimeout(() => {
      this.chartData.rows = [{date: '大客户', 客户构成: this.$store.state.list[0] },
        {date: '战略合作伙伴', 客户构成: this.$store.state.list[1] },
        {date: '普通客户', 客户构成: this.$store.state.list[2] },
        {date: '重点开发客户', 客户构成: this.$store.state.list[3]},]
    }, 500);
    },
  methods: {
    getList() {
      // console.log("aaa"+);
      this.listLoading = false;   //waitting  code  true
      countCustomerMakeList(this.chanceQuery).then(response => {
        this.$store.state.list = response.data.data2;
        // console.log("list里的数据"+this.$store.state.list);
        // console.log("list[0]里的数据"+this.$store.state.list[0]);
      }).catch(err => console.log(err));

    }
  }

}
</script>
<style>
<yle>