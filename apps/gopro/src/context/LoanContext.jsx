import React, { createContext, useMemo, useState } from 'react';

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

  const value = useMemo(() => {
    const updateSection = (sectionName, data) => {
      setLoanApplicationData((prev) => ({
        ...prev,
        [sectionName]: data,
      }));
    };

    return {
      loanApplicationData,
      updatePersonalDetails: (data) => updateSection('personalDetails', data),
      updateAddressDetails: (data) => updateSection('addressDetails', data),
      updateBusinessDetails: (data) => updateSection('businessDetails', data),
      updateEmploymentDetails: (data) => updateSection('employmentDetails', data),
      updateSalaryDetails: (data) => updateSection('salaryDetails', data),
      updateBankDetails: (data) => updateSection('bankDetails', data),
      updateKYCDocuments: (data) => updateSection('kycDocuments', data),
      updateVerificationStatus: (data) => updateSection('verificationStatus', data),
    };
  }, [loanApplicationData]);

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
}

export default LoanProvider;
