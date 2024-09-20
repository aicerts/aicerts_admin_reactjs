import Image from 'next/image';
import React from 'react';
import { Shimmer } from 'react-shimmer';

const DashboardCard = ({ item }) => {
  const isDataLoaded = item && Object.keys(item).length > 0;

  return (
    <div className='card-container'>
      <div className='badge-container-admin me-3'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge' />
      </div>
      <div className='title-cont'>
        {isDataLoaded ? (
          <>
            <h5 className='title-value'>{item?.titleValue || ""}</h5>
            <h2 className='title-value-number'>{item?.value || ""}</h2>

          </>
        ) : (
          <>
             <Shimmer width={70} height={16} />

            <Shimmer width={70} height={16} />

          </>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
