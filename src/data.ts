import { Lesson, ResourceType } from './types';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Introducción a la Biología Celular',
    unit: 'Unidad 1: Fundamentos de la Vida',
    date: '2024-05-15',
    resources: [
      {
        id: 'r1',
        title: 'Estructura de la Célula',
        description: 'Video explicativo sobre los organelos celulares.',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/embed/P_PeyK-e8iY',
        thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=400&h=225&auto=format&fit=crop'
      },
      {
        id: 'r2',
        title: 'Guía de Organelos (PDF)',
        description: 'Documento detallado con las funciones de cada organelo.',
        type: ResourceType.PDF,
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
      {
        id: 'r3',
        title: 'Presentación Interactiva',
        description: 'Diapositivas para repasar los conceptos clave.',
        type: ResourceType.PRESENTATION,
        url: 'https://slides.com/emily/deck/embed',
      }
    ],
    activities: [
      {
        id: 'a1',
        title: 'Cuestionario de Organelos',
        description: 'Responde 10 preguntas sobre la función de las mitocondrias y el núcleo.',
        dueDate: '2024-05-20',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    title: 'Genética Mendeliana',
    unit: 'Unidad 2: Herencia y Genética',
    date: '2024-05-22',
    resources: [
      {
        id: 'r4',
        title: 'Las Leyes de Mendel',
        description: 'Breve historia y explicación de las 3 leyes fundamentales.',
        type: ResourceType.VIDEO,
        url: 'https://www.youtube.com/embed/YpSgjv1qH3c',
        thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=400&h=225&auto=format&fit=crop'
      }
    ],
    activities: [
      {
        id: 'a2',
        title: 'Taller de Cruzamientos',
        description: 'Realiza los cuadros de Punnett indicados en la guía.',
        dueDate: '2024-05-25',
        status: 'pending'
      }
    ]
  }
];
