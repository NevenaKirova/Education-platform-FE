import React, { useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { Box, Center, Heading, Text, Stack, Avatar, Image, useColorModeValue, Button, Img } from '@chakra-ui/react';
import { getDate } from '../../../pages/lessons/[id]';
import { calendar } from '../../../icons/index';

type Termin = {
  startDate: string;
  endDate: string;
  weekLength: number;
  courseDays: string;
  courseHours: string;
  studentsUpperBound: number;
  studentsLowerBound: number;
};

export default function EnrollCourseCard({ elRef, course, dateValue }: { elRef: any; course: any; dateValue: any }) {
  const [termin, setTermin] = useState<Termin | null>(null);

  useEffect(() => {
    setTermin(course?.courseTerminResponses?.[dateValue]);
  }, [course, dateValue]);

  const handleScroll = () => {
    elRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Center py={6} w={'full'}>
      <Box
        maxW={{ base: 'full', md: 'fit-content', xl: '28vw', '2xl': '23vw' }}
        w={'full'}
        bg={'white'}
        rounded={'md'}
        p={{ base: 4, lg: 6 }}
        boxShadow="custom"
        overflow={'hidden'}>
        <Box w={{ base: 'full', md: 'md', xl: 'full' }} bg={'white'} mb={6} pos={'relative'} rounded="lg">
          <Image
            src={
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            alt="Course image"
            borderRadius={10}
            p={{ base: 0, xs: 4 }}
          />
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
              {termin && `${getDate(new Date(termin?.startDate))} -  ${getDate(new Date(termin?.endDate))}`}
            </Heading>
            <Stack direction={'row'} spacing={2} align={'center'} justify={'center'}>
              <Avatar size={{ base: 'xs', md: 'sm' }} src={'https://avatars0.githubusercontent.com/u/1164541?v=4'} />
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
                {termin?.weekLength} седмици
              </Text>
            </Stack>
            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Дни на провеждане:
              </Text>
              <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                {termin?.courseDays}
              </Text>
            </Stack>
            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Час на провеждане:
              </Text>
              <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                {termin?.courseHours}
              </Text>
            </Stack>
            <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
              <Text fontWeight={500} fontSize={{ base: 14, md: 16 }}>
                Група:
              </Text>
              <Text color={'grey.500'} fontSize={{ base: 14, md: 16 }}>
                {termin && `1-${termin?.studentsUpperBound} ученици`}
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
              as={ReactRouterLink}
              to={'/lessons/1/enroll'}
              state={{ payType: 'fullPay' }}
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
              as={ReactRouterLink}
              to={'/lessons/1/enroll'}
              state={{ payType: 'subscription' }}
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
