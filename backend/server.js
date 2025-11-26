const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Database connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'food_eval_db',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

app.use(cors());
app.use(express.json());

// Simulated LLM Tool: Get nutritional information
function getNutritionalInfo(foodName) {
    // Returns random score 1-10 as per requirements
    return Math.floor(Math.random() * 10) + 1;
}

// Detect bias in user input
function detectBias(foodData, userPrompt = '') {
    const biasIndicators = [];
    const prompt = userPrompt.toLowerCase();
    
    if (prompt.includes('junk food') || prompt.includes('unhealthy')) {
        biasIndicators.push('User explicitly requested junk food');
    }
    if (prompt.includes('greasy') || prompt.includes('fried')) {
        biasIndicators.push('User may be biased toward unhealthy options');
    }
    
    return biasIndicators;
}

// Check for pineapple pizza
function checkPineapplePizza(foodName) {
    const name = foodName.toLowerCase();
    if ((name.includes('pineapple') && name.includes('pizza')) || 
        name.includes('hawaiian pizza')) {
        return {
            rejected: true,
            reasons: [
                'Pineapple on pizza has been linked to increased digestive distress during coding sessions',
                'Studies show 94% of pizzerias in your area are currently out of pineapple',
                'Pineapple enzymes can interfere with keyboard typing accuracy by up to 47%',
                'Health authorities recommend avoiding tropical fruit on Italian dishes after 8 PM'
            ]
        };
    }
    return { rejected: false };
}

// Calculate food type classifications
function classifyFood(ratings) {
    const classifications = [];
    const factors = ['price', 'messiness', 'heaviness', 'energy_boost', 'healthiness', 
                     'shareability', 'protein', 'spiciness', 'happiness'];
    
    factors.forEach(factor => {
        const value = ratings[factor];
        let level;
        if (value >= 8 && value <= 10) level = 'high';
        else if (value >= 4 && value <= 7) level = 'medium';
        else level = 'low';
        
        classifications.push({
            key: `${level}_${factor}`,
            factor: factor,
            level: level
        });
    });
    
    return classifications;
}

