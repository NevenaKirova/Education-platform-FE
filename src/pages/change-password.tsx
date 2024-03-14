import React, { useState } from 'react';
import {
  Image,
  Heading,
  Text,
  Stack,
  FormControl,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Img,
  Button,
  useToast,
} from '@chakra-ui/react';

import { changePass } from '../images';
import { eye } from '../icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../axios';
import { getResponseMessage } from '../helpers/response.util';

export default function ChangePasswordPage() {
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const { token } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const TogglePassword = () => {
    setShowPass(!showPass);
  };

  const ToggleRePassword = () => {
    setShowRePass(!showRePass);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      passTemp: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler = async data => {
    try {
      await axios.get(`/auth/resetPassword/validateToken/${token}`);

      await axios.post(`/auth/resetPassword/reset`, {
        token: token,
        password: data.password,
      });

      navigate('/');
      toast({
        title: 'Успешна промяна на парола',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      console.log(error)
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
    reset();
  };

  return (
    <Stack
      spacing={{ base: 16, md: 24 }}
      px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
      py={{ base: 0, lg: 10 }}
      pb={{ base: 20, lg: 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'center'}
      justify={'space-between'}
      w={'full'}
      h={'full'}
      direction={{ base: 'column', md: 'row' }}>
      <Stack flex={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={{ base: 6, md: 8, lg: 10 }}
            maxW={'md'}
            align={{ base: 'center', md: 'start' }}
            h={'full'}
            w={'full'}>
            <Heading color={'grey.500'} fontSize={{ base: 20, md: 24, lg: 32 }}>
              {' '}
              Промяна на паролата
            </Heading>
            <Text fontSize={{ base: 'sm', lg: 'md' }} fontWeight={500} textAlign={'start'} color={'grey.400'}>
              Моля въведете новата си парола в полетата по-долу.
            </Text>

            <Stack spacing={8} w={'full'}>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup size={{ base: 'sm', md: 'md' }}>
                  <Input
                    pr="4.5rem"
                    type={showPass ? 'text' : 'password'}
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
                      onClick={TogglePassword}
                      icon={<Img src={eye} w={'full'} />}
                    />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.passTemp}>
                <InputGroup size={{ base: 'sm', md: 'md' }}>
                  <Input
                    pr="4.5rem"
                    type={showRePass ? 'text' : 'password'}
                    placeholder={'Повтори паролата'}
                    bg={'grey.100'}
                    {...register('passTemp', {
                      required: 'Полето е задължително!',
                      validate: (val: string) => {
                        if (watch('password') != val) {
                          return 'Паролите не съвпадат';
                        }
                      },
                    })}
                  />

                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label={'toggle password visibility'}
                      size="xs"
                      bg={'none'}
                      _hover={{ bg: 'none' }}
                      onClick={ToggleRePassword}
                      icon={<Img src={eye} w={'full'} />}
                    />
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>{errors?.passTemp?.message}</FormErrorMessage>
              </FormControl>
            </Stack>

            <Button
              type="submit"
              size={{ base: 'md', lg: 'md' }}
              color={'white'}
              bg={'purple.500'}
              fontSize={{ base: 16, '2xl': 20 }}
              fontWeight={700}
              _hover={{ opacity: '0.9' }}
              w={'full'}>
              Запази
            </Button>
          </Stack>
        </form>
      </Stack>
      <Stack flex={1}>
        <Image src={changePass} w={'full'} />
      </Stack>
    </Stack>
  );
}
