import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ProgressResponse {
  user_id: string;
  academy: {
    tracks: TrackProgress[];
    lessons: LessonProgress[];
    certificates: Certificate[];
    quests: QuestProgress[];
    overall_progress: number;
    total_xp: number;
    rank: string;
  };
  achievements: Achievement[];
  milestones: Milestone[];
  recommendations: Recommendation[];
}

interface TrackProgress {
  track_id: string;
  track_name: string;
  progress_percentage: number;
  lessons_completed: number;
  total_lessons: number;
  status: string;
  started_at: string;
  completed_at: string | null;
}

interface LessonProgress {
  lesson_id: string;
  lesson_title: string;
  track_name: string;
  status: string;
  score: number | null;
  completed_at: string | null;
  time_spent_minutes: number;
}

interface Certificate {
  certificate_id: string;
  title: string;
  issued_at: string;
  certificate_type: string;
  nft_minted: boolean;
}

interface QuestProgress {
  quest_id: string;
  quest_title: string;
  status: string;
  progress_percentage: number;
  xp_reward: number;
  completed_at: string | null;
}

interface Achievement {
  achievement_id: string;
  title: string;
  description: string;
  achievement_type: string;
  earned_at: string;
  xp_earned: number;
}

interface Milestone {
  milestone_type: string;
  title: string;
  reached_at: string;
  value: number;
}

interface Recommendation {
  type: string;
  title: string;
  description: string;
  priority: number;
  url: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "unauthorized", message: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get track progress
    const { data: trackProgress } = await supabase
      .from("user_academy_progress")
      .select(`
        id,
        lesson_id,
        status,
        score,
        completed_at,
        time_spent_minutes,
        started_at,
        academy_lessons (
          id,
          title,
          track_id,
          academy_tracks (
            id,
            name
          )
        )
      `)
      .eq("user_id", user.id)
      .order("started_at", { ascending: false });

    // Get all tracks
    const { data: allTracks } = await supabase
      .from("academy_tracks")
      .select("id, name")
      .order("sequence", { ascending: true });

    // Calculate track progress
    const tracks: TrackProgress[] = (allTracks || []).map((track) => {
      const trackLessons = trackProgress?.filter(
        (p: any) => p.academy_lessons?.academy_tracks?.id === track.id
      ) || [];
      const completedLessons = trackLessons.filter((l: any) => l.status === "completed");

      return {
        track_id: track.id,
        track_name: track.name,
        progress_percentage: trackLessons.length > 0
          ? Math.round((completedLessons.length / trackLessons.length) * 100)
          : 0,
        lessons_completed: completedLessons.length,
        total_lessons: trackLessons.length,
        status: completedLessons.length === trackLessons.length && trackLessons.length > 0
          ? "completed"
          : trackLessons.length > 0
          ? "in_progress"
          : "not_started",
        started_at: trackLessons[0]?.started_at || new Date().toISOString(),
        completed_at: completedLessons.length === trackLessons.length && trackLessons.length > 0
          ? completedLessons[completedLessons.length - 1]?.completed_at
          : null,
      };
    });

    // Format lesson progress
    const lessons: LessonProgress[] = (trackProgress || []).map((p: any) => ({
      lesson_id: p.lesson_id,
      lesson_title: p.academy_lessons?.title || "Unknown Lesson",
      track_name: p.academy_lessons?.academy_tracks?.name || "Unknown Track",
      status: p.status,
      score: p.score,
      completed_at: p.completed_at,
      time_spent_minutes: p.time_spent_minutes || 0,
    }));

    // Get certificates
    const { data: certificates } = await supabase
      .from("user_certificates")
      .select("id, certificate_type, issued_at, metadata")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    const formattedCertificates: Certificate[] = (certificates || []).map((cert) => ({
      certificate_id: cert.id,
      title: cert.metadata?.title || `${cert.certificate_type} Certificate`,
      issued_at: cert.issued_at,
      certificate_type: cert.certificate_type,
      nft_minted: cert.metadata?.nft_minted || false,
    }));

    // Get quests
    const { data: quests } = await supabase
      .from("user_academy_quests")
      .select(`
        quest_id,
        progress,
        status,
        completed_at,
        academy_quests (
          title,
          xp_reward
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const formattedQuests: QuestProgress[] = (quests || []).map((q: any) => ({
      quest_id: q.quest_id,
      quest_title: q.academy_quests?.title || "Unknown Quest",
      status: q.status,
      progress_percentage: Math.round((q.progress || 0) * 100),
      xp_reward: q.academy_quests?.xp_reward || 0,
      completed_at: q.completed_at,
    }));

    // Get total XP and rank
    const { data: aoiProgress } = await supabase
      .from("aoi_user_progress")
      .select("experience_points")
      .eq("user_id", user.id)
      .maybeSingle();

    const totalXP = aoiProgress?.experience_points || 0;
    let rank = "Worker";
    if (totalXP >= 10000) rank = "Warrior";
    else if (totalXP >= 5000) rank = "Peacekeeper";
    else if (totalXP >= 2000) rank = "Diplomat";
    else if (totalXP >= 500) rank = "Academic";

    // Get achievements
    const { data: achievements } = await supabase
      .from("aoi_achievements")
      .select("id, achievement_code, achievement_type, metadata, earned_at")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false });

    const formattedAchievements: Achievement[] = (achievements || []).map((a) => ({
      achievement_id: a.id,
      title: a.metadata?.title || a.achievement_code,
      description: a.metadata?.description || "",
      achievement_type: a.achievement_type,
      earned_at: a.earned_at,
      xp_earned: a.metadata?.xp_earned || 0,
    }));

    // Calculate milestones
    const milestones: Milestone[] = [];
    const completedCount = lessons.filter((l) => l.status === "completed").length;
    if (completedCount >= 10) {
      milestones.push({
        milestone_type: "lessons_completed",
        title: "10 Lessons Completed",
        reached_at: lessons[9]?.completed_at || new Date().toISOString(),
        value: completedCount,
      });
    }

    // Generate recommendations
    const recommendations: Recommendation[] = [];
    const inProgressTracks = tracks.filter(
      (t) => t.status === "in_progress" && t.progress_percentage < 100
    );

    if (inProgressTracks.length > 0) {
      recommendations.push({
        type: "continue_track",
        title: `Continue ${inProgressTracks[0].track_name}`,
        description: `You're ${inProgressTracks[0].progress_percentage}% through this track`,
        priority: 1,
        url: `/app/academy?track=${inProgressTracks[0].track_id}`,
      });
    }

    const notStartedTracks = tracks.filter((t) => t.status === "not_started");
    if (notStartedTracks.length > 0) {
      recommendations.push({
        type: "start_track",
        title: `Start ${notStartedTracks[0].track_name}`,
        description: "Begin your learning journey in this track",
        priority: 2,
        url: `/app/academy?track=${notStartedTracks[0].track_id}`,
      });
    }

    // Calculate overall progress
    const totalLessons = tracks.reduce((sum, t) => sum + t.total_lessons, 0);
    const totalCompleted = tracks.reduce((sum, t) => sum + t.lessons_completed, 0);
    const overallProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

    const response: ProgressResponse = {
      user_id: user.id,
      academy: {
        tracks,
        lessons,
        certificates: formattedCertificates,
        quests: formattedQuests,
        overall_progress: overallProgress,
        total_xp: totalXP,
        rank,
      },
      achievements: formattedAchievements,
      milestones,
      recommendations,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in aoi-progress:", error);
    return new Response(
      JSON.stringify({
        error: "internal_server_error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
