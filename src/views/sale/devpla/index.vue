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
              v-model="chanceQuery.name" 
              class="input-width" 
              placeholder="客户名称" 
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="chanceQuery.devResult" 
              class="input-width" 
              placeholder="选择开发状态" 
              clearable>
            <el-option
              v-for="item in optionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button type="primary" 
        size="mini" 
        class="btn-add"  
        @click="handleDevelopment()" 
        style="margin-left: 10px">
        <i class="fa fa-paper-plane" aria-hidden="true"></i>
        开发详情
      </el-button>
    </el-card>

    <el-scrollbar class="table-container">
      <el-table ref="devplaTable"
                :data="list"
                style="width: 1500px;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="机会来源" width="100" align="center">
          <template slot-scope="scope">{{scope.row.chanceSource}}</template>
        </el-table-column>
        <el-table-column label="客户名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column label="成功几率" width="80" align="center">
          <template slot-scope="scope">{{scope.row.cgjl}}</template>
        </el-table-column>
        <el-table-column label="概要" width="140" align="center">
          <template slot-scope="scope">{{scope.row.overview}}</template>
        </el-table-column>
        <el-table-column label="联系人" width="80" align="center">
          <template slot-scope="scope">{{scope.row.linkMan}}</template>
        </el-table-column>
        <el-table-column label="联系号码" width="140" align="center">
          <template slot-scope="scope">{{scope.row.linkPhone}}</template>
        </el-table-column>

        <el-table-column label="开发状态" width="140" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.devResult == 2" type="success">开发成功</el-tag>
            <el-tag v-else-if="scope.row.devResult == 0" type="info">未开发</el-tag>
            <el-tag v-else-if="scope.row.devResult == 1" type="warning">开发中</el-tag>
            <el-tag v-else-if="scope.row.devResult == 3" type="danger">开发失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" width="140" align="center">
          <template slot-scope="scope">{{scope.row.createMan}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.updateDate  | formatDate}}</template>
        </el-table-column>
        <el-table-column label="描述" width="140" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>

      </el-table>
    </el-scrollbar>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="chanceQuery.pageCount"
        :page-size="chanceQuery.pageSize"
        :page-sizes="[10,20,30]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteFlash} from '@/api/devpla';
  import {formatDate} from '@/utils/date';

  const defaultchanceQuery = {
    pageCount: 1,
    pageSize: 10,
    customerId: null,
    name: null,
    state:null
  };
  const defaultFlashPromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
  };
  export default {
    name: 'devplaPromotionList',
    data() {
      return {
        optionsList:[{label:"未开发", value:0},{label:"开发中",value:1},{label:"开发成功",value:2},{label:"开发失败",value:3}],
        chanceQuery: Object.assign({}, defaultchanceQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        devplaPromotion: Object.assign({}, defaultFlashPromotion),
        isEdit: false,
        multipleSelection: [],

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
      handleDevelopment() {
        if(!this.onlySelectOne()) return;
        this.$router.push({path: '/sale/pim', query:{id:this.multipleSelection[0].id}})
      },
      onlySelectOne(){
        if(this.multipleSelection.length > 1){
          this.$message.error('只能选择一个角色哦');
          return false;
        }
        if(this.multipleSelection.length === 0){
          this.$message.error('你还没有选择任何角色');
          return false;
        }
        return true;
      },
      handleSelectionChange(val) {  //wait
        this.multipleSelection = val;
        console.log(this.multipleSelection);
      },
      handleShowSessionList() {
        this.$router.push({path: '/sms/devplaSession'})
      },
      handleStatusChange(index, row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, {status: row.status}).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该客户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFlash(row.id).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.devplaPromotion = Object.assign({},row);
      },

      getList() {
        this.listLoading = true;   //waitting  code  true
        fetchList(this.chanceQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      }
    }
  }
</script>
<style>

</style>


