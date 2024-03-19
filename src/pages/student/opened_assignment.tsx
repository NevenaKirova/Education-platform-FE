import React, { useContext } from 'react';

import {
  Stack,
  Button,
  Text,
  Heading,
  Avatar,
  Img,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
} from '@chakra-ui/react';

import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';
import { fileDownload } from '../../icons';

import { Navigate, NavLink as ReactRouterLink, useLocation, useParams, useNavigate } from 'react-router-dom';

import AuthContext from '../../context/AuthContext';

import { downloadFile } from '../../helpers/downloadFile';
import { capitalizeMonth } from '../../helpers/capitalizeMonth.util';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

const StudentOpenedAssignmentPage = () => {
  const { user } = useContext(AuthContext);
  const { courseId, assignmentId } = useParams();
  const { state } = useLocation();

  const toast = useToast();
  const navigate = useNavigate();

  const downloadResource = async type => {
    try {
      let res;
      if (type === 'asignment') {
        res = await axiosInstance.get(`/lessons/getAssignmentFile/${state?.homework?.fileNames}&&${assignmentId}`, {
          responseType: 'blob',
        });
      } else {
        res = await axiosInstance.get(
          `/lessons/getSolutionFile/${state?.homework?.solutionFileNames}&&${state?.homework?.solutionId}`,
          {
            responseType: 'blob',
          },
        );
      }

      downloadFile(res);
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

  if (!user) return <Navigate to={'/'} replace />;

  return (
    <Stack
      spacing={{ base: 8 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
      my={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Breadcrumb fontSize={{ base: 14, lg: 18 }} cursor={'default'}>
        <BreadcrumbItem _hover={{ textDecoration: 'none', cursor: 'default' }} cursor={'default'}>
          <BreadcrumbLink as={ReactRouterLink} to={`/my-dashboard`} textDecoration={'none'} cursor={'default'}>
            Моите уроци
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem
          color={'purple.500'}
          _hover={{ textDecoration: 'none' }}
          textDecoration={'none'}
          cursor={'default'}>
          <BreadcrumbLink
            onClick={() =>
              navigate(`/course/${courseId}`, {
                replace: true,
              })
            }
            textDecoration={'none'}>
            {state?.courseTitle}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'} isCurrentPage>
          <BreadcrumbLink textDecoration={'none'}>Задача за домашна работа</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Stack spacing={6} align={'start'} mb={6} w={'full'}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          Задача за домашна работа
        </Heading>

        <Stack spacing={8}>
          <Stack spacing={2}>
            <Stack direction={'row'} spacing={2} fontWeight={600}>
              <Text fontSize={16}>Краен срок:</Text>
              <Text fontSize={16} color={'grey.400'}>
                {capitalizeMonth(format(new Date(state?.homework?.date), 'dd LLL yyyy', { locale: bg }))}{' '}
                {state?.homework?.time}
              </Text>
            </Stack>

            <Stack direction={'row'} spacing={2} fontSize={16} fontWeight={600}>
              <Text>Състояние:</Text>

              {state?.homework?.status === 'Not submitted' ? (
                <Text color={'red'}>Непредаден </Text>
              ) : (
                <Text color={'green.100'}>Предаден </Text>
              )}
            </Stack>
          </Stack>

          <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
            {state?.homework?.description}
          </Heading>

          <Stack
            as={Button}
            onClick={() => downloadResource('assignment')}
            direction={'row'}
            align={'center'}
            justify={'start'}
            spacing={3}>
            <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
            <Text fontWeight={600} color={'grey.600'}>
              {state?.homework.fileNames}
            </Text>
          </Stack>

          <Heading flex={1} fontSize={{ base: 16, lg: 20 }} textAlign="start" color={'grey.600'} fontWeight={700}>
            Моите файлове
          </Heading>

          <Stack
            as={Button}
            onClick={() => downloadResource('solution')}
            direction={'row'}
            align={'center'}
            justify={'start'}
            spacing={3}>
            <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
            <Text fontWeight={600} color={'grey.600'}>
              {state?.homework.solutionFileNames}
            </Text>
          </Stack>

          <Heading flex={1} fontSize={{ base: 16, lg: 20 }} textAlign="start" color={'grey.600'} fontWeight={700}>
            Коментари ({state?.homework?.comments.length})
          </Heading>

          {state?.homework?.comments.length ? (
            state?.homework?.comments?.map((el, index) => (
              <Stack key={index} color={'grey.500'} pr={6}>
                <Stack w={'full'} justify={'space-between'} direction={'row'}>
                  <Stack flex={1} direction={'row'} spacing={4} fontWeight={600} align={'center'}>
                    <Avatar size={{ base: 'xs', md: 'sm' }} src={el?.image} />

                    <Text>{el?.teacherName}</Text>

                    <Text fontSize={16} color={'grey.400'}>
                      {capitalizeMonth(format(new Date(el?.date), 'dd LLL yyyy', { locale: bg }))} {el?.time}
                    </Text>
                  </Stack>
                </Stack>

                <Text ml={12} textAlign={'start'}>
                  {el?.comment}
                </Text>
              </Stack>
            ))
          ) : (
            <Text fontSize={{ base: 16 }} color={'grey.500'} textAlign={'start'}>
              Все още няма добавен коментар
            </Text>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default StudentOpenedAssignmentPage;
