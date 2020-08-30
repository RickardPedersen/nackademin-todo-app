export default async function guest ({ next, store }){
    await store.dispatch('checkIfLoggedIn')
    if(store.getters.auth.loggedIn){
        return next('/todos')
    }
   
    return next()
}
