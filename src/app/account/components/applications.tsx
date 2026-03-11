"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";

interface Application {
  application_id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  company_logo: string;
  status: string;
  location: string;
  applied_at: string;
}

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchApplications = async () => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get(
        "http://localhost:5003/api/users/getAllApplications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(data || []);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.job_title?.toLowerCase().includes(search.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Card className="shadow-lg border-2 overflow-hidden">
        <div className="bg-blue-500 p-6 border-b">
          <CardTitle className="text-2xl text-white">
            My Applications
          </CardTitle>
          <CardDescription className="text-white mt-1">
            Track all the jobs you have applied for
          </CardDescription>
        </div>

        <CardContent className="p-6 space-y-6">

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
              />
              <Input
                placeholder="Search job or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            <select
              className="h-11 border rounded-md px-3 bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-10 text-sm opacity-70">
              Loading applications...
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredApplications.length === 0 && (
            <div className="text-center py-14">
              <CardDescription>
                No applications found.
              </CardDescription>
            </div>
          )}

          {/* Applications List */}
          <div className="grid gap-4 md:grid-cols-2">
            {filteredApplications.map((app) => (
              <Card
                key={app.application_id}
                className="border hover:shadow-md transition-all"
              >
                <CardContent className="p-5 flex gap-4 items-start">

                  <img
                    src={app.company_logo}
                    alt={app.company_name}
                    className="w-12 h-12 rounded-md object-cover border"
                  />

                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-base">
                      {app.job_title}
                    </h3>

                    <p className="text-sm opacity-80">
                      {app.company_name}
                    </p>

                    <p className="text-xs opacity-70">
                      📍 {app.location}
                    </p>

                    <p className="text-xs opacity-60">
                      Applied:{" "}
                      {new Date(app.applied_at).toLocaleDateString()}
                    </p>

                    <div className="pt-2">
                      <span className="text-xs px-2 py-1 rounded bg-muted">
                        {app.status}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      (window.location.href = `/jobs/${app.job_id}`)
                    }
                  >
                    View Job
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default MyApplications;
