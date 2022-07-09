<template>
  <div class="app-container">

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
            <el-button 
        size="mini" 
        class="btn-add" 
        @click="handleAdd()" 
        style="margin-left: 20px">
        添加
      </el-button>
    </el-card>
    <el-scrollbar class="table-container" >
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="字典名称" width="150" align="center">
          <template slot-scope="scope">{{scope.row.dataDicName}}</template>
        </el-table-column>
        <el-table-column label="字典值" width="150" align="center">
          <template slot-scope="scope">{{scope.row.dataDicValue}}</template>
        </el-table-column>
        <el-table-column label="创建时间"  align="center">
          <template slot-scope="scope">{{scope.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="更新时间"  align="center">
          <template slot-scope="scope">{{scope.row.updateDate | formatDate}}</template>
        </el-table-column>
                <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button size="mini"
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
        :current-page.sync="dictQuery.pageCount"
        :page-size="dictQuery.pageSize"
        :page-sizes="[10,20,30]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="添加服务"
      :visible.sync="dialogVisible"
      width="35%"
      class="info-dialog">
      <el-form :model="dict"
        ref="dictForm"
        size="small">
        <el-form-item label="字典名">
          <el-input v-model="dict.dataDicName" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="字典值">
          <el-input type="textarea" v-model="dict.dataDicValue" style="width: 250px"></el-input>
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

import {fetchList, createDatadic, updateDatadic, deleteDatadic} from '@/api/dict';//
import {formatDate} from '@/utils/date';

const defaultServiceQuery = {     //默认查询数据
  pageCount: 1,
  pageSize: 10,
};

const defaultService = {      //默认修改用户数据
  dictName: null,
};
export default {
  name: 'dictList',
  data() {
    return {
      dictQuery: Object.assign({}, defaultServiceQuery),
      list: null,
      total: null,
      defaultServiceGrade: '',
      listLoading: false,
      dialogVisible: false,
      dict: Object.assign({}, defaultService),
      isEdit: false,
      managerList: [],
      multipleSelection: [],
      optionsList: [{ value: 6,label: '咨询'}, //el-select选择器的选项
                        {value: 7,label: '建议'},
                        {value: 8,label: '投诉'},
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
      this.dictQuery = Object.assign({}, defaultServiceQuery);
    },
    handleSearchList() {
      this.dictQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.dictQuery.pageNum = 1;
      this.dictQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.dictQuery.pageNum = val;
      this.getList();
    },
    handleAdd() {
      this.dialogVisible = true;
      this.isEdit = false;
      this.dict = Object.assign({},defaultService);
    },

    handleUpdate(index, row) {
      this.dialogVisible = true;
      this.isEdit = true;
      this.dict = Object.assign({},row);
    },
    handleDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!this.isEdit) {
          this.dict.cusId = this.id;
          createDatadic(this.dict).then(() => {
            this.$message({
              message: '添加成功！',
              type: 'success'
            });
            this.dialogVisible =false;
            this.getList();
        })
        }else{
          updateDatadic(this.dict).then(() => {
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
    handleDelete(index, row) {
      this.$confirm('是否要删除该字典?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDatadic(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleSelectionChange(val) {  //wait
      this.multipleSelection = val;
    },
    getList() {
      this.listLoading = true;   //waitting  code  true
      fetchList(this.dictQuery).then(response => {
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

</style>