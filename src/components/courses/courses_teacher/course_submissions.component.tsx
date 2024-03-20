import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Img,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { axiosInstance } from '../../../axios';
import { downloadFile } from '../../../helpers/downloadFile';
import { getResponseMessage } from '../../../helpers/response.util';
import { fileDownload } from '../../../icons';

import SubmissionsAddCommentModal from '../modals/add_comment_submission';
const SubmissionsComponent = ({ course, assignmentId }: { course: any; assignmentId: number | null }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [solutions, setSolutions] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(solutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = solutions.slice(startIndex, endIndex);

  const handleClick = page => {
    setCurrentPage(page);
  };
  const getSubmissions = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/checkSolutions/${assignmentId}`);
      setSolutions(res.data);
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

  const downloadResource = async el => {
    try {
      const res = await axiosInstance.get(`/lessons/getSolutionFile/${el?.solutionFileNames}&&${el?.solutionId}`, {
        responseType: 'blob',
      });

      downloadFile(res);
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

  const handleAddComment = el => {
    setSelectedSolution(el);
    onOpen();
  };

  useEffect(() => {
    getSubmissions();
  }, []);

  return (
    <>
      <Stack spacing={12}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          {course?.title}
        </Heading>

        <Heading flex={1} as="h1" fontSize={{ base: 16, lg: 18, xl: 20 }} textAlign="start" color={'grey.600'}>
          Задача за домашна работа предавания
        </Heading>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr bg={'purple.500'}>
                <Th color={'white'} fontWeight={700}>
                  Ученик
                </Th>
                <Th color={'white'} fontWeight={700}>
                  Файлове
                </Th>
                <Th color={'white'} fontWeight={700}>
                  Дата
                </Th>
                <Th color={'white'} fontWeight={700}>
                  Статус
                </Th>
                <Th color={'white'} fontWeight={700}>
                  Коментари
                </Th>
              </Tr>
            </Thead>
            {solutions.length ? (
              <Tbody>
                {currentData.map((el, index) => (
                  <Tr key={index}>
                    <Td>
                      <Stack direction={'row'} spacing={{ base: 2, md: 4 }} align={'center'}>
                        <Avatar size={{ base: 'xs' }} src={el?.image} />
                        <Text>{el?.studentName}</Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Stack
                        as={Button}
                        onClick={() => downloadResource(el)}
                        direction={'row'}
                        spacing={2}
                        w={'fit-content'}
                        bg={'transparent'}
                        overflow={'hidden'}
                        _hover={{ bg: 'transparent' }}>
                        <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
                        <Text
                          fontWeight={600}
                          color={'grey.600'}
                          maxW={'300px'}
                          textOverflow={'ellipsis'}
                          overflow={'hidden'}>
                          {el?.solutionFileNames}
                        </Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Stack direction={{ base: 'column', lg: 'row' }} color={'grey.500'}>
                        <Text>{el.date}</Text>
                        <Text>{el.time}</Text>
                      </Stack>
                    </Td>
                    <Td>
                      <Box p={2} rounded="md" bg={el.status === 'навреме' ? 'green.status' : 'red.status'}>
                        <Text
                          textAlign={'center'}
                          color={el.status === 'навреме' ? 'green.statusText' : 'red.statusText'}>
                          {el.status}
                        </Text>
                      </Box>
                    </Td>
                    <Td>
                      <Stack
                        direction={'row'}
                        as={Button}
                        onClick={() => handleAddComment(el)}
                        bg={'transparent'}
                        _hover={{ bg: 'transparent' }}
                        spacing={3}>
                        <Text color={'purple.500'} fontWeight={700}>
                          Добави коментар
                        </Text>

                        <Text color={'grey.400'}>({el?.commentAmount})</Text>
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            ) : null}
          </Table>
        </TableContainer>

        {!solutions.length && (
          <Stack w={'full'} color={'grey.500'} justify={'center'} mt={20}>
            <Text justify={'center'} align="center" w={'full'}>
              Все още няма предавания
            </Text>
          </Stack>
        )}

        <Flex justifyContent="end" mt={4}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              border={'none'}
              variant="outline"
              onClick={() => handleClick(i + 1)}
              colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}>
              {i + 1}
            </Button>
          ))}
        </Flex>
      </Stack>
      {selectedSolution?.solutionId && (
        <SubmissionsAddCommentModal isOpen={isOpen} onClose={onClose} solution={selectedSolution} course={course} />
      )}
    </>
  );
};

export default SubmissionsComponent;
