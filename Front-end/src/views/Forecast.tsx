import React, { useEffect, useState } from 'react'
import axios from 'axios';

interface PolenInfo {
    historical: { value: number; isPrediction: boolean; }[];
    prediction: {
        today: { value: number; isPrediction: boolean; };
        tomorrow: { value: number; isPrediction: boolean; };
        day_after_tomorrow: { value: number; isPrediction: boolean; };
    };
}

function App() {
    const POLEN_CONFIG: Record<string, { max: number; low: number; med: number }> = {
        Gramineas: { max: 100, low: 10, med: 50 },
        Olivo: { max: 200, low: 50, med: 150 },
        Cupresacea: { max: 250, low: 50, med: 200 },
        Platano_de_paseo: { max: 200, low: 50, med: 150 },
        Quenopodiaceas: { max: 20, low: 5, med: 10 },
        Urticaceas: { max: 60, low: 10, med: 40 },
    };

    const [polenData, setPolenData] = useState<Record<string, PolenInfo>>({});
    const [selectedPolen, setSelectedPolen] = useState<string[]>(() => {
        const saved = localStorage.getItem("selected_polen_vars");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("selected_polen_vars", JSON.stringify(selectedPolen));
    }, [selectedPolen]);

    const getPolen = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8080/prediction");
            setPolenData(response.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };

    useEffect(() => { getPolen(); }, []);

    const togglePolen = (option: string) => {
        setSelectedPolen((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const getBarColor = (val: number, isPred: boolean, config: any) => {
        if (val < config.low) return isPred ? "bg-green-100 border-green-300" : "bg-green-500 border-green-600";
        if (val <= config.med) return isPred ? "bg-orange-100 border-orange-300" : "bg-orange-500 border-orange-600";
        return isPred ? "bg-red-100 border-red-300" : "bg-red-500 border-red-600";
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <main className="container mx-auto max-w-4xl">
                
                {/* SELECTOR DE CHIPS CENTRADO */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {Object.keys(POLEN_CONFIG).map(name => (
                        <button key={name} onClick={() => togglePolen(name)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                selectedPolen.includes(name) 
                                ? "bg-blue-600 text-white shadow-md scale-105" 
                                : "bg-white text-gray-400 border border-gray-200 hover:border-blue-300"
                            }`}>
                            {name.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                {/* PANEL DE GRÁFICAS */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                    
                    {/* CABECERA CON LEYENDA */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-4 border-b border-gray-50 pb-6">
                        <div>
                            <h2 className="text-2xl font-black text-gray-800 tracking-tight">Tendencia de Polen</h2>
                            <p className="text-gray-400 text-sm font-medium">Historial últimos 7 días y predicción</p>
                        </div>
                        
                        <div className="flex gap-5 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-gray-500 rounded-sm shadow-sm"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase">Real</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 bg-gray-100 border border-dashed border-gray-400 rounded-sm"></div>
                                <span className="text-[10px] font-black text-gray-500 uppercase">Predicción</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-16">
                        {selectedPolen.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="text-blue-100 mb-4 flex justify-center">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                </div>
                                <p className="text-gray-300 font-bold italic">Selecciona tipos de polen para visualizar las gráficas</p>
                            </div>
                        ) : (
                            selectedPolen.map(name => {
                                const info = polenData[name];
                                const config = POLEN_CONFIG[name];
                                if (!info || !config) return null;
                                const allDays = [
                                    ...info.historical,
                                    info.prediction.today,
                                    info.prediction.tomorrow,
                                    info.prediction.day_after_tomorrow
                                ];

                                return (
                                    <div key={name} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="flex justify-between items-end mb-5">
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-lg">
                                                {name.replace(/_/g, ' ')}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 font-bold italic font-serif">
                                                Límite: {config.max} gr/m³
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-end h-36 gap-1.5 sm:gap-2">
                                            {allDays.map((v, i) => {
                                                const heightPct = Math.min((v.value / config.max) * 100, 100);
                                                
                                                const isToday = i === 7;
                                                const isTomorrow = i === 8;
                                                const isAfter = i === 9;
                                                
                                                let label = "";
                                                if (isToday) label = "Hoy";
                                                if (isTomorrow) label = "Mañana";
                                                if (isAfter) label = "Pasado";

                                                return (
                                                    <React.Fragment key={i}>
                                                        {/* LÍNEA DIVISORIA: Se dibuja justo antes de la barra de "Hoy" */}
                                                        {isToday && (
                                                            <div className="w-[1px] h-full bg-gray-300 mx-1 self-stretch pb-6 flex items-end">
                                                                <div className="w-full h-[calc(100%-12px)] bg-gray-300 rounded-full"></div>
                                                            </div>
                                                        )}

                                                        <div className="flex-1 flex flex-col items-center h-full justify-end group">
                                                            <div 
                                                                className={`w-full rounded-t-lg transition-all relative border-t border-x 
                                                                    ${v.isPrediction ? 'border-dashed' : 'border-solid'} 
                                                                    ${getBarColor(v.value, v.isPrediction, config)} 
                                                                    group-hover:brightness-105 shadow-sm`} 
                                                                style={{ height: `${heightPct}%` }}
                                                            >
                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 font-black">
                                                                    {v.value} <span className="text-[8px] text-gray-400 font-normal">gr/m³</span>
                                                                </div>
                                                            </div>
                                                            <span className={`text-[9px] mt-3 font-black uppercase tracking-tighter transition-colors
                                                                ${label ? 'text-gray-600' : 'text-gray-300'}`}>
                                                                {label || "•"}
                                                            </span>
                                                        </div>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;