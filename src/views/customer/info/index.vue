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
        <el-form :inline="true"  size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="chanceQuery.name" 
              class="input-width" 
              placeholder="客户名称" 
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="chanceQuery.level" placeholder="请选择" >
            <el-option
              v-for="item in optionsList1"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="linkmanManagement()" style="margin-left: 20px">联系人管理</el-button>
      <el-button size="mini" class="btn-add" @click="contactManagement()" style="margin-left: 20px">交往记录</el-button>
      <el-button size="mini" class="btn-add" @click="orderDetail()" style="margin-left: 20px">订单查看</el-button>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加客户</el-button>
    </el-card>
    <el-scrollbar class="table-container" >
      <el-table ref="flashTable"
                :data="list"
                style="width: 3100px;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="客户名" width="150" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="法人" width="100" align="center">
          <template slot-scope="scope">{{scope.row.fr}}</template>
        </el-table-column>
        <el-table-column label="客户编号" width="200" align="center">
          <template slot-scope="scope">{{scope.row.khno}}</template>
        </el-table-column>
        <el-table-column label="客户经理编号" width="110" align="center">
          <template slot-scope="scope">{{scope.row.cusManagerId}}</template>
        </el-table-column>
        <el-table-column label="满意度" width="150" align="center">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.myd"></el-rate>
            </template>
        </el-table-column>
        <el-table-column label="客户级别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.level}}</template>
        </el-table-column>
        <el-table-column label="流失状态" width="100" align="center">
          <template slot-scope="scope">{{scope.row.state}}</template>
        </el-table-column>
        <el-table-column label="信用度" width="150" align="center">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.xyd"></el-rate>
            </template>
        </el-table-column>
        <el-table-column label="详细地址" width="200" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="电话" width="150" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="网站" width="150" align="center">
          <template slot-scope="scope">{{scope.row.webSite}}</template>
        </el-table-column>
        <el-table-column label="注册资金" width="100" align="center">
          <template slot-scope="scope">{{scope.row.zczj}}</template>
        </el-table-column>
        <el-table-column label="营业执照" width="150" align="center">
          <template slot-scope="scope">{{scope.row.yyzzzch}}</template>
        </el-table-column>
        <el-table-column label="开户行" width="100" align="center">
          <template slot-scope="scope">{{scope.row.khyh}}</template>
        </el-table-column>
        <el-table-column label="开户账号" width="150" align="center">
          <template slot-scope="scope">{{scope.row.khzh}}</template>
        </el-table-column>
        <el-table-column label="年营业额" width="100" align="center">
          <template slot-scope="scope">{{scope.row.nyye}}</template>
        </el-table-column>
        <el-table-column label="国税" width="100" align="center">
          <template slot-scope="scope">{{scope.row.gsdjh}}</template>
        </el-table-column>
        <el-table-column label="地税" width="130" align="center">
          <template slot-scope="scope">{{scope.row.dsdjh}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.updateDate | formatDate}}</template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                      type="text"
                      @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                      type="text"
                      @click="handleDelete(scope.$index, scope.row)">删除
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
        :current-page.sync="chanceQuery.pageCount"
        :page-size="chanceQuery.pageSize"
        :page-sizes="[10,20,30]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="客户管理-添加客户信息"
      :visible.sync="dialogVisible"
      width="40%"
      class="info-dialog">
      <el-form :model="customer"
        ref="customerForm"
        size="small">
        <el-form-item >
          <el-col :span="4" class="first-col"><span>客户名称</span></el-col>
          <el-col :span="8">
            <el-input v-model="customer.name" ></el-input>
          </el-col>
          <el-col :span="4" class="second-col">
            <span>法人</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customer.fr" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
          <el-col :span="4" class="first-col"><span>年营业额</span></el-col>
          <el-col :span="8">
            <el-input v-model="customer.nyye" ></el-input>
          </el-col>
          <el-col :span="4" class="second-col">
            <span>客户经理</span>
          </el-col>
          <el-col :span="8">
            <el-select v-model="customer.cusManagerId" placeholder="选择客户经理" >
              <el-option
                v-for="item in managerList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item >
          <el-col :span="4" class="first-col"><span>客户级别</span></el-col>
          <el-col :span="8">
            <el-select v-model="customer.level" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in custcategoryOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4" class="second-col">
            <span>信用度</span>
          </el-col>
          <el-col :span="8">
            <el-rate v-model="customer.xyd" ></el-rate>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-col :span="4" class="first-cqol"><span>满意度</span></el-col>
          <el-col :span="8">
            <!-- <el-input v-model="customer.myd" ></el-input> -->
            <el-rate v-model="customer.myd"></el-rate>
          </el-col>
          <el-col :span="4" class="second-col">
            <span>联系电话</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customer.phone" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item >
          <el-col :span="4" class="first-col"><span>客户地址</span></el-col>
          <el-col :span="8">
            <el-input v-model="customer.address" ></el-input>
          </el-col>

          <el-col :span="4" class="second-col">
            <span>注册资金</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customer.zczj" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
          <el-col :span="4" class="first-col"><span>开户行</span></el-col>
          <el-col :span="8">
            <el-input v-model="customer.khyh" ></el-input>
          </el-col>
          <el-col :span="4" class="second-col">
            <span>开户账号</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customer.khzh" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
          <el-col :span="4" class="first-col"><span>国税</span></el-col>
          <el-col :span="8">
            <el-input v-model="customer.gsdjh" ></el-input>
          </el-col>
          <el-col :span="4" class="second-col">
            <span>地税</span>
          </el-col>
          <el-col :span="8">
            <el-input v-model="customer.dsdjh" ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item >
          <el-col :span="4" class="first-col"><span>网站</span></el-col>
          <el-col :span="8">
            <el-input v-model="customer.webSite" ></el-input>
          </el-col>
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
import {fetchList, deleteCustomer,createCustomer, updateCustomer} from '@/api/customer';
import {fetchManagerList} from '@/api/user';
import {formatDate} from '@/utils/date';

