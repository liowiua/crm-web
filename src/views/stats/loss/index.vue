index.vue<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="客户编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="客户名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column label="客户经理" width="140" align="center">
          <template slot-scope="scope">{{scope.row.managerName}}</template>
        </el-table-column>
        <el-table-column label="最后下单时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.lastOrderTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="流失原因" width="140" align="center">
          <template slot-scope="scope">{{scope.row.lossReason}}</template>
        </el-table-column>
        <el-table-column label="确认流失时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.confirmLossTime | formatDate}}</template>
        </el-table-column>
        
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="chanceQuery.pageCount"
        :page-size="chanceQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import {customerLossList} from "@/api/stats";

  const defaultchanceQuery = {
    pageCount: 1,
    pageSize: 10,
    customerId: null,
    name: null
  };
  const defaultFlashPromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'flashPromotionList',
    data() {
      return {
        chanceQuery: Object.assign({}, defaultchanceQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        flashPromotion: Object.assign({}, defaultFlashPromotion),
        isEdit: false,

        optionsList: 
        [{ value: '选项1', label: '0-1000'}, 
        { value: '选项2', label: '1000-3000'}, 
        { value: '选项3', label: '3000-5000'}, 
        { value: '选项4', label: '5000以上'}, 
        ]
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= row.startDate && nowTime <= row.endDate) {
          return '客户进行中';
        } else if (nowTime > row.endDate) {
          return '客户已结束';
        } else {
          return '客户未开始';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{customerId:row.id}})
      },
      getList() {
        console.log("aaa");
        this.listLoading = false;   //waitting  code  true
        customerLossList(this.chanceQuery).then(response => {
          console.log("aaa");
          this.listLoading = false;
          this.list = response.data.list;
        }).catch(err => console.log(err));
      }
    }
  }
</script>
<style>

</style>


