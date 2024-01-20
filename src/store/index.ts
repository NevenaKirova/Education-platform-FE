import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import teacherCoursesSlice from './features/teacher/teacherCourses/teacherCourses.slice';
import teacherLessonsSlice from './features/teacher/teacherLessons/teacherLessons.slice';
import { studentCoursesSlice } from './features/student/studentCourses/studentCourses.slice';
import { studentFavouritesSlice } from './features/student/studentFavourites/studentFavourites.slice';

export const reducer = {
  teacherCourses: teacherCoursesSlice.reducer,
  teacherLessons: teacherLessonsSlice.reducer,
  studentCourses: studentCoursesSlice.reducer,
  studentFavourites: studentFavouritesSlice.reducer,
};

export const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
