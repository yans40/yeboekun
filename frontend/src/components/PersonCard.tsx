import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import OtherIcon from '@mui/icons-material/Transgender';
import { Person as PersonType } from '@/types';
import { colors, fonts, radius, spacing } from '@/theme/tokens';

interface PersonCardProps {
  person: PersonType;
  onEdit?: (person: PersonType) => void;
  onDelete?: (person: PersonType) => void;
  onViewDetails?: (person: PersonType) => void;
}

// Remplace MUI Chip variant="outlined" size="small"
const GenderChip: React.FC<{ label: string; gender: string | null }> = ({ label, gender }) => {
  const borderColor = gender === 'M' ? colors.ocean : gender === 'F' ? colors.sepiaLt : colors.ink4;
  const textColor   = gender === 'M' ? colors.ocean : gender === 'F' ? colors.sepia   : colors.ink3;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `1px ${spacing[2]}px`,
        border: `1px solid ${borderColor}`,
        borderRadius: radius.pill,
        fontSize: 11,
        fontFamily: fonts.sans,
        color: textColor,
        backgroundColor: 'transparent',
        lineHeight: '18px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
};

const PersonCard: React.FC<PersonCardProps> = ({
  person,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'M':
        return <MaleIcon color="primary" />;
      case 'F':
        return <FemaleIcon color="secondary" />;
      default:
        return <OtherIcon color="action" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non renseigné';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getAgeText = () => {
    if (person.age) {
      return `${person.age} ans`;
    }
    if (person.birthDate) {
      const birthYear = new Date(person.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return `Né(e) en ${birthYear}`;
    }
    return 'Âge inconnu';
  };

  // styles partagés pour les textes secondaires (remplace Typography body2 color="text.secondary")
  const secondaryText: React.CSSProperties = {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink3,
    marginBottom: spacing[1],
    lineHeight: 1.5,
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 1,
        cursor: onViewDetails ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': onViewDetails ? {
          transform: 'scale(1.02)',
          boxShadow: 3,
        } : {},
      }}
      onClick={() => onViewDetails?.(person)}
    >
      {person.photoUrl ? (
        <CardMedia
          component="img"
          height="200"
          image={person.photoUrl}
          alt={person.fullName}
          sx={{ objectFit: 'cover' }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
          }}
        >
          <PersonIcon sx={{ fontSize: 80, color: 'grey.400' }} />
        </Box>
      )}

      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          {/* Remplace Typography h6 */}
          <h6 style={{
            margin: 0,
            fontFamily: fonts.serif,
            fontSize: '1.25rem',
            fontWeight: 700,
            color: colors.ink,
            lineHeight: 1.3,
          }}>
            {person.fullName}
          </h6>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getGenderIcon(person.gender ?? 'O')}
            {/* Remplace MUI Chip */}
            <GenderChip
              label={person.gender === 'M' ? 'Homme' : person.gender === 'F' ? 'Femme' : 'Autre'}
              gender={person.gender ?? null}
            />
          </Box>
        </Box>

        {/* Remplace Typography body2 × 4 */}
        <p style={secondaryText}>{getAgeText()}</p>

        {person.birthPlace && (
          <p style={secondaryText}>📍 {person.birthPlace}</p>
        )}

        <p style={secondaryText}>
          🎂 {formatDate(person.birthDate)}
          {person.deathDate && ` - 💀 ${formatDate(person.deathDate)}`}
        </p>

        {person.biography && (
          <p style={{
            ...secondaryText,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          } as React.CSSProperties}>
            {person.biography}
          </p>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          {onEdit && (
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(person);
                }}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(person);
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
