import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  WrapItem,
  Wrap,
  Image,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Switch,
  InputGroup,
  Textarea,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';

import PageLoader from '../../utils/loader.component';

import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';

import { SubmitHandler, useForm } from 'react-hook-form';
import PreviewDropzone from '../../utils/preview_dropzone';
import AvatarDropzone from '../../utils/avatar_dropzone';

const StudentProfilePage = () => {
  const toast = useToast();
  const { user, userData } = useContext(AuthContext);

  const [profile, setProfile] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [gender, setGender] = useState('');
  const [client, setClient] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [reminders, setReminders] = useState(false);
  const [chat, setChat] = useState(false);
  const [courses, setCourses] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [avatars, setAvatars] = useState([]);

  const getProfile = async () => {
    try {
      const url = userData?.role === 'STUDENT' ? 'getStudentProfile' : 'getTeacherProfile';
      setIsLoading(true);
      const res = await axiosInstance.get(`users/${url}`);

      if (userData?.role === 'STUDENT') {
        setAvatars(res.data?.pictures);
        setSelectedAvatar(profile?.imageLocation);
      }

      setProfile(res.data);
      setGender(res.data?.gender);
      setClient(res.data?.clientService);
      setMarketing(res.data?.marketingService);
      setReminders(res.data?.reminders);
      setChat(res.data?.chatNotifications);
      setCourses(res.data?.savedCoursesNotifications);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
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
    getProfile();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: null,
      name: '',
      surname: '',
      gender: '',
      clientService: false,
      marketingService: false,
      reminders: false,
      chatNotifications: false,
      savedCoursesNotifications: false,
      imageLocation: '',
      description: '',
      subjects: '',
    },
    values: {
      id: profile?.id,
      name: profile?.name,
      surname: profile?.surname,
      gender: profile?.gender,
      clientService: profile?.clientService,
      marketingService: profile?.marketingService,
      reminders: profile?.reminders,
      chatNotifications: profile?.chatNotifications,
      savedCoursesNotifications: profile?.savedCoursesNotifications,
      imageLocation: profile?.imageLocation,
      description: profile?.description,
      subjects: profile?.subjects,
    },
  });

  const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onFileAccepted = async file => {
    if (userData?.role === 'STUDENT') setSelectedAvatar('custom');

    try {
      const url = userData?.role === 'STUDENT' ? 'uploadImageStudent' : 'uploadImageTeacher';
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post(`users/${url}`, formData);

      if (userData?.role === 'STUDENT') {
        setAvatars(res.data?.pictures);
      } else {
        setValue('imageLocation', res.data);
      }
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

  const onSubmit: SubmitHandler<any> = async data => {
    try {
      setIsLoading(true);
      const url = userData?.role === 'STUDENT' ? 'editStudentProfile' : 'editTeacherProfile';
      await axiosInstance.post(`users/${url}`, data);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const onSubmitEmail: SubmitHandler<any> = async data => {
    try {
      await axiosInstance.get(`/auth/resetPassword/${data.email}`);

      toast({
        title: 'Изпратен Ви е имейл с инструкции за въстановяване на паролата',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
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
  };

  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 10, lg: 12 }}
      py={{ base: 10, lg: 10 }}
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
          {userData?.role === 'STUDENT' ? (
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
                      onClick={ev => {
                        ev.preventDefault();
                        setSelectedAvatar(el);
                        setValue('imageLocation', el);
                      }}
                      borderRadius="full"
                      _hover={{
                        transition: 'transform .2s',
                        transform: 'scale(1.05)',
                      }}>
                      <Image
                        borderRadius="full"
                        border={selectedAvatar === el ? '5px solid' : ''}
                        borderColor={selectedAvatar === el ? 'purple.500' : ''}
                        boxSize={20}
                        src={el}
                        alt={`avatar${index}`}
                        onLoad={() => {
                          URL.revokeObjectURL(el);
                        }}
                      />
                    </Box>
                  </WrapItem>
                ))}

                <WrapItem>
                  <AvatarDropzone onFileAccepted={onFileAccepted} />
                </WrapItem>
              </Wrap>
            </Stack>
          ) : (
            <Stack spacing={4}>
              <FormControl isInvalid={!!errors.picture}>
                <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                  Профилна снимка
                </FormLabel>

                <PreviewDropzone onFileAccepted={onFileAccepted} pictureUrl={getValues('imageLocation')} />

                <FormErrorMessage>{errors?.picture?.message}</FormErrorMessage>
              </FormControl>

              <Stack fontSize={{ base: 14, lg: 16 }} align={'start'}>
                <Text fontWeight={400} color={'grey.400'}>
                  Моля добавете ясна профилна снимка (5 MB)
                </Text>
                <Text fontWeight={400} color={'grey.400'}>
                  Допустими файлови формати .jpg .jpeg .png
                </Text>
              </Stack>
            </Stack>
          )}

          <Stack spacing={6} w={'full'}>
            <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
              Лична информация
            </Text>

            <Stack direction={'row'} spacing={6} maxW={{ base: 'full', lg: '50%' }}>
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

          {userData?.role === 'TEACHER' && (
            <>
              <Stack spacing={6} w={'full'}>
                <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
                  Описание на профила
                </Text>

                <FormControl isInvalid={!!errors.description}>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Textarea
                      pr="4.5rem"
                      maxLength={600}
                      resize={'none'}
                      rows={4}
                      {...register('description', { required: 'Полето е задължително' })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('description')?.length || 0}/600
                    </InputRightElement>
                  </InputGroup>

                  <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
                </FormControl>
              </Stack>

              <Stack spacing={6} w={'full'} align={'start'}>
                <Text textAlign={'left'} fontSize={{ base: 18, md: 20 }} fontWeight={700} color={'grey.600'}>
                  Предмети/ Сфери на интерес
                </Text>

                <FormControl isInvalid={!!errors.gender}>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Input
                      pr="4.5rem"
                      maxLength={200}
                      resize={'none'}
                      placeholder={'Предмети'}
                      {...register('subjects', { required: 'Полето е задължително' })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('subjects')?.length || 0}/200
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.subjects?.message}</FormErrorMessage>
                </FormControl>

                <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                  Моля добавете предмети/сфери, в които желаете да преподавате в платформата.
                </Text>
              </Stack>
            </>
          )}

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
              <Switch
                id="client"
                colorScheme={'purple'}
                isChecked={client}
                onChange={e => {
                  setValue('clientService', e.target.checked);
                  setClient(e.target.checked);
                }}
              />
              <FormLabel htmlFor="client">
                <Stack spacing={0} fontSize={{ base: 14, lg: 16 }}>
                  <Text fontWeight={700} color={'grey.600'}>
                    Обслужване на клиенти
                  </Text>
                  <Text color={'grey.400'}>
                    Искам да получавам информативни имейли във връзка с обслужването на клиенти
                  </Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch
                id="marketing"
                colorScheme={'purple'}
                isChecked={marketing}
                onChange={e => {
                  setValue('marketingService', e.target.checked);
                  setMarketing(e.target.checked);
                }}
              />
              <FormLabel htmlFor="marketing">
                <Stack spacing={0} fontSize={{ base: 14, lg: 16 }}>
                  <Text fontWeight={700} color={'grey.600'}>
                    Маркетинг
                  </Text>
                  <Text color={'grey.400'}>
                    Искам да получавам маркетингови имейли, свързани с предстоящи уроци и обучения
                  </Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch
                id="reminders"
                colorScheme={'purple'}
                isChecked={reminders}
                onChange={e => {
                  setValue('reminders', e.target.checked);
                  setReminders(e.target.checked);
                }}
              />
              <FormLabel htmlFor="reminders">
                <Stack spacing={0} fontSize={{ base: 14, lg: 16 }}>
                  <Text fontWeight={700} color={'grey.600'}>
                    Напомянния
                  </Text>
                  <Text color={'grey.400'}>Искам да получавам имейли преди започването на урози, записани от мен</Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch
                id="chat"
                colorScheme={'purple'}
                isChecked={chat}
                onChange={e => {
                  setValue('chatNotifications', e.target.checked);
                  setChat(e.target.checked);
                }}
              />
              <FormLabel htmlFor="chat">
                <Stack spacing={0} fontSize={{ base: 14, lg: 16 }}>
                  <Text fontWeight={700} color={'grey.600'}>
                    Чат известия
                  </Text>
                  <Text color={'grey.400'}>Искам да получавам имейли, свързани с нови съобщения </Text>
                </Stack>
              </FormLabel>
            </FormControl>

            <FormControl as={Stack} direction={'row'} align={'center'} spacing={4}>
              <Switch
                id="courses"
                colorScheme={'purple'}
                isChecked={courses}
                onChange={e => {
                  setValue('savedCoursesNotifications', e.target.checked);
                  setCourses(e.target.checked);
                }}
              />
              <FormLabel htmlFor="courses">
                <Stack spacing={0} fontSize={{ base: 14, lg: 16 }}>
                  <Text fontWeight={700} color={'grey.600'}>
                    Известия за запазени курсове
                  </Text>
                  <Text color={'grey.400'}>
                    Искам да получавам имейли, свързани с промени в курсове или уроци, които съм записал/а
                  </Text>
                </Stack>
              </FormLabel>
            </FormControl>
          </Stack>

          <Button
            type={'submit'}
            size={{ base: 'md' }}
            w={'fit-content'}
            px={{ base: 10, lg: 16 }}
            py={0}
            bg={'purple.500'}
            color={'white'}
            fontSize={{ base: 14, md: 16 }}
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
            Въведете своя имейл, за да полчите линк за промяна на паролата.
          </Text>

          <Input
            pr="4.5rem"
            maxLength={100}
            resize={'none'}
            placeholder={'myemail@mail.com'}
            bg={'grey.100'}
            {...registerEmail('email', { required: 'Полето е задължително' })}
          />

          <Button
            {...registerEmail('email', { required: 'Полето е задължително' })}
            size={{ base: 'md' }}
            w={'fit-content'}
            px={{ base: 10, lg: 16 }}
            py={0}
            bg={'purple.500'}
            color={'white'}
            fontSize={{ base: 14, md: 16 }}
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
