import React, { useEffect } from 'react';
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';

const EditCourseModal = ({
  isOpen,
  onClose,
  theme,
  getOpenedCourse,
}: {
  isOpen: boolean;
  onClose: any;
  theme: any;
  getOpenedCourse: any;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description: '',
    },
  });

  const toast = useToast();

  const onSubmit: SubmitHandler<any> = async data => {
    try {
      await axiosInstance.post(`lessons/editThemaDescription/${theme.themaID}`, data);
      getOpenedCourse();
      onClose();
      reset();
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
    reset();
    setValue('description', theme?.description);
  }, [theme?.themaID, theme?.description]);

  return (
    <Modal size={'4xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
              Редактиране на тема
            </Heading>
          </ModalHeader>
          <ModalCloseButton color={'purple.500'} />
          <ModalBody pb={6}>
            <Stack>
              <FormControl isDisabled>
                <FormLabel fontSize={18} fontWeight={700} color={'grey.600'}>
                  Заглавие
                </FormLabel>
                <Input type="text" bg={'grey.100'} value={theme?.title} />
              </FormControl>

              <FormControl>
                <FormLabel fontSize={18} fontWeight={700} color={'grey.600'}>
                  Описание на темата
                </FormLabel>
                <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                  <Textarea pr="4.5rem" maxLength={600} resize={'none'} rows={4} {...register('description')} />
                  <InputRightElement width="4.5rem" color={'grey.500'}>
                    {watch('description')?.length || 0}/600
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>
                  Тук можете да опишете кои са ключовите моменти от този урок и какво ще научат учениците в него.
                </FormHelperText>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              type={'submit'}
              size={{ base: 'sm', md: 'md', '2xl': 'md' }}
              w={{ base: 'full', lg: '12vw' }}
              fontSize={'xl'}
              fontWeight={700}
              bg={'purple.500'}
              color={'white'}
              _hover={{ opacity: '0.9' }}>
              Запази
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditCourseModal;
