// server/routes/strategyRoutes.js
import express from 'express';
import strategyController from '../controllers/strategy.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication to all routes
router.use(verifyJWT);

// Get builder components (indicators, operators, etc.)
router.get('/components', strategyController.getBuilderComponents);

// Get strategy templates
router.get('/templates', strategyController.getTemplates);

// Seed strategy templates (for development/testing)
router.post('/seed-templates', strategyController.seedTemplates);

// Clone strategy from template
router.post('/clone-template', 
  strategyController.cloneFromTemplate
);

// Get all user strategies
router.get('/', strategyController.getUserStrategies);

// Create new strategy
router.post('/', 
  strategyController.createStrategy
);

// Get single strategy
router.get('/:id', strategyController.getStrategy);

// Update strategy
router.put('/:id', 
  strategyController.updateStrategy
);

// Delete strategy
router.delete('/:id', strategyController.deleteStrategy);

export default router;