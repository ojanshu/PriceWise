import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose"
import { generateEmailBody } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getLowestPrice, getAveragePrice, getHighestPrice } from "@/lib/utils";
import { getEmailNotifType } from "@/lib/utils";
import { sendEmail } from "@/lib/nodemailer";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(){
    try {

        connectToDB();

        const products = await Product.find({});

        if (!products) throw new Error("No products found")

        //scrape latest products and update DB
        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if (!scrapedProduct) throw new Error("No product found!")

                    const updatedPriceHistory = [
                        ...currentProduct.priceHistory,
                        { price: scrapedProduct.currentPrice}
                    ]
        
                    const product = {
                        ...scrapedProduct,
                        priceHistory: updatedPriceHistory,
                        lowestPrice: getLowestPrice(updatedPriceHistory),
                        highestPrice : getHighestPrice(updatedPriceHistory),
                        averagePrice : getAveragePrice(updatedPriceHistory)
                    }
                
        
                const updatedProduct = await Product.findOneAndUpdate(
                    { url : product.url },
                    product
                );

                //check each product's status and email accordingly

                const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct)

                if(emailNotifType && updatedProduct.users.length > 0){
                    const productInfo = {
                        title: updatedProduct.title,
                        url: updatedProduct.url
                    }

                    const emailContent = await generateEmailBody(productInfo, emailNotifType);

                    const userEmails = updatedProduct.users.map((user:any) => user)

                    await sendEmail(emailContent, userEmails);
                }
                return updatedProduct;
            })
        )
        
        return NextResponse.json({
            message: "Products updated successfully", data: updatedProducts
        })

    } catch (error) {
        throw new Error(`Error in GET: ${error}`)
    }
}