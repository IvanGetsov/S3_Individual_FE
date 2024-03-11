import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/HomePage.css';
import BrandFilter from '../components/BrandFilter';
import SuccessModal from '../components/SuccessModal';

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const message = location.state && location.state.successMessage;
    if (message) {
      setSuccessMessage(message);
      setShowSuccessModal(true);
    }
  }, [location.state]);

  const handleBrandSelection = (selectedOptions) => {
    setSelectedBrand(selectedOptions);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="background-image">
      <div className="white-box">
        <div className="grid-container">
          <div className="grid-item-introduction">
            <h2>Select Brand</h2>
            <div className="filter-box">
              <BrandFilter selectedBrands={selectedBrand} onBrandSelect={handleBrandSelection} />
            </div>
            <button
              onClick={() => {
                if (selectedBrand) {
                  navigate("/adverts", { state: { brand: selectedBrand } });
                }
              }}
              disabled={!selectedBrand}
            >
              View Adverts
            </button>
            <p>Ferrarios is a luxury car rental agency specializing in premium and exotic vehicles. Experience the thrill of driving your dream car today!</p>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal message={successMessage} onClose={closeSuccessModal} />
      )}
    </div>
  );
}

export default HomePage;
