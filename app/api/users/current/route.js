import { NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET(request) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({
        message: 'Unauthorized'
      }, { status: 401 });
    }

    try {
      // Get user details from Clerk
      const user = await clerkClient.users.getUser(userId);

      if (!user) {
        return NextResponse.json({
          message: 'User not found'
        }, { status: 404 });
      }

      // Get the user's primary email
      const email = user.emailAddresses.find(
        email => email.id === user.primaryEmailAddressId
      )?.emailAddress;

      if (!email) {
        return NextResponse.json({
          message: 'User email not found'
        }, { status: 404 });
      }

      // Check if this user exists in our MongoDB database
      await connectToDatabase();
      let dbUser = await User.findOne({ email });

      // If not found in our database but authenticated, create a record for them
      if (!dbUser && email) {
        dbUser = new User({
          email,
          credits: 2, // Default starting credits
          plan: 'free' // Default plan
        });

        await dbUser.save();
      }

      // Return the user information
      return NextResponse.json({
        id: userId,
        email,
        credits: dbUser?.credits || 0,
        plan: dbUser?.plan || 'free'
      });
    } catch (clerkError) {
      console.error('Error fetching user from Clerk:', clerkError);
      return NextResponse.json({ message: 'Error retrieving user data' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { message: 'Error fetching user information' },
      { status: 500 }
    );
  }
} 