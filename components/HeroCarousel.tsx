"use client"

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Image from 'next/image'

const heroImage = [
    {imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch'},
    {imgUrl: '/assets/images/hero-2.svg', alt: 'bag'},
    {imgUrl: '/assets/images/hero-3.svg', alt: 'lamp'},
    {imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer'},
    {imgUrl: '/assets/images/hero-5.svg', alt: 'chair'}
]

const HeroCarousel = () => {
  return (
    <div className="relative flex-col mt-10 md:mt-0">
        <Carousel
            showThumbs = {false}
            // autoPlay
            infiniteLoop
            // interval={2500}
            showArrows={false}
            showStatus={false}
        >
            {heroImage.map((image) => (
                <div key={image.alt} className="h-full flex items-end justify-center">
                <Image 
                 src={image.imgUrl}
                 alt={image.alt}
                 width={200}  // Reduced from 300
                 height={200} // Reduced from 300
                 className="object-contain w-[50%] h-[50%] mb-0"
                 key={image.alt}
                />
                </div>
            ))}
        </Carousel>
        
        <Image 
            src="assets/icons/hand-drawn-arrow.svg"
            alt="arrow"
            width={150}  // Reduced from 175
            height={150} // Reduced from 175
            className="max-xl:hidden absolute left-[0] bottom-[5%]"  // Added 'absolute' and changed 'bottom' value
        />
    </div>
  )
}

export default HeroCarousel
