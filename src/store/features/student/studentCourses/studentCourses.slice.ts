import { createSlice } from '@reduxjs/toolkit';

import { getStudentAll, getStudentCourses, getStudentLessons } from './studentCourses.async';

const initialState: any = {
  all: null,
  courses: null,
  lessons: null,
  isLoading: true,
};

export const studentCoursesSlice = createSlice({
  name: 'studentCourses',
  initialState,
  reducers: {
    resetStudentCourses: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getStudentAll.pending, state => {
        state.isLoading = true;
      })
      .addCase(getStudentAll.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getStudentAll.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.all = payload;
      })
      .addCase(getStudentCourses.pending, state => {
        state.isLoading = true;
      })
      .addCase(getStudentCourses.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getStudentCourses.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.courses = payload;
      })
      .addCase(getStudentLessons.pending, state => {
        state.isLoading = true;
      })
      .addCase(getStudentLessons.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getStudentLessons.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.lessons = payload;
      });
  },
});

export default studentCoursesSlice;
