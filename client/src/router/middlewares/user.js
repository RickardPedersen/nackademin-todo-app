export default async function auth ({ next, store }){
    await store.dispatch('checkIfLoggedIn')
    if(!store.getters.auth.loggedIn){
        return next('/')
    }
   
    return next()
}
