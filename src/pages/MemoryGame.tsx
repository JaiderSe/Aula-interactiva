import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RefreshCw, 
  Play, 
  ChevronRight, 
  Brain, 
  Gamepad2, 
  Timer, 
  MousePointer2, 
  CheckCircle2, 
  XCircle,
  Award,
  Zap,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';

// Types
type Card = {
  id: string;
  content: string;
  matchId: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'concept' | 'definition';
};

type Level = {
  id: number;
  name: string;
  description: string;
  pairs: number;
  badge: string;
};

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

// Data
const LEVELS: Level[] = [
  { id: 1, name: 'Nivel 1: Básico', description: 'Fundamentos de IA y conceptos iniciales.', pairs: 5, badge: 'Novato IA' },
  { id: 2, name: 'Nivel 2: Intermedio', description: 'Aprendizaje automático y procesamiento de datos.', pairs: 8, badge: 'Ingeniero de Prompts' },
  { id: 3, name: 'Nivel 3: Ética y Avanzado', description: 'Desafíos, sesgos y el futuro de la IA.', pairs: 10, badge: 'Experto en AI' },
];

const CONTENT_POOL = {
  level1: [
    { concept: 'IA', definition: 'Simulación de inteligencia humana por máquinas' },
    { concept: 'Machine Learning', definition: 'Sistema que aprende a partir de datos' },
    { concept: 'Prompt', definition: 'Instrucción dada a una IA' },
    { concept: 'Chatbot', definition: 'Programa que conversa con usuarios' },
    { concept: 'Algoritmo', definition: 'Conjunto de pasos para resolver un problema' },
    { concept: 'Datos', definition: 'Materia prima usada para entrenar IAs' },
  ],
  level2: [
    { concept: 'Deep Learning', definition: 'Modelos avanzados inspirados en el cerebro' },
    { concept: 'NLP', definition: 'Procesamiento de lenguaje natural' },
    { concept: 'Dataset', definition: 'Conjunto masivo de datos para entrenamiento' },
    { concept: 'Red Neuronal', definition: 'Modelo matemático que imita neuronas' },
    { concept: 'Visión Artificial', definition: 'IA que puede "ver" e interpretar imágenes' },
    { concept: 'Sesgo', definition: 'Prejuicio en los datos que afecta resultados' },
    { concept: 'GPU', definition: 'Hardware potente usado para entrenar IA' },
    { concept: 'Parámetros', definition: 'Valores internos que la IA ajusta al aprender' },
  ],
  level3: [
    { concept: 'Deepfake', definition: 'Contenido falso creado con IA muy realista' },
    { concept: 'Alucinación', definition: 'Cuando una IA inventa hechos con confianza' },
    { concept: 'Ética AI', definition: 'Estudio de lo que es justo en el uso de IA' },
    { concept: 'Singularidad', definition: 'Punto hipotético donde la IA supera al humano' },
    { concept: 'Turing Test', definition: 'Prueba para saber si una IA imita a un humano' },
    { concept: 'IA Generativa', definition: 'IA capaz de crear nuevo contenido original' },
    { concept: 'Agentic Workflow', definition: 'IAs que pueden actuar de forma autónoma' },
    { concept: 'Multimodal', definition: 'IA que entiende texto, audio e imagen a la vez' },
  ]
};

const QUIZ_POOL: QuizQuestion[] = [
  {
    question: '¿Qué es un algoritmo?',
    options: [
      'Un robot físico',
      'Una serie de instrucciones paso a paso',
      'Un cable de internet',
      'Una pantalla táctil'
    ],
    correctAnswer: 1,
    explanation: 'Un algoritmo es simplemente un conjunto de reglas o pasos finitos para realizar una tarea.'
  },
  {
    question: '¿Cuál es la principal diferencia entre IA y automatización?',
    options: [
      'No hay diferencia',
      'La IA puede tomar decisiones basadas en patrones aprendidos',
      'La automatización es más inteligente',
      'La IA solo funciona con cables'
    ],
    correctAnswer: 1,
    explanation: 'Mientras la automatización sigue reglas fijas, la IA aprende de datos para adaptarse y mejorar.'
  },
  {
    question: '¿Qué significa "Prompt Engineering"?',
    options: [
      'Reparar computadoras',
      'El arte de diseñar instrucciones efectivas para una IA',
      'Programar en lenguaje binario',
      'Cargar baterías de servidores'
    ],
    correctAnswer: 1,
    explanation: 'Es la disciplina de refinar las entradas (prompts) para obtener los mejores resultados de una IA.'
  }
];

