import React, { useRef, useState, useMemo, useEffect } from 'react';
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

import axios from '../../axios';

import {
  heart,
  heartFull,
  message,
  group,
  location,
  hat,
  editWhite,
  edit,
  calendar,
  clock,
} from '../../../icons/index';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';

const CourseResources = ({ course }: { course: any }) => {
  const toast = useToast();

  const [openedCourse, setOpenedCourse] = useState(null);

  const getOpenedCourse = async () => {
    try {
      const res = await axiosInstance.get(`lessons/getCourseClassroomPage/${course.courseTerminId}`);
      setOpenedCourse(res.data);
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };
  useEffect(() => {
    getOpenedCourse();
  }, []);

  return (
    <Stack py={{ base: 0, lg: 2 }} spacing={6}>
      <Stack w={'full'} direction={{ base: 'column', md: 'row' }}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          Математика за 7 клас
        </Heading>

        <Button
          size={{ base: 'md', lg: 'md' }}
          color={'purple.500'}
          bg={'transparent'}
          fontSize={{ base: 16, '2xl': 20 }}
          fontWeight={700}
          _hover={{ bg: 'transparent' }}
          px={8}
          w={'fit-content'}>
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Img src={edit} alt={'add course'} h={5} w={5} />
            <Text>Редактирай курса</Text>
          </Stack>
        </Button>
      </Stack>

      <Stack spacing={4}>
        <Stack direction={'row'} spacing={4} align={'center'}>
          <Img src={calendar} alt={'calendar icon'} w={5} h={5} />
          <Text color={'grey.500'}>
            {capitalizeMonth(format(new Date(course?.startDate), 'dd LLL yyyy', { locale: bg }))} -{' '}
            {course?.endDate && capitalizeMonth(format(new Date(course?.endDate), 'dd LLL yyyy', { locale: bg }))}
          </Text>
        </Stack>

        <Stack direction={'row'} spacing={4} align={'start'}>
          <Img src={clock} alt={'calendar icon'} w={5} h={5} mt={2} />
          <Stack spacing={1}>
            <Text color={'grey.500'}>{course?.courseDays}</Text>
            <Text color={'grey.500'}>{course?.courseHours}</Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CourseResources;
