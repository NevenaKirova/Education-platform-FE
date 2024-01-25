import React from 'react';

import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Show, Stack } from '@chakra-ui/react';
import events from './events';

import bgLocale from '@fullcalendar/core/locales/bg';

function Calendar() {
  return (
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
            locale={bgLocale}
            dateClick={info => console.log(info)}
            headerToolbar={{
              start: '', // will normally be on the left. if RTL, will be on the right
              center: 'prev title next',
              end: 'today', // will normally be on the right. if RTL, will be on the left
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
          mb={24}
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
            dateClick={info => console.log(info)}
            headerToolbar={{
              start: '', // will normally be on the left. if RTL, will be on the right
              center: 'prev title next',
              end: '', // will normally be on the right. if RTL, will be on the left
            }}
            height={'55vh'}
          />
        </Stack>
      </Show>
    </>
  );
}

export default Calendar;
