<template>
  <div class="app-container">

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>流失记录</span>
    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 1500px;"
                v-loading="listLoading" border>
        <el-table-column label="客户编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.cusNo}}</template>
        </el-table-column>
        <el-table-column label="客户名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column label="客户经理" width="100" align="center">
          <template slot-scope="scope">{{scope.row.managerName}}</template>
        </el-table-column>
        <el-table-column label="最后下单时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.lastOrderTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="流失状态" width="140" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == 0" type="warning">疑似流失</el-tag>
            <el-tag v-else-if="scope.row.state == 1" type="danger">确认流失</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="流失原因" width="140" align="center">
          <template slot-scope="scope">{{scope.row.lossReason}}</template>
        </el-table-column>
        <el-table-column label="确认流失时间时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.confirmLossTime | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       @click="handleReprieve(scope.$index, scope.row)">
              暂缓记录
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column> 
        <el-table-column label="更新时间" width="140" align="center">
          <template slot-scope="scope">{{scope.row.updateDate | formatDate}}</template>
        </el-table-column>

      </el-table>
    </el-scrollbar>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="lossQuery.pageCount"
        :page-size="lossQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加流失客户"
      :visible.sync="dialogVisible"
      width="40%"
      >
      <el-form :model="lossRecord"
               ref="lossRecordForm"
               label-width="150px" size="small"
               >
        <el-form-item label="客户名称：">
          <el-input v-model="lossRecord.customerName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="客户经理：">
          <el-input v-model="lossRecord.managerName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="流失原因：">
          <el-input v-model="lossRecord.lossReason" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="最后下单时间：">
          <el-date-picker
            v-model="lossRecord.lastOrderTime"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认流失时间时间：">
          <el-date-picker
            v-model="lossRecord.confirmLossTime"
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
  import {fetchLossList} from "@/api/customer";
  import {formatDate} from '@/utils/date';

  const defaultlossQuery = {
    pageCount: 1,
    pageSize: 10,
    customerName: null,
    state: null
  };

  const defaultLossRecord = {
    id: null,
    cusNo:null,
    customerName:null,
    managerName:null,
    lossReason:null,
    lastOrderTime:null,
    confirmLossTime:null,
    title: null,
    createDate:null,
    updateDate:null,
    status: 0
  };
  export default {
    name: 'lossRecordList',
    data() {
      return {
        lossQuery: Object.assign({}, defaultlossQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        lossRecord: Object.assign({}, defaultLossRecord),
        isEdit: false,

        optionsList: [{ //el-select选择器中的选项
          value: '选项1',
          label: '暂缓流失'
        }, {
          value: '选项2',
          label: '确认流失'
        },
        ]
        
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= row.startDate && nowTime <= row.confirmLossTime) {
          return '客户进行中';
        } else if (nowTime > row.confirmLossTime) {
          return '客户已结束';
        } else {
          return '客户未开始';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return '未确认流失';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      handleResetSearch() {
        this.lossQuery = Object.assign({}, defaultlossQuery);
      },
      handleSearchList() {
        this.lossQuery.pageCount = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.lossQuery.pageCount = 1;
        this.lossQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.lossQuery.pageCount = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.lossRecord = Object.assign({},defaultLossRecord);
      },

      handleReprieve(index, row) {
        this.$router.push({path: '/customer/reprieve', query:{id: row.id, state: row.state}})
      },
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // if (this.isEdit) {
          //   updateLossItem(this.lossRecord.id,this.lossRecord).then(() => {
          //     this.$message({
          //       message: '修改成功！',
          //       type: 'success'
          //     });
          //     this.dialogVisible =false;
          //     this.getList();
          //   })
          // } else {
          //   createLossItem(this.lossRecord).then(() => {
          //     this.$message({
          //       message: '添加成功！',
          //       type: 'success'
          //     });
          //     this.dialogVisible =false;
          //     this.getList();
          //   })
          // }
        }
        )
      },
      handleSelectSession(index,row){
        this.$router.push({path:'/sms/selectSession',query:{lossRecordId:row.id}})
      },
      getList() {
        this.listLoading = false;   //waitting  code  true
        fetchLossList(this.lossQuery).then(response => {

          console.log(response);
          this.listLoading = false;
          this.list = response.data.list;
          console.log(this.list);
          this.total = response.data.total;
        }).catch(err => console.log(err));
      }
    }
  }
</script>
<style>

.el-table{
  padding-bottom: 17px;
}
</style>


