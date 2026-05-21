import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUBUTTON, AUINPUT, AUSELECT, AUCHECKBOX, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { useLoanContext } from '../../context/LoanContext';

export default function AddressInfoPage() {
  const navigate = useNavigate();
  const { loanApplicationData, updateAddressDetails } = useLoanContext();
  const [formData, setFormData] = useState(loanApplicationData.addressDetails);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = () => {
    if (formData.flatNo && formData.city && formData.pincode && formData.state) {
      updateAddressDetails(formData);
      navigate('/loan-flow/kyc-upload');
    } else {
      alert('Please fill all required fields');
    }
  };

  return (
    <AUCARD className="address-info-page">
      <h2>Address Information</h2>
      <p className="address-info-page__meta">State: BORROWER-ADDRESS-V1-ADDRESS-INFO-V1</p>

      <div className="address-info-page__form">
        <AUINPUT
          type="text"
          label="Flat/House No"
          name="flatNo"
          value={formData.flatNo}
          onChange={handleChange}
          placeholder="Enter flat/house number"
          required
        />

        <AUINPUT
          type="text"
          label="Building Name"
          name="building"
          value={formData.building}
          onChange={handleChange}
          placeholder="Enter building name"
        />

        <AUINPUT
          type="text"
          label="Street"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Enter street address"
        />

        <AUINPUT
          type="text"
          label="Landmark"
          name="landmark"
          value={formData.landmark}
          onChange={handleChange}
          placeholder="Enter nearby landmark"
        />

        <AUINPUT
          type="text"
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="Enter city"
          required
        />

        <AUINPUT
          type="text"
          label="District"
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="Enter district"
        />

        <AUSELECT
          label="State"
          name="state"
          value={formData.state}
          onChange={handleChange}
          options={[
            { label: 'Select State', value: '' },
            { label: 'Maharashtra', value: 'maharashtra' },
            { label: 'Karnataka', value: 'karnataka' },
            { label: 'Tamil Nadu', value: 'tamilnadu' },
            { label: 'Telangana', value: 'telangana' },
            { label: 'Delhi', value: 'delhi' },
            { label: 'Other', value: 'other' }
          ]}
          required
        />

        <AUINPUT
          type="text"
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="Enter pincode"
          required
        />

        <AUSELECT
          label="Residence Type"
          name="residenceType"
          value={formData.residenceType}
          onChange={handleChange}
          options={[
            { label: 'Select Type', value: '' },
            { label: 'Owned', value: 'owned' },
            { label: 'Rented', value: 'rented' },
            { label: 'With Parents', value: 'with_parents' }
          ]}
        />

        <div className="address-info-page__checkbox-row">
          <AUCHECKBOX
            name="permanentAddressSameAsCurrent"
            checked={formData.permanentAddressSameAsCurrent}
            onChange={handleChange}
          />
          <label>Permanent Address Same as Current</label>
        </div>

        <div className="address-info-page__actions">
          <AUBUTTON variant="primary" onClick={handleNext}>
            Next
          </AUBUTTON>
          <AUBUTTON variant="outline" onClick={() => navigate('/loan-flow/personal-info')}>
            Back
          </AUBUTTON>
        </div>
      </div>
    </AUCARD>
  );
}
