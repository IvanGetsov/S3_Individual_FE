import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import FilterService from '../services/FilterService';

function BrandFilter(props) {
  const [distinctBrands, setDistinctBrands] = useState([]);

  useEffect(() => {
    FilterService.getCarsByBrand()
      .then((response) => {
        setDistinctBrands(response.data);
      })
      .catch((error) => {
        console.error('Error fetching distinct brands:', error);
      });
  }, []); 

  return (
    <div>
      <Select
        options={distinctBrands.map((brand) => ({ label: brand, value: brand }))}
        isSearchable
        isClearable
        //isMulti
        onChange={props.onBrandSelect}
        value={props.selectedBrands} 
      />
    </div>
  );
}

export default BrandFilter;
