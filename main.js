//unnix / linux : cron (intervalle)


const CLIENT_ID = '5073108939462189118';
const CLIENT_SECRET = '958e25acf35216610e7712c3fceb98bedb040e660985a36df7f4408c3b2b69d0';
const ACCESS_TOKEN = `AhskbdzzPq9SI1ejfs1MRMSt4yL2Fem9-KJV_JFGZ02zs4CgPgbgADAAAOGZRnYOTIUAzkUAAAAA`;
const BASE_URL = 'https://api.pinterest.com/v1/';

var fs = require('fs');
var https = require('https');
const fetch = require('node-fetch');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var pinterest = require('pinterest-node-api')(ACCESS_TOKEN);
pinterest.setUserToken(ACCESS_TOKEN);
var cursor_next;
var blob_imgURL;


///////////////////////////////////////////////////////////////////////////
function saveImageToDisk(url, board, imagename) {
  console.log(url);
  !fs.existsSync(imageSavePath) && fs.mkdirSync(imageSavePath);
  var writeStream = fs.createWriteStream('E:/Content/Graphics/Pictures/Pinterest/' + String(board) + '/' + String(imagename) + '.jpg');
  var request = https.get(url, response => { 
    response.pipe(writeStream); 
  });
}


function getImageBlobURL(pathToImage) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', pathToImage);
  xhr.responseType = 'arraybuffer';
  xhr.onload = (e) => {
    var blob = new Blob([xhr.response]);
    var blob_imgURL = URL.createObjectURL(blob);
    console.log(blob_imgURL);
    if (e) console.log(e);
  }
  return blob_imgURL;
}
// getImageBlobURL('./kidcudi.jpg');


function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap, 'base64').toString('base64');
}


function getDirLength(dir, callback) {
  let dir_length;
  callback = function() {
    console.log(dir_length);
    // return dir_length;
  };
  fs.readdir(dir, (err, files) => {
    if (err) throw err;
    dir_length = files.length;    //wie kann ich dir_length wieder zurückgeben lassen?
    if (typeof callback  == 'function') callback();
  });
  
}
// getDirLength('E:/Content/Video');


///////////////////////////////////////////////////////////////////////////
var requestPins = async function () {
  try {
    let data = {'fields': "id, board, image, media"};
    let response = await pinterest.users.getUserPins(data);    
    if (response.message == 'You have exceeded your rate limit. Try again later.') { console.log(response); return; }
    
    cursor_next = response.page.next;

    for (let i = 0; i < response.data.length; i++) {
      saveImageToDisk(response.data[i].image.original.url, 
                      response.data[i].board.name, 
                      response.data[i].id);
      console.log('File ' + response.data[i].image.original.url + '\nwas saved in folder ' +  response.data[i].board.name);
      
    }
  } catch (error) {
    return;
  }
};
// requestPins();


var postPin = async function (img) {
  var data = {
    board: 'seccondorigin/newboard',
    note: 'posted by AutoSync',
    image_base64: 'data:image/jpg;base64,'+base64_encode(img),
    fields: 'media, board, image, id'
  };
  try {
    var response = await pinterest.pins.createPin(data);
    console.log(response);
  } catch (error) {
    console.log(error);
    return;
  }
};
// postPin(__dirname + '/kidcudi.jpg');


///////////////////////////////////////////////////////////////////////////
// function postImageToBoard(image, board) {
//   fetch(`https://api.pinterest.com/v1/pins/?access_token=${ACCESS_TOKEN}&fields=${encodeURIComponent('id,link,note,url,media')}&board=${String(board)}&image_base64=data:image/jpg;base64,${base64_encode(image)}&note=${encodeURIComponent('posted by AutoSync')}`, 
//     {
//       method: 'POST',
//       body: null,
//       redirect: 'error',
//       signal: null
//     }).then(
//       (res) => {
//         res.json()      
//       }
//     ).then(
//      json => console.log(json)
//   );
// }
// postImageToBoard('./kidcudi.jpg', 'newboard');
        

////dodge API rate limit (try)
// async function getBoards() {
//    return fetch(
//     'https://www.pinterest.de/resource/BoardsResource/get/?source_url=/seccondorigin/&data={"options":{"isPrefetch":false,"privacy_filter":"all","sort":"custom","field_set_key":"profile_grid_item","username":"seccondorigin","page_size":25,"group_by":"visibility","include_archived":true,"redux_normalize_feed":true},"context":{}}&_=1579610352367'
//   ).then(data => {
//     return data.json();
//   }).then(body => console.log(
//     body.resource_response.data
//   )
//   )
// }
// getBoards(); 