import React from 'react';

import { Stack, Heading, Text } from '@chakra-ui/react';

import Carousel from 'react-multi-carousel';
import TestimonialCard from './testimonial_card.component';

import style from '../courses/courses_landing/courses_landing.module.scss';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 700 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 700, min: 0 },
    items: 1,
  },
};
export default function TestimonialsSection({ reviews }: { reviews: any }) {
  return (
    <Stack spacing={4} px={{ base: 12, lg: 24, '2xl': '15vw' }}>
      <Heading
        flex={1}
        as="h1"
        fontSize={{ base: '5.8vw', sm: '4.5vw', md: '3.8vw', xl: '2vw' }}
        textAlign="center"
        pb={8}>
        <Text as="span" color={'purple.500'}>
          Отзиви
        </Text>{' '}
        {''}
        от наши ученици
      </Heading>

      <Carousel
        autoPlay={true}
        autoPlaySpeed={5000}
        responsive={responsive}
        partialVisible={true}
        showDots={true}
        containerClass={style.containerClass}
        infinite={true}
        arrows={false}>
        {reviews?.map((review, index) => <TestimonialCard key={index} review={review} />)}
      </Carousel>
    </Stack>
  );
}
