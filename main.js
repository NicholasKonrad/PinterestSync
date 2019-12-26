
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let a = 0;
function log() {
    console.log(a);
    a++;
}
const CLIENT_ID = '5073108939462189118';
const CLIENT_SECRET = '958e25acf35216610e7712c3fceb98bedb040e660985a36df7f4408c3b2b69d0';

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
