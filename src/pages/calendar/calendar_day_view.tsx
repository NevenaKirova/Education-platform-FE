import React from 'react';
import {
  Heading,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { addPerson, calendar, clock, group } from '../../icons';
import { capitalizeMonth } from '../../helpers/capitalizeMonth.util';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

const CalendarDayViewModal = ({ isOpen, onClose, date }: { isOpen: boolean; onClose: any; date: any }) => {
  return (
    <Modal size={'4xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={8} bg={'grey.100'} maxH={'60vh'} overflow={'hidden'} rounded={'lg'}>
        <ModalHeader>
          <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'} pb={6}>
            <Stack direction={'row'} spacing={4} align={'center'}>
              <Img src={calendar} alt={'calendar icon'} w={6} h={6} />
              <Text color={'grey.500'}>
                {/*{capitalizeMonth(format(new Date(date?.startDate), 'dd LLL yyyy', { locale: bg }))} -{' '}*/}
                {/*{date?.endDate && capitalizeMonth(format(new Date(date?.endDate), 'dd LLL yyyy', { locale: bg }))}*/}
                Вторник, 09 Януари
              </Text>
            </Stack>
          </Heading>
        </ModalHeader>
        <ModalCloseButton color={'purple.500'} />
        <ModalBody
          pb={6}
          minH={'300px'}
          overflow={'auto'}
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#5431D6',
              borderRadius: '24px',
            },
          }}>
          <Stack spacing={8}>
            {[1, 2, 3, 4, 5, 6].map((el, index) => (
              <Stack key={'index'} rounded={'lg'} p={4} bg={'white'} spacing={4}>
                <Heading flex={1} fontSize={{ base: 18, lg: 20 }} textAlign="start" color={'purple.500'}>
                  Химия частни уроци
                </Heading>
                <Stack spacing={2}>
                  <Stack direction={'row'} spacing={2} align={'center'}>
                    <Img src={clock} alt={'calendar icon'} w={5} h={5} />
                    <Stack direction={'row'} spacing={1}>
                      <Text color={'grey.400'}>Вторник</Text>
                      <Text color={'grey.400'}>09 Януари</Text>
                      <Text color={'grey.400'}>11:00-12:00</Text>
                    </Stack>
                  </Stack>
                  <Stack direction={'row'} spacing={2} align={'center'}>
                    <Img src={group} alt={'calendar icon'} w={5} h={5} />
                    <Text color={'grey.400'}>Частен урок</Text>
                  </Stack>
                  <Stack direction={'row'} spacing={2} align={'center'}>
                    <Img src={addPerson} alt={'calendar icon'} w={5} h={5} />
                    <Text color={'grey.400'}> Записани ученици (8)</Text>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CalendarDayViewModal;
