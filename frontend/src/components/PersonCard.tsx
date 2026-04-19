import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  Transgender as OtherIcon,
} from '@mui/icons-material';
import { Person as PersonType } from '@/types';

interface PersonCardProps {
  person: PersonType;
  onEdit?: (person: PersonType) => void;
  onDelete?: (person: PersonType) => void;
  onViewDetails?: (person: PersonType) => void;
}

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

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'M':
        return 'primary';
      case 'F':
        return 'secondary';
      default:
        return 'default';
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
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {person.fullName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {getGenderIcon(person.gender ?? 'O')}
            <Chip
              label={person.gender === 'M' ? 'Homme' : person.gender === 'F' ? 'Femme' : 'Autre'}
              size="small"
              color={getGenderColor(person.gender ?? 'O') as any}
              variant="outlined"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {getAgeText()}
        </Typography>

        {person.birthPlace && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            📍 {person.birthPlace}
          </Typography>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          🎂 {formatDate(person.birthDate)}
          {person.deathDate && ` - 💀 ${formatDate(person.deathDate)}`}
        </Typography>

        {person.biography && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
          >
            {person.biography}
          </Typography>
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
