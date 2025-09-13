// server/services/validationService.js
class ValidationService {
  validateStrategy(strategyData) {
    const errors = [];
    const { rules, entryRules, exitRules, riskManagement, executionSettings } = strategyData;

    // Check if using new entry/exit structure or legacy rules
    const hasNewStructure = (entryRules && entryRules.length > 0) || (exitRules && exitRules.length > 0);
    const hasLegacyRules = rules && rules.length > 0;

    if (!hasNewStructure && !hasLegacyRules) {
      errors.push('Strategy must have either entry/exit rules or legacy rules');
    }

    // Validate entry rules
    if (entryRules) {
      if (!Array.isArray(entryRules)) {
        errors.push('Entry rules must be an array');
      } else if (entryRules.length === 0) {
        errors.push('Strategy must have at least one entry rule');
      } else {
        entryRules.forEach((rule, index) => {
          const ruleErrors = this.validateEntryRule(rule, index);
          errors.push(...ruleErrors);
        });
      }
    }

    // Validate exit rules
    if (exitRules) {
      if (!Array.isArray(exitRules)) {
        errors.push('Exit rules must be an array');
      } else if (exitRules.length === 0) {
        errors.push('Strategy must have at least one exit rule');
      } else {
        exitRules.forEach((rule, index) => {
          const ruleErrors = this.validateExitRule(rule, index);
          errors.push(...ruleErrors);
        });
      }
    }

    // Validate legacy rules (for backward compatibility)
    if (rules && rules.length > 0) {
      rules.forEach((rule, index) => {
        const ruleErrors = this.validateRule(rule, index);
        errors.push(...ruleErrors);
      });
    }

    // Validate risk management
    if (riskManagement) {
      const riskErrors = this.validateRiskManagement(riskManagement);
      errors.push(...riskErrors);
    }

    // Validate execution settings
    if (executionSettings) {
      const executionErrors = this.validateExecutionSettings(executionSettings);
      errors.push(...executionErrors);
    }

    // Check for conflicting rules
    if (hasNewStructure) {
      const conflictErrors = this.checkForConflicts(entryRules, exitRules);
      errors.push(...conflictErrors);
    } else if (hasLegacyRules) {
      const conflictErrors = this.checkForConflicts(rules);
      errors.push(...conflictErrors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateRule(rule, index) {
    const errors = [];
    const prefix = `Rule ${index + 1}:`;

    // Validate rule structure
    if (!rule.name || rule.name.trim() === '') {
      errors.push(`${prefix} Rule name is required`);
    }

    if (!rule.conditions || !Array.isArray(rule.conditions) || rule.conditions.length === 0) {
      errors.push(`${prefix} Rule must have at least one condition`);
    } else {
      rule.conditions.forEach((condition, condIndex) => {
        const condErrors = this.validateCondition(condition, index, condIndex);
        errors.push(...condErrors);
      });
    }

    if (!rule.action) {
      errors.push(`${prefix} Rule must have an action`);
    } else {
      const actionErrors = this.validateAction(rule.action, index);
      errors.push(...actionErrors);
    }

    // Validate logical operator for multiple conditions
    if (rule.conditions && rule.conditions.length > 1) {
      if (!rule.logicalOperator || !['AND', 'OR'].includes(rule.logicalOperator)) {
        errors.push(`${prefix} Invalid logical operator. Must be 'AND' or 'OR'`);
      }
    }

    return errors;
  }

  validateCondition(condition, ruleIndex, condIndex) {
    const errors = [];
    const prefix = `Rule ${ruleIndex + 1}, Condition ${condIndex + 1}:`;

    const validIndicators = ['price', 'sma', 'ema', 'rsi', 'macd', 'bollinger_bands', 'volume'];
    const validOperators = ['>', '<', '>=', '<=', '==', 'crosses_above', 'crosses_below'];
    const validTimeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];

    if (!validIndicators.includes(condition.indicator)) {
      errors.push(`${prefix} Invalid indicator '${condition.indicator}'`);
    }

    if (!validOperators.includes(condition.operator)) {
      errors.push(`${prefix} Invalid operator '${condition.operator}'`);
    }

    if (condition.value === undefined || condition.value === null) {
      errors.push(`${prefix} Condition value is required`);
    }

    if (condition.timeframe && !validTimeframes.includes(condition.timeframe)) {
      errors.push(`${prefix} Invalid timeframe '${condition.timeframe}'`);
    }

    // Validate specific indicator parameters
    if (condition.indicator === 'rsi' && typeof condition.value === 'number') {
      if (condition.value < 0 || condition.value > 100) {
        errors.push(`${prefix} RSI value must be between 0 and 100`);
      }
    }

    if (['sma', 'ema'].includes(condition.indicator) && condition.params) {
      if (!condition.params.period || condition.params.period < 1 || condition.params.period > 200) {
        errors.push(`${prefix} Moving average period must be between 1 and 200`);
      }
    }

    return errors;
  }

  validateAction(action, ruleIndex) {
    const errors = [];
    const prefix = `Rule ${ruleIndex + 1}, Action:`;

    const validActionTypes = ['buy', 'sell', 'hold'];
    const validQuantities = ['all', 'half', 'custom'];

    if (!validActionTypes.includes(action.type)) {
      errors.push(`${prefix} Invalid action type '${action.type}'`);
    }

    if (!validQuantities.includes(action.quantity)) {
      errors.push(`${prefix} Invalid quantity type '${action.quantity}'`);
    }

    if (action.quantity === 'custom') {
      if (!action.customQuantity || action.customQuantity <= 0) {
        errors.push(`${prefix} Custom quantity must be greater than 0`);
      }
    }

    if (action.stopLoss !== undefined) {
      if (action.stopLoss < 0 || action.stopLoss > 100) {
        errors.push(`${prefix} Stop loss must be between 0 and 100 percent`);
      }
    }

    if (action.takeProfit !== undefined && action.takeProfit <= 0) {
      errors.push(`${prefix} Take profit must be greater than 0`);
    }

    return errors;
  }

  validateEntryRule(rule, index) {
    const errors = [];
    const prefix = `Entry Rule ${index + 1}:`;

    // Validate rule structure
    if (!rule.name || rule.name.trim() === '') {
      errors.push(`${prefix} Rule name is required`);
    }

    if (!rule.conditions || !Array.isArray(rule.conditions) || rule.conditions.length === 0) {
      errors.push(`${prefix} Rule must have at least one condition`);
    } else {
      rule.conditions.forEach((condition, condIndex) => {
        const condErrors = this.validateCondition(condition, index, condIndex);
        errors.push(...condErrors);
      });
    }

    if (!rule.action) {
      errors.push(`${prefix} Rule must have an action`);
    } else {
      const actionErrors = this.validateEntryAction(rule.action, index);
      errors.push(...actionErrors);
    }

    // Validate logical operator for multiple conditions
    if (rule.conditions && rule.conditions.length > 1) {
      if (!rule.logicalOperator || !['AND', 'OR'].includes(rule.logicalOperator)) {
        errors.push(`${prefix} Invalid logical operator. Must be 'AND' or 'OR'`);
      }
    }

    return errors;
  }

  validateExitRule(rule, index) {
    const errors = [];
    const prefix = `Exit Rule ${index + 1}:`;

    // Validate rule structure
    if (!rule.name || rule.name.trim() === '') {
      errors.push(`${prefix} Rule name is required`);
    }

    if (!rule.conditions || !Array.isArray(rule.conditions) || rule.conditions.length === 0) {
      errors.push(`${prefix} Rule must have at least one condition`);
    } else {
      rule.conditions.forEach((condition, condIndex) => {
        const condErrors = this.validateCondition(condition, index, condIndex);
        errors.push(...condErrors);
      });
    }

    if (!rule.action) {
      errors.push(`${prefix} Rule must have an action`);
    } else {
      const actionErrors = this.validateExitAction(rule.action, index);
      errors.push(...actionErrors);
    }

    // Validate logical operator for multiple conditions
    if (rule.conditions && rule.conditions.length > 1) {
      if (!rule.logicalOperator || !['AND', 'OR'].includes(rule.logicalOperator)) {
        errors.push(`${prefix} Invalid logical operator. Must be 'AND' or 'OR'`);
      }
    }

    return errors;
  }

  validateEntryAction(action, ruleIndex) {
    const errors = [];
    const prefix = `Entry Rule ${ruleIndex + 1}, Action:`;

    if (action.type !== 'buy') {
      errors.push(`${prefix} Entry rule action must be 'buy'`);
    }

    const validQuantities = ['all', 'half', 'custom'];
    if (!validQuantities.includes(action.quantity)) {
      errors.push(`${prefix} Invalid quantity type '${action.quantity}'`);
    }

    if (action.quantity === 'custom') {
      if (!action.customQuantity || action.customQuantity <= 0) {
        errors.push(`${prefix} Custom quantity must be greater than 0`);
      }
    }

    if (action.stopLoss !== undefined) {
      if (action.stopLoss < 0 || action.stopLoss > 100) {
        errors.push(`${prefix} Stop loss must be between 0 and 100 percent`);
      }
    }

    if (action.takeProfit !== undefined && action.takeProfit <= 0) {
      errors.push(`${prefix} Take profit must be greater than 0`);
    }

    return errors;
  }

  validateExitAction(action, ruleIndex) {
    const errors = [];
    const prefix = `Exit Rule ${ruleIndex + 1}, Action:`;

    if (action.type !== 'sell') {
      errors.push(`${prefix} Exit rule action must be 'sell'`);
    }

    const validQuantities = ['all', 'half', 'custom'];
    if (!validQuantities.includes(action.quantity)) {
      errors.push(`${prefix} Invalid quantity type '${action.quantity}'`);
    }

    if (action.quantity === 'custom') {
      if (!action.customQuantity || action.customQuantity <= 0) {
        errors.push(`${prefix} Custom quantity must be greater than 0`);
      }
    }

    return errors;
  }

  validateExecutionSettings(executionSettings) {
    const errors = [];

    if (executionSettings.allowMultiplePositions !== undefined) {
      if (typeof executionSettings.allowMultiplePositions !== 'boolean') {
        errors.push('allowMultiplePositions must be a boolean');
      }
    }

    if (executionSettings.maxConcurrentPositions !== undefined) {
      if (typeof executionSettings.maxConcurrentPositions !== 'number' || 
          executionSettings.maxConcurrentPositions < 1 || 
          executionSettings.maxConcurrentPositions > 10) {
        errors.push('maxConcurrentPositions must be a number between 1 and 10');
      }
    }

    if (executionSettings.requireExitBeforeEntry !== undefined) {
      if (typeof executionSettings.requireExitBeforeEntry !== 'boolean') {
        errors.push('requireExitBeforeEntry must be a boolean');
      }
    }

    return errors;
  }

  validateRiskManagement(riskManagement) {
    const errors = [];

    if (riskManagement.maxPositionSize) {
      if (riskManagement.maxPositionSize < 1 || riskManagement.maxPositionSize > 100) {
        errors.push('Max position size must be between 1 and 100 percent');
      }
    }

    if (riskManagement.maxDailyLoss) {
      if (riskManagement.maxDailyLoss < 1 || riskManagement.maxDailyLoss > 20) {
        errors.push('Max daily loss must be between 1 and 20 percent');
      }
    }

    return errors;
  }

  checkForConflicts(entryRules, exitRules) {
    const errors = [];
    
    // Handle legacy rules
    if (Array.isArray(entryRules) && !Array.isArray(exitRules)) {
      return this.checkForConflictsLegacy(entryRules);
    }

    // Check for conflicts within entry rules
    if (entryRules && entryRules.length > 1) {
      for (let i = 0; i < entryRules.length; i++) {
        for (let j = i + 1; j < entryRules.length; j++) {
          const rule1 = entryRules[i];
          const rule2 = entryRules[j];

          if (this.rulesHaveIdenticalConditions(rule1, rule2)) {
            errors.push(`Conflict detected between entry rules "${rule1.name}" and "${rule2.name}" - identical conditions`);
          }
        }
      }
    }

    // Check for conflicts within exit rules
    if (exitRules && exitRules.length > 1) {
      for (let i = 0; i < exitRules.length; i++) {
        for (let j = i + 1; j < exitRules.length; j++) {
          const rule1 = exitRules[i];
          const rule2 = exitRules[j];

          if (this.rulesHaveIdenticalConditions(rule1, rule2)) {
            errors.push(`Conflict detected between exit rules "${rule1.name}" and "${rule2.name}" - identical conditions`);
          }
        }
      }
    }

    // Check for conflicting entry and exit rules with identical conditions
    if (entryRules && exitRules) {
      for (const entryRule of entryRules) {
        for (const exitRule of exitRules) {
          if (this.rulesHaveIdenticalConditions(entryRule, exitRule)) {
            errors.push(`Warning: Entry rule "${entryRule.name}" and exit rule "${exitRule.name}" have identical conditions - this may cause rapid entry/exit cycles`);
          }
        }
      }
    }

    return errors;
  }

  checkForConflictsLegacy(rules) {
    const errors = [];
    
    if (!rules || rules.length < 2) return errors;

    // Check for conflicting buy/sell rules with identical conditions
    for (let i = 0; i < rules.length; i++) {
      for (let j = i + 1; j < rules.length; j++) {
        const rule1 = rules[i];
        const rule2 = rules[j];

        // Only flag as conflict if rules have identical conditions but opposing actions
        if (this.rulesHaveIdenticalConditions(rule1, rule2)) {
          if (rule1.action.type !== rule2.action.type && 
              ['buy', 'sell'].includes(rule1.action.type) && 
              ['buy', 'sell'].includes(rule2.action.type)) {
            errors.push(`Conflict detected between "${rule1.name}" and "${rule2.name}" - identical conditions with opposing actions`);
          }
        }
      }
    }

    return errors;
  }

  // Check if rules have identical conditions (same indicator, operator, value, timeframe)
  rulesHaveIdenticalConditions(rule1, rule2) {
    if (rule1.conditions.length !== rule2.conditions.length) return false;

    for (let i = 0; i < rule1.conditions.length; i++) {
      const cond1 = rule1.conditions[i];
      const cond2 = rule2.conditions[i];
      
      // Check if indicators match
      if (cond1.indicator !== cond2.indicator) return false;
      
      // Check if operators match
      if (cond1.operator !== cond2.operator) return false;
      
      // Check if values match exactly
      if (JSON.stringify(cond1.value) !== JSON.stringify(cond2.value)) return false;
      
      // Check if timeframes match
      if (cond1.timeframe !== cond2.timeframe) return false;
    }

    return true;
  }

  rulesHaveSimilarConditions(rule1, rule2) {
    if (rule1.conditions.length !== rule2.conditions.length) return false;

    // More sophisticated similarity check
    // Rules are only similar if they have the same indicators, operators, AND values
    for (let i = 0; i < rule1.conditions.length; i++) {
      const cond1 = rule1.conditions[i];
      const cond2 = rule2.conditions[i];
      
      // Check if indicators match
      if (cond1.indicator !== cond2.indicator) return false;
      
      // Check if operators match
      if (cond1.operator !== cond2.operator) return false;
      
      // Check if values match (for simple values)
      if (typeof cond1.value === 'number' && typeof cond2.value === 'number') {
        if (Math.abs(cond1.value - cond2.value) > 0.001) return false;
      } else if (typeof cond1.value === 'string' && typeof cond2.value === 'string') {
        if (cond1.value !== cond2.value) return false;
      } else if (typeof cond1.value === 'object' && typeof cond2.value === 'object') {
        // For complex values (like indicator references), check if they're the same
        if (JSON.stringify(cond1.value) !== JSON.stringify(cond2.value)) return false;
      } else {
        return false;
      }
      
      // Check if timeframes match
      if (cond1.timeframe !== cond2.timeframe) return false;
    }

    return true;
  }

  // Validate strategy before backtesting
  validateForBacktest(strategy, marketData) {
    const errors = [];

    if (!marketData || marketData.length === 0) {
      errors.push('Market data is required for backtesting');
    }

    if (marketData && marketData.length < 30) {
      errors.push('Insufficient market data for reliable backtesting (minimum 30 data points required)');
    }

    // Check if strategy has any executable rules
    const executableRules = strategy.rules.filter(rule => rule.isActive);
    if (executableRules.length === 0) {
      errors.push('Strategy must have at least one active rule');
    }

    // Validate that all indicators used in strategy can be calculated with available data
    const requiredDataPoints = this.calculateMinimumDataPoints(strategy.rules);
    if (marketData && marketData.length < requiredDataPoints) {
      errors.push(`Strategy requires at least ${requiredDataPoints} data points, but only ${marketData.length} available`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  calculateMinimumDataPoints(rules) {
    let maxRequired = 20; // Default minimum

    rules.forEach(rule => {
      rule.conditions.forEach(condition => {
        if (condition.indicator === 'sma' || condition.indicator === 'ema') {
          const period = condition.params?.period || 20;
          maxRequired = Math.max(maxRequired, period + 10);
        }
        if (condition.indicator === 'rsi') {
          const period = condition.params?.period || 14;
          maxRequired = Math.max(maxRequired, period + 10);
        }
        if (condition.indicator === 'macd') {
          const slow = condition.params?.slow || 26;
          maxRequired = Math.max(maxRequired, slow + 20);
        }
      });
    });

    return maxRequired;
  }
}

const validationService = new ValidationService();

export const validateStrategy = validationService.validateStrategy.bind(validationService);
export const validateRule = validationService.validateRule.bind(validationService);
export const validateEntryRule = validationService.validateEntryRule.bind(validationService);
export const validateExitRule = validationService.validateExitRule.bind(validationService);
export const validateCondition = validationService.validateCondition.bind(validationService);
export const validateAction = validationService.validateAction.bind(validationService);
export const validateEntryAction = validationService.validateEntryAction.bind(validationService);
export const validateExitAction = validationService.validateExitAction.bind(validationService);
export const validateExecutionSettings = validationService.validateExecutionSettings.bind(validationService);
export const validateRiskManagement = validationService.validateRiskManagement.bind(validationService);
export const checkForConflicts = validationService.checkForConflicts.bind(validationService);
export const checkForConflictsLegacy = validationService.checkForConflictsLegacy.bind(validationService);
export const rulesHaveSimilarConditions = validationService.rulesHaveSimilarConditions.bind(validationService);
export const validateForBacktest = validationService.validateForBacktest.bind(validationService);
export const calculateMinimumDataPoints = validationService.calculateMinimumDataPoints.bind(validationService);

export default validationService;