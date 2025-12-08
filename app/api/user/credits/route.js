import { NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import User from '../../../../models/User';

/**
 * GET /api/user/credits
 * Fetches the current user's credit balance from MongoDB
 */
export async function GET(request) {
    try {
        // Get the authenticated user from Clerk
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        try {
            // Get user details from Clerk - call clerkClient() as a function in v6+
            const client = await clerkClient();
            const user = await client.users.getUser(userId);

            if (!user) {
                return NextResponse.json(
                    { message: 'User not found' },
                    { status: 404 }
                );
            }

            // Get the user's primary email
            const email = user.emailAddresses.find(
                (emailAddr) => emailAddr.id === user.primaryEmailAddressId
            )?.emailAddress;

            if (!email) {
                return NextResponse.json(
                    { message: 'User email not found' },
                    { status: 404 }
                );
            }

            // Connect to MongoDB and fetch user credits
            await connectToDatabase();
            let dbUser = await User.findOne({ email });

            // If user doesn't exist in MongoDB, create with default credits
            if (!dbUser) {
                dbUser = new User({
                    email,
                    credits: 2, // Default starting credits
                    plan: 'free',
                });
                await dbUser.save();
            }

            return NextResponse.json({
                credits: dbUser.credits || 0,
                email: dbUser.email,
                plan: dbUser.plan || 'free',
            });
        } catch (clerkError) {
            console.error('Error fetching user from Clerk:', clerkError);
            return NextResponse.json(
                { message: 'Error retrieving user data' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error fetching user credits:', error);
        return NextResponse.json(
            { message: 'Error fetching credits' },
            { status: 500 }
        );
    }
}
