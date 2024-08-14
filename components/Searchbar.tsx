"use client"

import { scrapeAndStoreProduct } from "@/lib/actions";
import { FormEvent, useState } from "react"

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if(
      hostname.includes("amazon.com") || hostname.includes("amazon.") || hostname.endsWith('amazon')
    ) return true;
  } catch (error) {
    return false;
  }
}

const Searchbar = () => {

  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async ( event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if(!isValidLink) return alert('Please provide a valid amazon link');

    try {
      setIsLoading(true);

      //scrape the product page
      const product = await scrapeAndStoreProduct(searchPrompt);

    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }

  }
  return (
    <form 
    className="flex flex-wrap gap-4 mt-12"
    onSubmit={handleSubmit}
    >
        <input className="searchbar-input"
        type="text"
        value={searchPrompt}
        placeholder="Enter Product Link" 
        onChange={(e) => setSearchPrompt(e.target.value)}
        />
        <button 
        type="submit" className="searchbar-btn"
        disabled={searchPrompt === ''}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
    </form>
    
  )
}

export default Searchbar