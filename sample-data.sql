-- Sample data for Insurance School Recruiting Annex CRM
-- This will populate the database with realistic demo data

-- Insert sample leads
INSERT INTO leads (name, phone, email, status, license_goal, source) VALUES
('Marcus Thompson', '+1-555-0123', 'marcus.thompson@email.com', 'qualified', '2-15', 'voice_agent'),
('Sarah Rodriguez', '+1-555-0124', 'sarah.rodriguez@email.com', 'new', '2-40', 'website'),
('David Chen', '+1-555-0125', 'david.chen@email.com', 'contacted', '2-14', 'referral'),
('Lisa Johnson', '+1-555-0126', 'lisa.johnson@email.com', 'enrolled', '2-15', 'voice_agent'),
('Michael Davis', '+1-555-0127', 'michael.davis@email.com', 'qualified', '2-40', 'website'),
('Jennifer Wilson', '+1-555-0128', 'jennifer.wilson@email.com', 'new', '2-15', 'voice_agent'),
('Robert Brown', '+1-555-0129', 'robert.brown@email.com', 'contacted', '2-14', 'referral'),
('Amanda Garcia', '+1-555-0130', 'amanda.garcia@email.com', 'qualified', '2-40', 'voice_agent'),
('Christopher Lee', '+1-555-0131', 'christopher.lee@email.com', 'enrolled', '2-15', 'website'),
('Ashley Martinez', '+1-555-0132', 'ashley.martinez@email.com', 'new', '2-14', 'voice_agent');

-- Insert sample call records for some leads
INSERT INTO call_records (lead_id, transcript, sentiment, intent, confidence_score, call_duration) VALUES
(1, 'Hi Marcus, thank you for your interest in our insurance licensing program. I understand you are looking to get your 2-15 license. Our accelerated program can get you licensed in just 4 weeks with our proven methodology and 24/7 support system.', 'positive', 'enrollment_interest', 0.89, 420),
(2, 'Hello Sarah, this is Jason from Insurance School Recruiting. I see you visited our website and showed interest in the 2-40 license program. Our next cohort starts in 2 weeks and we have some early bird pricing available.', 'neutral', 'information_gathering', 0.76, 315),
(3, 'David, thanks for taking my call. I know your colleague referred you to us. Our 2-14 program has a 94% pass rate and includes lifetime support. Would you like to learn more about our payment plans?', 'positive', 'enrollment_interest', 0.82, 380),
(6, 'Jennifer, I am calling about your inquiry for insurance licensing. We have helped over 10,000 students get licensed. What specific questions do you have about the 2-15 program?', 'neutral', 'information_gathering', 0.71, 280),
(8, 'Amanda, thank you for your time. I can see you are serious about starting your insurance career. Our 2-40 license program includes job placement assistance with our partner agencies. Shall we get you enrolled today?', 'positive', 'enrollment_interest', 0.91, 450);

-- Insert sample payments
INSERT INTO payments (lead_id, amount, payment_type, status, method) VALUES
(4, 297.00, 'down_payment', 'completed', 'credit_card'),
(9, 1485.00, 'full_payment', 'completed', 'bank_transfer'),
(1, 297.00, 'down_payment', 'completed', 'credit_card'),
(5, 297.00, 'down_payment', 'pending', 'credit_card'),
(8, 495.00, 'installment', 'completed', 'credit_card');

-- Insert sample enrollments
INSERT INTO enrollments (lead_id, course, cohort, start_date, status) VALUES
(4, 'Insurance Fundamentals 2-15', 'Cohort 2025-01', '2025-02-01', 'active'),
(9, 'Property & Casualty 2-40', 'Cohort 2025-01', '2025-02-01', 'active'),
(1, 'Insurance Fundamentals 2-15', 'Cohort 2025-02', '2025-02-15', 'active');

-- Insert sample webhook logs
INSERT INTO webhook_logs (endpoint, method, payload, response_status, response_time) VALUES
('/api/webhooks/elevenlabs-call', 'POST', '{"call_id": "call_123", "lead_phone": "+1-555-0123", "transcript": "Complete call transcript"}', 200, 120),
('/api/webhooks/elevenlabs-call', 'POST', '{"call_id": "call_124", "lead_phone": "+1-555-0124", "transcript": "Another call transcript"}', 200, 95),
('/api/webhooks/internal-query', 'POST', '{"query": "How many leads do we have?", "user_id": "admin"}', 200, 45);

-- Insert sample agent metrics
INSERT INTO agent_metrics (call_record_id, metric_name, metric_value, confidence_score) VALUES
(1, 'engagement_score', 8.7, 0.89),
(1, 'conversion_likelihood', 9.2, 0.91),
(2, 'engagement_score', 6.4, 0.76),
(2, 'conversion_likelihood', 7.1, 0.78),
(3, 'engagement_score', 8.1, 0.82),
(3, 'conversion_likelihood', 8.8, 0.85);