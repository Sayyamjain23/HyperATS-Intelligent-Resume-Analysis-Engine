import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const uniqueList = (items) => {
    if (!Array.isArray(items)) return [];
    return [...new Set(items
        .filter((item) => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim().toLowerCase()))];
};

const SkillChart = ({ matchedSkills = [], missingSkills = [], allDetectedSkills = [] }) => {
    const normalizedMatched = uniqueList(matchedSkills);
    const normalizedMissing = uniqueList(missingSkills);
    const normalizedDetected = uniqueList(allDetectedSkills);

    const matchedCount = normalizedMatched.length > 0
        ? normalizedMatched.length
        : Math.max(0, normalizedDetected.length - normalizedMissing.length);

    const missingCount = normalizedMissing.length;
    const totalTargetSkills = matchedCount + missingCount;
    const coveragePct = totalTargetSkills > 0
        ? Math.round((matchedCount / totalTargetSkills) * 100)
        : 0;

    const data = {
        labels: ['Matched', 'Missing'],
        datasets: [
            {
                label: 'Skill Count',
                data: [matchedCount, missingCount],
                backgroundColor: ['rgba(34, 197, 94, 0.65)', 'rgba(239, 68, 68, 0.65)'],
                borderColor: ['rgb(34, 197, 94)', 'rgb(239, 68, 68)'],
                borderWidth: 1,
                borderRadius: 8,
                maxBarThickness: 70,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Skill Coverage Analysis',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.label}: ${ctx.parsed.y} skills`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.2)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="space-y-4">
            <div className="h-64">
                <Bar options={options} data={data} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="rounded-lg bg-green-50 border border-green-200 p-3">
                    <div className="text-green-700 font-semibold">Matched Skills</div>
                    <div className="text-xl font-bold text-green-800">{matchedCount}</div>
                </div>
                <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                    <div className="text-red-700 font-semibold">Missing Skills</div>
                    <div className="text-xl font-bold text-red-800">{missingCount}</div>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                    <div className="text-blue-700 font-semibold">Coverage</div>
                    <div className="text-xl font-bold text-blue-800">{coveragePct}%</div>
                </div>
            </div>

            {totalTargetSkills === 0 && (
                <p className="text-sm text-gray-500">
                    No job-targeted skills were detected yet. Add a detailed job description to improve skill coverage analysis.
                </p>
            )}
        </div>
    );
};

export default SkillChart;
