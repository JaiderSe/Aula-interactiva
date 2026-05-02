import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Lesson, ResourceType } from '../types';
import { MOCK_LESSONS } from '../data';

export const seedDatabase = async (teacherId: string) => {
  try {
    for (const mockLesson of MOCK_LESSONS) {
      const lessonRef = await addDoc(collection(db, 'lessons'), {
        title: mockLesson.title,
        date: mockLesson.date,
        teacherId: teacherId,
        description: mockLesson.description || 'Lección importada de demostración'
      });

      // Add resources
      for (const res of mockLesson.resources) {
        await addDoc(collection(db, `lessons/${lessonRef.id}/resources`), res);
      }

      // Add activities
      for (const act of mockLesson.activities) {
        await addDoc(collection(db, `lessons/${lessonRef.id}/activities`), {
          ...act,
          lessonId: lessonRef.id
        });
      }
    }
    alert('Base de datos poblada con éxito!');
  } catch (error) {
    console.error('Error seeding database:', error);
    alert('Error al poblar la base de datos. Revisa la consola.');
  }
};
