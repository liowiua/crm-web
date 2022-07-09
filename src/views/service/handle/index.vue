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
        <el-form :inline="true" :model="serviceQuery" size="small" label-width="140px">
          <el-form-item>
            <el-input 
              v-model="serviceQuery.name" 
              class="input-width" 
              placeholder="客户名称" 
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="defaultServiceGrade" placeholder="请选择" >
            <el-option
              v-for="item in optionsList1"
              :key="item.label"
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
    </el-card>
    <el-scrollbar class="table-container" >
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>

        <el-table-column label="客户名" width="150" align="center">
          <template slot-scope="scope">{{scope.row.customer}}</template>
        </el-table-column>
        <el-table-column label="服务类型" width="80" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.serveType == 6" type="success">咨询</el-tag>
            <el-tag v-if="scope.row.serveType == 7" type="info">建议</el-tag>
            <el-tag v-if="scope.row.serveType == 8" type="danger">投诉</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="概要信息" width="200" align="center">
          <template slot-scope="scope">{{scope.row.overview}}</template>
        </el-table-column>
        <el-table-column label="服务请求内容" width="200" align="center">
          <template slot-scope="scope">{{scope.row.serviceRequest}}</template>
        </el-table-column>
        <el-table-column label="创建人" width="100" align="center">
          <template slot-scope="scope">{{scope.row.createPeople}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>

        <el-table-column label="更新时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.updateDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                      type="primary"
                      @click="handleServe(scope.row)">
              处理
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
        :current-page.sync="serviceQuery.pageCount"
        :page-size="serviceQuery.pageSize"
        :page-sizes="[10,20,30]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="服务分配"
      :visible.sync="dialogVisible"
      width="30%"
      class="info-dialog">
      <el-form :model="service"
        ref="serviceForm"
        size="small">
        <el-form-item label="处理内容：">
          <el-input v-model="serveContent" 
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    style="width: 250px"></el-input>
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
import {fetchList,  handleService} from '@/api/service';//
import {fetchManagerList} from '@/api/user';
import {formatDate} from '@/utils/date';

const defaultServiceQuery = {     //默认查询数据
  assigner: null,
  pageCount: 1,
  pageSize: 10,
  state:'fw_002',
  serveType: null,
};

const defaultService = {      //默认修改用户数据
  serviceName: null,
};
export default {
  name: 'serviceList',
  data() {
    return {
      serviceQuery: Object.assign({}, defaultServiceQuery),
      serveContent: null,
      currentId: null,
      list: null,
      total: null,
      defaultServiceGrade: '',
      listLoading: false,
      dialogVisible: false,
      service: Object.assign({}, defaultService),
      managerList: [],
      multipleSelection: [],
      optionsList: [],
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
      this.serviceQuery = Object.assign({}, defaultServiceQuery);
    },
    handleSearchList() {
      this.serviceQuery.pageCount = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.serviceQuery.pageCount = 1;
      this.serviceQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.serviceQuery.pageCount = val;
      this.getList();
    },

    handleServe(row) {
      this.currentId = row.id;
      this.dialogVisible = true;
      // this.service = Object.assign({},defaultService);
    },
    handleDialogConfirm() {
      this.$confirm('是否已成功处理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // id:row.id, 
        handleService({id: this.currentId,
                      serviceProcePeople: this.$store.getters.id, 
                      serviceProce: this.serveContent ,
                      isValid: 1}).then(() => {
          this.$message({
            message: '处理成功！',
            type: 'success'
          });
          this.dialogVisible =false;
          this.getList();
        })
      })
    },
    handleSelectSession(index,row){
      this.$router.push({path:'/sms/selectSession',query:{serviceId:row.id}})
    },
    handleSelectionChange(val) {  //wait
      this.multipleSelection = val;
    },
    getList() {
      this.listLoading = true;   //waitting  code  true
      fetchManagerList().then(response => {
        this.optionsList = response.data;
      });
      fetchList(this.serviceQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
      }).catch(err => console.log(err));
    }
  }
}
</script>
<style lang="scss" scoped>

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


</style>