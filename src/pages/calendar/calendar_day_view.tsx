import React, { useEffect } from 'react';
import {
  Center,
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
import { addPerson, calendar, clock, group, hat } from '../../icons';
import { capitalizeMonth } from '../../helpers/capitalizeMonth.util';
import { format, getDay } from 'date-fns';
import { bg } from 'date-fns/locale';
import { daysArr } from '../../components/courses/courses_teacher/create_course.component';

const CalendarDayViewModal = ({
  isOpen,
  onClose,
  date,
  events,
  role,
}: {
  isOpen: boolean;
  onClose: any;
  date: any;
  events: any;
  role: string;
}) => {
  return (
    <Modal size={{ base: 'xl', lg: '4xl' }} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        p={{ base: 2, lg: 8 }}
        bg={'grey.100'}
        maxH={{ base: '80vh', lg: '60vh' }}
        overflow={'hidden'}
        rounded={'lg'}>
        <ModalHeader>
          <Heading
            flex={1}
            fontSize={{ base: 18, lg: 24 }}
            textAlign="start"
            color={'grey.600'}
            pb={{ base: 0, lg: 6 }}>
            <Stack direction={'row'} spacing={4} align={{ base: 'start', lg: 'center' }}>
              <Img src={calendar} alt={'calendar icon'} w={{ base: 5, lg: 6 }} h={{ base: 5, lg: 6 }} />
              <Text color={'grey.500'}>
                {daysArr[getDay(new Date(date)) - 1]?.name},{' '}
                {capitalizeMonth(format(new Date(date), 'dd LLL yyyy', { locale: bg }))}
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
            {events.length ? (
              events?.map((el, index) => (
                <Stack key={index} rounded={'lg'} p={4} bg={'white'} spacing={4}>
                  <Heading flex={1} fontSize={{ base: 16, md: 18, lg: 20 }} textAlign="start" color={'purple.500'}>
                    {el?.themaTitle}
                  </Heading>
                  <Stack spacing={2}>
                    <Stack direction={'row'} spacing={2} align={'center'}>
                      <Img src={clock} alt={'calendar icon'} w={{ base: 4, lg: 5 }} h={{ base: 4, lg: 5 }} />
                      <Stack direction={'row'} spacing={1}>
                        <Text color={'grey.400'} fontSize={{ base: 14, lg: 16 }}>
                          {el.dayOfTheWeek},
                        </Text>
                        <Text color={'grey.400'} fontSize={{ base: 14, lg: 16 }}>
                          {capitalizeMonth(format(new Date(el.startDate), 'dd LLL yyyy', { locale: bg }))}
                        </Text>
                        <Text color={'grey.400'} fontSize={{ base: 14, lg: 16 }}>
                          {el.startTime} {el?.endTime ? `- ${el.endTime}` : ''}
                        </Text>
                      </Stack>
                    </Stack>
                    <Stack direction={'row'} spacing={2} align={'center'}>
                      <Img src={group} alt={'calendar icon'} w={{ base: 4, lg: 5 }} h={{ base: 4, lg: 5 }} />
                      <Text color={'grey.400'} fontSize={{ base: 14, lg: 16 }}>
                        {el?.type}
                      </Text>
                    </Stack>

                    <Stack direction={'row'} spacing={2} align={'center'}>
                      <Img src={hat} alt={'calendar icon'} w={{ base: 4, lg: 5 }} h={{ base: 4, lg: 5 }} />
                      <Text color={'grey.400'} fontSize={{ base: 14, lg: 16 }}>
                        {el?.title}
                      </Text>
                    </Stack>

                    {role == 'TEACHER' && (
                      <Stack direction={'row'} spacing={2} align={'center'}>
                        <Img src={addPerson} alt={'calendar icon'} w={{ base: 4, lg: 5 }} h={{ base: 4, lg: 5 }} />
                        <Text color={'grey.400'} fontSize={{ base: 14, lg: 16 }}>
                          Записани ученици ({el?.enrolledStudents})
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              ))
            ) : (
              <Center h={'30vh'}>
                <Text color={'grey.400'}> Няма налични дати</Text>
              </Center>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CalendarDayViewModal;
