import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { colors, fonts } from '../theme/tokens';
import { useFamilyTreeContext } from '../context/FamilyTreeContext';

export default function AdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { canEdit, onExitEditMode } = useFamilyTreeContext();

  const handleExit = () => {
    onExitEditMode();
    navigate('/');
  };

  if (!canEdit) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        backgroundColor: colors.paper,
      }}>
        <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 24, color: colors.ink3 }}>
          {t('admin.title')}
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.ink4 }}>
          Accès restreint — utilisez le menu avatar pour vous connecter.
        </span>
        <Button variant="outlined" onClick={() => navigate('/')} style={{ fontFamily: fonts.sans }}>
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      backgroundColor: colors.paper,
    }}>
      <span style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 32, color: colors.ink2 }}>
        {t('admin.title')}
      </span>
      <span style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.forest }}>
        Mode édition actif
      </span>
      <Button variant="contained" onClick={handleExit} style={{ fontFamily: fonts.sans }}>
        Quitter le mode édition
      </Button>
    </div>
  );
}
