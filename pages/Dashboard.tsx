import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Subject, Proficiency } from '../types';
import { 
  PlayCircle, 
  TrendingUp, 
  AlertTriangle, 
  LogOut, 
  BrainCircuit 
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { profile, resetProfile } = useUser();
  const navigate = useNavigate();

  // Determine weakest subject for recommendation
  const weakestSubject = Object.entries(profile.proficiencies).find(
    ([_, level]) => level === Proficiency.LOW
  )?.[0] as Subject || Subject.MATH;

  const shortSubjectName = (s: string) => {
    if (s.includes('Matemática')) return 'Mat';
    if (s.includes('Humanas')) return 'Hum';
    if (s.includes('Natureza')) return 'Nat';
    if (s.includes('Linguagens')) return 'Ling';
    return s;
  };

  const chartData = Object.entries(profile.proficiencies).map(([sub, level]) => {
    let val = 50;
    if (level === Proficiency.HIGH) val = 90;
    if (level === Proficiency.MEDIUM) val = 60;
    if (level === Proficiency.LOW) val = 30;
    return { subject: shortSubjectName(sub), value: val, fullSubject: sub };
  });

  return (
    <Layout className="flex flex-col md:flex-row">
      {/* 
        Left Panel (Mobile: Top Header / Desktop: Sidebar) 
        Mobile: w-full rounded-b-[2.5rem]
        Desktop: w-1/3 rounded-none h-full
      */}
      <aside className="bg-brand-900 w-full shrink-0 pt-8 pb-16 px-6 rounded-b-[2.5rem] relative z-10 shadow-xl md:w-80 md:h-full md:rounded-none md:py-12 md:px-8 md:flex md:flex-col lg:w-96 transition-all duration-300">
        
        <div className="flex justify-between items-start mb-6 md:mb-10">
          <div>
            <p className="text-brand-100 text-sm font-medium">Olá, {profile.name.split(' ')[0]}</p>
            <h1 className="text-white text-2xl font-bold mt-1 leading-tight">
              Foco:<br/>
              <span className="text-brand-400">{profile.targetCourse}</span>
            </h1>
          </div>
          <button onClick={resetProfile} className="text-brand-200 hover:text-white p-2 md:hidden">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Chart */}
        <div className="h-48 w-full md:h-64 md:flex-1">
           <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#ffffff33" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#e0f2fe', fontSize: 11 }} />
              <Radar
                name="Nível"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="#f59e0b"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Desktop Logout Button */}
        <div className="hidden md:block mt-auto">
             <Button 
                fullWidth 
                variant="outline" 
                onClick={resetProfile}
                className="border-brand-700 text-brand-200 hover:bg-brand-800 hover:text-white justify-start"
            >
                <LogOut className="w-4 h-4" /> Sair da Conta
            </Button>
        </div>
      </aside>

      {/* 
        Right Panel (Mobile: Bottom Content / Desktop: Main Content)
        Mobile: -mt-8 relative z-20 (pull up effect)
        Desktop: mt-0 flex-1 h-full overflow-y-auto
      */}
      <main className="flex-1 flex flex-col h-full relative z-20 -mt-8 px-4 pb-4 md:mt-0 md:px-0 md:pb-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar md:p-12">
            <div className="max-w-2xl mx-auto w-full pt-4 md:pt-0">
                
                {/* Weakness Alert Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 md:shadow-sm md:border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 p-2 rounded-full shrink-0">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Ponto de Atenção</h3>
                        <p className="text-xs text-gray-500 truncate">{weakestSubject}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        A IA identificou que você precisa reforçar essa área para atingir <strong>{profile.targetCourse}</strong>.
                    </p>
                    <Button 
                        fullWidth 
                        onClick={() => navigate(`/simulation/setup?subject=${encodeURIComponent(weakestSubject)}`)}
                        className="bg-red-500 hover:bg-red-600 shadow-red-500/20"
                    >
                        Treinar Fraqueza
                    </Button>
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-brand-600" />
                    Simulados Inteligentes
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8 md:gap-6">
                    <button 
                        onClick={() => navigate('/simulation/setup')}
                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 active:scale-95 transition-all text-left hover:border-brand-300 hover:shadow-md group"
                    >
                        <div className="bg-brand-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <PlayCircle className="w-7 h-7 text-brand-600" />
                        </div>
                        <p className="font-bold text-gray-800 text-base">Gerar Novo</p>
                        <p className="text-xs text-gray-500 mt-1">Personalizado pela IA</p>
                    </button>

                    <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 text-left opacity-50 cursor-not-allowed">
                        <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-7 h-7 text-green-600" />
                        </div>
                        <p className="font-bold text-gray-800 text-base">Progresso</p>
                        <p className="text-xs text-gray-500 mt-1">Em breve</p>
                    </button>
                </div>
            </div>
        </div>
      </main>
    </Layout>
  );
};