
function clean(site, obj) {
  for(i in obj) {
    obj[i] = obj[i].trim();
    console.log(obj[i]);
  }

}

// parses the data retrieved
function processResults(site, obj) {
  var output;
  if(site == 'amazon') {
    output = JSON.parse(JSON.stringify(obj));
    clean(site, output);
  }
  if(site == 'walmart') {
    output = JSON.parse(obj);
    console.log(theResult['adContextJSON']['price']);
  }
  return output;
}


// for (var i; i < url.length; i++) {
function amazonParse (url) {
  x(url[2], '.a-container', {
      title: '#productTitle',
      image: '#imgTagWrapperId img@data-old-hires',
      listing_price: '.a-text-strike',
      our_price: '#priceblock_ourprice',
      sale_price: '#priceblock_saleprice'
    }).(function(err, obj){
    // console.log(obj);
    // console.log('=====');
    if(err) console.log(err);
    return processResults('amazon', obj);
  })
}

function walmartParse (url) {
  x(url[4], 'head', {
      json: 'script#tb-djs-wml-base',
    })(function(err, obj){
    // console.log('Received values:');
    // console.log(obj);
    // console.log('Returning values:');
    // console.log(obj['json']);
    if(err) console.log(err);
    return processResults('walmart', obj['json']);
  })
}

function isFrom(urlStr, siteName) {
  return (urlStr.indexOf(siteName) != -1);
}

function ParseURL(url) {
  var output = -1;
  if(url.isFrom('amazon.com')) {
    console.log('from amazon');
    amazonParse(url);
  } else if(url.isFrom('walmart.com')) {
    console.log('from walmart');
    walmartParse(url);
  }
  return output;
}


var Parse = function (url) {
  this.result = ParseURL(url)
};


module.exports = Parse;
