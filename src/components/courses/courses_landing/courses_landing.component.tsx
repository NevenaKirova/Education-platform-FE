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
    breakpoint: { max: 4000, min: 1350 },
    items: 4,
    partialVisibilityGutter: 0,
  },
  desktop: {
    breakpoint: { max: 1350, min: 1000 },
    items: 2,
    partialVisibilityGutter: 80,
  },
  tablet: {
    breakpoint: { max: 1000, min: 700 },
    items: 2,
    partialVisibilityGutter: 0,
  },
  miniTablet: {
    breakpoint: { max: 700, min: 600 },
    items: 1,
    partialVisibilityGutter: 100,
  },
  largeMobile: {
    breakpoint: { max: 600, min: 500 },
    items: 1,
    partialVisibilityGutter: 80,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 1,
    partialVisibilityGutter: 0,
  },
};

export default function CourseSection({
  popularCourses,
  popularLessons,
  onLoginOpen,
  setModalTabIndex,
}: {
  popularCourses: any;
  popularLessons: any;
  onLoginOpen: any;
  setModalTabIndex: any;
}) {
  return (
    <Stack spacing={{ base: 32, md: 40 }} px={{ base: 12, lg: 20, '2xl': 32 }}>
      <Stack spacing={{ base: 6, lg: 8 }}>
        <Grid
          w={'full'}
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(5, 1fr)' }}
          gap={{ base: 6, md: 8 }}
          pr={{ base: 0, lg: 8 }}
          alignItems={'baseline'}>
          <GridItem colSpan={{ base: 1, lg: 4, xl: 3 }} colStart={{ base: 1, xl: 2 }}>
            <Heading flex={1} as="h1" fontSize={{ base: 24, md: 32, lg: 40 }} textAlign="center">
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
              fontSize={{ base: 18, md: 20, lg: 22, xl: 24 }}
              fontWeight={700}
              variant={'link'}
              color={'purple.500'}
              _hover={{ opacity: '0.9' }}>
              Виж всички
            </Button>
          </GridItem>
        </Grid>

        <Carousel
          autoPlay={false}
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

      <Stack spacing={{ base: 6, lg: 8 }}>
        <Grid
          w={'full'}
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(5, 1fr)' }}
          gap={{ base: 6, md: 8 }}
          pr={{ base: 0, lg: 8 }}
          alignItems={'baseline'}>
          <GridItem colSpan={{ base: 1, lg: 4, xl: 3 }} colStart={{ base: 1, xl: 2 }}>
            <Heading flex={1} as="h1" fontSize={{ base: 24, md: 32, lg: 40 }} textAlign="center">
              <Text as="span" color={'purple.500'}>
                Най-популярни
              </Text>{' '}
              частни уроци
            </Heading>
          </GridItem>

          <GridItem colStart={{ base: 1, lg: 5 }} textAlign={{ base: 'center', lg: 'right' }}>
            <Button
              as={ReactRouterLink}
              to={'/lessons'}
              fontSize={{ base: 18, md: 20, lg: 22, xl: 24 }}
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
          {popularLessons?.map((course, index) => (
            <CourseCard key={index} course={course} onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} />
          ))}
        </Carousel>
      </Stack>
    </Stack>
  );
}
