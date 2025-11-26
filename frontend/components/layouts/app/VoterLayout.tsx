import { useState } from "react";
import { LayoutProps } from "../../../Interfaces/interface";
import VoterHeader from "./VoterHeader";
import VoterSidebar from "./VoterSidebar";

export default function VoterLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <VoterSidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background text-text">
        {/* Header */}
        <VoterHeader />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
