import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../axios';
import { getResponseMessage } from '../../../../helpers/response.util';
import CreateToastMessage from '../../../../utils/toast.util';

export const getLikedCourses = createAsyncThunk(
  'student/getLikedLessons ',
  async ({ sort, page }: { sort: string; page: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/lessons/getFavouriteCourses`, { sort, page });

      return res.data;
    } catch (err) {
      CreateToastMessage('error', getResponseMessage(err));

      return rejectWithValue(getResponseMessage(err));
    }
  },
);

export const getLikedTeachers = createAsyncThunk('student/getLikedTeachers', async ({  page }: { page: number }, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/users/getLikedTeachers/${page}`);

    return res.data;
  } catch (err) {
    CreateToastMessage('error', getResponseMessage(err));

    return rejectWithValue(getResponseMessage(err));
  }
});
