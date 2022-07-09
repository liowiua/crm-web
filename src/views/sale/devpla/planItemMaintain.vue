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


      <el-button type="danger" 
        size="mini" 
        class="btn-add" 
        @click="handleStateChange(3)" 
        style="margin-left: 20px">
        开发失败
      </el-button>
      <el-button type="primary" 
        size="mini" 
        class="btn-add" 
        @click="handleStateChange(2)" 
        style="margin-left: 20px">
        开发成功
      </el-button>
      <el-button 
        size="mini" 
        class="btn-add"  
        @click="handleAdd()" 
        style="margin-left: 10px">
        <i class="fa fa-plus" aria-hidden="true"></i>
        添加计划项
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
        <el-table-column label="计划项" align="center">
          <template slot-scope="scope">{{scope.row.planItem}}</template>
        </el-table-column>
        <el-table-column label="计划时间"  align="center">
          <template slot-scope="scope">{{scope.row.planDate |formatDate}}</template>
        </el-table-column>
        <el-table-column label="执行效果" align="center">
          <template slot-scope="scope">{{scope.row.exeAffect}}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center">
          <template slot-scope="scope">{{scope.row.createDate |formatDate}}</template>
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
      <el-form :model="devPlaItem"
               ref="devPlaItemForm"
               label-width="150px" size="small">
        <el-form-item label="计划项内容">
          <el-input type="textarea" v-model="devPlaItem.planItem" style="width: 250px"></el-input>
        </el-form-item>

        <el-form-item label="执行效果">
          <el-input type="textarea" v-model="devPlaItem.exeAffect" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker
            v-model="devPlaItem.planDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <!-- <el-input v-model="devPlaItem.planDate" style="width: 250px"></el-input> -->
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
  import {fetchDevPlaList,createDevPlaItem, updateStatus, updateDevPlaItem,findCustomer, deleteDevPla} from '@/api/devpla'; //, 
  import {formatDate} from '@/utils/date';

  const defaultDevPlaItem = {
    exeAffect: "",
    planItem: "",
    saleChanceId: null,
    planDate: null,
  };

  const defaultPlanItemQuery = {
    id: null,
    pageCount: 1,
    pageSize: 10,
  };
  const defaultPlanQuery = {
    pageCount: 1,
    pageSize: 5
  };
  export default {
    name: 'planItemMaintain',
    data() {
      return {
        customer:{},
        devPlaItem: Object.assign({}, defaultDevPlaItem),
        dialogVisible: false,
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
      this.getCustomer();
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
      handleStateChange(state) {
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          updateStatus({id:this.id, devResult:state}).then(() => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.getList();
          })
        })
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
          if (!this.isEdit) {
            createDevPlaItem(this.transformDate()).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
          })
          }else{
            updateDevPlaItem(this.transformDate()).then(() => {
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
      //更新项
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        let date = this.devPlaItem.planDate;
        this.devPlaItem = Object.assign({},row);
        this.devPlaItem.planDate = date;
      },

      handleDelete(index, row) {
        this.$confirm('是否要删除该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDevPla({id: row.id}).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      //转化时间格式、增加id给后端
      transformDate(){
        let devPlaItem = Object.assign({},this.devPlaItem);
        devPlaItem.saleChanceId = this.id;
        devPlaItem.planDate = formatDate(this.devPlaItem.planDate, 'yyyy-MM-dd hh:mm:ss');
        console.log(this.devPlaItem.planDate);
        return devPlaItem;
      },

      getCustomer(){
        findCustomer({id: this.id}).then(response => {
          this.customer = response.data;
        })
      },

      //获取开发计划项列表
      getList() {
        this.listLoading = true;   //waitting  code  true
        this.planQuery.id = this.id;
        fetchDevPlaList(this.planQuery).then(response => {
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


