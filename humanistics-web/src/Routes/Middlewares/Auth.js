const Auth = {
   
    IsLogged: () => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('rol') === null || sessionStorage.getItem('token') === undefined || sessionStorage.getItem('rol') === undefined)
            return false;
        return true;
    }
};



export default Auth;
