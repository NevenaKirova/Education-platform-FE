import React, { useRef, useState, useMemo, useEffect, useContext } from 'react';
import { NavLink as ReactRouterLink, useParams } from 'react-router-dom';
import { format, getYear } from 'date-fns';
import Carousel from 'react-multi-carousel';
import { Dropdown } from 'primereact/dropdown';
import { bg } from 'date-fns/locale';

import {
  Stack,
  IconButton,
  Button,
  ButtonGroup,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
  Img,
  Tag,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  RadioGroup,
  Radio,
  Grid,
  GridItem,
  AccordionIcon,
  useToast,
} from '@chakra-ui/react';

import CourseCard from '../../components/courses/course_card/course_card.compoment';
import EnrollCourseCard from '../../components/courses/course_card/enroll_lesson_card';
import { Rating } from '../../components/testimonials/testimonial_card.component';

import { responsive } from '../../components/courses/courses_landing/courses_landing.component';
import { getResponseMessage } from '../../helpers/response.util';
import PageLoader from '../../utils/loader.component';
import { daysArr } from '../../components/courses/courses_teacher/create_course.component';
import axios, { axiosInstance } from '../../axios';
import AuthContext from '../../context/AuthContext';

import { heart, heartFull, message, group, location, hat } from '../../icons';

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

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import style from '../../components/courses/courses_landing/courses_landing.module.scss';

