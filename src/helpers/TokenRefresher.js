import store from '../redux/store';
import DateHelper from './DateHelper';
import { client, verifyToken, refreshToken } from '../constants/index';

export default {
    isTokenExpired(){
        let state = store.getState();
        let tokenPayload = state.authTokenPayload;
        console.log("isTokenExpired:state", state);
        if (tokenPayload.exp == null){
            console.log("Token Expired is NULL");
            return true;
        }else if(DateHelper.isTokenExpired(tokenPayload.exp)) {
            console.log("Token is Expired");
            return true;
        }
        return false;
    },
    refreshTokenIfNeeded(dispatchSetToken, dispatchSetTokenPayload) {
        return new Promise((result, reject) => {
            let state = store.getState();
            let tokenPayload = state.authTokenPayload;
            // console.log("TokenPayload", tokenPayload);
            // if (tokenPayload == '' || tokenPayload.exp == null) {
            //     console.log("Verify Token");
            //     //need to verify
            //     const tokenString = state.authToken;
            //     client.mutate({
            //         mutation: verifyToken,
            //         variables: { token: tokenString }
            //     }).then(verifyResult => {
            //         console.log("verifyResult", verifyResult);
            //         dispatchSetTokenPayload(verifyResult);
            //         result();
            //     }).catch(error => {
            //         reject(error);
            //     });
            // }

            // console.log("TokenPayload", tokenPayload.exp);

            if (tokenPayload.exp == null || DateHelper.isTokenExpired(tokenPayload.exp)) {
                // Token expired
                console.log("Refresh Token");

                const tokenString = state.authToken;
                client.mutate({
                    mutation: refreshToken,
                    variables: { token: tokenString }
                }).then(refreshResult => {
                    console.log( "TokenRefresher refreshResult:"+JSON.stringify(refreshResult))
                    dispatchSetToken(refreshResult);
                    result();
                }).catch(error => {
                    reject(error);
                });
            } else {
                console.log("Token ok");
                result(null);
            }
        });
    }
};