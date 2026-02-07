import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { day: 'Mon', mood: 3 },
    { day: 'Tue', mood: 4 },
    { day: 'Wed', mood: 2 },
    { day: 'Thu', mood: 5 },
    { day: 'Fri', mood: 4 },
    { day: 'Sat', mood: 4 },
    { day: 'Sun', mood: 5 },
];

const ReportChart = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-green-700">Weekly Mood Trends</h2>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} label={{ value: 'Mood Score', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
                1 = Sad, 5 = Happy
            </div>
        </div>
    );
};

export default ReportChart;
