import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../axios';
import { getResponseMessage } from '../../../../helpers/response.util';
import CreateToastMessage from '../../../../utils/toast.util';

export const getLikedCourses = createAsyncThunk('student/getLikedLessons ', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/users/getLikedCourses`);

    return res.data;
  } catch (err) {
    CreateToastMessage('error', getResponseMessage(err));

    return rejectWithValue(getResponseMessage(err));
  }
});

export const getLikedTeachers = createAsyncThunk('student/getLikedTeachers', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/users/getLikedTeachers`);

    return res.data;
  } catch (err) {
    CreateToastMessage('error', getResponseMessage(err));

    return rejectWithValue(getResponseMessage(err));
  }
});
