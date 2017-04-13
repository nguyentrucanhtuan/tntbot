#!/usr/bin/env node

"use strict";
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');

const port = process.env.PORT || 5000;
const Config = require('./const.js');
const WooAPI = require('./wooapi.js')
const wooAPI = new WooAPI();
const BotActions = require('./botactions.js')
const Botly = require("botly");
const botly = new Botly({
    verifyToken: Config.FB_VERIFY_TOKEN,
    accessToken: Config.FB_PAGE_TOKEN
});

const botActions = new BotActions();

let Wit = null;
let log = null;
Wit  = require('node-wit').Wit;
log =  require('node-wit').log;
const sessions = {};
const users = [];
const findOrAddUser = (fbid) => {
  if(users.indexOf(fbid) == -1){
    users.push(fbid);
  }
}
const findOrCreateSession = (fbid) => {
  findOrAddUser(fbid);
  let sessionId;
  // Let's see if we already have a session for the user fbid
  Object.keys(sessions).forEach(k => {
    if (sessions[k].fbid === fbid) {
      // Yep, got it!
      sessionId = k;
    }
  });
  if (!sessionId) {
    // No session found for user fbid, let's create a new one
    sessionId = new Date().toISOString();
    sessions[sessionId] = {fbid: fbid, context: {}};
  }
  return sessionId;
};

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};



const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const recipientId = sessions[sessionId].fbid;
    const {text, quickreplies} = response;
    let quick_replies = [];
    if(quickreplies){
      quick_replies = quickreplies.map(function(x){
        return botly.createQuickReply(x,"empty");
      });
    }
    return new Promise(function(resolve, reject) {
        console.log('user said...', request.text);
        console.log('sending...', JSON.stringify(response));
        if(quick_replies.length > 0){
          botly.sendText({id: recipientId, text: text, quick_replies: quick_replies}, function (err, data) {
          //log it
            console.log(err);
          });
        }else{
          botly.sendText({id: recipientId, text: text}, function (err, data) {
          //log it
            console.log(err);
          });
        }

        return resolve();
    });
  },
  menuHelp : menuHelp,
  fetchProduct: fetchProduct,
  sendProductBubble: sendProductBubble,
  merge: merge,
  fetchProductInCategory: fetchProductInCategory,
  sendProductsList: sendProductsList,
  congthuccafetruyenthong: sendcongthuccafetruyenthong,
  congthuctrasua: sendcongthuctrasua,
  congthuccafedaxay: sendcongthuccafedaxay,
  congthucphasinhto: sendcongthucphasinhto,
  congthuctradao: sendcongthuctradao,
  congthucsoda: sendcongthucsoda

  // You should implement your custom actions here
  // See https://wit.ai/docs/quickstart
};


// Setting up our bot
const wit = new Wit({
  accessToken: Config.WIT_TOKEN,
  actions,
  logger: new log.Logger(log.INFO)
});


function witRunAction(sessionId,message){
  wit.runActions(
             sessionId, // the user's current session
             message, // the user's message
             sessions[sessionId].context // the user's current session state
           ).then((context) => {
             // Our bot did everything it has to do.
             // Now it's waiting for further messages to proceed.
             console.log('Waiting for next user messages');

             // Based on the session state, you might want to reset the session.
             // This depends heavily on the business logic of your bot.
             // Example:
             // if (context['done']) {
             //   delete sessions[sessionId];
             // }

             // Updating the user's current session state
             sessions[sessionId].context = context;
           })
           .catch((err) => {
             console.error('Oops! Got an error from Wit: ', err.stack || err);
           })
}






function merge({context,entities}){
  var category = firstEntityValue(entities, 'loai_san_pham');
  if (category) {
    context.category = category;
  }
  return context;
}

function fetchProduct({sessionId, context, entities}) {
  return new Promise(function(resolve, reject) {
    var product = firstEntityValue(entities, 'san_pham');
    console.log(product);
    delete context.product;
    delete context.missingProduct;
    if (product) {
      wooAPI.productsPriceByName(product).then(function(data){
          context.product = data[0];
          context.productInfo = data[0].name + ' giá '+data[0].price +' VNĐ';
          return resolve(context);
      })
    }else{
      context.missingProduct = true;
      return resolve(context);
    }
  });

}

