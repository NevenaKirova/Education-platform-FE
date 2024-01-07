import { createSlice } from '@reduxjs/toolkit';

import { getLessonsAll, getLessonsActive, getLessonsInactive, getLessonsDraft } from './teacherLessons.async';

const initialState: any = {
  activeLessons: null,
  inactiveLessons: null,
  draftLessons: null,
  isLoading: true,
};

export const teacherCoursesSlice = createSlice({
  name: 'teacherCourses',
  initialState,
  reducers: {
    resetTeacherCourses: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getLessonsAll.pending, state => {
        state.isLoading = true;
      })
      .addCase(getLessonsAll.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getLessonsAll.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.allLessons = payload;
      })
      .addCase(getLessonsActive.pending, state => {
        state.isLoading = true;
      })
      .addCase(getLessonsActive.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getLessonsActive.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.activeLessons = payload;
      })
      .addCase(getLessonsInactive.pending, state => {
        state.isLoading = true;
      })
      .addCase(getLessonsInactive.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getLessonsInactive.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.inactiveLessons = payload;
      })
      .addCase(getLessonsDraft.pending, state => {
        state.isLoading = true;
      })
      .addCase(getLessonsDraft.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getLessonsDraft.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.draftLessons = payload;
      });
  },
});

export default teacherCoursesSlice;
