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
            <el-select v-model="value" placeholder="选择金额区间" >
            <el-option
              v-for="item in optionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>

          <el-form-item >
          <el-date-picker
            v-model="flashPromotion.endDate"
            type="date"
            placeholder="下单时间">
          </el-date-picker>
        </el-form-item>

        </el-form>
      </div>
    </el-card>
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="客户名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row |formatActiveStatus}}</template>
        </el-table-column>
        <el-table-column label="总金额" width="140" align="center">
          <template slot-scope="scope">{{scope.row.startDate | formatDate}}</template>
        </el-table-column>
        
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="chanceQuery.pageNum"
        :page-size="chanceQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加流失客户"
      :visible.sync="dialogVisible"
      width="40%"
      >
      <el-form :model="flashPromotion"
               ref="flashPromotionForm"
               label-width="150px" size="small"
               >
        <el-form-item label="客户编号：">
          <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="客户名称：">
          <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="客户经理：">
          <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="流失原因：">
          <el-input v-model="flashPromotion.title" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="最后下单时间：">
          <el-date-picker
            v-model="flashPromotion.startDate"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认流失时间时间：">
          <el-date-picker
            v-model="flashPromotion.endDate"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteFlash, createFlash, updateFlash} from '@/api/flash';
  import {formatDate} from '@/utils/date';

  const defaultchanceQuery = {
    pageNum: 1,
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
      handleResetSearch() {
        this.chanceQuery = Object.assign({}, defaultchanceQuery);
      },
      handleSearchList() {
        this.chanceQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.chanceQuery.pageNum = 1;
        this.chanceQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.chanceQuery.pageNum = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.flashPromotion = Object.assign({},defaultFlashPromotion);
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
        this.flashPromotion = Object.assign({},row);
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.isEdit) {
            updateFlash(this.flashPromotion.id,this.flashPromotion).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          } else {
            createFlash(this.flashPromotion).then(() => {
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
        this.$router.push({path:'/sms/selectSession',query:{flashPromotionId:row.id}})
      },
      getList() {
        this.listLoading = false;   //waitting  code  true
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