export const getDate = date => {
  const month = format(new Date(date), 'LLL', { locale: bg });
  const day = format(new Date(date), 'dd');
  const year = getYear(new Date(date));

  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)} ${year}`;
};

const LessonPage = ({ onLoginOpen, setModalTabIndex }: { onLoginOpen: any; setModalTabIndex: any }) => {
  const { lessonId } = useParams();
  const toast = useToast();

  const { userData } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [dateValue, setDateValue] = React.useState('0');
  const [heartIcon, setHeartIcon] = useState(heart);
  const [reviewSort, setReviewSort] = useState('');
  const [content, setContent] = useState<any>([]);
  const [reviews, setReviews] = useState<any>([]);
  const [reviewsTotal, setReviewsTotal] = useState(0);
  const [numberOfContentShown, setNumberOfContentToShow] = useState(4);
  const [course, setCourse] = useState<any>({});
  const [teacherInfo, setTeacherInfo] = useState<any>({});
  const [similarCourses, setSimilarCourses] = useState<any>([]);
  const [isLiked, setIsLiked] = useState(false);

  const DatesRef = useRef(null);
  const testimonialsRef = useRef<any>(null);
  const topRef = useRef(null);

  const reviewsSortValues = [
    { name: 'Най-нови', value: 'Newest' },
    { name: 'Най-стари', value: 'Oldest' },
    { name: 'Най-висок рейтинг', value: 'Highest rating' },
    { name: 'Най-нисък рейтинг', value: 'Lowest rating' },
  ];

  const addToFavourites = async ev => {
    ev.preventDefault();
    if (userData && userData.id) {
      try {
        await axiosInstance.get(`lessons/likeCourse/${course.lessonID}`);

        setHeartIcon(heartFull);
        setIsLiked(true);
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } else {
      setModalTabIndex(1);
      onLoginOpen();
    }
  };

  const handleScroll = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const outerLimit = 2;
  const innerLimit = 2;

  const { pages, pagesCount, currentPage, setCurrentPage } = usePagination({
    total: reviewsTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: {
      pageSize: 12,
      currentPage: 1,
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const contentToShow = useMemo(() => {
    return content?.slice(0, numberOfContentShown).map((el: any, index: number) => (
      <AccordionItem key={index} bg={'grey.100'} border={'none'} rounded={'md'}>
        <h2>
          <AccordionButton color={'grey.600'} _hover={{ bg: 'grey.100' }}>
            <Stack flex="1" textAlign="left" direction={'row'} align={'center'} spacing={4}>
              <Text as={'span'} fontSize={{ base: 20, lg: 26 }} fontWeight={600}>
                {index + 1}
              </Text>
              <Text as={'span'} fontSize={{ base: 14, lg: 16 }} fontWeight={500}>
                {' '}
                {el?.title}
              </Text>
            </Stack>

            <AccordionIcon bg={'purple.500'} color={'white'} rounded={'50%'} ml={{ base: 4 }} />
          </AccordionButton>
        </h2>
        <AccordionPanel textAlign={'left'} fontSize={{ base: 14, lg: 16 }}>
          <Text>{el.description}</Text>
        </AccordionPanel>
      </AccordionItem>
    ));
  }, [content, numberOfContentShown]);

  const showAll = () => {
    setNumberOfContentToShow(content.length);
  };

  const showLessContent = () => {
    setNumberOfContentToShow(4);
  };

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const getCoursePage = async () => {
    await axios
      .get(`lessons/getCoursePage/${lessonId}`)
      .then(res => {
        setCourse(res.data[0]);
        setContent(res.data[0].themas);
        setTeacherInfo(res.data[0].teacherResponse);
        setSimilarCourses(res.data.slice(1, res.data?.length));
        setIsLoading(false);
      })
      .catch(function (error) {
        setIsLoading(false);
        toast({
          title: getResponseMessage(error),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      });
  };

  const getReviews = async values => {
    await axios
      .post('/lessons/getReviews', values)
      .then(res => {
        setReviews(res.data.reviewResponses);
        setReviewsTotal(res.data.total);
      })
      .catch(function (error) {
        setIsLoading(false);
        toast({
          title: getResponseMessage(error),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      });
  };

  useEffect(() => {
    getCoursePage();
    handleScrollTop();
  }, [lessonId]);

  useEffect(() => {
    getReviews({ id: lessonId, sort: '', page: currentPage });
  }, []);

  useEffect(() => {
    getReviews({ id: lessonId, sort: reviewSort, page: currentPage });
  }, [currentPage, reviewSort]);

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack py={{ base: 0, lg: 10 }} px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}>
      <Stack
        direction={{ base: 'column', xl: 'row' }}
        spacing={30}
        mt={{ base: 36, lg: 40 }}
        mb={8}
        align={'start'}
        justify={'space-between'}
        flex={1}
        w={'full'}
        ref={topRef}>
        <Stack spacing={8} w={{ base: 'full', lg: '60%' }}>
          <Stack spacing={{ base: 12, lg: 16 }}>
            <Stack spacing={{ base: 6, lg: 8 }}>
              <Breadcrumb>
                <BreadcrumbItem>
                  <BreadcrumbLink as={ReactRouterLink} to={'/lessons'}>
                    {course?.privateLesson ? 'Частни уроци' : 'Курсове'}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem color={'purple.500'} isCurrentPage>
                  <BreadcrumbLink>{course?.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              <Stack
                direction={{ base: 'column', lg: 'row' }}
                w={'full'}
                justify={'space-between'}
                align={{ base: 'start', lg: 'center' }}
                spacing={{ base: 4, lg: 0 }}>
                <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 36 }} color={'grey.600'}>
                  {course?.title}
                </Heading>

                <Button
                  as={Stack}
                  bg="none"
                  _hover={{ bg: 'none' }}
                  cursor={'pointer'}
                  direction={'row'}
                  align={'center'}
                  flexWrap={'wrap'}
                  onClick={handleScroll}
                  pr={0}>
                  <Text color={'grey.400'}>{course?.rating}</Text>
                  <Rating rating={course?.rating} />
                  <Text color={'grey.400'}>({course?.numberOfReviews})</Text>
                </Button>
              </Stack>

              <Stack
                direction={{ base: 'column', lg: 'row' }}
                justify={'space-between'}
                w={'full'}
                align={{ base: 'start', lg: 'center' }}
                spacing={{ base: 6, lg: 0 }}>
                <Stack direction={'row'} spacing={4} align={'center'} flexWrap={'wrap'}>
                  <Text color={'grey.400'}>Преподавател:</Text>
                  <Stack direction={'row'} spacing={2} align={'center'}>
                    <Avatar
                      as={ReactRouterLink}
                      to={`/teacher/${teacherInfo?.id}`}
                      size="sm"
                      name={`${teacherInfo?.firstName} ${teacherInfo?.secondName}`}
                      src="https://bit.ly/dan-abramov"
                    />
                    <Text color={'grey.400'}>
                      {teacherInfo?.firstName} {teacherInfo?.secondName}
                    </Text>
                  </Stack>
                </Stack>

                <ButtonGroup
                  size="sm"
                  isAttached
                  variant="link"
                  _hover={{ textDecoration: 'none' }}
                  onMouseEnter={() => setHeartIcon(heartFull)}
                  onMouseLeave={() => setHeartIcon(heart)}
                  onClick={ev => addToFavourites(ev)}>
                  <IconButton
                    aria-label="Add to favourites"
                    icon={<Img src={isLiked ? heartFull : heartIcon} h={5} w={'full'} />}
                  />
                  <Button color={'purple.500'} _hover={{ textDecoration: 'none', opacity: 0.9 }}>
                    <Text fontSize={16} fontWeight={700} ml={2}>
                      Добави в любими
                    </Text>
                  </Button>
                </ButtonGroup>
              </Stack>

              <Stack direction={'row'} spacing={6} flexWrap={'wrap'}>
                <Tag size="md" color={'purple.500'} bg={'purple.200'} fontWeight={600} p={2}>
                  {course?.subject}
                </Tag>

                <Tag size="md" color={'purple.500'} bg={'purple.200'} fontWeight={600} p={2}>
                  {course?.grade}
                </Tag>

                <Tag size="md" color={'purple.500'} bg={'purple.200'} fontWeight={600} p={2}>
                  {course?.privateLesson ? 'Частен урок' : 'Групов курс'}
                </Tag>
              </Stack>
            </Stack>

            <Stack spacing={{ base: 6, lg: 8 }} w={'full'}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 36 }} color={'grey.600'}>
                За курса
              </Heading>

              <Text textAlign={'start'} fontSize={{ base: 14, lg: 16 }} maxW={{ base: '100%', lg: '100%' }}>
                {course?.description}
              </Text>
            </Stack>

            <Stack spacing={{ base: 6, lg: 8 }}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 36 }} color={'grey.600'}>
                Съдържание
              </Heading>

              <Accordion allowToggle>
                <Stack spacing={2} w={{ base: 'fit-content', lg: 'full' }}>
                  {contentToShow?.length ? (
                    contentToShow
                  ) : (
                    <Text fontSize={{ base: 18, lg: 20 }}>Няма налично съдържание</Text>
                  )}
                </Stack>
              </Accordion>

              {contentToShow?.length && (
                <Button
                  fontSize={{ base: 18, lg: 20 }}
                  fontWeight={600}
                  bg={'transparent'}
                  color="purple.500"
                  _hover={{ bg: 'transparent' }}
                  width={'fit-content'}
                  onClick={contentToShow.length < content.length ? showAll : showLessContent}>
                  {content.length <= contentToShow.length
                    ? ''
                    : reviewsToShow.length < reviews.length
                      ? 'Виж всички '
                      : 'Виж по-малко'}
                </Button>
              )}
            </Stack>

            <Stack spacing={{ base: 8, lg: 8 }} ref={DatesRef}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 36 }} color={'grey.600'}>
                Дати на провеждане
              </Heading>

              <Stack spacing={{ base: 12 }}>
                <RadioGroup onChange={setDateValue} value={dateValue}>
                  <Stack
                    spacing={8}
                    overflow={'auto'}
                    maxHeight={{ base: '450px', lg: '400px' }}
                    pr={{ base: 4, lg: 16 }}
                    sx={{
                      '::-webkit-scrollbar': {
                        width: '6px',
                        rounded: 'md',
                      },
                      '::-webkit-scrollbar-track': {
                        bg: 'grey.100',
                        width: '6px',
                        rounded: 'md',
                      },
                      '::-webkit-scrollbar-thumb': {
                        background: 'purple.500',
                        rounded: 'md',
                      },
                    }}>
                    {course?.courseTerminResponses?.map((el, index) => (
                      <Box
                        maxH={'350px'}
                        h={'100%'}
                        bg={index === parseInt(dateValue) ? 'grey.100' : 'white'}
                        key={index}
                        rounded={'md'}
                        p={6}>
                        <Stack spacing={6} direction="row" w={'full'}>
                          <Radio
                            value={`${index}`}
                            colorScheme={'purple'}
                            size={'lg'}
                            bg={index != parseInt(dateValue) ? 'grey.100' : 'white'}
                            w={'full'}>
                            <Stack ml={{ base: 6, md: 12 }} spacing={8}>
                              <Stack
                                direction={{ base: 'column', md: 'row' }}
                                spacing={{ base: 4, md: 6 }}
                                align={{ base: 'start', lg: 'center' }}>
                                <Text fontWeight={'600'} fontSize={{ base: 18, md: 20, lg: 24 }} textAlign={'left'}>
                                  {el && `${getDate(new Date(el?.startDate))} - ${getDate(new Date(el?.endDate))}`}
                                </Text>
                                <Text color={'grey.500'} fontSize={14}>
                                  ({el.weekLength} седмици)
                                </Text>
                              </Stack>

                              <Stack spacing={4} align={'start'}>
                                <Text fontWeight={600} fontSize={14}>
                                  {el?.time}
                                </Text>
                                <Text fontWeight={600} fontSize={14}>
                                  {el.courseDaysNumbers.map(day => daysArr[day - 1].name).toString()}
                                </Text>
                                <Text fontWeight={600} fontSize={14}>
                                  до {el.studentsUpperBound} {el.studentsUpperBound > 1 ? 'ученици' : 'ученик'}
                                </Text>
                              </Stack>
                            </Stack>
                          </Radio>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                </RadioGroup>
                <Stack direction={{ base: 'column', lg: 'row' }} align={'center'}>
                  <Text>Не откривате подходяща дата?</Text>
                  <Button bg={'transparent'} color={'purple.500'} fontWeight={700} _hover={{ bg: 'transparent' }}>
                    <Img src={message} mr={2} w={6} h={6} />
                    Свържете се с учителя
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Stack spacing={{ base: 6, lg: 8 }}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 36 }} color={'grey.600'}>
                Лектор
              </Heading>

              <Stack
                direction={{ base: 'column' }}
                justify={'space-between'}
                w={'full'}
                align={{ base: 'start' }}
                spacing={{ base: 6 }}>
                <Stack direction={'row'} spacing={8} align={'center'}>
                  <Avatar
                    as={ReactRouterLink}
                    to={`/teacher/${teacherInfo?.id}`}
                    size={{ base: 'xl', lg: '2xl' }}
                    name={`${teacherInfo.firstName} ${teacherInfo.secondName}`}
                    src="https://bit.ly/dan-abramov"
                  />
                  <Stack align={'start'} justify={'center'}>
                    <Text fontSize={22}>
                      {teacherInfo?.firstName} {teacherInfo?.secondName}
                    </Text>
                    <Stack align={'center'} direction={'row'}>
                      <Img w={4} h={4} src={location}></Img>
                      <Text fontSize={14}>{teacherInfo?.location}</Text>
                    </Stack>
                    <Stack align={'center'} direction={'row'}>
                      <Img w={4} h={4} src={group}></Img>
                      <Text fontSize={14}>{teacherInfo?.experience} </Text>
                    </Stack>
                    <Stack align={'center'} direction={'row'}>
                      <Img w={4} h={4} src={hat}></Img>
                      <Text fontSize={14} textAlign={'left'}>
                        {teacherInfo?.specialties}
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>

                <Text textAlign={'start'} fontSize={{ base: 14, lg: 16 }} maxW={{ base: '100%', lg: '100%' }}>
                  {teacherInfo?.description}
                </Text>

                <Button bg={'transparent'} color={'purple.500'} fontWeight={700} pl={0} _hover={{ bg: 'transparent' }}>
                  <Stack align={'center'} direction={'row'}>
                    <Img src={message} mr={2} w={6} h={6} />
                    <Text> Свържете се с учителя</Text>
                  </Stack>
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Stack align={'center'} w={{ base: 'full', lg: 'fit-content' }}>
          <EnrollCourseCard elRef={DatesRef} course={course} dateValue={dateValue} />
        </Stack>
      </Stack>

      <Stack spacing={{ base: 6, lg: 12 }} ref={testimonialsRef}>
        <Stack spacing={{ base: 6, lg: 8 }}>
          <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 36 }} color={'grey.600'}>
            Мнения на ученици
          </Heading>

          <Stack spacing={{ base: 12, lg: 14 }}>
            <Stack
              direction={{ base: 'column', lg: 'row' }}
              align={{ base: 'start', lg: 'center' }}
              spacing={6}
              justify={'space-between'}
              w={'full'}>
              <Stack align={'center '} justify={'center'} w={'fit-content'} direction={'row'} spacing={4}>
                <Text fontSize={{ base: 24, lg: 28, xl: 32 }} color={'grey.600'}>
                  {course.rating}
                </Text>

                <Rating rating={course.rating} />
                <Text fontSize={{ base: 14, lg: 16, xl: 16 }} color={'grey.400'}>
                  ({course.numberOfReviews} отзива)
                </Text>
              </Stack>

              <Dropdown
                value={reviewSort}
                onChange={e => setReviewSort(e.value)}
                options={reviewsSortValues}
                optionLabel="name"
                placeholder="Сортирай по"></Dropdown>
            </Stack>

            <Stack direction={'row'} spacing={8} align={'center'} flexWrap={'wrap'}>
              {reviews?.length ? (
                reviews.map((el: any, index: number) => (
                  <Stack key={index} w={'full'} justify={'space-between'} align={'start'} direction={'row'}>
                    <Stack spacing={6} align={{ base: 'center', md: 'start' }}>
                      <Stack
                        spacing={4}
                        direction={{ base: 'column', lg: 'row' }}
                        align={{ base: 'start', lg: 'center' }}
                        justify={'space-between'}>
                        <Stack flex={1} direction={'row'} spacing={4} align={'center'}>
                          <Avatar
                            size="sm"
                            name={`${el.studentsName} ${el.studentsSurname}`}
                            src="https://bit.ly/dan-abramov"
                          />
                          <Text color={'grey.600'}>
                            {el.studentName} {el.studentSurname}
                          </Text>
                          <Rating rating={el.rating} />
                        </Stack>

                        <Text color={'grey.400'} w={'fit-content'}>
                          {el.date}
                        </Text>
                      </Stack>

                      <Stack maxW={'80%'} spacing={6}>
                        <Text textAlign={'start'}>{el.message}</Text>
                      </Stack>
                    </Stack>
                  </Stack>
                ))
              ) : (
                <Text fontSize={{ base: 18, lg: 20 }}>Няма налични мнения на ученици</Text>
              )}
            </Stack>
          </Stack>

          <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
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
        </Stack>
        {similarCourses.length && (
          <Stack spacing={{ base: 4, lg: 8 }} py={{ base: 10, lg: 0 }} px={{ base: 0, xl: '5vw' }}>
            <Grid
              w={'full'}
              templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(5, 1fr)' }}
              gap={{ base: 6, md: 8 }}
              pr={{ base: 0, lg: 8 }}
              alignItems={'baseline'}>
              <GridItem colSpan={{ base: 1, lg: 3 }} colStart={{ base: 1, lg: 2 }}>
                <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 36 }} textAlign="center">
                  <Text as="span" color={'purple.500'}>
                    Подобни
                  </Text>{' '}
                  {course?.privateLesson ? 'уроци' : 'курсове'}
                </Heading>
              </GridItem>

              <GridItem colStart={{ base: 1, lg: 5 }} textAlign={{ base: 'center', lg: 'right' }}>
                <Button
                  as={ReactRouterLink}
                  to={course?.privateLesson ? '/lessons' : '/courses'}
                  fontSize={{ base: 18, lg: 20 }}
                  fontWeight={600}
                  variant={'link'}
                  color={'purple.500'}
                  _hover={{ opacity: '0.9' }}>
                  Виж всички
                </Button>
              </GridItem>
            </Grid>

            <Carousel
              autoPlay={true}
              autoPlaySpeed={3000}
              responsive={responsive}
              partialVisible={true}
              arrows={false}
              showDots={true}
              infinite={true}
              containerClass={style.containerClass}>
              {similarCourses.map((course, index) => (
                <CourseCard key={index} course={course} onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} />
              ))}
            </Carousel>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default LessonPage;
