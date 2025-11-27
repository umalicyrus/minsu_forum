"use client";

import Navbar from "@/components/navbar";
import React, { useEffect, useState } from "react";

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
  answers: number;
  questions: number;
  following: number;
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
        <span className="text-3xl font-bold text-white">{profile.name[0].toUpperCase()}</span>
      )}
    </div>

    {/* Name + Points */}
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold">{profile.name}</h2>

      {/* Points inside gray oval */}
      <div className="mt-2 bg-gray-200 rounded-full px-3 py-0.5 w-max">
        <p className="font-semibold text-sm text-gray-800">{profile.answers} pts</p>
      </div>
    </div>
  </div>

  {/* User Level */}
  <p className="text-sm text-gray-600">Beginner</p>

  {/* Edit Profile Button */}
  <button className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition self-start">
    Edit Profile
  </button>

  {/* Only You Can See */}
  <p className="mt-2 text-gray-400 text-sm">(only you can see it)</p>
</div>







          {/* Brainly Space */}
          <div className="bg-white shadow rounded-lg p-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500">Level:</p>
              <p className="font-medium">{profile.level}</p>
            </div>
            <div>
              <p className="text-gray-500">Joined:</p>
              <p className="font-medium">{new Date(profile.joined).toDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Warnings:</p>
              <p className="font-medium">{profile.warnings}</p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-700">{profile.bio || "No bio provided."}</p>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-12 md:col-span-8 flex flex-col gap-4">
          {/* Stats Navbar */}
          <div className="bg-white shadow rounded-lg p-2 flex justify-around">
            {[
              { label: "Answers", value: profile.answers },
              { label: "Questions", value: profile.questions },
              { label: "Achievements", value: 1 },
              { label: "Friends", value: profile.following },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-emerald-50 cursor-pointer transition"
              >
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className="font-bold text-xl text-emerald-600">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Content List Box */}
          <div className="bg-white shadow rounded-lg p-6 flex flex-col gap-4 min-h-[400px]">
            <h2 className="text-lg font-semibold mb-2">Answers</h2>
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px]">
              {/* Example items */}
              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                <p className="text-gray-700">Answer content #1</p>
                <p className="text-gray-400 text-sm">Question title / date</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                <p className="text-gray-700">Answer content #2</p>
                <p className="text-gray-400 text-sm">Question title / date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
