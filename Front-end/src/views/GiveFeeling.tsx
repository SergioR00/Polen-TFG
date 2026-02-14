import React, { useState } from 'react';
import axios from "axios";
import { useOutletContext } from 'react-router';

function GiveFeeling() {
	const email = useOutletContext();
	const [feeling, setFeeling] = useState("");
	const [intensity, setIntensity] = useState<number | null>(null);

	const [message, setMessage] = useState("");
	const [isError, setIsError] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			setIsError(true);
			setMessage("Error: Debes estar logueado.");
			return;
		}
		axios.post("http://127.0.0.1:8000/feelings/create_feeling", {
			email,
			intensity,
			feeling
		})
		.then((response) => {
			setIsError(false);
			setMessage("Thank you for sharing your status!");
			setFeeling('');
			setIntensity(null);
		})
		.catch((error) => {
			console.log("Error in the request:", error.message);
		});
	};

	return (
		<div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6">
			<div className="text-center mb-8">
			<h2 className="text-3xl font-black text-gray-800 tracking-tight">How do you feel today?</h2>
			<p className="text-gray-500 mt-2 font-medium">Your personal report helps us understand the local impact of pollen.</p>
		</div>

		<form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
			<div>
			<label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest text-center">
				Symptom Intensity
			</label>
			<div className="flex justify-between gap-2">
				{[1, 2, 3, 4, 5].map((level) => (
				<button
					key={level}
					type="button"
					onClick={() => setIntensity(level)}
					className={`flex-1 py-4 rounded-2xl font-black transition-all transform active:scale-95 ${
					intensity === level
						? 'bg-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-1'
						: 'bg-gray-50 text-gray-400 hover:bg-gray-100'
					}`}
				>
					{level}
				</button>
				))}
			</div>
			<div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
				<span>Perfect</span>
				<span>Unbearable</span>
			</div>
			</div>

			<div>
			<label htmlFor="feeling" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">
				Describe your symptoms
			</label>
			<textarea
				id="feeling"
				rows={5}
				value={feeling}
				onChange={(e) => setFeeling(e.target.value)}
				placeholder="E.g. My eyes are itching a lot today and I've been sneezing since I woke up..."
				className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none text-gray-700 font-medium"
			/>
			</div>
			
			<button
			type="submit"
			disabled={!feeling || !intensity}
			className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${
				feeling && intensity
				? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5'
				: 'bg-gray-100 text-gray-300 cursor-not-allowed'
			}`}
			>
			Send Report
			</button>
			{message && (
                <p style={{ color: isError ? 'red' : 'green', marginTop: '10px', textAlign: 'center' }}>
                    {message}
                </p>
            )}
		</form>

		<p className="mt-6 text-center text-xs text-gray-400 font-medium">
			Reports are anonymous and used for community statistics.
		</p>
		</div>
	);
}
export default GiveFeeling;