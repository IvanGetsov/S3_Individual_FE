import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AdvertService from '../services/AdvertsService';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/AdvertsPage.css';

function AdvertsPage() {
  const location = useLocation();
  const selectedBrand = location.state?.brand;

  const [originalAdverts, setOriginalAdverts] = useState([]);
  const [adverts, setAdverts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [averagePrice, setAveragePrice] = useState(null);

  useEffect(() => {
    if (selectedBrand) {
      AdvertService.getAveragePriceByBrand(selectedBrand.value)
        .then((response) => {
          setAveragePrice(response.data);
        })
        .catch((error) => {
          console.error('Error fetching average price:', error);
        });

      AdvertService.getAdvertsByBrand(selectedBrand.value)
        .then((response) => {
          const fetchedAdverts = response.data;
          setOriginalAdverts(fetchedAdverts);
          setAdverts(fetchedAdverts);
        })
        .catch((error) => {
          console.error('Error fetching adverts:', error);
        });
    }
  }, [selectedBrand]);

  const handlePriceChange = (value) => {
    setPriceRange(value);
    const filteredAdverts = originalAdverts.filter(
      (advert) => advert.pricePerDay >= value[0] && advert.pricePerDay <= value[1]
    );
    setAdverts(filteredAdverts);
  };

  return (
    <div className="container mt-4">
      <h2 className="mt-5">Adverts with Selected Brand</h2>
      <div className="average-price-container">
        <p className="average-price">
          The average price of adverts for the selected brand is : {averagePrice !== null ? `$${Number(averagePrice).toFixed(1)}` : 'Loading...'}
        </p>
      </div>
      <div className="mb-4">
        <p>Price Range:</p>
        <Slider range min={0} max={1000} value={priceRange} onChange={handlePriceChange} />
        <p>
          Selected Price Range: ${priceRange[0]} - ${priceRange[1]}
        </p>
      </div>

      <div className="row">
        {adverts.map((advert, index) => (
          <div key={index} className="col-md-12 mb-4">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-2">
                  {advert.picture ? (
                    <img
                      src={`data:image/png;base64,${JSON.parse(advert.picture).picture}`}
                      alt="Default Car"
                      className="advert-image"
                    />
                  ) : (
                    <img
                      src="src/Images/default_car.png"
                      alt="Default Car"
                      className="advert-image"
                    />
                  )}
                </div>
                <div className="col-md-10">
                  <div className="card-body">
                    <h5 className="card-title">
                      {advert.car.brand} {advert.car.model}
                    </h5>
                    <p className="card-text">Price per Day: {advert.pricePerDay}</p>
                    <Link to={`/adverts/${advert.id}`} className="btn btn-primary">
                      View more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdvertsPage;
