import React from 'react';

import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Img,
  useToast,
} from '@chakra-ui/react';
import { logo } from '../../images';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';

export default function ForgottenPasswordForm({
  isOpen,
  onClose,
  onLoginOpen,
}: {
  isOpen: boolean;
  onClose: any;
  onLoginOpen: any;
}) {
  const toast = useToast();

  const { register: registerEmail, handleSubmit: handleSubmitEmail } = useForm({
    defaultValues: {
      email: '',
    },
  });

  const onSubmitEmail: SubmitHandler<any> = async data => {
    try {
      await axios.get(`/auth/resetPassword/${data.email}`);

      onClose();
      setTimeout(() => onLoginOpen(), 200);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', sm: 'sm', md: 'lg' }} isCentered>
      <ModalOverlay />
      <ModalContent p={{ base: 0, lg: 8 }}>
        <ModalBody w={'full'} p={2} overflow={'hidden'}>
          <ModalHeader>
            <Flex justify={'center'}>
              <Img h={{ base: '30px', xl: '38px' }} src={logo} alt={'Logo'} fill={'white'} />
            </Flex>
          </ModalHeader>

          <ModalCloseButton color={'purple.500'} />

          <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
            <Flex align={'center'} justify={'center'}>
              <Stack
                spacing={{ base: 8, md: 8 }}
                w={'full'}
                maxW={'md'}
                px={{ base: 6, lg: 12 }}
                my={12}
                align={'center'}
                textAlign={'center'}>
                <Heading lineHeight={1.1} fontSize={{ base: 'xl', md: '3xl' }} color={'grey.500'}>
                  Възстановяване на парола
                </Heading>
                <Text fontSize={{ base: 'sm', md: 'md' }} color="grey.400">
                  Моля въведете имейла, с който сте направили своя профил
                </Text>
                <FormControl id="email">
                  <Input
                    size={{ base: 'sm', md: 'md' }}
                    placeholder="Имейл"
                    bg={'grey.100'}
                    _placeholder={{ color: 'gray.500' }}
                    type="email"
                    {...registerEmail('email', { required: 'Полето е задължително' })}
                  />
                </FormControl>
                <Stack spacing={4} w={'full'}>
                  <Button
                    type={'submit'}
                    w={'full'}
                    size={{ base: 'sm', lg: 'md' }}
                    bg={'purple.500'}
                    color={'white'}
                    _hover={{
                      opacity: '0.9',
                    }}>
                    Изпрати
                  </Button>
                  <Button
                    size={{ base: 'md', lg: 'lg' }}
                    fontWeight={700}
                    color={'purple.500'}
                    bg={'transparent'}
                    _hover={{ bg: 'transparent' }}
                    onClick={() => {
                      onClose();
                      setTimeout(() => onLoginOpen(), 200);
                    }}>
                    Назад
                  </Button>
                </Stack>
              </Stack>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
