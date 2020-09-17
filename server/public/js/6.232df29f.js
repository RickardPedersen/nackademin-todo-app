(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{4122:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"q-pa-md"},[r("q-table",{attrs:{title:"Users",data:e.users,columns:e.columns,"row-key":"_id","binary-state-sort":"",pagination:e.pagination,loading:e.loading,filter:e.filter},on:{"update:pagination":function(t){e.pagination=t},request:e.onRequest},scopedSlots:e._u([{key:"top-right",fn:function(){return[r("q-input",{attrs:{dense:"",debounce:"300",placeholder:"Search"},scopedSlots:e._u([{key:"append",fn:function(){return[r("q-icon",{attrs:{name:"search"}})]},proxy:!0}]),model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}})]},proxy:!0},{key:"top-left",fn:function(){return[r("div",{staticClass:"q-table__title"},[e._v("Users")]),r("q-form",{on:{submit:e.addUser}},[r("h5",{staticClass:"q-mb-sm"},[e._v("Add User")]),r("q-input",{ref:"addUsername",attrs:{dense:"",outlined:"",debounce:"300",label:"Username","lazy-rules":"ondemand",rules:[e.createRules]},model:{value:e.addUsername,callback:function(t){e.addUsername=t},expression:"addUsername"}}),r("q-input",{ref:"addPassword",attrs:{dense:"",outlined:"",debounce:"300",label:"Password","lazy-rules":"ondemand",rules:[e.createRules]},model:{value:e.addPassword,callback:function(t){e.addPassword=t},expression:"addPassword"}}),r("q-btn",{attrs:{dense:"",type:"submit"}},[e._v("Add user")])],1)]},proxy:!0},{key:"header",fn:function(t){return[r("q-tr",{attrs:{props:t}},e._l(t.cols,(function(a){return r("q-th",{key:a.name,attrs:{props:t}},[e._v("\n          "+e._s(a.label)+"\n        ")])})),1)]}},{key:"body",fn:function(t){return[r("q-tr",{attrs:{props:t}},[r("q-td",[r("q-btn",{attrs:{to:"/user/"+t.row._id}},[e._v("Todos")])],1),r("q-td",{key:"username",attrs:{props:t}},[e._v("\n          "+e._s(t.row.username)+"\n          "),r("q-popup-edit",{attrs:{title:"Change Username",buttons:""},on:{save:function(r){return e.updateTodo(t.row._id,t.row.username)}},model:{value:t.row.username,callback:function(r){e.$set(t.row,"username",r)},expression:"props.row.username"}},[r("q-input",{attrs:{dense:"",autofocus:"",counter:""},model:{value:t.row.username,callback:function(r){e.$set(t.row,"username",r)},expression:"props.row.username"}})],1)],1),r("q-td",{key:"password",attrs:{props:t}},[e._v("\n          Change Password\n          "),r("q-popup-edit",{attrs:{title:"Change Password",buttons:""},on:{save:function(r){return e.changePassword(t.row._id,e.newPassword)}},model:{value:e.newPassword,callback:function(t){e.newPassword=t},expression:"newPassword"}},[r("q-input",{attrs:{type:"password",dense:"",autofocus:"",counter:""},model:{value:e.newPassword,callback:function(t){e.newPassword=t},expression:"newPassword"}})],1)],1),r("q-td",{key:"role",attrs:{props:t}},[e._v("\n          "+e._s(t.row.role)+"\n          "),r("q-popup-edit",{attrs:{title:"Change Role",buttons:""},on:{save:function(r){return e.updateRole(t.row._id,t.row.role)}},model:{value:t.row.role,callback:function(r){e.$set(t.row,"role",r)},expression:"props.row.role"}},[r("q-input",{attrs:{dense:"",autofocus:"",counter:""},model:{value:t.row.role,callback:function(r){e.$set(t.row,"role",r)},expression:"props.row.role"}})],1)],1),r("q-td",{key:"createdAt",attrs:{props:t}},[r("div",{staticClass:"text-pre-wrap"},[e._v("\n            "+e._s(new Date(t.row.createdAt).toLocaleTimeString())+"\n          ")])]),r("q-td",{key:"updatedAt",attrs:{props:t}},[e._v("\n          "+e._s(new Date(t.row.updatedAt).toLocaleTimeString())+"\n        ")]),r("q-td",{key:"delete",attrs:{props:t}},[r("q-btn",{attrs:{round:"",color:"negative",icon:"delete"},on:{click:function(r){return e.deleteTodo(t.row._id)}}})],1)],1)]}}])})],1)},n=[],s=(r("a434"),r("e6cf"),r("ddb0"),r("c973")),o=r.n(s),i=r("446a"),d={data(){return{addUsername:"",addPassword:"",newPassword:"",newTitle:"",filter:"",loading:!1,pagination:{sortBy:"desc",descending:!1,page:1,rowsPerPage:5,rowsNumber:0},users:[],selected:[],columns:[{name:"seeTodos",label:"See todos",field:"seeTodos",align:"left"},{name:"username",required:!0,label:"Username",align:"left",field:e=>e.name,format:e=>""+e,sortable:!0},{name:"password",required:!0,label:"Password",align:"left",field:e=>e.name,format:e=>""+e},{name:"role",required:!0,label:"Role",align:"left",field:e=>e.name,format:e=>""+e},{name:"createdAt",label:"CreatedAt",field:"createdAt",sortable:!0,style:"width: 10px"},{name:"updatedAt",label:"UpdatedAt",field:"updatedAt",sortable:!0},{name:"delete",label:"Delete",field:"delete"}]}},methods:{onRequest(e){var t=this;return o()((function*(){const{page:r,rowsPerPage:a,sortBy:n,descending:s}=e.pagination,o=e.filter;t.loading=!0;const i=0===a?t.pagination.rowsNumber:a,d=yield t.fetchFromServer(s,r,i,n,o);t.pagination.rowsNumber=d.count;const l=d.data;t.users.splice(0,t.users.length,...l),t.pagination.page=r,t.pagination.rowsPerPage=a,t.pagination.sortBy=n,t.pagination.descending=s,t.loading=!1}))()},fetchFromServer(e,t,r,a,n){return o()((function*(){let s=0;return s=(t-1)*r,yield i["a"].getAllUsers(e,s,r,a,n)}))()},deleteTodo(e){var t=this;return o()((function*(){yield i["a"].deleteUser(e),yield t.onRequest({pagination:t.pagination,filter:t.filter})}))()},updateTodo(e,t){var r=this;return o()((function*(){let a={username:t};return yield i["a"].editUser(a,e),yield r.onRequest({pagination:r.pagination,filter:r.filter}),!0}))()},updateRole(e,t){var r=this;return o()((function*(){let a={role:t};return yield i["a"].editUser(a,e),yield r.onRequest({pagination:r.pagination,filter:r.filter}),!0}))()},changePassword(e,t){var r=this;return o()((function*(){let a={password:t};return yield i["a"].editUser(a,e),yield r.onRequest({pagination:r.pagination,filter:r.filter}),!0}))()},addUser(){var e=this;return o()((function*(){let t=yield e.createRules(e.newTitle);if(t){let t={username:e.addUsername,password:e.addPassword};yield i["a"].createUser(t),e.addUsername="",e.addPassword="",e.$refs.addUsername.blur(),e.$refs.addPassword.blur(),e.$refs.addUsername.resetValidation(),e.$refs.addPassword.resetValidation(),yield e.onRequest({pagination:e.pagination,filter:e.filter})}}))()},createRules(e){return o()((function*(){return new Promise((t,r)=>{t(!!e||"Please type something")})}))()}},mounted(){this.onRequest({pagination:this.pagination,filter:this.filter})}},l=d,u=r("2877"),c=r("eaac"),p=r("27f9"),f=r("0016"),w=r("0378"),m=r("9c40"),g=r("bd08"),b=r("357e"),y=r("db86"),h=r("42a1"),q=r("eebe"),v=r.n(q),P=Object(u["a"])(l,a,n,!1,null,null,null);t["default"]=P.exports;v()(P,"components",{QTable:c["a"],QInput:p["a"],QIcon:f["a"],QForm:w["a"],QBtn:m["a"],QTr:g["a"],QTh:b["a"],QTd:y["a"],QPopupEdit:h["a"]})},"446a":function(e,t,r){"use strict";var a=r("c973"),n=r.n(a),s=r("bc3a"),o=r.n(s),i=r("4360");const d=Object(i["a"])(),l=d.getters.auth.userToken||localStorage.getItem("userToken"),u="/api/users",c={headers:{Authorization:"Bearer "+l}};class p{static countUsers(e){return n()((function*(){try{const t=yield o.a.get(`${u}/count/${e}`,c),r=t.data;return r}catch(t){return console.error(t),t}}))()}static getAllUsers(e,t,r,a,s){return n()((function*(){try{const n=yield o.a.get(`${u}?descending=${e}&skip=${t}&limit=${r}&sortBy=${a}&filter=${s}`,c),i=n.data;return i}catch(n){return console.error(n),n}}))()}static getUser(e){return n()((function*(){try{const t=yield o.a.get(`${u}/${e}`,c),r=t.data;return r}catch(t){return console.error(t),t}}))()}static createUser(e){return n()((function*(){try{const t=yield o.a.post(""+u,e,c),r=t.data;return r}catch(t){return console.error(t),!1}}))()}static editUser(e,t){return n()((function*(){try{const r=yield o.a.patch(`${u}/${t}`,e,c),a=r.data;return a}catch(r){return console.error(r),!1}}))()}static deleteUser(e){return n()((function*(){try{const t=yield o.a.delete(`${u}/${e}`,c),r=t.data;return r}catch(t){return console.error(t),!1}}))()}}t["a"]=p}}]);