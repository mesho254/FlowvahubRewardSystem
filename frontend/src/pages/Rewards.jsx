import React from 'react';
import Header from '../components/Header.jsx';
import RewardBalance from '../components/RewardBalance.jsx';
import Referral from '../components/Referral.jsx';
import Missions from '../components/Missions.jsx';
import RewardsCatalog from '../components/RewardsCatalog.jsx';

const Rewards = () => (
    <>
        <Header />
        <RewardBalance />
        <Referral />
        <Missions />
        <RewardsCatalog />
    </>
);

export default Rewards;