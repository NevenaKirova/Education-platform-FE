import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom';

import {
  Stack,
  Button,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  RadioGroup,
  Radio,
  FormControl,
  Input,
  FormErrorMessage,
  Checkbox,
  Link,
  Center,
  Box,
  Image,
  Avatar,
  Flex,
  useToast,
} from '@chakra-ui/react';

import { getResponseMessage } from '../../helpers/response.util';
import { PageLoader } from '../../utils/loader.component';
import axios from '../../axios';

import { payment } from '../../images';

const ENROLL_URL = '/auth/register';

type Inputs = {
  email: string;
  name: string;
  surname: string;
  agreeToConditions: boolean;
};

const EnrollLessonPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [payTypeValue, setPayTypeValue] = useState<string>('');

  const toast = useToast();

  const location = useLocation();
  const { payType } = location.state;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setIsLoading(true);
    try {
      const response = await axios.post(ENROLL_URL, data);

      console.log(response.data);

      setIsLoading(false);
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPayTypeValue(payType);
  }, []);
  return (
    <>
      <Stack py={{ base: 0, lg: 10 }} px={{ base: 10, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}>
        <Stack
          direction={{ base: 'column', xl: 'row' }}
          spacing={30}
          mt={{ base: 36, lg: 40 }}
          mb={8}
          align={'start'}
          justify={'space-between'}
          flex={1}
          w={'full'}>
          <Stack spacing={8} w={{ base: 'full', xl: '50%', '2xl': '35%' }}>
            <Stack spacing={{ base: 8, lg: 12 }}>
              <Stack spacing={{ base: 6, lg: 8 }}>
                <Breadcrumb fontSize={{ base: 14, lg: 18 }}>
                  <BreadcrumbItem>
                    <BreadcrumbLink as={ReactRouterLink} to={'/lessons'}>
                      Частни уроци
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem color={'purple.500'}>
                    <BreadcrumbLink as={ReactRouterLink} to={`/lessons/:lessonId}`} textDecoration={'none'}>
                      Физика за 9ти клас
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbItem color={'purple.500'} isCurrentPage>
                    <BreadcrumbLink>Записване</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>

                <Stack
                  direction={{ base: 'column' }}
                  w={'full'}
                  justify={'start'}
                  align={{ base: 'start' }}
                  spacing={{ base: 4, lg: 2 }}>
                  <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 40 }} color={'grey.600'}>
                    Записване за курс
                  </Heading>

                  <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 40 }} color={'purple.500'}>
                    Физика за 9ти клас
                  </Heading>
                </Stack>
              </Stack>
              <Stack spacing={{ base: 6, lg: 8 }} w={'full'}>
                <Heading flex={1} textAlign={'left'} fontSize={{ base: 18, lg: 22 }} color={'grey.600'}>
                  Плащане
                </Heading>
                <RadioGroup onChange={setPayTypeValue} value={payTypeValue}>
                  <Stack spacing={5} direction="column" align={'start'}>
                    <Radio size="lg" colorScheme="purple" value="fullPay">
                      <Text textAlign={'left'} ml={{ base: 2, lg: 4 }} fontSize={{ base: 14, lg: 16 }}>
                        Еднократно плащане (предплащане на целия курс)
                      </Text>
                    </Radio>
                    <Radio size="lg" colorScheme="purple" value="subscription">
                      <Text textAlign={'left'} ml={{ base: 2, lg: 4 }} fontSize={{ base: 14, lg: 16 }}>
                        Абонамент (плащане за всеки час поотделно преди неговото провеждане)
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={{ base: 6, lg: 8 }} w={'100%'}>
                  <Heading flex={1} textAlign={'left'} fontSize={{ base: 18, lg: 22 }} color={'grey.600'}>
                    Лични данни
                  </Heading>

                  <Stack direction={'row'} spacing={4}>
                    <FormControl isInvalid={!!errors.name}>
                      <Input
                        type="text"
                        size={{ base: 'sm', md: 'md' }}
                        placeholder={'Име'}
                        bg={'grey.100'}
                        {...register('name', {
                          required: 'Полето е задължително!',
                        })}
                      />
                      <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.surname}>
                      <Input
                        type="text"
                        size={{ base: 'sm', md: 'md' }}
                        placeholder={'Фамилия'}
                        bg={'grey.100'}
                        {...register('surname', {
                          required: 'Полето е задължително!',
                        })}
                      />
                      <FormErrorMessage>{errors?.surname?.message}</FormErrorMessage>
                    </FormControl>
                  </Stack>

                  <FormControl isInvalid={!!errors.email}>
                    <Input
                      type="email"
                      size={{ base: 'sm', md: 'md' }}
                      placeholder={'Имейл'}
                      bg={'grey.100'}
                      {...register('email', {
                        required: 'Полето е задължително!',
                      })}
                    />
                    <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.agreeToConditions}>
                    <Stack spacing={{ base: 6, md: 8 }}>
                      <Checkbox
                        size={{ base: 'md', lg: 'lg' }}
                        color={'grey.400'}
                        {...register('agreeToConditions', {
                          required: 'Полето е задължително!',
                        })}>
                        <Text fontSize={{ base: 12, lg: 16 }} textAlign={'left'} pl={2}>
                          Запознат съм и се съгласявам с {''}
                          <Link as={ReactRouterLink} to={'/terms-of-use'} color={'purple.500'} isExternal>
                            Условията за ползване{' '}
                          </Link>{' '}
                          и{' '}
                          <Link as={ReactRouterLink} to={'/personal-data-policy'} color={'purple.500'} isExternal>
                            Условията за поверителност на личните данни
                          </Link>{' '}
                          *
                        </Text>
                      </Checkbox>
                    </Stack>
                  </FormControl>
                </Stack>
              </form>
            </Stack>
          </Stack>

          <Stack align={'center'} w={{ base: 'full', xl: 'fit-content' }}>
            <Center py={6} w={'full'}>
              <Box
                as={Flex}
                justify={'center'}
                align={'center'}
                direction={{ base: 'column', lg: 'row', xl: 'column' }}
                w={'full'}
                bg={'purple.100'}
                h={'fit-content'}
                rounded={'md'}
                p={{ base: 2, md: 6 }}
                boxShadow="custom"
                overflow={'hidden'}>
                <Box
                  boxSize="sm"
                  w={{ base: 'full', xl: 'sm' }}
                  bg={'purple.100'}
                  h={'fit-content'}
                  rounded="lg"
                  pb={{ base: 0, md: 6, lg: 0, xl: 6 }}
                  pr={{ base: 8, xl: 0 }}>
                  <Image src={payment} alt="Payment image" borderRadius={20} p={4} />
                </Box>
                <Stack
                  direction={'column'}
                  w={'full'}
                  align={'center'}
                  spacing={6}
                  rounded={'lg'}
                  bg={'white'}
                  p={{ base: 4, lg: 8 }}>
                  <Stack
                    direction={{ base: 'column', md: 'row' }}
                    align={{ base: 'start', md: 'center' }}
                    justify="space-between"
                    spacing={{ base: 4, lg: 14 }}
                    w={'full'}>
                    <Heading color={'gray.700'} fontSize={'xl'} fontFamily={'body'}>
                      Физика за 9-ти клас
                    </Heading>
                    <Stack direction={'row'} spacing={2} align={'center'} justify={'center'}>
                      <Avatar size="xs" src={'https://avatars0.githubusercontent.com/u/1164541?v=4'} />
                      <Text color={'grey.500'}>Achim Rolle</Text>
                    </Stack>
                  </Stack>

                  <Stack direction={'column'} align={'center'} justify="space-between" spacing={4} w={'full'}>
                    <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
                      <Text fontWeight={500} fontSize={{ base: 14, lg: 16 }}>
                        Начало:
                      </Text>
                      <Text color={'grey.500'} fontSize={{ base: 14, lg: 16 }}>
                        6 sedmici
                      </Text>
                    </Stack>

                    <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
                      <Text fontWeight={500} fontSize={{ base: 14, lg: 16 }}>
                        Продължителност:
                      </Text>
                      <Text color={'grey.500'} fontSize={{ base: 14, lg: 16 }}>
                        6 sedmici
                      </Text>
                    </Stack>
                    <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
                      <Text fontWeight={500} fontSize={{ base: 14, lg: 16 }}>
                        Дни на провеждане:
                      </Text>
                      <Text color={'grey.500'} fontSize={{ base: 14, lg: 16 }}>
                        6 sedmici
                      </Text>
                    </Stack>
                    <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
                      <Text fontWeight={500} fontSize={{ base: 14, lg: 16 }}>
                        Час на провеждане:
                      </Text>
                      <Text color={'grey.500'} fontSize={{ base: 14, lg: 16 }}>
                        6 sedmici
                      </Text>
                    </Stack>

                    <Stack direction={'row'} align={'center'} justify="space-between" w={'full'} flexWrap={'wrap'}>
                      <Text
                        fontWeight={700}
                        fontSize={{ base: 14, md: 16, lg: 18 }}
                        textAlign={'start'}
                        color={'purple.500'}>
                        Сума за плащане:
                      </Text>
                      <Text fontWeight={700} fontSize={{ base: 14, lg: 18 }} textAlign={'right'}>
                        240 lv {''}
                        <Text as={'span'} fontWeight={400} color={'grey.500'} fontSize={{ base: 14, lg: 16 }}>
                          (21lv/ chas)
                        </Text>
                      </Text>
                    </Stack>
                  </Stack>

                  <Button
                    w={'full'}
                    size={{ base: 'md', lg: 'md' }}
                    color={'white'}
                    bg={'purple.500'}
                    fontSize={{ base: 16, lg: 18, xl: 20 }}
                    fontWeight={700}
                    _hover={{ opacity: '0.9' }}>
                    Към плащане
                  </Button>
                </Stack>
              </Box>
            </Center>
          </Stack>
        </Stack>
      </Stack>
      <PageLoader isLoading={isLoading} />
    </>
  );
};

export default EnrollLessonPage;