export const MemoryGame: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'select' | 'playing' | 'victory'>('menu');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [lastMatchedConcept, setLastMatchedConcept] = useState<string | null>(null);

  // Timer logic
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const initGame = (level: Level) => {
    const pool = (level.id === 1 ? CONTENT_POOL.level1 : 
                 level.id === 2 ? CONTENT_POOL.level2 : 
                 CONTENT_POOL.level3).slice(0, level.pairs);
    
    let gameCards: Card[] = [];
    pool.forEach((item, idx) => {
      gameCards.push({
        id: `c-${idx}`,
        content: item.concept,
        matchId: `${idx}`,
        isFlipped: false,
        isMatched: false,
        type: 'concept'
      });
      gameCards.push({
        id: `d-${idx}`,
        content: item.definition,
        matchId: `${idx}`,
        isFlipped: false,
        isMatched: false,
        type: 'definition'
      });
    });

    setCards(gameCards.sort(() => Math.random() - 0.5));
    setGameState('playing');
    setMatches(0);
    setMoves(0);
    setScore(0);
    setQuizScore(0);
    setTimer(0);
    setIsActive(true);
    setFlippedCards([]);
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched || showQuiz || showExplanation) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;
      
      if (newCards[firstIdx].matchId === newCards[secondIdx].matchId) {
        // MATCH
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIdx].isMatched = true;
          matchedCards[secondIdx].isMatched = true;
          setCards(matchedCards);
          setMatches(prev => prev + 1);
          setScore(prev => prev + 100);
          setFlippedCards([]);
          
          const concept = matchedCards[firstIdx].type === 'concept' ? matchedCards[firstIdx].content : matchedCards[secondIdx].content;
          const definition = matchedCards[firstIdx].type === 'definition' ? matchedCards[firstIdx].content : matchedCards[secondIdx].content;
          setShowExplanation(`${concept}: ${definition}`);
          setLastMatchedConcept(concept);

          // Quiz logic: every 3 matches (or at halfway/end)
          if ((matches + 1) % 3 === 0) {
             setTimeout(() => {
                const randomQuiz = QUIZ_POOL[Math.floor(Math.random() * QUIZ_POOL.length)];
                setShowQuiz(randomQuiz);
             }, 2000);
          }

          if (matches + 1 === selectedLevel?.pairs) {
            setIsActive(false);
            setTimeout(() => setGameState('victory'), 2500);
          }
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[firstIdx].isFlipped = false;
          resetCards[secondIdx].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1200);
      }
    }
  };

  const handleQuizAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 500);
      setQuizScore(prev => prev + 1);
    }
    setShowQuiz(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[85vh] w-full flex flex-col items-center justify-center py-12 px-6 font-sans text-gray-900 bg-slate-50/50 rounded-[4rem] border border-gray-100/50 shadow-inner relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -z-10" />

      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl w-full text-center space-y-8 bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />
            <div className="flex justify-center flex-wrap gap-4 mb-4">
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Brain size={32} /></div>
               <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl"><Gamepad2 size={32} /></div>
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Zap size={32} /></div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                Memory <span className="text-indigo-600">IA</span>
              </h1>
              <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                Desafía tu mente y aprende los conceptos clave de la Inteligencia Artificial en este juego de memoria interactivo.
              </p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setGameState('select')}
              className="group relative inline-flex items-center gap-3 bg-indigo-600 text-white px-10 py-5 rounded-3xl font-bold text-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
            >
              Comenzar Juego <Play size={24} fill="currentColor" />
            </motion.button>
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-50">
               <div>
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Niveles</div>
               </div>
               <div>
                  <div className="text-2xl font-bold text-gray-900">20+</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Conceptos</div>
               </div>
               <div>
                  <div className="text-2xl font-bold text-gray-900">IA</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Temática</div>
               </div>
            </div>
          </motion.div>
        )}

        {gameState === 'select' && (
          <motion.div 
            key="select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-4xl w-full"
          >
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-2">Selecciona un Nivel</h2>
               <p className="text-gray-500">¿Qué tan experto eres en IA?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LEVELS.map((lvl) => (
                <motion.button
                  key={lvl.id}
                  whileHover={{ y: -10 }}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    initGame(lvl);
                  }}
                  className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-200 text-left transition-all group"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                    lvl.id === 1 ? "bg-green-50 text-green-600" : 
                    lvl.id === 2 ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                  )}>
                    <Trophy size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-600 transition-colors">{lvl.name}</h3>
                  <p className="text-sm text-gray-500 mb-6 leading-snug">{lvl.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">{lvl.pairs} PARES</span>
                    <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              ))}
            </div>
            <button 
              onClick={() => setGameState('menu')}
              className="mt-12 block mx-auto text-gray-400 font-bold hover:text-gray-900 transition-colors"
            >
              Volver al inicio
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && selectedLevel && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-5xl w-full flex flex-col md:flex-row gap-8"
          >
            {/* Stats Sidebar */}
            <div className="md:w-64 space-y-4">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 text-center">Nivel Actual</div>
                   <div className="text-center font-bold text-indigo-600">{selectedLevel.name}</div>
                </div>
                <div className="flex justify-between items-center text-center">
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 mb-1 justify-center"><Timer size={14}/> <span className="text-[10px] font-bold uppercase">Tiempo</span></div>
                    <div className="text-xl font-black">{formatTime(timer)}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1 text-gray-400 mb-1 justify-center"><MousePointer2 size={14}/> <span className="text-[10px] font-bold uppercase">Movimientos</span></div>
                    <div className="text-xl font-black">{moves}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-50 text-center">
                   <div className="text-3xl font-black text-indigo-600">{score}</div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Puntos</div>
                </div>
              </div>

              <div className="bg-indigo-600 rounded-3xl p-6 text-white overflow-hidden relative group">
                 <div className="relative z-10">
                   <div className="text-[10px] font-bold uppercase opacity-60 tracking-wider mb-2">Progreso</div>
                   <div className="text-2xl font-bold mb-4">{Math.round((matches / selectedLevel.pairs) * 100)}%</div>
                   <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                         className="h-full bg-white"
                         initial={{ width: 0 }}
                         animate={{ width: `${(matches / selectedLevel.pairs) * 100}%` }}
                      />
                   </div>
                 </div>
                 <Zap className="absolute bottom-[-10px] right-[-10px] text-white/10 w-24 h-24 group-hover:scale-110 transition-transform" />
              </div>

              <button 
                onClick={() => setGameState('select')}
                className="w-full py-4 rounded-3xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Reiniciar
              </button>
            </div>

            {/* Game Grid */}
            <div className="flex-1">
              <div className={cn(
                "grid gap-4 w-full",
                selectedLevel.pairs <= 6 ? "grid-cols-3 md:grid-cols-4" : "grid-cols-4 md:grid-cols-5"
              )}>
                {cards.map((card, idx) => (
                  <motion.div
                    key={card.id}
                    layoutId={card.id}
                    onClick={() => handleCardClick(idx)}
                    className="relative aspect-square cursor-pointer preserve-3d perspective-[1000px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div 
                      className={cn(
                        "absolute inset-0 rounded-2xl transition-all duration-500 flex items-center justify-center p-4 text-center border-2 shadow-lg",
                        card.isFlipped || card.isMatched 
                        ? "bg-white border-indigo-100" 
                        : "bg-gradient-to-br from-indigo-600 to-purple-700 border-white/30"
                      )}
                      initial={false}
                      animate={{ 
                        rotateY: card.isFlipped || card.isMatched ? 0 : 180,
                      }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div style={{ transform: (card.isFlipped || card.isMatched) ? 'none' : 'rotateY(180deg)' }}>
                        {(card.isFlipped || card.isMatched) ? (
                          <div className="relative">
                            <span className={cn(
                              "font-bold text-sm leading-tight block",
                              card.type === 'concept' ? 'text-indigo-600' : 'text-gray-700'
                            )}>
                              {card.content}
                            </span>
                            {card.isMatched && (
                               <motion.div 
                                 initial={{ scale: 0 }}
                                 animate={{ scale: 1 }}
                                 className="absolute -top-10 left-1/2 -translate-x-1/2 text-green-500"
                               >
                                  <CheckCircle2 size={24} fill="currentColor" className="text-white bg-green-500 rounded-full" />
                               </motion.div>
                            )}
                          </div>
                        ) : (
                          <div className="text-white flex flex-col items-center gap-3 pointer-events-none">
                             <div className="relative">
                                <Brain size={40} className="relative z-10 opacity-90" />
                                <motion.div 
                                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                  transition={{ repeat: Infinity, duration: 3 }}
                                  className="absolute inset-0 bg-white rounded-full blur-xl"
                                />
                             </div>
                             <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                                <div className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                             </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Explanation Modal */}
            <AnimatePresence>
               {showExplanation && (
                 <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
                 >
                    <div className="bg-indigo-900 border border-indigo-700 p-6 rounded-[2rem] shadow-2xl text-white relative flex gap-4 items-center">
                       <div className="p-3 bg-white/10 rounded-2xl shrink-0"><Info className="text-indigo-300" /></div>
                       <p className="text-sm font-medium leading-relaxed italic">{showExplanation}</p>
                       <button 
                          onClick={() => setShowExplanation(null)}
                          className="absolute -top-3 -right-3 bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg"
                       >
                          OK
                       </button>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Quiz Modal */}
            <AnimatePresence>
              {showQuiz && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md">
                   <motion.div 
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="bg-white max-w-lg w-full rounded-[3.5rem] p-10 shadow-2xl space-y-8"
                   >
                     <div className="text-center">
                        <div className="inline-flex py-1 px-4 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Pregunta Bonus +500 PTS</div>
                        <h3 className="text-2xl font-black text-gray-900">{showQuiz.question}</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-3">
                       {showQuiz.options.map((option, idx) => (
                         <button
                           key={idx}
                           onClick={() => handleQuizAnswer(idx === showQuiz.correctAnswer)}
                           className="w-full p-5 rounded-2xl border border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 text-left font-bold text-sm transition-all flex items-center justify-between group"
                         >
                           {option}
                           <div className="w-6 h-6 border-2 border-gray-200 rounded-full group-hover:border-indigo-500" />
                         </button>
                       ))}
                     </div>
                   </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {gameState === 'victory' && selectedLevel && (
           <motion.div 
             key="victory"
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="max-w-md w-full bg-white rounded-[3.5rem] border border-gray-100 p-12 text-center shadow-2xl relative overflow-hidden"
           >
             <div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
             <div className="relative z-10">
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                   <Trophy size={48} />
                </div>
                <div className="space-y-4 mb-10">
                   <h2 className="text-4xl font-black tracking-tight">¡Vicotria Total!</h2>
                   <p className="text-gray-500">Has demostrado ser un conocedor de la IA.</p>
                </div>
                
                <div className="bg-gray-50 rounded-3xl p-8 grid grid-cols-2 gap-8 mb-10">
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Puntaje</div>
                      <div className="text-2xl font-black text-indigo-600">{score}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiempo</div>
                      <div className="text-2xl font-black text-indigo-600">{formatTime(timer)}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aciertos Quiz</div>
                      <div className="text-2xl font-black text-indigo-600">{quizScore}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Movimientos</div>
                      <div className="text-2xl font-black text-indigo-600">{moves}</div>
                   </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mb-10">
                   <div className="inline-flex items-center gap-2 text-indigo-600 font-bold mb-2">
                      <Award size={20} /> Medalla Obtenida
                   </div>
                   <div className="text-indigo-900 font-black text-lg">{selectedLevel.badge}</div>
                </div>

                <div className="space-y-3">
                   <button 
                     onClick={() => initGame(selectedLevel)}
                     className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                   >
                     REINTENTAR NIVEL
                   </button>
                   <button 
                     onClick={() => setGameState('select')}
                     className="w-full py-5 bg-transparent text-gray-500 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                   >
                     OTROS NIVELES
                   </button>
                </div>
             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}} />
    </div>
  );
};
