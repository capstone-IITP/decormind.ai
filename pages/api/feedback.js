import { connectToDatabase } from '../../lib/mongodb';
import Feedback from '../../models/Feedback';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await connectToDatabase();

    // Extract feedback data from request body
    const { message, designId, roomType, styleType } = req.body;

    // Validate required fields with proper type checking
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Feedback message is required' });
    }

    // Create a new feedback document
    const feedback = await Feedback.create({
      message,
      designId: designId || null,
      roomType: roomType || null,
      styleType: styleType || null
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
}