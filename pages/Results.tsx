import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Question, SimulationResult } from '../types';
import { Trophy, Home, RefreshCw, Share2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{questions: Question[], results: SimulationResult[]} | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('last_exam_results');
    if (stored) {
        setData(JSON.parse(stored));
    } else {
        navigate('/dashboard');
    }
  }, [navigate]);

  if (!data) return null;

  const correctCount = data.results.filter(r => r.isCorrect).length;
  const total = data.questions.length;
  const percentage = Math.round((correctCount / total) * 100);

  const chartData = [
    { name: 'Corretas', value: correctCount, color: '#22c55e' }, // green-500
    { name: 'Erradas', value: total - correctCount, color: '#ef4444' }, // red-500
  ];

  let message = "";
  if (percentage >= 80) message = "Excelente! Você domina esse assunto.";
  else if (percentage >= 60) message = "Muito bom! Continue praticando.";
  else message = "Foco total! Vamos reforçar a base.";

  return (
    <Layout className="p-6 overflow-y-auto">
        <div className="text-center mt-8 mb-8">
            <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/20">
                <Trophy className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{percentage}%</h1>
            <p className="text-gray-500 font-medium">de aproveitamento</p>
        </div>

        <div className="h-48 w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-gray-600 -mt-24 font-bold">
                {correctCount} / {total}
            </p>
            <div className="mt-20"></div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-8">
            <h3 className="font-bold text-gray-900 mb-2">Feedback da IA</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
                {message} Com base no seu desempenho, ajustamos seu perfil para focar mais em <strong>{data.questions[0].subject.split(' ')[0]}</strong> nos próximos dias.
            </p>
        </div>

        <div className="space-y-3 mt-auto">
            <Button fullWidth onClick={() => navigate('/simulation/setup')} variant="primary">
                <RefreshCw className="w-4 h-4" /> Novo Simulado
            </Button>
            <Button fullWidth onClick={() => navigate('/dashboard')} variant="outline">
                <Home className="w-4 h-4" /> Voltar ao Início
            </Button>
        </div>
    </Layout>
  );
};