import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

// ✅ Import images
import awarenessImg from "@/assets/awareness.jpeg";
import gdprImg from "@/assets/gdpr.jpeg";
import phishingImg from "@/assets/phining.jpeg";
import safetyImg from "@/assets/safty.jpeg";

import { useAuthStore } from "@/stores/authStore"; // get logged-in user

interface Policy {
  title: string;
  short: string;
  full: string[];
  image: string;
  videos?: string[]; // multiple videos possible
}

// 🔧 Helper: Convert YouTube links to embed format
function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  if (url.includes("watch?v=")) {
    const videoId = url.split("watch?v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url; // fallback
}

const policies: Policy[] = [
  {
    title: "Data Privacy & GDPR",
    short: "Understand global data protection regulations.",
    full: [
      "GDPR is a European Union law on data protection and privacy.",
      "It ensures individuals have control over their personal data.",
      "Companies must handle personal data carefully and securely.",
      "Learning GDPR boosts compliance, legal, and cybersecurity career opportunities.",
    ],
    image: gdprImg,
    videos: ["https://youtu.be/eaeBD8gEuqo"], // ✅ GDPR
  },
  {
    title: "Cybersecurity Awareness",
    short: "Protect company and customer data.",
    full: [
      "Cybersecurity requires strong passwords and avoiding phishing links.",
      "Regular software updates help prevent security breaches.",
      "Always report suspicious activity to your IT team.",
      "Cybersecurity knowledge opens doors in IT security and cyber defense careers.",
    ],
    image: awarenessImg,
    videos: ["https://youtu.be/tlmpSYlhdV0"], // ✅ Cybersecurity Awareness
  },
  {
    title: "Phishing & Email Security",
    short: "Learn how to prevent phishing attacks.",
    full: [
      "Phishing is a common cyberattack targeting emails.",
      "Employees should verify sender emails and avoid suspicious links.",
      "Reporting phishing attempts helps protect the organization.",
      "Email security expertise supports careers as SOC or cybersecurity analysts.",
    ],
    image: phishingImg,
    videos: ["https://youtu.be/-Br0-VYD3xk"], // ✅ Only this video
  },
  {
    title: "Workplace Safety",
    short: "Learn essential safety practices.",
    full: [
      "Workplace safety includes knowing emergency exits and procedures.",
      "Employees should report unsafe conditions immediately.",
      "Proper safety practices prevent accidents and protect colleagues.",
      "Safety knowledge builds leadership and career growth in management roles.",
    ],
    image: safetyImg,
    videos: ["https://youtu.be/wujRww8jMJE"], // ✅ Workplace Safety
  },
];

export default function Dashboard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const awarenessProgress = 65;
  const user = useAuthStore((state) => state.user);
  const userName = user?.name || "User";

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}</h1>
        <p className="text-muted-foreground">
          Learn and stay aware of essential policies and global trends
        </p>
      </div>

      {/* Awareness Progress */}
      <Card className="bg-gradient-to-r from-green-100 to-blue-100">
        <CardHeader>
          <CardTitle>Awareness Progress</CardTitle>
          <CardDescription>Completed training count: 5</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{awarenessProgress}%</div>
          <Progress value={awarenessProgress} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Keep learning to stay fully aware and compliant!
          </p>
        </CardContent>
      </Card>

      {/* Policies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {policies.map((policy) => (
          <Card key={policy.title} className="shadow-lg">
            <CardHeader>
              <CardTitle>{policy.title}</CardTitle>
              <CardDescription>{policy.short}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={policy.image}
                alt={policy.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />

              {/* Expanded Section */}
              {expanded === policy.title ? (
                <div className="space-y-3 text-gray-700 mb-3">
                  {policy.full.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}

                  {/* 🎥 Multimedia Section */}
                  <div className="mt-4 space-y-4">
                    <h3 className="text-lg font-semibold mb-2">
                      🎥 Multimedia Study
                    </h3>
                    {policy.videos && policy.videos.length > 0 ? (
                      policy.videos.map((video, i) => (
                        <iframe
                          key={i}
                          width="100%"
                          height="220"
                          src={getYouTubeEmbedUrl(video)}
                          title={`${policy.title} video ${i + 1}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        📌 Video coming soon for this section.
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Expand Button */}
              <Button
                onClick={() =>
                  setExpanded(expanded === policy.title ? null : policy.title)
                }
              >
                {expanded === policy.title ? "Hide" : "Study Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
