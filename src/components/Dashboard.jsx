import React, { useEffect } from 'react';

import { JsonRpcClient } from '@calimero-network/calimero-client';
import { getNodeUrl, getApplicationId, getConfigAndJwt } from '../helpers/helper';
import FamilyPictureVaultApp from './FamilyVault';
const Dashboard = () => {



    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
            <div className="container mx-auto p-4">
                <h1 className="text-5xl font-bold mb-8 text-center pt-8 text-blue-800">Family Picture Vault</h1>
                <p className="text-center text-gray-600 mb-8">Securely store and share your precious family moments</p>
                <FamilyPictureVaultApp />
            </div>
        </div>
    );
};

export default Dashboard;
