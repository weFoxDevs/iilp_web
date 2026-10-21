import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import {
  fetchPublicLeadershipMembers,
  LeadershipMemberItem,
} from "@/common/services/leadership.service";
import LeadershipDirectoryHero from "@/modules/leadership-directory/components/LeadershipDirectoryHero";
import InstitutionalLeadership from "@/modules/leadership-directory/components/InstitutionalLeadership";
import JoinTeamBanner from "@/modules/leadership-directory/components/JoinTeamBanner";
import LeadershipDirectorySkeleton from "@/modules/leadership-directory/components/LeadershipDirectorySkeleton";

export default function LeadershipDirectoryPage() {
  const { getSection, isLoading: isPageLoading } = usePageContent("leadership-directory");
  const [leadershipMembers, setLeadershipMembers] = useState<LeadershipMemberItem[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublicLeadershipMembers()
      .then((members) => {
        if (active) {
          setLeadershipMembers(Array.isArray(members) ? members : []);
        }
      })
      .catch((err) => {
        console.warn("[LeadershipDirectory] Failed to fetch members:", err);
      })
      .finally(() => {
        if (active) {
          setIsMembersLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const isLoading = isPageLoading || isMembersLoading;

  return (
    <>
      <Head>
        <title>Leadership Directory | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Meet the leadership team of IILP — institutional leaders, directors, and senior staff driving law, politics, and global policy research."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <LeadershipDirectorySkeleton />
          ) : (
            <>
              <LeadershipDirectoryHero data={getSection("hero")} />
              <InstitutionalLeadership
                data={getSection("institutional_leadership")}
                members={leadershipMembers}
              />
              <JoinTeamBanner data={getSection("join_team_banner")} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
