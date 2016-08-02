/* TODO: Scrape sites:
   - Toys r Us
   - Target
   - HEB
 */

var Xray = require('x-ray');
var x = Xray();

function clean(site, obj) {
  var cleanObj = obj;
  for(i in cleanObj) {
    cleanObj[i] = cleanObj[i].trim();
    if (i) {
      if (i.indexOf('price') != -1) {
        // remove any non digit characters and '.' from price keys
        cleanObj[i] = cleanObj[i].replace(/[^0-9.]/g, '');
      }
    }
  }
  return cleanObj;
}

// parses the data retrieved
function processResults(site, obj) {
  var output;
  if (site == 'amazon' || site == 'walmart') {
    // try to set the 'price' to the retail price
    if (obj['listing_price'])
      obj['price'] = obj['listing_price'];
    else if (obj['our_price'])
      obj['price'] = obj['our_price'];
    else if (obj['sale_price'])
      obj['price'] = obj['sale_price'];
    else
      err = `Couldn't find price for ${site} url.`;

    output = JSON.parse(JSON.stringify(obj));
    output = clean(site, output);
  }
  return output;
}

/* NOTE: These values are assumed to be defined as follows and may not be accurate.
 * a-text-strike        | shown as the 'retail price' but not all items have it
 * priceblock_ourprice  | shown mostly for items sold on Amazon that are instock.
 * priceblock_saleprice | third party items or on sale_price
 */
function amazonParse (url, done) {
  x(url, '.a-container', {
      title: '#productTitle',
      image: '#imgTagWrapperId img@src',
      // image: '#imgTagWrapperId img@data-old-hires',
      listing_price: '.a-text-strike',
      our_price: '#priceblock_ourprice',
      sale_price: '#priceblock_saleprice'
    })(function(err, obj){

    obj['url'] = url;
    if (err) return done(err);
    done(null, processResults('amazon', obj))
  })
}

function walmartParse (url, done) {
  x(url, 'html', {
    title: '.product-name span',
    image: '.product-image-vp-sub img@src',
    listing_price: '.price-details-list-price',
    our_price: '#WMItemAddToRegBtn@data-product-price'
  })(function(err, obj){

    obj['url'] = url;
    if (err) return done(err);
    done(null, processResults('walmart', obj));
  });
}

var ParseURL = function (url, done) {
  console.log(`checking url: ${url}`);

  if (url.indexOf('amazon.com') != -1) {
    console.log('from amazon');
    return amazonParse(url, done);
  } else if (url.indexOf('walmart.com') != -1) {
    console.log('from walmart');
    return walmartParse(url, done);
  }
  return done(`URL unsupported: "${url}"`, null);
};


function parseNPop(url) {
  ParseURL(url[0], function(err, result){
    if (err) console.log(err);
    else {
      console.log(`=====\nFinal parsed result: ${JSON.stringify(result, null, '  ')}`);
      if (url.length > 1) {
        url.shift();
        var cb = function(){
          parseNPop(url);
        };
        setTimeout(cb, 1000);                         // √ because you're passing a function
        // setTimeout(parseNPop(url), 1000);             // X you're calling immediate
        // setTimeout(parseNPop.bind(null, url), 1000);  // √ binding a new function with specific arguments

      } else {
        console.log('...done!');
      }
    }
  });
}

var url = ['https://www.amazon.com/Fisher-Price-Brilliant-Basics-Babys-Blocks/dp/B0089W1IGG/ref=sr_1_8?s=toys-and-games&ie=UTF8&qid=1469548498&sr=1-8&keywords=toys',
          //  'https://www.amazon.com/Fisher-Price-71050-Brilliant-Basics-Rock-a-Stack/dp/B00000IZQP/ref=pd_bxgy_21_img_2?ie=UTF8&psc=1&refRID=3N79FQ9WE55EY0B2CD5N',
          //  'https://www.amazon.com/Fisher-Price-Brilliant-Basics-Babys-Blocks/dp/B0089W1IGG/ref=sr_1_8?s=toys-and-games&ie=UTF8&qid=1469548498&sr=1-8&keywords=toys',
          //  'https://www.amazon.com/Intex-River-Lounge-Inflatable-Diameter/dp/B000PEOMC8/ref=zg_bs_toys-and-games_3',
          //  'https://www.amazon.com/Pok%C3%A9mon-Plus-Protective-Shell-Black/dp/B01IA9L7PO/ref=sr_1_9?ie=UTF8&qid=1469562883&sr=8-9&keywords=pokemon+go+watch',
           'http://www.walmart.com/ip/17133169?findingMethod=wpa&wpa_qs=XtvBPmsf5mbRg1a3idobJGPp3CAStdBagXPsV3Lrq48&tgtp=1&cmp=10739&relRank=1&pt=cp&adgrp=10818&bt=1&plmt=1145x345_B-C-OG_TI_6-20_HL-MID&bkt=&pgid=4171&relUUID=029d0df2-b816-4ecc-b7a6-fda2f1013818&adUid=dc33ccb8-ec57-4717-b3f9-d3c56f2d8b2a&adiuuid=c3cd0ed6-85ef-47ea-94c2-5e7dfaf8cd14&adpgm=wpa&pltfm=desktop',
           'http://www.walmart.com/ip/LEGO-Angry-Birds-Piggy-Plane-Attack-75822/47335818'];


// parseNPop(url);

module.exports = ParseURL;
