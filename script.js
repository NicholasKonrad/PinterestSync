
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let a = 0;
function log() {
    console.log(a);
    a++;
}
const CLIENT_ID = <CLIENT_ID here>;
const CLIENT_SECRET = <CLIENT_SECRET here>;

var AuthCodeReq = new XMLHttpRequest();
var auth_url=`https://api.pinterest.com/oauth/?
                response_type=code&
                redirect_uri=https://pinterest.com/&
                client_id=${CLIENT_ID}&
                scope=read_public,write_public,read_private,write_private&
                state=787878`;

var AccessTokenReq = new XMLHttpRequest();
var access_url=`https://api.pinterest.com/v1/oauth/token?
                grant_type=authorization_code&
                client_id=${CLIENT_ID}&
                client_secret=${CLIENT_SECRET}&
                code=${AuthCodeReq.responseText}`;

var promise = new Promise(
    function(resolve, reject) {
        AuthCodeReq.open("GET", auth_url);
        AuthCodeReq.send();
        AuthCodeReq.onreadystatechange = (e) => {
            resolve(AuthCodeReq.responseText);
            console.log(AuthCodeReq.responseText);
        }
    }).then(function(result) {
        AccessTokenReq.open("POST", access_url);
        AccessTokenReq.send();
        AccessTokenReq.onreadystatechange = (e) => {
            console.log(AccessTokenReq.responseText);
            return AccessTokenReq.responseText;
        }
})
