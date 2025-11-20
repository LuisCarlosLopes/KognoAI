export enum Subject {
  MATH = 'Matemática e suas Tecnologias',
  HUMANITIES = 'Ciências Humanas e suas Tecnologias',
  NATURE = 'Ciências da Natureza e suas Tecnologias',
  LANGUAGES = 'Linguagens, Códigos e suas Tecnologias'
}

export enum Proficiency {
  LOW = 'Baixo',
  MEDIUM = 'Médio',
  HIGH = 'Alto'
}

export enum SimulationMode {
  STANDARD = 'standard',
  PRACTICE = 'practice'
}

export interface UserProfile {
  name: string;
  targetCourse: string;
  targetUniversity: string;
  proficiencies: Record<Subject, Proficiency>;
  isOnboarded: boolean;
}

export interface Question {
  id: string;
  subject: Subject;
  topic: string;
  statement: string;
  options: string[]; // 5 options (A-E)
  correctIndex: number; // 0-4
  explanation: string;
}

export interface SimulationResult {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeTakenSeconds: number;
}

export interface SimulationSession {
  id: string;
  createdAt: number;
  questions: Question[];
  results: SimulationResult[];
  isComplete: boolean;
}