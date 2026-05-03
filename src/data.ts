import { Lesson, ResourceType } from './types';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'u1',
    title: 'Unidad 1: Fundamentos y Patrones de Prompting',
    date: '2024-06-01',
    resources: [
      {
        id: 'r101',
        title: 'Video: Introducción al Prompt Engineering (2026)',
        description: 'Curso didáctico para principiantes de EDteam.',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/embed/8Wqgr7Ry3dk',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&h=225&auto=format&fit=crop'
      },
      {
        id: 'r102',
        title: 'PDF: Catálogo de Patrones de Prompting',
        description: 'Fundamentos y ejemplos prácticos para mejorar la interacción con ChatGPT.',
        type: ResourceType.PDF,
        url: 'https://arxiv.org/pdf/2302.11382.pdf'
      },
      {
        id: 'r103',
        title: 'Presentación: Ingeniería de Prompts (Oficial)',
        description: 'Material visual de apoyo para el curso de ingeniería de prompts.',
        type: ResourceType.PRESENTATION,
        url: 'https://docs.google.com/presentation/d/e/2PACX-1vTedL0d6I4Rhh6pH133DVBqqjhndz2Ib6MP0Dssxh-RuLJSalNSb0Bmw9W9zoG5pw/pubembed?start=false&loop=false&delayms=5000',
        thumbnail: 'https://images.unsplash.com/photo-1454165833766-01d794628cc2?q=80&w=400&h=225&auto=format&fit=crop'
      }
    ],
    activities: []
  },
  {
    id: 'u2',
    title: 'Unidad 2: Técnicas Avanzadas y Vision-Language',
    date: '2024-06-15',
    resources: [
      {
        id: 'r201',
        title: 'Video: Zero-shot, Few-shot y Chaining',
        description: 'Explicación detallada de técnicas de encadenamiento y pocos ejemplos.',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/embed/wM1NrkwJrvU',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4628c9759?q=80&w=400&h=225&auto=format&fit=crop'
      },
      {
        id: 'r202',
        title: 'PDF: Survey de Prompting en Modelos de Visión',
        description: 'Estudio sistemático sobre modelos de lenguaje y visión (Nivel Avanzado).',
        type: ResourceType.PDF,
        url: 'https://arxiv.org/pdf/2307.12980.pdf'
      }
    ],
    activities: []
  },
  {
    id: 'u3',
    title: 'Unidad 3: Optimización y Auto-Prompting',
    date: '2024-06-30',
    resources: [
      {
        id: 'r301',
        title: 'PDF: Prompt Engineering a Prompt Engineer',
        description: 'Investigación sobre la automatización y síntesis de prompts.',
        type: ResourceType.PDF,
        url: 'https://arxiv.org/pdf/2311.05661.pdf'
      }
    ],
    activities: []
  }
];
