var rp = require('request-promise');
var Promise = require('bluebird');

module.exports = {
  query : function(sql) {
    // Making the assumption for now that no destructive queries are allowed
    if (sql.match(/DELETE/i) || sql.match(/UPDATE/i) || sql.match(/DROP/i) || sql.match(/TRUNCATE/i) || sql.match(/ALTER/i) || sql.match(/CREATE/i)) {
      return Promise.reject('Invalid query');
    }
    else {
      var query = encodeURIComponent(sql);
      var url = "https://" + sails.config.cartodb.account.user + ".cartodb.com/api/v2/sql?q=" + query + "&api_key=" + sails.config.cartodb.account.apiKey;
      
      return rp(url);
    }
  }
}