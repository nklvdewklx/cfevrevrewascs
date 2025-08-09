import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Button from '../../components/common/Button';

const ApplyCreditModal = ({ creditNote, invoices, onApply, onCancel }) => {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const openInvoices = invoices.filter(inv => inv.customerId === creditNote.customerId && inv.status !== 'paid');

    const onSubmit = (data) => {
        onApply(data.invoiceId);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <p className="text-sm text-custom-grey">{t('creditAmount')}: <span className="text-lg font-bold text-white">${creditNote.amount.toFixed(2)}</span></p>
            </div>
            <div>
                <label className="block mb-1 text-sm text-custom-grey">{t('selectInvoiceToApply')}</label>
                <select
                    {...register('invoiceId', { required: t('invoiceIsRequired') })}
                    className="form-input"
                >
                    <option value="">{t('selectInvoice')}</option>
                    {openInvoices.map(inv => (
                        <option key={inv.id} value={inv.id}>
                            {inv.invoiceNumber} - {t('due')}: ${inv.total.toFixed(2)}
                        </option>
                    ))}
                </select>
                {errors.invoiceId && <p className="text-red-400 text-xs mt-1">{errors.invoiceId.message}</p>}
                {openInvoices.length === 0 && <p className="text-yellow-400 text-xs mt-1">{t('noOpenInvoicesForCustomer')}</p>}
            </div>

            <div className="pt-4 flex justify-end space-x-4">
                <Button type="button" onClick={onCancel} variant="secondary">{t('cancel')}</Button>
                <Button type="submit" variant="primary" disabled={openInvoices.length === 0}>{t('applyCredit')}</Button>
            </div>
        </form>
    );
};

export default ApplyCreditModal;