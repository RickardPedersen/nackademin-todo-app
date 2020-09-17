(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"2c7e":function(t,e,r){"use strict";var n=r("c973"),o=r.n(n),a=r("bc3a"),i=r.n(a),s=r("4360");const d=Object(s["a"])(),l=d.getters.auth.userToken||localStorage.getItem("userToken"),c="/api/todoLists",u={headers:{Authorization:"Bearer "+l}};class p{static addMember(t,e){return o()((function*(){try{const r={addMember:e},n=yield i.a.patch(`${c}/${t}`,r,u);return n.data}catch(r){return console.error(r),!1}}))()}static removeMember(t,e){return o()((function*(){try{const r={removeMember:e},n=yield i.a.patch(`${c}/${t}`,r,u);return n.data}catch(r){return console.error(r),!1}}))()}static getTodoListTodos(t,e,r,n,a,s){return o()((function*(){try{const o=yield i.a.get(`${c}/${t}/todos?descending=${e}&skip=${r}&limit=${n}&sortBy=${a}&filter=${s}`,u),d=o.data;return d}catch(o){return console.error(o),o}}))()}static getTodoLists(){return o()((function*(){try{const t=yield i.a.get(""+c,u),e=t.data;return e}catch(t){return console.error(t),t}}))()}static createTodoList(t){return o()((function*(){try{const e=yield i.a.post(""+c,t,u),r=e.data;return r}catch(e){return console.error(e),!1}}))()}static updateTodoList(t,e){return o()((function*(){try{const r=yield i.a.patch(`${c}/${e}`,t,u),n=r.data;return n}catch(r){return console.error(r),!1}}))()}static deleteTodoList(t){return o()((function*(){try{const e=yield i.a.delete(`${c}/${t}`,u),r=e.data;return r}catch(e){return console.error(e),!1}}))()}}e["a"]=p},"446a":function(t,e,r){"use strict";var n=r("c973"),o=r.n(n),a=r("bc3a"),i=r.n(a),s=r("4360");const d=Object(s["a"])(),l=d.getters.auth.userToken||localStorage.getItem("userToken"),c="/api/users",u={headers:{Authorization:"Bearer "+l}};class p{static countUsers(t){return o()((function*(){try{const e=yield i.a.get(`${c}/count/${t}`,u),r=e.data;return r}catch(e){return console.error(e),e}}))()}static getAllUsers(t,e,r,n,a){return o()((function*(){try{const o=yield i.a.get(`${c}?descending=${t}&skip=${e}&limit=${r}&sortBy=${n}&filter=${a}`,u),s=o.data;return s}catch(o){return console.error(o),o}}))()}static getUser(t){return o()((function*(){try{const e=yield i.a.get(`${c}/${t}`,u),r=e.data;return r}catch(e){return console.error(e),e}}))()}static createUser(t){return o()((function*(){try{const e=yield i.a.post(""+c,t,u),r=e.data;return r}catch(e){return console.error(e),!1}}))()}static editUser(t,e){return o()((function*(){try{const r=yield i.a.patch(`${c}/${e}`,t,u),n=r.data;return n}catch(r){return console.error(r),!1}}))()}static deleteUser(t){return o()((function*(){try{const e=yield i.a.delete(`${c}/${t}`,u),r=e.data;return r}catch(e){return console.error(e),!1}}))()}}e["a"]=p},e964:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"q-pa-md"},[r("q-table",{attrs:{title:"Users",data:t.users,columns:t.columns,"row-key":"_id","binary-state-sort":"",loading:t.loading,filter:t.filter},on:{request:t.onRequest},scopedSlots:t._u([{key:"top-right",fn:function(){return[r("q-input",{attrs:{dense:"",debounce:"300",placeholder:"Search"},scopedSlots:t._u([{key:"append",fn:function(){return[r("q-icon",{attrs:{name:"search"}})]},proxy:!0}]),model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}})]},proxy:!0},{key:"top-left",fn:function(){return[r("div",{staticClass:"q-table__title"},[t._v("Todo Lists")]),r("q-form",{on:{submit:t.addTodoList}},[r("h5",{staticClass:"q-mb-sm"},[t._v("Add todo list")]),r("q-input",{ref:"addTitle",attrs:{dense:"",outlined:"",debounce:"300",label:"Title","lazy-rules":"ondemand",rules:[t.createRules]},model:{value:t.addTitle,callback:function(e){t.addTitle=e},expression:"addTitle"}}),r("q-btn",{attrs:{dense:"",type:"submit"}},[t._v("Add Todo List")])],1)]},proxy:!0},{key:"header",fn:function(e){return[r("q-tr",{attrs:{props:e}},t._l(e.cols,(function(n){return r("q-th",{key:n.name,attrs:{props:e}},[t._v("\n          "+t._s(n.label)+"\n        ")])})),1)]}},{key:"body",fn:function(e){return[r("q-tr",{attrs:{props:e}},[r("q-td",[r("q-btn",{attrs:{to:"/todo-list/"+e.row._id}},[t._v("Todos")])],1),r("q-td",{key:"title",attrs:{props:e}},[t._v("\n          "+t._s(e.row.title)+"\n          "),r("q-popup-edit",{attrs:{title:"Update Title",buttons:""},on:{save:function(r){return t.updateTodoList(e.row._id,e.row.title)}},model:{value:e.row.title,callback:function(r){t.$set(e.row,"title",r)},expression:"props.row.title"}},[r("q-input",{attrs:{dense:"",autofocus:"",counter:""},model:{value:e.row.title,callback:function(r){t.$set(e.row,"title",r)},expression:"props.row.title"}})],1)],1),r("q-td",{key:"createdAt",attrs:{props:e}},[r("div",{staticClass:"text-pre-wrap"},[t._v("\n            "+t._s(new Date(e.row.createdAt).toLocaleTimeString())+"\n          ")])]),r("q-td",{key:"updatedAt",attrs:{props:e}},[t._v("\n          "+t._s(new Date(e.row.updatedAt).toLocaleTimeString())+"\n        ")]),r("q-td",{key:"delete",attrs:{props:e}},[r("q-btn",{attrs:{round:"",color:"negative",icon:"delete"},on:{click:function(r){return t.deleteTodoList(e.row._id)}}})],1)],1)]}}])})],1)},o=[],a=(r("a434"),r("e6cf"),r("ddb0"),r("c973")),i=r.n(a),s=(r("446a"),r("2c7e")),d={data(){return{addTitle:"",addPassword:"",newPassword:"",newTitle:"",filter:"",loading:!1,pagination:{sortBy:"desc",descending:!1,page:1,rowsPerPage:5,rowsNumber:0},users:[],selected:[],columns:[{name:"seeTodos",label:"See todos",field:"seeTodos",align:"left"},{name:"title",required:!0,label:"Title",align:"left",field:t=>t.name,format:t=>""+t,sortable:!0},{name:"createdAt",label:"CreatedAt",field:"createdAt",sortable:!0,style:"width: 10px"},{name:"updatedAt",label:"UpdatedAt",field:"updatedAt",sortable:!0},{name:"delete",label:"Delete",field:"delete"}]}},methods:{onRequest(t){var e=this;return i()((function*(){const{page:r,rowsPerPage:n,sortBy:o,descending:a}=t.pagination,i=t.filter;e.loading=!0;const s=0===n?e.pagination.rowsNumber:n,d=yield e.fetchFromServer(a,r,s,o,i);e.pagination.rowsNumber=d.count;const l=d.data;e.users.splice(0,e.users.length,...l),e.pagination.page=r,e.pagination.rowsPerPage=n,e.pagination.sortBy=o,e.pagination.descending=a,e.loading=!1}))()},fetchFromServer(t,e,r,n,o){return i()((function*(){let a=0;return a=(e-1)*r,yield s["a"].getTodoLists(t,a,r,n,o)}))()},deleteTodoList(t){var e=this;return i()((function*(){yield s["a"].deleteTodoList(t),yield e.onRequest({pagination:e.pagination,filter:e.filter})}))()},updateTodoList(t,e){var r=this;return i()((function*(){let n={title:e};return yield s["a"].updateTodoList(n,t),yield r.onRequest({pagination:r.pagination,filter:r.filter}),!0}))()},addTodoList(){var t=this;return i()((function*(){let e=yield t.createRules(t.newTitle);if(e){let e={title:t.addTitle};yield s["a"].createTodoList(e),t.addTitle="",t.$refs.addTitle.blur(),t.$refs.addTitle.resetValidation(),yield t.onRequest({pagination:t.pagination,filter:t.filter})}}))()},createRules(t){return i()((function*(){return new Promise((e,r)=>{e(!!t||"Please type something")})}))()}},mounted(){this.onRequest({pagination:this.pagination,filter:this.filter})}},l=d,c=r("2877"),u=r("eaac"),p=r("27f9"),f=r("0016"),y=r("0378"),g=r("9c40"),b=r("bd08"),m=r("357e"),h=r("db86"),T=r("42a1"),w=r("eebe"),$=r.n(w),q=Object(c["a"])(l,n,o,!1,null,null,null);e["default"]=q.exports;$()(q,"components",{QTable:u["a"],QInput:p["a"],QIcon:f["a"],QForm:y["a"],QBtn:g["a"],QTr:b["a"],QTh:m["a"],QTd:h["a"],QPopupEdit:T["a"]})}}]);