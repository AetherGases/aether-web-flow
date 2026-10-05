import * as S from './styles'

interface UserAvatarProps {
  userName: string
  imageUrl?: string
  size?: 'small' | 'medium' | 'large'
}

function UserAvatar({
  userName,
  imageUrl,
  size = 'medium',
}: UserAvatarProps) {
  const initial = userName.trim().charAt(0).toUpperCase()

  return (
    <S.Avatar $size={size} aria-label={`Avatar de ${userName}`}>
      {imageUrl ? <img src={imageUrl} alt={`Foto de ${userName}`} /> : initial}
    </S.Avatar>
  )
}

export default UserAvatar
