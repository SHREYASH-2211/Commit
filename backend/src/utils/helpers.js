// server/utils/helpers.js
import crypto from 'crypto';

class HelperUtils {
  // Generate unique strategy/rule ID
  generateStrategyId() {
    return crypto.randomBytes(8).toString('hex');
  }

  // Format strategy for API response
  formatStrategyResponse(strategy) {
    return {
      id: strategy._id,
      name: strategy.name,
      description: strategy.description,
      category: strategy.category,
      rules: strategy.rules.map(rule => ({
        id: rule.id,
        name: rule.name,
        conditions: rule.conditions,
        logicalOperator: rule.logicalOperator,
        action: rule.action,
        priority: rule.priority,
        isActive: rule.isActive
      })),
      riskManagement: strategy.riskManagement,
      backtestResults: strategy.backtestResults,
      isActive: strategy.isActive,
      tags: strategy.tags,
      createdAt: strategy.createdAt,
      updatedAt: strategy.updatedAt
    };
  }

  // Validate strategy name
  isValidStrategyName(name) {
    if (!name || typeof name !== 'string') return false;
    if (name.trim().length < 3 || name.trim().length > 100) return false;
    
    // Allow alphanumeric, spaces, hyphens, underscores
    const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/;
    return validNamePattern.test(name.trim());
  }

  // Sanitize strategy input
  sanitizeStrategyInput(input) {
    if (typeof input !== 'object' || input === null) return input;
    
    const sanitized = {};
    
    // Sanitize string fields
    ['name', 'description', 'category'].forEach(field => {
      if (input[field] && typeof input[field] === 'string') {
        sanitized[field] = input[field].trim().substring(0, 500);
      }
    });

    // Copy arrays and objects as-is (they'll be validated separately)
    ['rules', 'riskManagement', 'tags'].forEach(field => {
      if (input[field] !== undefined) {
        sanitized[field] = input[field];
      }
    });

    return sanitized;
  }

  // Calculate strategy complexity score
  calculateComplexityScore(strategy) {
    let score = 0;
    
    // Base score for number of rules
    score += strategy.rules.length * 2;
    
    // Score for conditions per rule
    strategy.rules.forEach(rule => {
      score += rule.conditions.length;
      
      // Additional score for complex conditions
      rule.conditions.forEach(condition => {
        if (typeof condition.value === 'object') {
          score += 2; // Complex condition with nested indicator
        }
        if (['crosses_above', 'crosses_below'].includes(condition.operator)) {
          score += 1; // Cross conditions are more complex
        }
      });
      
      // Score for risk management features
      if (rule.action.stopLoss) score += 1;
      if (rule.action.takeProfit) score += 1;
    });

    // Categorize complexity
    if (score <= 5) return 'Simple';
    if (score <= 15) return 'Moderate';
    if (score <= 25) return 'Complex';
    return 'Very Complex';
  }

  // Generate strategy summary
  generateStrategySummary(strategy) {
    const summary = {
      totalRules: strategy.rules.length,
      activeRules: strategy.rules.filter(r => r.isActive).length,
      indicators: new Set(),
      actions: new Set(),
      complexity: this.calculateComplexityScore(strategy),
      hasStopLoss: false,
      hasTakeProfit: false
    };

    strategy.rules.forEach(rule => {
      // Collect indicators
      rule.conditions.forEach(condition => {
        summary.indicators.add(condition.indicator);
      });
      
      // Collect actions
      summary.actions.add(rule.action.type);
      
      // Check for risk management
      if (rule.action.stopLoss) summary.hasStopLoss = true;
      if (rule.action.takeProfit) summary.hasTakeProfit = true;
    });

    summary.indicators = Array.from(summary.indicators);
    summary.actions = Array.from(summary.actions);

    return summary;
  }

