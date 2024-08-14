import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractDescription, extractPrice } from '../utils';
import { extractCurrency } from '../utils';

export async function scrapeAmazonProduct(url : string) {
    if(!url) return;

    // curl --proxy brd.superproxy.io:22225 
    // --proxy-user brd-customer-hl_3b604003-zone-web_unlocker1:s397waq1r4lq -k "https://geo.brdtest.com/mygeo.json"

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {

        //fetching product
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);

        //extract the product title
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            // $('.a-price.a-text-price')
        );

        // const originalPrice = (
        //     $('#priceblock_ourprice'),
        //     $('.a-price.a.text-price span.a-offscreen'),
        //     $('#listprice'),
        //     $('#priceblock_dealprice'),
        //     $('.a-size-base.a-color-price')
        // );

        // const originalPrice = $(
        //     '#priceblock_ourprice, .a-price.a-text-price span.aok-offscreen, #listprice, #priceblock_dealprice, .a-size-base.a-color-price'
        //   );

        const originalPrice = extractPrice($(
            '.a-price.a-text-price > .a-offscreen'
          ));

        const outOfStock = $('#availability span').text().trim().toLowerCase() 
        === 'currently unavailable';

        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || 
        $('#landingImage').attr('data-a-dynamic-image') || '{}';

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, '');

        const description = extractDescription($);

        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            average: Number(currentPrice) || Number(originalPrice),
        }
        
        return data;
        
    } catch (error: any) {
        throw new Error(`Failed to scrape the product: ${error.message}`)
    }

}

// All a nigga know is how to fuck a good thing up