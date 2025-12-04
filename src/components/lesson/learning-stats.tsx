"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Target, TrendingUp, BookOpen, Award } from "lucide-react";
import type { UserLearningStats } from "@/types/vocabulary";

interface LearningStatsProps {
  stats: UserLearningStats;
}

export function LearningStats({ stats }: LearningStatsProps) {
  const { daily_goal, streak, total_words_learned, total_words_mastered, words_due_for_review } = stats;
  
  const dailyProgress = daily_goal.target_words > 0 
    ? Math.min((daily_goal.words_learned / daily_goal.target_words) * 100, 100)
    : 0;
    
  const reviewProgress = daily_goal.target_reviews > 0
    ? Math.min((daily_goal.words_reviewed / daily_goal.target_reviews) * 100, 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Streak Card */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500 rounded-full">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  Learning Streak
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {streak.current_streak} days
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Longest streak
              </p>
              <p className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                {streak.longest_streak} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Goal Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Today&apos;s Goals
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Words Learned Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">New Words</span>
              <span className="font-medium">
                {daily_goal.words_learned} / {daily_goal.target_words}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${dailyProgress}%` }}
              />
            </div>
          </div>

          {/* Words Reviewed Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reviews</span>
              <span className="font-medium">
                {daily_goal.words_reviewed} / {daily_goal.target_reviews}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 rounded-full"
                style={{ width: `${reviewProgress}%` }}
              />
            </div>
          </div>

          {/* Completion Status */}
          {dailyProgress >= 100 && reviewProgress >= 100 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Daily goals completed! 🎉
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <BookOpen className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{total_words_learned}</p>
            <p className="text-xs text-muted-foreground">Words Learned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{total_words_mastered}</p>
            <p className="text-xs text-muted-foreground">Mastered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-orange-500" />
            <p className="text-2xl font-bold">{words_due_for_review}</p>
            <p className="text-xs text-muted-foreground">Due Review</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
