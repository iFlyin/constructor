import API from './Api.js';

export default {
   // geters
   HttpGet(params) {
      API().get('' + params);
   },
   // post
   HttpPost(payload) {
      API().post('', payload);
   }
}