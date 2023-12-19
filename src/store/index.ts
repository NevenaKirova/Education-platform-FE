import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import teacherCoursesSlice from './features/teacher/teacherCourses/teacherCourses.slice';

export const reducer = {
  teacherCourses: teacherCoursesSlice.reducer,
};

export const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
