import React from 'react'
import Image from 'next/image'
import Searchbar from '@/components/Searchbar'
import HeroCarousel from '@/components/HeroCarousel'
import { getAllProducts } from '@/lib/actions'
import ProductCard from '@/components/ProductCard'
import { Pridi } from 'next/font/google'

const Home = async () => {

  const allProducts = await getAllProducts();


  return (
    <>
    <section className='px-6 md:px-20 py-24'>
      <div className='flex max-xl:flex-col gap-12'>
        <div className='flex flex-col justify-center'>
          <p className='small-text'>
            Smart Shopping starts here:
            <Image 
            src= 'assets/icons/arrow-right.svg'
            alt='arrow-right'
            width={20}
            height={20}
            />
          </p>

          <h1 className='head-text'>
            Unleash the True Potential of 
            <span className='text-primary'> PriceWise</span>
          </h1>

          <p className='mt-6'>
            PriceWise is a smart shopping assistant that helps you 
            save money by providing you the right time to buy stuff. It is powerful, secure and handy.
          </p>

          <Searchbar />
        </div>

        <HeroCarousel />
      </div>
    </section>

    <section className='trending-section'>
      <h2 className='section-text'>Trending</h2>

      <div className='flex flex-wrap gap-x-8 gap-y-16'>
        {allProducts?.map
        ((product) => (
          <ProductCard key={product._id} product={product} />
        ))
        }
      </div>

    </section>
    </>
  )
}

export default Home