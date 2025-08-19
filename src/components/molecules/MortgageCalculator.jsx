import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";

function MortgageCalculator({ property, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    homePrice: property?.price || 0,
    downPayment: 0,
    downPaymentPercent: 20,
    interestRate: 6.5,
    loanTerm: 30,
  });
  
  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalLoanAmount: 0,
    totalInterest: 0,
    monthlyPrincipal: 0,
    monthlyInterest: 0,
  });

  const [inputMode, setInputMode] = useState('percent'); // 'percent' or 'amount'
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Update home price when property changes
  useEffect(() => {
    if (property?.price) {
      setFormData(prev => ({ ...prev, homePrice: property.price }));
    }
  }, [property]);

  // Calculate down payment based on input mode
  useEffect(() => {
    if (inputMode === 'percent') {
      const downPaymentAmount = (formData.homePrice * formData.downPaymentPercent) / 100;
      setFormData(prev => ({ ...prev, downPayment: downPaymentAmount }));
    } else {
      const downPaymentPercent = formData.homePrice > 0 ? (formData.downPayment / formData.homePrice) * 100 : 0;
      setFormData(prev => ({ ...prev, downPaymentPercent: downPaymentPercent }));
    }
  }, [formData.homePrice, formData.downPaymentPercent, formData.downPayment, inputMode]);

  // Calculate mortgage automatically when inputs change
  useEffect(() => {
    if (formData.homePrice > 0 && formData.downPayment >= 0 && formData.interestRate > 0) {
      calculateMortgage();
    }
  }, [formData]);

  const calculateMortgage = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const principal = formData.homePrice - formData.downPayment;
      
      if (principal <= 0) {
        setResults({
          monthlyPayment: 0,
          totalLoanAmount: 0,
          totalInterest: 0,
          monthlyPrincipal: 0,
          monthlyInterest: 0,
        });
        setHasCalculated(true);
        setIsCalculating(false);
        return;
      }

      const monthlyRate = formData.interestRate / 100 / 12;
      const numPayments = formData.loanTerm * 12;

      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = principal * 
          (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
          (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else {
        monthlyPayment = principal / numPayments;
      }

      const totalPaid = monthlyPayment * numPayments;
      const totalInterest = totalPaid - principal;
      const monthlyInterest = (principal * monthlyRate);
      const monthlyPrincipal = monthlyPayment - monthlyInterest;

      setResults({
        monthlyPayment: monthlyPayment,
        totalLoanAmount: principal,
        totalInterest: totalInterest,
        monthlyPrincipal: monthlyPrincipal,
        monthlyInterest: monthlyInterest,
      });

      setHasCalculated(true);
    } catch (error) {
      toast.error("Error calculating mortgage. Please check your inputs.");
    }
    
    setIsCalculating(false);
  };

  const handleInputChange = (field, value) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleDownPaymentModeToggle = () => {
    setInputMode(prev => prev === 'percent' ? 'amount' : 'percent');
  };

  const handleReset = () => {
    setFormData({
      homePrice: property?.price || 0,
      downPayment: 0,
      downPaymentPercent: 20,
      interestRate: 6.5,
      loanTerm: 30,
    });
    setResults({
      monthlyPayment: 0,
      totalLoanAmount: 0,
      totalInterest: 0,
      monthlyPrincipal: 0,
      monthlyInterest: 0,
    });
    setHasCalculated(false);
    toast.success("Calculator reset successfully");
  };

  const handleSaveCalculation = () => {
    const calculationData = {
      property: {
        id: property.Id,
        title: property.title,
        price: property.price
      },
      inputs: formData,
      results: results,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would save to a service
    console.log('Saving calculation:', calculationData);
    toast.success("Calculation saved successfully");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyDetailed = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent.toFixed(2)}%`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-surface rounded-2xl shadow-xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mortgage Calculator</h2>
                <p className="text-gray-600 mt-1">{property?.title}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Loan Details
                      </h3>
                      
                      {/* Home Price */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Home Price
                        </label>
                        <Input
                          type="number"
                          value={formData.homePrice}
                          onChange={(e) => handleInputChange('homePrice', e.target.value)}
                          placeholder="Enter home price"
                          className="text-right"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {formatCurrency(formData.homePrice)}
                        </p>
                      </div>

                      {/* Down Payment */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Down Payment
                          </label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownPaymentModeToggle}
                            className="text-xs px-3 py-1"
                          >
                            {inputMode === 'percent' ? 'Switch to $' : 'Switch to %'}
                          </Button>
                        </div>
                        
                        {inputMode === 'percent' ? (
                          <div>
                            <Input
                              type="number"
                              value={formData.downPaymentPercent}
                              onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                              placeholder="Enter percentage"
                              min="0"
                              max="100"
                              step="0.1"
                              className="text-right"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              {formatPercent(formData.downPaymentPercent)} = {formatCurrency(formData.downPayment)}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <Input
                              type="number"
                              value={formData.downPayment}
                              onChange={(e) => handleInputChange('downPayment', e.target.value)}
                              placeholder="Enter amount"
                              min="0"
                              className="text-right"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              {formatCurrency(formData.downPayment)} = {formatPercent(formData.downPaymentPercent)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Interest Rate */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interest Rate (Annual %)
                        </label>
                        <Input
                          type="number"
                          value={formData.interestRate}
                          onChange={(e) => handleInputChange('interestRate', e.target.value)}
                          placeholder="Enter interest rate"
                          min="0"
                          max="20"
                          step="0.01"
                          className="text-right"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {formatPercent(formData.interestRate)} APR
                        </p>
                      </div>

                      {/* Loan Term */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loan Term
                        </label>
                        <Select
                          value={formData.loanTerm}
                          onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                          className="w-full"
                        >
                          <option value={15}>15 years</option>
                          <option value={20}>20 years</option>
                          <option value={25}>25 years</option>
                          <option value={30}>30 years</option>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Calculation Results
                      </h3>

                      {isCalculating ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-3 text-gray-600">Calculating...</span>
                        </div>
                      ) : hasCalculated ? (
                        <div className="space-y-4">
                          {/* Monthly Payment - Featured */}
                          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                            <h4 className="text-sm font-medium text-primary mb-2">
                              Monthly Payment
                            </h4>
                            <div className="text-3xl font-bold text-primary">
                              {formatCurrencyDetailed(results.monthlyPayment)}
                            </div>
                          </div>

                          {/* Payment Breakdown */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                Principal
                              </h5>
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrencyDetailed(results.monthlyPrincipal)}
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="text-sm font-medium text-gray-700 mb-1">
                                Interest
                              </h5>
                              <div className="text-lg font-semibold text-gray-900">
                                {formatCurrencyDetailed(results.monthlyInterest)}
                              </div>
                            </div>
                          </div>

                          {/* Loan Summary */}
                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">Loan Amount</span>
                              <span className="font-semibold">
                                {formatCurrency(results.totalLoanAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">Total Interest</span>
                              <span className="font-semibold">
                                {formatCurrency(results.totalInterest)}
                              </span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">Total Cost</span>
                              <span className="font-bold text-lg">
                                {formatCurrency(results.totalLoanAmount + results.totalInterest)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <ApperIcon name="Calculator" size={48} className="mx-auto mb-4 text-gray-400" />
                          <p>Enter your loan details to see results</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {hasCalculated && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                      >
                        <ApperIcon name="RotateCcw" size={16} />
                        Reset
                      </Button>
                      <Button
                        onClick={handleSaveCalculation}
                        className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                      >
                        <ApperIcon name="Save" size={16} />
                        Save Calculation
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default MortgageCalculator;