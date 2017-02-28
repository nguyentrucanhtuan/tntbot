const WooAPI = require('./wooapi.js')
const wooAPI = new WooAPI();
const Config = require('./const.js');
const Botly = require("botly");




const botly = new Botly({
    verifyToken: Config.FB_VERIFY_TOKEN,
    accessToken: Config.FB_PAGE_TOKEN
});



function BotActions() {
    if (!(this instanceof BotActions)) {
        return new BotActions();
    }
}

BotActions.prototype.sendCategoriesList = function(sender){
  wooAPI.getCategories().then(function (categories){
    console.log(sender)
    let quick_replies = []

    categories.map(function(category){
        let quick_reply = botly.createQuickReply(category.name,"PRODUCT_BY_CATEGORY_"+category.id);
       quick_replies.push(quick_reply)
    })


    botly.sendText({id: sender, text: "TnTDrink cung cấp các sản phẩm sau:", quick_replies},function (err, data) {
        console.log("send generic cb:", err, data);
    });
  })

};

BotActions.prototype.sendCategoriesQuickReply = function(sender){
  wooAPI.getCategories().then(function (categories){
    console.log(sender)
    let elements = []
    categories.map(function(category){
        let element = {
            title: category.name,
            image_url: category.image.src,
            subtitle: category.description,
            buttons: [
                botly.createPostbackButton("Chọn "+category.name, "PRODUCT_BY_CATEGORY_"+category.id)
            ],

        };

       elements.push(element)
    })


    botly.sendGeneric({id: sender, elements: elements},function (err, data) {
        console.log("send generic cb:", err, data);
    });
  })

};



BotActions.prototype.sendProducts = function(sender,categoryId){
  wooAPI.productsByCategoryId(categoryId,5).then(function(products){
    let elements = [];
    products.map(function(product){
        let element = {
            title: product.name,
            image_url: product.images[0].src,
            subtitle: product.short_description,
            buttons: [
                botly.createWebURLButton("Mua", "http://tnt-react.herokuapp.com/products/"+product.id),
                botly.createPostbackButton("Thêm vào wishlist", "ADD_WISHLIST_PRODUCT_"+product.id)
            ],

        };

       elements.push(element)
    });

    botly.sendGeneric({id: sender, elements: elements},function (err, data) {
        console.log("send generic cb:", err, data);
    });
  })


}

BotActions.prototype.sendProduct = function(sender,product){
    let element = {
      "title": product.name,
      "image_url": product.images[0].src,
      "subtitle": product.short_description,
      "buttons": [
        {
          "type": "postback",
          "title": "Mua",
          "payload": "BUY_PRODUCT_BY_ID_"+product.id
        }
      ]
    };

    botly.sendGeneric({id: sender, elements: element},function (err, data) {
        console.log("send generic cb:", err, data);
    });
}

BotActions.prototype.sendCoffeeList = function(sender){
  wooAPI.productsByCategoryId(86,4).then(function(products){
    let elements = []
    products.map(function(product){
      let element = botly.createListElement({
                      title: product.name,
                      image_url: product.images[0].src,
                      subtitle: 'Giá: '+product.price + ' VNĐ',
                      buttons: [
                          {title: "Mua", payload: "BUY_PRODUCT_BY_ID_"+product.id},
                      ],
                      default_action: {
                          "url": "http://tnt-react.herokuapp.com/products/"+product.id,
                      }
                    });
      elements.push(element)
    })

    botly.sendList({id: sender, elements: elements, buttons: botly.createWebURLButton("Xem tất cả", "https://tnt-react.herokuapp.com/categories/86"), top_element_style: Botly.CONST.TOP_ELEMENT_STYLE.LARGE},function (err, data) {
        console.log("send list cb:", err, data);
    });
  });
}

BotActions.prototype.sendListProducts = function(sender,products){
    let elements = [];
    products.map(function(product){
        let element = {
            title: product.name,
            image_url: product.images[0].src,
            subtitle: product.short_description,
            buttons: [
                botly.createWebURLButton("Mua", "http://tnt-react.herokuapp.com/products/"+product.id),
                botly.createPostbackButton("Thêm vào wishlist", "ADD_WISHLIST_PRODUCT_"+product.id)
            ],

        };

       elements.push(element)
    });

    botly.sendGeneric({id: sender, elements: elements},function (err, data) {
        console.log("send generic cb:", err, data);
    });
}


BotActions.prototype.sendMyWishlist = function(sender){
  var message =  "Qúy khách có thể vào đường dẫn sao để xem danh sách sản phẩm thường mua và thực hiện mua hàng:</br> https://goo.gl/Vm6pQY";
  botly.sendText({id : sender, text: message}, function (err,data){

  });
}

BotActions.prototype.sendTips = function(sender){
  let tipsSearch = " - Gõ \"tìm kiếm: cafe nguyên chất\" để tìm kiếm cafe nguyên chất.";

  let tipsShowBlog = 'Gõ "Kho công thức" để xem các bài hướng dẫn pha chế';

  let tipsBankAccount ='Gõ ngân hàng ';

  let tipsContact= "";

  var message =  "Quý khách có thể thực hiện các lệnh sau: \n"+ tipsSearch;
  botly.sendText({id : sender, text: message}, function (err,data){

  });
}

BotActions.prototype.sendWhatYouNeed = function(sender){
  let quick_replies = [
    botly.createQuickReply('Hướng dẫn pha chế','empty'),
    botly.createQuickReply('Tài Khoản Ngân Hàng','empty'),
    botly.createQuickReply('Địa chỉ shop','empty'),
    botly.createQuickReply('Đặt Hàng','empty'),
    botly.createQuickReply('Tìm sản phẩm','empty')
  ];

  botly.sendText({id: sender, text: "bạn cần gì?:", quick_replies},function (err, data) {
      console.log("send generic cb:", err, data);
  });
}
module.exports = BotActions;