  // Convert strategy to human-readable description
  generateHumanReadableStrategy(strategy) {
    let description = `Strategy: ${strategy.name}\n\n`;
    
    strategy.rules.forEach((rule, index) => {
      description += `Rule ${index + 1}: ${rule.name}\n`;
      description += `When: `;
      
      rule.conditions.forEach((condition, condIndex) => {
        if (condIndex > 0) {
          description += ` ${rule.logicalOperator} `;
        }
        
        description += `${condition.indicator.toUpperCase()}`;
        if (condition.params) {
          description += `(${Object.values(condition.params).join(',')})`;
        }
        description += ` ${this.operatorToText(condition.operator)} ${condition.value}`;
      });
      
      description += `\nThen: ${rule.action.type.toUpperCase()} ${rule.action.quantity}`;
      if (rule.action.stopLoss) description += ` (Stop Loss: ${rule.action.stopLoss}%)`;
      if (rule.action.takeProfit) description += ` (Take Profit: ${rule.action.takeProfit}%)`;
      description += `\n\n`;
    });

    return description;
  }

  // Convert operator symbols to readable text
  operatorToText(operator) {
    const operatorMap = {
      '>': 'is greater than',
      '<': 'is less than',
      '>=': 'is greater than or equal to',
      '<=': 'is less than or equal to',
      '==': 'equals',
      'crosses_above': 'crosses above',
      'crosses_below': 'crosses below'
    };
    return operatorMap[operator] || operator;
  }

  // Validate JSON structure
  isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Deep clone object
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Check if two strategies are similar (for duplicate detection)
  strategiesAreSimilar(strategy1, strategy2) {
    // Simple similarity check based on rule structure
    if (strategy1.rules.length !== strategy2.rules.length) return false;
    
    const rules1Hash = this.generateStrategyHash(strategy1);
    const rules2Hash = this.generateStrategyHash(strategy2);
    
    return rules1Hash === rules2Hash;
  }

  // Generate hash for strategy structure
  generateStrategyHash(strategy) {
    const simplified = {
      rules: strategy.rules.map(rule => ({
        conditions: rule.conditions.map(c => ({
          indicator: c.indicator,
          operator: c.operator,
          // Normalize value for comparison
          value: typeof c.value === 'object' ? 'complex' : c.value
        })),
        action: rule.action.type
      }))
    };
    
    return crypto
      .createHash('md5')
      .update(JSON.stringify(simplified))
      .digest('hex');
  }

  // Format error messages for API responses
  formatErrorResponse(message, errors = []) {
    return {
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
      timestamp: new Date().toISOString()
    };
  }

  // Format success responses
  formatSuccessResponse(message, data = null) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString()
    };
    
    if (data !== null) {
      response.data = data;
    }
    
    return response;
  }

  // Pagination helper
  getPaginationData(page, limit, total) {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalPages = Math.ceil(total / itemsPerPage);
    
    return {
      currentPage,
      itemsPerPage,
      totalPages,
      total,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }
}

const helperUtils = new HelperUtils();

export const generateStrategyId = helperUtils.generateStrategyId.bind(helperUtils);
export const formatStrategyResponse = helperUtils.formatStrategyResponse.bind(helperUtils);
export const isValidStrategyName = helperUtils.isValidStrategyName.bind(helperUtils);
export const sanitizeStrategyInput = helperUtils.sanitizeStrategyInput.bind(helperUtils);
export const calculateComplexityScore = helperUtils.calculateComplexityScore.bind(helperUtils);
export const generateStrategySummary = helperUtils.generateStrategySummary.bind(helperUtils);
export const generateHumanReadableStrategy = helperUtils.generateHumanReadableStrategy.bind(helperUtils);
export const operatorToText = helperUtils.operatorToText.bind(helperUtils);
export const isValidJSON = helperUtils.isValidJSON.bind(helperUtils);
export const deepClone = helperUtils.deepClone.bind(helperUtils);
export const strategiesAreSimilar = helperUtils.strategiesAreSimilar.bind(helperUtils);
export const generateStrategyHash = helperUtils.generateStrategyHash.bind(helperUtils);
export const formatErrorResponse = helperUtils.formatErrorResponse.bind(helperUtils);
export const formatSuccessResponse = helperUtils.formatSuccessResponse.bind(helperUtils);
export const getPaginationData = helperUtils.getPaginationData.bind(helperUtils);

export default helperUtils;