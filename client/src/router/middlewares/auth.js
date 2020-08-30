export default async function auth ({ next, store }){
    console.log('AUTH MIDDLE WARTE ASDLAJKS HD')
    await store.dispatch('checkIfLoggedIn')
    if(!store.getters.auth.loggedIn){
        return next('/')
    }
   
    return next()
}
