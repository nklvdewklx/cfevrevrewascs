import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // NEW: Import useTranslation

const UnauthorizedPage = () => {
    const { t } = useTranslation(); // NEW: Get translation function
    return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <h1 className="text-4xl font-bold">{t('unauthorizedTitle')}</h1>
            <p className="mt-4 text-lg">{t('unauthorizedMessage')}</p>
            <Link to="/" className="mt-6 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
                {t('goToHomepage')}
            </Link>
        </div>
    );
};

export default UnauthorizedPage;