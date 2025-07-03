"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import EmptyState from "../_components/EmptyState";

export default function Listing() {
  const { user } = useUser();
  const [userRoomList, setUserRoomList] = useState([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex justify-center items-center mb-6 md:mb-10">
          <h2 suppressHydrationWarning className="text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-slate-800 via-cyan-400 to-green-400 text-transparent bg-clip-text px-4">
            Hello, {isClient && user?.fullName ? user.fullName.toUpperCase() : ''}
          </h2>
        </div>

        {userRoomList.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Listing Content will go here */}
          </div>
        )}
      </div>
    </div>
  );
}