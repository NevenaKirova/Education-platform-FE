import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Navigate, NavLink as ReactRouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  HStack,
  Avatar,
  Img,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Text,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react';

import PageLoader from '../../utils/loader.component';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { getStudentCoursesTypes, getStudentLiked } from '../../store/selectors';
import {
  getLikedCourses,
  getLikedTeachers,
} from '../../store/features/student/studentFavourites/studentFavourites.async';
import { heart, heartFull, user } from '../../icons';
import { capitalizeMonth } from '../../helpers/capitalizeMonth.util';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { courseStatuses } from '../../components/courses/course_card/dashboard_card.component';
import StarRating from '../../components/rating/starRating';
import { Rating } from '../../components/testimonials/testimonial_card.component';

const StudentFavouritesPage = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const { likedCourses, likedTeachers, isLoading } = useSelector(getStudentLiked);

  const removeFromFavourites = (ev, id) => {
    ev.preventDefault();
    console.log('remove');
  };

  useEffect(() => {
    dispatch(getLikedCourses());
    dispatch(getLikedTeachers());
  }, []);

  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 8, lg: 10 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Heading textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
        Любими
      </Heading>

      <Tabs variant="unstyled" w={'full'}>
        <TabList gap={8} w={'full'}>
          <Tab
            _selected={{ color: 'white', bg: 'purple.500' }}
            rounded={'md'}
            color={'purple.500'}
            border={'dashed 2px'}
            borderColor={'purple.500'}
            px={3}
            fontSize={{ base: 14, md: 16 }}>
            <Text>Уроци и курсове</Text>
          </Tab>
          <Tab
            _selected={{ color: 'white', bg: 'purple.500' }}
            rounded={'md'}
            color={'purple.500'}
            border={'dashed 2px'}
            borderColor={'purple.500'}
            px={3}
            fontSize={{ base: 14, md: 16 }}>
            <Text>Преподаватели</Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}></TabPanel>
          <TabPanel px={0}>
            {likedTeachers?.map((teacher, index) => (
              <Box
                key={index}
                as={ReactRouterLink}
                to={`/teacher/${teacher?.id}`}
                py={4}
                px={4}
                w={'full'}
                transition={'transform .2s'}
                _hover={{ transform: 'scale(1.02)  perspective(1px)', bg: 'transparent' }}
                h={'full'}
                bg={'transparent'}>
                <Stack
                  direction={'row'}
                  maxH={'230px'}
                  w={'full'}
                  bg={'white'}
                  align={'center'}
                  rounded={'md'}
                  boxShadow="custom"
                  overflow={'hidden'}
                  p={6}
                  gap={8}>
                  <Avatar size="2xl" name="Christian Nwamba" src="https://bit.ly/code-beast" />

                  <Stack flex={1}>
                    <Stack direction={'column'} h={'full'} justify={'space-between'} spacing={6}>
                      <Stack direction={'column'} spacing={4} align={'start'}>
                        <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }} textAlign={'start'}>
                          {teacher?.firstName} {teacher?.secondName}
                        </Heading>

                        <Text color={'grey.600'} fontSize={18} fontWeight={400}>
                          Биология, Физика, Математика
                        </Text>
                      </Stack>

                      <Stack direction={'row'} spacing={4} align={'center'} fontWeight={500}>
                        <Rating rating={teacher?.rating} size={18} />

                        <Text color={'grey.500'} fontSize={18} fontWeight={400}>
                          ({teacher?.numberOfReviews} {teacher?.numberOfReviews > 1 ? 'отзива' : 'отзив'})
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>

                  <ButtonGroup
                    size="sm"
                    isAttached
                    variant="link"
                    _hover={{ textDecoration: 'none' }}
                    onClick={ev => removeFromFavourites(ev, teacher?.id)}>
                    <IconButton aria-label="Add to favourites" icon={<Img src={heartFull} h={5} w={'full'} />} />
                    <Button color={'purple.500'} _hover={{ textDecoration: 'none', opacity: 0.9 }}>
                      <Text fontSize={18} fontWeight={700} ml={2}>
                        Премахни от любими
                      </Text>
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Box>
            ))}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default StudentFavouritesPage;
