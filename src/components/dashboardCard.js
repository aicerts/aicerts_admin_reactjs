import Image from 'next/image';
import React from 'react';
import { Shimmer } from 'react-shimmer';

const DashboardCard = ({ item }) => {
  const isDataLoaded = item && Object.keys(item).length > 0;

  return (
    <div className='card-container'>
      {/* Badge container */}
      <div className='badge-container'>
        <Image width={20} height={50} className='badge-cert' src="/icons/badge-cert.svg" alt='Badge' />
      </div>
      {/* Title container */}
      <div className='title-cont'>
        {isDataLoaded ? (
          <>
            <p className='item-title'>{item?.title || ""}</p>
            <h5 className='title-value'>{item?.titleValue || ""}</h5>
          </>
        ) : (
          <>
                                    <Shimmer width={70} height={16} />

            <Shimmer width={70} height={16} />

          </>
        )}
      </div>
      {/* Value container */}
      <div className='value-container'>
        {isDataLoaded ? (
          <div>
            <h2 className='item-value'>{item?.value || ""}</h2>
            {/* <p className='item-percentage'>{item.percentage}</p> */}
          </div>
        ) : (
          <div>
                        <Shimmer width={30} height={36} />
          </div>
        )}
        <Image width={100} height={50} className='graph-line' src='/icons/Line-chart.svg' alt='Line chart icon' />
      </div>
    </div>
  );
};

export default DashboardCard;
