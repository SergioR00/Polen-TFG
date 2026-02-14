import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Pollutants() {

    const [pollutants, setPollutants] = useState([
        { name: 'Nitrogen Dioxide', symbol: 'NO₂', level: '', status: '', unit: 'µg/m³', excellentLevel: '20', goodLevel: '40', moderateLevel: '90' },
        { name: 'Ozone', symbol: 'O₃', level: '', status: '', unit: 'µg/m³', excellentLevel: '25', goodLevel: '50', moderateLevel: '100' },
        { name: 'Particulate Matter 10', symbol: 'PM10', level: '', status: '', unit: 'µg/m³', excellentLevel: '10', goodLevel: '20', moderateLevel: '40' },
        { name: 'Particulate Matter 2.5', symbol: 'PM2.5', level: '', status: '', unit: 'µg/m³', excellentLevel: '5', goodLevel: '10', moderateLevel: '20' },
        { name: 'Carbon Monoxide', symbol: 'CO', level: '', status: '', unit: 'mg/m³', excellentLevel: '2.5', goodLevel: '5', moderateLevel: '9' },
        { name: 'Sulphur Dioxide', symbol: 'SO₂', level: '', status: '', unit: 'µg/m³', excellentLevel: '50', goodLevel: '100', moderateLevel: '200' },
    ]);

    function getStatus(level: number, pollutant: any) {
        let status = 'bad';
        if (level <= parseFloat(pollutant.excellentLevel)) {
            status = 'excellent';
        } else if (level <= parseFloat(pollutant.goodLevel)) {
            status = 'good';
        } else if (level <= parseFloat(pollutant.moderateLevel)) {
            status = 'moderate';
        }
        return status;
    }

    const getPollutants = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/pollutants");
            const datos = response.data;
			
            const updatedData = pollutants.map((pollutant) => {
                const cleanKey = pollutant.symbol.toUpperCase().replace('₂', '2').replace('₃', '3').replace(/\s/g, '').trim();
                const value = datos[cleanKey];
				console.log(datos[cleanKey], cleanKey);

                if (value !== undefined) {
                    const status = getStatus(Number(value), pollutant);
                    return {
                        ...pollutant,
                        level: value.toString(),
                        status: status,
                    };
                }
                return pollutant;
            });

            setPollutants(updatedData);

			console.log("Datos de contaminantes actualizados:", updatedData);

        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    useEffect(() => {
        getPollutants();
    }, []);

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 mt-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Current Pollutant Levels</h2>
                <p className="text-gray-500 mt-2 font-medium">Detailed concentration levels for atmospheric agents today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pollutants.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner ${getStatusColor(item.status)}`}>
                                {item.symbol}
                            </div>
                            <div>
                                <h3 className="font-extrabold text-gray-800 leading-tight">{item.name}</h3>
                                <div className="flex items-center mt-1">
                                    <span className={`h-2 w-2 rounded-full mr-2 ${getDotColor(item.status)}`}></span>
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

function getStatusColor(status: string) {
    const map: any = {
        excellent: "bg-blue-50 text-blue-600",
        good: "bg-green-50 text-green-600",
        moderate: "bg-orange-50 text-orange-600",
        bad: "bg-red-50 text-red-600",
        loading: "bg-gray-50 text-gray-400"
    };
    return map[status] || "bg-gray-50 text-gray-400";
}

function getDotColor(status: string) {
    const map: any = {
        excellent: "bg-blue-500",
        good: "bg-green-500",
        moderate: "bg-orange-500",
        bad: "bg-red-500",
        loading: "bg-gray-300"
    };
    return map[status] || "bg-gray-300";
}

export default Pollutants;