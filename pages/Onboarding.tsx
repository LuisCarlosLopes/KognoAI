import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Subject, Proficiency } from '../types';
import { BookOpen, GraduationCap, Target, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { updateProfile } = useUser();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    targetCourse: '',
    proficiencies: {
      [Subject.MATH]: Proficiency.MEDIUM,
      [Subject.HUMANITIES]: Proficiency.MEDIUM,
      [Subject.NATURE]: Proficiency.MEDIUM,
      [Subject.LANGUAGES]: Proficiency.MEDIUM,
    }
  });

  const handleProficiencyChange = (subject: Subject, level: Proficiency) => {
    setFormData(prev => ({
      ...prev,
      proficiencies: {
        ...prev.proficiencies,
        [subject]: level
      }
    }));
  };

  const finishOnboarding = () => {
    updateProfile({
      name: formData.name,
      targetCourse: formData.targetCourse,
      proficiencies: formData.proficiencies,
      isOnboarded: true
    });
    navigate('/dashboard');
  };

  return (
    <Layout className="p-6 md:flex md:items-center md:justify-center">
      <div className="w-full max-w-md mx-auto flex flex-col h-full md:h-auto md:min-h-[600px]">
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8 mt-4 shrink-0">
            <div 
            className="bg-brand-600 h-2 rounded-full transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
            />
        </div>

        {step === 1 && (
            <div className="flex flex-col flex-1 animate-fade-in">
            <div className="mb-8 text-center shrink-0">
                <div className="bg-brand-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-brand-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">Vamos começar!</h1>
                <p className="text-gray-500">Conte um pouco sobre seu objetivo para personalizarmos seu estudo.</p>
            </div>

            <div className="space-y-6 flex-1 md:flex-none">
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Como devemos te chamar?</label>
                <input 
                    type="text"
                    className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="Ex: Lucas"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                </div>
                
                <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Qual curso você quer passar?</label>
                <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                    type="text"
                    className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="Ex: Medicina, Engenharia..."
                    value={formData.targetCourse}
                    onChange={(e) => setFormData({...formData, targetCourse: e.target.value})}
                />
                </div>
                </div>
            </div>

            <div className="mt-auto pt-6 shrink-0 md:mt-8">
                <Button 
                fullWidth 
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.targetCourse}
                >
                Próximo <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
            </div>
        )}

        {step === 2 && (
            <div className="flex flex-col flex-1 animate-fade-in">
            <div className="mb-6 shrink-0">
                <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-accent-600">
                <BookOpen className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Suas Competências</h1>
                <p className="text-gray-500 text-center text-sm">Como você se sente em cada área? A IA usará isso para calibrar as questões.</p>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar pb-4 md:max-h-[400px]">
                {Object.values(Subject).map((subject) => (
                <div key={subject} className="bg-white border border-gray-200 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-3 text-sm">{subject}</p>
                    <div className="grid grid-cols-3 gap-2">
                    {[Proficiency.LOW, Proficiency.MEDIUM, Proficiency.HIGH].map((level) => {
                        const isSelected = formData.proficiencies[subject] === level;
                        return (
                        <button
                            key={level}
                            onClick={() => handleProficiencyChange(subject, level)}
                            className={`text-xs font-medium py-2.5 rounded-lg border transition-all ${
                            isSelected 
                                ? 'bg-brand-600 border-brand-600 text-white shadow-md' 
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {level}
                        </button>
                        );
                    })}
                    </div>
                </div>
                ))}
            </div>

            <div className="mt-auto pt-4 bg-white border-t border-gray-100 shrink-0 md:border-none md:pt-6">
                <Button 
                fullWidth 
                onClick={finishOnboarding}
                variant="primary"
                >
                Finalizar Perfil <CheckCircle2 className="w-4 h-4" />
                </Button>
                <Button 
                fullWidth 
                variant="ghost" 
                className="mt-2"
                onClick={() => setStep(1)}
                >
                Voltar
                </Button>
            </div>
            </div>
        )}
      </div>
    </Layout>
  );
};