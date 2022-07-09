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
      <span>订单记录</span>
      <el-button 
        size="mini" 
        class="btn-add"  
        @click="handleAdd()" 
        style="margin-left: 10px">
        <i class="fa fa-plus" aria-hidden="true"></i>
        添加订单
      </el-button>
    </el-card>
    <el-scrollbar class="table-container">
      <el-table ref="roleTable"
                :data="orderList"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{scope.row.customerOrder.orderNo}}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.orderDetailsList[0].goodsName}}</template>
        </el-table-column>
        <el-table-column label="地址"  align="center">
          <template slot-scope="scope">{{scope.row.customerOrder.address}}</template>
        </el-table-column>
        <el-table-column label="订单状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.customerOrder.state == 1" type="success">已处理</el-tag>
            <el-tag v-else-if="scope.row.customerOrder.state == 0" type="danger">未处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="100px" align="center">
          <template slot-scope="scope">{{scope.row.customerOrder.orderDate |formatDate}}</template>
        </el-table-column>
        <el-table-column label="更新时间"  align="center">
          <template slot-scope="scope">{{scope.row.customerOrder.updateDate |formatDate}}</template>
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
        :current-page.sync="orderQuery.pageCount"
        :page-size="orderQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加订单"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="order"
               ref="orderForm"
               label-width="150px" size="small">
        <el-form-item label="商品名">
          <el-input v-model="order.goodsName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="order.address" style="width: 250px"></el-input>
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
  import {createOrder, deleteLinkman, fetchOrderList, updateLinkman} from '@/api/operationCus'; //, 
  import {formatDate} from '@/utils/date';

  const defaultLinkman = {
    cusId: null,
    linkName: null,
    sex: null,
    officePhone: null,
    phone: null,
    zhiwei: null
  };

  const defaultPlanItemQuery = {
    id: null,
    pageCount: 1,
    pageSize: 10,
  };
  const defaultLinkmanQuery = {
    cId:null,
    pageCount: 1,
    pageSize: 5
  };
  export default {
    name: 'order',
    data() {
      return {
        customer:{},
        order: Object.assign({}, defaultLinkman),
        dialogVisible: false,
        lossReason: null,
        total: null,
        orderList: [],
        orderQuery: Object.assign({}, defaultLinkmanQuery),
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
        this.orderQuery.pageNum = 1;
        this.orderQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.orderQuery.pageNum = val;
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
          if (!this.isEdit) {
            this.order.cusId = this.id;
            createOrder(this.order).then(() => {
              this.$message({
                message: '添加成功！',
                type: 'success'
              });
              this.dialogVisible =false;
              this.getList();
          })
          }else{
            updateLinkman(this.order).then(() => {
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
      //
      //更新项
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.order = row;
        delete this.order.ceateDate;
        delete this.order.updateDate;
      },

      handleDelete(index, row) {
        this.$confirm('是否要删除该计划?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteLinkman(row.id).then(() => {
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
        this.orderQuery.cId = this.id;
        fetchOrderList(this.orderQuery).then(response => {
          this.orderList = response.data.list;
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
<style lang="scss" scoped>
  .el-table{
    padding-bottom: 17px;
  }

</style>


