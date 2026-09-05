"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API_ADMISSION, PAGE_TEST_BY_ID } from "@/lib/api/endpoints";
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Printer,
  RotateCcw,
  GraduationCap,
  CreditCard,
  FileCheck,
  Loader2,
} from "lucide-react";

/* ---------------- CONSTANTS & PROGRAM DATA ---------------- */

interface ProgramData {
  label: string;
  desc: string;
  classes?: string[];
  hasGroup?: boolean;
  groupKey?: string;
  isCourse?: boolean;
}

const PROGRAMS: Record<string, ProgramData> = {
  preschool: {
    label: "Pre-School & Kindergarten",
    desc: "Playgroup, Nursery, Kindergarten (KG-I, KG-II)",
    classes: ["Playgroup", "Nursery", "KG-I", "KG-II"],
  },
  primary: {
    label: "Primary Section",
    desc: "Class 1st to Class 5th (Foundation years)",
    classes: ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"],
  },
  middle: {
    label: "Middle Section",
    desc: "Class 6th to Class 8th (Lower secondary)",
    classes: ["Class 6", "Class 7", "Class 8"],
  },
  matric: {
    label: "Matriculation (SSC)",
    desc: "Class 9th & 10th (Sindh / Federal Board)",
    classes: ["Class 9 (SSC-I)", "Class 10 (SSC-II)"],
    hasGroup: true,
    groupKey: "matric",
  },
  inter: {
    label: "Intermediate (HSC)",
    desc: "Class 11th & 12th (Pre-Med, Pre-Eng, Comp)",
    classes: ["Class 11 (HSC-I)", "Class 12 (HSC-II)"],
    hasGroup: true,
    groupKey: "inter",
  },
  short_courses: {
    label: "Short Computer Courses",
    desc: "CIT, Web Dev, Graphic Design, Office Auto",
    classes: [
      "CIT (Certificate in IT)",
      "Web Development",
      "Graphic Designing",
      "Office Automation",
    ],
    isCourse: true,
  },
};

const COURSES = [
  { name: "Certificate in IT (CIT)", duration: "3 Months" },
  { name: "Web Development", duration: "6 Months" },
  { name: "Graphic Designing", duration: "3 Months" },
  { name: "Office Automation", duration: "2 Months" },
];

const GROUPS: Record<string, string[]> = {
  matric: ["Computer Science", "Bio Science", "General Science"],
  inter: ["Pre-Engineering", "Pre-Medical", "Computer Science", "Commerce"],
};

const COMPULSORY_SUBJECTS = ["English", "Urdu", "Islamiat", "Pakistan Studies"];

const ELECTIVES: Record<string, string[]> = {
  "Computer Science": ["Physics", "Mathematics", "Computer Science"],
  "Bio Science": ["Physics", "Chemistry", "Biology"],
  "General Science": ["General Math", "General Science", "Economics"],
  "Pre-Engineering": ["Physics", "Chemistry", "Mathematics"],
  "Pre-Medical": ["Physics", "Chemistry", "Biology"],
  Commerce: [
    "Principles of Accounting",
    "Principles of Commerce",
    "Banking",
    "Commercial Geography",
  ],
};


