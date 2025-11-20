import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { generateQuestions } from '../services/geminiService';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Question, Subject, SimulationResult, SimulationMode } from '../types';
import { Check, X, Loader2, AlertCircle, ChevronRight, BookOpenCheck } from 'lucide-react';

export const ExamView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { profile } = useUser();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [error, setError] = useState<string | null>(null);
  
  const mode = (searchParams.get('mode') as SimulationMode) || SimulationMode.STANDARD;
  const isPractice = mode === SimulationMode.PRACTICE;

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const subject = searchParams.get('subject') as Subject;
    const count = parseInt(searchParams.get('count') || '5');

    if (!subject) {
        navigate('/dashboard');
        return;
    }

    const fetchExam = async () => {
      try {
        const generated = await generateQuestions(subject, count, profile.proficiencies[subject], mode);
        setQuestions(generated);
        setIsLoading(false);
        setStartTime(Date.now());
      } catch (err) {
        setError("Não foi possível gerar o simulado. A IA está sobrecarregada.");
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [searchParams, profile.proficiencies, navigate, mode]);

  useEffect(() => {
    if (!isLoading && questions.length > 0) {
        setStartTime(Date.now());
    }
  }, [currentIndex, isLoading, questions]);

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerChecked(true);
    
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;
    
    const result: SimulationResult = {
        questionId: currentQ.id,
        selectedOptionIndex: selectedOption,
        isCorrect,
        timeTakenSeconds: (Date.now() - startTime) / 1000
    };

    setResults(prev => [...prev, result]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
    } else {
        const encodedResults = encodeURIComponent(JSON.stringify(results));
        localStorage.setItem('last_exam_results', JSON.stringify({ questions, results }));
        navigate('/results');
    }
  };

  if (isLoading) {
    return (
        <Layout className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="max-w-md w-full flex flex-col items-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <Loader2 className="w-16 h-16 text-brand-600 animate-spin relative z-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {isPractice ? 'Criando Aula Prática...' : 'Montando Simulado...'}
                </h2>
                <p className="text-gray-500 text-lg">
                    {isPractice 
                        ? 'A IA está personalizando explicações detalhadas para o seu perfil.' 
                        : 'Consultando base de provas do ENEM e calibrando a dificuldade.'}
                </p>
            </div>
        </Layout>
    );
  }

  if (error) {
      return (
          <Layout className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
              <p className="text-gray-800 text-lg font-medium mb-8 max-w-md">{error}</p>
              <Button onClick={() => navigate('/dashboard')} className="min-w-[200px]">Voltar ao Início</Button>
          </Layout>
      )
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <Layout className="flex flex-col h-full">
        {/* Header Fixed */}
        <div className="px-6 pt-6 pb-3 bg-white border-b border-gray-100 flex-shrink-0 z-10">
            <div className="max-w-3xl mx-auto w-full">
                <div className="flex justify-between items-center mb-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                        Questão {currentIndex + 1} <span className="text-gray-300">/</span> {questions.length}
                        {isPractice && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md text-[10px]">PRÁTICA</span>}
                    </span>
                    <span className="hidden sm:inline text-brand-600">{currentQuestion.subject}</span>
                    <span className="sm:hidden text-brand-600">{currentQuestion.subject.split(' ')[0]}</span>
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ease-out ${isPractice ? 'bg-green-500' : 'bg-brand-600'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            <div className="max-w-3xl mx-auto w-full pb-6">
                <span className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold mb-4 tracking-wide uppercase">
                    {currentQuestion.topic}
                </span>
                
                <p className="text-gray-900 text-lg md:text-xl leading-relaxed mb-8 font-medium">
                    {currentQuestion.statement}
                </p>

                <div className="space-y-3">
                    {currentQuestion.options.map((opt, idx) => {
                        let stateStyles = "border-gray-200 hover:bg-gray-50 bg-white";
                        
                        if (isAnswerChecked) {
                            if (idx === currentQuestion.correctIndex) {
                                stateStyles = "border-green-500 bg-green-50 text-green-900 ring-1 ring-green-500 shadow-sm";
                            } else if (idx === selectedOption && idx !== currentQuestion.correctIndex) {
                                stateStyles = "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500 shadow-sm";
                            } else {
                                stateStyles = "border-gray-100 text-gray-400 bg-gray-50 opacity-60 grayscale";
                            }
                        } else if (selectedOption === idx) {
                            stateStyles = "border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500 shadow-md scale-[1.01]";
                        }

                        return (
                            <button
                                key={idx}
                                disabled={isAnswerChecked}
                                onClick={() => setSelectedOption(idx)}
                                className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 relative group ${stateStyles}`}
                            >
                                <div className="flex gap-4 items-start">
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border text-sm font-bold transition-colors ${
                                        isAnswerChecked && idx === currentQuestion.correctIndex 
                                            ? 'bg-green-200 border-green-300 text-green-800' 
                                            : isAnswerChecked && idx === selectedOption
                                                ? 'bg-red-200 border-red-300 text-red-800'
                                                : selectedOption === idx 
                                                    ? 'bg-brand-200 border-brand-300 text-brand-800' 
                                                    : 'bg-gray-50 border-gray-200 text-gray-400'
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="text-sm md:text-base pt-1">{opt}</span>
                                </div>
                                
                                {isAnswerChecked && idx === currentQuestion.correctIndex && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-100 p-1 rounded-full">
                                        <Check className="w-5 h-5 text-green-600" />
                                    </div>
                                )}
                                {isAnswerChecked && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-100 p-1 rounded-full">
                                        <X className="w-5 h-5 text-red-600" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation Block */}
                {isAnswerChecked && (
                    <div className={`mt-8 rounded-2xl p-6 border animate-fade-in shadow-sm ${isPractice ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                        <h4 className={`font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide ${isPractice ? 'text-green-900' : 'text-blue-900'}`}>
                            {isPractice ? <BookOpenCheck className="w-5 h-5"/> : <Loader2 className="w-4 h-4" />} 
                            {isPractice ? 'Gabarito Comentado' : 'Explicação da IA'}
                        </h4>
                        <div className={`text-sm md:text-base leading-7 whitespace-pre-wrap ${isPractice ? 'text-green-800' : 'text-blue-800'}`}>
                            {currentQuestion.explanation}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Footer Fixed Actions */}
        <div className="p-4 md:p-6 bg-white border-t border-gray-100 flex-shrink-0 z-20">
             <div className="max-w-3xl mx-auto w-full flex justify-end">
                {!isAnswerChecked ? (
                    <Button 
                        fullWidth 
                        className="md:w-auto md:min-w-[240px] shadow-lg shadow-brand-500/20"
                        onClick={handleCheckAnswer} 
                        disabled={selectedOption === null}
                    >
                        Verificar Resposta
                    </Button>
                ) : (
                    <Button 
                        fullWidth 
                        className="md:w-auto md:min-w-[240px]"
                        onClick={handleNext}
                        variant={isPractice ? "primary" : "secondary"}
                    >
                        {currentIndex === questions.length - 1 ? 'Finalizar Simulado' : 'Próxima Questão'} <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                )}
            </div>
        </div>
    </Layout>
  );
};