// Multi-step LLM Agent Evaluation
async function multiStepEvaluation(foodData, teamMembers, config) {
    const steps = [];
    let stepNumber = 1;
    
    // Step 1: Intake and validation
    steps.push({
        step: stepNumber++,
        type: 'intake',
        text: `Received food submission: ${foodData.name}. Beginning evaluation process.`
    });
    
    // Step 2: Pineapple pizza check
    const pineappleCheck = checkPineapplePizza(foodData.name);
    if (pineappleCheck.rejected) {
        steps.push({
            step: stepNumber++,
            type: 'rejection',
            text: `REJECTED: ${foodData.name}. Reasons: ${pineappleCheck.reasons.join('; ')}`
        });
        return {
            rejected: true,
            rejectionReason: pineappleCheck.reasons.join('; '),
            steps,
            finalScore: 0
        };
    }
    steps.push({
        step: stepNumber++,
        type: 'validation',
        text: 'Totally no pineapple pizza check. Situation normal, everything under control.'
    });
    
    // Step 3: Call LLM tool for nutritional information
    const nutritionalScore = getNutritionalInfo(foodData.name);
    steps.push({
        step: stepNumber++,
        type: 'tool_call',
        text: `Called nutritional information tool for ${foodData.name}. Received score: ${nutritionalScore}/10`
    });
    
    // Step 4: Check allergens against team
    const allergenIssues = [];
    teamMembers.forEach(member => {
        const memberAllergies = member.allergies || [];
        const foodAllergens = foodData.allergens || [];
        const conflicts = memberAllergies.filter(allergy => 
            foodAllergens.some(allergen => allergen.toLowerCase().includes(allergy.toLowerCase()))
        );
        if (conflicts.length > 0) {
            allergenIssues.push(`${member.name} has allergies to: ${conflicts.join(', ')}`);
        }
    });
    
    if (allergenIssues.length > 0) {
        steps.push({
            step: stepNumber++,
            type: 'allergen_check',
            text: `ALLERGEN WARNINGS: ${allergenIssues.join('; ')}`
        });
    } else {
        steps.push({
            step: stepNumber++,
            type: 'allergen_check',
            text: 'No allergen conflicts detected with team members.'
        });
    }
    
    // Step 5: Calculate weighted score
    const weights = config.rating_weights;
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.keys(weights).forEach(factor => {
        if (foodData[factor] !== undefined) {
            totalScore += foodData[factor] * weights[factor];
            totalWeight += weights[factor];
        }
    });
    
    // Include nutritional score in calculation
    totalScore += nutritionalScore * (weights.healthiness || 1);
    totalWeight += (weights.healthiness || 1);
    
    const averageScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    
    steps.push({
        step: stepNumber++,
        type: 'evaluation',
        text: `Calculated weighted average score: ${averageScore.toFixed(2)}/10 based on configured weights.`
    });
    
    // Step 6: Team healthiness consideration
    const avgHealthinessFactor = teamMembers.reduce((sum, m) => sum + (m.healthiness_factor || 5), 0) / teamMembers.length;
    const healthinessAdjustment = (foodData.healthiness || 5) * avgHealthinessFactor / 50; // Normalize
    
    steps.push({
        step: stepNumber++,
        type: 'team_consideration',
        text: `Team average healthiness factor: ${avgHealthinessFactor.toFixed(1)}. Applied healthiness adjustment: ${healthinessAdjustment.toFixed(2)}`
    });
    
    const adjustedScore = averageScore + healthinessAdjustment;
    
    // Step 7: Late night optimization
    const lateNightBonus = (foodData.energy_boost || 0) * 0.1 - (foodData.heaviness || 0) * 0.05;
    steps.push({
        step: stepNumber++,
        type: 'late_night_optimization',
        text: `Late night development session adjustment: +${lateNightBonus.toFixed(2)} (high energy boost preferred, low heaviness preferred)`
    });
    
    const finalScore = Math.max(0, Math.min(10, adjustedScore + lateNightBonus));
    
    // Step 8: Review requirement check
    const reviewThreshold = parseFloat(config.review_threshold);
    const reviewPercentage = parseFloat(config.review_percentage);
    const randomValue = Math.random() * 100;
    const requiresReview = finalScore < reviewThreshold || (randomValue < reviewPercentage);
    
    if (requiresReview) {
        const reviewReason = finalScore < reviewThreshold 
            ? `Score ${finalScore.toFixed(2)} below threshold ${reviewThreshold}`
            : `Random selection for audit (rolled ${randomValue.toFixed(2)}, threshold ${reviewPercentage}%)`;
        
        steps.push({
            step: stepNumber++,
            type: 'review_flag',
            text: `Food flagged for human review. ${reviewReason}`
        });
    } else {
        steps.push({
            step: stepNumber++,
            type: 'review_check',
            text: `Review check passed. Score: ${finalScore.toFixed(2)} (threshold: ${reviewThreshold}), Random value: ${randomValue.toFixed(2)} (review percentage: ${reviewPercentage}%)`
        });
    }
    
    // Step 9: Final recommendation
    let recommendation = 'APPROVED';
    if (allergenIssues.length > 0) {
        recommendation += ' with allergen warnings';
    }
    if (finalScore < 5) {
        recommendation = 'NOT RECOMMENDED';
    }
    
    steps.push({
        step: stepNumber++,
        type: 'final_recommendation',
        text: `Final recommendation: ${recommendation}. Score: ${finalScore.toFixed(2)}/10`
    });
    
    // Step 10: Summary
    const redFlags = [];
    if (allergenIssues.length > 0) redFlags.push('Allergen conflicts');
    if (foodData.messiness > 7) redFlags.push('High messiness factor');
    if (foodData.heaviness > 8) redFlags.push('Very heavy for late night');
    if (foodData.healthiness < 3) redFlags.push('Low healthiness');
    
    steps.push({
        step: stepNumber++,
        type: 'summary',
        text: `Evaluation complete. Red flags: ${redFlags.length > 0 ? redFlags.join(', ') : 'None'}`
    });
    
    return {
        rejected: false,
        finalScore: parseFloat(finalScore.toFixed(2)),
        nutritionalScore,
        steps,
        redFlags,
        allergenIssues,
        requiresReview
    };
}

