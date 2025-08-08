import React from 'react';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


const AgentRoutePage = () => {
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const customers = useSelector((state) => state.customers.items);

    // Filter customers assigned to the current agent
    const myCustomers = customers.filter(c => c.agentId === user.id);
    const agentPosition = [52.370216, 4.895168]; // Agent's current location (Hardcoded for now)

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{t('todaysSchedule')}</h2>
            </div>

            <div className="h-64 w-full rounded-lg overflow-hidden">
                <MapContainer center={agentPosition} zoom={10} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {myCustomers.map(customer => (
                        customer.lat && customer.lng && (
                            <Marker key={customer.id} position={[customer.lat, customer.lng]}>
                                <Popup>{customer.name} - {customer.company}</Popup>
                            </Marker>
                        )
                    ))}
                    <Marker position={agentPosition}>
                        <Popup>{t('yourLocation')}</Popup>
                    </Marker>
                </MapContainer>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg">
                <Navigation size={20} />
                <span>{t('calculateOptimalRoute')}</span>
            </button>

            <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t('destinations')}</h3>
                {myCustomers.map(customer => (
                    <div key={customer.id} className="bg-gray-800 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="font-semibold text-white">{customer.name}</h4>
                            <p className="text-sm text-gray-400">{customer.company}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentRoutePage;