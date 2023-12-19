import { createSlice } from '@reduxjs/toolkit';

import {
  getUpcomingCourses,
  getCoursesInactive,
  getCoursesActive,
  getCoursesDraft,
  getCoursesAll,
} from './teacherCourses.async';

const initialState: any = {
  upcomingCourses: null,
  allCourses: null,
  activeCourses: null,
  inactiveCourses: null,
  draftCourses: null,
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
      .addCase(getUpcomingCourses.pending, state => {
        state.isLoading = true;
      })
      .addCase(getUpcomingCourses.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getUpcomingCourses.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.upcomingCourses = payload;
      })
      .addCase(getCoursesAll.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCoursesAll.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getCoursesAll.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.allCourses = payload;
      })
      .addCase(getCoursesActive.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCoursesActive.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getCoursesActive.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.activeCourses = payload;
      })
      .addCase(getCoursesInactive.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCoursesInactive.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getCoursesInactive.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.inactiveCourses = payload;
      })
      .addCase(getCoursesDraft.pending, state => {
        state.isLoading = true;
      })
      .addCase(getCoursesDraft.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getCoursesDraft.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.draftCourses = payload;
      });
  },
});

export default teacherCoursesSlice;
