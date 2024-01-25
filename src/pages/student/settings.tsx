import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Navigate, NavLink as ReactRouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Avatar,
  Img,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  ButtonGroup,
  IconButton,
  Center,
  Grid,
  useToast,
  Show,
} from '@chakra-ui/react';

import PageLoader from '../../utils/loader.component';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { getStudentLiked } from '../../store/selectors';
import {
  getLikedCourses,
  getLikedTeachers,
} from '../../store/features/student/studentFavourites/studentFavourites.async';
import { heartFull } from '../../icons';

import { Rating } from '../../components/testimonials/testimonial_card.component';
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from '@ajna/pagination';
import CourseCard from '../../components/courses/course_card/course_card.compoment';
import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';
import { Dropdown } from 'primereact/dropdown';

const StudentSettingsPage = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, userData } = useContext(AuthContext);

  if (!user || userData.role !== 'STUDENT') return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 8, lg: 10 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Heading textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
        Любими
      </Heading>

      <Tabs index={tabIndex} onChange={handleTabsChange} variant="unstyled" w={'full'}>
        <Stack
          w={'full'}
          justify={'space-between'}
          align={{ base: 'inherit', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          spacing={6}>
          <TabList gap={8} w={'full'}>
            <Tab
              _selected={{ color: 'white', bg: 'purple.500', border: 'solid 2px' }}
              rounded={'md'}
              color={'purple.500'}
              border={'dashed 2px'}
              borderColor={'purple.500'}
              px={3}
              fontSize={{ base: 14, md: 16 }}>
              <Text>Уроци и курсове</Text>
            </Tab>
            <Tab
              _selected={{ color: 'white', bg: 'purple.500', border: 'solid 2px' }}
              rounded={'md'}
              color={'purple.500'}
              border={'dashed 2px'}
              borderColor={'purple.500'}
              px={3}
              fontSize={{ base: 14, md: 16 }}>
              <Text>Преподаватели</Text>
            </Tab>
          </TabList>

          {tabIndex == 0 && (
            <Dropdown
              value={sort}
              onChange={e => setSort(e.value)}
              options={sortValues}
              optionLabel="name"
              placeholder="Сортирай по"
            />
          )}
        </Stack>

        <TabPanels>
          <TabPanel px={0} mt={{ base: 6 }}>
            <Grid w={'full'} templateColumns="repeat(auto-fill, minmax(230px, 1fr))" gap={12} mb={6}>
              {likedCourses?.lessonResponses?.map((el, index) => (
                <CourseCard key={index} course={el} page={currentPageCourses} sort={sort.value} />
              ))}
            </Grid>

            {likedCourses?.length ? (
              <Pagination
                pagesCount={pagesCountCourses}
                currentPage={currentPageCourses}
                onPageChange={handlePageChangeCourses}>
                <PaginationContainer align="center" justify="end" p={4} w="full">
                  <PaginationPrevious
                    _hover={{
                      bg: 'transparent',
                    }}
                    bg="transparent">
                    <Text>Предишна</Text>
                  </PaginationPrevious>
                  <PaginationPageGroup
                    align="center"
                    separator={<PaginationSeparator bg="blue.300" fontSize="sm" w={7} jumpSize={11} />}>
                    {pagesCourses.map((page: number) => (
                      <PaginationPage
                        w={7}
                        bg="transparent"
                        key={`pagination_page_${page}`}
                        page={page}
                        fontSize="sm"
                        color={'grey.400'}
                        _hover={{
                          color: 'purple.400',
                        }}
                        _current={{
                          color: 'purple.500',
                          bg: 'transparent',
                          fontSize: 'sm',
                          w: 7,
                        }}
                      />
                    ))}
                  </PaginationPageGroup>
                  <PaginationNext
                    _hover={{
                      bg: 'transparent',
                    }}
                    color={'purple.500'}
                    bg="transparent">
                    <Text>Следваща</Text>
                  </PaginationNext>
                </PaginationContainer>
              </Pagination>
            ) : (
              <Center h={'50vh'}>
                <Text color={'grey.400'}> Нямате харесани курсове</Text>
              </Center>
            )}
          </TabPanel>
          <TabPanel px={0} mt={{ base: 8 }}>
            <Stack spacing={4} mb={6}>
              {likedTeachers?.teacherResponses &&
                likedTeachers?.teacherResponses?.map((teacher, index) => (
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
                      direction={{ base: 'column', md: 'row' }}
                      maxH={'240px'}
                      w={'full'}
                      bg={'white'}
                      align={{ base: 'center', lg: 'center' }}
                      rounded={'md'}
                      boxShadow="custom"
                      overflow={'hidden'}
                      p={6}
                      gap={{ base: 4, md: 8 }}>
                      <Avatar
                        size={{ base: 'md', lg: '2xl' }}
                        name={teacher?.firstName}
                        src="https://bit.ly/code-beast"
                      />

                      <Stack flex={1}>
                        <Stack
                          direction={'column'}
                          h={'full'}
                          justify={'space-between'}
                          align={{ base: 'center', md: 'start' }}
                          spacing={{ base: 2, lg: 6 }}>
                          <Stack
                            direction={'column'}
                            spacing={{ base: 2, lg: 4 }}
                            align={{ base: 'center', md: 'start' }}>
                            <Heading
                              color={'gray.700'}
                              fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                              textAlign={'center'}>
                              {teacher?.firstName} {teacher?.secondName}
                            </Heading>

                            <Text color={'grey.600'} fontSize={{ base: 14, md: 16, lg: 18 }} fontWeight={400}>
                              Биология, Физика, Математика
                            </Text>
                          </Stack>

                          <Stack direction={'row'} spacing={4} align={'center'} fontWeight={500}>
                            <Show below="lg">
                              <Rating rating={teacher?.rating} size={14} />
                            </Show>

                            <Show above="lg">
                              <Rating rating={teacher?.rating} size={18} />
                            </Show>

                            <Text color={'grey.500'} fontSize={{ base: 14, md: 16, lg: 18 }} fontWeight={400}>
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
                        onClick={ev => teacherRemoveFromFavourites(ev, teacher?.id)}>
                        <IconButton
                          aria-label="Add to favourites"
                          icon={<Img src={heartFull} h={{ base: 4, lg: 5 }} w={'full'} />}
                        />
                        <Button color={'purple.500'} _hover={{ textDecoration: 'none', opacity: 0.9 }}>
                          <Text fontSize={{ base: 14, md: 16, lg: 18 }} fontWeight={700} ml={{ base: 0, lg: 2 }}>
                            Премахни от любими
                          </Text>
                        </Button>
                      </ButtonGroup>
                    </Stack>
                  </Box>
                ))}
            </Stack>

            {likedTeachers?.total > 0 ? (
              <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChangeTeacher}>
                <PaginationContainer align="center" justify="end" p={4} w="full">
                  <PaginationPrevious
                    _hover={{
                      bg: 'transparent',
                    }}
                    bg="transparent">
                    <Text>Предишна</Text>
                  </PaginationPrevious>
                  <PaginationPageGroup
                    align="center"
                    separator={<PaginationSeparator bg="blue.300" fontSize="sm" w={7} jumpSize={11} />}>
                    {pages.map((page: number) => (
                      <PaginationPage
                        w={7}
                        bg="transparent"
                        key={`pagination_page_${page}`}
                        page={page}
                        fontSize="sm"
                        color={'grey.400'}
                        _hover={{
                          color: 'purple.400',
                        }}
                        _current={{
                          color: 'purple.500',
                          bg: 'transparent',
                          fontSize: 'sm',
                          w: 7,
                        }}
                      />
                    ))}
                  </PaginationPageGroup>
                  <PaginationNext
                    _hover={{
                      bg: 'transparent',
                    }}
                    color={'purple.500'}
                    bg="transparent">
                    <Text>Следваща</Text>
                  </PaginationNext>
                </PaginationContainer>
              </Pagination>
            ) : (
              <Center h={'50vh'}>
                <Text color={'grey.400'}> Нямате харесани преподаватели</Text>
              </Center>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default StudentFavouritesPage;
