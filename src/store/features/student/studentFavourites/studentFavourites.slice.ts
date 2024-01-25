import { createSlice } from '@reduxjs/toolkit';
import { getLikedCourses, getLikedTeachers } from './studentFavourites.async';
import studentCoursesSlice from '../studentCourses/studentCourses.slice';

const initialState: any = {
  likedCourses: [],
  likedTeachers: [],
  isLoading: true,
};

export const studentFavouritesSlice = createSlice({
  name: 'studentFavourites',
  initialState,
  reducers: {
    resetStudentCourses: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(getLikedCourses.pending, state => {
        state.isLoading = true;
      })
      .addCase(getLikedCourses.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getLikedCourses.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.likedCourses = payload;
      })
      .addCase(getLikedTeachers.pending, state => {
        state.isLoading = true;
      })
      .addCase(getLikedTeachers.rejected, state => {
        state.isLoading = false;
      })
      .addCase(getLikedTeachers.fulfilled, (state, { payload }) => {
        state.isLoading = false;

        state.likedTeachers = payload;
      });
  },
});

export default studentFavouritesSlice;
