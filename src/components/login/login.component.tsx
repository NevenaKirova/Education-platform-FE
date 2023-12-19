import React, { useState, useEffect, useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { NavLink as ReactRouterLink, useLocation } from 'react-router-dom';

import axios from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';
import { PageLoader } from '../../utils/loader.component';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  Input,
  Stack,
  Img,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Box,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  IconButton,
  Link,
  useToast,
} from '@chakra-ui/react';

import { logo, studentAvatar, teacherAvatar } from '../../images';
import { eye } from '../../icons';

import AuthContext from '../../context/AuthContext';

const REGISTER_URL = '/auth/register';

type InputsLogin = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type InputsRegister = {
  email: string;
  username: string;
  password: string;
  role: string;
  agreeToConditions: boolean;
};

const LoginModal = ({
  isOpen,
  onClose,
  onForgottenPasswordOpen,
  tabIndex,
  setTabIndex,
  loginAs,
  setLoginAs,
}: {
  isOpen: boolean;
  onClose: any;
  onForgottenPasswordOpen?: any;
  tabIndex: number;
  setTabIndex: any;
  loginAs?: string;
  setLoginAs: any;
}) => {
  const location = useLocation();
  const { loginUser } = useContext(AuthContext);

  const [showLoginPass, setShowLoginPass] = useState(false);
  const [showRegPass, setShowRegPass] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputsLogin>();

  const {
    register: registerReg,
    handleSubmit: handleSubmitReg,
    reset: resetReg,
    formState: { errors: errorsReg },
    setValue,
  } = useForm<InputsRegister>();

  const onSubmit: SubmitHandler<InputsLogin> = async data => {
    await loginUser(data);
    reset();
  };
  const onSubmitReg: SubmitHandler<InputsRegister> = async data => {
    setIsFormLoading(true);
    try {
      const response = await axios.post(REGISTER_URL, data);
      setIsFormLoading(false);

      toast({
        title: 'Успешна регистрация',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      setTabIndex(0);
      resetReg();

      return response;
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      setIsFormLoading(false);
    }
  };

  const ToggleLoginPassword = () => {
    setShowLoginPass(!showLoginPass);
  };

  const ToggleRegPassword = () => {
    setShowRegPass(!showRegPass);
  };

  useEffect(() => {
    setValue('role', `${loginAs?.toUpperCase()}`);
  }, [loginAs]);

  useEffect(() => {
    onClose();
  }, [location]);
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset();
        }}
        size={{ base: 'sm', md: 'xl', lg: '5xl' }}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody w={'full'} p={0} overflow={'hidden'}>
            <ModalCloseButton color={'purple.500'} />
            <Stack
              w={'full'}
              h={'full'}
              direction={{ base: 'column', lg: 'row' }}
              minH={{ base: '90vh', lg: '68vh' }}
              spacing={0}>
              <Flex flex={{ base: 0, md: 1 }}>
                <Stack
                  align={'center'}
                  justify={'start'}
                  w={'full'}
                  spacing={{ base: 14, lg: 20 }}
                  py={{ base: 10, lg: 20 }}
                  bg={'purple.100'}
                  rounded={{ base: '2%', lg: '2% 0;' }}>
                  <Img h={{ base: '30px', xl: '38px' }} src={logo} alt={'Logo'} fill={'white'} />
                  <Stack spacing={{ base: 4, lg: 8 }} align={'center'}>
                    <Text color={'purple.500'} fontSize={{ base: 24, lg: 28 }} fontWeight={700}>
                      {' '}
                      {tabIndex === 0 ? 'Здравейте отново!' : 'Добре дошли!'}{' '}
                    </Text>
                    <Text color={'grey.500'} fontWeight={700}>
                      {' '}
                      {tabIndex === 0 ? 'Влезте като:' : 'Регистрирайте се като:'}{' '}
                    </Text>
                    <Stack spacing={16} direction={'row'} pt={{ base: 2, lg: 0 }}>
                      <Stack direction={'column'} align={'center'} spacing={2}>
                        <Box
                          as={'button'}
                          role="group"
                          onClick={() => {
                            setLoginAs('teacher');
                          }}
                          borderRadius="full"
                          _hover={{
                            transition: 'transform .2s',
                            transform: 'scale(1.05)',
                          }}>
                          <Image
                            borderRadius="full"
                            border={loginAs === 'teacher' ? '5px solid' : ''}
                            borderColor={loginAs === 'teacher' ? 'purple.500' : ''}
                            boxSize={20}
                            src={teacherAvatar}
                            alt="Teacher Avatar"
                          />
                        </Box>
                        <Text fontSize={18} fontWeight={700} color={'grey.500'}>
                          Учител
                        </Text>
                      </Stack>

                      <Stack direction={'column'} align={'center'}>
                        <Box
                          as={'button'}
                          onClick={() => {
                            setLoginAs('student');
                          }}
                          _hover={{
                            transition: 'transform .2s',
                            transform: 'scale(1.05)',
                          }}>
                          <Image
                            boxSize={20}
                            borderRadius="full"
                            border={loginAs === 'student' ? '5px solid' : ''}
                            borderColor={loginAs === 'student' ? 'purple.500' : ''}
                            src={studentAvatar}
                            alt="Student Avatar"
                          />
                        </Box>
                        <Text fontSize={18} fontWeight={700} color={'grey.500'}>
                          Ученик
                        </Text>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              </Flex>
              <Flex flex={1} align={{ base: 'start', lg: 'start' }} justify={'center'} py={{ base: 4, md: 8, lg: 16 }}>
                <Tabs
                  index={tabIndex}
                  onChange={index => setTabIndex(index)}
                  w={'full'}
                  align={'center'}
                  isFitted
                  position="relative"
                  variant="unstyled">
                  <TabList w={'fit-content'} gap={6}>
                    <Tab
                      fontSize={{ base: 22, md: 24, lg: 28 }}
                      fontWeight={700}
                      color={'purple.500'}
                      _selected={{ borderBottom: '3px solid ', borderColor: 'purple.500' }}
                      onClick={() => {
                        setTabIndex(tabIndex);
                      }}>
                      <Text>Вход</Text>
                    </Tab>
                    <Tab
                      fontSize={{ base: 22, md: 24, lg: 28 }}
                      fontWeight={700}
                      color={'purple.500'}
                      _selected={{ borderBottom: '3px solid ', borderColor: 'purple.500' }}
                      w={'fit-content'}
                      onClick={() => {
                        setTabIndex(tabIndex);
                      }}>
                      Регистрация
                    </Tab>
                  </TabList>

                  <TabPanels pt={4}>
                    <TabPanel p={{ base: 2, lg: 4 }}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={{ base: 6, md: 8, lg: 8 }} w={'70%'} maxW={'md'}>
                          <Text
                            fontSize={{ base: 'sm', lg: 'md' }}
                            fontWeight={500}
                            textAlign={'center'}
                            color={'grey.400'}>
                            Влез в своя профил в платформата
                          </Text>

                          <FormControl isInvalid={errors.email ? true : false}>
                            <Stack direction={'column'}>
                              <Input
                                type="text"
                                size={{ base: 'sm', md: 'md' }}
                                placeholder={'Имейл / Потребителско име'}
                                bg={'grey.100'}
                                {...register('email', {
                                  required: 'Полето е задължително!',
                                })}
                                aria-invalid={errors.email ? 'true' : 'false'}
                              />
                              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
                            </Stack>
                          </FormControl>
                          <FormControl isInvalid={!!errors.password}>
                            <InputGroup size={{ base: 'sm', md: 'md' }}>
                              <Input
                                pr="4.5rem"
                                type={showLoginPass ? 'text' : 'password'}
                                placeholder={'Парола'}
                                bg={'grey.100'}
                                {...register('password', {
                                  required: 'Полето е задължително!',
                                })}
                              />

                              <InputRightElement width="4.5rem">
                                <IconButton
                                  aria-label={'toggle password visibility'}
                                  size="xs"
                                  bg={'none'}
                                  _hover={{ bg: 'none' }}
                                  onClick={ToggleLoginPassword}
                                  icon={<Img src={eye} w={'full'} />}
                                />
                              </InputRightElement>
                            </InputGroup>

                            <FormErrorMessage></FormErrorMessage>
                          </FormControl>
                          <Stack spacing={{ base: 8, md: 8 }}>
                            <Stack direction={{ base: 'column', md: 'row' }} align={'center'} justify={'space-between'}>
                              <Checkbox size={{ base: 'md', lg: 'lg' }} color={'grey.400'} {...register('rememberMe')}>
                                <Text pl={2} fontSize={16}>
                                  Запомни ме
                                </Text>
                              </Checkbox>
                              <Button
                                size="md"
                                color={'purple.500'}
                                bg={'transparent'}
                                _hover={{ bg: 'transparent' }}
                                onClick={() => {
                                  onClose();
                                  setTimeout(() => onForgottenPasswordOpen(), 200);
                                }}>
                                Забравена парола?
                              </Button>
                            </Stack>
                            <Button
                              type="submit"
                              size={{ base: 'md', lg: 'md' }}
                              color={'white'}
                              bg={'purple.500'}
                              fontSize={{ base: 16, '2xl': 20 }}
                              fontWeight={700}
                              _hover={{ opacity: '0.9' }}>
                              Вход
                            </Button>
                          </Stack>
                        </Stack>
                      </form>
                    </TabPanel>
                    <TabPanel p={{ base: 2, lg: 4 }}>
                      <form onSubmit={handleSubmitReg(onSubmitReg)}>
                        <Stack spacing={{ base: 6, lg: 8 }} w={'70%'} maxW={'md'}>
                          <Text
                            fontSize={{ base: 'sm', lg: 'md' }}
                            fontWeight={500}
                            textAlign={'center'}
                            color={'grey.400'}>
                            Създай своя ученически профил, за да достъпиш стотици курсове
                          </Text>

                          <FormControl isInvalid={!!errorsReg.username}>
                            <Input
                              type="text"
                              size={{ base: 'sm', md: 'md' }}
                              placeholder={'Потребителско име'}
                              bg={'grey.100'}
                              {...registerReg('username', {
                                required: 'Полето е задължително!',
                              })}
                            />
                            <FormErrorMessage>{errorsReg?.username?.message}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errorsReg.email}>
                            <Input
                              type="email"
                              size={{ base: 'sm', md: 'md' }}
                              placeholder={'Имейл'}
                              bg={'grey.100'}
                              {...registerReg('email', {
                                required: 'Полето е задължително!',
                              })}
                            />
                            <FormErrorMessage>{errorsReg?.email?.message}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={!!errorsReg.password}>
                            <Stack direction={'column'}>
                              <InputGroup size={{ base: 'sm', md: 'md' }}>
                                <Input
                                  pr="4.5rem"
                                  type={showRegPass ? 'text' : 'password'}
                                  placeholder={'Парола'}
                                  bg={'grey.100'}
                                  {...registerReg('password', {
                                    required: 'Полето е задължително!',
                                    minLength: {
                                      value: 8,
                                      message: 'Паролата трябва да се състои от поне 8 знака',
                                    },
                                  })}
                                />
                                <InputRightElement width="4.5rem">
                                  <IconButton
                                    aria-label={'toggle password visibility'}
                                    size="xs"
                                    bg={'none'}
                                    _hover={{ bg: 'none' }}
                                    onClick={ToggleRegPassword}
                                    icon={<Img src={eye} w={'full'} />}
                                  />
                                </InputRightElement>
                              </InputGroup>
                              <FormErrorMessage>{errorsReg?.password?.message}</FormErrorMessage>
                            </Stack>
                          </FormControl>

                          <FormControl isInvalid={!!errorsReg.agreeToConditions}>
                            <Stack spacing={{ base: 6, md: 8 }}>
                              <Checkbox
                                size={{ base: 'md', lg: 'lg' }}
                                color={'grey.400'}
                                {...registerReg('agreeToConditions', {
                                  required: 'Полето е задължително!',
                                })}>
                                <Text fontSize={{ base: 12, lg: 14 }} textAlign={'left'} pl={2}>
                                  Съгласявам се с {''}
                                  <Link as={ReactRouterLink} to={'/terms-of-use'} color={'purple.500'}>
                                    Условията за ползване{' '}
                                  </Link>{' '}
                                  и{' '}
                                  <Link as={ReactRouterLink} to={'/personal-data-policy'} color={'purple.500'}>
                                    Условията за поверителност на личните данни
                                  </Link>{' '}
                                  *
                                </Text>
                              </Checkbox>

                              <Button
                                type={'submit'}
                                size={{ base: 'md', lg: 'md' }}
                                color={'white'}
                                bg={'purple.500'}
                                fontSize={{ base: 16, '2xl': 20 }}
                                fontWeight={700}
                                _hover={{ opacity: '0.9' }}>
                                Регистрация
                              </Button>
                            </Stack>
                          </FormControl>
                        </Stack>
                      </form>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <PageLoader isLoading={isFormLoading} />
    </>
  );
};

export default LoginModal;
