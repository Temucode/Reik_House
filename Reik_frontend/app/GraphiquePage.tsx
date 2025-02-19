// app/GraphiquePage.tsx
import React from 'react';
import SalesStats from '../components/SalesStats';

const GraphiquePage: React.FC = () => {
  return (
    <div>
      <h1>Graphique des Ventes</h1>
      <SalesStats />
    </div>
  );
};

export default GraphiquePage;
