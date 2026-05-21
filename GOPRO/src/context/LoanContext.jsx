import React, { createContext, useContext, useState, useCallback } from 'react';

const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const [loanApplicationData, setLoanApplicationData] = useState({
    // Personal Details
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
    // Address Details
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
    // KYC Documents
    kycDocuments: {
      aadhaarFront: null,
      aadhaarBack: null,
      panCard: null,
    },
    // Employment Details
    employmentDetails: {
      companyName: '',
      designation: '',
      yearsOfExperience: '',
    },
    // Salary Details
    salaryDetails: {
      monthlyIncome: '',
      payslips: [],
      companyInfo: '',
    },
    // Business Details
    businessDetails: {
      businessName: '',
      annualRevenue: '',
      gstNumber: '',
      itrDocuments: [],
    },
    // Bank Details
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      cancelledCheque: null,
    },
    // Bank Statements
    bankStatements: {
      statements: [],
    },
    // Additional Documents
    additionalDocuments: {
      documents: [],
    },
    // Verification Status
    verificationStatus: {
      faceVerification: false,
      panVerification: false,
      aadhaarVerification: false,
      creditCheck: false,
      riskAssessment: false,
      fraudCheck: false,
      cibilCheck: false,
    },
    // Co-Borrower/Guarantor
    coBorrower: {
      name: '',
      relationship: '',
      kycDocuments: null,
    },
    guarantor: {
      name: '',
      relationship: '',
      kycDocuments: null,
    },
  });

  const updatePersonalDetails = useCallback((details) => {
    setLoanApplicationData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...details }
    }));
  }, []);

  const updateAddressDetails = useCallback((details) => {
    setLoanApplicationData(prev => ({
      ...prev,
      addressDetails: { ...prev.addressDetails, ...details }
    }));
  }, []);

  const updateKYCDocuments = useCallback((documents) => {
    setLoanApplicationData(prev => ({
      ...prev,
      kycDocuments: { ...prev.kycDocuments, ...documents }
    }));
  }, []);

  const updateEmploymentDetails = useCallback((details) => {
    setLoanApplicationData(prev => ({
      ...prev,
      employmentDetails: { ...prev.employmentDetails, ...details }
    }));
  }, []);

  const updateSalaryDetails = useCallback((details) => {
    setLoanApplicationData(prev => ({
      ...prev,
      salaryDetails: { ...prev.salaryDetails, ...details }
    }));
  }, []);

  const updateBusinessDetails = useCallback((details) => {
    setLoanApplicationData(prev => ({
      ...prev,
      businessDetails: { ...prev.businessDetails, ...details }
    }));
  }, []);

  const updateBankDetails = useCallback((details) => {
    setLoanApplicationData(prev => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, ...details }
    }));
  }, []);

  const updateVerificationStatus = useCallback((status) => {
    setLoanApplicationData(prev => ({
      ...prev,
      verificationStatus: { ...prev.verificationStatus, ...status }
    }));
  }, []);

  const value = {
    loanApplicationData,
    updatePersonalDetails,
    updateAddressDetails,
    updateKYCDocuments,
    updateEmploymentDetails,
    updateSalaryDetails,
    updateBusinessDetails,
    updateBankDetails,
    updateVerificationStatus,
  };

  return <LoanContext.Provider value={value}>{children}</LoanContext.Provider>;
};

export const useLoanContext = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoanContext must be used within LoanProvider');
  }
  return context;
};
