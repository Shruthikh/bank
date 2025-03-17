import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, CreditCard, PieChart, ArrowUpRight, ArrowDownRight, LogOut, Wallet, History, AlertCircle, Shield, Clock, BellRing, Send, Smartphone, Zap, Wifi, TvIcon, Home, DollarSign } from 'lucide-react';
import VoiceAssistant from '../components/VoiceAssistant';

export default function Dashboard() {
  const { user, logout, deposit, withdraw, transfer, transactions } = useAuth();
  const navigate = useNavigate();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRecipient, setPaymentRecipient] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentType, setPaymentType] = useState<'money' | 'mobile' | 'electricity' | 'internet' | 'tv' | 'rent'>('money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [operator, setOperator] = useState('');

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    try {
      if (transactionType === 'deposit') {
        deposit(Number(amount), description);
        speak(`Successfully deposited ${amount} dollars to your account`);
      } else if (transactionType === 'withdraw') {
        withdraw(Number(amount), description);
        speak(`Successfully withdrawn ${amount} dollars from your account`);
      } else if (transactionType === 'transfer') {
        transfer(Number(amount), recipient);
        speak(`Successfully transferred ${amount} dollars to ${recipient}`);
      }

      setShowTransactionModal(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        speak(`Transaction failed. ${error.message}`);
      }
    }
  };

  const openTransactionModal = (type: 'deposit' | 'withdraw' | 'transfer') => {
    setTransactionType(type);
    setShowTransactionModal(true);
    
    // Voice feedback for modal opening
    const messages = {
      deposit: "Opening deposit form. Please enter the amount you want to deposit.",
      withdraw: "Opening withdrawal form. Please enter the amount you want to withdraw.",
      transfer: "Opening transfer form. Please enter the amount and recipient details."
    };
    speak(messages[type]);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value) {
      speak(`Amount set to ${value} dollars`);
    }
  };

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecipient(value);
    if (value) {
      speak(`Recipient set to ${value}`);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);
    if (value) {
      speak(`Description set to ${value}`);
    }
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setRecipient('');
    setError('');
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('deposit')) {
      openTransactionModal('deposit');
    } else if (command.includes('withdraw')) {
      openTransactionModal('withdraw');
    } else if (command.includes('transfer')) {
      openTransactionModal('transfer');
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentAmount) {
      setError('Please enter the amount');
      speak('Please enter the amount');
      return;
    }

    if (paymentType === 'money' && !paymentRecipient) {
      setError('Please enter recipient details');
      speak('Please enter recipient details');
      return;
    }

    if (paymentType === 'mobile' && (!mobileNumber || !operator)) {
      setError('Please enter mobile number and select operator');
      speak('Please enter mobile number and select operator');
      return;
    }

    if (['electricity', 'internet', 'tv', 'rent'].includes(paymentType) && !billNumber) {
      setError('Please enter bill number');
      speak('Please enter bill number');
      return;
    }

    try {
      let message = '';
      switch (paymentType) {
        case 'money':
          await transfer(Number(paymentAmount), paymentRecipient);
          message = `Successfully sent ${paymentAmount} dollars to ${paymentRecipient}`;
          break;
        case 'mobile':
          await transfer(Number(paymentAmount), `MOBILE-${operator}-${mobileNumber}`);
          message = `Successfully recharged ${mobileNumber} with ${paymentAmount} dollars`;
          break;
        case 'electricity':
          await transfer(Number(paymentAmount), `ELECTRICITY-${billNumber}`);
          message = `Successfully paid electricity bill of ${paymentAmount} dollars`;
          break;
        case 'internet':
          await transfer(Number(paymentAmount), `INTERNET-${billNumber}`);
          message = `Successfully paid internet bill of ${paymentAmount} dollars`;
          break;
        case 'tv':
          await transfer(Number(paymentAmount), `TV-${billNumber}`);
          message = `Successfully paid TV bill of ${paymentAmount} dollars`;
          break;
        case 'rent':
          await transfer(Number(paymentAmount), `RENT-${billNumber}`);
          message = `Successfully paid rent of ${paymentAmount} dollars`;
          break;
      }
      speak(message);
      setShowPaymentModal(false);
      resetPaymentForm();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        speak(`Payment failed. ${error.message}`);
      }
    }
  };

  const resetPaymentForm = () => {
    setPaymentAmount('');
    setPaymentRecipient('');
    setPaymentNote('');
    setMobileNumber('');
    setBillNumber('');
    setOperator('');
    setError('');
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'money': return <Send className="h-5 w-5" />;
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'electricity': return <Zap className="h-5 w-5" />;
      case 'internet': return <Wifi className="h-5 w-5" />;
      case 'tv': return <TvIcon className="h-5 w-5" />;
      case 'rent': return <Home className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const paymentOptions = [
    { id: 'money', label: 'Send Money', icon: <Send className="h-5 w-5" /> },
    { id: 'mobile', label: 'Mobile Recharge', icon: <Smartphone className="h-5 w-5" /> },
    { id: 'electricity', label: 'Electricity Bill', icon: <Zap className="h-5 w-5" /> },
    { id: 'internet', label: 'Internet Bill', icon: <Wifi className="h-5 w-5" /> },
    { id: 'tv', label: 'TV Bill', icon: <TvIcon className="h-5 w-5" /> },
    { id: 'rent', label: 'Rent Payment', icon: <Home className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bank-bg-pattern">
      {/* Voice Assistant */}
      <VoiceAssistant onCommand={handleVoiceCommand} />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bank-sidebar">
        <div className="p-6">
          <div className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <Building2 className="h-8 w-8 text-sky-600 animate-pulse" />
            <h1 className="text-xl font-bold gradient-text">SecureBank</h1>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-sky-600 transition-colors">
              <Clock className="h-4 w-4" />
              <span>Login Time: {user?.loginTime}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-sky-600 transition-colors">
              <span>Last Activity: {user?.lastActivity}</span>
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-8 p-4 bank-card rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Account Info</h3>
            <div className="space-y-2 text-sm">
              <div className="hover:translate-x-1 transition-transform">
                <span className="text-gray-500">Account Type:</span>
                <span className="ml-2 text-gray-900 font-medium">{user?.accountType}</span>
              </div>
              <div className="hover:translate-x-1 transition-transform">
                <span className="text-gray-500">Account Number:</span>
                <span className="ml-2 text-gray-900 font-medium">{user?.accountNumber}</span>
              </div>
              <div className="hover:translate-x-1 transition-transform">
                <span className="text-gray-500">Reward Points:</span>
                <span className="ml-2 text-sky-600 font-bold">{user?.rewardPoints}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 px-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3 px-2">Quick Links</h3>
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-600 hover:translate-x-1 rounded-lg transition-all">
                <CreditCard className="h-4 w-4" />
                <span>Cards & Payments</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-600 hover:translate-x-1 rounded-lg transition-all">
                <PieChart className="h-4 w-4" />
                <span>Investment Options</span>
              </button>
              <button className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-600 hover:translate-x-1 rounded-lg transition-all">
                <History className="h-4 w-4" />
                <span>Transaction History</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="absolute bottom-6 left-6 flex items-center space-x-2 text-red-600 hover:text-red-700 hover:scale-105 transition-transform"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bank-card-premium rounded-xl p-6 mb-6 hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}</h2>
                <p className="text-gray-300">Here's your financial overview</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 hover:scale-105 transition-all">
                  <BellRing className="h-5 w-5" />
                  <span>Notifications</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 hover:scale-105 transition-all">
                  <Shield className="h-5 w-5" />
                  <span>Security</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="bank-gradient-bg text-white rounded-xl p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Current Balance</h2>
                <Wallet className="h-6 w-6" />
              </div>
              <p className="text-4xl font-bold">${user?.balance.toLocaleString()}</p>
              <p className="text-sm text-white/80 mt-1">Available Balance</p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">Monthly Change</span>
                  <span className="text-emerald-300 font-medium animate-pulse">+2.4%</span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bank-card rounded-xl p-6 hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quick Payment</h3>
                <DollarSign className="h-5 w-5 text-sky-600" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setPaymentType(option.id as any);
                      setShowPaymentModal(true);
                    }}
                    className="flex items-center justify-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-sky-50 hover:border-sky-200 transition-all"
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bank-card rounded-xl p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => openTransactionModal('deposit')}
                  className="p-4 text-center rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  <ArrowUpRight className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Deposit</span>
                </button>
                <button 
                  onClick={() => openTransactionModal('withdraw')}
                  className="p-4 text-center rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  <ArrowDownRight className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Withdraw</span>
                </button>
                <button 
                  onClick={() => openTransactionModal('transfer')}
                  className="p-4 text-center rounded-lg hover:bg-sky-50 hover:text-sky-600 transition-colors"
                >
                  <ArrowUpRight className="h-6 w-6 mx-auto mb-2 rotate-45" />
                  <span className="text-sm">Transfer</span>
                </button>
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="bank-card rounded-xl p-6 hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Transaction Summary</h2>
                <History className="h-6 w-6 text-sky-600" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Income</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">$3,240</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Expenses</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">$2,140</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mt-6 bank-card rounded-xl p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <button className="text-sm text-sky-600 hover:text-sky-700 hover:scale-105 transition-transform">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {transactions?.slice(0, 5).map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-600' :
                      transaction.type === 'withdraw' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' ? <ArrowUpRight className="h-4 w-4" /> :
                       transaction.type === 'withdraw' ? <ArrowDownRight className="h-4 w-4" /> :
                       <ArrowUpRight className="h-4 w-4 rotate-45" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      transaction.type === 'deposit' ? 'text-green-600' :
                      transaction.type === 'withdraw' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {transactionType?.charAt(0).toUpperCase() + transactionType?.slice(1)}
            </h2>
            <form onSubmit={handleTransaction}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    required
                  />
                </div>
                {transactionType === 'transfer' ? (
                  <div>
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700">
                      Recipient Account
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      value={recipient}
                      onChange={handleRecipientChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      value={description}
                      onChange={handleDescriptionChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>
                )}
                {error && (
                  <div className="text-red-600 text-sm flex items-center space-x-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTransactionModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">
                {paymentOptions.find(opt => opt.id === paymentType)?.label}
              </h3>
              {getPaymentIcon(paymentType)}
            </div>
            <form onSubmit={handlePayment}>
              <div className="space-y-4">
                {paymentType === 'mobile' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        placeholder="Enter mobile number"
                        required // set a mobile number where transcation can be done easiley without any error
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Operator</label>
                      <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                        required
                      >
                        <option value="">Select operator</option>
                        <option value="ATT">AT&T</option>
                        <option value="VERIZON">Verizon</option>
                        <option value="TMOBILE">T-Mobile</option>
                        <option value="SPRINT">Sprint</option>
                      </select>
                    </div>
                  </>
                )}

                {['electricity', 'internet', 'tv', 'rent'].includes(paymentType) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bill Number</label>
                    <input
                      type="text"
                      value={billNumber}
                      onChange={(e) => setBillNumber(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                      placeholder="Enter bill number"
                      required
                    />
                  </div>
                )}

                {paymentType === 'money' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Recipient</label>
                    <input
                      type="text"
                      value={paymentRecipient}
                      onChange={(e) => setPaymentRecipient(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                      placeholder="Enter recipient's account number"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    placeholder="Enter amount"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Note (Optional)</label>
                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
                    placeholder="Add a note"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    Pay Now
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false);
                      resetPaymentForm();
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}