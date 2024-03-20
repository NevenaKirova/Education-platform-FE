import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import {
  Button,
  Heading,
  Stack,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Tag,
  useToast,
} from '@chakra-ui/react';

import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';

const statuses = [
  { type: 'Accepted', text: 'Одобрено', bg: 'green.status', colorText: 'green.statusText' },
  { type: 'Processing', text: 'В обработка', bg: 'blue.status', colorText: 'blue.statusText' },
  { type: 'Declined', text: 'Отказано', bg: 'red.status', colorText: 'red.statusText' },
];
const StudentTransactionPage = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = transactions.slice(startIndex, endIndex);

  const handleClick = page => {
    setCurrentPage(page);
  };

  const getTransactions = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/getPayments`);
      setTransactions(res.data);
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

  useEffect(() => {
    getTransactions();
  }, []);

  if (!user) return <Navigate to={'/'} replace />;

  return (
    <Stack
      spacing={10}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      w={'full'}>
      <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
        Плащания
      </Heading>

      <TableContainer w={'full'}>
        <Table variant="simple">
          <Thead>
            <Tr bg={'purple.500'}>
              <Th color={'white'} fontWeight={700}>
                Номер
              </Th>
              <Th color={'white'} fontWeight={700}>
                Курс/урок
              </Th>
              <Th color={'white'} fontWeight={700}>
                Дата
              </Th>
              <Th color={'white'} fontWeight={700}>
                Статус
              </Th>
              <Th color={'white'} fontWeight={700}>
                Сума
              </Th>
            </Tr>
          </Thead>
          {transactions.length ? (
            <Tbody>
              {currentData.map((el, index) => (
                <Tr key={index}>
                  <Td>
                    <Text fontWeight={700}>{el?.number}</Text>
                  </Td>
                  <Td>
                    <Text color={'grey.500'}>{el.lesson}</Text>
                  </Td>
                  <Td>
                    <Stack direction={{ base: 'row' }} color={'grey.500'}>
                      <Text>{el.date}</Text>
                      <Text>{el.time}</Text>
                    </Stack>
                  </Td>
                  <Td>
                    <Tag
                      size={'sm'}
                      variant="solid"
                      bg={statuses.find(transaction => transaction.status == el?.status)?.bg}
                      color={statuses.find(transaction => transaction.status == el?.status)?.colorText}
                      p={2}>
                      <Text fontSize={12} fontWeight={600}>
                        {statuses.find(transaction => transaction.status == el?.status)?.name}
                      </Text>
                    </Tag>
                  </Td>

                  <Td>
                    <Text color={'grey.500'}>{el.amount} лв.</Text>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : null}
        </Table>

        {!transactions.length && (
          <Stack w={'full'} color={'grey.500'} justify={'center'} mt={20}>
            <Text textAlign={'center'} align="center" w={'full'}>
              Все още нямате получени приходи
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
      </TableContainer>
    </Stack>
  );
};

export default StudentTransactionPage;
