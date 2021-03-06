export default async function admin ({ next, store }){
    await store.dispatch('checkIfLoggedIn')
    if(!store.getters.auth.isAdmin){
        return next('/todo-list')
    }
   
    return next()
}