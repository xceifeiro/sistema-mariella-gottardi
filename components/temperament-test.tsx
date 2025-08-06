"use client"
import React, { useState, FC, useEffect } from 'react';

// --- Tipos e Dados (Adaptados para o novo formato) ---

type Temperament = 'sanguineo' | 'colerico' | 'melancolico' | 'fleumatico';
type Scores = Record<Temperament, number>;

type TesteDeTemperamentoProps = {
  pedidoId: string;
  usuarioId: string;
};

type QuestionOption = { text: string; temperament: Temperament };
type Question = QuestionOption[];

// Lista completa com as 40 questões do teste (20 forças + 20 fraquezas).
const questions: Question[] = [
    // --- SEÇÃO FORÇAS ---
    [{ text: 'Animado', temperament: 'sanguineo' }, { text: 'Aventureiro', temperament: 'colerico' }, { text: 'Analítico', temperament: 'melancolico' }, { text: 'Adaptável', temperament: 'fleumatico' }],
    [{ text: 'Brincalhão', temperament: 'sanguineo' }, { text: 'Persuasivo', temperament: 'colerico' }, { text: 'Persistente', temperament: 'melancolico' }, { text: 'Sereno', temperament: 'fleumatico' }],
    [{ text: 'Sociável', temperament: 'sanguineo' }, { text: 'Energético', temperament: 'colerico' }, { text: 'Abnegado', temperament: 'melancolico' }, { text: 'Submisso', temperament: 'fleumatico' }],
    [{ text: 'Convincente', temperament: 'sanguineo' }, { text: 'Competitivo', temperament: 'colerico' }, { text: 'Atencioso', temperament: 'melancolico' }, { text: 'Controlado', temperament: 'fleumatico' }],
    [{ text: 'Tranquilo', temperament: 'sanguineo' }, { text: 'Habilidoso', temperament: 'colerico' }, { text: 'Respeitoso', temperament: 'melancolico' }, { text: 'Reservado', temperament: 'fleumatico' }],
    [{ text: 'Espirituoso', temperament: 'sanguineo' }, { text: 'Autossuficiente', temperament: 'colerico' }, { text: 'Sensível', temperament: 'melancolico' }, { text: 'Satisfeito', temperament: 'fleumatico' }],
    [{ text: 'Estimulador', temperament: 'sanguineo' }, { text: 'Positivo', temperament: 'colerico' }, { text: 'Planejador', temperament: 'melancolico' }, { text: 'Paciente', temperament: 'fleumatico' }],
    [{ text: 'Espontâneo', temperament: 'sanguineo' }, { text: 'Seguro', temperament: 'colerico' }, { text: 'Organizado', temperament: 'melancolico' }, { text: 'Tímido', temperament: 'fleumatico' }],
    [{ text: 'Otimista', temperament: 'sanguineo' }, { text: 'Franco', temperament: 'colerico' }, { text: 'Ordeiro', temperament: 'melancolico' }, { text: 'Serviçal', temperament: 'fleumatico' }],
    [{ text: 'Engraçado', temperament: 'sanguineo' }, { text: 'Vigoroso', temperament: 'colerico' }, { text: 'Fiel', temperament: 'melancolico' }, { text: 'Amigável', temperament: 'fleumatico' }],
    [{ text: 'Encantador', temperament: 'sanguineo' }, { text: 'Audacioso', temperament: 'colerico' }, { text: 'Minucioso', temperament: 'melancolico' }, { text: 'Diplomático', temperament: 'fleumatico' }],
    [{ text: 'Alegre', temperament: 'sanguineo' }, { text: 'Confiante', temperament: 'colerico' }, { text: 'Culto', temperament: 'melancolico' }, { text: 'Consistente', temperament: 'fleumatico' }],
    [{ text: 'Inspirado', temperament: 'sanguineo' }, { text: 'Independente', temperament: 'colerico' }, { text: 'Idealista', temperament: 'melancolico' }, { text: 'Inofensivo', temperament: 'fleumatico' }],
    [{ text: 'Demonstrativo', temperament: 'sanguineo' }, { text: 'Decidido', temperament: 'colerico' }, { text: 'Profundo', temperament: 'melancolico' }, { text: 'Irônico', temperament: 'fleumatico' }],
    [{ text: 'Desembaraçado', temperament: 'sanguineo' }, { text: 'Ativo', temperament: 'colerico' }, { text: 'Musical', temperament: 'melancolico' }, { text: 'Mediador', temperament: 'fleumatico' }],
    [{ text: 'Conversador', temperament: 'sanguineo' }, { text: 'Tenaz', temperament: 'colerico' }, { text: 'Pensativo', temperament: 'melancolico' }, { text: 'Tolerante', temperament: 'fleumatico' }],
    [{ text: 'Vivo', temperament: 'sanguineo' }, { text: 'Líder', temperament: 'colerico' }, { text: 'Leal', temperament: 'melancolico' }, { text: 'Ouvinte', temperament: 'fleumatico' }],
    [{ text: 'Atraente', temperament: 'sanguineo' }, { text: 'Chefe', temperament: 'colerico' }, { text: 'Detalhista', temperament: 'melancolico' }, { text: 'Contente', temperament: 'fleumatico' }],
    [{ text: 'Popular', temperament: 'sanguineo' }, { text: 'Produtivo', temperament: 'colerico' }, { text: 'Perfeccionista', temperament: 'melancolico' }, { text: 'Agradável', temperament: 'fleumatico' }],
    [{ text: 'Vivaz', temperament: 'sanguineo' }, { text: 'Valente', temperament: 'colerico' }, { text: 'Comportado', temperament: 'melancolico' }, { text: 'Equilibrado', temperament: 'fleumatico' }],

    // --- SEÇÃO FRAQUEZAS ---
    [{ text: 'Metido', temperament: 'sanguineo' }, { text: 'Mandão', temperament: 'colerico' }, { text: 'Acanhado', temperament: 'melancolico' }, { text: 'Vazio', temperament: 'fleumatico' }],
    [{ text: 'Indisciplinado', temperament: 'sanguineo' }, { text: 'Insensível', temperament: 'colerico' }, { text: 'Rancoroso', temperament: 'melancolico' }, { text: 'Desinteressado', temperament: 'fleumatico' }],
    [{ text: 'Repetitivo', temperament: 'sanguineo' }, { text: 'Inflexível', temperament: 'colerico' }, { text: 'Ressentido', temperament: 'melancolico' }, { text: 'Relutante', temperament: 'fleumatico' }],
    [{ text: 'Esquecido', temperament: 'sanguineo' }, { text: 'Franco', temperament: 'colerico' }, { text: 'Complicado', temperament: 'melancolico' }, { text: 'Medroso', temperament: 'fleumatico' }],
    [{ text: 'Inoportuno', temperament: 'sanguineo' }, { text: 'Impaciente', temperament: 'colerico' }, { text: 'Inseguro', temperament: 'melancolico' }, { text: 'Indeciso', temperament: 'fleumatico' }],
    [{ text: 'Imprevisível', temperament: 'sanguineo' }, { text: 'Frio', temperament: 'colerico' }, { text: 'Impopular', temperament: 'melancolico' }, { text: 'Desligado', temperament: 'fleumatico' }],
    [{ text: 'Casual', temperament: 'sanguineo' }, { text: 'Teimoso', temperament: 'colerico' }, { text: 'Insatisfeito', temperament: 'melancolico' }, { text: 'Hesitante', temperament: 'fleumatico' }],
    [{ text: 'Permissivo', temperament: 'sanguineo' }, { text: 'Orgulhoso', temperament: 'colerico' }, { text: 'Pessimista', temperament: 'melancolico' }, { text: 'Simples', temperament: 'fleumatico' }],
    [{ text: 'Esquentado', temperament: 'sanguineo' }, { text: 'Combativo', temperament: 'colerico' }, { text: 'Alienado', temperament: 'melancolico' }, { text: 'Incerto', temperament: 'fleumatico' }],
    [{ text: 'Ingênuo', temperament: 'sanguineo' }, { text: 'Corajoso', temperament: 'colerico' }, { text: 'Negativo', temperament: 'melancolico' }, { text: 'Indiferente', temperament: 'fleumatico' }],
    [{ text: 'Egoísta', temperament: 'sanguineo' }, { text: 'Workaholic', temperament: 'colerico' }, { text: 'Retraído', temperament: 'melancolico' }, { text: 'Preocupado', temperament: 'fleumatico' }],
    [{ text: 'Tagarela', temperament: 'sanguineo' }, { text: 'Indelicado', temperament: 'colerico' }, { text: 'Sensível demais', temperament: 'melancolico' }, { text: 'Tímido', temperament: 'fleumatico' }],
    [{ text: 'Desorganizado', temperament: 'sanguineo' }, { text: 'Imperioso', temperament: 'colerico' }, { text: 'Deprimido', temperament: 'melancolico' }, { text: 'Confuso', temperament: 'fleumatico' }],
    [{ text: 'Inconstante', temperament: 'sanguineo' }, { text: 'Birrento', temperament: 'colerico' }, { text: 'Introvertido', temperament: 'melancolico' }, { text: 'Ansioso', temperament: 'fleumatico' }],
    [{ text: 'Desordenado', temperament: 'sanguineo' }, { text: 'Intolerante', temperament: 'colerico' }, { text: 'Triste', temperament: 'melancolico' }, { text: 'Resmungão', temperament: 'fleumatico' }],
    [{ text: 'Convencido', temperament: 'sanguineo' }, { text: 'Manipulador', temperament: 'colerico' }, { text: 'Cético', temperament: 'melancolico' }, { text: 'Lento', temperament: 'fleumatico' }],
    [{ text: 'Barulhento', temperament: 'sanguineo' }, { text: 'Obstinado', temperament: 'colerico' }, { text: 'Desconfiado', temperament: 'melancolico' }, { text: 'Preguiçoso', temperament: 'fleumatico' }],
    [{ text: 'Distraído', temperament: 'sanguineo' }, { text: 'Tirânico', temperament: 'colerico' }, { text: 'Vingativo', temperament: 'melancolico' }, { text: 'Vagaroso', temperament: 'fleumatico' }],
    [{ text: 'Agitado', temperament: 'sanguineo' }, { text: 'Imprudente', temperament: 'colerico' }, { text: 'Crítico', temperament: 'melancolico' }, { text: 'Relutante', temperament: 'fleumatico' }],
    [{ text: 'Instável', temperament: 'sanguineo' }, { text: 'Astuto', temperament: 'colerico' }, { text: 'Solitário', temperament: 'melancolico' }, { text: 'Acomodado', temperament: 'fleumatico' }],
];


