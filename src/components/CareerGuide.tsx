"use client";
import React, { useState } from "react";
import {
  Sparkles,
  Target,
  BookOpen,
  Brain,
  ArrowRight,
  X,
  Loader2,
  Lightbulb,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import { CareerGuideResponse, Utils_Service } from "@/lib/type";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const CareerGuide = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CareerGuideResponse | null>(null);
  const [currentSkill, setCurrentSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillsToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillsToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  const getCareerGuidance = async () => {
    if (skills.length === 0) {
      alert("Please add atleast one skill");
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${Utils_Service}/api/utils/careerGuidance`,
        {
          skills,
        },
      );
      setResponse(data);
      alert("Career guidance genrated");
    } catch (error: any) {
      alert(`Career guidance error: ${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setSkills([]);
    setCurrentSkill("");
    setResponse(null);
    setOpen(false);
  };

  return (
    <div className="py-20 bg-background relative overflow-hidden">
      {/* background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/40 backdrop-blur-md">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm font-medium">
              AI-Powered Career Guidance
            </span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Discover Your Career Path
        </h2>

        {/* Description */}
        <p className="text-center text-lg opacity-70 max-w-2xl mx-auto mb-16">
          Get personalized job recommendations and learning roadmaps based on
          your skills, interests, and industry demand.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <Brain className="text-blue-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Skill Analysis</h3>
            <p className="text-sm opacity-70">
              Analyze your current skills and identify gaps needed for your
              dream job.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <Target className="text-purple-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Career Matching</h3>
            <p className="text-sm opacity-70">
              Discover the best career opportunities tailored to your profile.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <BookOpen className="text-green-600 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">Learning Roadmap</h3>
            <p className="text-sm opacity-70">
              Get step-by-step learning paths to upgrade your skills.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <Sparkles className="text-orange-500 mb-4" size={32} />
            <h3 className="font-semibold text-lg mb-2">AI Suggestions</h3>
            <p className="text-sm opacity-70">
              Receive intelligent job and skill recommendations powered by AI.
            </p>
          </div>

          <div className="col-span-full flex justify-center items-center text-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size={"lg"} className="gap-2 h-12 px-8">
                  <Sparkles size={18} /> Get Career Guidance
                  <ArrowRight size={18} />
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                {!response ? (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        <Sparkles className="text-blue-600" /> Tell us about
                        your skills
                      </DialogTitle>
                      <DialogDescription>
                        Add your skills to receive personal recommendations
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="skill">Add Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            id="skill"
                            placeholder="e.g., React, Node.js, Python..."
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            className="h-11"
                            onKeyPress={handleKeyPress}
                          />

                          <Button onClick={addSkill} className="gap-2">
                            Add
                          </Button>
                        </div>
                      </div>

                      {skills.length > 0 && (
                        <div className="space-y-2">
                          <Label>Your Skills ({skills.length})</Label>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((s) => (
                              <div
                                className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800"
                                key={s}
                              >
                                <span className="text-sm font-medium">{s}</span>
                                <Button
                                  onClick={() => {
                                    removeSkill(s);
                                  }}
                                  size="icon"
                                  // variant="ghost"
                                  className="h-5 w-5 rounded-full bg-red-400 hover:bg-red-500 text-white flex items-center justify-center"
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button
                        onClick={getCareerGuidance}
                        disabled={loading || skills.length === 0}
                        className="w-full h-11 gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Analyzing your skills
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} className="animate-spin" />
                            Generate Career Guidance
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle className="text-2xl flex items-center gap-2">
                        <Target className="text-blue-600" /> Your personalized
                        career guide
                      </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      {/* summary */}
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                          <Lightbulb
                            className="text-blue-600 mt-1 shrink-0"
                            size={20}
                          />
                          <div>
                            <h3 className="font-semibold mb-2">
                              Career Summary
                            </h3>
                            <p className="text-sm leading-relaxed opacity-90">
                              {response.summary}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Job Options */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex gap-2 items-center">
                          <Briefcase size={20} className="text-blue-600" />
                          Recommended career path
                        </h3>

                        <div className="space-y-3">
                          {response.jobOptions.map((job, index) => (
                            <div
                              className="p-4 rounded-lg border border-blue-500 transition-colors"
                              key={index}
                            >
                              <h4 className="font-semibold text-base mb-2">
                                {job.title}
                              </h4>

                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium opacity-70">
                                    Responsibilities:{" "}
                                  </span>
                                  <span className="opacity-80">
                                    {job.responsibilites}
                                  </span>
                                </div>
                                <span className="font-medium opacity-70">
                                  Why this role:
                                </span>
                                <span className="opacity-80">{job.why}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Skills to learn */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <TrendingUp size={20} className="text-blue-600" />
                          Skills to enhance your career
                        </h3>
                        <div className="space-y-4">
                          {response.skillsToLearn.map((category, index) => (
                            <div className="space-y-2" key={index}>
                              {" "}
                              <h4 className="font-semibold text-sm text-blue-600">
                                {category.category}
                              </h4>
                              <div className="space-y-2">
                                {category.skills.map((skill, sindex) => (
                                  <div
                                    key={sindex}
                                    className="p-3 rounded-lg bg-secondary border text-sm"
                                  >
                                    <p className="font-medium mb-1">
                                      {skill.title}
                                    </p>
                                    <p className="text-xs opacity-70 mb-1">
                                      <span className="font-medium ">
                                        Why:{" "}
                                      </span>
                                      {skill.why}
                                    </p>
                                    <p className="text-xs opacity-70 mb-1">
                                      <span className="font-medium ">
                                        How:{" "}
                                      </span>
                                      {skill.how}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Learning approach */}
                      <div className="p-4 rounded-lg border bg-blue-950/20 dark:bg-red-950/20">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <BookOpen size={20} className="text-blue-600" />
                          {response.learningApproach.title}
                        </h3>

                        <ul className="space-y-2">
                          {response.learningApproach.points.map(
                            (point, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start gap-2"
                              >
                                <span className="text-blue-600 mt-0.5">*</span>
                                <span
                                  className="opacity-90"
                                  dangerouslySetInnerHTML={{ __html: point }}
                                />
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <Button
                        onClick={resetDialog}
                        variant={"outline"}
                        className="w-full"
                      >
                        {" "}
                        Start new analysis
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuide;
