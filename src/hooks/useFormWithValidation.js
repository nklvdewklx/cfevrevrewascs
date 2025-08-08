import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const useFormWithValidation = (defaultValues, onSave, resolver) => {
    const { t } = useTranslation();
    // UPDATED: Destructure 'control' from useForm
    const { register, handleSubmit, formState: { errors }, control } = useForm({
        defaultValues,
        resolver,
        mode: 'onTouched',
    });

    const onSubmit = (data) => {
        onSave(data);
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        t,
        control 
    };
};