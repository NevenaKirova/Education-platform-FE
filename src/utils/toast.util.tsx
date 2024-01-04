import { useToast } from '@chakra-ui/react';

type messageTypes = 'success' | 'info' | 'warning' | 'error';

export const CreateToastMessage = (type: messageTypes, message: string) => {
  const toast = useToast();

  return toast({
    title: message,
    status: type,
    duration: 3000,
    isClosable: true,
    position: 'top-right',
  });
};

export default CreateToastMessage;
