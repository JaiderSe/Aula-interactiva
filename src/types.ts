/**
 * Tipos para la aplicación Aula Interactiva
 */

export enum ResourceType {
  VIDEO = 'video',
  PDF = 'pdf',
  PRESENTATION = 'presentation',
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  url: string; // URL de YouTube, PDF o iFrame de presentación
  thumbnail?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
}

export interface Lesson {
  id: string;
  title: string;
  date: string;
  resources: Resource[];
  activities: Activity[];
}
