import React from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';

import Carousel from 'react-multi-carousel';
import CourseCard from '../course_card/course_card.compoment';

import { Stack, Heading, Text, Grid, Button, GridItem } from '@chakra-ui/react';

import 'react-multi-carousel/lib/styles.css';
import style from './courses_landing.module.scss';

export const responsive = {
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

export default function CourseSection({
  popularCourses,
  onLoginOpen,
  setModalTabIndex,
}: {
  popularCourses: any;
  onLoginOpen: any;
  setModalTabIndex: any;
}) {
  return (
    <Stack spacing={{ base: 6, lg: 8 }} px={{ base: 12, lg: 24, '2xl': '15vw' }}>
      <Grid
        w={'full'}
        templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(5, 1fr)' }}
        gap={{ base: 6, md: 8 }}
        pr={{ base: 0, lg: 8 }}
        alignItems={'baseline'}>
        <GridItem colSpan={{ base: 1, lg: 4, xl: 3 }} colStart={{ base: 1, xl: 2 }}>
          <Heading
            flex={1}
            as="h1"
            fontSize={{ base: '5.8vw', sm: '4.5vw', md: '3.8vw', lg: '2.5vw', xl: '2vw' }}
            textAlign="center">
            <Text as="span" color={'purple.500'}>
              Най-популярни
            </Text>{' '}
            курсове
          </Heading>
        </GridItem>

        <GridItem colStart={{ base: 1, lg: 5 }} textAlign={{ base: 'center', lg: 'right' }}>
          <Button
            as={ReactRouterLink}
            to={'/courses'}
            fontSize={{ base: '4.7vw', md: ' 2.5vw', lg: '1.8vw', xl: '1.4vw' }}
            fontWeight={700}
            variant={'link'}
            color={'purple.500'}
            _hover={{ opacity: '0.9' }}>
            Виж всички
          </Button>
        </GridItem>
      </Grid>

      <Carousel
        autoPlay={true}
        autoPlaySpeed={5000}
        responsive={responsive}
        partialVisible={true}
        arrows={false}
        showDots={true}
        infinite={true}
        containerClass={style.containerClass}>
        {popularCourses?.map((course, index) => (
          <CourseCard key={index} course={course} onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} />
        ))}
      </Carousel>
    </Stack>
  );
}
