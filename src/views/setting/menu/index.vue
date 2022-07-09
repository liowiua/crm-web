<template>
  <div class="app-container">
    
    <el-card class="operate-container" shadow="never">
    </el-card>
    <div class="table-container">
      <el-table ref="moduleTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="菜单名称" width="100" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="权限码" align="center">
          <template slot-scope="scope">{{scope.row.optValue}}</template>
        </el-table-column>
        <el-table-column label="菜单url" width="140" align="center">
          <template slot-scope="scope">{{scope.row.url}}</template>
        </el-table-column>
        <el-table-column label="上级菜单" width="140" align="center">
          <template slot-scope="scope">{{scope.row.parentId}}</template>
        </el-table-column>
        <el-table-column label="菜单等级" width="140" align="center">
          <template slot-scope="scope">{{scope.row.grade}}</template>
        </el-table-column>
        <el-table-column label="排序" width="140" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="是否隐藏" width="180" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.hidden"
              active-color="#4abf8a"
              inactive-color="#f78989"
              :active-value=true
              :inactive-value=false
              @change="handleStatusChange(scope.row)">
            </el-switch>
          </template>
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
        :page-sizes="[10,20,30]"
        :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import {fetchList, hiddenModule} from '@/api/module';//, updateStatus
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
    name: 'modulePromotionList',
    data() {
      return {
        chanceQuery: Object.assign({}, defaultchanceQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogVisible: false,
        modulePromotion: Object.assign({}, defaultFlashPromotion),
        isEdit: false,

        optionsList1: [{ value: '选项1',label: '未分配'}, //el-select选择器的选项
                        {value: '选项2',label: '已分配'},],
        optionsList2: [{ value: '选项1',label: '角色role1'}, //添加机会子菜单，指派选择框的选项
                        {value: '选项2',label: '角色role2'},]

      }
    },
    created() {
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

      handleStatusChange(row) {
        this.$confirm('是否要修改该状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row);
          // let t = (row.hidden === 1);
          hiddenModule({id: row.id, hidden: row.hidden}).then(() => {
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

      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.modulePromotion = Object.assign({},row);
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
<style></style>


