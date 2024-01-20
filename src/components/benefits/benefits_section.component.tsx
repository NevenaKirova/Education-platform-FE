import React from 'react';
import { Stack } from '@chakra-ui/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';

import BenefitComponent from './benefit.component';
import { benefit1, benefit2, benefit3 } from '../../images';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function BenefitsSection() {
  const benefits = [
    {
      key: '01',
      header: 'Допълнителен доход',
      text: 'Без ежемесечен абонамент и такси, ние ти даваме възможност да си осигуриш стабилен финансов доход като учител на свободна практика.',
      image: benefit1,
    },
    {
      key: '02',
      header: 'Гъвкавост',
      text: 'Имай свободата да преподаваш по удобно за теб време онлайн индивидуално и на групи от ученици. ',
      image: benefit2,
    },
    {
      key: '03',
      header: 'Удобство ',
      text: ' Работи от всяко едно място в страната с интернет достъп.',
      image: benefit3,
    },
  ];
  return (
    <>
      <Stack h={{ base: 'fit-content', lg: '75vh' }} w={'100%'} my={{ base: 0, lg: 20 }} align={'center'} p={0}>
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          keyboard={{
            enabled: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Keyboard, Pagination, Navigation]}
          className="mySwiper"
          grabCursor={true}
          loop={true}>
          {benefits.map(({ key, header, text, image }) => (
            <SwiperSlide key={key}>
              <BenefitComponent num={key} header={header} text={text} image={image} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    </>
  );
}
