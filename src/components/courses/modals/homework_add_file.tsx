import React, { useState } from 'react';
import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react';

import Dropzone from '../../../utils/dropzone';

const AddHomeworkFileModal = ({ isOpen, onClose, append }: { isOpen: boolean; onClose: any; append: any }) => {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    append({ file });

    onClose();
  };
  const onFileAccepted = file => {
    setFile(file);
  };

  return (
    <Modal size={'4xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={8}>
        <ModalHeader>
          <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
            Добавяне на ресурс
          </Heading>
        </ModalHeader>
        <ModalCloseButton color={'purple.500'} />
        <ModalBody pb={6} minH={'300px'}>
          <Stack spacing={6}>
            <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={700} textAlign="start" color={'purple.500'}>
              Файл
            </Heading>

            <Stack spacing={1}>
              <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
                Добавете файлов ресурс по Ваш избор. В случай, че желаете да качите няколко файла наведнъж, групирайте
                ги в архив. Допустими файлови формати:
              </Heading>
              <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'purple.500'}>
                .jpg .jpeg .ppt .pptx .doc .docx .pdf .zip .7-zip .rar
              </Heading>
            </Stack>

            <Dropzone onFileAccepted={onFileAccepted} />
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
            _hover={{ opacity: '0.9' }}
            onClick={handleUpload}>
            Качване
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddHomeworkFileModal;
