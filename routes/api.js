const express = require("express");
const router = express.Router();
var request = require("postman-request");
const dotenv = require("dotenv");
var axios = require('axios');
dotenv.config();
const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
const headers = {
  "content-type": "text/plain;"
};

var unconfirmed = 0;

router.post("/test", (req, res) => {
  res.json({
    msg: "backend works"
  })
  console.log("test");
});


//creater a new bitcoin node
router.post("/createwallet", (req, res) => {
  var wallet_name = req.body.wallet_name
  
  console.log(req);
  var dataString = `{"jsonrpc": "1.0", "id": "curltest", "method": "createwallet", "params": ["`+wallet_name+`"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  console.log("hello" + dataString);
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("voila! wallet created")
      const data = JSON.parse(body);
      res.send(data);
    }
    else {
      if (error)
        console.log(error);
      if (!error)
        console.log(response.statusCode);
    }
  };
  request(options, callback);
});
 


// gets new wallet address
router.post("/getnewaddress", (req, res) => {
  var dataString = '{"jsonrpc": "1.0", "id":"curltest", "method": "getnewaddress", "params": [] }';
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + req.body.wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  console.log("hello" + dataString);
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("voila! it worked get new address")
      const data = JSON.parse(body);
      var wallet = {
        'wallet_name': req.body.wallet_name,
        'address': data.result,
        'pubkey': "",
        "privkey": ""
      }

      var publickey = {
        method: 'post',
        url: 'http://172.105.51.235:4444/api/getaddressinfo',
        headers: {
          'Content-Type': 'application/json'
        },
        data: wallet
      };

      axios(publickey)
        .then(function (response) {
          console.log("publickey" + response.data.result.pubkey);
          wallet.pubkey = response.data.result.pubkey
          //console.log(wallet.pubkey);
          var privatekey = {
            method: 'post',
            url: 'http://172.105.51.235:4444/api/dumpprivkey',
            headers: {
              'Content-Type': 'application/json'
            },
            data: wallet
          };

          axios(privatekey)
            .then(function (response) {
              console.log("privatekey", response.data.result);
              wallet.privkey = response.data.result
              //console.log(wallet.privkey);
              res.send(wallet)
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    else {
      if (error)
        console.log(error);
      if (!error)
        console.log(response.statusCode);
    }
  };
  request(options, callback);
})  


// gives you the private key by providing address
router.post("/dumpprivkey", (req, res) => {
  var address = req.body.address
  var dataString = `{"jsonrpc":"1.0","id":"curltest","method":"dumpprivkey","params":["` + address + `"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + req.body.wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,

  };
  console.log("dumpprivkey");
  callback = (error, response, bodys) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(bodys);
      res.send(data);
    }
    else {
      console.log(error);
      if (!error)
        console.log(response.statusCode);
    }
  };
  request(options, callback);
});


//restore public key 
router.post("/getaddressinfo", (req, res) => {
  var address = req.body.address
  var dataString = `{"jsonrpc":"1.0","id":"curltest","method":"getaddressinfo","params":["` + address + `"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + req.body.wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  callback = (error, response, bodys) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(bodys);
      res.send(data);
      console.log("the public key is " + data.scriptPubKey);
    }
    else {
      console.log(error);
      if (!error)
        console.log(response.statusCode);
    }
  };
  request(options, callback);
});


//get confirmation on the basis of transactionid
router.post("/gettransaction", (req, res) => {
  var wallet_name = req.body.wallet_name
  var txid = req.body.txid
  console.log(req);
  var dataString = `{"jsonrpc":"1.0","id":"curltest","method":"gettransaction","params":["`+txid+`"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  console.log("hello" + dataString);
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("voila! it worked gettarnsaction")
      const data = JSON.parse(body);
      res.send(data);
    }
    else {
      if (error)
        console.log(error);
      if (!error)
        console.log(response.statusCode);
    }

  };
  request(options, callback);
});

//encrypt the wallet with passphrase 
router.post("/encryptwallet", (req, res) => {
  var wallet_name = req.body.wallet_name
  var passphrase = req.body.passphrase
  console.log(req);
  var dataString = `{"jsonrpc":"1.0","id":"curltest","method":"encryptwallet","params":["`+passphrase+`"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  console.log("hello" + dataString);
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("voila! it worked encyptwallet")
      const data = JSON.parse(body);
      res.send(data);
    }
    else {
      if (error)
        console.log(error);
      if (!error)
        console.log(response.statusCode);
    }

  };
  request(options, callback);
});


//Stores the wallet decryption key in memory for ‘timeout’ seconds. 
router.post("/walletpassphrase", (req, res) => {
  var wallet_name = req.body.wallet_name
  var passphrase = req.body.passphrase
  console.log(req);
  var dataString = `{"jsonrpc":"1.0","id":"curltest","method":"walletpassphrase","params":["`+passphrase+`", 60]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  console.log("hello" + dataString);
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("voila! it worked walletpassphrase")
      const data = JSON.parse(body);
      res.send(data);
    }
    else {
      if (error)
        console.log(error);
      if (!error)
        console.log(response.statusCode);
    }
  };
  request(options, callback);
});


//lock your wallet 
router.post("/walletlock", (req, res) => {
  var wallet_name = req.body.wallet_name
  var passphrase = req.body.passphrase
  console.log(req);
  var dataString = `{"jsonrpc":"1.0","id":"curltest","method":"walletlock","params":[]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/wallet/` + wallet_name,
    method: "POST",
    headers: headers,
    body: dataString,
  };
  console.log("hello" + dataString);
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      console.log("voila! it worked walletlock")
      const data = JSON.parse(body);
      res.send(data);
    }
    else {
      if (error)
        console.log(error);
      if (!error)
        console.log(response.statusCode);
    }
  };
  request(options, callback);
});


module.exports = router;