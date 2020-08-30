export default async function guest ({ next, store }){
    await store.dispatch('checkIfLoggedIn')
    console.log('HEJSAN LOLOLOL')
    console.log(store)
    if(store.getters.auth.loggedIn){
        return next('/todos')
    }
   
    return next()
}
