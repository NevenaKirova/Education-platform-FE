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
  WrapItem,
  Wrap,
  Image,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Switch,
} from '@chakra-ui/react';

import PageLoader from '../../utils/loader.component';
import { useAppDispatch } from '../../store';
import { useSelector } from 'react-redux';
import { getStudentLiked } from '../../store/selectors';
import {
  getLikedCourses,
  getLikedTeachers,
} from '../../store/features/student/studentFavourites/studentFavourites.async';
import { addPerson, heartFull } from '../../icons';

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
import { account, avatar3, avatar4, avatar5, avatar6, studentAvatar, teacherAvatar } from '../../images';
import { SubmitHandler, useForm } from 'react-hook-form';

const StudentProfilePage = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { user, userData } = useContext(AuthContext);

  const [selectedAvatar, setSelectedAvatar] = useState(5);
  const [gender, setGender] = useState('');

  const avatars = [teacherAvatar, studentAvatar, avatar3, avatar4, avatar5, avatar6];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      gender: '',
    },
    values: {
      name: 'Невена',
      surname: 'Кирова',
      gender: 'жена',
    },
  });

  const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<any> = async data => {
    console.log(data);
  };

  const onSubmitEmail: SubmitHandler<any> = async data => {
    console.log(data);
  };

  console.log(userData);

  if (!user) return <Navigate to={'/'} replace />;
  if (userData && userData?.role !== 'STUDENT') return <Navigate to={'/'} replace />;

  return (
    <Stack
      spacing={{ base: 10, lg: 12 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Heading textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
        Моят профил
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={12} align={'start'}>
          <Stack spacing={6}>
            <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
              Аватар
            </Text>

            <Text textAlign={'left'} fontSize={{ base: 14, md: 16 }} color={'grey.600'}>
              Избери своя аватар или добави снимка
            </Text>

            <Wrap spacing={8}>
              {avatars.map((el, index) => (
                <WrapItem key={index}>
                  <Box
                    as={'button'}
                    role="group"
                    onClick={() => {
                      setSelectedAvatar(index);
                    }}
                    borderRadius="full"
                    _hover={{
                      transition: 'transform .2s',
                      transform: 'scale(1.05)',
                    }}>
                    <Image
                      borderRadius="full"
                      border={selectedAvatar === index ? '5px solid' : ''}
                      borderColor={selectedAvatar === index ? 'purple.500' : ''}
                      boxSize={20}
                      src={el}
                      alt={el}
                    />
                  </Box>
                </WrapItem>
              ))}
              <WrapItem>
                <Stack direction="row" as={'button'} align={'center'} spacing={4}>
                  <Box
                    role="group"
                    bg={'purple.500'}
                    borderRadius="full"
                    _hover={{
                      transition: 'transform .2s',
                      transform: 'scale(1.05)',
                    }}>
                    <Image borderRadius="full" boxSize={20} src={account} alt={'add picture'} />
                  </Box>

                  <Text textAlign={'left'} fontSize={{ base: 16 }} fontWeight={700} color={'purple.500'}>
                    Добави снимка
                  </Text>
                </Stack>
              </WrapItem>
            </Wrap>
          </Stack>

          <Stack spacing={6} w={'full'}>
            <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
              Лична информация
            </Text>

            <Stack direction={'row'} spacing={6} maxW={'50%'}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel fontWeight={700} color={'purple.500'} pb={2}>
                  Име
                </FormLabel>

                <Input
                  pr="4.5rem"
                  maxLength={100}
                  resize={'none'}
                  placeholder={'Име'}
                  bg={'grey.100'}
                  {...register('name', { required: 'Полето е задължително' })}
                />

                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.surname}>
                <FormLabel fontWeight={700} color={'purple.500'} pb={2}>
                  Фамилия
                </FormLabel>

                <Input
                  pr="4.5rem"
                  maxLength={100}
                  resize={'none'}
                  placeholder={'Фамилия'}
                  bg={'grey.100'}
                  {...register('surname', { required: 'Полето е задължително' })}
                />

                <FormErrorMessage>{errors?.surname?.message}</FormErrorMessage>
              </FormControl>
            </Stack>
          </Stack>

          <Stack spacing={6} w={'full'}>
            <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
              Пол
            </Text>

            <FormControl isInvalid={!!errors.gender}>
              <RadioGroup
                value={gender}
                onChange={e => {
                  setValue('gender', e);
                  setGender(e);
                }}>
                <Stack spacing={10} direction="row" align={'start'}>
                  <Radio size="lg" colorScheme="purple" value={'FEMALE'} bg={'grey.100'}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      Жена
                    </Text>
                  </Radio>
                  <Radio size="lg" colorScheme="purple" value={'MALE'} bg={'grey.100'}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      Мъж
                    </Text>
                  </Radio>
                </Stack>
              </RadioGroup>
              <FormErrorMessage>{errors?.gender?.message}</FormErrorMessage>
            </FormControl>
          </Stack>

          <Stack spacing={6} w={'full'}>
            <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
              Известия
            </Text>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch id="client" />
              <FormLabel htmlFor="client">
                <Stack spacing={0}>
                  <Text fontWeight={700} color={'grey.600'}>Обслужване на клиенти</Text>
                  <Text color={'grey.400'}>Искам да получавам информативни имейли във връзка с обслужването на клиенти</Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch id="marketing" />
              <FormLabel htmlFor="marketing">
                <Stack spacing={0}>
                  <Text fontWeight={700} color={'grey.600'}>Маркетинг</Text>
                  <Text color={'grey.400'}>Искам да получавам маркетингови имейли, свързани с предстоящи уроци и обучения</Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch id="reminders" />
              <FormLabel htmlFor="reminders">
                <Stack spacing={0}>
                  <Text fontWeight={700} color={'grey.600'}>Напомянния</Text>
                  <Text color={'grey.400'}>Искам да получавам имейли преди започването на урози, записани от мен</Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch id="chat" />
              <FormLabel htmlFor="chat">
                <Stack spacing={0}>
                  <Text fontWeight={700} color={'grey.600'}>Чат известия</Text>
                  <Text color={'grey.400'}>Искам да получавам имейли, свързани с нови съобщения </Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch id="courses" />
              <FormLabel htmlFor="courses">
                <Stack spacing={0}>
                  <Text fontWeight={700} color={'grey.600'}>Известия за запазени курсове</Text>
                  <Text color={'grey.400'}>Искам да получавам имейли, свързани с промени в курсове или уроци, които съм записал/а</Text>
                </Stack>
              </FormLabel>
            </FormControl>
          </Stack>

          <Button
            type={'submit'}
            size={{ base: 'md' }}
            w={'fit-content'}
            px={16}
            py={0}
            bg={'purple.500'}
            color={'white'}
            fontSize={16}
            fontWeight={700}
            _hover={{ opacity: '0.95' }}
            _focus={{ outline: 'none' }}
            _active={{ bg: 'purple.500' }}>
            Запази промените
          </Button>
        </Stack>
      </form>

      <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
        <Stack spacing={6}>
          <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
            Промяна на парола
          </Text>

          <Text textAlign={'left'} fontSize={{ base: 14, md: 16 }} color={'grey.600'}>
            Въведете соя имейл, за да полчите линк за промяна на паролата.
          </Text>

          <Input
            pr="4.5rem"
            maxLength={100}
            resize={'none'}
            placeholder={'myemail@mail.com'}
            bg={'grey.100'}
            {...registerEmail('email')}
          />

          <Button
            type={'submit'}
            size={{ base: 'md' }}
            w={'fit-content'}
            px={16}
            py={0}
            bg={'purple.500'}
            color={'white'}
            fontSize={16}
            fontWeight={700}
            _hover={{ opacity: '0.95' }}
            _focus={{ outline: 'none' }}
            _active={{ bg: 'purple.500' }}>
            Изпрати
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default StudentProfilePage;
