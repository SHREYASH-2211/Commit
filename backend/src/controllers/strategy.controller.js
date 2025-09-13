// server/controllers/strategyController.js
import Strategy from '../models/strategy.model.js';
import { validateStrategy } from '../services/validationService.js';
import { generateStrategyId } from '../utils/helpers.js';

class StrategyController {
  // Get all strategies for a user
  async getUserStrategies(req, res) {
    try {
      const { page = 1, limit = 10, category } = req.query;
      const query = { userId: req.user.id, isTemplate: false };
      
      if (category && category !== 'all') {
        query.category = category;
      }

      const strategies = await Strategy.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('-__v');

      const total = await Strategy.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          strategies,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch strategies',
        error: error.message
      });
    }
  }

  // Get strategy templates
  async getTemplates(req, res) {
    try {
      const templates = await Strategy.find({ isTemplate: true })
        .select('name description category rules riskManagement tags')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: templates
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        error: error.message
      });
    }
  }

  // Create new strategy
  async createStrategy(req, res) {
    try {
      const { name, description, category, rules, riskManagement, tags } = req.body;

      // Validate strategy structure
      const validation = validateStrategy({ rules, riskManagement });
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid strategy configuration',
          errors: validation.errors
        });
      }

      // Generate unique IDs for rules
      const processedRules = rules.map(rule => ({
        ...rule,
        id: rule.id || generateStrategyId()
      }));

      const strategy = new Strategy({
        userId: req.user.id,
        name,
        description,
        category,
        rules: processedRules,
        riskManagement,
        tags
      });

      await strategy.save();

      res.status(201).json({
        success: true,
        message: 'Strategy created successfully',
        data: strategy
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values(error.errors).map(e => e.message)
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create strategy',
        error: error.message
      });
    }
  }

  // Get single strategy
  async getStrategy(req, res) {
    try {
      const strategy = await Strategy.findOne({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!strategy) {
        return res.status(404).json({
          success: false,
          message: 'Strategy not found'
        });
      }

      res.status(200).json({
        success: true,
        data: strategy
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch strategy',
        error: error.message
      });
    }
  }

  // Update strategy
  async updateStrategy(req, res) {
    try {
      const { name, description, category, rules, riskManagement, tags, isActive } = req.body;

      // Validate strategy if rules are being updated
      if (rules) {
        const validation = validateStrategy({ rules, riskManagement });
        if (!validation.isValid) {
          return res.status(400).json({
            success: false,
            message: 'Invalid strategy configuration',
            errors: validation.errors
          });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (category) updateData.category = category;
      if (rules) {
        updateData.rules = rules.map(rule => ({
          ...rule,
          id: rule.id || generateStrategyId()
        }));
      }
      if (riskManagement) updateData.riskManagement = riskManagement;
      if (tags) updateData.tags = tags;
      if (isActive !== undefined) updateData.isActive = isActive;

      const strategy = await Strategy.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!strategy) {
        return res.status(404).json({
          success: false,
          message: 'Strategy not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Strategy updated successfully',
        data: strategy
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update strategy',
        error: error.message
      });
    }
  }

  // Delete strategy
  async deleteStrategy(req, res) {
    try {
      const strategy = await Strategy.findOneAndDelete({
        _id: req.params.id,
        userId: req.user.id
      });

      if (!strategy) {
        return res.status(404).json({
          success: false,
          message: 'Strategy not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Strategy deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete strategy',
        error: error.message
      });
    }
  }

  // Clone strategy from template
  async cloneFromTemplate(req, res) {
    try {
      const { templateId, name } = req.body;

      const template = await Strategy.findOne({ 
        _id: templateId, 
        isTemplate: true 
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      const strategy = new Strategy({
        userId: req.user.id,
        name: name || `${template.name} - Copy`,
        description: template.description,
        category: template.category,
        rules: template.rules.map(rule => ({
          ...rule.toObject(),
          id: generateStrategyId()
        })),
        riskManagement: template.riskManagement,
        tags: template.tags,
        isTemplate: false
      });

      await strategy.save();

      res.status(201).json({
        success: true,
        message: 'Strategy created from template',
        data: strategy
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to clone template',
        error: error.message
      });
    }
  }

  // Get strategy builder components/blocks
  async getBuilderComponents(req, res) {
    try {
      const components = {
        indicators: [
          { id: 'price', name: 'Price', description: 'Current market price' },
          { id: 'sma', name: 'Simple Moving Average', description: 'SMA indicator', params: ['period'] },
          { id: 'ema', name: 'Exponential Moving Average', description: 'EMA indicator', params: ['period'] },
          { id: 'rsi', name: 'RSI', description: 'Relative Strength Index', params: ['period'] },
          { id: 'macd', name: 'MACD', description: 'Moving Average Convergence Divergence', params: ['fast', 'slow', 'signal'] },
          { id: 'bollinger_bands', name: 'Bollinger Bands', description: 'Bollinger Bands indicator', params: ['period', 'stdDev'] },
          { id: 'volume', name: 'Volume', description: 'Trading volume' }
        ],
        operators: [
          { id: '>', name: 'Greater than', symbol: '>' },
          { id: '<', name: 'Less than', symbol: '<' },
          { id: '>=', name: 'Greater than or equal', symbol: '>=' },
          { id: '<=', name: 'Less than or equal', symbol: '<=' },
          { id: '==', name: 'Equal to', symbol: '=' },
          { id: 'crosses_above', name: 'Crosses above', symbol: '↑' },
          { id: 'crosses_below', name: 'Crosses below', symbol: '↓' }
        ],
        actions: [
          { id: 'buy', name: 'Buy', color: 'green' },
          { id: 'sell', name: 'Sell', color: 'red' },
          { id: 'hold', name: 'Hold', color: 'yellow' }
        ],
        quantities: [
          { id: 'all', name: 'All available funds' },
          { id: 'half', name: '50% of available funds' },
          { id: 'custom', name: 'Custom amount' }
        ],
        timeframes: [
          { id: '1m', name: '1 Minute' },
          { id: '5m', name: '5 Minutes' },
          { id: '15m', name: '15 Minutes' },
          { id: '1h', name: '1 Hour' },
          { id: '4h', name: '4 Hours' },
          { id: '1d', name: '1 Day' }
        ]
      };

      res.status(200).json({
        success: true,
        data: components
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch components',
        error: error.message
      });
    }
  }

  // Seed strategy templates (admin only)
  async seedTemplates(req, res) {
    try {
      // Check if user is admin (you can add this check)
      // if (req.user.role !== 'admin') {
      //   return res.status(403).json({
      //     success: false,
      //     message: 'Admin access required'
      //   });
      // }

      const { strategyTemplates } = await import('../templates/strategyTemplates.js');
      
      // Clear existing templates
      await Strategy.deleteMany({ isTemplate: true });
      
      // Add userId field to templates
      const templatesWithUserId = strategyTemplates.map(template => ({
        ...template,
        userId: req.user.id,
        isTemplate: true
      }));

      // Insert templates
      const insertedTemplates = await Strategy.insertMany(templatesWithUserId);

      res.status(201).json({
        success: true,
        message: `Successfully seeded ${insertedTemplates.length} templates`,
        data: {
          count: insertedTemplates.length,
          templates: insertedTemplates.map(t => ({
            id: t._id,
            name: t.name,
            category: t.category
          }))
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to seed templates',
        error: error.message
      });
    }
  }
}

export default new StrategyController();