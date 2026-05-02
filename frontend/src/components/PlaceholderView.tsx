import { useTranslation } from 'react-i18next';
import { colors, fonts } from '../theme/tokens';

interface Props {
  name: string;
}

export default function PlaceholderView({ name }: Props) {
  const { t } = useTranslation();
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: colors.paper,
    }}>
      <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 32, color: colors.ink2 }}>
        {name}
      </span>
      <span style={{ fontFamily: fonts.mono, fontSize: 13, color: colors.ink4 }}>
        {t('placeholder.coming_soon')}
      </span>
    </div>
  );
}
