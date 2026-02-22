import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const RadarChart = ({ data }) => {
    // Expected data format: { clarity, structure, grammar, atsCompatibility, relevancy }
    // Default values if data is missing
    const scores = [
        data?.clarity || 0,
        data?.structure || 0,
        data?.grammar || 0,
        data?.atsCompatibility || 0,
        data?.relevancy || 0
    ];

    const chartData = {
        labels: ['Clarity', 'Structure', 'Grammar', 'ATS Compatibility', 'Relevancy'],
        datasets: [
            {
                label: 'Resume Quality Score',
                data: scores,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: {
                    stepSize: 2
                }
            }
        }
    };

    return <Radar data={chartData} options={options} />;
};

export default RadarChart;
