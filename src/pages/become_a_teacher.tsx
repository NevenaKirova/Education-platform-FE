import React, { useRef } from 'react';

import Header from '../components/become_a_teacher/header.component';
import InfoSection from '../components/become_a_teacher/info.component';
import HowItWorksComponent from '../components/become_a_teacher/how_it_works.component';
import TeacherDemoSection from '../components/become_a_teacher/teacher_demo.component';
import HowToSection from '../components/become_a_teacher/how_to_become_a_teacher.component';
import QASection from '../components/become_a_teacher/qa.component';
import BenefitsSection from '../components/benefits/benefits_section.component';

import { gradientDivider } from '../images';

import { Stack, Img, Heading, Text, Button, useBreakpointValue } from '@chakra-ui/react';

import '../styles/styles.scss';
const BecomeATeacherPage = ({
  onLoginOpen,
  setModalTabIndex,
  setLoginAs,
}: {
  onLoginOpen: any;
  setModalTabIndex: any;
  setLoginAs: any;
}) => {
  const ref = useRef(null);

  const handleModalOpen = (tabIndex: number) => {
    setModalTabIndex(tabIndex);
    setLoginAs('teacher');
    onLoginOpen();
  };

  return (
    <>
      <Header onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} elRef={ref} setLoginAs={setLoginAs} />
      <Stack pt={{ base: 16, lg: 24 }} spacing={8} ref={ref}>
        <Stack spacing={0}>
          <InfoSection />
          <BenefitsSection />
        </Stack>

        <Img src={gradientDivider} w={'full'} />
        <Stack
          spacing={14}
          borderRadius={'0 150px '}
          align={'center'}
          px={{ base: 12, md: 24, '2xl': '15vw' }}
          py={{ base: 8, lg: 20 }}>
          <Stack spacing={10}>
            <Heading
              flex={1}
              as="h1"
              fontSize={useBreakpointValue({
                base: '5.8vw',
                sm: 'xl',
                md: '3.5vw',
                lg: '3vh',
                xl: '2.2vw',
              })}
              textAlign="center"
              color={'grey.600'}>
              Бърза, лесна и безплатна
              <Text as="span" color={'purple.500'}>
                {' '}
                регистрация
              </Text>
            </Heading>

            <Text color={'grey.600'} fontSize={{ base: 14, md: '2vw', lg: 18 }}>
              Регистрирай се и създай своя профил напълно безплатно! Започни да преподаваш още сега.
            </Text>
          </Stack>

          <Button
            w={{ base: 'full', sm: 'fit-content', lg: 'inherit', xl: 'full' }}
            size={{ base: 'sm', sm: 'md', lg: 'md', xl: 'lg' }}
            p={{ base: '15px', sm: '20px', lg: 0 }}
            px={{ base: 0, lg: 20 }}
            fontSize={{ base: '5px', md: 'xl' }}
            fontWeight={700}
            bg={'purple.500'}
            color={'white'}
            _hover={{ opacity: '0.9' }}
            onClick={() => handleModalOpen(1)}>
            Присъедини се
          </Button>
        </Stack>

        <HowToSection />
        <TeacherDemoSection />
        <HowItWorksComponent />
        <QASection />
      </Stack>
    </>
  );
};

export default BecomeATeacherPage;
