import React from 'react';

import {
  Container
} from './styles';

interface BulletProps {
  active?: boolean;
}

export function Bullet({ active = false , ...rest }: BulletProps){
  return (
    <Container active={active} {...rest} />
  );
}