// Estilos para cada temperamento usando classes do TailwindCSS
const temperamentStyles: Record<Temperament, { bg: string; text: string; ring: string; border: string }> = {
    sanguineo:   { bg: 'bg-yellow-400', text: 'text-yellow-900', ring: 'focus:ring-yellow-400', border: 'border-yellow-400' },
    colerico:    { bg: 'bg-red-500',    text: 'text-red-900',    ring: 'focus:ring-red-500',    border: 'border-red-500' },
    melancolico: { bg: 'bg-blue-500',   text: 'text-blue-900',   ring: 'focus:ring-blue-500',   border: 'border-blue-500' },
    fleumatico:  { bg: 'bg-green-500',  text: 'text-green-900',  ring: 'focus:ring-green-500',  border: 'border-green-500' }
};

// --- Componente Principal ---

const TesteDeTemperamento: FC<TesteDeTemperamentoProps> = ({ pedidoId, usuarioId }) => {
    // A etapa inicial agora é 'questions', removendo 'userInfo'
    const [step, setStep] = useState<'questions' | 'finished'>('questions');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, Temperament>>({});
    const [finalScores, setFinalScores] = useState<Scores | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animate, setAnimate] = useState(false);
    // NOVO: Estado para controlar a transição e travar cliques
    const [isTransitioning, setIsTransitioning] = useState(false);


    // Efeito para animar a entrada de cada questão
    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => setAnimate(false), 500); // Duração da animação
        return () => clearTimeout(timer);
    }, [currentQuestionIndex]);

    const handleAnswerSelect = (temperament: Temperament) => {
        // MUDANÇA: Se já estiver em transição, ignora o clique
        if (isTransitioning) return;

        // MUDANÇA: Inicia a transição e trava a interface
        setIsTransitioning(true);

        const newAnswers = { ...answers, [currentQuestionIndex]: temperament };
        setAnswers(newAnswers);

        // Avança para a próxima questão após o delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                // MUDANÇA: Libera a interface para a próxima questão
                setIsTransitioning(false);
            } else {
                calculateAndSubmit(newAnswers);
            }
        }, 300); // Pequeno delay para o feedback visual
    };

    const calculateAndSubmit = async (finalAnswers: Record<number, Temperament>) => {
        setIsLoading(true);
        setError(null);
        setStep('finished');

        const scores: Scores = { sanguineo: 0, colerico: 0, melancolico: 0, fleumatico: 0 };
        Object.values(finalAnswers).forEach(temperament => {
            if (temperament) scores[temperament]++;
        });
        setFinalScores(scores);

        const payload = {
        pedidoId,
        usuarioId,
        scores,
}

        try {
            const response = await fetch('/api/salvar-resultado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao salvar o resultado.');
            }
        } catch (err: any) {
            console.error('Erro no envio:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    // --- RENDERIZAÇÃO CONDICIONAL POR ETAPA ---

    if (step === 'questions') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
                <div className="w-full max-w-3xl">
                    {/* Barra de Progresso */}
                    <div className="mb-4">
                        <div className="bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <p className="text-center text-sm text-slate-500 mt-2 font-medium">Questão {currentQuestionIndex + 1} de {questions.length}</p>
                    </div>

                    <div className={`w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center transition-opacity duration-500 ${animate ? 'opacity-100' : 'opacity-100'}`}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-8">Qual destas palavras melhor descreve você?</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {questions[currentQuestionIndex].map((option) => (
                                <button
                                    key={option.text}
                                    onClick={() => handleAnswerSelect(option.temperament)}
                                    // MUDANÇA: O botão é desabilitado durante a transição
                                    disabled={isTransitioning}
                                    className="p-5 rounded-lg text-lg font-semibold border-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 bg-slate-50 hover:bg-slate-100 border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (step === 'finished') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4 font-sans">
                <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-slate-200 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Teste Finalizado!</h2>
                    <p className="text-slate-600 mb-6">Seu resultado foi computado. Estamos salvando suas informações.</p>
                    
                    {isLoading && <div className="text-blue-600 font-medium">Salvando resultado...</div>}
                    {error && <div className="text-red-600 font-medium bg-red-100 p-3 rounded-lg">{error}</div>}
                    
                    {finalScores && (
                        <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                           <h3 className="text-xl font-bold text-slate-700 mt-8 mb-4">Sua Pontuação Final:</h3>
                           <div className="flex flex-col sm:flex-row flex-wrap justify-around gap-4 mt-4">
                                {(Object.keys(finalScores) as Temperament[]).map(t => (
                                    <div key={t} className={`flex-1 min-w-[150px] text-white p-4 rounded-lg shadow-md ${temperamentStyles[t].bg}`}>
                                        <span className="text-lg font-semibold capitalize">{t}</span>
                                        <strong className="block text-4xl font-bold">{finalScores[t]}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return null;
};

export default TesteDeTemperamento;