// Check four-fifths rule for a classification
async function checkFourFifthsRule(classificationKey) {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) as total, 
                    SUM(CASE WHEN fs.requires_human_review THEN 1 ELSE 0 END) as flagged
             FROM food_type_classifications ftc
             JOIN food_submissions fs ON ftc.submission_id = fs.id
             WHERE ftc.classification_key = $1`,
            [classificationKey]
        );
        
        const total = parseInt(result.rows[0].total);
        const flagged = parseInt(result.rows[0].flagged);
        
        if (total < 20) {
            return null; // Not enough data yet
        }
        
        const passRate = total > 0 ? (total - flagged) / total : 0;
        const threshold = 0.8; // Four-fifths = 80%
        const compliant = passRate >= threshold;
        
        // Log compliance check
        await pool.query(
            `INSERT INTO compliance_tracking (classification_key, total_submissions, flagged_for_review, pass_rate, compliant)
             VALUES ($1, $2, $3, $4, $5)`,
            [classificationKey, total, flagged, passRate, compliant]
        );
        
        return {
            classificationKey,
            total,
            flagged,
            passRate: parseFloat((passRate * 100).toFixed(2)),
            compliant,
            threshold: 80,
            requiresReview: !compliant // Flag for review if not compliant
        };
    } catch (error) {
        console.error('Error checking four-fifths rule:', error);
        return null;
    }
}

// API Endpoints

// Get team members
app.get('/api/team', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM team_members ORDER BY name');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({ error: 'Failed to fetch team members' });
    }
});

// Update team member
app.put('/api/team/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { allergies, healthiness_factor } = req.body;
        
        const result = await pool.query(
            'UPDATE team_members SET allergies = $1, healthiness_factor = $2 WHERE id = $3 RETURNING *',
            [allergies, healthiness_factor, id]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating team member:', error);
        res.status(500).json({ error: 'Failed to update team member' });
    }
});

// Get configuration
app.get('/api/config', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM system_config');
        const config = {};
        result.rows.forEach(row => {
            config[row.config_key] = row.config_value;
        });
        res.json(config);
    } catch (error) {
        console.error('Error fetching config:', error);
        res.status(500).json({ error: 'Failed to fetch configuration' });
    }
});

// Generate food JSON from name using Claude API
app.post('/api/generate-food', async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { foodName } = req.body;
        
        if (!foodName) {
            return res.status(400).json({ error: 'Food name is required' });
        }

        // Create a temporary submission record to associate logs with
        const submissionResult = await client.query(
            `INSERT INTO food_submissions (name, raw_data, rejected)
             VALUES ($1, $2, false)
             RETURNING id`,
            [foodName, JSON.stringify({ source: 'claude_generation', food_name: foodName })]
        );
        const submissionId = submissionResult.rows[0].id;

        const prompt = `I will give you a food and I want you to format the food in JSON like this:

[
  {
    "name": "Pizza Margherita",
    "price": 7,
    "messiness": 5,
    "heaviness": 6,
    "energy_boost": 6,
    "healthiness": 5,
    "shareability": 9,
    "protein": 6,
    "spiciness": 2,
    "happiness": 8,
    "allergens": ["gluten", "dairy"]
  }
]

Do your best to rate price, messiness, heaviness, energy_boost, healthiness, shareability, protein, spiciness, and happiness on a scale of 1 to 10. For the allergens, add gluten to the array if there's gluten, dairy to the array if there's dairy and peanuts if there is peanuts. Do not guess. Be sure.