function sendProductBubble({sessionId, context, entities}) {
  const recipientId = sessions[sessionId].fbid;
  let product = context.product ;
  botActions.sendProduct(recipientId,product);
}



function fetchProductInCategory({sessionId, context, entities}){
  return new Promise(function(resolve, reject) {
    var category = context.category;
    console.log(category);
    delete context.products;
    delete context.not_found;
    wooAPI.productsByKeyword(category).then(function(products){
       console.log(products)
        if(products.length > 0){
          context.products = products;
          return resolve(context);
        }else{
          context.not_found = true;
          return resolve(context);
        }
    });
  });

}

function sendProductsList({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  let products = context.products ;
  botActions.sendListProducts(recipientId,products);
}


function sendcongthuccafetruyenthong({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
 //const callback = witRunAction(sessionId,'Hướng dẫn pha chế')
botActions.sendCTCafeTruyenThong(recipientId);
}

function sendcongthuctrasua({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  //const callback = witRunAction(sessionId,'Hướng dẫn pha chế')
  botActions.sendCTCafeTruyenThong(recipientId);
}

function sendcongthuccafedaxay({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  //const callback = witRunAction(sessionId,'Hướng dẫn pha chế')
  botActions.sendCTCafeTruyenThong(recipientId);
}

function sendcongthucphasinhto({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  //const callback = witRunAction(sessionId,'Hướng dẫn pha chế')
  botActions.sendCTCafeTruyenThong(recipientId);
}

function sendcongthucsoda({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  ///const callback = witRunAction(sessionId,'Hướng dẫn pha chế')
    botActions.sendCTCafeTruyenThong(recipientId);
}


function sendcongthuctradao({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  //const callback = witRunAction(sessionId,'Hướng dẫn pha chế')
  botActions.sendCTCafeTruyenThong(recipientId);
}


function menuHelp({sessionId, context, entities}){
  const recipientId = sessions[sessionId].fbid;
  console.log('menuHelp');
  botActions.sendMenuHelp(recipientId)
}





var app = express();



botly.on('message', (sender, message, data) => {
    console.log("message:", sender, message, data);
    let text = data.text;
    const sessionId = findOrCreateSession(sender);

    wit.runActions(
               sessionId, // the user's current session
               text, // the user's message
               sessions[sessionId].context // the user's current session state
             ).then((context) => {
               // Our bot did everything it has to do.
               // Now it's waiting for further messages to proceed.
               console.log('Waiting for next user messages');

               // Based on the session state, you might want to reset the session.
               // This depends heavily on the business logic of your bot.
               // Example:
               // if (context['done']) {
               //   delete sessions[sessionId];
               // }

               // Updating the user's current session state
               sessions[sessionId].context = context;
             })
             .catch((err) => {
               console.error('Oops! Got an error from Wit: ', err.stack || err);
             })
    /*if (users[sender]) {


    }
    else {
        botly.getUserProfile(sender, function (err, info) {
            users[sender] = info;

            botly.sendText({id: sender, text: `${text} ${users[sender].first_name}`}, function (err, data) {
                console.log("send text cb:", err, data);
            });
        });
    }*/
});



botly.on('postback', (sender, message, postback) => {
   console.log(message);
   const sessionId = findOrCreateSession(sender);
   if(message.message && message.message.quick_reply.payload == 'empty'){

     wit.runActions(
                sessionId, // the user's current session
                message.message.text, // the user's message
                sessions[sessionId].context // the user's current session state
              ).then((context) => {
                // Our bot did everything it has to do.
                // Now it's waiting for further messages to proceed.
                console.log('Waiting for next user messages');

                // Based on the session state, you might want to reset the session.
                // This depends heavily on the business logic of your bot.
                // Example:
                // if (context['done']) {
                //   delete sessions[sessionId];
                // }

                // Updating the user's current session state
                sessions[sessionId].context = context;
              })
              .catch((err) => {
                console.error('Oops! Got an error from Wit: ', err.stack || err);
              })
   }else if(postback && postback.indexOf("PRODUCT_BY_CATEGORY_") !== -1){
       let categoryId = parseInt(postback.replace('PRODUCT_BY_CATEGORY_',''))
       //botActions.sendProducts(sender,categoryId,() => botActions.sendCategoriesList(sender));
       botActions.sendProducts(sender,categoryId);
  }else if(postback && postback.indexOf("BUY_PRODUCT_BY_ID_") !== -1){
      let productId = parseInt(postback.replace('BUY_PRODUCT_BY_ID_',''))
      console.log(productId)
      botly.sendText({id: sender, text: 'Cảm ơn bạn đã mua sản phẩm'}, function (err, data) {
      //log it
        console.log(err);
      });
      //botActions.sendProducts(sender,categoryId);
  }else if(postback && postback.indexOf("ADD_WISHLIST_PRODUCT_") !== -1){
      let productId = parseInt(postback.replace('ADD_WISHLIST_PRODUCT_',''))
      wooAPI.addWishListItem(productId).then(function(result){
        console.log(result);
        botly.sendText({id: sender, text: 'Cảm ơn bạn đã yêu thích sản phẩm'}, function (err, data) {
        //log it
          console.log(err);
        });
      });

      //botActions.sendProducts(sender,categoryId);
  }
  else{
      switch (postback) {
  			case 'start_shopping':
  				botActions.sendCategoriesList(sender)
  				break;

        case 'show_my_wishlist':
          botActions.sendMyWishlist(sender)
          break;
        case 'show_buy_link':
    			botActions.sendBuyLink(sender)
    			break;
        case 'show_what_you_need':
            botActions.sendWhatYouNeed(sender)
            break;
        case 'huong_dan_pha_che':
            witRunAction(sessionId, 'Hướng Dẫn Pha Chế')
          break;
  		}
    }

    //console.log("postback:", sender, message, postback);
});

botly.on('delivery', (sender, message, mids) => {
    //console.log("delivery:", sender, message, mids);
});

botly.on('optin', (sender, message, optin) => {
    console.log("optin:", sender, message, optin);
});

botly.on('error', (ex) => {
    console.log("error:", ex);
});

var pageId = '1514795795429764'
if (pageId) {
    botly.setGetStarted({pageId: pageId, payload: "GET_STARTED_CLICKED"}, (err, body) => {
	    console.log("set get started cb:", err, body);
   });
		var call_to_actions = [
        botly.createPostbackButton('Hướng dẫn TNT DRINK', 'show_what_you_need'),
				botly.createPostbackButton('Bắt đầu Mua sắm', 'start_shopping'),
        botly.createPostbackButton('Công thức pha chế', 'huong_dan_pha_che'),
        //botly.createPostbackButton('Danh sách thường mua', 'show_my_wishlist'),
        //botly.createWebURLButton('Danh sách thường mua', 'https://goo.gl/Vm6pQY'),
        //botly.createPostbackButton('Đặt hàng nhanh', 'show_buy_link'),
        //botly.createWebURLButton('Đặt hàng nhanh', 'https://goo.gl/g7RI0X'),
        //botly.createWebURLButton('Công thức pha chế', 'http://nguyenlieuphache.com/cong-thuc-pha-che'),

		];
/*
    botly.setPersistentMenu({pageId: pageId, buttons: buttons}, function (err, body) {
        console.log("persistent menu cb:", err, body);
    })*/
	
   botly.setPersistentMenu({
    pageId: pageId, 
    menu: [
            {
               "locale":"default",
               "composer_input_disabled":true,
               "call_to_actions": call_to_actions
             },
             {
               "locale":"vi_VN",
               "composer_input_disabled":false
             }
           ]}, (err, body) => {
    //log it
	   console.log("welcome cb:", err, body);
});
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/webhook', botly.router());


app.post('/scheduler',function(req, res) {
  console.log(req.body);
  console.log(users);
  let message = req.body.message;

  users.forEach(function(user){
      botly.sendText({id: user, text: message}, function (err, data) {

      });

      if(req.body.use_attachment){
        botly.sendAttachment({
          id: user,
          type: req.body.attachment.type,
          payload: req.body.attachment.payload
        }, (err, data) => {
              //log it
        });
      }

      if(req.body.send_template){
        // send template after text
        console.log('sen template')
        if(req.body.template_type == 'generic'){
          botly.sendGeneric({id: user, elements: req.body.generic_elements}, (err, data) => {
              console.log(err);
              console.log(data);
          });
        }else{
          botly.sendList({id: user, elements: req.body.list_elements}, (err, data) => {
              console.log("send generic cb:", err, data);
          });
        }
      }
  });

  return res.json(req.body);
})
app.set('port', port);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: {}
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

const server = http.createServer(app);

server.listen(port);
