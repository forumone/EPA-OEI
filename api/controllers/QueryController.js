/**
 * QueryController
 *
 * @description :: Server-side logic for managing Queries
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

module.exports = {
	query : function(req, res) {
	  // FIXME: All queries should be built on the server, this is intended only as a short-term measure
	  
	  if (_.has(req.query, 'sql')) {
	    cartodb.query(req.query.sql)
	    .then(function(result) {
	      var output = JSON.parse(result);
	      return res.json(output);
	    })
	    .catch(function(err) {
	      sails.log.error(err);
	      res.serverError();
	    });
	  }
	  else {
	    res.badRequest('Invalid parameters');
	  }
	},
	
	contains : function(req, res) {
	  // FIXME: All queries should be built on the server, this is intended only as a short-term measure
	  if (_.has(req.query, 'sql') && _.has(req.query, 'geom') && _.has(req.query, 'lng') && _.has(req.query, 'lat')) {
	    var containsCondition = "ST_Contains(" + req.query.geom +", ST_GeometryFromText('POINT(" + req.query.lng + " " 
	      + req.query.lat + ")'," + sails.config.cartodb.projection + "))";
	    
	    var sql = req.query.sql;
	    if (!sql.match(/WHERE/i)) {
	      sql += " WHERE";
	    }
	    else {
	      sql += " AND";
	    }
	    
	    sql += " " + containsCondition;
	    
	    cartodb.query(sql)
	    .then(function(result) {
	      var output = JSON.parse(result);
	      return res.json(output);
	    })
	    .catch(function(err) {
	      sails.log.error(err);
	      res.serverError();
	    });
	  }
	  else {
      res.badRequest('Invalid parameters');
    }
	}
};

