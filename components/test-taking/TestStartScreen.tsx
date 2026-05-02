"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Award,
  FileQuestion,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react";
import { TestItem } from "@/lib/types/test";

interface TestStartScreenProps {
  test: TestItem;
  onStart: () => void;
}

export default function TestStartScreen({ test, onStart }: TestStartScreenProps) {
  return (
    <div className="flex flex-col bg-background">
      <main className="py-3 px-4">
        <div className="max-w-xl mx-auto">
          <Card className="rounded-xl border border-primary/20 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-4">
              <h1 className="text-xl font-bold text-foreground">{test.title}</h1>
              {test.description && <p className="text-sm text-muted-foreground mt-1">{test.description}</p>}
            </div>

            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                  <FileQuestion className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">{test.mcqs.length}</p>
                  <p className="text-[10px] text-muted-foreground">Questions</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                  <Award className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">{test.totalMarks}</p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                  <CheckCircle className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">{test.passingMarks}</p>
                  <p className="text-[10px] text-muted-foreground">Passing</p>
                </div>
                <div className="bg-primary/5 rounded-lg p-2 text-center border border-primary/10">
                  <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-lg font-bold text-primary">{test.timeLimit || 30}s</p>
                  <p className="text-[10px] text-muted-foreground">Per Q</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-1 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Instructions
                </h3>
                <ul className="space-y-1 text-xs text-yellow-700">
                  <li>• {test.mcqs.length} MCQs, {test.timeLimit || 30}s per question</li>
                  <li>• Timer starts immediately on Start Test click</li>
                  <li>• Use Prev/Next buttons to navigate questions</li>
                  <li>• Auto-submitted when timer reaches zero</li>
                  <li>• Do not refresh or close browser during test</li>
                </ul>
              </div>

              <Button 
                onClick={onStart} 
                className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-lg hover:scale-[1.01] transition-transform"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Test
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
