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



BotActions.prototype.sendProducts = function(sender,categoryId,callback = ()=>console.log("send products cb:")){
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
        callback()
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
  var message =  "Qúy khách có thể nhấn để xem danh sách sản phẩm thường mua và thực hiện mua hàng:";
  /*botly.sendText({id : sender, text: message}, function (err,data){

  });*

  //var message =  "Tips: Quý khách có thể lọc sản phẩm theo Danh mục sản phẩm hoặc chọn sản phẩm vào danh sách thường mua để mua nhanh lần sau";
  /*botly.sendText({id : sender, text: message}, function (err,data){

  });*/
  let buttons = []
  buttons.push(botly.createWebURLButton("Danh sách thường mua", "https://goo.gl/Vm6pQY","full"))

  botly.sendButtons({id: sender, text: message, buttons: buttons}
      , function (err, data) {
        console.log(err)
        console.log(data)
          //log it
  });
}

BotActions.prototype.sendBuyLink = function(sender){
  var message =  "Tips: Quý khách có thể lọc sản phẩm theo Danh mục sản phẩm hoặc chọn sản phẩm vào danh sách thường mua để mua nhanh lần sau";
  /*botly.sendText({id : sender, text: message}, function (err,data){

  });*/
  let buttons = []
  buttons.push(botly.createWebURLButton("Đặt hàng", "https://goo.gl/UPEuFJ","full"))

  botly.sendButtons({id: sender, text: message, buttons: buttons}
      , function (err, data) {
        console.log(err)
        console.log(data)
          //log it
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
  let help = 'Quý khách cần gì? \n'+
  'Tips: QUý khách có thể gõ trực tiếp cụm từ dưới đây đề truy cập nhanh, ví dụ "hướng dẫn pha chế" để xem các công thức pha chế. Cảm ơn^^'

  botly.sendText({id: sender, text: help, quick_replies},function (err, data) {
      console.log("send generic cb:", err, data);
  });
}

BotActions.prototype.sendCTCafeTruyenThong = function(sender,callback= ()=>console.log('gui cong thuc pha che')){
  let elements = [];

      let element1 = {
          title: 'CÁCH LÀM LATTE MACHIATO',
          image_url: 'http://nguyenlieuphache.com/wp-content/uploads/2017/01/2-17.jpg',
          subtitle: 'Latte macchiato là một loại đồ uống nóng rất được ưa chuộng. Thành phần của nó gồm có cà phê espresso và sữa',
          buttons: [
              botly.createWebURLButton("Xem Thêm", "http://nguyenlieuphache.com/cach-lam-latte-machiato.html"),
              botly.createWebURLButton("Xem thêm bài", "http://nguyenlieuphache.com/category/cong-thuc-ca-phe-nong"),
          ],

      };

     elements.push(element1)
     let element2 = {
         title: 'HOT CHOCOLATE RASPBERRY',
         image_url: 'http://nguyenlieuphache.com/wp-content/uploads/2015/10/3-7.jpg',
         subtitle: 'Sắp tới lễ rồi chắc buổi tối ở Đà Lạt cũng lạnh nhè nhẹ. Để mọi người cảm thấy ấm lòng, mình gửi tặng các bạn món Hot Chocolate Raspberry. Các chủ quán có thể chạy món này cho chương trình lễ.',
         buttons: [
             botly.createWebURLButton("Chi tiết", "http://nguyenlieuphache.com/hot-chocolate-raspberry.html"),
             botly.createWebURLButton("Xem thêm bài", "http://nguyenlieuphache.com/category/cong-thuc-ca-phe-nong"),
         ],

     };

    elements.push(element2)
    let element3 = {
        title: 'CÁCH PHA CHẾ CAPPUCCINO CREMA',
        image_url: 'http://nguyenlieuphache.com/wp-content/uploads/2017/01/2-16.jpg',
        subtitle: 'Cà phê là một trong những loại thức uống thịnh hành nhất thế giới nhưng ít khi chúng ta có dịp tìm hiểu về nó.',
        buttons: [
            botly.createWebURLButton("Chi tiết", "http://nguyenlieuphache.com/cach-pha-che-cappuccino-crema.html"),
            botly.createWebURLButton("Xem thêm bài", "http://nguyenlieuphache.com/category/cong-thuc-ca-phe-nong"),
        ],

    };

   elements.push(element3)
   let element4 = {
       title: 'CÔNG THỨC PHA CHẾ CÀ PHÊ MOCHA',
       image_url: 'http://nguyenlieuphache.com/wp-content/uploads/2017/01/2-16.jpg',
       subtitle: 'Cà phê mocha là loại đồ uống khá được ưa chuộng. Thành phần là hỗn hợp giữa cà phê và chocolate.',
       buttons: [
           botly.createWebURLButton("Chi tiết", "http://nguyenlieuphache.com/cach-pha-che-cappuccino-crema.html"),
           botly.createWebURLButton("Xem thêm bài", "http://nguyenlieuphache.com/category/cong-thuc-ca-phe-nong"),
       ],

   };

  elements.push(element4)

  botly.sendGeneric({id: sender, elements: elements},function (err, data) {
    callback();
  });
}
module.exports = BotActions;
