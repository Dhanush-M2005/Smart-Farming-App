import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

const priceData = [
  { name: 'Jan', wheat: 2200, rice: 1800 },
  { name: 'Feb', wheat: 2300, rice: 1850 },
  { name: 'Mar', wheat: 2150, rice: 1900 },
  { name: 'Apr', wheat: 2400, rice: 1950 },
  { name: 'May', wheat: 2500, rice: 2000 },
  { name: 'Jun', wheat: 2450, rice: 1980 },
];

const yieldData = [
  { name: '2020', yield: 45 },
  { name: '2021', yield: 52 },
  { name: '2022', yield: 48 },
  { name: '2023', yield: 61 },
  { name: '2024', yield: 58 },
];

const growthData = [
  { week: 'W1', height: 10, moisture: 30 },
  { week: 'W2', height: 15, moisture: 45 },
  { week: 'W3', height: 28, moisture: 50 },
  { week: 'W4', height: 35, moisture: 60 },
  { week: 'W5', height: 42, moisture: 55 },
  { week: 'W6', height: 50, moisture: 65 },
];

export const PriceTrendChart = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
    <h3 className="text-gray-800 font-semibold mb-4">Market Price Trends (₹/quintal)</h3>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={priceData}>
          <defs>
            <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorRice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ca8a04" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ca8a04" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
          <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
          <Area type="monotone" dataKey="wheat" stroke="#16a34a" fillOpacity={1} fill="url(#colorWheat)" strokeWidth={2} name="Wheat" />
          <Area type="monotone" dataKey="rice" stroke="#ca8a04" fillOpacity={1} fill="url(#colorRice)" strokeWidth={2} name="Rice" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const YieldChart = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-gray-800 font-semibold mb-4">Annual Crop Yield</h3>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={yieldData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
          <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
          <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
          <Bar dataKey="yield" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const GrowthChart = () => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-gray-800 font-bold">Plant growth activity</h3>
      <select className="bg-gray-50 border border-gray-200 text-xs rounded-lg px-2 py-1 outline-none">
        <option>Weekly</option>
        <option>Monthly</option>
      </select>
    </div>
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
            labelStyle={{color: '#374151', fontWeight: 'bold'}}
          />
          <Line type="monotone" dataKey="height" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
          <Line type="monotone" dataKey="moisture" stroke="#60a5fa" strokeWidth={3} dot={{r: 4, fill: '#60a5fa', strokeWidth: 2, stroke: '#fff'}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="flex gap-4 mt-2 justify-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span className="text-xs text-gray-500">Height (cm)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
        <span className="text-xs text-gray-500">Moisture (%)</span>
      </div>
    </div>
  </div>
);

export const FinancialGauge = () => (
  <div className="bg-[#0f4c3a] p-6 rounded-2xl text-white relative overflow-hidden">
    <h3 className="font-bold mb-6 text-center">Financial Statistics</h3>
    <div className="relative h-32 flex items-end justify-center">
        {/* Simple CSS Half Circle Gauge Visualization */}
        <div className="w-40 h-20 bg-gray-600 rounded-t-full overflow-hidden relative">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400 to-green-500 origin-bottom transform rotate-45 transition-transform duration-1000" style={{transform: 'rotate(130deg)'}}></div>
        </div>
        <div className="absolute bottom-0 w-32 h-16 bg-[#0f4c3a] rounded-t-full flex items-end justify-center pb-2">
            <div className="text-center">
                <span className="text-3xl font-bold">74%</span>
                <p className="text-[10px] text-gray-300">Total count</p>
            </div>
        </div>
    </div>
    <p className="text-xs text-center text-gray-300 mt-4 px-4">
      Your farm efficiency is above average this season.
    </p>
  </div>
);