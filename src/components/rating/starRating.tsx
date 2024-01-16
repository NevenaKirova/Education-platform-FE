import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { Radio, HStack, Box } from '@chakra-ui/react';

export default function StarRating({
  rating,
  setRating,
  canRate = false,
  size = 20,
}: {
  rating: number;
  setRating?: any;
  canRate?: boolean;
  size?: number;
}) {
  const [hover, setHover] = useState(null);

  return (
    <HStack spacing={2}>
      {[...Array(5)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <Box
            as="label"
            key={index}
            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
            onMouseEnter={() => canRate && setHover(ratingValue)}
            onMouseLeave={() => canRate && setHover(null)}
            onClick={() => canRate && setRating(ratingValue)}>
            <FaStar cursor={'pointer'} size={size} transition="color 300ms" />
          </Box>
        );
      })}
    </HStack>
  );
}
