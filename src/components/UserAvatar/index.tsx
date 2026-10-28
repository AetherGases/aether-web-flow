import { useTranslation } from '../../hooks/useTranslation'
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
  const { t } = useTranslation()
  const initial = userName.trim().charAt(0).toUpperCase()

  return (
    <S.Avatar $size={size} aria-label={t("Avatar de {0}", { "0": userName })}>
      {imageUrl ? <img src={imageUrl} alt={t("Foto de {0}", { "0": userName })} /> : initial}
    </S.Avatar>
  )
}

export default UserAvatar
