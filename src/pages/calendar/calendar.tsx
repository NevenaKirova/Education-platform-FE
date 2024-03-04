import React, { useContext, useEffect, useState } from 'react';

import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Show, Stack, Text, useDisclosure, useToast } from '@chakra-ui/react';

import bgLocale from '@fullcalendar/core/locales/bg';
import AuthContext from '../../context/AuthContext';
import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';
import { Navigate } from 'react-router-dom';
import CalendarDayViewModal from './calendar_day_view';
import PageLoader from '../../utils/loader.component';
import { format } from 'date-fns';

function Calendar() {
  const { user, userData } = useContext(AuthContext);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(null);
  const [dateEvents, setDateEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getEvents = async () => {
    if (userData?.role) {
      try {
        setIsLoading(true);
        const res = await axiosInstance.get(
          `/users/${userData?.role === 'STUDENT' ? 'getStudentCalendar' : 'getTeacherCalendar'}`,
        );

        setEvents(res.data);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  const openDayModal = async (info, isEvent) => {
    let date;
    if (isEvent) {
      const dateTemp = info?.event?.start;
      date = format(dateTemp, 'yyyy-MM-dd');
    } else {
      date = info?.dateStr;
    }

    setDate(date);

    if (userData?.role && date) {
      try {
        const res: any[] = await axiosInstance.get(
          `/lessons/${userData?.role === 'STUDENT' ? 'getStudentCalendarEvents' : 'getTeacherCalendarEvents'}/${date}`,
        );

        setDateEvents(res.data);
        onOpen();
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  useEffect(() => {
    getEvents();
  }, [userData?.role]);

  if (!user) return <Navigate to={'/'} replace />;
  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <>
      <Show above={'lg'}>
        <Stack
          spacing={20}
          py={{ base: 8, lg: 10 }}
          px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
          mt={{ base: 24, lg: 40 }}
          justify={'start'}
          flex={1}
          w={'full'}>
          <Fullcalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={'dayGridMonth'}
            events={events}
            displayEventTime={false}
            weekNumberCalculation={'ISO'}
            fixedWeekCount={false}
            locale={bgLocale}
            eventClick={info => openDayModal(info, true)}
            dateClick={info => openDayModal(info, false)}
            headerToolbar={{
              start: '',
              center: 'prev title next',
              end: 'today',
            }}
            height={'85vh'}
          />
        </Stack>
      </Show>

      <Show below={'lg'}>
        <Stack
          spacing={20}
          py={{ base: 8, lg: 10 }}
          px={{ base: 8 }}
          mx={2}
          mt={{ base: 28, md: 36 }}
          mb={6}
          justify={'start'}
          w={'full'}>
          <Fullcalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={'dayGridMonth'}
            displayEventTime={false}
            weekNumberCalculation={'ISO'}
            locale={bgLocale}
            events={events}
            eventClassNames={'eventClass'}
            dateClick={info => openDayModal(info, false)}
            fixedWeekCount={false}
            headerToolbar={{
              start: '',
              center: 'prev title next',
              end: '',
            }}
            height={'45vh'}
          />
        </Stack>
      </Show>

      {userData && userData?.role === 'TEACHER' && (
        <Stack
          direction={{ base: 'column', md: 'row' }}
          w={'full'}
          align={{ base: 'start', lg: 'center' }}
          justify={{ base: 'start', md: 'end' }}
          spacing={{ base: 6, lg: 8 }}
          px={{ base: 12, sm: 16, xl: 20, '2xl': 40 }}
          pb={12}>
          <Stack align={'center'} direction={'row'} spacing={2}>
            <Box w={{ base: 4, lg: 5 }} h={{ base: 4, lg: 5 }} bg={'purple.500'}></Box>{' '}
            <Text fontSize={{ base: 14, lg: 16 }}>Имате записани ученици</Text>
          </Stack>
          <Stack align={'center'} direction={'row'} spacing={2}>
            <Box w={{ base: 4, lg: 5 }} h={{ base: 4, lg: 5 }} bg={'grey.300'}></Box>{' '}
            <Text fontSize={{ base: 14, lg: 16 }}>Нямате записани ученици</Text>
          </Stack>
        </Stack>
      )}

      <CalendarDayViewModal isOpen={isOpen} onClose={onClose} date={date} events={dateEvents} role={userData?.role} />
    </>
  );
}

export default Calendar;