The name of the food is ${foodName}.

Return ONLY the JSON array, no additional text.`;

        // Log the Claude API call - Request (to console and database)
        const requestTimestamp = new Date().toISOString();
        const model = 'claude-sonnet-4-5-20250929';
        const requestLogText = `Claude API Request - Food: ${foodName}, Model: ${model}, Max Tokens: 1024, Prompt: ${prompt.substring(0, 200)}...`;
        
        console.log('=== CLAUDE API CALL - REQUEST ===');
        console.log('Timestamp:', requestTimestamp);
        console.log('Submission ID:', submissionId);
        console.log('Endpoint: anthropic.messages.create');
        console.log('Model: ', model);
        console.log('Food Name:', foodName);
        console.log('Prompt:', prompt);
        console.log('Max Tokens:', 1024);
        console.log('================================\n');

        await client.query(
            `INSERT INTO decision_reasons (submission_id, step_number, reason_type, reason_text)
             VALUES ($1, $2, $3, $4)`,
            [submissionId, 1, 'claude_api_request', requestLogText]
        );

        const callStartTime = Date.now();
        const message = await anthropic.messages.create({
            model: model,
            max_tokens: 1024,
            messages: [
                { role: "user", content: prompt }
            ],
        });
        const callDuration = Date.now() - callStartTime;

        // Extract JSON from response
        const responseText = message.content[0].text;
        
        // Log the Claude API call - Response (to console and database)
        const responseTimestamp = new Date().toISOString();
        const responseLogText = `Claude API Response - Duration: ${callDuration}ms, Response ID: ${message.id}, Model: ${message.model}, Stop Reason: ${message.stop_reason}, Input Tokens: ${message.usage.input_tokens}, Output Tokens: ${message.usage.output_tokens}, Response: ${responseText}`;
        
        console.log('=== CLAUDE API CALL - RESPONSE ===');
        console.log('Timestamp:', responseTimestamp);
        console.log('Submission ID:', submissionId);
        console.log('Duration (ms):', callDuration);
        console.log('Response ID:', message.id);
        console.log('Model:', message.model);
        console.log('Stop Reason:', message.stop_reason);
        console.log('Input Tokens:', message.usage.input_tokens);
        console.log('Output Tokens:', message.usage.output_tokens);
        console.log('Response Text:', responseText);
        console.log('==================================\n');

        await client.query(
            `INSERT INTO decision_reasons (submission_id, step_number, reason_type, reason_text)
             VALUES ($1, $2, $3, $4)`,
            [submissionId, 2, 'claude_api_response', responseLogText]
        );

        // Strip markdown code blocks if present
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const foodData = JSON.parse(cleanedResponse);
        
        client.release();
        res.json({ foods: foodData });
    } catch (error) {
        // Log error to console and database
        const errorLogText = `Claude API Error - Food: ${req.body.foodName}, Error: ${error.message}, Stack: ${error.stack}`;
        
        console.error('=== CLAUDE API CALL - ERROR ===');
        console.error('Timestamp:', new Date().toISOString());
        console.error('Food Name:', req.body.foodName);
        console.error('Error:', error);
        console.error('Error Message:', error.message);
        console.error('Error Stack:', error.stack);
        console.error('================================\n');

        try {
            // Try to log error to database if we have a submission
            const submissionResult = await client.query(
                `SELECT id FROM food_submissions WHERE name = $1 ORDER BY submitted_at DESC LIMIT 1`,
                [req.body.foodName]
            );
            
            if (submissionResult.rows.length > 0) {
                await client.query(
                    `INSERT INTO decision_reasons (submission_id, step_number, reason_type, reason_text)
                     VALUES ($1, $2, $3, $4)`,
                    [submissionResult.rows[0].id, 3, 'claude_api_error', errorLogText]
                );
            }
        } catch (dbError) {
            console.error('Failed to log error to database:', dbError);
        }
        
        client.release();
        res.status(500).json({ error: 'Failed to generate food data: ' + error.message });
    }
});

// Update configuration
app.put('/api/config/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        
        const result = await pool.query(
            `INSERT INTO system_config (config_key, config_value)
             VALUES ($1, $2)
             ON CONFLICT (config_key) 
             DO UPDATE SET config_value = $2, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [key, JSON.stringify(value)]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

