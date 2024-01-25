import React, { useContext, useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

import {
  Stack,
  Heading,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  FormErrorMessage,
  Textarea,
  RadioGroup,
  Radio,
  FormLabel,
  Checkbox,
  Link,
  IconButton,
  Img,
  Box,
  useToast,
} from '@chakra-ui/react';

import { Dropdown } from 'primereact/dropdown';

import { axiosInstance } from '../../axios';

import { getResponseMessage } from '../../helpers/response.util';
import PreviewDropzone from '../../utils/preview_dropzone';
import { add, trash } from '../../icons';
import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';
import { addLocale } from 'primereact/api';
import PageLoader from '../../utils/loader.component';
import AuthContext from '../../context/AuthContext';

type Inputs = {
  name: string | null;
  surname: string | null;
  gender: string | null;
  city: string | null;
  description: string | null;
  subjects: string | null;
  degree: string | null;
  university: string | null;
  speciality: string | null;
  experience: any[];
  hasExperience: string;
  agreeToConditions: boolean;
};
export default function VerifyProfileComponent({ setShowForm }: { setShowForm: any }) {
  const toast = useToast();
  const { getUserData } = useContext(AuthContext);

  const [gender, setGender] = useState('');
  const [degree, setDegree] = useState('');
  const [withExperience, setWithExperience] = useState('no');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [showExperienceFields, setShowExperienceFields] = useState(false);
  const [dateStartValue, setDateStartValue] = useState([]);
  const [dateEndValue, setDateEndValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  addLocale('bg', {
    firstDayOfWeek: 1,
    dayNames: ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя'],
    dayNamesMin: ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'],
    monthNames: [
      'Януари',
      'Февруари',
      'Март',
      'Април',
      'Май',
      'Юни',
      'Юли',
      'Август',
      'Септември',
      'Октомвври',
      'Ноември',
      'Декември',
    ],
    monthNamesShort: ['Ян', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
    today: 'Днес',
    clear: 'Изчисти',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    trigger,
    watch,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: null,
      surname: null,
      gender: null,
      city: '',
      description: null,
      subjects: null,
      speciality: null,
      degree: null,
      university: null,
      hasExperience: 'no',
      experience: [{ place: '', startYear: '', endYear: '', description: '' }],
      agreeToConditions: false,
      file: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
  });

  const getData = async () => {
    try {
      const res = await axiosInstance.get(`/users/verifyTeacher/form`);
      const citiesObj = Object.assign(res.data?.cities?.map(key => ({ name: key, value: key })));
      setCities(citiesObj);
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

  const onFileAccepted = file => {
    setValue('file', file);
  };

  const onSubmit: SubmitHandler<any> = async data => {
    await trigger('city');

    const formData = new FormData();
    formData.append('file', data.file);

    setIsLoading(true);
    try {
      await axiosInstance.post(`/users/verifyTeacher`, data);
      await axiosInstance.post(`users/uploadImageTeacher`, formData);
      await getUserData();
      setIsLoading(false);
      setShowForm(false);
      reset();
      setCity('');
      setDegree('');
      setGender('');
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
    getData();
  }, []);

  useEffect(() => {
    register('city', { required: 'Полето е задължително' });
    register('file', { required: 'Полето е задължително' });
  }, [register]);

  useEffect(() => {
    withExperience == 'yes' ? setShowExperienceFields(true) : setShowExperienceFields(false);
    setValue('experience', [{ place: '', startYear: '', endYear: '', description: '' }]);
  }, [withExperience]);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <Stack w={{ base: 'full', xl: '60vw' }} spacing={10}>
        <Stack spacing={8} w={'full'}>
          <Breadcrumb fontSize={{ base: 14, md: 18 }} cursor={'default'}>
            <BreadcrumbItem _hover={{ textDecoration: 'none', cursor: 'default' }} cursor={'default'}>
              <BreadcrumbLink textDecoration={'none'} cursor={'default'}>
                Начало
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
              <BreadcrumbLink textDecoration={'none'}>Верификация на профила</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </Stack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack mb={10} spacing={{ base: 10, lg: 16 }} fontSize={{ base: 14, md: 18 }}>
            <Stack spacing={8}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'grey.600'}>
                Верификация на профила
              </Heading>

              <Text color={'grey.400'}>
                Lorem ipsum dolor sit amet, ut quidam nostrud eos. Id sed legendos definitiones, te eam philosophia
                disputationi, feugiat feugait ullamcorper duo an. Meis maiestatis vis cu. Nam facete tacimates perpetua
                in, graece causae ne mel. Dolore animal ponderum an per. Mei oporteat evertitur abhorreant an, unum
                nostro conclusionemque nam eu.
              </Text>
            </Stack>

            <Stack spacing={10} w={{ base: 'full', xl: '40vw' }}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'purple.500'}>
                Лична информация
              </Heading>

              <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 8, lg: 12 }}>
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Име{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>

                  <Input
                    size={{ base: 'sm', lg: 'md' }}
                    bg={'grey.100'}
                    rounded={'md'}
                    pr="4.5rem"
                    type="text"
                    placeholder="Вашето име"
                    maxLength={50}
                    {...register('name', { required: 'Полето е задължително' })}
                  />

                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.surname}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Фамилия{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>

                  <Input
                    size={{ base: 'sm', lg: 'md' }}
                    bg={'grey.100'}
                    rounded={'md'}
                    pr="4.5rem"
                    type="text"
                    placeholder="Вашето презиме"
                    maxLength={100}
                    {...register('surname', { required: 'Полето е задължително' })}
                  />

                  <FormErrorMessage>{errors?.surname?.message}</FormErrorMessage>
                </FormControl>
              </Stack>

              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.picture}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Профилна снимка{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>

                  <PreviewDropzone onFileAccepted={onFileAccepted} />

                  <FormErrorMessage>{errors?.picture?.message}</FormErrorMessage>
                </FormControl>

                <Stack fontSize={{ base: 14, lg: 16 }}>
                  <Text fontWeight={400} color={'grey.400'}>
                    Моля добавете ясна профилна снимка (5 MB)
                  </Text>
                  <Text fontWeight={400} color={'grey.400'}>
                    Допустими файлови формати .jpg .jpeg .png
                  </Text>
                </Stack>
              </Stack>

              <FormControl isInvalid={!!errors.gender}>
                <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                  Пол{' '}
                  <Text as={'span'} color={'red'}>
                    *
                  </Text>
                </FormLabel>

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

              <Stack>
                <FormControl isInvalid={!!errors.city}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Населено място{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>

                  <Dropdown
                    value={city}
                    onChange={e => {
                      setValue('city', e.value, { shouldValidate: true });
                      setCity(e.value);
                    }}
                    options={cities}
                    optionLabel="name"
                    placeholder="Изберете град"
                    className={errors.city ? 'invalid-dropdown w-full p-invalid' : ' w-full'}
                    showClear
                  />

                  <FormErrorMessage>{errors?.city?.message}</FormErrorMessage>
                </FormControl>
                <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                  Моля изберете населеното място, в което живеете в момента.
                </Text>
              </Stack>

              <Stack spacing={4}>
                <FormControl isInvalid={!!errors?.description}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Описание на профила{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>
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

                <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                  Моля добавете кратко описание на себе си, с което ще с представяте пред учениците.
                </Text>
              </Stack>

              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.subjects}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Предмети/ Сфери на интерес{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Input
                      pr="4.5rem"
                      maxLength={200}
                      resize={'none'}
                      placeholder={'Въведете тук'}
                      {...register('subjects', { required: 'Полето е задължително' })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('subjects')?.length || 0}/200
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.subjects?.message}</FormErrorMessage>
                </FormControl>

                <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                  Моля добавете кратко описание на себе си, с което ще с представяте пред учениците.
                </Text>
              </Stack>
            </Stack>

            <Stack spacing={10} w={{ base: 'full', xl: '40vw' }}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'purple.500'}>
                Квалификация{' '}
              </Heading>

              <FormControl isInvalid={!!errors.degree}>
                <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                  Най-висока образователна степен{' '}
                  <Text as={'span'} color={'red'}>
                    *
                  </Text>
                </FormLabel>

                <RadioGroup
                  w={'100vw'}
                  value={degree}
                  defaultValue="60"
                  onChange={e => {
                    setValue('degree', e);
                    setDegree(e);
                  }}>
                  <Stack spacing={10} direction={{ base: 'column', lg: 'row' }} align={'start'} flexWrap={'wrap'}>
                    <Radio size="lg" colorScheme="purple" value={'SECONDARY'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Основно образование
                      </Text>
                    </Radio>
                    <Radio size="lg" colorScheme="purple" value={'HIGH_SCHOOL'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Средно образование
                      </Text>
                    </Radio>
                    <Radio size="lg" colorScheme="purple" value={'BACHELOR'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Бакалавър
                      </Text>
                    </Radio>
                    <Radio size="lg" colorScheme="purple" value={'MASTER'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Магистър
                      </Text>
                    </Radio>
                    <Radio size="lg" colorScheme="purple" value={'PHD'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Доктор
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors?.degree?.message}</FormErrorMessage>
              </FormControl>

              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.university}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Учебно заведение{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Input
                      pr="4.5rem"
                      maxLength={100}
                      resize={'none'}
                      placeholder={'Въведете тук'}
                      {...register('university', { required: 'Полето е задължително' })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('university')?.length || 0}/100
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.university?.message}</FormErrorMessage>
                </FormControl>

                <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                  Моля уточнете в кое учебно заведение (училище / униврситет / колеж) сте завършили
                </Text>
              </Stack>

              <Stack spacing={4}>
                <FormControl isInvalid={!!errors.speciality}>
                  <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                    Специалност{' '}
                    <Text as={'span'} color={'red'}>
                      *
                    </Text>
                  </FormLabel>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Input
                      pr="4.5rem"
                      maxLength={100}
                      resize={'none'}
                      placeholder={'Въведете тук'}
                      {...register('speciality', { required: 'Полето е задължително' })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('speciality')?.length || 0}/100
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.speciality?.message}</FormErrorMessage>
                </FormControl>

                <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                  Моля уточнете специалността, която сте завършили
                </Text>
              </Stack>
            </Stack>

            <Stack spacing={10} w={{ base: 'full', xl: '40vw' }}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'purple.500'}>
                Опит{' '}
              </Heading>

              <FormControl isInvalid={!!errors.hasExperience}>
                <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                  Имам предходен опит като преподавател{' '}
                  <Text as={'span'} color={'red'}>
                    *
                  </Text>
                </FormLabel>

                <RadioGroup
                  value={withExperience}
                  defaultValue="no"
                  onChange={e => {
                    setValue('hasExperience', e);
                    setWithExperience(e);
                  }}>
                  <Stack spacing={10} direction="row" align={'start'}>
                    <Radio size="lg" colorScheme="purple" value={'yes'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Да
                      </Text>
                    </Radio>
                    <Radio size="lg" colorScheme="purple" value={'no'} bg={'grey.100'}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        Не
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <FormErrorMessage>{errors?.hasExperience?.message}</FormErrorMessage>
              </FormControl>

              {showExperienceFields && (
                <>
                  {fields.map((el, index: number) => (
                    <Stack key={index} direction={'column'} spacing={8}>
                      <Stack direction={'row'} w={'full'} align={'center'} justify={'space-between'} mb={-4}>
                        <Text flex={1} fontWeight={700} color={'purple.500'} pb={2} textAlign={'start'}>
                          Работно място{' '}
                        </Text>

                        <Box
                          as={IconButton}
                          aria-label={'delete theme'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          isDisabled={fields.length == 1}
                          icon={<Img src={trash} w={5} onClick={() => remove(index)} />}
                        />
                      </Stack>

                      <Stack spacing={4}>
                        <FormControl isInvalid={!!errors?.experience?.[index].place}>
                          <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                            Учебно заведение{' '}
                            <Text as={'span'} color={'red'}>
                              *
                            </Text>
                          </FormLabel>
                          <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                            <Input
                              pr="4.5rem"
                              maxLength={100}
                              resize={'none'}
                              placeholder={'Въведете тук'}
                              autoFocus
                              {...register(`experience[${index}].place`, { required: 'Полето е задължително' })}
                            />
                            <InputRightElement width="4.5rem" color={'grey.500'}>
                              {watch(`experience[${index}].place`)?.length || 0}/100
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{errors?.experience?.[index]?.place?.message}</FormErrorMessage>
                        </FormControl>

                        <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                          Моля уточнете в кое учебно заведение сте преподавали.
                        </Text>
                      </Stack>

                      <FormControl isInvalid={!!errors?.experience?.[index].place}>
                        <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                          Период на преподаване{' '}
                          <Text as={'span'} color={'red'}>
                            *
                          </Text>
                        </FormLabel>
                        <Stack direction={'row'} spacing={10} align={'center'}>
                          <Calendar
                            value={dateStartValue[index]}
                            placeholder={'Изберете дата'}
                            onChange={e => {
                              setValue(`experience[${index}].startDate`, format(e.value, 'yyyy-MM-dd'));
                              const newArr = [...dateStartValue];
                              newArr[index] = e.value;
                              setDateStartValue(newArr);
                            }}
                            className={
                              errors?.experience?.[index]?.startDate ? 'invalid-dropdown w-full' : 'p-invalid w-full'
                            }
                            maxDate={new Date()}
                            dateFormat="dd M yy"
                            locale={'bg'}
                            showIcon
                          />
                          <Text> - </Text>

                          <Calendar
                            value={dateEndValue[index]}
                            placeholder={'Изберете дата'}
                            onChange={e => {
                              setValue(`experience[${index}].endDate`, format(e.value, 'yyyy-MM-dd'));
                              const newArr = [...dateEndValue];
                              newArr[index] = e.value;
                              setDateEndValue(newArr);
                            }}
                            className={
                              errors?.experience?.[index]?.endDate ? 'invalid-dropdown w-full' : 'p-invalid w-full'
                            }
                            minDate={new Date(dateStartValue[index])}
                            maxDate={new Date()}
                            dateFormat="dd M yy"
                            locale={'bg'}
                            showIcon
                          />
                        </Stack>
                      </FormControl>

                      <Stack spacing={4}>
                        <FormControl isInvalid={!!errors?.experience?.[index]?.description}>
                          <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                            Описание на длъжността{' '}
                            <Text as={'span'} color={'red'}>
                              *
                            </Text>
                          </FormLabel>
                          <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                            <Textarea
                              pr="4.5rem"
                              maxLength={600}
                              resize={'none'}
                              rows={4}
                              {...register(`experience.${index}.description`, { required: 'Полето е задължително' })}
                            />
                            <InputRightElement width="4.5rem" color={'grey.500'}>
                              {watch(`experience.${index}.description`)?.length || 0}/600
                            </InputRightElement>
                          </InputGroup>
                          <FormErrorMessage>{errors?.experience?.[index]?.description?.message}</FormErrorMessage>
                        </FormControl>

                        <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                          Моля добавете кратко описание на работната си длъжност.
                        </Text>
                      </Stack>
                    </Stack>
                  ))}

                  <Button
                    size={{ base: 'md', lg: 'md' }}
                    color={'purple.500'}
                    fontSize={{ base: 16, '2xl': 20 }}
                    fontWeight={700}
                    bg={'transparent'}
                    _hover={{ bg: 'transparent' }}
                    w={'full'}
                    border={'1px dashed'}
                    mt={4}
                    borderColor={'purple.500'}
                    onClick={() => append({ school: '', dates: '', description: '' })}>
                    <Stack direction={'row'} align={'center'} spacing={2}>
                      <Img src={add} alt={'add course'} />
                      <Text> Добавяне на работно място</Text>
                    </Stack>
                  </Button>
                </>
              )}

              <FormControl isInvalid={!!errors.agreeToConditions}>
                <Checkbox
                  w={{ base: 'full', xl: '100vw' }}
                  size={{ base: 'md', lg: 'lg' }}
                  color={'grey.400'}
                  {...register('agreeToConditions', {
                    required: 'Полето е задължително!',
                  })}>
                  <Text fontSize={{ base: 14, lg: 16 }} textAlign={'left'} pl={2}>
                    Съгласявам се с {''}
                    <Link as={ReactRouterLink} to={'/terms-of-use'} color={'purple.500'}>
                      Условията за преподаване{' '}
                    </Link>{' '}
                    и{' '}
                    <Link as={ReactRouterLink} to={'/personal-data-policy'} color={'purple.500'}>
                      Условията за поверителност на личните данни
                    </Link>{' '}
                    *
                  </Text>
                </Checkbox>
              </FormControl>

              <Stack direction={{ base: 'row' }} justify={{ base: 'space-between' }} mt={10}>
                <Button
                  type={'submit'}
                  size={{ base: 'md' }}
                  w={'fit-content'}
                  px={{ base: 6, md: 16 }}
                  py={0}
                  bg={'purple.500'}
                  color={'white'}
                  fontSize={{ base: 14, lg: 16 }}
                  fontWeight={700}
                  _hover={{ opacity: '0.9' }}
                  _focus={{ outline: 'none' }}
                  _active={{ bg: 'purple.500' }}>
                  Изпращане
                </Button>

                <Button
                  size={{ base: 'md' }}
                  w={'fit-content'}
                  py={0}
                  bg={'transparent'}
                  color={'purple.500'}
                  fontSize={16}
                  fontWeight={700}
                  _hover={{ opacity: '0.9' }}
                  _focus={{ outline: 'none' }}
                  _active={{ bg: 'purple.500' }}
                  textAlign={'right'}
                  onClick={() => {
                    setShowForm(false);
                    reset();
                  }}>
                  Отказ
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </>
  );
}
