import React from 'react';
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

export default function FaqSection() {
  const faqs = [
    {
      header: 'Какво е My Classroom?',
      text: `My Classroom е онлайн платформа за обучение на ученици и студенти, предлагаща множество от онлайн частни  уроци и групови курсове за учащи. Нашата мисия е да подпомогнем развитието на образованието в страната и да отворим една нова страница в сферата на онлайн обучението.`,
      text2:
        'Нашата платформа свързва преподаватели и учащи от цялата страна и дава възможност за по-добра учебна подготовка от вкъщи на ученици в начален и среден етап, зрелостници и студенти.',
    },
    {
      header: 'Как се провеждат курсовете и частните уроци?',
      text: 'Курсовете и частните уроци се провеждат онлайн на платформата. След като се запишете, можете директно чрез изпратения Ви линк да достъпите избрания от вас курс / частен урок във времето на неговото провеждане.',
    },
    {
      header: 'Какви преподаватели преподават на платформата ни?',
      text: 'Преподавателите в My Classroom са действащи преподаватели с опит по преподавания от тях предмет и желание за професионално развитие в сферата. Всеки един преподавател минава задължителна верификация на своя опит и качества като такъв, преди да бъде одобрен за преподавател в My Classroom.',
    },
    {
      header: 'Как мога да се запиша за курс / частен урок.',
      text: 'Записването става след като си създадете профил и заплатите съответната сума за избрания от вас курс / частен урок. Записания от Вас курс / частен урок можете да намерите и достъпите като отидете на меню „Моето табло."',
    },
  ];
  return (
    <Center py={{ base: 6, xl: 14 }} pb={20} px={{ base: 8, lg: 24, '2xl': '12vw' }} w={'full'} bg={'purple.100'}>
      <Stack p={4} spacing={8} w={'full'}>
        <Heading
          flex={1}
          as="h1"
          fontSize={{ base: '5.8vw', sm: '4.5vw', md: '3.8vw', xl: '2vw' }}
          textAlign="center"
          pb={8}>
          Често задавани{' '}
          <Text as="span" color={'purple.500'}>
            въпроси
          </Text>
        </Heading>
        <Accordion allowToggle>
          <Stack spacing={6}>
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                bg={'white'}
                border={'none'}
                py={2}
                _focusWithin={{ borderLeft: '4px solid ', borderLeftColor: 'purple.500' }}>
                <h2>
                  <AccordionButton color={'purple.500'} fontWeight={700} fontSize={'1vw'} _hover={{ bg: 'white' }}>
                    <Box as="span" flex="1" textAlign="left" fontSize={{ base: 16, lg: 20 }}>
                      {faq.header}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel textAlign={'left'} fontSize={{ base: 14, lg: 16 }}>
                  <Text>{faq.text}</Text>
                  {faq?.text2 && (
                    <>
                      {' '}
                      <br /> <Text>{faq?.text2}</Text>{' '}
                    </>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Stack>
        </Accordion>
      </Stack>
    </Center>
  );
}
