import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { updateCreditNote } from './creditNotesSlice';
import { showToast } from '../../lib/toast';
import Button from '../../components/common/Button';

const CreditNoteDetailsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { creditNoteNumber } = useParams();

    const { items: creditNotes } = useSelector((state) => state.creditNotes);
    const { items: customers } = useSelector((state) => state.customers);

    const creditNote = creditNotes.find(cn => cn.creditNoteNumber === creditNoteNumber);

    if (!creditNote) {
        return <div className="text-center text-red-400">{t('creditNoteNotFound')}</div>;
    }

    const customer = customers.find(c => c.id === creditNote.customerId);

    const handleApplyCreditNote = () => {
        if (window.confirm(t('confirmApplyCreditNote'))) {
            dispatch(updateCreditNote({ ...creditNote, status: 'applied' }));
            showToast(t('creditNoteAppliedSuccessfully'), 'success');
        }
    };

    return (
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
                    <Button onClick={handleApplyCreditNote} variant="primary" className="flex items-center space-x-2">
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
                        <p className="text-sm text-custom-grey">{t('amount')}</p>
                        <p className="text-2xl font-bold text-white">${creditNote.amount.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-custom-grey">{t('issueDate')}</p>
                        <p className="text-lg font-semibold">{creditNote.date}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-custom-grey">{t('reason')}</p>
                        <p className="text-lg font-semibold">{creditNote.reason}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditNoteDetailsPage;