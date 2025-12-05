import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../models/User';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { sendCreditNotification } from '../../../_utils/email';

export async function POST(request) {
  try {
    // Get the current user from Clerk auth
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Get the authenticated user details to check if they're an admin
      const user = await clerkClient.users.getUser(userId);

      // Get the primary email address
      const primaryEmail = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      )?.emailAddress;

      // Only admin@example.com can add credits
      if (primaryEmail !== 'admin@example.com') {
        return NextResponse.json({ message: 'Access denied. Only administrators can add credits.' }, { status: 403 });
      }

      // Parse the request body
      const { email, credits } = await request.json();

      // Validate inputs
      if (!email) {
        return NextResponse.json({ message: 'Email is required' }, { status: 400 });
      }

      if (!credits || isNaN(credits) || credits <= 0) {
        return NextResponse.json({ message: 'Valid credits amount is required' }, { status: 400 });
      }

      // Connect to MongoDB
      await connectToDatabase();

      // Find the user by email
      let dbUser = await User.findOne({ email });

      // If user doesn't exist, create a new one
      if (!dbUser) {
        dbUser = new User({
          email,
          credits: 0,
        });
      }

      // Add credits to the user
      const previousCredits = dbUser.credits || 0;
      dbUser.credits = previousCredits + parseInt(credits);

      // Save the updated user
      await dbUser.save();

      // Send email notification to the user
      try {
        await sendCreditNotification({
          to: email,
          credits: credits,
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // We'll continue even if email fails, but log the error
      }

      // Return success response
      return NextResponse.json({
        message: `Successfully added ${credits} credits to ${email}`,
        currentCredits: dbUser.credits,
      });
    } catch (clerkError) {
      console.error('Error checking admin access:', clerkError);
      return NextResponse.json({ message: 'Error verifying admin status' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json(
      { message: 'Failed to add credits: ' + error.message },
      { status: 500 }
    );
  }
} 