import React from 'react'
import Image from 'next/image';

interface Props{
  title: String;
  iconSrc: String;
  value: String;
}

const PriceInfoCard = ( {title, iconSrc, value} : Props ) => {
  return (
    <div className={`price-info_card`}>
      <p className='text-base text-black-100'>{title}</p>

      <div className='flex gap-1'>
        <Image
        src={iconSrc}
        alt={title}
        width={20}
        height={20}
        />
        <p className='text-2xl font-bold text-secondary'>{value}</p>
      </div>
    </div>
  )
}

export default PriceInfoCard