import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Este componente recibe los registros y los transforma en gráficos
const DashboardGraficos = ({ registros }) => {
  const moodChartRef = useRef(null);
  const habitsChartRef = useRef(null);

  useEffect(() => {
    if (!registros || registros.length === 0) return;

    // --- Preparamos los datos para los gráficos ---
    // Invertimos los registros para que las fechas vayan de más antiguas a más nuevas
    const registrosOrdenados = [...registros].reverse();
    
    const labels = registrosOrdenados.map(r => new Date(r.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
    
    // Datos para el gráfico de estado de ánimo
    const moodData = registrosOrdenados.map(r => r.estado_animo);

    // Datos para el gráfico de frecuencia de hábitos
    const habitsData = {
      'Gimnasio': registros.filter(r => r.gimnasio).length,
      'Correr': registros.filter(r => r.correr).length,
      'Meditación': registros.filter(r => r.meditacion_min > 0).length,
    };

    // --- Destruimos los gráficos anteriores para evitar duplicados ---
    if (moodChartRef.current?.chartInstance) {
      moodChartRef.current.chartInstance.destroy();
    }
    if (habitsChartRef.current?.chartInstance) {
      habitsChartRef.current.chartInstance.destroy();
    }

    // --- Creamos el Gráfico de Líneas (Estado de Ánimo) ---
    const moodCtx = moodChartRef.current.getContext('2d');
    moodChartRef.current.chartInstance = new Chart(moodCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolución del Estado de Ánimo',
          data: moodData,
          fill: true,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#e5e7eb' } } },
        scales: {
            y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' }, min: 1, max: 10 },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
        }
      }
    });

    // --- Creamos el Gráfico de Barras (Frecuencia de Hábitos) ---
    const habitsCtx = habitsChartRef.current.getContext('2d');
    habitsChartRef.current.chartInstance = new Chart(habitsCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(habitsData),
        datasets: [{
          label: 'Frecuencia de Hábitos (últimos registros)',
          data: Object.values(habitsData),
          backgroundColor: ['rgba(239, 68, 68, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(16, 185, 129, 0.6)'],
          borderColor: ['#ef4444', '#f59e0b', '#10b981'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { ticks: { color: '#9ca3af', stepSize: 1 }, grid: { color: '#374151' } },
            x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
        }
      }
    });

  }, [registros]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Tu Progreso Visual</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold text-white mb-4">Estado de Ánimo</h3>
          <canvas ref={moodChartRef}></canvas>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="font-bold text-white mb-4">Frecuencia de Hábitos</h3>
          <canvas ref={habitsChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraficos;

