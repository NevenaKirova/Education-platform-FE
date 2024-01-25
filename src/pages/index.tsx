import React, { useEffect, useState, useRef, useContext } from 'react';
import axios, { axiosInstance } from '../axios';

import Header from '../components/header/header.component';
import CourseLanding from '../components/courses/courses_landing/courses_landing.component';
import ReasonsSection from '../components/reason_section/reason_section.component';
import Faq from '../components/faq/faq.component';
import TestimonialsSection from '../components/testimonials/testimonial.component';
import TestimonialDemoSection from '../components/testimonials/testimonial_demo.component';

import { Stack, useToast } from '@chakra-ui/react';

import '../styles/styles.scss';
import { getResponseMessage } from '../helpers/response.util';
import { useAppDispatch } from '../store';
import { getStudentLiked } from '../store/selectors';
import { useSelector } from 'react-redux';
import { getLikedCourses } from '../store/features/student/studentFavourites/studentFavourites.async';
import AuthContext from '../context/AuthContext';
import CreateToastMessage from '../utils/toast.util';

export type CourseType = {
  lessonID: number;
  title: string;
  description: string;
  grade: string;
  subject: string;
  price: number;
  length: number;
  studentsUpperBound: number;
  numberOfReviews: number;
  numberOfTermins: number;
  firstDate: string;
  time: string;
  teacherName: string;
  teacherSurname: string;
  privateLesson: boolean;
  rating: number;
  weekLength: number;
  teacherId: number;
  numberOfStudents: number;
};

const IndexPage = ({ onLoginOpen, setModalTabIndex }: { onLoginOpen: any; setModalTabIndex: any }) => {
  const { user } = useContext(AuthContext);

  const toast = useToast();
  const dispatch = useAppDispatch();

  const ref = useRef(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [reviews, setReviews] = useState([]);

  const { likedCourses, isLoading } = useSelector(getStudentLiked);

  const getHomePage = async () => {
    try {
      let res;
      if (user) {
        res = await axiosInstance.get('lessons/getHomePage');
      } else {
        res = await axios.get('lessons/getHomePage');
      }

      setPopularCourses(res.data?.popularLessonsResponse);
      setReviews(res.data?.reviewsResponse);
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
  useEffect(() => {
    getHomePage();
  }, []);

  useEffect(() => {
    dispatch(getLikedCourses());
  }, []);
  return (
    <>
      <Header onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} elRef={ref} />
      <Stack pt={{ base: 16, lg: 24 }} spacing={32} ref={ref}>
        <CourseLanding popularCourses={popularCourses} onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} />
        <ReasonsSection />
        <TestimonialDemoSection />
        <TestimonialsSection reviews={reviews} />
        <Faq />
      </Stack>
    </>
  );
};

export default IndexPage;
