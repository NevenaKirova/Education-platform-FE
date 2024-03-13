import React, { useEffect, useState, useRef, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios, { axiosInstance } from '../axios';

import Header from '../components/header/header.component';
import CourseLanding from '../components/courses/courses_landing/courses_landing.component';
import ReasonsSection from '../components/reason_section/reason_section.component';
import Faq from '../components/faq/faq.component';
import TestimonialsSection from '../components/testimonials/testimonial.component';
import TestimonialDemoSection from '../components/testimonials/testimonial_demo.component';
import PageLoader from '../utils/loader.component';
import AuthContext from '../context/AuthContext';
import { getResponseMessage } from '../helpers/response.util';

import { Stack, useToast } from '@chakra-ui/react';

import '../styles/styles.scss';

export type CourseType = {
  courseTerminRequests: any;
  teacherResponse: string;
  urlToImage: string;
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
  const { user, userData } = useContext(AuthContext);

  const toast = useToast();

  const ref = useRef(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [popularLessons, setPopularLessons] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getHomePage = async () => {
    setIsLoading(true);
    try {
      let res;
      if (user) {
        res = await axiosInstance.get('lessons/getHomePage');
      } else {
        res = await axios.get('lessons/getHomePage');
      }
      setIsLoading(false);
      setPopularLessons(res.data?.popularLessonsResponse);
      setPopularCourses(res.data?.popularCourseResponse);
      setReviews(res.data?.reviewsResponse);
    } catch (err) {
      setIsLoading(false);
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

  return userData && userData.role === 'TEACHER' ? (
    <Navigate to={'/dashboard'} />
  ) : (
    <>
      <Header onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} elRef={ref} />
      <Stack pt={{ base: 16, lg: 24 }} spacing={32} ref={ref}>
        <CourseLanding
          popularCourses={popularCourses}
          popularLessons={popularLessons}
          onLoginOpen={onLoginOpen}
          setModalTabIndex={setModalTabIndex}
        />
        <ReasonsSection />
        <TestimonialDemoSection />
        <TestimonialsSection reviews={reviews} />
        <Faq />
      </Stack>
      <PageLoader isLoading={isLoading} />
    </>
  );
};

export default IndexPage;
