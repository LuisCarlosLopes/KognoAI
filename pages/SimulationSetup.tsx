import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Subject, SimulationMode } from '../types';
import { ChevronLeft, Zap, Clock, BookOpenCheck } from 'lucide-react';

export const SimulationSetup: React.FC = () => {
  const { profile } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.MATH);
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [mode, setMode] = useState<SimulationMode>(SimulationMode.STANDARD);

  useEffect(() => {
    const subParam = searchParams.get('subject');
    if (subParam) {
        const match = Object.values(Subject).find(s => s === subParam);
        if (match) setSelectedSubject(match);
    }
  }, [searchParams]);

  const startSimulation = () => {
    const params = new URLSearchParams();
    params.append('subject', selectedSubject);
    params.append('count', questionCount.toString());
    params.append('mode', mode);
    navigate(`/simulation/run?${params.toString()}`);
  };

  return (
    <Layout className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center max-w-4xl mx-auto w-full">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold ml-2">Configurar Simulado</h1>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 no-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 pt-2">
            
            {/* Mode Selection */}
            <section>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Modo de Estudo</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setMode(SimulationMode.STANDARD)}
                        className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                            mode === SimulationMode.STANDARD
                            ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500'
                            : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${mode === SimulationMode.STANDARD ? 'bg-brand-200 text-brand-800' : 'bg-gray-100 text-gray-500'}`}>
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${mode === SimulationMode.STANDARD ? 'text-brand-900' : 'text-gray-700'}`}>Simulado Padrão</p>
                                <p className="text-xs text-gray-500 mt-1 leading-snug">Cronometrado. Ideal para testar agilidade e simular a pressão da prova.</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setMode(SimulationMode.PRACTICE)}
                        className={`p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                            mode === SimulationMode.PRACTICE
                            ? 'bg-green-50 border-green-500 ring-2 ring-green-500'
                            : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                        }`}
                    >
                        <div className="flex items-start gap-3">
                             <div className={`p-2 rounded-lg ${mode === SimulationMode.PRACTICE ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                                <BookOpenCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${mode === SimulationMode.PRACTICE ? 'text-green-900' : 'text-gray-700'}`}>Modo Prática</p>
                                <p className="text-xs text-gray-500 mt-1 leading-snug">Sem tempo. Gabarito comentado detalhado pela IA após cada questão.</p>
                            </div>
                        </div>
                    </button>
                </div>
            </section>

            {/* Subject Selection */}
            <section>
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Área do Conhecimento</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.values(Subject).map((sub) => (
                    <button
                        key={sub}
                        onClick={() => setSelectedSubject(sub)}
                        className={`text-left p-4 rounded-xl border transition-all flex items-center justify-between active:scale-[0.99] ${
                        selectedSubject === sub 
                            ? 'border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500 shadow-sm' 
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                        <span className="text-sm font-semibold">{sub}</span>
                        {selectedSubject === sub && (
                            <div className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(14,165,233,0.6)]"></div>
                        )}
                    </button>
                    ))}
                </div>
            </section>

            {/* Count Selection */}
            <section className="pb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Quantidade de Questões</label>
                <div className="flex gap-3 max-w-md">
                    {[3, 5, 10].map((count) => (
                    <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={`flex-1 py-4 rounded-xl font-bold border transition-all active:scale-95 ${
                        questionCount === count 
                            ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {count}
                    </button>
                    ))}
                </div>
            </section>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-100 flex-shrink-0 z-10">
        <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="bg-yellow-50 px-4 py-3 rounded-xl flex gap-3 border border-yellow-100 md:flex-1 md:mr-4">
                <Zap className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                    Nível do Simulado: <strong>{profile.proficiencies[selectedSubject]}</strong> (Adaptativo)
                </p>
            </div>

            <Button 
                fullWidth 
                onClick={startSimulation} 
                variant="primary" 
                className="md:w-auto md:min-w-[240px] md:ml-auto"
            >
                {mode === SimulationMode.PRACTICE ? 'Iniciar Prática' : 'Gerar Simulado'}
            </Button>
        </div>
      </div>
    </Layout>
  );
};