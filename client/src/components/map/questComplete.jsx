import React, { useContext, useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import questImage from "../../assets/images/eternum_quest.png";
import { GameContext } from '../../contexts/gameContext';

const containerVariant = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.15
    }
  }
};

const elementVariant = {
  hidden: {
    opacity: 0,
    y: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.23, 1, 0.32, 1] // Custom easing for smooth entrance
    }
  }
};

const QuestComplete = () => {
  const navigate = useNavigate();
  const game = useContext(GameContext);
  const [tweetMsg] = useState(`Just completed an Eternum quest by gaining ${game.values.questTarget}XP in Dark Shuffle! 🎮\n\nThis is what a deconstructed MMO looks like - completing quests across different games.\n\nEmbeddable Game Standard in action! 🔗\n\n@RealmsEternum @darkshuffle_gg @provablegames`);

  const handlePlayDarkShuffle = () => {
    navigate('/');
    game.endGame();
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <motion.div
        variants={containerVariant}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      >
        {/* Quest icon */}
        <motion.div
          variants={elementVariant}
          style={{ marginBottom: '40px', zIndex: 2 }}
        >
          <Box sx={styles.questIconContainer}>
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Box sx={styles.questIconWrapper}>
                <img
                  src={questImage}
                  alt="Quest Complete"
                  style={styles.questIcon}
                />
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Quest completed text */}
        <motion.div variants={elementVariant}>
          <Box sx={styles.titleContainer}>
            <Typography variant="h2" sx={styles.title}>
              QUEST COMPLETED
            </Typography>
            <Box sx={styles.titleUnderline} />
          </Box>
        </motion.div>

        {/* Reward message */}
        <motion.div variants={elementVariant}>
          <Box sx={styles.subtitleContainer}>
            <Typography variant="h5" sx={styles.subtitle}>
              Return to Eternum to claim your reward
            </Typography>
          </Box>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={elementVariant} style={{ marginTop: '40px', display: 'flex', gap: '20px', zIndex: 2 }}>
          <Button
            color='warning'
            variant='outlined'
            size='large'
            sx={styles.shareButton}
            component='a'
            href={'https://x.com/intent/tweet?text=' + encodeURIComponent(tweetMsg)}
            target='_blank'
          >
            Share on X
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handlePlayDarkShuffle}
            sx={{ fontSize: '14px' }}
          >
            Play Dark Shuffle
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

const styles = {
  container: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  questIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    position: 'relative',
  },
  questIconWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questIcon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    position: 'relative',
    zIndex: 2,
  },
  titleContainer: {
    position: 'relative',
    marginBottom: '20px',
    padding: '0 20px',
  },
  title: {
    color: '#f59100',
    fontWeight: 'bold',
    textShadow: '0 0 10px rgba(255, 233, 127, 0.1)',
    textAlign: 'center',
    letterSpacing: '4px',
    position: 'relative',
    zIndex: 1,
    marginBottom: '20px',
  },
  titleUnderline: {
    position: 'absolute',
    bottom: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(245, 145, 0, 0.5), transparent)',
  },
  subtitleContainer: {
    position: 'relative',
    marginBottom: '40px',
    padding: '20px',
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    letterSpacing: '2px',
    zIndex: 1,
  },
  shareButton: {
    letterSpacing: '1px',
    fontSize: '14px',
  },
};

export default QuestComplete;
