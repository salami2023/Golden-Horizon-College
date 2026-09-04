import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Receipt,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Printer,
  Send,
  Search,
  Filter,
  ShieldCheck,
  Lock,
  Trash2,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { Invoice, PaymentTransaction, FeeItem, Student, UserRole } from '../../types';
import { DropdownWithSearch } from '../DropdownWithSearch';

interface FinanceDashboardProps {
  invoices: Invoice[];
  transactions: PaymentTransaction[];
  feeItems: FeeItem[];
  students: Student[];
  onAddTransaction: (tx: PaymentTransaction) => void;
  onDeleteTransaction?: (txId: string) => void;
  onAddInvoice?: (inv: Invoice) => void;
  onDeleteInvoice?: (invId: string) => void;
  currentRole?: UserRole;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  invoices,
  transactions,
  feeItems,
  students,
  onAddTransaction,
  onDeleteTransaction,
  onAddInvoice,
  onDeleteInvoice,
  currentRole = 'bursar'
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'debtors' | 'transactions' | 'fees'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);

  // RBAC Permission Check: Bursar, Finance, Admin, Principal have full operational control over bursary & finance
  const hasFinanceAccess = [
    'super_admin',
    'pioneer',
    'principal',
    'head_teacher',
    'bursar',
    'finance'
  ].includes(currentRole);

  // Record Payment Form
  const [payAmount, setPayAmount] = useState<number>(500);
  const [payMethod, setPayMethod] = useState<PaymentTransaction['paymentMethod']>('Bank Transfer');
  const [payCategory, setPayCategory] = useState('Tuition Balance Payment');

  // New Invoice Form
  const [selectedStudentForInvoice, setSelectedStudentForInvoice] = useState(students[0]?.id || '');
  const [newInvoiceAmount, setNewInvoiceAmount] = useState(1200);
  const [newInvoiceTerm, setNewInvoiceTerm] = useState('2nd Term 2024/2025');

  const totalRevenueInvoiced = invoices.reduce((a, b) => a + b.totalAmount, 0);
  const totalPaid = invoices.reduce((a, b) => a + b.amountPaid, 0);
  const totalOutstanding = invoices.reduce((a, b) => a + b.balanceDue, 0);

  const debtorsList = invoices.filter((i) => i.balanceDue > 0);

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFinanceAccess) {
      alert('Access Denied: Only Bursar and Finance staff can record financial transactions.');
      return;
    }
    if (!selectedInvoice) return;

    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: `RCT-${Math.floor(10000 + Math.random() * 90000)}`,
      studentId: selectedInvoice.studentId,
      studentName: selectedInvoice.studentName,
      amount: payAmount,
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().split('T')[0],
      category: payCategory,
      status: 'Completed'
    };

    onAddTransaction(newTx);
    
    // Update invoice amount locally
    selectedInvoice.amountPaid += payAmount;
    selectedInvoice.balanceDue = Math.max(0, selectedInvoice.totalAmount - selectedInvoice.amountPaid);
    selectedInvoice.status = selectedInvoice.balanceDue === 0 ? 'Paid' : 'Partial';

    setShowPaymentModal(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasFinanceAccess) {
      alert('Access Denied: Only Bursar and Finance staff can issue school invoices.');
      return;
    }
    const std = students.find((s) => s.id === selectedStudentForInvoice);
    if (!std) return;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNo: `INV-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: std.id,
      studentName: `${std.firstName} ${std.lastName}`,
      classGroup: std.classGroup,
      totalAmount: Number(newInvoiceAmount) || 1200,
      amountPaid: 0,
      balanceDue: Number(newInvoiceAmount) || 1200,
      dueDate: '2025-04-15',
      status: 'Unpaid',
      termSession: '2nd Term 2025/2026',
      items: [
        { description: 'Tuition Fee (2nd Term)', amount: (Number(newInvoiceAmount) || 1200) * 0.7 },
        { description: 'ICT & STEM Laboratory Levy', amount: (Number(newInvoiceAmount) || 1200) * 0.15 },
        { description: 'Sports & Co-Curricular', amount: (Number(newInvoiceAmount) || 1200) * 0.15 }
      ]
    };

    if (onAddInvoice) onAddInvoice(newInv);
    setShowAddInvoiceModal(false);
  };

  const handleDeleteInv = (id: string) => {
    if (!hasFinanceAccess) return;
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      if (onDeleteInvoice) onDeleteInvoice(id);
    }
  };

  const handleDeleteTx = (id: string) => {
    if (!hasFinanceAccess) return;
    if (window.confirm('Delete this payment transaction record?')) {
      if (onDeleteTransaction) onDeleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Role Permission Status Banner */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
        hasFinanceAccess
          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
      }`}>
        <div className="flex items-center gap-2 font-medium">
          {hasFinanceAccess ? (
            <>
              <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Bursary & Financial Authority Active:</strong> Authorized as <strong>{currentRole.replace('_', ' ').toUpperCase()}</strong> with full access to manage fee structures, record payments, and issue invoices.
              </span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>
                <strong>Read-Only Mode:</strong> Full bursary and financial management permissions are assigned to <strong>Bursar and Finance</strong>.
              </span>
            </>
          )}
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border uppercase tracking-wider">
          Role: {currentRole}
        </span>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-600" /> Bursary & Financial Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Student fee invoicing, debtors tracking, bank reconciliation, and payment receipt logs.
          </p>
        </div>

        {hasFinanceAccess && (
          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" /> Issue Fee Invoice
          </button>
        )}
      </div>

      {/* Finance Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Invoiced</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            ₦{totalRevenueInvoiced.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            {invoices.length} Registered Invoices
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Total Collected</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            ₦{totalPaid.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {totalRevenueInvoiced ? Math.round((totalPaid / totalRevenueInvoiced) * 100) : 0}% Collection Rate
          </span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Total Outstanding</span>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            ₦{totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[10px] text-rose-500 font-semibold mt-1 block">
            {debtorsList.length} Unsettled Accounts
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'invoices'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" /> All Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('debtors')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'debtors'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertCircle className="h-4 w-4" /> Debtors ({debtorsList.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'transactions'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="h-4 w-4" /> Payment Receipts ({transactions.length})
        </button>
      </div>

      {/* Invoices & Debtors Table View */}
      {(activeTab === 'invoices' || activeTab === 'debtors') && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoice number or student name..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 shrink-0">Status:</span>
              <DropdownWithSearch
                options={[
                  { value: 'All', label: 'All Statuses' },
                  { value: 'Paid', label: 'Paid in Full', badge: 'Paid' },
                  { value: 'Partial', label: 'Partially Paid', badge: 'Partial' },
                  { value: 'Unpaid', label: 'Unpaid / Outstanding', badge: 'Unpaid' }
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val)}
                placeholder="Filter by status..."
                searchPlaceholder="Search payment status..."
                colorScheme="amber"
                buttonLabel="Filter Status"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-500 uppercase text-[10px]">
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Total Fee</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Balance Due</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(activeTab === 'debtors' ? debtorsList : filteredInvoices).map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-600">{inv.invoiceNo}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{inv.studentName}</td>
                    <td className="py-3 px-4 text-slate-500">{inv.classGroup}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">₦{inv.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-emerald-600 font-semibold">₦{inv.amountPaid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-rose-600 font-bold">₦{inv.balanceDue.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : inv.status === 'Partial'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {hasFinanceAccess && inv.balanceDue > 0 && (
                          <button
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setPayAmount(inv.balanceDue);
                              setShowPaymentModal(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px]"
                          >
                            Receive Payment
                          </button>
                        )}
                        {hasFinanceAccess && (
                          <button
                            onClick={() => handleDeleteInv(inv.id)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                            title="Delete invoice"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transactions Table View */}
      {activeTab === 'transactions' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-500 uppercase text-[10px]">
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-600">{tx.receiptNo}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{tx.paymentDate}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tx.studentName}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{tx.category}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-600">₦{tx.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {hasFinanceAccess && (
                      <button
                        onClick={() => handleDeleteTx(tx.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Delete Transaction"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-600" /> Record Fee Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 mt-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Account</span>
                <p className="font-extrabold text-slate-900 dark:text-white text-sm mt-0.5">
                  {selectedInvoice.studentName} ({selectedInvoice.invoiceNo})
                </p>
                <p className="text-rose-600 font-bold mt-1">Outstanding Balance: ₦{selectedInvoice.balanceDue.toLocaleString()}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  required
                  max={selectedInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Payment Method</label>
                <DropdownWithSearch
                  options={[
                    { value: 'Bank Transfer', label: 'Bank Direct Transfer', badge: 'Bank' },
                    { value: 'Cash Deposit', label: 'Cash Deposit at Bursary', badge: 'Cash' },
                    { value: 'POS Terminal', label: 'POS Card Payment', badge: 'POS' },
                    { value: 'Online Portal', label: 'Online Parent Gateway', badge: 'Online' }
                  ]}
                  value={payMethod}
                  onChange={(val) => setPayMethod(val as any)}
                  placeholder="Select payment method..."
                  searchPlaceholder="Search method..."
                  colorScheme="emerald"
                  buttonLabel="Method"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category / Purpose</label>
                <input
                  type="text"
                  value={payCategory}
                  onChange={(e) => setPayCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt className="h-4 w-4 text-amber-600" /> Issue New Fee Invoice
              </h3>
              <button onClick={() => setShowAddInvoiceModal(false)} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Select Student</label>
                <DropdownWithSearch
                  options={students.map((std) => ({
                    value: std.id,
                    label: `${std.firstName} ${std.lastName}`,
                    sublabel: `${std.admissionNo} • ${std.classGroup}`,
                    badge: std.classGroup
                  }))}
                  value={selectedStudentForInvoice}
                  onChange={(val) => setSelectedStudentForInvoice(val)}
                  placeholder="Select student..."
                  searchPlaceholder="Search by name, admission no, class..."
                  colorScheme="amber"
                  buttonLabel="Find Student"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Fee Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={newInvoiceAmount}
                  onChange={(e) => setNewInvoiceAmount(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
