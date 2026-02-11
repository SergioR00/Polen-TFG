import React from 'react';

function Pollutants() {

  // Datos inventados
  const pollutantsData = [
    { name: 'Nitrogen Dioxide', symbol: 'NO₂', level: '15.4', unit: 'µg/m³', status: 'Good', color: 'green' },
    { name: 'Ozone', symbol: 'O₃', level: '84.2', unit: 'µg/m³', status: 'Moderate', color: 'orange' },
    { name: 'Particulate Matter 10', symbol: 'PM10', level: '22.1', unit: 'µg/m³', status: 'Good', color: 'green' },
    { name: 'Particulate Matter 2.5', symbol: 'PM2.5', level: '12.5', unit: 'µg/m³', status: 'Good', color: 'green' },
    { name: 'Carbon Monoxide', symbol: 'CO', level: '0.4', unit: 'mg/m³', status: 'Excellent', color: 'blue' },
    { name: 'Sulphur Dioxide', symbol: 'SO₂', level: '2.8', unit: 'µg/m³', status: 'Excellent', color: 'blue' },
  ];

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 mt-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Current Pollutant Levels</h2>
        <p className="text-gray-500 mt-2 font-medium">Detailed concentration levels for atmospheric agents today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pollutantsData.map((item, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner ${getStatusColor(item.color)}`}>
                {item.symbol}
              </div>
              <div>
                <h3 className="font-extrabold text-gray-800 leading-tight">{item.name}</h3>
                <div className="flex items-center mt-1">
                   <span className={`h-2 w-2 rounded-full mr-2 ${getDotColor(item.color)}`}></span>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.status}</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-black text-gray-800 tabular-nums">
                {item.level}
              </div>
              <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                {item.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-xl text-center">
        <p className="text-xs text-gray-400 font-medium">
          Last updated: {new Date().toLocaleTimeString()} — Data source: Environmental Monitoring Station
        </p>
      </div>
    </div>
  );
}

function getStatusColor(color: string) {
  const map: any = {
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
  };
  return map[color] || map.blue;
}

function getDotColor(color: string) {
  const map: any = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
  };
  return map[color] || map.blue;
}

export default Pollutants;