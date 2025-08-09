import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { applyCreditNote } from './creditNotesSlice';
import { applyCreditToInvoice } from '../orders/invoicesSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ApplyCreditModal from './ApplyCreditModal';

const CreditNoteDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { creditNoteNumber } = useParams();

    const { items: creditNotes } = useSelector((state) => state.creditNotes);
    const { items: customers } = useSelector((state) => state.customers);
    const { items: invoices } = useSelector((state) => state.invoices);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const creditNote = creditNotes.find(cn => cn.creditNoteNumber === creditNoteNumber);

    if (!creditNote) {
        return <div className="text-center text-red-400">{t('creditNoteNotFound')}</div>;
    }

    const customer = customers.find(c => c.id === creditNote.customerId);

    const handleApplyCredit = (invoiceId) => {
        const invoiceToApply = invoices.find(inv => inv.id === parseInt(invoiceId));
        const amountToApply = Math.min(invoiceToApply.total, creditNote.amount);

        if (window.confirm(t('confirmApplyCreditNote', { amount: amountToApply.toFixed(2), invoiceNumber: invoiceToApply.invoiceNumber }))) {
            dispatch(applyCreditToInvoice({
                invoiceId: parseInt(invoiceId),
                creditAmount: amountToApply,
                creditNoteNumber: creditNote.creditNoteNumber
            }));
            dispatch(applyCreditNote({
                creditNoteId: creditNote.id,
                invoiceId: parseInt(invoiceId),
                amountApplied: amountToApply
            }));
            showToast(t('creditNoteAppliedSuccessfully'), 'success');
            setIsModalOpen(false);
        }
    };

    const initialAmount = creditNote.applications ? creditNote.amount + creditNote.applications.reduce((sum, app) => sum + app.amount, 0) : creditNote.amount;

    return (
        <>
            <div className="space-y-6">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-custom-light-blue mb-4">
                        <ArrowLeft size={18} />
                        <span>{t('backToCreditNotes')}</span>
                    </button>
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold text-white">{t('creditNoteNumberHeading', { creditNoteNumber: creditNote.creditNoteNumber })}</h2>
                        <span className={`status-pill ${creditNote.status === 'applied' ? 'status-completed' : 'status-pending'}`}>{t(creditNote.status)}</span>
                    </div>
                </div>

                {creditNote.status === 'open' && (
                    <div className="flex space-x-4">
                        <Button onClick={() => setIsModalOpen(true)} variant="primary" className="flex items-center space-x-2">
                            <CheckCircle size={16} />
                            <span>{t('applyCredit')}</span>
                        </Button>
                    </div>
                )}

                <div className="glass-panel p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-custom-grey">{t('customer')}</p>
                            <Link to={`/customers/${customer?.id}`} className="text-lg font-semibold text-blue-400 hover:underline">{customer?.name || 'N/A'}</Link>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-custom-grey">{t('remainingCredit')}</p>
                            <p className="text-2xl font-bold text-white">${creditNote.amount.toFixed(2)}</p>
                            <p className="text-xs text-custom-grey">{t('initialAmount')}: ${initialAmount.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-custom-grey">{t('issueDate')}</p>
                            <p className="text-lg font-semibold">{creditNote.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-custom-grey">{t('reason')}</p>
                            <p className="text-lg font-semibold">{creditNote.reason}</p>
                        </div>
                        {creditNote.applications && (
                            <div className="md:col-span-2">
                                <p className="text-sm text-custom-grey">{t('applicationHistory')}</p>
                                <ul className="text-sm list-disc list-inside">
                                    {creditNote.applications.map((app, index) => {
                                        const appliedInvoice = invoices.find(inv => inv.id === app.invoiceId);
                                        return (
                                            <li key={index}>
                                                Applied ${app.amount.toFixed(2)} to invoice <Link to={`/invoices/${appliedInvoice?.invoiceNumber}`} className="text-blue-400 hover:underline">{appliedInvoice?.invoiceNumber}</Link> on {app.date}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal title={t('applyCreditToInvoice')} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} footer={<></>}>
                <ApplyCreditModal
                    creditNote={creditNote}
                    invoices={invoices}
                    onApply={handleApplyCredit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
};

export default CreditNoteDetailsPage;