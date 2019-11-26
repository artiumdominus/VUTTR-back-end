var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database name
const dbName = 'vuttr';

// Database config
const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true }

// List
router.get('/tools', (req, res) => {
  MongoClient.connect(url, dbConfig, function (err, client) {
    if (err) throw err;
    
    const db = client.db(dbName);
    
    const tools = db.collection('tools');
    
    tools.find().toArray((err, docs) => {
      if (err) throw err; // should return fail code.
      
      res.json(reformatter(docs));
    })
  });
});

// Detail
router.get('/tools/:id', (req, res) => {
  MongoClient.connect(url, dbConfig, (err, client) => {
    if (err) throw err;
    
    const db = client.db(dbName);
    
    const tools = db.collection('tools');
    
    tools.findOne({ _id: mongo.ObjectId(req.params.id) }, (err, result) => {
      if (err) throw err; // should return fail code.
      
      res.json({
        id: result._id,
        title: result.title,
        link: result.link,
        description: result.description,
        tags: result.tags
      });
    })
  })
});

// Create
router.post('/tools', (req, res) => {});

// Update
router.put('/tools/:id', (req, res) => {});

// Delete
router.delete('/tools/:id', (req, res) => {});

function removeUnderlines(docs) {
  for (let i = 0; i < docs.length; ++i) {
    docs[i].id = docs[i]._id;
    delete docs[i]._id;
  }
  return docs;
}


// Removes the '_' from "_id" without affect the order that it appears in JSON.
function reformatter(docs) {
  let ans = [];
  
  for (let i = 0; i < docs.length; ++i) {
    ans.push({
      id : docs[i]._id,
      title : docs[i].title,
      link : docs[i].link,
      description : docs[i].description,
      tags : docs[i].tags
    });
  }
  
  return ans;
}

module.exports = router;
