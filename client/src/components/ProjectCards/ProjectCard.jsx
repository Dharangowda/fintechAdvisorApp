import React from 'react';
import { Card, CardContent, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ title, description, path, color }) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `4px solid ${color}`,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </CardContent>
      <Button 
        component={Link} 
        to={path}
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: color,
          '&:hover': {
            backgroundColor: color,
            opacity: 0.9
          }
        }}
      >
        Open Tool
      </Button>
    </Card>
  );
};

export default ProjectCard;