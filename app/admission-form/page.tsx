"use client";

import { useRouter } from "next/navigation";

import { AnimatedSection } from "@/components/AnimatedSection";

import { Navbar } from "@/components/Navbar";

import { PageHero } from "@/components/PageHero";

import { Footer } from "@/components/Footer";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState, useEffect } from "react";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  FileText,
  ArrowRight,
  ClipboardCheck,
  Users,
  Phone,
  User,
  UserCircle,
  Mail,
  Home,
  Calendar,
  CreditCard,
  Smartphone,
  BookOpen,
  Clock,
  GraduationCap,
  Upload,
  X,
  File,
} from "lucide-react";

import { API_ADMISSION, API_CLASSES, API_ADMISSION_GO_TO_TEST, PAGE_TEST_BY_ID, PAGE_TEST_NEW } from "@/lib/api/endpoints";

const PROGRAMS = [
  "Primary (Classes 1-5)",

  "Secondary (Classes 6-8)",

  "Senior Secondary (Classes 9-12)",
];

const INITIAL_FORM_DATA = {
  // Personal Info

  studentName: "",

  fatherName: "",

  fatherEmail: "",

  homeAddress: "",

  dob: "",

  fatherCnic: "",

  fatherContact: "",

  // Academic Info

  program: "",

  shift: "",

  class: "",

  classId: "",

  // Additional

  message: "",
};

const MAX_DOCUMENTS = 2;

