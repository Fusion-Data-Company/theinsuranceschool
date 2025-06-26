// Script to seed sample data for testing MCP analytics
const { Pool } = require('@neondatabase/serverless');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedSampleData() {
  const client = await pool.connect();
  
  try {
    console.log('Seeding sample data for MCP testing...');

    // Insert sample leads
    await client.query(`
      INSERT INTO leads (first_name, last_name, phone, email, license_goal, source, status, created_at) VALUES
      ('John', 'Smith', '+1234567890', 'john.smith@email.com', '2-15', 'voice_agent', 'qualified', NOW() - INTERVAL '2 hours'),
      ('Sarah', 'Johnson', '+1234567891', 'sarah.j@email.com', '2-40', 'website', 'enrolled', NOW() - INTERVAL '1 day'),
      ('Mike', 'Davis', '+1234567892', 'mike.davis@email.com', '2-14', 'voice_agent', 'new', NOW() - INTERVAL '30 minutes'),
      ('Lisa', 'Wilson', '+1234567893', 'lisa.w@email.com', '2-15', 'referral', 'qualified', NOW() - INTERVAL '3 hours'),
      ('David', 'Brown', '+1234567894', 'david.brown@email.com', '2-40', 'voice_agent', 'contacted', NOW() - INTERVAL '6 hours'),
      ('Emma', 'Taylor', '+1234567895', 'emma.t@email.com', '2-14', 'website', 'enrolled', NOW()),
      ('Robert', 'Anderson', '+1234567896', 'robert.a@email.com', '2-15', 'voice_agent', 'qualified', NOW() - INTERVAL '45 minutes')
    `);

    // Get lead IDs for relationships
    const leadsResult = await client.query('SELECT id, first_name FROM leads ORDER BY id');
    const leads = leadsResult.rows;

    // Insert sample call records
    for (let i = 0; i < 5; i++) {
      await client.query(`
        INSERT INTO call_records (lead_id, call_sid, transcript, sentiment, duration_seconds, intent, agent_confidence, created_at) VALUES
        ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '${i} hours')
      `, [
        leads[i].id,
        `call_${Date.now()}_${i}`,
        `Transcript for ${leads[i].first_name} - discussed insurance licensing requirements`,
        i % 2 === 0 ? 'positive' : 'neutral',
        120 + (i * 30),
        i < 3 ? 'interested' : 'undecided',
        0.85 + (i * 0.02)
      ]);
    }

    // Insert sample enrollments for today
    const enrolledLeads = leads.filter((_, i) => i % 3 === 0); // Every 3rd lead
    for (const lead of enrolledLeads) {
      await client.query(`
        INSERT INTO enrollments (lead_id, course, cohort, start_date, status, progress, created_at) VALUES
        ($1, $2, $3, $4, $5, $6, NOW())
      `, [
        lead.id,
        '2-15_life_health',
        'evening',
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Start in 1 week
        'enrolled',
        0
      ]);
    }

    // Insert sample payments
    for (const lead of enrolledLeads) {
      await client.query(`
        INSERT INTO payments (lead_id, amount, payment_type, status, stripe_payment_id, created_at) VALUES
        ($1, $2, $3, $4, $5, NOW())
      `, [
        lead.id,
        299.99,
        'down_payment',
        'completed',
        `pi_${Date.now()}_${lead.id}`
      ]);
    }

    // Insert agent metrics
    const callsResult = await client.query('SELECT id FROM call_records LIMIT 3');
    for (const call of callsResult.rows) {
      await client.query(`
        INSERT INTO agent_metrics (call_record_id, confidence, response_time_ms, avg_pause_ms, words_per_minute, created_at) VALUES
        ($1, $2, $3, $4, $5, NOW())
      `, [
        call.id,
        0.87,
        250,
        800,
        145
      ]);
    }

    console.log('✅ Sample data seeded successfully!');
    console.log(`📊 Created ${leads.length} leads, ${enrolledLeads.length} enrollments, and ${enrolledLeads.length} payments`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  seedSampleData().then(() => process.exit(0));
}

module.exports = { seedSampleData };