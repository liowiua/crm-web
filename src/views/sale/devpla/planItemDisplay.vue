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
            <el-input v-model="chanceQuery.customerId" 
              class="input-width" 
              placeholder="创建人" clearable>
              </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="chanceQuery.customerId" 
              class="input-width" 
              placeholder="选择开发状态" clearable>
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
        @click="handleAuthenticate()" 
        style="margin-left: 10px">
        <i class="fa fa-paper-plane" aria-hidden="true"></i>
        开发
      </el-button>
      <el-button 
        size="mini" 
        class="btn-add" 
        @click="handleDetail()" 
        style="margin-left: 20px">
        详情
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
        <el-table-column label="描述" width="140" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
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
        <el-table-column label="开发状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row.state}}</template>
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
    <el-dialog
      title="计划数据维护"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form 
              :model="devplaPromotion"
               ref="devplaPromotionForm"
              
               label-width="150px" size="small">
          <el-form-item label="客户名称：">
          <el-input v-model="devplaPromotion.title" style="width: 200px "></el-input>
        </el-form-item>
        <el-form-item label="机会来源：">
          <el-input v-model="devplaPromotion.title" style="width: 200px"></el-input>
        </el-form-item>
       <el-form-item label="联系人：">
          <el-input v-model="devplaPromotion.title" style="width: 200px "></el-input>
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="devplaPromotion.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="概要：">
          <el-input v-model="devplaPromotion.title" style="width: 200px "></el-input>
        </el-form-item>
        <el-form-item label="成功几率(%)：">
          <el-input v-model="devplaPromotion.title" style="width: 200px"></el-input>
        </el-form-item>
         
        <el-form-item >
           <el-table ref="devplaTable"
                :data="list"
                style="width: 100%; "
                v-loading="listLoading" border>
          <el-table-column type="selection" width="10px" align="center"></el-table-column>
          <el-table-column label="编号"  align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="计划项" align="center">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>
          <el-table-column label="计划时间"  align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="执行效果" align="center">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>
          <el-table-column label="创建时间"  align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">{{scope.row.title}}</template>
          </el-table-column>
      </el-table>
    </el-form-item>
      </el-form>
      <div 
      class="pagination-container">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/devpla';
  import {formatDate} from '@/utils/date';

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
    name: 'planItemDisplay',
    data() {
      return {
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
      handleDetail() {
        if(this.multipleSelection.length > 1){
          this.$message.error('只能选择一个角色哦');
          return
        }
        if(this.multipleSelection.length === 0){
          this.$message.error('你还没有选择任何角色');
          return
        }
        this.dialogVisible = true;
        this.isEdit = false;
        // this.devplaPromotion = Object.assign({},defaultFlashPromotion);
      },
      handleSelectionChange(val) {  //wait
        this.multipleSelection = val;
        console.log(this.multipleSelection);
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
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateFlash(this.devplaPromotion.id,this.devplaPromotion).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createFlash(this.devplaPromotion).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{devplaPromotionId:row.id}})
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


