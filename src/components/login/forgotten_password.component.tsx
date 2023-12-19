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
} from '@chakra-ui/react';
import { logo } from '../../images';

export default function ForgottenPasswordForm({
  isOpen,
  onClose,
  onLoginOpen,
}: {
  isOpen: boolean;
  onClose: any;
  onLoginOpen: any;
}) {
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
                />
              </FormControl>
              <Stack spacing={4} w={'full'}>
                <Button
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