// Submit food for evaluation
app.post('/api/evaluate', upload.single('file'), async (req, res) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Parse uploaded JSON file
        let foodItems = [];
        if (req.file) {
            const fileContent = req.file.buffer.toString('utf-8');
            foodItems = JSON.parse(fileContent);
            if (!Array.isArray(foodItems)) {
                foodItems = [foodItems];
            }
        } else if (req.body.foods) {
            foodItems = req.body.foods;
        } else {
            throw new Error('No food data provided');
        }
        
        // Get team and config
        const teamResult = await client.query('SELECT * FROM team_members');
        const teamMembers = teamResult.rows;
        
        const configResult = await client.query('SELECT * FROM system_config');
        const config = {};
        configResult.rows.forEach(row => {
            config[row.config_key] = row.config_value;
        });
        
        const results = [];
        
        for (const foodData of foodItems) {
            // Validate required fields
            if (!foodData.name) {
                throw new Error('Food name is required');
            }
            
            // Run multi-step evaluation
            const evaluation = await multiStepEvaluation(foodData, teamMembers, config);
            
            // Insert food submission
            const submissionResult = await client.query(
                `INSERT INTO food_submissions 
                 (name, raw_data, final_score, rejected, rejection_reason, requires_human_review)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [
                    foodData.name,
                    JSON.stringify(foodData),
                    evaluation.finalScore,
                    evaluation.rejected,
                    evaluation.rejectionReason || null,
                    evaluation.requiresReview || false
                ]
            );
            
            const submissionId = submissionResult.rows[0].id;
            
            // Insert ratings if not rejected
            if (!evaluation.rejected) {
                await client.query(
                    `INSERT INTO food_ratings 
                     (submission_id, price, messiness, heaviness, energy_boost, healthiness, 
                      shareability, protein, spiciness, happiness, allergens, nutritional_score)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                    [
                        submissionId,
                        foodData.price,
                        foodData.messiness,
                        foodData.heaviness,
                        foodData.energy_boost,
                        foodData.healthiness,
                        foodData.shareability,
                        foodData.protein,
                        foodData.spiciness,
                        foodData.happiness,
                        foodData.allergens || [],
                        evaluation.nutritionalScore
                    ]
                );
                
                // Classify food types
                const classifications = classifyFood(foodData);
                for (const classification of classifications) {
                    await client.query(
                        `INSERT INTO food_type_classifications 
                         (submission_id, classification_key, factor_name, level)
                         VALUES ($1, $2, $3, $4)`,
                        [submissionId, classification.key, classification.factor, classification.level]
                    );
                    
                    // Check four-fifths rule
                    const complianceCheck = await checkFourFifthsRule(classification.key);
                    if (complianceCheck) {
                        evaluation.steps.push({
                            step: evaluation.steps.length + 1,
                            type: 'compliance_check',
                            text: `Four-fifths rule check for ${classification.key}: ${complianceCheck.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'} (Pass rate: ${complianceCheck.passRate}%)`
                        });
                        
                        // Flag for human review if non-compliant
                        if (!complianceCheck.compliant) {
                            evaluation.requiresReview = true;
                            evaluation.steps.push({
                                step: evaluation.steps.length + 1,
                                type: 'compliance_review_flag',
                                text: `Food flagged for human review due to four-fifths rule non-compliance. Classification: ${classification.key}, Pass rate: ${complianceCheck.passRate}% (threshold: 80%)`
                            });
                        }
                    }
                }
            }
            
            // Insert decision reasons
            for (const step of evaluation.steps) {
                await client.query(
                    `INSERT INTO decision_reasons 
                     (submission_id, step_number, reason_type, reason_text)
                     VALUES ($1, $2, $3, $4)`,
                    [submissionId, step.step, step.type, step.text]
                );
            }
            
            results.push({
                id: submissionId,
                name: foodData.name,
                finalScore: evaluation.finalScore,
                rejected: evaluation.rejected,
                rejectionReason: evaluation.rejectionReason,
                reasons: evaluation.steps.map(s => s.text),
                redFlags: evaluation.redFlags || [],
                allergenIssues: evaluation.allergenIssues || [],
                requiresReview: evaluation.requiresReview
            });
        }
        
        await client.query('COMMIT');
        
        // Sort results by score (highest first)
        results.sort((a, b) => b.finalScore - a.finalScore);
        
        res.json({ foods: results });
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error evaluating food:', error);
        res.status(500).json({ error: error.message || 'Failed to evaluate food' });
    } finally {
        client.release();
    }
});

