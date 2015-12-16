/**
 * ContentController
 *
 * @description :: Server-side logic for managing Contents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

function getContent(req, res) {
  res.view(req.params.page, {
    layout: null
  });
}

module.exports = {
  getContent : getContent 
};

