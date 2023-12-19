import React, { useEffect, useState, useRef } from 'react';
import axios from '../axios';

import Header from '../components/header/header.component';
import CourseLanding from '../components/courses/courses_landing/courses_landing.component';
import ReasonsSection from '../components/reason_section/reason_section.component';
import Faq from '../components/faq/faq.component';
import TestimonialsSection from '../components/testimonials/testimonial.component';
import TestimonialDemoSection from '../components/testimonials/testimonial_demo.component';

import { Stack } from '@chakra-ui/react';

import '../styles/styles.scss';

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
  const ref = useRef(null);
  const [popularCourses, setPopularCourses] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get('lessons/getHomePage')
      .then(res => {
        setPopularCourses(res.data?.popularLessonsResponse);
        setReviews(res.data?.reviewsResponse);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <>
      <Header onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} elRef={ref} />
      <Stack pt={{ base: 16, lg: 24 }} spacing={32} ref={ref}>
        <CourseLanding popularCourses={popularCourses} />
        <ReasonsSection />
        <TestimonialDemoSection />
        <TestimonialsSection reviews={reviews} />
        <Faq />
      </Stack>
    </>
  );
};

export default IndexPage;