export default function AdmissionForm() {
  const router = useRouter();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [documents, setDocuments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoTestDialog, setShowNoTestDialog] = useState(false);
  const [noTestClass, setNoTestClass] = useState("");

  const [activeTab, setActiveTab] = useState<
    "personal" | "academic" | "documents"
  >("personal");

  const [classes, setClasses] = useState<
    { _id: string; name: string; fees?: number }[]
  >([]);

  const [classesLoading, setClassesLoading] = useState(true);

  // Fetch active classes from API

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_CLASSES);

        if (response.ok) {
          const data = await response.json();

          setClasses(data);
        } else {
          toast.error("Failed to load classes");
        }
      } catch (error) {
        console.error("Error fetching classes:", error);

        toast.error("Failed to load classes");
      } finally {
        setClassesLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // CNIC auto-format: XXXXX-XXXXXXX-X

  const formatCNIC = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 13);

    if (digits.length <= 5) return digits;

    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`;

    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
  };

  // Father Contact: max 9 digits

  const formatFatherContact = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 9);

    return digits;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "fatherCnic") {
      setFormData((prev) => ({
        ...prev,

        [name]: formatCNIC(value),
      }));

      return;
    }

    if (name === "fatherContact") {
      setFormData((prev) => ({
        ...prev,

        [name]: formatFatherContact(value),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProgramChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,

      program: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = formData.studentName.trim();

    const className = formData.class.trim();

    const contact1 = formData.fatherContact
      ? `03${formData.fatherContact}`
      : "";

    const parentEmail = formData.fatherEmail.trim().toLowerCase();

    const program = formData.program;

    if (!name || !className || !contact1 || !parentEmail || !program) {
      toast.error("Please fill in all required fields");

      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append form fields

      formDataToSend.append("name", name);

      formDataToSend.append("class", className);

      formDataToSend.append("contact1", contact1);

      formDataToSend.append("parentEmail", parentEmail);

      formDataToSend.append("program", program);

      formDataToSend.append("fatherName", formData.fatherName.trim());

      formDataToSend.append("fatherCnic", formData.fatherCnic.trim());

      formDataToSend.append("homeAddress", formData.homeAddress.trim());

      formDataToSend.append("dob", formData.dob);

      formDataToSend.append("shift", formData.shift);

      formDataToSend.append("message", formData.message.trim());

      // Append files if they exist

      if (documents[0]) {
        formDataToSend.append("document1", documents[0]);
      }

      if (documents[1]) {
        formDataToSend.append("document2", documents[1]);
      }

      const response = await fetch(API_ADMISSION, {
        method: "POST",

        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();

        // Handle different response statuses

        if (data.status === "already_admitted") {
          toast.error(
            data.message || "You have already passed the admission test.",
          );
        } else if (data.status === "retake_allowed") {
          toast.success(data.message || "You can now retake the test.");

          // Redirect to test page with admission ID

          if (data.id) {
            router.push(PAGE_TEST_BY_ID(data.id));
          }
        } else if (data.status === "continue_test") {
          toast.success(data.message || "Please complete your test.");

          // Redirect to test page with admission ID

          if (data.id) {
            router.push(PAGE_TEST_BY_ID(data.id));
          }
        } else if (data.id) {
          // New admission - redirect to test page

          toast.success(
            data.message || "Application submitted! Starting your test...",
          );

          router.push(PAGE_TEST_BY_ID(data.id));
        } else {
          toast.success(data.message || "Application submitted successfully!");

          setFormData(INITIAL_FORM_DATA);

          setDocuments([]);
        }
      } else {
        const data = await response.json().catch(() => ({}));

        toast.error(
          data?.error || "Failed to submit application. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      toast.error("Error submitting application. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start Admission Test - save form to localStorage and redirect to test

  const handleStartTest = async () => {
    // Validate required fields

    if (
      !formData.studentName.trim() ||
      !formData.class ||
      !formData.fatherContact.trim() ||
      !formData.fatherEmail.trim()
    ) {
      toast.error(
        "Please fill in all required fields (Name, Class, Contact, Email)",
      );

      return;
    }

    setIsLoading(true);

    try {
      // First check if test is available for this class
      const testCheckRes = await fetch(API_ADMISSION_GO_TO_TEST(formData.class));
      
      if (!testCheckRes.ok) {
        if (testCheckRes.status === 404) {
          setNoTestClass(formData.class);
          setShowNoTestDialog(true);
          setIsLoading(false);
          return; // Stay on admission form, don't redirect
        }
        throw new Error('Failed to check test availability');
      }

      // Save form data to localStorage with class info

      localStorage.setItem(
        "admissionFormData",
        JSON.stringify({
          ...formData,

          documents: documents.map((f) => ({
            name: f.name,
            type: f.type,
            size: f.size,
          })),
        }),
      );

      // Redirect to test page with student info - test will be fetched there
      const queryParams = new URLSearchParams({
        studentName: formData.studentName,
        class: formData.class
      }).toString();
      
      router.push(`${PAGE_TEST_NEW}?${queryParams}`);
    } catch (error: any) {
      toast.error(error.message || "Error starting test. Please try again.");

      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Admission Portal"
        titleMain="Apply"
        titleAccent="Now"
        image="https://images.unsplash.com/photo-1510531704581-5b2870972060?auto=format&fit=crop&w=1920&q=80"
        description="Begin your child's journey towards excellence. Fill out the application form below to get started."
        compact
      />

      <section className="py-10 bg-background relative overflow-hidden">
        {/* Background Decorative Elements */}

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
            {/* Left Column: Form */}

            <div className="lg:col-span-7">
              <AnimatedSection direction="left">
                <div className="relative p-1 rounded-[40px] bg-linear-to-br from-primary/20 via-transparent to-secondary/20 shadow-2xl">
                  <Card className="border-none rounded-[39px] bg-card/80 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="px-8 pt-8 md:px-12 ">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                          <FileText className="w-6 h-6" />
                        </div>

                        <div>
                          <CardTitle className="text-3xl font-black tracking-tight">
                            Application Form
                          </CardTitle>

                          <p className="text-muted-foreground mt-1 font-medium">
                            Join the Meridian's legacy today.
                          </p>
                        </div>
                      </div>

                      <div className="h-px w-full bg-linear-to-r from-primary/10 via-primary/20 to-transparent" />
                    </CardHeader>

                    <CardContent className="px-6 pb-6 md:px-10 md-pb-10 pt-0">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tabs Navigation */}

                        <div className="flex border-b border-primary/20 -mx-6 px-6 mb-6">
                          <button
                            type="button"
                            onClick={() => setActiveTab("personal")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                              activeTab === "personal"
                                ? "text-primary border-b-2 border-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <User className="w-4 h-4 mr-2 inline" />
                            Personal Info
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab("academic")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                              activeTab === "academic"
                                ? "text-primary border-b-2 border-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <GraduationCap className="w-4 h-4 mr-2 inline" />
                            Academic
                          </button>

                          <button
                            type="button"
                            onClick={() => setActiveTab("documents")}
                            className={`flex-1 py-3 text-sm font-medium transition-colors ${
                              activeTab === "documents"
                                ? "text-primary border-b-2 border-primary bg-primary/5"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <FileText className="w-4 h-4 mr-2 inline" />
                            Documents{" "}
                            {documents.length > 0 && `(${documents.length})`}
                          </button>
                        </div>

                        {/* Tab Content */}

                        <div>
                          {activeTab === "personal" && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <User className="w-5 h-5 text-primary" />
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-bold text-foreground">
                                      Personal Information
                                    </h3>

                                    <p className="text-xs text-muted-foreground">
                                      Student and guardian details
                                    </p>
                                  </div>
                                </div>

                                <div className="h-px w-full bg-linear-to-r from-primary/20 via-primary/10 to-transparent mb-4" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="studentName"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Student Name{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>

                                    <div className="relative">
                                      <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                                      <Input
                                        id="studentName"
                                        name="studentName"
                                        type="text"
                                        value={formData.studentName}
                                        onChange={handleChange}
                                        placeholder="Enter student's full name"
                                        required
                                        className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 pl-12"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="fatherName"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Father Name
                                    </Label>

                                    <div className="relative">
                                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                                      <Input
                                        id="fatherName"
                                        name="fatherName"
                                        type="text"
                                        value={formData.fatherName}
                                        onChange={handleChange}
                                        placeholder="Enter father's name"
                                        className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 pl-12"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="fatherEmail"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Father Email{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>

                                    <div className="relative">
                                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                                      <Input
                                        id="fatherEmail"
                                        name="fatherEmail"
                                        type="email"
                                        value={formData.fatherEmail}
                                        onChange={handleChange}
                                        placeholder="father@email.com"
                                        required
                                        className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 pl-12"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="fatherContact"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Father Contact{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>

                                    <div className="relative flex items-center">
                                      <span className="absolute left-4 text-sm font-semibold text-muted-foreground">
                                        +92
                                      </span>

                                      <Smartphone className="absolute left-14 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                                      <Input
                                        id="fatherContact"
                                        name="fatherContact"
                                        type="text"
                                        value={formData.fatherContact}
                                        onChange={handleChange}
                                        placeholder="3XX-XXXXXXX"
                                        required
                                        maxLength={9}
                                        className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 pl-22"
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2.5">
                                  <Label
                                    htmlFor="homeAddress"
                                    className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                  >
                                    Home Address
                                  </Label>

                                  <div className="relative">
                                    <Home className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />

                                    <Textarea
                                      id="homeAddress"
                                      name="homeAddress"
                                      value={formData.homeAddress}
                                      onChange={handleChange}
                                      placeholder="Enter complete home address"
                                      rows={2}
                                      className="rounded-[24px] border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 min-h-[80px] pl-12 pt-3"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="dob"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Date of Birth
                                    </Label>

                                    <div className="relative">
                                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                                      <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        max={
                                          new Date().toISOString().split("T")[0]
                                        }
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 pl-12"
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="fatherCnic"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Father CNIC
                                    </Label>

                                    <div className="relative">
                                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

                                      <Input
                                        id="fatherCnic"
                                        name="fatherCnic"
                                        type="text"
                                        value={formData.fatherCnic}
                                        onChange={handleChange}
                                        placeholder="XXXXX-XXXXXXX-X"
                                        maxLength={15}
                                        className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 pl-12 font-mono"
                                      />
                                    </div>

                                    <p className="text-[10px] text-muted-foreground ml-1">
                                      Format: 00000-0000000-0
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === "academic" && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-bold text-foreground">
                                      Academic Information
                                    </h3>

                                    <p className="text-xs text-muted-foreground">
                                      Program and class details
                                    </p>
                                  </div>
                                </div>

                                <div className="h-px w-full bg-linear-to-r from-primary/20 via-primary/10 to-transparent mb-4" />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2.5 md:col-span-2">
                                    <Label
                                      htmlFor="program"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Program{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>

                                    <Select
                                      value={formData.program}
                                      onValueChange={handleProgramChange}
                                    >
                                      <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all w-full">
                                        <div className="flex items-center gap-2">
                                          <BookOpen className="w-5 h-5 text-muted-foreground" />

                                          <SelectValue placeholder="Select program" />
                                        </div>
                                      </SelectTrigger>

                                      <SelectContent className="rounded-2xl border-primary/10">
                                        {PROGRAMS.map((program) => (
                                          <SelectItem
                                            key={program}
                                            value={program}
                                            className="rounded-xl my-1 focus:bg-primary/5 focus:text-primary transition-colors"
                                          >
                                            {program}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="shift"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Shift
                                    </Label>

                                    <Select
                                      value={formData.shift}
                                      onValueChange={(value) =>
                                        setFormData((prev) => ({
                                          ...prev,

                                          shift: value,
                                        }))
                                      }
                                    >
                                      <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all">
                                        <div className="flex items-center gap-2">
                                          <Clock className="w-5 h-5 text-muted-foreground" />

                                          <SelectValue placeholder="Select shift" />
                                        </div>
                                      </SelectTrigger>

                                      <SelectContent className="rounded-2xl border-primary/10">
                                        <SelectItem
                                          value="Morning"
                                          className="rounded-xl my-1"
                                        >
                                          Morning
                                        </SelectItem>

                                        <SelectItem
                                          value="Evening"
                                          className="rounded-xl my-1"
                                        >
                                          Evening
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2.5">
                                    <Label
                                      htmlFor="class"
                                      className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                    >
                                      Class{" "}
                                      <span className="text-destructive">
                                        *
                                      </span>
                                    </Label>

                                    <Select
                                      value={formData.class}
                                      onValueChange={(value) =>
                                        setFormData((prev) => ({
                                          ...prev,

                                          class: value,
                                        }))
                                      }
                                      disabled={classesLoading}
                                    >
                                      <SelectTrigger className="h-14 rounded-2xl border-primary/10 bg-primary/5 focus:bg-white transition-all">
                                        <div className="flex items-center gap-2">
                                          <BookOpen className="w-5 h-5 text-muted-foreground" />

                                          <SelectValue
                                            placeholder={
                                              classesLoading
                                                ? "Loading classes..."
                                                : "Select class"
                                            }
                                          />
                                        </div>
                                      </SelectTrigger>

                                      <SelectContent className="rounded-2xl border-primary/10 max-h-[200px]">
                                        {classes.map((cls) => (
                                          <SelectItem
                                            key={cls._id}
                                            value={cls.name}
                                            className="rounded-xl my-1 focus:bg-primary/5 focus:text-primary transition-colors"
                                          >
                                            {cls.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {activeTab === "documents" && (
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                  </div>

                                  <div>
                                    <h3 className="text-lg font-bold text-foreground">
                                      Documents
                                    </h3>

                                    <p className="text-xs text-muted-foreground">
                                      Upload required documents (Max: 2)
                                    </p>
                                  </div>
                                </div>

                                <div className="h-px w-full bg-linear-to-r from-primary/20 via-primary/10 to-transparent mb-4" />

                                {/* Document 1 */}

                                <div className="space-y-3">
                                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Document 1
                                  </Label>

                                  <div
                                    className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
                                      documents[0]
                                        ? "border-emerald-300 bg-emerald-50/50"
                                        : "border-primary/20 bg-primary/5 hover:border-primary/40"
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (file) {
                                          setDocuments((prev) => {
                                            const newDocs = [...prev];

                                            newDocs[0] = file;

                                            return newDocs;
                                          });

                                          toast.success("Document 1 added");
                                        }
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                          documents[0]
                                            ? "bg-emerald-100"
                                            : "bg-primary/10"
                                        }`}
                                      >
                                        {documents[0] ? (
                                          <File className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                          <Upload className="w-5 h-5 text-primary" />
                                        )}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        {documents[0] ? (
                                          <>
                                            <p className="text-sm font-medium text-foreground truncate">
                                              {documents[0].name}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                              {(
                                                documents[0].size / 1024
                                              ).toFixed(1)}{" "}
                                              KB
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p className="text-sm font-medium text-foreground">
                                              Click to upload Document 1
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                              PDF, JPG, PNG up to 5MB
                                            </p>
                                          </>
                                        )}
                                      </div>

                                      {documents[0] && (
                                        <button
                                          type="button"
                                          onClick={() => removeDocument(0)}
                                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                                        >
                                          <X className="w-4 h-4 text-destructive" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Document 2 */}

                                <div className="space-y-3">
                                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                                    Document 2
                                  </Label>

                                  <div
                                    className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${
                                      documents[1]
                                        ? "border-emerald-300 bg-emerald-50/50"
                                        : "border-primary/20 bg-primary/5 hover:border-primary/40"
                                    }`}
                                  >
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];

                                        if (file) {
                                          setDocuments((prev) => {
                                            const newDocs = [...prev];

                                            newDocs[1] = file;

                                            return newDocs;
                                          });

                                          toast.success("Document 2 added");
                                        }
                                      }}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />

                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                          documents[1]
                                            ? "bg-emerald-100"
                                            : "bg-primary/10"
                                        }`}
                                      >
                                        {documents[1] ? (
                                          <File className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                          <Upload className="w-5 h-5 text-primary" />
                                        )}
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        {documents[1] ? (
                                          <>
                                            <p className="text-sm font-medium text-foreground truncate">
                                              {documents[1].name}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                              {(
                                                documents[1].size / 1024
                                              ).toFixed(1)}{" "}
                                              KB
                                            </p>
                                          </>
                                        ) : (
                                          <>
                                            <p className="text-sm font-medium text-foreground">
                                              Click to upload Document 2
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                              PDF, JPG, PNG up to 5MB
                                            </p>
                                          </>
                                        )}
                                      </div>

                                      {documents[1] && (
                                        <button
                                          type="button"
                                          onClick={() => removeDocument(1)}
                                          className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                                        >
                                          <X className="w-4 h-4 text-destructive" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2.5 pt-4">
                                  <Label
                                    htmlFor="message"
                                    className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1"
                                  >
                                    Additional Information (Optional)
                                  </Label>

                                  <Textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Any additional information you'd like to share..."
                                    rows={3}
                                    className="rounded-[24px] border-primary/10 bg-primary/5 focus:bg-white transition-all focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Navigation Buttons */}

                        <div className="flex gap-3 pt-6 border-t border-primary/10">
                          {activeTab !== "personal" && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (activeTab === "academic")
                                  setActiveTab("personal");

                                if (activeTab === "documents")
                                  setActiveTab("academic");
                              }}
                              className="flex-1 h-12 rounded-xl"
                            >
                              Previous
                            </Button>
                          )}

                          {activeTab === "personal" && (
                            <Button
                              type="button"
                              onClick={() => setActiveTab("academic")}
                              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/95"
                            >
                              Next: Academic Info
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}

                          {activeTab === "academic" && (
                            <Button
                              type="button"
                              onClick={() => setActiveTab("documents")}
                              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/95"
                            >
                              Next: Documents
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}

                          {activeTab === "documents" && (
                            <Button
                              type="button"
                              disabled={isLoading}
                              onClick={handleStartTest}
                              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/95 text-white font-black text-lg shadow-xl shadow-primary/20"
                            >
                              {isLoading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                  Starting Test...
                                </div>
                              ) : (
                                <span className="flex items-center gap-2">
                                  Start Admission Test
                                  <ArrowRight className="w-4 h-4" />
                                </span>
                              )}
                            </Button>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground text-center font-medium max-w-lg mx-auto leading-relaxed">
                          By clicking submit, you agree to our terms of
                          enrollment. Our admissions office will process your
                          data securely and contact you within 48 hours.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            </div>

            {/* Right Column: Info Cards */}

            <div className="lg:col-span-5 space-y-10">
              <AnimatedSection direction="right">
                <div className="mb-10">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    Student Portal
                  </span>

                  <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight mb-6">
                    Start Your <br />
                    <span className="text-primary italic font-serif">
                      Journey
                    </span>{" "}
                    Here
                  </h2>

                  <p className="text-muted-foreground leading-relaxed font-medium">
                    We've simplified our admission process to ensure a
                    stress-free experience for parents and students alike.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: "Quick Review",

                      content:
                        "Our team reviews every application individually to ensure it matches our academic standards.",

                      icon: ClipboardCheck,
                    },

                    {
                      title: "Document Support",

                      content:
                        "Need help with certificates? Our helpdesk is available 24/7 to guide you through the paperwork.",

                      icon: FileText,
                    },

                    {
                      title: "Campus Visit",

                      content:
                        "After form submission, we'll schedule a personalized campus tour for you and your child.",

                      icon: Users,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="group flex gap-6 p-6 rounded-[32px] bg-card border border-primary/5 hover:border-primary/20 hover:shadow-2xl transition-all duration-500"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <item.icon className="w-6 h-6 text-primary group-hover:text-white" />
                      </div>

                      <div>
                        <h4 className="text-xl font-black mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>

                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Support Box */}

                <div className="mt-12 p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />

                  <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-4">
                      Need Immediate Help?
                    </h4>

                    <p className="text-white/60 mb-8 text-sm leading-relaxed">
                      Our admission counselors are just a call away. We're here
                      to answer any questions about fee structure, curriculum,
                      or facilities.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                        <Phone className="w-4 h-4 text-secondary" />

                        <span className="text-sm font-bold">0303 3569000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* No Test Available Dialog */}
      <AlertDialog open={showNoTestDialog} onOpenChange={setShowNoTestDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Test Not Available</AlertDialogTitle>
            <AlertDialogDescription>
              No admission test is available for "{noTestClass}" at this time. 
              Please contact support or try selecting a different class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => router.push("/")}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
