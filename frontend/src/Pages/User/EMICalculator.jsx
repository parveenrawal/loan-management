import React, { useState } from 'react';
import axios from 'axios';

const EMICalculator = () => {
  const [customer, setCustomer] = useState({
    name: '',
    fatherName: '',
    mobile: '',
    email: '',
    address: '',
  });

  const [loanDetails, setLoanDetails] = useState({
    amount: '',
    interest: '',
    tenure: '',
    loanDate: '',
  });

  const [emi, setEMI] = useState(null);
  const [totalPayment, setTotalPayment] = useState(null);
  const [schedule, setSchedule] = useState([]);

  const calculateEMI = (amount, annualInterestRate, tenureMonths) => {
    const monthlyRate = annualInterestRate / (12 * 100);
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return emi;
  };

  const generateSchedule = (principal, rate, tenure, emi, loanDate) => {
    let outstanding = principal;
    const monthlyRate = rate / (12 * 100);
    const schedule = [];
    let currentDate = new Date(loanDate);

    for (let month = 1; month <= tenure; month++) {
      currentDate.setMonth(currentDate.getMonth() + 1);
      const interestPayment = outstanding * monthlyRate;
      const principalPayment = emi - interestPayment;
      outstanding -= principalPayment;

      schedule.push({
        month,
        emiDate: currentDate.toLocaleDateString(),
        interestPayment: interestPayment.toFixed(2),
        principalPayment: principalPayment.toFixed(2),
        outstanding: Math.abs(outstanding).toFixed(2),
      });
    }

    return schedule;
  };

  const handleCalculate = () => {
    const { amount, interest, tenure, loanDate } = loanDetails;

    if (!amount || !interest || !tenure || !loanDate) {
      alert("Please fill all loan details properly.");
      return;
    }

    const numericAmount = Number(amount);
    const numericInterest = Number(interest);
    const numericTenure = Number(tenure);

    if (isNaN(numericAmount) || isNaN(numericInterest) || isNaN(numericTenure)) {
      alert("Please enter valid numerical values.");
      return;
    }

    const emiResult = calculateEMI(numericAmount, numericInterest, numericTenure);
    setEMI(emiResult.toFixed(2));
    setTotalPayment((emiResult * numericTenure).toFixed(2));
    setSchedule(generateSchedule(numericAmount, numericInterest, numericTenure, emiResult, loanDate));
  };

  const handleApply = async () => {
    const data = { customer, loanDetails, emi, totalPayment, schedule };
    try {
      const response = await axios.post('http://localhost:5000/api/loans', data);
      alert('Loan details saved successfully!');
    } catch (error) {
      console.error('Error saving loan details:', error);
      alert('Failed to save loan details');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Loan EMI Calculator</h2>

      {/* Customer Details Section */}
      <div className="mb-4 border p-4">
        <h3 className="font-semibold mb-2">Customer Details</h3>
        <input type="text" placeholder="Name" className="border p-2 mb-2 w-full" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <input type="text" placeholder="Father's Name" className="border p-2 mb-2 w-full" value={customer.fatherName} onChange={(e) => setCustomer({ ...customer, fatherName: e.target.value })} />
        <input type="text" placeholder="Mobile Number" className="border p-2 mb-2 w-full" value={customer.mobile} onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2 mb-2 w-full" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
        <textarea placeholder="Address" className="border p-2 w-full" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
      </div>

      {/* Loan Details Section */}
      <div className="mb-4 border p-4">
        <h3 className="font-semibold mb-2">Loan Details</h3>
        <input type="number" placeholder="Loan Amount" className="border p-2 mb-2 w-full" value={loanDetails.amount} onChange={(e) => setLoanDetails({ ...loanDetails, amount: e.target.value })} />
        <input type="number" placeholder="Annual Interest Rate (%)" className="border p-2 mb-2 w-full" value={loanDetails.interest} onChange={(e) => setLoanDetails({ ...loanDetails, interest: e.target.value })} />
        <input type="number" placeholder="Tenure (months)" className="border p-2 mb-2 w-full" value={loanDetails.tenure} onChange={(e) => setLoanDetails({ ...loanDetails, tenure: e.target.value })} />
        <input type="date" placeholder="Loan Start Date" className="border p-2 w-full" value={loanDetails.loanDate} onChange={(e) => setLoanDetails({ ...loanDetails, loanDate: e.target.value })} />
      </div>

      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCalculate}>Calculate EMI</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded ml-4" onClick={handleApply}>Apply & Save</button>

      {/* EMI Details Section */}
      {emi && (
        <div className="mt-4 border p-4">
          <h3 className="font-semibold">Monthly EMI: ₹{emi}</h3>
          <h4 className="font-semibold">Total Payment: ₹{totalPayment}</h4>
          <table className="w-full mt-4 text-left">
            <thead>
              <tr>
                <th>Month</th>
                <th>Date</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>{item.emiDate}</td>
                  <td>₹{item.principalPayment}</td>
                  <td>₹{item.interestPayment}</td>
                  <td>₹{item.outstanding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EMICalculator;
