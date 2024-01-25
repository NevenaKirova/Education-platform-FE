import React from 'react';
import { Heading, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
const SubmissionsComponent = ({ course }: { course: any }) => {
  return (
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
            <Tr bg={'purple.500'} borderRadius={'lg'}>
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
                {' '}
                Коментари
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
            </Tr>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
            </Tr>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
            </Tr>{' '}
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
            </Tr>{' '}
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default SubmissionsComponent;
