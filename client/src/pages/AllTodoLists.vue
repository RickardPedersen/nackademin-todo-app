<template>
  <div class="q-pa-md">
    <q-table
      title="Users"
      :data="users"
      :columns="columns"
      row-key="_id"
      binary-state-sort
      :loading="loading"
      :filter="filter"
      @request="onRequest"
    >
      <template v-slot:top-right>
        <q-input dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:top-left>
        <div class="q-table__title">Todo Lists</div>
        <q-form @submit="addTodoList">
          <h5 class="q-mb-sm">Add todo list</h5>
          <q-input
            ref="addTitle"
            dense
            outlined
            debounce="300"
            v-model="addTitle"
            label="Title"
            lazy-rules="ondemand"
            :rules="[createRules]"
          />

          <q-btn dense type="submit">Add Todo List</q-btn>
        </q-form>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td>
            <q-btn :to="'/todo-list/' + props.row._id">Todos</q-btn>
          </q-td>

          <q-td key="title" :props="props">
            {{ props.row.title }}
            <q-popup-edit
              v-model="props.row.title"
              title="Update Title"
              buttons
              @save="updateTodoList(props.row._id, props.row.title)"
            >
              <q-input v-model="props.row.title" dense autofocus counter />
            </q-popup-edit>
          </q-td>

          <q-td key="createdAt" :props="props">
            <div class="text-pre-wrap">
              {{ new Date(props.row.createdAt).toLocaleTimeString() }}
            </div>
          </q-td>

          <q-td key="updatedAt" :props="props">
            {{ new Date(props.row.updatedAt).toLocaleTimeString() }}
          </q-td>

          <q-td key="delete" :props="props">
            <q-btn
              round
              color="negative"
              icon="delete"
              @click="deleteTodoList(props.row._id)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import UserRequests from "../UserRequests";
import TodoListRequests from "../todoListRequest";

export default {
  data() {
    return {
      addTitle: "",
      addPassword: "",
      newPassword: "",
      newTitle: "",
      filter: "",
      loading: false,
      pagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 5,
        rowsNumber: 0
      },
      users: [],
      selected: [],
      columns: [
        {
          name: "seeTodos",
          label: "See todos",
          field: "seeTodos",
          align: "left"
        },
        {
          name: "title",
          required: true,
          label: "Title",
          align: "left",
          field: row => row.name,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "createdAt",
          label: "CreatedAt",
          field: "createdAt",
          sortable: true,
          style: "width: 10px"
        },
        {
          name: "updatedAt",
          label: "UpdatedAt",
          field: "updatedAt",
          sortable: true
        },
        { name: "delete", label: "Delete", field: "delete" }
      ]
    };
  },
  methods: {
    async onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      this.loading = true;

      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

      // calculate starting row of data
      const startRow = (page - 1) * rowsPerPage;

      // fetch data from server

      const fetchResult = await this.fetchFromServer(
        descending,
        page,
        fetchCount,
        sortBy,
        filter
      );

      // update rowsCount with appropriate value
      this.pagination.rowsNumber = fetchResult.count;

      const returnedData = fetchResult.data;

      // clear out existing data and add new
      this.users.splice(0, this.users.length, ...returnedData);

      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;

      this.loading = false;
    },

    async fetchFromServer(order, page, limit, sortBy, filter) {
      let skip = 0;
      skip = (page - 1) * limit;

      return await TodoListRequests.getTodoLists(
        order,
        skip,
        limit,
        sortBy,
        filter
      );
    },
    async deleteTodoList(id) {
      await TodoListRequests.deleteTodoList(id);
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      });
    },
    async updateTodoList(id, val) {
      let editedTodoList = {
        title: val
      };
      await TodoListRequests.updateTodoList(editedTodoList, id);
      await this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      });
      return true;
    },
    async addTodoList() {
      let validated = await this.createRules(this.newTitle);

      if (validated) {
        let todoList = {
          title: this.addTitle
        };

        await TodoListRequests.createTodoList(todoList);
        this.addTitle = "";

        this.$refs.addTitle.blur();

        this.$refs.addTitle.resetValidation();

        await this.onRequest({
          pagination: this.pagination,
          filter: this.filter
        });
      }
    },
    async createRules(val) {
      return new Promise((resolve, reject) => {
        resolve(!!val || "Please type something");
      });
    }
  },
  mounted() {
    // get initial data from server (1st page)
    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    });
  }
};
</script>
