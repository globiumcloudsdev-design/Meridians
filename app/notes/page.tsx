"use client";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { NoteItem } from "@/lib/types/note";
import { ClassItem } from "@/lib/types/class";
import { API_NOTES, API_CLASSES } from "@/lib/api/endpoints";
import {
  Search,
  FileText,
  Download,
  Filter,
} from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<NoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
    fetchClasses();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(API_NOTES);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
        setFilteredNotes(data);
      } else {
        toast.error("Failed to load notes");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Error loading notes");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(API_CLASSES);
      if (response.ok) {
        const data = await response.json();
        const activeClasses = data.filter((cls: ClassItem) => cls.isActive);
        setClasses(activeClasses);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const filterNotes = (query: string, classId: string) => {
    let filtered = notes;

    if (classId && classId !== "all") {
      filtered = filtered.filter((note) => {
        const noteClassId = typeof note.class === 'object' ? note.class._id : note.class;
        return noteClassId === classId;
      });
    }

    if (query) {
      filtered = filtered.filter(
        (note) =>
          note.subject.toLowerCase().includes(query.toLowerCase()) ||
          note.description.toLowerCase().includes(query.toLowerCase()) ||
          (typeof note.class === 'object' && note.class.name.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setFilteredNotes(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterNotes(query, selectedClass);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    filterNotes(searchQuery, classId);
  };

  const handleDownload = (url: string, title: string) => {
    try {
      const cleanFilename = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const downloadUrl = url.replace('/upload/', `/upload/fl_attachment:${cleanFilename}/`);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${cleanFilename}.pdf`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error downloading file. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <PageHero
        badge="Educational Materials"
        titleMain="Study"
        titleAccent="Notes"
        image="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1920&q=80"
        description="Access comprehensive study notes and educational resources to excel in your academics."
      />

      {/* Search & Filter Section */}
      <section className="py-12 bg-background relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 rounded-[32px] bg-card/80 backdrop-blur-xl border border-primary/10 shadow-2xl shadow-primary/5">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for notes or resources..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-primary/5 border-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
              {/* Class Filter */}
              <div className="w-full md:w-64">
                <Select value={selectedClass} onValueChange={handleClassChange}>
                  <SelectTrigger className="w-full h-14 rounded-2xl bg-primary/5 border-none focus:ring-2 focus:ring-primary/20 font-medium">
                    <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by Class" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes.map((cls) => (
                      <SelectItem key={cls._id} value={cls._id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-20 bg-background relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black tracking-tight">
              {searchQuery ? (
                <>
                  Search Results for <span className="text-primary italic">"{searchQuery}"</span>
                </>
              ) : selectedClass && selectedClass !== "all" ? (
                <>
                  Study Notes for <span className="text-primary">{classes.find(c => c._id === selectedClass)?.name || 'Class'}</span>
                </>
              ) : (
                "All Study Notes"
              )}
            </h2>
            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">
              {filteredNotes.length} notes found
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs">
                Fetching notes...
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-24 bg-primary/5 rounded-[40px] border border-dashed border-primary/20">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary/40" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2">
                No Notes Found
              </h3>
              <p className="text-muted-foreground">
                Try searching for something else or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note, idx) => (
                <AnimatedSection
                  direction="up"
                  delay={0.05 * idx}
                  key={note._id}
                  className="h-full"
                >
                  <Card className="group h-full bg-gray-100 rounded-[2.5rem] border overflow-hidden border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col">
                    <div className="relative h-48 shrink-0 overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
                      <div className="text-center px-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-md border border-primary/20 flex items-center justify-center mx-auto mb-4 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                          <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-[0.25em] text-primary/70">
                          Note Resource
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div className="flex gap-3 w-full">
                          <Button 
                            onClick={() => handleDownload(note.pdfUrl, note.subject)}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
                          >
                            <Download className="w-4 h-4 mr-2" /> Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="p-6 pt-4 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-[10px] sm:text-xs font-bold text-black uppercase tracking-widest mb-0.5">
                            Subject
                          </div>
                          <CardTitle className="text-xl sm:text-2xl font-black text-primary">
                            {note.subject}
                          </CardTitle>
                        </div>
                        {typeof note.class === 'object' && (
                          <span className="text-[12px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            {note.class.name}
                          </span>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6 flex-1 flex flex-col">
                      <div className="text-[10px] sm:text-xs font-bold text-black uppercase tracking-widest mb-2">
                        Description
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-sm mb-6 flex-1 font-medium bg-muted/30 p-4 rounded-xl border ">
                        {note.description}
                      </p>

                      <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center text-[10px] sm:text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-full">
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          PDF Note
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(note.pdfUrl, note.subject)}
                          className="text-secondary hover:text-white hover:bg-secondary rounded-xl transition-colors bg-secondary/30 w-10 h-10"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
