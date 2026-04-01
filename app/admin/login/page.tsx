// 'use client';

// import React, { useState } from 'react';
// import { useUser } from '@/lib/context/UserContext';
// import { login as loginService } from '@/lib/services/authService';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'sonner';

// export default function AdminLogin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();
//   const { setToken, fetchProfile, user, loading } = useUser();

//   // Redirect if already logged in
//   React.useEffect(() => {
//     if (!loading && user) {
//       router.replace('/admin/dashboard');
//     }
//   }, [loading, user, router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error('Please fill in all fields');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const data = await loginService(email, password);
//       setToken(data.token);
//       if (typeof window !== 'undefined') localStorage.setItem('token', data.token);
//       await fetchProfile(data.token);
//       toast.success('Login successful!');
//       router.push('/admin/dashboard');
//     } catch (error: any) {
//       console.error('Login error:', error);
//       toast.error(error.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/20 via-white to-secondary/20 p-6">
//       <Card className="w-full max-w-md border-none shadow-2xl rounded-3xl overflow-hidden">
//         {/* Header with Original Theme Gradient */}
//         <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white flex flex-col items-center py-10 relative">

//           {/* White Glow/Container for Logo Visibility */}
//           <div className="mb-6 bg-white p-3 rounded-2xl shadow-inner-lg transform transition-hover hover:scale-105 duration-300">
//             <img
//               src="/logo.jpg"
//               alt="Meridian's Logo"
//               className="w-40 h-auto mx-auto object-contain"
//             />
//           </div>

//           <div className="text-center space-y-1">
//             <CardTitle className="text-2xl font-extrabold tracking-tight uppercase">
//               Meridian's Admin
//             </CardTitle>
//             <p className="text-xs font-medium opacity-80 tracking-widest uppercase">
//               Standard of Excellence
//             </p>
//           </div>
//         </CardHeader>

//         <CardContent className="pt-10 pb-8 px-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-primary font-bold text-sm ml-1">
//                 Admin Email
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="admin@meridians.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isLoading}
//                 className="h-12 border-slate-200 rounded-xl focus:ring-primary focus:border-primary transition-all shadow-sm"
//               />
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between items-center ml-1">
//                 <Label htmlFor="password" className="text-primary font-bold text-sm">
//                   Password
//                 </Label>
//               </div>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={isLoading}
//                 className="h-12 border-slate-200 rounded-xl focus:ring-primary focus:border-primary transition-all shadow-sm"
//               />
//             </div>

//             <Button
//               type="submit"
//               disabled={isLoading}
//               className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
//                   Signing in...
//                 </>
//               ) : (
//                 'Sign In'
//               )}
//             </Button>
//           </form>

//           {/* Footer Note */}
//           <div className="mt-10 border-t border-slate-100 pt-6">
//              <p className="text-center text-[10px] text-slate-400 font-semibold tracking-tighter uppercase">
//                "Walidain ka Aitmad, Meridians ka Meyar"
//              </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { useUser } from "@/lib/context/UserContext";
import { login as loginService } from "@/lib/services/authService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setToken, fetchProfile, user, loading } = useUser();

  React.useEffect(() => {
    if (!loading && user) {
      router.replace("/admin/dashboard");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const data = await loginService(email, password);
      setToken(data.token);
      if (typeof window !== "undefined")
        localStorage.setItem("token", data.token);
      await fetchProfile(data.token);
      toast.success("Login successful!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <Card className="w-full max-w-sm border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Header: Zero Padding Top - Seedha Gradient */}
        <div className="pt-6 pb-4 flex flex-col items-center w-full">
          {/* Logo Container - Pure Visible */}
          <div className="mb-3 p-2 transition-transform hover:scale-105">
            <img
              src="/logo.jpg"
              alt="Meridian's Logo"
              className="w-32 h-auto object-contain"
            />
          </div>

          <div className="text-center text-primary">
            <h2 className="text-lg font-bold tracking-tight uppercase">
              Admin Login
            </h2>
            <p className="text-[9px] font-medium opacity-70 tracking-[0.2em] uppercase">
              Meridian's Standard
            </p>
          </div>
        </div>

        {/* Form Body: Extra compact height */}
        <CardContent className="pt-5 pb-4 px-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label
                htmlFor="email"
                className="text-primary font-bold text-[11px] ml-1 uppercase"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@meridians.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-9 border-slate-200 rounded-md focus:ring-primary text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-primary font-bold text-[11px] ml-1 uppercase"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="h-9 border-slate-200 rounded-md focus:ring-primary text-sm pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold rounded-md shadow-md transition-all active:scale-95 mt-2"
            >
              {isLoading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>

          {/* Tagline footer - very small to save height */}
          <p className="mt-4 text-center text-[8px] text-slate-400 font-bold uppercase tracking-tighter">
            "Walidain ka Aitmad, Meridians ka Meyar"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
