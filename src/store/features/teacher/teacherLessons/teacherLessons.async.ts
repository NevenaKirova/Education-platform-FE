import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../axios';
import { getResponseMessage } from '../../../../helpers/response.util';
import CreateToastMessage from '../../../../utils/toast.util';

export const getLessonsAll = createAsyncThunk('teacher/getLessonsTypesAll ', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/lessons/getTeacherLessons/All`);

    return res.data;
  } catch (err) {
    CreateToastMessage('error', getResponseMessage(err));

    return rejectWithValue(getResponseMessage(err));
  }
});

export const getLessonsActive = createAsyncThunk('teacher/getLessonsTypesActive ', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/lessons/getTeacherLessons/Active`);

    return res.data;
  } catch (err) {
    CreateToastMessage('error', getResponseMessage(err));

    return rejectWithValue(getResponseMessage(err));
  }
});

export const getLessonsInactive = createAsyncThunk(
  'teacher/getCoursesTypesInactive ',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/lessons/getTeacherLessons/Inactive`);

      return res.data;
    } catch (err) {
      CreateToastMessage('error', getResponseMessage(err));

      return rejectWithValue(getResponseMessage(err));
    }
  },
);

export const getLessonsDraft = createAsyncThunk('teacher/getLessonsTypesDraft ', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(`/lessons/getTeacherLessons/Draft`);

    return res.data;
  } catch (err) {
    CreateToastMessage('error', getResponseMessage(err));

    return rejectWithValue(getResponseMessage(err));
  }
});
