import React, { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate} from 'react-router-dom';
import { Button, Heading, Stack, Text, InputGroup, Input, InputRightElement, Image } from '@chakra-ui/react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import PageLoader from '../utils/loader.component';

import { noData } from '../images';

const MessagesPage = () => {
  const { user } = useContext(AuthContext);

  const socketUrl = 'wss://localhost:8080/api/v1';

  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(prev => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 8, lg: 10 }}
      py={{ base: 0, lg: 10 }}
      mt={{ base: 36, lg: 40 }}
      align={'center'}
      justify={'center'}
      flex={1}
      w={'full'}
      minH={'85vh'}>
      <Stack
        direction={'row'}
        maxW={'82vw'}
        w={'full'}
        flex={1}
        rounded={'md'}
        bg={'purple.100'}
        py={{ base: 0, lg: 10 }}
        px={{ base: 10 }}>
        <Stack w={'40%'} spacing={8}>
          <Heading textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
            Съобщения
          </Heading>

          <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'white'} border="white" rounded={'md'} maxW={'90%'}>
            <Input pr="4.5rem" type="text" placeholder="Търси по име" />
            <InputRightElement width="4.5rem">
              <Button
                bg={'transparent'}
                color={'purple.500'}
                fontSize={14}
                fontWeight={700}
                w={'fit'}
                h={'fit'}
                mr={4}
                p={2}>
                Търси
              </Button>
            </InputRightElement>
          </InputGroup>
        </Stack>

        <Stack flex={1} bg={'white'} align={'center'} justify={'center'} rounded={'md'}>
          <Stack justify={'center'} align={'center'} spacing={6}>
            <Image src={noData} alt="No messages" h={'40vh'} />
            <Text color={'grey.400'}>Нямате проведени разговори </Text>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessagesPage;
