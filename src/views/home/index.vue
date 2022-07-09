<template>
  <div class="app-container">
    <span class="fa-icon">
    </span>
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="total-frame">
            <div class="total-title">今日订单总数</div>
            <div class="total-value">200</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <div class="total-title">今日销售总额</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total-frame">
            <div class="total-title">昨日销售总额</div>
            <div class="total-value">￥5000.00</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
    <div class="content-left" >
      <ve-line
        :data="chartData"
        :legend-visible="false"
        :data-empty="dataEmpty"
        :extend="chartExtend"
        :settings="chartSettings">
      </ve-line>
    </div>
    <div class="content-right" >
      <ve-bar
        height="300px"
        :legend-visible="false"
        :axisTick-show="false"
        :data="chartData2"
        :settings="chartSettings2"
        :extend="chartExtend2"
        :colors="['#5ab1ef', '#4ece17']"
      ></ve-bar>
    </div>

        <!-- :colors="['#317dfb', '#4ece17']" -->
  </div>
  </div>
</template>
<script>
  const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount','orderAmount'],
    rows: [
      {date: '2018-11-01', orderCount: 10, orderAmount: 1093},
      {date: '2018-11-02', orderCount: 20, orderAmount: 2230},
      {date: '2018-11-03', orderCount: 33, orderAmount: 3623},
      {date: '2018-11-04', orderCount: 50, orderAmount: 6423},
      {date: '2018-11-05', orderCount: 80, orderAmount: 8492},
      {date: '2018-11-06', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-07', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-08', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-09', orderCount: 50, orderAmount: 5293},
      {date: '2018-11-10', orderCount: 30, orderAmount: 3293},
      {date: '2018-11-11', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-12', orderCount: 80, orderAmount: 8293},
      {date: '2018-11-13', orderCount: 100, orderAmount: 10293},
      {date: '2018-11-14', orderCount: 10, orderAmount: 1293},
      {date: '2018-11-15', orderCount: 40, orderAmount: 4293}
    ]
  };
  const DATA_FROM_BACKEND_S = {
    columns: ['date', 'orderCount','orderAmount'],
    rows: [
      {date: '未开发', orderCount: 10,},
      {date: '开发中', orderCount: 20, },
      {date: '开发成功', orderCount: 33, },
      {date: '开发失败', orderCount: 50,},
      // {date: '2018-11-05', orderCount: 80, },
    ]
  };
  export default {
    name: 'home',
    data() {
      return {
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:true,
          title: {
            text: '客户增长情况', 
            textAlign: 'left', 
            textStyle: { 
                fontSize: 20
            },
            // top:30,
            // left:30,
            },
          axisSite: { right: ['orderAmount']},
          labelMap: {'orderCount': '增加数量', 'orderAmount': '流失'}
        },
        chartSettings2: {

          xAxisType: 'value',
          labelMap: {'orderCount': '客户开发情况'}
        },
        chartExtend: {
          xAxis: {
            axisTick: { // 刻度
              show: false // 不显示刻度线
            },
          },
          title: {
            text: '客户开发情况',   //主标题
            textAlign: 'left',    //居左
            textStyle: {         //样式
                fontSize: 20
            },
            },
          axisSite: { right: ['orderAmount']},
          labelMap: {'orderCount': '增加数量', 'orderAmount': '流失'}
        },
        chartExtend2: {
          xAxis: {
            type: 'value',
            colors: ['#317dfb', '#4ece17'],

            splitLine: { // 去除背景网格线
              show: false
            },
            axisTick: { // 刻度
              show: false // 不显示刻度线
            },
            legend: {
              show: true
            },
            boundaryGap: [0, 0.1],
            axisLabel: {
              show: false
            }
          },
          yAxis: {
            show: true,
            splitLine:{show: false},   //去除网格线
          },
          title: {
            text: '客户开发情况',   //主标题
            textAlign: 'left',    //居左
            textStyle: {         //样式
                fontSize: 15
            },
            top:30,
            left:30,
            },
          axisSite: { right: ['orderAmount']},
          labelMap: {'orderCount': '增加数量', 'orderAmount': '流失'}
        },


        chartData: {
          columns: ['date', 'orderCount','orderAmount'],
          rows: DATA_FROM_BACKEND.rows
        },
        chartData2: {
          columns: ['date', 'orderCount'],
          rows: DATA_FROM_BACKEND_S.rows
        },
        loading: false,
        dataEmpty: false,
      }
    },
    created(){
      // this.initOrderCountDate();
      // this.getData();
    },
    methods:{
      handleDateChange(){
        this.getData();
      },
      initOrderCountDate(){
        let start = new Date();
        start.setFullYear(2018);
        start.setMonth(10);
        start.setDate(1);
        const end = new Date();
        end.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 7);
        this.orderCountDate=[start,end];
      },
      getData(){
        //axiox
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }
  .content-left,.content-right{
    padding-top: 40px;
  }
  .content-left{
    width:70%;
    display: inline-block;
  }
  .content-right{
    width:30%;
    display: inline-block;
    vertical-align: top;
  }
</style>