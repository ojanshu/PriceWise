import React from 'react'
import Image from 'next/image';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface Props{
  title: string;
  iconSrc: string | StaticImport;
  value: string;
}

const PriceInfoCard = ( {title, iconSrc, value} : Props ) => {
  return (
    <div className={`price-info_card`}>
      <p className='text-base text-black-100'>{title}</p>

      <div className='flex gap-1'>
        <Image
        src={iconSrc as string}
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