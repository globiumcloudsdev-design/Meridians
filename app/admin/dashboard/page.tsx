"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Users, MessageSquare, FileCheck, Plus } from "lucide-react";
import {
  API_BLOG,
  API_SUBSCRIBERS,
  API_CONTACT,
  API_ADMISSION,
} from "@/lib/api/endpoints";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    subscribers: 0,
    contactMessages: 0,
    admissionQueries: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blog, subscribers, contact, admission] = await Promise.all([
        fetch(API_BLOG).then((r) => r.json()),
        fetch(API_SUBSCRIBERS).then((r) => r.json()),
        fetch(API_CONTACT).then((r) => r.json()),
        fetch(API_ADMISSION).then((r) => r.json()),
      ]);

      setStats({
        blogPosts: Array.isArray(blog) ? blog.length : 0,
        subscribers: Array.isArray(subscribers) ? subscribers.length : 0,
        contactMessages: Array.isArray(contact) ? contact.length : 0,
        admissionQueries: Array.isArray(admission) ? admission.length : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Blog Posts",
      count: stats.blogPosts,
      icon: FileText,
      link: "/admin/blog",
      color: "text-blue-600",
    },
    {
      title: "Subscribers",
      count: stats.subscribers,
      icon: Users,
      link: "/admin/subscribers",
      color: "text-green-600",
    },
    {
      title: "Contact Messages",
      count: stats.contactMessages,
      icon: MessageSquare,
      link: "/admin/contact-messages",
      color: "text-purple-600",
    },
    {
      title: "Admission Queries",
      count: stats.admissionQueries,
      icon: FileCheck,
      link: "/admin/admission-queries",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your admin overview.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
          <Link href="/admin/blog">
            <Plus className="w-4 h-4 mr-2" />
            New Blog Post
          </Link>
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.link}>
              <Card className="border-primary/20 hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-sm">{card.title}</span>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-foreground">
                    {isLoading ? "-" : card.count}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {card.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: "Create Blog Post",
              href: "/admin/blog/new",
              icon: FileText,
            },
            { label: "View All Posts", href: "/admin/blog", icon: FileText },
            {
              label: "View Subscribers",
              href: "/admin/subscribers",
              icon: Users,
            },
            {
              label: "View Contact Messages",
              href: "/admin/contact-messages",
              icon: MessageSquare,
            },
            {
              label: "View Admission Queries",
              href: "/admin/admission-queries",
              icon: FileCheck,
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/50"
              >
                <Link
                  href={action.href}
                  className="flex items-center justify-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{action.label}</span>
                </Link>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Info Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Website Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/80">
          <p>
            <strong>Admin Area:</strong> Manage all website content, blog posts,
            and user submissions from here.
          </p>
          <p>
            <strong>Recent Activity:</strong> Check the specific sections to
            view and manage recent submissions and inquiries.
          </p>
          <p>
            <strong>Need Help?</strong> Contact the technical support team at
            support@meridians.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
