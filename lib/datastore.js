var DataStore = require('./redis_connect.js')

module.exports = new DataStore();

/**
 * Store data in redis
 * @param {string} id 
 * @param {string} key 
 * @param {string} value 
 */
DataStore.prototype.upsert = function(id, key, value) {
  return new Promise((resolve, reject) => {
    this.client.hset(
      id,
      key,
      JSON.stringify(value),
      function(err) {
        if (err) {
          reject('Failed to store data in redis: ' + err);
        }
        resolve();
      }
    );
  });
};


/**
 * Remove data from redis
 * @param {string} id 
 * @param {string} key 
 */
DataStore.prototype.remove = function(id, key) {
  return new Promise((resolve, reject) => {
    this.client.hdel(
      id,
      key,
      function(err) {
        if (err) {
          reject('Failed to remove data in redis: ' + err);
        }
        resolve();
      }
    );
  });
};

/**
 * Get data from redis
 * @param {string} id 
 */
DataStore.prototype.list = function(id) {
  return new Promise((resolve, reject) => {
    this.client.hgetall(id, function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};


/**
  * Adds a user to list with their connection ID
  *
  * @param {string} key - The ID of the connection
  * @param {object} member - user in the connection
**/
DataStore.prototype.addToList = function(key, member) {
  return new Promise((resolve, reject)=>{
    this.client.sadd(key, member, (err, res)=>{
      if(err){
        reject( 'Failed to add member to key' + err);
      }else{
        resolve(res);
      }
    })
  })
};

/**
*  Retrives all users in the key
* @params {string} key
**/

DataStore.prototype.getList = function(key){
  console.log("Key ", key)
return new Promise((resolve, reject)=>{
  this.client.smembers(key, (err, list)=>{
    if(err){
      reject(err);
    }else{
      resolve(list);
    }
  })
})
};

/**
 * Check if member of set
 * @param {string} key
 * @param {string} member
 */

 DataStore.prototype.isMemOfList = function (key, item){
   return Promise((resolve, reject)=>{
      this.client.sismember(key, item, (err, resp)=>{
        if(err)
        reject(err);
        else
        resolve(resp);
      })
   })
 }

/**
 * Remove element from set
 * @param {string} key
 * @param {string} element to remove
 */

 DataStore.prototype.removeFromList = function (key, item){
   return new Promise((resolve, reject)=>{
     this.client.srem(key, item, (err, resp)=>{
       if(err)
       reject(err);
       else
       resolve(resp);
     })
   })
 }

 /**
  * Delete keys
  * @param {string} key
  */

  DataStore.prototype.delKey = function (key){
    return new Promise((resolve, reject)=>{
      this.client.del(key, (err, resp)=>{
        if(err){
          reject(err)
        }else{
          resolve(resp)
        }
      })
    })
  }
