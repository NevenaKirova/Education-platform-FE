import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../../axios';
import { getResponseMessage } from '../../../../helpers/response.util';
import CreateToastMessage from '../../../../utils/toast.util';

export const getStudentAll = createAsyncThunk(
  'student/getCoursesTypesAll ',
  async ({ sort, page }: { sort: string; page: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/lessons/getStudentDashboard/All`, { sort, page });

      return res.data;
    } catch (err) {
      CreateToastMessage('error', getResponseMessage(err));

      return rejectWithValue(getResponseMessage(err));
    }
  },
);

export const getStudentCourses = createAsyncThunk(
  'student/getStudentCourses',
  async ({ sort, page }: { sort: string; page: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/lessons/getStudentDashboard/Courses`, { sort, page });

      return res.data;
    } catch (err) {
      CreateToastMessage('error', getResponseMessage(err));

      return rejectWithValue(getResponseMessage(err));
    }
  },
);

export const getStudentLessons = createAsyncThunk(
  'student/getStudentLessons ',
  async ({ sort, page }: { sort: string; page: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/lessons/getStudentDashboard/Lessons`, { sort, page });

      return res.data;
    } catch (err) {
      CreateToastMessage('error', getResponseMessage(err));

      return rejectWithValue(getResponseMessage(err));
    }
  },
);
