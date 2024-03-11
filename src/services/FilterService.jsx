import axios from "axios";

const getCarsByBrand = () => {
    return axios.get(`/cars/distinct-brands`);
  };

const FilterService = {
    getCarsByBrand
}

export default FilterService;