import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  Image,
  Button,
  Img,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { getDate } from '../../../pages/lessons/[id]';
import { calendar } from '../../../icons';
import { daysArr } from '../courses_teacher/create_course.component';
import { getResponseMessage } from '../../../helpers/response.util';
import AuthContext from '../../../context/AuthContext';

type Termin = {
  startDate: string;
  endDate: string;
  weekLength: number;
  courseDays: string;
  courseHours: string;
  studentsUpperBound: number;
  studentsLowerBound: number;
  courseTerminId: number;
  length: number;
  lessonID: number;
};

export default function EnrollCourseCard({
  elRef,
  course,
  dateValue,
  onLoginOpen,
  setModalTabIndex,
}: {
  elRef: any;
  course: any;
  dateValue: any;
  onLoginOpen: any;
  setModalTabIndex: any;
}) {
  const [termin, setTermin] = useState<Termin | null>(null);

  const toast = useToast();
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const enrollCourse = async (ev, state) => {
    ev.preventDefault();
    if (userData && userData.id) {
      try {
        navigate(`/lessons/${course?.privateLesson ? termin?.lessonTerminId : termin?.courseTerminId}/enroll`, {
          state: { payType: state },
        });
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
    course.privateLesson
      ? setTermin(course?.privateLessonTermins?.[dateValue])
      : setTermin(course?.courseTerminRequests?.[dateValue]);
  }, [course, dateValue]);

  const handleScroll = () => {
    elRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Center py={6} w={'full'} >
      <Box
        maxW={{ base: 'full', md: 'fit-content', xl: '28vw', '2xl': '23vw' }}
        minW={'380px'}
        w={'full'}
        bg={'white'}
        rounded={'md'}
        p={{ base: 4, lg: 6 }}
        boxShadow="custom"
        overflow={'hidden'}>
        <Box w={{ base: 'full', md: 'md', xl: 'full' }} bg={'white'} mb={6} pos={'relative'} rounded="lg">
          <Image src={course?.urlToImage} alt="Course image" borderRadius={10} p={{ base: 0, xs: 4 }} />
        </Box>
        <Stack direction={'column'} align={'center'} spacing={6}>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align={{ base: 'start', lg: 'center' }}
            justify="space-between"
            spacing={4}
            w={'full'}
            flexWrap={'wrap'}>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={{ base: 'lg', md: 'xl' }}
              fontFamily={'body'}>
              {termin
                ? course?.privateLesson
                  ? `${getDate(new Date(termin?.date))}`
                  : `${getDate(new Date(termin?.startDate))} -  ${getDate(new Date(termin?.endDate))}`
                : ''}
            </Heading>
            <Stack direction={'row'} spacing={2} align={'center'} justify={'center'}>
              <Avatar size={{ base: 'xs', md: 'sm' }} src={course?.teacherResponse?.picture} />
              <Text color={'grey.500'}>
                {course.teacherName} {course.teacherSurname}
              </Text>
            </Stack>
          </Stack>

          <Stack direction={'column'} align={'center'} justify="space-between" spacing={4} w={'full'}>
            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Продължителност:
              </Text>
              <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                {course?.privateLesson ? `${termin?.length} минути` : `${termin?.weekLength} седмици`}
              </Text>
            </Stack>

            {!course.privateLesson && (
              <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
                <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                  Дни на провеждане:
                </Text>
                <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                  {termin?.courseDaysNumbers?.map(el => daysArr[el - 1].short).join(',')}
                </Text>
              </Stack>
            )}

            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Час на провеждане:
              </Text>
              <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                {course?.privateLesson ? `${termin?.time}` : `${termin?.courseHours}`}
              </Text>
            </Stack>
            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Група:
              </Text>
              <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                {course?.privateLesson ? 'индивидуален урок' : termin && `1-${termin?.studentsUpperBound} ученици`}
              </Text>
            </Stack>
            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Цена:
              </Text>
              <Text fontWeight={700} fontSize={{ base: 16, lg: 18 }} textAlign={'right'}>
                {course?.price}лв {''}
                <Text as={'span'} fontWeight={400} color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                  ({course?.pricePerHour}лв/ час)
                </Text>
              </Text>
            </Stack>
          </Stack>

          <Stack spacing={2} w={'full'}>
            <Button
              size={{ base: 'md', lg: 'md' }}
              color={'purple.500'}
              bg={'transparent'}
              fontSize={{ base: 16, '2xl': 18 }}
              fontWeight={700}
              _hover={{ bg: 'transparent' }}
              onClick={handleScroll}>
              <Stack direction={'row'} align={'center'}>
                <Img src={calendar} alt={'calendar icon'} />
                <Text> Избери друга дата </Text>
              </Stack>
            </Button>

            <Button
              onClick={ev => enrollCourse(ev, 'fullPay')}
              w={'full'}
              size={{ base: 'md', lg: 'md' }}
              color={'white'}
              bg={'purple.500'}
              fontSize={{ base: 16, '2xl': 18 }}
              fontWeight={700}
              _hover={{ opacity: '0.9' }}>
              Запиши се
            </Button>

            <Button
              onClick={ev => enrollCourse(ev, 'subscription')}
              size={{ base: 'md', lg: 'md' }}
              color={'purple.500'}
              bg={'transparent'}
              fontSize={{ base: 16, '2xl': 18 }}
              fontWeight={700}
              _hover={{ bg: 'transparent' }}>
              Абонирай се
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