const defaultchanceQuery = {     //默认查询数据
  pageCount: 1,
  pageSize: 10,
  name: null
};
const defaultCustcategoryOptions=[
  {
    label: '战略合作伙伴',
    value: '战略合作伙伴'
  },
  {
    label: '大客户',
    value: '大客户'
  },
  {
    label: '重点开发客户',
    value: '重点开发客户'
  }
];




const defaultCustomer = {      //默认修改用户数据
  customerName: null,
  contacts: null,
  tel: null,
  address: null,
  postal: null,
  fax: null,
  url: null,
  legalPerson: null,
  fund: null,
  turnover: null,
  bank: null,
  bankNumber: null,
  stateTax: null,
  userName: null,    //客户经理姓名
  custcategoryId: null,
  creditId: null,
  satisfiedId: null,
  custfromId: null,
  landTax: null,
};
export default {
  name: 'customerList',
  data() {
    return {
      chanceQuery: Object.assign({}, defaultchanceQuery),
      custcategoryOptions: Object.assign({}, defaultCustcategoryOptions),
      list: null,
      total: null,
      defaultCustomerGrade: '',
      myd:null,   //满意度
      xyd:null,   //信用度
      listLoading: false,
      dialogVisible: false,
      customer: Object.assign({}, defaultCustomer),
      isEdit: false,
      managerList: [],
      multipleSelection: [],
      optionsList1: [{ value: '战略合作伙伴',label: '战略合作伙伴'}, //el-select选择器的选项
                        {value: '大客户',label: '大客户'},
                        {value: '重点开发客户',label: '重点开发客户'},
                        ],
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
      this.customer = Object.assign({},defaultCustomer);
    },
    orderDetail() {
      if(this.onlySelectOne())
        this.$router.push({path:'/customer/order', query:{id: this.multipleSelection[0].id}})
    },
    contactManagement() {
      if(this.onlySelectOne())
        this.$router.push({path:'/customer/contact', query:{id: this.multipleSelection[0].id}})
    },
    linkmanManagement() {
      if(this.onlySelectOne())        
        this.$router.push({path:'/customer/linkman', query:{id: this.multipleSelection[0].id}})
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
    handleDelete(index, row) {
      this.$confirm('是否要删除该客户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCustomer(row.id).then(() => {
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
      this.customer = Object.assign({},row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateCustomer(this.customer).then(() => {
            this.$message({
              message: '修改成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
          })
        } else {
          createCustomer(this.customer).then(() => {
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
      this.$router.push({path:'/sms/selectSession',query:{customerId:row.id}})
    },
    handleSelectionChange(val) {  //wait
      this.multipleSelection = val;
    },
    getList() {
      this.listLoading = true;   //waitting  code  true
      fetchManagerList().then(response => {
        this.managerList = response.data;
      });
      fetchList(this.chanceQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
      }).catch(err => console.log(err));
    }
  }
}
</script>
<style lang="scss" scoped>

.second-col, .first-col {
  text-align: right;
  padding-right: 13px;
}

.table-container {
  th {
    padding: 0 !important;
    height: 48px;
    line-height: 48px;
  }
  td {
    padding: 0 !important;
    height: 48px;
    line-height: 48px;
  }
}

.el-table{
  padding-bottom: 17px;
}
// .el-scrollbar__wrap {
//     overflow: scroll;
//     height: 100%;
//     margin-bottom: -34px !important;
// }

// .el-table--scrollable-x .el-table__body-wrapper {
//     overflow-x: visible;
// }

// .el-table__body-wrapper {
//     overflow: visible;
//     position: relative;
// }
// .el-table {
//     position: relative;
//     overflow: visible;
// }
// .el-table--scrollable-x .el-table__body-wrapper {
//     overflow-x: visible;
// }

// .el-table__body-wrapper {
//     overflow: hidden;
//     position: relative;
// }
</style>