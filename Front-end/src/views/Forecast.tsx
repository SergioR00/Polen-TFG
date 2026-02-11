import React from 'react'

function App() {

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* MAIN LAYOUT: TWO COLUMNS */}
      <main className="container mx-auto px-4 py-8">
        
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: DATA (Forecast + History) */}
            <div className="lg:w-1/2 space-y-8">
              
              {/* SECTION: FUTURE PREDICTIONS */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded-full mr-2"></span>
                    Upcoming Forecast
                  </h2>
                  <select className="text-xs border-gray-200 rounded-md bg-white">
                    <option>All Pollens</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <ForecastRow day="Today" level="Moderate" val="4.2" color="blue" />
                  <ForecastRow day="Tomorrow" level="High" val="7.8" color="orange" />
                  <ForecastRow day="Day After" level="Low" val="2.1" color="green" />
                </div>
              </section>

              {/* SECTION: HISTORICAL DATA */}
              <section>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-6 bg-gray-400 rounded-full mr-2"></span>
                  Past 7 Days
                </h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Tree</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <HistoryRow date="Yesterday" tree="3.8" risk="Low" />
                      <HistoryRow date="2 days ago" tree="6.7" risk="High" />
                      <HistoryRow date="3 days ago" tree="5.1" risk="Med" />
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: NON-FUNCTIONAL CHART */}
            <div className="lg:w-1/2">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full min-h-[400px] shadow-sm flex flex-col">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Visual Analytics</h2>
                  <p className="text-sm text-gray-500">Pollen level trends over time</p>
                </div>
                
                {/* Placeholder for Graph */}
                <div className="flex-grow border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center bg-gray-50 group">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-200 mx-auto mb-4 group-hover:text-blue-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-gray-400 font-medium italic">Chart functionality coming soon...</p>
                    <div className="mt-4 flex justify-center space-x-2">
                       <div className="h-2 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                       <div className="h-2 w-12 bg-gray-200 rounded-full animate-pulse delay-75"></div>
                       <div className="h-2 w-10 bg-gray-200 rounded-full animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
      </main>
    </div>
  );
}

function ForecastRow({ day, level, val, color }: any) {
  const colors: any = {
    blue: "text-blue-600 bg-blue-100",
    orange: "text-orange-600 bg-orange-100",
    green: "text-green-600 bg-green-100"
  };
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between hover:border-blue-300 transition group">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg font-bold text-xs ${colors[color]}`}>{day.toUpperCase()}</div>
        <div>
          <p className="font-bold text-gray-800">{level}</p>
          <p className="text-xs text-gray-500">Pollen Index: {val}</p>
        </div>
      </div>
      <div className="flex -space-x-1">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className={`h-1.5 w-6 rounded-full ${i <= parseFloat(val) / 2 ? colors[color].split(' ')[1] : 'bg-gray-100'}`}></div>
        ))}
      </div>
    </div>
  );
}

function HistoryRow({ date, tree, risk }: any) {
  const riskColors: any = { High: "text-red-600", Med: "text-orange-600", Low: "text-green-600" };
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-gray-600">{date}</td>
      <td className="px-4 py-3 text-gray-800 font-medium">{tree}</td>
      <td className={`px-4 py-3 font-bold text-xs uppercase ${riskColors[risk]}`}>{risk}</td>
    </tr>
  );
}

export default App;