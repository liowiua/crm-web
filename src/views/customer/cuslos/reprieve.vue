<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div style="margin-top: 15px">
        <el-button circle 
        @click="back()" 
        style="margin-left: 20px">
        <i class="el-icon-back" ></i>
      </el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>计划项</span>
      <el-button type="primary" 
        size="mini" 
        class="btn-add" 
        @click="handleStateChange()" 
        style="margin-left: 20px">
        确认流失
      </el-button>
      <el-button 
        size="mini" 
        class="btn-add"  
        @click="handleAdd()" 
        style="margin-left: 10px">
        <i class="fa fa-plus" aria-hidden="true"></i>
        添加暂缓
      </el-button>
    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="roleTable"
                :data="planItemList"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="编号"  align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="暂缓措施" align="center">
          <template slot-scope="scope">{{scope.row.measure}}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center">
          <template slot-scope="scope">{{scope.row.createDate |formatDate}}</template>
        </el-table-column>
        <el-table-column label="更新时间"  align="center">
          <template slot-scope="scope">{{scope.row.updateDate |formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>       
      </el-table>
    </el-scrollbar>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="planQuery.pageCount"
        :page-size="planQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加计划项"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="lossPlan"
               ref="lossPlanForm"
               label-width="150px" size="small">
        <el-form-item label="暂缓措施">
          <el-input type="textarea" v-model="lossPlan.measure" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="流失确认"
      :visible.sync="lossDialogVisible"
      width="40%">
      <el-form
               ref="lossPlanForm"
               label-width="150px" size="small">
        <el-form-item label="流失原因">
          <el-input type="textarea" v-model="lossReason" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lossDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleLossDialogConfirm()" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchReprievePlaList, createReprieve, updateReprieve, updateLossState, deleteReprieve} from '@/api/customer'; //, 
  import {formatDate} from '@/utils/date';

  const defaultLossPlan = {
    lossId: "",
    measure: "",
  };

  const defaultPlanItemQuery = {
    id: null,
    pageCount: 1,
    pageSize: 10,
  };
  const defaultPlanQuery = {
    lossId:null,
    pageCount: 1,
    pageSize: 5
  };
  export default {
    name: 'reprieve',
    data() {
      return {
        customer:{},
        lossPlan: Object.assign({}, defaultLossPlan),
        dialogVisible: false,
        lossReason: null,
        lossDialogVisible: false,
        total: null,
        cusInfo:{title:"ok"},
        planItemList: [],
        planQuery: Object.assign({}, defaultPlanQuery),
        planItemQuery: Object.assign({}, defaultPlanItemQuery),
        list: null,
        listLoading: false,
        multipleSelection: [],
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.state = this.$route.query.state;
      this.getList();
    },
    filters: {
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      }
    },
    methods: {
      handleSizeChange(val) {
        this.planQuery.pageNum = 1;
        this.planQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.planQuery.pageNum = val;
        this.getList();
      },
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
      },

      handleSelectionChange(val) {  //wait
        this.multipleSelection = val;
      },
      //确认对话框操作
      handleDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.lossPlan.lossId = this.id;
          if (!this.isEdit) {
            createReprieve(this.lossPlan).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
          })
          }else{
            updateReprieve(this.lossPlan).then(() => {
              this.$message({
                message: '修改成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
            })
          }
        })
      },
      handleStateChange(){
        if(this.state == 1){
          this.$message.error('该客户已确认流失');
          return;
        }

        this.lossDialogVisible = true;
      },
      //处理确认流失
      handleLossDialogConfirm() {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          console.log(this.lossReason);
          updateLossState({lossId: this.id, lossReason: this.lossReason}).then(() => {
            this.$message({
              message: '操作成功！',
              type: 'success'
            });
              this.lossDialogVisible =false;
          })
        })
      },
      //更新项
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.lossPlan.measure = row.measure;
        this.lossPlan.id = row.id;
      },

      handleDelete(index, row) {
        this.$confirm('是否要删除该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteReprieve({id: row.id}).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },

      //获取开发计划项列表
      getList() {
        this.listLoading = true;   //waitting  code  true
        this.planQuery.lossId = this.id;
        fetchReprievePlaList(this.planQuery).then(response => {
          this.planItemList = response.data.list;
          this.listLoading = false;
        })
      },

      closeAuthenticateDialog(){
        this.authenticateDialogVisible = false;
      },

      back(){
        this.$router.back();
      }
    }
  }
</script>
<style></style>