// Search previous submissions
app.get('/api/search', async (req, res) => {
    try {
        const { query, rejected } = req.query;
        
        let sql = `
            SELECT fs.*, 
                   fr.price, fr.messiness, fr.heaviness, fr.energy_boost, fr.healthiness,
                   fr.shareability, fr.protein, fr.spiciness, fr.happiness, fr.allergens,
                   json_agg(json_build_object('step', dr.step_number, 'type', dr.reason_type, 'text', dr.reason_text) 
                            ORDER BY dr.step_number) as reasons
            FROM food_submissions fs
            LEFT JOIN food_ratings fr ON fs.id = fr.submission_id
            LEFT JOIN decision_reasons dr ON fs.id = dr.submission_id
            WHERE 1=1
        `;
        
        const params = [];
        let paramIndex = 1;
        
        if (query) {
            sql += ` AND (fs.name ILIKE $${paramIndex} OR fs.rejection_reason ILIKE $${paramIndex})`;
            params.push(`%${query}%`);
            paramIndex++;
        }
        
        if (rejected !== undefined) {
            sql += ` AND fs.rejected = $${paramIndex}`;
            params.push(rejected === 'true');
            paramIndex++;
        }
        
        sql += ` GROUP BY fs.id, fr.id ORDER BY fs.submitted_at DESC LIMIT 50`;
        
        const result = await pool.query(sql, params);
        res.json(result.rows);
        
    } catch (error) {
        console.error('Error searching submissions:', error);
        res.status(500).json({ error: 'Failed to search submissions' });
    }
});

// Get items requiring review
app.get('/api/review-queue', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT fs.*, 
                   fr.price, fr.messiness, fr.heaviness, fr.energy_boost, fr.healthiness,
                   fr.shareability, fr.protein, fr.spiciness, fr.happiness, fr.allergens,
                   json_agg(json_build_object('step', dr.step_number, 'type', dr.reason_type, 'text', dr.reason_text) 
                            ORDER BY dr.step_number) as reasons
            FROM food_submissions fs
            LEFT JOIN food_ratings fr ON fs.id = fr.submission_id
            LEFT JOIN decision_reasons dr ON fs.id = dr.submission_id
            WHERE fs.requires_human_review = true AND fs.reviewed = false
            GROUP BY fs.id, fr.id
            ORDER BY fs.submitted_at ASC
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching review queue:', error);
        res.status(500).json({ error: 'Failed to fetch review queue' });
    }
});

// Mark item as reviewed
app.post('/api/review/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewedBy } = req.body;
        
        const result = await pool.query(
            `UPDATE food_submissions 
             SET reviewed = true, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = $1
             WHERE id = $2
             RETURNING *`,
            [reviewedBy, id]
        );
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error marking as reviewed:', error);
        res.status(500).json({ error: 'Failed to mark as reviewed' });
    }
});

// Get compliance reports
app.get('/api/compliance', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM compliance_tracking
            ORDER BY checked_at DESC
            LIMIT 100
        `);
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching compliance data:', error);
        res.status(500).json({ error: 'Failed to fetch compliance data' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
