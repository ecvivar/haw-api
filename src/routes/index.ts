import { Router } from 'express';
import { authController } from '../controllers/authController';
import { characterController } from '../controllers/characterController';
import { actorController } from '../controllers/actorController';
import { episodeController } from '../controllers/episodeController';
import { gameController } from '../controllers/gameController';
import { locationController } from '../controllers/locationController';
import { seasonController } from '../controllers/seasonController';
import { soundtrackController } from '../controllers/soundtrackController';
import { overviewController } from '../controllers/overviewController';
import { translationController } from '../controllers/translationController';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/api', asyncHandler(overviewController.getApiInfo));
router.get('/api/ping', asyncHandler(overviewController.ping));
router.get('/api/health', asyncHandler(overviewController.health));

const v1 = Router();

v1.get('/endpoints', authenticate, asyncHandler(overviewController.getEndpoints));

// Auth
v1.post('/auth/register', authRateLimiter, asyncHandler(authController.register));
v1.post('/auth/authenticate', authRateLimiter, asyncHandler(authController.authenticate));
v1.post('/auth/delete', authRateLimiter, authenticate, asyncHandler(authController.delete));

// Characters
v1.get('/characters', authenticate, asyncHandler(characterController.findAll));
v1.get('/characters/random', authenticate, asyncHandler(characterController.findRandom));
v1.get('/characters/:uuid', authenticate, asyncHandler(characterController.findBy));
v1.post('/characters', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(characterController.save));
v1.patch('/characters/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(characterController.patch));
v1.delete('/characters/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(characterController.delete));

// Actors
v1.get('/actors', authenticate, asyncHandler(actorController.findAll));
v1.get('/actors/random', authenticate, asyncHandler(actorController.findRandom));
v1.get('/actors/:uuid', authenticate, asyncHandler(actorController.findBy));
v1.get('/actors/:uuid/socials', authenticate, asyncHandler(actorController.findAllSocials));
v1.get('/actors/:uuid/socials/random', authenticate, asyncHandler(actorController.findRandomSocial));
v1.get('/actors/:uuid/socials/:name', authenticate, asyncHandler(actorController.findSocialBy));
v1.post('/actors', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(actorController.save));
v1.post('/actors/:uuid/socials', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(actorController.saveSocial));
v1.patch('/actors/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(actorController.patch));
v1.patch('/actors/:uuid/socials/:name', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(actorController.patchSocial));
v1.delete('/actors/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(actorController.delete));
v1.delete('/actors/:uuid/socials/:name', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(actorController.deleteSocial));

// Episodes
v1.get('/episodes', authenticate, asyncHandler(episodeController.findAll));
v1.get('/episodes/random', authenticate, asyncHandler(episodeController.findRandom));
v1.get('/episodes/:uuid', authenticate, asyncHandler(episodeController.findBy));
v1.get('/episodes/:uuid/translations', authenticate, asyncHandler(episodeController.findAllTranslationsBy));
v1.get('/episodes/:uuid/translations/random', authenticate, asyncHandler(episodeController.findRandomTranslation));
v1.get('/episodes/:uuid/translations/:language', authenticate, asyncHandler(episodeController.findTranslationBy));
v1.post('/episodes', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(episodeController.save));
v1.post('/episodes/:uuid/translations', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(episodeController.saveTranslation));
v1.patch('/episodes/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(episodeController.patch));
v1.patch('/episodes/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(episodeController.patchTranslation));
v1.delete('/episodes/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(episodeController.delete));
v1.delete('/episodes/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(episodeController.deleteTranslation));

// Games
v1.get('/games', authenticate, asyncHandler(gameController.findAll));
v1.get('/games/random', authenticate, asyncHandler(gameController.findRandom));
v1.get('/games/:uuid', authenticate, asyncHandler(gameController.findBy));
v1.get('/games/:uuid/translations', authenticate, asyncHandler(gameController.findAllTranslationsBy));
v1.get('/games/:uuid/translations/random', authenticate, asyncHandler(gameController.findRandomTranslation));
v1.get('/games/:uuid/translations/:language', authenticate, asyncHandler(gameController.findTranslationBy));
v1.post('/games', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(gameController.save));
v1.post('/games/:uuid/translations', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(gameController.saveTranslation));
v1.patch('/games/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(gameController.patch));
v1.patch('/games/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(gameController.patchTranslation));
v1.delete('/games/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(gameController.delete));
v1.delete('/games/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(gameController.deleteTranslation));

// Locations
v1.get('/locations', authenticate, asyncHandler(locationController.findAll));
v1.get('/locations/random', authenticate, asyncHandler(locationController.findRandom));
v1.get('/locations/:uuid', authenticate, asyncHandler(locationController.findBy));
v1.get('/locations/:uuid/translations', authenticate, asyncHandler(locationController.findAllTranslationsBy));
v1.get('/locations/:uuid/translations/random', authenticate, asyncHandler(locationController.findRandomTranslation));
v1.get('/locations/:uuid/translations/:language', authenticate, asyncHandler(locationController.findTranslationBy));
v1.post('/locations', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(locationController.save));
v1.post('/locations/:uuid/translations', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(locationController.saveTranslation));
v1.patch('/locations/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(locationController.patch));
v1.patch('/locations/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(locationController.patchTranslation));
v1.delete('/locations/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(locationController.delete));
v1.delete('/locations/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(locationController.deleteTranslation));

// Seasons
v1.get('/seasons', authenticate, asyncHandler(seasonController.findAll));
v1.get('/seasons/random', authenticate, asyncHandler(seasonController.findRandom));
v1.get('/seasons/:uuid', authenticate, asyncHandler(seasonController.findBy));
v1.get('/seasons/:uuid/translations', authenticate, asyncHandler(seasonController.findAllTranslationsBy));
v1.get('/seasons/:uuid/translations/random', authenticate, asyncHandler(seasonController.findRandomTranslation));
v1.get('/seasons/:uuid/translations/:language', authenticate, asyncHandler(seasonController.findTranslationBy));
v1.post('/seasons', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(seasonController.save));
v1.post('/seasons/:uuid/translations', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(seasonController.saveTranslation));
v1.patch('/seasons/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(seasonController.patch));
v1.patch('/seasons/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(seasonController.patchTranslation));
v1.delete('/seasons/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(seasonController.delete));
v1.delete('/seasons/:uuid/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(seasonController.deleteTranslation));

// Translations
v1.get('/translations', authenticate, asyncHandler(translationController.findAll));

// Soundtracks
v1.get('/soundtracks', authenticate, asyncHandler(soundtrackController.findAll));
v1.get('/soundtracks/random', authenticate, asyncHandler(soundtrackController.findRandom));
v1.get('/soundtracks/:uuid', authenticate, asyncHandler(soundtrackController.findBy));
v1.post('/soundtracks', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(soundtrackController.save));
v1.patch('/soundtracks/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(soundtrackController.patch));
v1.delete('/soundtracks/:uuid', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(soundtrackController.delete));

// Overview
v1.get('/overview', authenticate, asyncHandler(overviewController.find));
v1.get('/overview/translations', authenticate, asyncHandler(overviewController.findAllTranslations));
v1.get('/overview/translations/:language', authenticate, asyncHandler(overviewController.findTranslationBy));
v1.post('/overview', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(overviewController.save));
v1.post('/overview/translations', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(overviewController.saveTranslation));
v1.patch('/overview', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(overviewController.patch));
v1.patch('/overview/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(overviewController.patchTranslation));
v1.delete('/overview', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(overviewController.delete));
v1.delete('/overview/translations/:language', authenticate, requireRole('ADMIN', 'MAINTAINER'), asyncHandler(overviewController.deleteTranslation));

router.use('/api/v1', v1);

export default router;
