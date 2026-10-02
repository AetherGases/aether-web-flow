import styled from 'styled-components'

interface AvatarProps {
  $size: 'small' | 'medium' | 'large'
}

const avatarSizes = {
  small: '2.5rem',
  medium: '4rem',
  large: '5.5rem',
}

export const Avatar = styled.div<AvatarProps>`
  display: grid;
  place-items: center;
  width: ${({ $size }) => avatarSizes[$size]};
  height: ${({ $size }) => avatarSizes[$size]};
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  background: var(--gradient-brand-diagonal);
  border: 3px solid rgb(255 255 255 / 70%);
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
