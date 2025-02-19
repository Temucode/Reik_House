// src/components/SalesStats.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistre les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SaleStats {
  date: string;
  vente_journaliere: number;
  vente_hebdomadaire: number;
  vente_mensuelle: number;
  vente_annuelle: number;
}

const SalesStats: React.FC = () => {
  const [stats, setStats] = useState<SaleStats[]>([]);

  useEffect(() => {
    const fetchSalesStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/ventes/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erreur de récupération des statistiques', error);
      }
    };

    fetchSalesStats();
  }, []);

  const data = {
    labels: stats.map(stat => stat.date), // Date des ventes
    datasets: [
      {
        label: 'Ventes Journalières',
        data: stats.map(stat => stat.vente_journaliere),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Ventes Hebdomadaires',
        data: stats.map(stat => stat.vente_hebdomadaire),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
      {
        label: 'Ventes Mensuelles',
        data: stats.map(stat => stat.vente_mensuelle),
        borderColor: 'rgba(255,159,64,1)',
        fill: false,
      },
      {
        label: 'Ventes Annuelles',
        data: stats.map(stat => stat.vente_annuelle),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h2>Statistiques des Ventes</h2>
      <Line data={data} />
    </div>
  );
};

export default SalesStats;
