import React, { useEffect, useState } from 'react'
import axios from 'axios';

interface PolenInfo {
    historical: number[];
    prediction: {
        today: number;
        tomorrow: number;
        day_after_tomorrow: number;
    };
}

function App() {
    const medPolen = 150;
    const lowPolen = 50;
	const options = ["Gramineas", "Olivo", "Cupresacea", "Platano_de_paseo", "Quenopodiaceas", "Urticaceas"];
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
            const response = await axios.get("http://127.0.0.1:8000/prediction");
            setPolenData(response.data);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        }
    };
    useEffect(() => {
        getPolen();
    }, []);

    const togglePolen = (option: string) => {
        setSelectedPolen((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const getRisk = (value: number) => {
        if (value < lowPolen) return { label: "Low", color: "green" };
        if (value <= medPolen) return { label: "Moderate", color: "orange" };
        return { label: "High", color: "red" };
    };

    const renderDaySection = (label: string, dayKey: keyof PolenInfo['prediction']) => {
        if (selectedPolen.length === 0) return null;

        return (
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-lg font-black text-blue-900 border-b-2 border-blue-100 pb-1 flex justify-between items-end">
                    {label}
                    <span className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Predicción</span>
                </h3>
                {selectedPolen.map(name => {
                    const info = polenData[name];
                    if (!info) return null;
                    const value = info.prediction[dayKey];
                    return (
                        <ForecastRow 
                            key={`${dayKey}-${name}`} 
                            name={name.replace(/_/g, ' ')} 
                            val={value} 
                            risk={getRisk(value)} 
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <main className="container mx-auto">
                {/* SELECTOR DE CHIPS */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {options.map(opt => (
                        <button key={opt} onClick={() => togglePolen(opt)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                selectedPolen.includes(opt) 
                                ? "bg-blue-600 text-white shadow-md scale-105" 
                                : "bg-white text-gray-400 border border-gray-200 hover:border-blue-300"
                            }`}>
                            {opt.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* COLUMNA IZQUIERDA: PREDICCIONES POR DÍA */}
                    <div className="lg:w-1/2 space-y-10">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full mr-2"></span>
                            Próximos 3 días
                        </h2>

                        {selectedPolen.length === 0 ? (
                            <p className="text-gray-400 italic">Selecciona tipos de polen para ver el desglose por días.</p>
                        ) : (
                            <>
                                {renderDaySection("Hoy", "today")}
                                {renderDaySection("Mañana", "tomorrow")}
                                {renderDaySection("Pasado", "day_after_tomorrow")}
                            </>
                        )}
                    </div>

                    {/* COLUMNA DERECHA: HISTÓRICO (SE MANTIENE IGUAL) */}
                    <div className="lg:w-1/2">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-6">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Tendencia (7 días)</h2>
                            <div className="space-y-8">
                                {selectedPolen.map(name => {
                                    const info = polenData[name];
                                    if (!info) return null;
                                    return (
                                        <div key={name} className="animate-in fade-in duration-500">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs font-bold text-gray-500 uppercase">{name.replace(/_/g, ' ')}</p>
                                                <span className="text-[10px] text-gray-400 font-medium">Últimos valores</span>
                                            </div>
                                            <div className="flex items-end h-20 gap-1.5">
                                                {info.historical.map((v, i) => (
                                                    <div key={i} className="flex-1 bg-blue-50 rounded-t-md hover:bg-blue-500 transition-all group relative border-b border-blue-100" 
                                                         style={{ height: `${Math.min((v / 300) * 100, 100)}%` }}>
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                            {v}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                {selectedPolen.length === 0 && (
                                    <div className="h-40 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
                                        <p className="text-gray-300 text-sm">Sin datos históricos que mostrar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function ForecastRow({ name, val, risk }: any) {
    const colors: any = {
        green: "bg-green-100 text-green-700 border-green-200",
        orange: "bg-orange-100 text-orange-700 border-orange-200",
        red: "bg-red-100 text-red-700 border-red-200"
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <span className="font-bold text-gray-700 w-32 text-xs uppercase">{name}</span>
            <div className="flex-1 px-4 text-center">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${colors[risk.color]}`}>
                    {risk.label}
                </span>
            </div>
            <div className="text-right">
                <span className="text-xl font-black text-gray-800 tabular-nums">{val}</span>
                <span className="text-[10px] text-gray-400 ml-1 font-bold italic font-serif">gr/m³</span>
            </div>
        </div>
    );
}

export default App;