export default function AdmissionFormPage() {
  const router = useRouter();

  // Wizard Step (1, 2, 3)
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const [submittedAdmissionId, setSubmittedAdmissionId] = useState<string | null>(null);

  // Generate Reference ID on client mount
  useEffect(() => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    setRefId(`MSS-${random6}`);
  }, []);

  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [dob, setDob] = useState("");
  const [studentCnic, setStudentCnic] = useState("");
  const [gender, setGender] = useState("Male");
  const [nationality, setNationality] = useState("Pakistani");
  const [religion, setReligion] = useState("Muslim");

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [diffPermanent, setDiffPermanent] = useState(false);
  const [permanentAddress, setPermanentAddress] = useState("");

  const [submitter, setSubmitter] = useState("Parent");
  const [relation, setRelation] = useState("");
  const [guardianCnic, setGuardianCnic] = useState("");
  const [occupation, setOccupation] = useState("Govt. Employed");
  const [guardianMobile, setGuardianMobile] = useState("");

  /* ---------------- STEP 2: ACADEMIC INFO STATE ---------------- */
  const [selectedProgram, setSelectedProgram] = useState("matric");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedElectives, setSelectedElectives] = useState<string[]>([]);
  const [courseDuration, setCourseDuration] = useState("");
  const [shift, setShift] = useState("Morning");

  /* ---------------- STEP 3: DOCUMENTS & DECLARATION ---------------- */
  const [docPhoto, setDocPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [docBform, setDocBform] = useState<File | null>(null);
  const [bformPreview, setBformPreview] = useState<string | null>(null);
  const [docFatherCnic, setDocFatherCnic] = useState<File | null>(null);
  const [fatherCnicPreview, setFatherCnicPreview] = useState<string | null>(null);
  const [docResult, setDocResult] = useState<File | null>(null);

  const [additionalInfo, setAdditionalInfo] = useState("");
  const [agreeRules, setAgreeRules] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------------- FORMATTERS ---------------- */
  const handleCnicChange = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let digits = val.replace(/\D/g, "").slice(0, 13);
    if (digits.length > 12) {
      digits = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    } else if (digits.length > 5) {
      digits = `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    setter(digits);
  };

  const handlePhoneChange = (
    val: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    let digits = val.replace(/\D/g, "").slice(0, 10);
    if (digits.length > 3) {
      digits = `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    setter(digits);
  };


  /* ---------------- PROGRAM & GROUP HANDLERS ---------------- */
  const handleProgramSelect = (key: string) => {
    setSelectedProgram(key);
    setSelectedClass("");
    setSelectedGroup("");
    setSelectedElectives([]);
    setCourseDuration("");
  };

  const handleGroupChange = (grp: string) => {
    setSelectedGroup(grp);
    if (ELECTIVES[grp]) {
      setSelectedElectives([...ELECTIVES[grp]]);
    } else {
      setSelectedElectives([]);
    }
  };

  const toggleElective = (sub: string) => {
    setSelectedElectives((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  /* ---------------- FILE HANDLERS ---------------- */
  const handleFileChange = (
    file: File | null,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    previewSetter?: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name} is too large. Max allowed size is 5MB.`);
      return;
    }
    setter(file);
    if (previewSetter && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => previewSetter(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  /* ---------------- VALIDATION ---------------- */
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!studentName.trim()) errs.studentName = "Student full name is required.";
    if (!fatherName.trim()) errs.fatherName = "Father's full name is required.";
    if (!dob) errs.dob = "Date of birth is required.";
    if (!mobile.trim()) errs.mobile = "Mobile number is required.";
    if (!email.trim() || !email.includes("@"))
      errs.email = "A valid email address is required.";
    if (!presentAddress.trim())
      errs.presentAddress = "Present address is required.";
    if (!guardianCnic.trim())
      errs.guardianCnic = "Parent/Guardian CNIC is required.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fill in all required fields in Step 1.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!selectedProgram) errs.program = "Please select a program.";
    if (!selectedClass) errs.class = "Please select a class or course.";
    if (PROGRAMS[selectedProgram]?.hasGroup && !selectedGroup) {
      errs.group = "Please select a group.";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please complete all academic selections.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    const errs: Record<string, string> = {};
    if (!docPhoto) errs.docPhoto = "Passport photograph is required.";
    if (!docBform) errs.docBform = "B-Form / CNIC copy is required.";
    if (!docFatherCnic)
      errs.docFatherCnic = "Father's CNIC copy is required.";
    if (!agreeRules)
      errs.agreeRules = "You must agree to the institutional rules.";

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please provide all required documents and declarations.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- FORM SUBMISSION ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("source", "school");
      formDataToSend.append("admissionNo", refId);
      formDataToSend.append("studentName", studentName);
      formDataToSend.append("fatherName", fatherName);
      formDataToSend.append("dob", dob);
      formDataToSend.append("studentCnic", studentCnic);
      formDataToSend.append("gender", gender);
      formDataToSend.append("nationality", nationality);
      formDataToSend.append("religion", religion);
      formDataToSend.append("fatherContact", `+92-${mobile}`);
      formDataToSend.append("email", email);
      formDataToSend.append("homeAddress", presentAddress);
      formDataToSend.append(
        "permanentAddress",
        diffPermanent ? permanentAddress : presentAddress
      );
      formDataToSend.append("submitter", submitter);
      formDataToSend.append("relation", relation);
      formDataToSend.append("fatherCnic", guardianCnic);
      formDataToSend.append("occupation", occupation);
      formDataToSend.append("guardianMobile", guardianMobile ? `+92-${guardianMobile}` : "");

      // Academic info
      formDataToSend.append("program", PROGRAMS[selectedProgram]?.label || selectedProgram);
      formDataToSend.append("class", selectedClass);
      formDataToSend.append("group", selectedGroup);
      formDataToSend.append("selectedElectives", JSON.stringify(selectedElectives));
      formDataToSend.append("courseDuration", courseDuration);
      formDataToSend.append("shift", shift);

      // Documents
      if (docPhoto) formDataToSend.append("documents", docPhoto);
      if (docBform) formDataToSend.append("documents", docBform);
      if (docFatherCnic) formDataToSend.append("documents", docFatherCnic);
      if (docResult) formDataToSend.append("documents", docResult);

      // Additional info
      formDataToSend.append("message", additionalInfo);

      const response = await fetch(API_ADMISSION, {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedAdmissionId(data.id || data._id || null);
        setIsSubmitted(true);
        toast.success("Application submitted successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.error || "Failed to submit admission application.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F6F8] text-[#132A4C] antialiased selection:bg-[#AD8A4E]/20">
      <Navbar />

      <main className="flex-1 pt-28 pb-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* ================= MASTHEAD ================= */}
        <div className="relative overflow-hidden bg-[#132A4C] text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl border border-[#132A4C]/20">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-radial from-[#AD8A4E]/30 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/logo.jpg"
                  alt="Meridian's Logo"
                  width={52}
                  height={52}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
                  Meridian&apos;s School System
                </h1>
                <p className="text-xs sm:text-sm text-[#C9D2E0] mt-1 font-medium">
                  Admission &amp; Enrollment Portal — Academic Session 2026&ndash;27
                </p>
              </div>
            </div>

            <div className="text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
              <div className="text-xs text-[#C9D2E0] font-medium">
                Application Reference
              </div>
              <div className="font-mono text-sm sm:text-base font-bold text-[#D9BE8A] mt-0.5 tracking-wider">
                {refId || "Generating…"}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Stepper Sidebar */}
            <aside className="lg:col-span-4 bg-white border border-[#DDE2EA] rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="space-y-6">
                {/* Step 1 Item */}
                <div
                  onClick={() => currentStep > 1 && setCurrentStep(1)}
                  className={`flex items-start gap-4 p-2 rounded-xl transition-colors ${
                    currentStep === 1
                      ? "bg-[#FBF4E7]/60"
                      : currentStep > 1
                      ? "cursor-pointer hover:bg-slate-50"
                      : "opacity-60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 border transition-all ${
                      currentStep === 1
                        ? "border-[#AD8A4E] bg-[#D9BE8A] text-[#132A4C]"
                        : currentStep > 1
                        ? "border-[#2F6F4E] bg-[#2F6F4E] text-white"
                        : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                    }`}
                  >
                    {currentStep > 1 ? "✓" : "1"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#132A4C]">
                      Personal Info
                    </div>
                    <div className="text-xs text-[#3A4A66] mt-0.5">
                      Student &amp; guardian details
                    </div>
                  </div>
                </div>

                {/* Step 2 Item */}
                <div
                  onClick={() => currentStep > 2 && setCurrentStep(2)}
                  className={`flex items-start gap-4 p-2 rounded-xl transition-colors ${
                    currentStep === 2
                      ? "bg-[#FBF4E7]/60"
                      : currentStep > 2
                      ? "cursor-pointer hover:bg-slate-50"
                      : "opacity-60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 border transition-all ${
                      currentStep === 2
                        ? "border-[#AD8A4E] bg-[#D9BE8A] text-[#132A4C]"
                        : currentStep > 2
                        ? "border-[#2F6F4E] bg-[#2F6F4E] text-white"
                        : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                    }`}
                  >
                    {currentStep > 2 ? "✓" : "2"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#132A4C]">
                      Academic Info
                    </div>
                    <div className="text-xs text-[#3A4A66] mt-0.5">
                      Campus, class &amp; subjects
                    </div>
                  </div>
                </div>

                {/* Step 3 Item */}
                <div
                  className={`flex items-start gap-4 p-2 rounded-xl transition-colors ${
                    currentStep === 3 ? "bg-[#FBF4E7]/60" : "opacity-60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0 border transition-all ${
                      currentStep === 3
                        ? "border-[#AD8A4E] bg-[#D9BE8A] text-[#132A4C]"
                        : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                    }`}
                  >
                    3
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#132A4C]">
                      Documents
                    </div>
                    <div className="text-xs text-[#3A4A66] mt-0.5">
                      Uploads &amp; declaration
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Box */}
              <div className="mt-8 p-4 rounded-xl bg-[#F7F3EA] border border-[#D9BE8A]/60 text-xs text-[#3A4A66] leading-relaxed">
                <span className="font-bold text-[#B23B3B]">*</span> Fields marked
                with an asterisk are mandatory. You can navigate back to earlier steps
                anytime without losing your entered data.
              </div>
            </aside>

            {/* Main Form Panel */}
            <div className="lg:col-span-8 bg-white border border-[#DDE2EA] rounded-2xl shadow-sm overflow-hidden">
              <form onSubmit={handleSubmit} noValidate>
                {/* ================= STEP 1: PERSONAL ================= */}
                {currentStep === 1 && (
                  <div>
                    <div className="p-6 sm:p-8 border-b border-[#DDE2EA] bg-[#FBFCFD]">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#AD8A4E] block mb-1">
                        Step 01
                      </span>
                      <h2 className="text-2xl font-bold font-serif text-[#132A4C]">
                        Personal Information
                      </h2>
                      <p className="text-sm text-[#3A4A66] mt-1">
                        Tell us about the applicant and their parent or guardian.
                      </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                      {/* Personal Identity */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-6">
                          Personal &amp; Identity
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Student Name */}

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Student&apos;s Full Name{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <input
                              type="text"
                              value={studentName}
                              onChange={(e) => setStudentName(e.target.value)}
                              placeholder="As per B-Form / CNIC"
                              className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.studentName
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            />
                            {errors.studentName && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.studentName}
                              </p>
                            )}
                          </div>

                          {/* Father Name */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Father&apos;s / Guardian&apos;s Name{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <input
                              type="text"
                              value={fatherName}
                              onChange={(e) => setFatherName(e.target.value)}
                              placeholder="Full name"
                              className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.fatherName
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            />
                            {errors.fatherName && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.fatherName}
                              </p>
                            )}
                          </div>

                          {/* Date of Birth */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Date of Birth <span className="text-[#B23B3B]">*</span>
                            </label>
                            <input
                              type="date"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              max={new Date().toISOString().split("T")[0]}
                              className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.dob
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            />
                            {errors.dob && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.dob}
                              </p>
                            )}
                          </div>

                          {/* Student CNIC / B-Form */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              B-Form / CNIC Number{" "}
                              <span className="text-[#3A4A66] font-normal">
                                (Student)
                              </span>
                            </label>
                            <input
                              type="text"
                              value={studentCnic}
                              onChange={(e) =>
                                handleCnicChange(e.target.value, setStudentCnic)
                              }
                              placeholder="00000-0000000-0"
                              maxLength={15}
                              className="w-full p-3 rounded-lg border border-[#DDE2EA] bg-[#FBFCFD] text-sm font-mono text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all"
                            />
                            <p className="text-[11px] text-[#3A4A66]">
                              Auto-formatted as you type.
                            </p>
                          </div>

                          {/* Gender */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Gender <span className="text-[#B23B3B]">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {["Male", "Female", "Other"].map((g) => (
                                <button
                                  key={g}
                                  type="button"
                                  onClick={() => setGender(g)}
                                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                                    gender === g
                                      ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold shadow-xs"
                                      : "border-[#DDE2EA] bg-white text-[#3A4A66] hover:border-[#AD8A4E]/50"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full border ${
                                      gender === g
                                        ? "bg-[#AD8A4E] border-[#AD8A4E]"
                                        : "border-[#3A4A66]"
                                    }`}
                                  />
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Nationality */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Nationality
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {["Pakistani", "Non-Pakistani"].map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => setNationality(n)}
                                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                                    nationality === n
                                      ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold shadow-xs"
                                      : "border-[#DDE2EA] bg-white text-[#3A4A66] hover:border-[#AD8A4E]/50"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full border ${
                                      nationality === n
                                        ? "bg-[#AD8A4E] border-[#AD8A4E]"
                                        : "border-[#3A4A66]"
                                    }`}
                                  />
                                  {n}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Religion */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Religion
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {["Muslim", "Non-Muslim"].map((r) => (
                                <button
                                  key={r}
                                  type="button"
                                  onClick={() => setReligion(r)}
                                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                                    religion === r
                                      ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold shadow-xs"
                                      : "border-[#DDE2EA] bg-white text-[#3A4A66] hover:border-[#AD8A4E]/50"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full border ${
                                      religion === r
                                        ? "bg-[#AD8A4E] border-[#AD8A4E]"
                                        : "border-[#3A4A66]"
                                    }`}
                                  />
                                  {r}
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>
                      </fieldset>

                      {/* Contact Details */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-6">
                          Contact Details
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Mobile */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Student / Father&apos;s Mobile{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-[#DDE2EA] bg-[#F0F2F5] text-xs font-mono text-[#3A4A66]">
                                +92
                              </span>
                              <input
                                type="tel"
                                value={mobile}
                                onChange={(e) =>
                                  handlePhoneChange(e.target.value, setMobile)
                                }
                                placeholder="3XX-XXXXXXX"
                                maxLength={11}
                                className={`w-full p-3 rounded-r-lg border font-mono bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                  errors.mobile
                                    ? "border-[#B23B3B] bg-[#FBEAEA]"
                                    : "border-[#DDE2EA]"
                                }`}
                              />
                            </div>
                            {errors.mobile && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.mobile}
                              </p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Email Address <span className="text-[#B23B3B]">*</span>
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@example.com"
                              className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.email
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            />
                            {errors.email && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          {/* Present Address */}
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Present Address <span className="text-[#B23B3B]">*</span>
                            </label>
                            <textarea
                              rows={2}
                              value={presentAddress}
                              onChange={(e) => setPresentAddress(e.target.value)}
                              placeholder="House / street, area, city"
                              className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.presentAddress
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            />
                            {errors.presentAddress && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.presentAddress}
                              </p>
                            )}
                          </div>

                          {/* Permanent Address Toggle */}
                          <div className="sm:col-span-2">
                            <button
                              type="button"
                              onClick={() => setDiffPermanent(!diffPermanent)}
                              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                                diffPermanent
                                  ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold"
                                  : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                              }`}
                            >
                              <span
                                className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                                  diffPermanent
                                    ? "bg-[#AD8A4E] border-[#AD8A4E] text-white"
                                    : "border-[#3A4A66]"
                                }`}
                              >
                                {diffPermanent && "✓"}
                              </span>
                              Permanent address is different
                            </button>
                          </div>

                          {diffPermanent && (
                            <div className="sm:col-span-2 space-y-1.5">
                              <label className="text-xs font-bold text-[#132A4C]">
                                Permanent Address
                              </label>
                              <textarea
                                rows={2}
                                value={permanentAddress}
                                onChange={(e) =>
                                  setPermanentAddress(e.target.value)
                                }
                                placeholder="House / street, area, city"
                                className="w-full p-3 rounded-lg border border-[#DDE2EA] bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all"
                              />
                            </div>
                          )}
                        </div>
                      </fieldset>

                      {/* Parent / Guardian Details */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-6">
                          Parent / Guardian Details
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Submitter */}
                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-[#132A4C]">
                              This application is submitted by
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {["Parent", "Guardian"].map((sub) => (
                                <button
                                  key={sub}
                                  type="button"
                                  onClick={() => setSubmitter(sub)}
                                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                                    submitter === sub
                                      ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold"
                                      : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full border ${
                                      submitter === sub
                                        ? "bg-[#AD8A4E] border-[#AD8A4E]"
                                        : "border-[#3A4A66]"
                                    }`}
                                  />
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Relation */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Relation to Student
                            </label>
                            <input
                              type="text"
                              value={relation}
                              onChange={(e) => setRelation(e.target.value)}
                              placeholder="e.g. Father, Mother, Uncle"
                              className="w-full p-3 rounded-lg border border-[#DDE2EA] bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all"
                            />
                          </div>

                          {/* Guardian CNIC */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              CNIC Number <span className="text-[#B23B3B]">*</span>
                            </label>
                            <input
                              type="text"
                              value={guardianCnic}
                              onChange={(e) =>
                                handleCnicChange(e.target.value, setGuardianCnic)
                              }
                              placeholder="00000-0000000-0"
                              maxLength={15}
                              className={`w-full p-3 rounded-lg border font-mono bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.guardianCnic
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            />
                            {errors.guardianCnic && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.guardianCnic}
                              </p>
                            )}
                          </div>

                          {/* Occupation */}
                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Occupation
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Govt. Employed",
                                "Private Employed",
                                "Business",
                                "Other",
                              ].map((occ) => (
                                <button
                                  key={occ}
                                  type="button"
                                  onClick={() => setOccupation(occ)}
                                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                                    occupation === occ
                                      ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold"
                                      : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full border ${
                                      occupation === occ
                                        ? "bg-[#AD8A4E] border-[#AD8A4E]"
                                        : "border-[#3A4A66]"
                                    }`}
                                  />
                                  {occ}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Guardian Mobile */}
                          <div className="sm:col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Guardian&apos;s Contact Number
                            </label>
                            <div className="flex">
                              <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-[#DDE2EA] bg-[#F0F2F5] text-xs font-mono text-[#3A4A66]">
                                +92
                              </span>
                              <input
                                type="tel"
                                value={guardianMobile}
                                onChange={(e) =>
                                  handlePhoneChange(
                                    e.target.value,
                                    setGuardianMobile
                                  )
                                }
                                placeholder="3XX-XXXXXXX"
                                maxLength={11}
                                className="w-full p-3 rounded-r-lg border border-[#DDE2EA] font-mono bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>

                    </div>


                    {/* Step 1 Footer */}
                    <div className="p-6 sm:p-8 bg-[#FBFCFD] border-t border-[#DDE2EA] flex justify-end">
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#132A4C] hover:bg-[#0D2039] text-white px-6 py-3 rounded-lg font-bold text-sm gap-2 cursor-pointer"
                      >
                        Next: Academic Info
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: ACADEMIC ================= */}
                {currentStep === 2 && (
                  <div>
                    <div className="p-6 sm:p-8 border-b border-[#DDE2EA] bg-[#FBFCFD]">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#AD8A4E] block mb-1">
                        Step 02
                      </span>
                      <h2 className="text-2xl font-bold font-serif text-[#132A4C]">
                        Academic Information
                      </h2>
                      <p className="text-sm text-[#3A4A66] mt-1">
                        Choose the program, class, group and subjects the applicant is seeking admission in.
                      </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                      {/* Program Selector */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-6">
                          Select Program
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(PROGRAMS).map(([key, prog]) => (
                            <div
                              key={key}
                              onClick={() => handleProgramSelect(key)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedProgram === key
                                  ? "border-[#AD8A4E] bg-[#FBF4E7] ring-1 ring-[#AD8A4E] shadow-xs"
                                  : "border-[#DDE2EA] bg-white hover:border-[#AD8A4E]/50"
                              }`}
                            >
                              <div className="font-bold text-sm text-[#132A4C]">
                                {prog.label}
                              </div>
                              <div className="text-xs text-[#3A4A66] mt-1">
                                {prog.desc}
                              </div>
                            </div>
                          ))}
                        </div>
                        {errors.program && (
                          <p className="text-xs text-[#B23B3B] mt-2">
                            {errors.program}
                          </p>
                        )}
                      </fieldset>

                      {/* Class, Group & Shift */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-6">
                          Class / Course &amp; Shift
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Class / Course select */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              {PROGRAMS[selectedProgram]?.isCourse
                                ? "Select Course"
                                : "Class"}{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <select
                              value={selectedClass}
                              onChange={(e) => {
                                setSelectedClass(e.target.value);
                                if (PROGRAMS[selectedProgram]?.isCourse) {
                                  const found = COURSES.find(
                                    (c) => c.name === e.target.value
                                  );
                                  setCourseDuration(found?.duration || "");
                                }
                              }}
                              className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                errors.class
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA]"
                              }`}
                            >
                              <option value="">Select class / course</option>
                              {PROGRAMS[selectedProgram]?.isCourse
                                ? COURSES.map((c) => (
                                    <option key={c.name} value={c.name}>
                                      {c.name}
                                    </option>
                                  ))
                                : PROGRAMS[selectedProgram]?.classes?.map(
                                    (cls) => (
                                      <option key={cls} value={cls}>
                                        {cls}
                                      </option>
                                    )
                                  )}
                            </select>
                            {errors.class && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.class}
                              </p>
                            )}
                          </div>

                          {/* Group select (if applicable) */}
                          {PROGRAMS[selectedProgram]?.hasGroup &&
                            PROGRAMS[selectedProgram]?.groupKey && (
                              <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#132A4C]">
                                  Group <span className="text-[#B23B3B]">*</span>
                                </label>
                                <select
                                  value={selectedGroup}
                                  onChange={(e) =>
                                    handleGroupChange(e.target.value)
                                  }
                                  className={`w-full p-3 rounded-lg border bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all ${
                                    errors.group
                                      ? "border-[#B23B3B] bg-[#FBEAEA]"
                                      : "border-[#DDE2EA]"
                                  }`}
                                >
                                  <option value="">Select a group</option>
                                  {GROUPS[
                                    PROGRAMS[selectedProgram].groupKey!
                                  ].map((g) => (
                                    <option key={g} value={g}>
                                      {g}
                                    </option>
                                  ))}
                                </select>
                                {errors.group && (
                                  <p className="text-xs text-[#B23B3B]">
                                    {errors.group}
                                  </p>
                                )}
                              </div>
                            )}

                          {/* Course Duration (if short course) */}
                          {PROGRAMS[selectedProgram]?.isCourse && (
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-[#132A4C]">
                                Course Duration
                              </label>
                              <input
                                type="text"
                                value={courseDuration}
                                readOnly
                                className="w-full p-3 rounded-lg border border-[#DDE2EA] bg-[#F0F2F5] text-sm text-[#3A4A66] outline-none font-medium"
                              />
                            </div>
                          )}

                          {/* Preferred Shift */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Preferred Shift
                            </label>
                            <select
                              value={shift}
                              onChange={(e) => setShift(e.target.value)}
                              className="w-full p-3 rounded-lg border border-[#DDE2EA] bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all"
                            >
                              <option>Morning</option>
                              <option>Evening</option>
                              <option>Weekend</option>
                            </select>
                          </div>
                        </div>
                      </fieldset>

                      {/* Subjects section */}
                      {selectedGroup && (
                        <fieldset className="space-y-4">
                          <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-4">
                            Subjects
                          </legend>

                          {/* Compulsory */}
                          <div className="p-4 rounded-xl border border-dashed border-[#DDE2EA] bg-[#FAFAF9]">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] mb-3">
                              Compulsory Subjects
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {COMPULSORY_SUBJECTS.map((sub) => (
                                <span
                                  key={sub}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0F2F5] text-[#3A4A66] text-xs font-medium border border-[#DDE2EA]"
                                >
                                  <span className="text-[#2F6F4E] font-bold">✓</span>{" "}
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Electives */}
                          <div className="p-4 rounded-xl border border-dashed border-[#DDE2EA] bg-[#FAFAF9]">
                            <div className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] mb-3">
                              Elective Subjects — Select Applicable
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(ELECTIVES[selectedGroup] || []).map((sub) => (
                                <button
                                  key={sub}
                                  type="button"
                                  onClick={() => toggleElective(sub)}
                                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                    selectedElectives.includes(sub)
                                      ? "border-[#AD8A4E] bg-[#FBF4E7] text-[#132A4C] font-bold"
                                      : "border-[#DDE2EA] bg-white text-[#3A4A66]"
                                  }`}
                                >
                                  <span
                                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] ${
                                      selectedElectives.includes(sub)
                                        ? "bg-[#AD8A4E] border-[#AD8A4E] text-white"
                                        : "border-[#3A4A66]"
                                    }`}
                                  >
                                    {selectedElectives.includes(sub) && "✓"}
                                  </span>
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </div>
                        </fieldset>
                      )}

                    </div>

                    {/* Step 2 Footer */}
                    <div className="p-6 sm:p-8 bg-[#FBFCFD] border-t border-[#DDE2EA] flex justify-between">
                      <Button
                        type="button"
                        onClick={handlePrev}
                        variant="outline"
                        className="border-[#DDE2EA] text-[#132A4C] px-6 py-3 rounded-lg font-bold text-sm gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="bg-[#132A4C] hover:bg-[#0D2039] text-white px-6 py-3 rounded-lg font-bold text-sm gap-2 cursor-pointer"
                      >
                        Next: Documents
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: DOCUMENTS ================= */}
                {currentStep === 3 && (
                  <div>
                    <div className="p-6 sm:p-8 border-b border-[#DDE2EA] bg-[#FBFCFD]">
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#AD8A4E] block mb-1">
                        Step 03
                      </span>
                      <h2 className="text-2xl font-bold font-serif text-[#132A4C]">
                        Documents &amp; Declaration
                      </h2>
                      <p className="text-sm text-[#3A4A66] mt-1">
                        Upload the required verification documents (PDF, JPG, PNG &mdash; up to 5MB each).
                      </p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                      {/* Upload Grid */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-6">
                          Required Documents
                        </legend>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* 1. Passport Photo */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Passport-size Photograph{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <label
                              className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] ${
                                docPhoto
                                  ? "border-[#2F6F4E] bg-[#EAF3EE]"
                                  : errors.docPhoto
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA] bg-[#FBFCFD] hover:border-[#AD8A4E] hover:bg-[#FBF7EE]"
                              }`}
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    e.target.files?.[0] || null,
                                    setDocPhoto,
                                    setPhotoPreview
                                  )
                                }
                                className="hidden"
                              />
                              {photoPreview ? (
                                <img
                                  src={photoPreview}
                                  alt="Photograph"
                                  className="h-20 w-20 object-cover rounded-lg mb-2 shadow-xs border"
                                />
                              ) : (
                                <Upload className="w-7 h-7 text-[#AD8A4E] mb-2" />
                              )}
                              <div className="text-xs font-bold text-[#132A4C]">
                                {docPhoto
                                  ? docPhoto.name
                                  : "Click to upload photograph"}
                              </div>
                              <div className="text-[11px] text-[#3A4A66] mt-0.5">
                                Recent, plain background
                              </div>
                            </label>
                            {errors.docPhoto && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.docPhoto}
                              </p>
                            )}
                          </div>

                          {/* 2. B-Form / CNIC */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              B-Form / CNIC Copy{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <label
                              className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] ${
                                docBform
                                  ? "border-[#2F6F4E] bg-[#EAF3EE]"
                                  : errors.docBform
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA] bg-[#FBFCFD] hover:border-[#AD8A4E] hover:bg-[#FBF7EE]"
                              }`}
                            >
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    e.target.files?.[0] || null,
                                    setDocBform,
                                    setBformPreview
                                  )
                                }
                                className="hidden"
                              />
                              {bformPreview ? (
                                <img
                                  src={bformPreview}
                                  alt="B-Form"
                                  className="h-20 w-28 object-cover rounded-lg mb-2 shadow-xs border"
                                />
                              ) : (
                                <FileText className="w-7 h-7 text-[#AD8A4E] mb-2" />
                              )}
                              <div className="text-xs font-bold text-[#132A4C]">
                                {docBform
                                  ? docBform.name
                                  : "Click to upload B-Form / CNIC"}
                              </div>
                              <div className="text-[11px] text-[#3A4A66] mt-0.5">
                                Front side, clearly legible
                              </div>
                            </label>
                            {errors.docBform && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.docBform}
                              </p>
                            )}
                          </div>

                          {/* 3. Father's CNIC */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Father&apos;s / Guardian&apos;s CNIC Copy{" "}
                              <span className="text-[#B23B3B]">*</span>
                            </label>
                            <label
                              className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[140px] ${
                                docFatherCnic
                                  ? "border-[#2F6F4E] bg-[#EAF3EE]"
                                  : errors.docFatherCnic
                                  ? "border-[#B23B3B] bg-[#FBEAEA]"
                                  : "border-[#DDE2EA] bg-[#FBFCFD] hover:border-[#AD8A4E] hover:bg-[#FBF7EE]"
                              }`}
                            >
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    e.target.files?.[0] || null,
                                    setDocFatherCnic,
                                    setFatherCnicPreview
                                  )
                                }
                                className="hidden"
                              />
                              {fatherCnicPreview ? (
                                <img
                                  src={fatherCnicPreview}
                                  alt="Guardian CNIC"
                                  className="h-20 w-28 object-cover rounded-lg mb-2 shadow-xs border"
                                />
                              ) : (
                                <CreditCard className="w-7 h-7 text-[#AD8A4E] mb-2" />
                              )}
                              <div className="text-xs font-bold text-[#132A4C]">
                                {docFatherCnic
                                  ? docFatherCnic.name
                                  : "Click to upload father's CNIC"}
                              </div>
                              <div className="text-[11px] text-[#3A4A66] mt-0.5">
                                Front side, clearly legible
                              </div>
                            </label>
                            {errors.docFatherCnic && (
                              <p className="text-xs text-[#B23B3B]">
                                {errors.docFatherCnic}
                              </p>
                            )}
                          </div>

                          {/* 4. Result Card (Optional) */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#132A4C]">
                              Latest Result Card / Marksheet{" "}
                              <span className="text-[#3A4A66] font-normal">
                                (Optional)
                              </span>
                            </label>
                            <label className="relative border-2 border-dashed border-[#DDE2EA] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-[#FBFCFD] hover:border-[#AD8A4E] hover:bg-[#FBF7EE] transition-all min-h-[140px]">
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={(e) =>
                                  handleFileChange(
                                    e.target.files?.[0] || null,
                                    setDocResult
                                  )
                                }
                                className="hidden"
                              />
                              <FileCheck className="w-7 h-7 text-[#AD8A4E] mb-2" />
                              <div className="text-xs font-bold text-[#132A4C]">
                                {docResult
                                  ? docResult.name
                                  : "Click to upload result card"}
                              </div>
                              <div className="text-[11px] text-[#3A4A66] mt-0.5">
                                Most recent school result
                              </div>
                            </label>
                          </div>
                        </div>
                      </fieldset>

                      {/* Additional Information */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-4">
                          Additional Information{" "}
                          <span className="font-normal text-[11px] normal-case">
                            (Optional)
                          </span>
                        </legend>
                        <textarea
                          rows={3}
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          placeholder="Any medical condition, special accommodation request, or other note for the admissions office…"
                          className="w-full p-3 rounded-lg border border-[#DDE2EA] bg-[#FBFCFD] text-sm text-[#132A4C] outline-none focus:border-[#AD8A4E] focus:bg-white focus:ring-2 focus:ring-[#AD8A4E]/15 transition-all"
                        />
                      </fieldset>

                      {/* Rules & Declaration */}
                      <fieldset>
                        <legend className="text-xs font-bold uppercase tracking-wider text-[#3A4A66] pb-3 border-b border-[#DDE2EA] w-full mb-4">
                          Rules &amp; Declaration
                        </legend>

                        <div className="max-h-40 overflow-y-auto border border-[#DDE2EA] rounded-xl p-4 text-xs text-[#3A4A66] bg-[#FAFAF9] leading-relaxed space-y-2">
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>
                              Dues once paid are neither refundable nor adjustable, in any case.
                            </li>
                            <li>
                              Session timings are subject to teacher availability and may be amended if required.
                            </li>
                            <li>
                              Parents must attend the office regularly to discuss the student&apos;s academic progress.
                            </li>
                            <li>
                              A daily fine applies if tuition fee or other charges are paid after the due date.
                            </li>
                            <li>
                              Misconduct with any teacher or fellow student will be strictly culpable.
                            </li>
                            <li>
                              Any damage caused to institution property will be charged accordingly.
                            </li>
                            <li>
                              The institution is not responsible, in any case, for loss suffered by a student.
                            </li>
                            <li>
                              Smoking and use of mobile phones is strictly prohibited within campus premises.
                            </li>
                            <li>
                              The decision of the administration will be final and binding.
                            </li>
                            <li>
                              A morally presentable dress code and uniform is to be observed at all times.
                            </li>
                          </ol>
                        </div>

                        {/* Agree Checkbox */}
                        <div className="mt-4 flex items-start gap-3">
                          <input
                            type="checkbox"
                            id="agree"
                            checked={agreeRules}
                            onChange={(e) => setAgreeRules(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded text-[#AD8A4E] focus:ring-[#AD8A4E] cursor-pointer"
                          />
                          <label
                            htmlFor="agree"
                            className="text-xs text-[#132A4C] cursor-pointer leading-snug"
                          >
                            I certify that the information given here is authentic to the best of my knowledge, and I agree to abide by all present and future rules and regulations of Meridian&apos;s School System.{" "}
                            <span className="text-[#B23B3B] font-bold">*</span>
                          </label>
                        </div>
                        {errors.agreeRules && (
                          <p className="text-xs text-[#B23B3B] mt-1">
                            {errors.agreeRules}
                          </p>
                        )}

                      </fieldset>

                    </div>

                    {/* Step 3 Footer */}
                    <div className="p-6 sm:p-8 bg-[#FBFCFD] border-t border-[#DDE2EA] flex justify-between">
                      <Button
                        type="button"
                        onClick={handlePrev}
                        variant="outline"
                        className="border-[#DDE2EA] text-[#132A4C] px-6 py-3 rounded-lg font-bold text-sm gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#132A4C] hover:bg-[#0D2039] text-white px-8 py-3 rounded-lg font-bold text-sm gap-2 cursor-pointer shadow-md"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting Application...
                          </>
                        ) : (
                          <>
                            Submit Application
                            <CheckCircle2 className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        ) : (
          /* ================= SUCCESS SCREEN ================= */
          <div className="bg-white border border-[#DDE2EA] rounded-2xl p-8 sm:p-14 text-center shadow-lg max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#EAF3EE] text-[#2F6F4E] flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold font-serif text-[#132A4C]">
              Application Received
            </h2>
            <p className="text-sm text-[#3A4A66] max-w-md mx-auto mt-2 leading-relaxed">
              Thank you &mdash; your admission form has been registered with Meridian&apos;s School System. Please keep your application reference number safe.
            </p>

            <div className="inline-block my-6 px-6 py-3 border-2 border-dashed border-[#AD8A4E] rounded-xl bg-[#FBF4E7] font-mono text-lg font-extrabold text-[#132A4C] tracking-wider">
              {refId}
            </div>

            {/* Summary List */}
            <div className="max-w-md mx-auto text-left text-xs border-t border-[#DDE2EA] pt-4 mb-8 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-dashed border-[#DDE2EA]">
                <span className="text-[#3A4A66]">Student Name</span>
                <b className="text-[#132A4C]">{studentName}</b>
              </div>

              <div className="flex justify-between py-1 border-b border-dashed border-[#DDE2EA]">
                <span className="text-[#3A4A66]">Program</span>
                <b className="text-[#132A4C]">
                  {PROGRAMS[selectedProgram]?.label || selectedProgram}
                </b>
              </div>
              <div className="flex justify-between py-1 border-b border-dashed border-[#DDE2EA]">
                <span className="text-[#3A4A66]">Class / Course</span>
                <b className="text-[#132A4C]">{selectedClass}</b>
              </div>
              {selectedGroup && (
                <div className="flex justify-between py-1 border-b border-dashed border-[#DDE2EA]">
                  <span className="text-[#3A4A66]">Group</span>
                  <b className="text-[#132A4C]">{selectedGroup}</b>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-dashed border-[#DDE2EA]">
                <span className="text-[#3A4A66]">Date Submitted</span>
                <b className="text-[#132A4C]">
                  {new Date().toLocaleDateString()}
                </b>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="border-[#DDE2EA] text-[#132A4C] gap-2 font-bold text-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Summary
              </Button>

              {submittedAdmissionId && (
                <Button
                  onClick={() => router.push(PAGE_TEST_BY_ID(submittedAdmissionId))}
                  className="bg-[#0F9488] hover:bg-[#0B6E64] text-white gap-2 font-bold text-xs cursor-pointer shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  Start Admission Test
                </Button>
              )}

              <Button
                onClick={() => window.location.reload()}
                className="bg-[#132A4C] hover:bg-[#0D2039] text-white gap-2 font-bold text-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                New Application
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
