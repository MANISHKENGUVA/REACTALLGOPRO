import React, { createContext, useContext, useMemo, useState } from 'react';

const initialLoanApplicationData = {
  personalDetails: {
    fullName: '',
    fathersName: '',
    mothersName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    email: '',
    mobileNumber: '',
    panNumber: '',
    aadhaarNumber: '',
    employmentType: '',
    monthlyIncome: '',
    loanPurpose: '',
  },
  addressDetails: {
    flatNo: '',
    building: '',
    street: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    residenceType: '',
    permanentAddressSameAsCurrent: false,
  },
  kycDocuments: {},
  verificationStatus: {},
  bankDetails: {},
  businessDetails: {},
  employmentDetails: {},
  salaryDetails: {},
};

const defaultContextValue = {
  loanApplicationData: initialLoanApplicationData,
  updatePersonalDetails: () => {},
  updateAddressDetails: () => {},
  updateBusinessDetails: () => {},
  updateEmploymentDetails: () => {},
  updateSalaryDetails: () => {},
  updateBankDetails: () => {},
  updateKYCDocuments: () => {},
  updateVerificationStatus: () => {},
};

const LoanContext = createContext(defaultContextValue);

export function LoanProvider({ children }) {
  const [loanApplicationData, setLoanApplicationData] = useState(initialLoanApplicationData);

  const updateSection = (sectionName, data) => {
    setLoanApplicationData((prev) => ({
      ...prev,
      [sectionName]: data,
    }));
  };

  const updatePersonalDetails = (data) => updateSection('personalDetails', data);
  const updateAddressDetails = (data) => updateSection('addressDetails', data);
  const updateBusinessDetails = (data) => updateSection('businessDetails', data);
  const updateEmploymentDetails = (data) => updateSection('employmentDetails', data);
  const updateSalaryDetails = (data) => updateSection('salaryDetails', data);
  const updateBankDetails = (data) => updateSection('bankDetails', data);
  const updateKYCDocuments = (data) => updateSection('kycDocuments', data);
  const updateVerificationStatus = (data) => updateSection('verificationStatus', data);

  const value = useMemo(
    () => ({
      loanApplicationData,
      updatePersonalDetails,
      updateAddressDetails,
      updateBusinessDetails,
      updateEmploymentDetails,
      updateSalaryDetails,
      updateBankDetails,
      updateKYCDocuments,
      updateVerificationStatus,
    }),
    [loanApplicationData]
  );

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
}

export function useLoanContext() {
  return useContext(LoanContext);
}

export default LoanProvider;
