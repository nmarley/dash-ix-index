var fs = require('fs')
var io = require('socket.io-client')
var util = require('util')

function time() {
  return Math.floor( new Date() / 1000 );
}

// express
var express = require('express')
var app     = express()
var levelup = require('levelup')

var insight_url = process.env.INSIGHT_DASH_URL
if ( !insight_url ) {
  console.error("Please set INSIGHT_DASH_URL env variable and run again (e.g. INSIGHT_DASH_URL=http://insight-dash.somethingcom node index)")
  process.exit(1)
}

var insight_leveldb_location = process.env.IXINDEX_DB || process.env.HOME + '/.ixindex'
var insight_network = process.env.INSIGHT_NETWORK || 'mainnet'
console.log('Insight network is ' + insight_network)

// the idiots who deprecated fs.exists should be fonged
if ( ! fs.existsSync( insight_leveldb_location ) ) {
    fs.mkdirSync( insight_leveldb_location, 0755 )
}

var stats = fs.statSync( insight_leveldb_location )
var db = levelup( insight_leveldb_location + '/' + insight_network )

var socket = io( insight_url )
var room = 'inv'

// TODO: extract this to config.js
var default_ports = { 'mainnet': 3000, 'testnet': 3001 }
var defaultPort = default_ports[ insight_network ]
var port = process.env.IXINDEX_PORT || defaultPort

// TODO: refactor routes (extract to routes.js?)
//
app.get('/ixlist', function (req, res) {
  send_ix_list(res)
})

// /^\/is_ix\/([^\\/]+?)(?:\/(?=$))?$/i
app.get('/is_ix/:txid', function (req, res) {
  is_ix(req.params.txid, res)
})


app.listen(port, function() {
  console.log('Dash IX Index started')

  socket.on('connect', function() {
    // join the room
    socket.emit('subscribe', room)
    console.log("joined the room [" + room + "]")
  }).on('tx', function(data) {
    // do nothing, as this is an IX index only...
  }).on('ix', function(data) {
    console.log("New IX received: " + data.txid)

    var key = data.txid
    var value = time()
    db.put(key, value, function (err) {
      if (err) return console.error('Oops!', err) // i/o error
      console.log('Added txid [' + key + '] to IX index')
    })
  })
})


// return a list of txids with IX locks
function send_ix_list(res) {
  var list = []

  db.createReadStream().on('data', function (data) {
    var txid = data.key;
    var created_at = data.value;

    list.push( txid )

    var expires_at = parseInt(created_at, 10) + (60 * 60 * 2)
    var now = time()

    if ( now > expires_at ) {
      // Masternode-level IX lock should be cleared by this point
      db.del(txid, function (err) {
        if ( err ) { console.error( "Oops! Can't delete txid [" + txid + "] ", err ) }
      })
    }

  }).on('end', function () {
    return res.json(list)
  })
}

// return true if txid found in index...
function is_ix(txid, res) {
  db.get(txid, function(err, value) {
    if ( err ) {
      if ( err.notFound) {
        return res.json(false)
      }
      else {
        // return callback(err)
        return res.json(false) // why not? /s
      }
    }
    return res.send(true)
  })
}

