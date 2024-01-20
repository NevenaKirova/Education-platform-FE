import React, { useState } from 'react';

import {
  Button,
  Heading,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Img,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import StarRating from '../../rating/starRating';
import { report } from '../../../icons';
import ReportModal from './report';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';

export default function RateClassModal({
  isOpen,
  onClose,
  onOpen,
  course,
}: {
  isOpen: boolean;
  onClose: any;
  course: any;
  onOpen: any;
}) {
  const { isOpen: isOpenReport, onOpen: onOpenReport, onClose: onCloseReport } = useDisclosure();
  const toast = useToast();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const handleOnClose = () => {
    onClose();
    setRating(0);
    setReview('');
  };

  const leaveReview = async () => {
    try {
      await axiosInstance.post(`/lessons/leaveReview`, {
        lessonId: course.lessonID,
        rating: rating,
        message: review,
      });

      handleOnClose();
      toast({
        title: 'Успешно добавяне на отзив',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
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

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleOnClose} size={{ base: 'lg', md: '3xl', lg: '5xl' }} isCentered>
        <ModalOverlay />
        <ModalContent p={{ base: 0, lg: 8 }}>
          <ModalBody w={'full'} p={2} overflow={'hidden'}>
            <ModalCloseButton color={'purple.500'} />

            <Stack
              spacing={{ base: 6, md: 10 }}
              w={'full'}
              px={{ base: 6, lg: 12 }}
              my={4}
              align={'start'}
              textAlign={'center'}>
              <Stack spacing={3} align={'start'}>
                <Text color="grey.600" fontSize={18} fontWeight={500}>
                  Добавете оценка за
                </Text>

                <Heading lineHeight={1.1} fontSize={{ base: 'xl', md: '3xl' }} color={'purple.500'}>
                  {course?.title}
                </Heading>
              </Stack>

              <Stack align={'start'}>
                <Text color="grey.600" fontSize={18} fontWeight={700}>
                  Оценка
                </Text>

                <Stack direction={'row'} spacing={4} align={'center'}>
                  <StarRating rating={rating} setRating={setRating} canRate={true} size={26} />

                  <Text color="grey.400" fontSize={18}>
                    (Доволен/на съм)
                  </Text>
                </Stack>
              </Stack>

              <Stack align={'start'} w={'full'}>
                <Text color="grey.600" fontSize={18} fontWeight={700}>
                  Отзив
                </Text>

                <Textarea
                  bg={'grey.100'}
                  pr="4.5rem"
                  maxLength={600}
                  resize={'none'}
                  rows={3}
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  placeholder="Какво е мнението Ви за курса?
Доволни ли сте от него?
Бихте ли го препоръчали?
"
                />
              </Stack>

              <Stack
                mt={8}
                spacing={4}
                w={'full'}
                direction={'row'}
                flexWrap={'wrap'}
                align={'start'}
                justify={'space-between'}>
                <Button
                  w={'full'}
                  maxW={'40%'}
                  size={{ base: 'sm', lg: 'md' }}
                  bg={'purple.500'}
                  color={'white'}
                  _hover={{
                    opacity: '0.9',
                  }}
                  onClick={leaveReview}>
                  Добави отзив
                </Button>

                <Stack direction={'row'} align={'center'} spacing={2}>
                  <Text color="grey.400" fontSize={14} fontWeight={500}>
                    Забелязахте нещо нередно?
                  </Text>
                  <Button
                    color={'purple.500'}
                    bg={'transparent'}
                    _hover={{ bg: 'transparent' }}
                    p={0}
                    onClick={() => {
                      onClose();
                      onOpenReport();
                    }}>
                    <Stack align={'center'} direction={'row'}>
                      <Img src={report} alt={'report icon'} w={4} h={4} />
                      <Text fontSize={14} fontWeight={500}>
                        Докладвай за нередност
                      </Text>
                    </Stack>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ReportModal isOpen={isOpenReport} onClose={onCloseReport} onOpenRate={onOpen} />
    </>
  );
}
