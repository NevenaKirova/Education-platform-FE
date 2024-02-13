import React from 'react';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Text,
  Stack,
} from '@chakra-ui/react';

export default function AfterRegModal({ isOpen, onClose }: { isOpen: boolean; onClose: any }) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton  color={'purple.500'}  />
          <ModalBody px={12} py={10}>
            <Stack spacing={2}>
              <Text color={'grey.600'}>Изпратено е потвърждение за регистрацията на посочения от Вас имейл.</Text>

              <Text color={'grey.600'}>Моля потвърдете профила си, за да може да използвате платформата!</Text>
            </Stack>
          </ModalBody>


        </ModalContent>
      </Modal>
    </>
  );
}
