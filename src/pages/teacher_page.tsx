import React, { useState, useEffect, useMemo, useContext } from 'react';

import {
  Stack,
  IconButton,
  Grid,
  GridItem,
  Button,
  Text,
  Heading,
  Center,
  Avatar,
  Box,
  Img,
  ButtonGroup,
  useToast,
} from '@chakra-ui/react';

import CourseCard from '../components/courses/course_card/course_card.compoment';
import { Rating } from '../components/testimonials/testimonial_card.component';
import ReviewsSection from '../components/reviews';
import { teacherPageBackground } from '../images';
import { group, hat, heart, heartFull, location, messageWhite } from '../icons';
import axios, { axiosInstance } from '../axios';
import { getResponseMessage } from '../helpers/response.util';
import PageLoader from '../utils/loader.component';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useSelector } from 'react-redux';
import { getStudentLiked } from '../store/selectors';
import { useAppDispatch } from '../store';
import { getLikedTeachers } from '../store/features/student/studentFavourites/studentFavourites.async';

const TeacherPage = ({ onLoginOpen, setModalTabIndex }: { onLoginOpen: any; setModalTabIndex: any }) => {
  const toast = useToast();

  const { teacherId } = useParams();
  const { userData } = useContext(AuthContext);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [heartIcon, setHeartIcon] = useState(heart);
  const [reviews, setReviews] = useState<any>([]);
  const [numberOfReviewsShown, setNumberOfReviewsToShow] = useState(5);
  const [teacherInfo, setTeacherInfo] = useState<any>({});
  const [classes, setClasses] = useState<any>([]);
  const [numberOfContentShown, setNumberOfContentToShow] = useState(6);
  const [isLiked, setIsLiked] = useState(false);

  const { likedTeachers } = useSelector(getStudentLiked);

  const showLessReviews = () => {
    setNumberOfReviewsToShow(3);
  };
  const showMore = () => {
    if (numberOfReviewsShown + 3 <= reviews.length) {
      setNumberOfReviewsToShow(numberOfReviewsShown + 3);
    } else {
      setNumberOfReviewsToShow(reviews.length);
    }
  };

  const reviewsToShow = useMemo(() => {
    return ReviewsSection(reviews, numberOfReviewsShown);
  }, [reviews, numberOfReviewsShown]);

  const contentToShow = useMemo(() => {
    return classes?.slice(0, numberOfContentShown).map((el: any, index: number) => (
      <GridItem key={index}>
        <CourseCard course={el} onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} />
      </GridItem>
    ));
  }, [classes, numberOfContentShown]);

  const showAll = () => {
    setNumberOfContentToShow(classes.length);
  };

  const showLessContent = () => {
    setNumberOfContentToShow(6);
  };

  const addToFavourites = async ev => {
    ev.preventDefault();
    if (userData && userData.id) {
      try {
        await axiosInstance.get(`/users/likeTeacher/${teacherId}`);

        setHeartIcon(heartFull);
        dispatch(getLikedTeachers());
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

  useEffect(() => {
    axios
      .get(`users/getTeacherProfile/${teacherId}`)
      .then(res => {
        setTeacherInfo(res.data);
        setReviews(res.data?.reviews);
        setClasses(res.data?.lessonResponses);
        setIsLoading(false);
      })
      .catch(function (error) {
        toast({
          title: getResponseMessage(error),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        setIsLoading(false);
      });
  }, []);

  // useEffect(() => {}, [likedTeachers]);

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={20}
      py={{ base: 8, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 24, lg: 40 }}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Center
        w={'full'}
        backgroundImage={teacherPageBackground}
        backgroundSize={{ base: '100%', md: 'contain' }}
        backgroundRepeat={'no-repeat'}
        backgroundPosition={{ base: 'center top', md: 'center' }}>
        <Box maxW={'320px'} w={'full'} bg={'transparent'} textAlign={'center'}>
          <Stack spacing={6} align={'center'}>
            <Stack position={'relative'} align={'center'} pt={14} mb={4}>
              <Avatar
                size={'xl'}
                src={
                  'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                }
                mb={4}
                zIndex={10}
              />
              <Box
                w={'108px'}
                h={'108px'}
                zIndex={2}
                bg={'purple.500'}
                rounded={'100%'}
                position={'absolute'}
                bottom={'10px'}></Box>
              <Box
                w={'120px'}
                h={'120px'}
                zIndex={1}
                bg={'purple.400'}
                rounded={'100%'}
                position={'absolute'}
                bottom={'4px'}></Box>
              <Box
                w={'134px'}
                h={'134px'}
                zIndex={0}
                bg={'purple.200'}
                rounded={'100%'}
                position={'absolute'}
                bottom={'-4px'}></Box>
            </Stack>

            <Heading fontSize={'2xl'} color={'gray.600'}>
              {teacherInfo?.firstName} {teacherInfo?.secondName}
            </Heading>

            <Stack align={'center'}>
              <Text fontWeight={600} color={'gray.600'}>
                {teacherInfo?.specialties}
              </Text>
              <Text textAlign={'center'} fontWeight={700} color={'purple.500'} px={3}>
                {teacherInfo?.experience}
              </Text>
              <Stack direction={'row'}>
                <Rating rating={teacherInfo?.rating} />
                <Text color={'grey.400'}>
                  ({teacherInfo?.numberOfReviews} {teacherInfo?.numberOfReviews > 1 ? 'отзива' : 'отзив'} )
                </Text>
              </Stack>
            </Stack>
            <Button
              size={{ base: 'sm', md: 'md' }}
              w={'full'}
              bg={'purple.500'}
              color={'white'}
              fontWeight={700}
              _hover={{ opacity: 0.9 }}>
              <Img src={messageWhite} color="white" mr={2} w={6} h={6} />
              Свържете се с учителя
            </Button>

            <ButtonGroup
              size="sm"
              isAttached
              variant="link"
              _hover={{ textDecoration: 'none' }}
              onMouseEnter={() => setHeartIcon(heartFull)}
              onMouseLeave={() => setHeartIcon(heart)}
              onClick={ev => addToFavourites(ev)}>
              <IconButton aria-label="Add to favourites" icon={<Img src={heartIcon} h={5} w={'full'} />} />
              <Button color={'purple.500'} _hover={{ textDecoration: 'none', opacity: 0.9 }}>
                <Text fontSize={16} fontWeight={700} ml={2}>
                  Добави в любими
                </Text>
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>
      </Center>

      <Stack align={'start'} bg={'purple.100'} rounded={'lg'} p={12} spacing={6}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 36 }} textAlign="center" color={'grey.600'}>
          За мен
        </Heading>

        <Stack align={'start'} justify={'center'}>
          <Stack align={'center'} direction={'row'}>
            <Img w={4} h={4} src={location}></Img>
            <Text fontSize={14} textAlign={'start'}>
              {teacherInfo?.location}
            </Text>
          </Stack>
          <Stack align={'center'} direction={'row'}>
            <Img w={4} h={4} src={group}></Img>
            <Text fontSize={14} textAlign={'start'}>
              {teacherInfo?.experience}
            </Text>
          </Stack>
          <Stack align={'center'} direction={'row'}>
            <Img w={4} h={4} src={hat}></Img>
            <Text fontSize={14} textAlign={'start'}>
              {teacherInfo?.specialties}
            </Text>
          </Stack>
        </Stack>

        <Text
          textAlign={'start'}
          color={'grey.600'}
          fontSize={{ base: 14, lg: 16 }}
          maxW={{ base: '100%', lg: '100%' }}>
          {teacherInfo?.description}
        </Text>
      </Stack>

      <Stack align={'center'} spacing={8}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 36 }} textAlign="center" color={'grey.600'}>
          Моите курсове и уроци
        </Heading>
        {contentToShow?.length ? (
          <Grid
            templateColumns={{ base: 'repeat(auto-fill, minmax(200px, 1fr))', lg: 'repeat(3, 1fr)' }}
            gap={{ base: 8, lg: 6 }}
            w={'full'}>
            {contentToShow}
          </Grid>
        ) : (
          <Text textAlign="center" fontSize={{ base: 18, lg: 20 }}>
            Няма налични курсове
          </Text>
        )}

        {contentToShow.length && classes.length == contentToShow.length ? null : (
          <Button
            px={8}
            fontSize={{ base: 18, lg: 20 }}
            fontWeight={600}
            bg={'purple.500'}
            color="white"
            _hover={{ opacity: 0.9 }}
            width={'fit-content'}
            onClick={contentToShow.length < classes.length ? showAll : showLessContent}>
            {classes.length > contentToShow.length ? 'Виж всички ' : 'Виж по-малко'}
          </Button>
        )}
      </Stack>

      <Stack spacing={8} align={{ base: 'center', lg: 'start' }}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 36 }} textAlign="center" color={'grey.600'}>
          Мнения на ученици
        </Heading>

        <Stack spacing={{ base: 12, lg: 14 }}>
          <Stack direction={'row'} spacing={8} align={'center'} flexWrap={'wrap'}>
            {reviewsToShow.length ? (
              reviewsToShow
            ) : (
              <Text fontSize={{ base: 18, lg: 20 }}>Няма налични мнения на ученици</Text>
            )}

            {reviewsToShow.length && (
              <Button
                fontSize={{ base: 18, lg: 20 }}
                fontWeight={600}
                bg={'transparent'}
                color="purple.500"
                _hover={{ bg: 'transparent' }}
                width={'fit-content'}
                p={0}
                onClick={reviewsToShow.length < reviews.length ? showMore : showLessReviews}>
                {reviewsToShow.length < reviews.length ? 'Виж повече ' : 'Виж по-малко'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TeacherPage;
