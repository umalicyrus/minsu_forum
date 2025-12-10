"use client";

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";
import BrightestSection from "@/components/BrightestSection";
import ProfileRight from "@/components/ProfileRight";

interface Profile {
  points: number;
  error?: boolean;
  id: number;
  name: string;
  email: string;
  bio: string | null;
  image: string | null;
  location: string | null;
  role: string;
  answers: number | any; // could be number or array
  questions: number | any;
  following: number | any;
  level: string;
  joined: string;
  warnings: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store", credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!profile || profile.error)
    return <div className="p-4">You must login to view your profile.</div>;

  // Ensure numbers are passed to ProfileRight
const profileForUI = {
  name: profile.name,
  image: profile.image,
  answers: Array.isArray(profile.answers)
    ? profile.answers.length
    : typeof profile.answers === "number"
    ? profile.answers
    : 0,
  questions: Array.isArray(profile.questions)
    ? profile.questions.length
    : typeof profile.questions === "number"
    ? profile.questions
    : 0,
  following: Array.isArray(profile.following)
    ? profile.following.length
    : typeof profile.following === "number"
    ? profile.following
    : 0,
};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Add top padding equal to navbar height (e.g., h-16 or custom) */}
      <div className="pt-20 max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          {/* Profile Card */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col gap-4">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {profile.name[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name + Points */}
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">{profile.name}</h2>

                {/* Points inside gray oval */}
                <div className="mt-2 bg-gray-200 rounded-full px-3 py-0.5 w-max">
                  <p className="font-semibold text-sm text-gray-800">
                    {profile.answers} pts
                  </p>
                </div>
              </div>
            </div>

            {/* User Level Badge */}
            <div className="bg-gray-200 px-4 py-1 rounded-lg w-max">
              <p className="text-sm font-medium text-gray-600">Beginner</p>
            </div>

            {/* Stats Section */}
            <div className="mt-2 flex justify-center items-center text-center rounded-lg p-4 gap-4">
              {/* Answers */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">Answers</p>
                <p className="font-bold text-gray-800">{profile.answers}</p>
              </div>

              <div className="w-px h-10 bg-gray-300"></div> {/* divider */}

              {/* Brainliest */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">Brainliest</p>
                <p className="font-bold text-gray-800">0</p>
              </div>

              <div className="w-px h-10 bg-gray-300"></div> {/* divider */}

              {/* Thanks */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">Thanks</p>
                <p className="font-bold text-gray-800">0</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="mt-1 w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition">
              {/* Modern Pencil Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92 1.33l-.96-.96L14.06 8.5l.96.96L5.92 18.58zM20.71 7.04a1.5 1.5 0 000-2.12L19.08 3.3a1.5 1.5 0 00-2.12 0l-1.59 1.59 3.75 3.75 1.59-1.6z" />
              </svg>

              <span className="font-semibold">Edit Profile</span>
            </button>
            {/* Brightest At Section */}
            <BrightestSection />

            {/* About Section */}
<div className="mt-2 p-4">
  <h3 className="font-semibold text-lg mb-2">About</h3>
  <hr className="border-gray-300 mb-4" />

  <div className="flex flex-col gap-3">

    {/* Level */}
    <div className="flex items-center gap-3">
      {/* Graduation cap icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0118 20.5c-3.5 1-7.5 1-12 0a12.083 12.083 0 01-.16-9.922L12 14z" />
      </svg>

      <p className="text-gray-500 w-20">Level:</p>
      <p className="font-medium text-gray-800">{profile.level}</p>
    </div>

    {/* Joined */}
    <div className="flex items-center gap-3">
      {/* Calendar icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>

      <p className="text-gray-500 w-20">Joined:</p>
      <p className="font-medium text-gray-800">
        {new Date(profile.joined).toDateString()}
      </p>
    </div>

    {/* Warnings */}
    <div className="flex items-center gap-3">
      {/* Alert icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h17.78A1.5 1.5 0 0022.18 18L13.71 3.86a1.5 1.5 0 00-2.42 0z" />
      </svg>

      <p className="text-gray-500 w-20">Warnings:</p>
      <p className="font-medium text-gray-800">{profile.warnings}</p>
    </div>

  </div>
</div>
          </div>
        </div>

        {/* Right Content */}
        <ProfileRight profile={profileForUI} />
      </div>
    </div>
  );
}
