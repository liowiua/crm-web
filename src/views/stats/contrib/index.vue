<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        <i class="el-icon-search"></i>
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="chanceQuery" size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="chanceQuery.customerName"
              class="input-width" 
              placeholder="客户名称" 
              clearable>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>客户贡献分析</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="客户名称" width="200" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="总金额" width="200" align="center">
          <template slot-scope="scope">{{scope.row.total}}</template>
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
  import {selectCustomerContributionByParams} from "@/api/stats";

  const defaultchanceQuery = {
    pageCount: 1,
    pageSize: 10,
    customerName:null,
    time: null,
    type:null
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
      handleResetSearch() {
        this.chanceQuery = Object.assign({}, defaultchanceQuery);
      },
      handleSearchList() {
        this.chanceQuery.pageCount = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.chanceQuery.pageCount = 1;
        this.chanceQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.chanceQuery.pageCount = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.flashPromotion = Object.assign({},defaultFlashPromotion);
      },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{flashPromotionId:row.id}})
      },
      getList() {
        console.log("getList  "+this.chanceQuery.pageSize);
        this.listLoading = false;   //waitting  code  true
        selectCustomerContributionByParams(this.chanceQuery).then(response => {
          console.log(response);
          this.listLoading = false;
          this.list = response.data.list;
        }).catch(err => console.log(err));
      }
    }
  }
</script>
<style>

</style>


