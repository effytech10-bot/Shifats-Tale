"use client";

import React, { useState } from "react";
import { Check, Loader2, Image as ImageIcon, Trash2, Plus, MoveUp, MoveDown, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { topStudentsData as defaultTopStudents } from "@/data/top-students";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

export default function ExcellenceAdmin({ initialSectionData }: { initialSectionData: any }) {
  const content = initialSectionData?.content || {};
  const [months, setMonths] = useState<any[]>(content.months || defaultTopStudents);
  const [headerData, setHeaderData] = useState(content.header || {
    badge: "Top of the Month",
    titleNormal: "Celebrating",
    titleHighlighted: "Excellence",
    description: "Recognizing the outstanding achievements and hard work of our top-performing students every month."
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0);
  
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{ studentIndex: number } | null>(null);

  const activeMonth = months[activeMonthIndex] || null;

  const handleMonthNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeMonth) return;
    const updated = [...months];
    updated[activeMonthIndex] = { ...updated[activeMonthIndex], monthName: e.target.value };
    setMonths(updated);
  };

  const addMonth = () => {
    const newMonth = {
      id: `month-${Date.now()}`,
      monthName: "New Month",
      students: [
        {
          id: `student-${Date.now()}-1`,
          name: "First Year Student",
          college: "College Name",
          batch: "HSC First Year",
          image: "",
          achievement: "Achievement",
          score: "Score"
        },
        {
          id: `student-${Date.now()}-2`,
          name: "Second Year Student",
          college: "College Name",
          batch: "HSC Second Year",
          image: "",
          achievement: "Achievement",
          score: "Score"
        }
      ]
    };
    setMonths([newMonth, ...months]);
    setActiveMonthIndex(0);
  };

  const removeMonth = (index: number) => {
    const updated = months.filter((_, i) => i !== index);
    setMonths(updated);
    if (activeMonthIndex >= updated.length) {
      setActiveMonthIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleStudentChange = (studentIndex: number, field: string, value: string) => {
    if (!activeMonth) return;
    const updatedMonths = [...months];
    const updatedStudents = [...updatedMonths[activeMonthIndex].students];
    updatedStudents[studentIndex] = { ...updatedStudents[studentIndex], [field]: value };
    updatedMonths[activeMonthIndex] = { ...updatedMonths[activeMonthIndex], students: updatedStudents };
    setMonths(updatedMonths);
  };

  const addStudent = () => {
    if (!activeMonth) return;
    const updatedMonths = [...months];
    const newStudent = {
      id: `student-${Date.now()}`,
      name: "New Student",
      college: "College Name",
      batch: "Batch Name",
      image: "",
      achievement: "Achievement",
      score: "Score"
    };
    updatedMonths[activeMonthIndex] = {
      ...updatedMonths[activeMonthIndex],
      students: [...updatedMonths[activeMonthIndex].students, newStudent]
    };
    setMonths(updatedMonths);
  };

  const removeStudent = (studentIndex: number) => {
    if (!activeMonth) return;
    const updatedMonths = [...months];
    const updatedStudents = updatedMonths[activeMonthIndex].students.filter((_: any, i: number) => i !== studentIndex);
    updatedMonths[activeMonthIndex] = { ...updatedMonths[activeMonthIndex], students: updatedStudents };
    setMonths(updatedMonths);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_TOP_STUDENTS", {
        status: "PUBLISHED",
        content: { months, header: headerData }
      });
      toast.success("Excellence section saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save excellence section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <h3 className="text-lg font-bold text-[#08132E] border-b pb-2">Section Header</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Badge Text</label>
            <input
              type="text"
              value={headerData.badge}
              onChange={(e) => setHeaderData({ ...headerData, badge: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. Top of the Month"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Title (Normal Text)</label>
            <input
              type="text"
              value={headerData.titleNormal}
              onChange={(e) => setHeaderData({ ...headerData, titleNormal: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. Celebrating"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Title (Highlighted Text)</label>
            <input
              type="text"
              value={headerData.titleHighlighted}
              onChange={(e) => setHeaderData({ ...headerData, titleHighlighted: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. Excellence"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1 text-gray-700">Description</label>
            <textarea
              value={headerData.description}
              onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              rows={2}
              placeholder="Description text below the title"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-bold text-[#08132E]">Months Data</h3>
          <div className="flex space-x-4 items-center">
            <select 
              value={activeMonthIndex} 
              onChange={(e) => setActiveMonthIndex(Number(e.target.value))}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-semibold text-[#08132E]"
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx}>{m.monthName}</option>
              ))}
            </select>
            <button 
              onClick={addMonth}
              className="flex items-center space-x-1 text-sm text-primary hover:text-accent font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Month</span>
            </button>
            
            {months.length > 1 && (
              <button 
                onClick={() => removeMonth(activeMonthIndex)}
                className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-600 font-semibold ml-4"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Month</span>
              </button>
            )}
          </div>
        </div>

        {activeMonth ? (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold mb-1">Month Name Display</label>
            <input
              type="text"
              value={activeMonth.monthName}
              onChange={handleMonthNameChange}
              className="w-full max-w-md px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-bold"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">Top Students for {activeMonth.monthName}</h3>
              <button 
                onClick={addStudent}
                className="text-sm font-semibold text-primary hover:text-accent flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {activeMonth.students.map((student: any, idx: number) => (
                <div key={idx} className="p-5 border border-border rounded-xl bg-gray-50/50 relative">
                  <button
                    onClick={() => removeStudent(idx)}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col sm:flex-row gap-6 pr-12">
                    {/* Student Photo */}
                    <div className="flex flex-col items-center space-y-3">
                      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {student.image ? (
                          <Image src={student.image} alt={student.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                      <button 
                        onClick={() => {
                          setMediaTarget({ studentIndex: idx });
                          setIsMediaModalOpen(true);
                        }}
                        className="text-[10px] font-bold px-3 py-1.5 bg-white border border-border rounded-full hover:border-accent text-primary transition-colors whitespace-nowrap"
                      >
                        {student.image ? "Change Photo" : "Upload Photo"}
                      </button>
                    </div>

                    {/* Student Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Student Name</label>
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => handleStudentChange(idx, "name", e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:border-accent text-sm font-bold"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-semibold mb-1">Batch / Year</label>
                        <input
                          type="text"
                          value={student.batch}
                          onChange={(e) => handleStudentChange(idx, "batch", e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                          placeholder="e.g. HSC First Year 2027"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">College</label>
                        <input
                          type="text"
                          value={student.college}
                          onChange={(e) => handleStudentChange(idx, "college", e.target.value)}
                          className="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Achievement</label>
                          <input
                            type="text"
                            value={student.achievement}
                            onChange={(e) => handleStudentChange(idx, "achievement", e.target.value)}
                            className="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                            placeholder="e.g. Highest Mark in Mechanics"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Score</label>
                          <input
                            type="text"
                            value={student.score}
                            onChange={(e) => handleStudentChange(idx, "score", e.target.value)}
                            className="w-full px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:border-accent text-sm font-bold text-accent"
                            placeholder="e.g. 98/100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
              {activeMonth.students.length === 0 && (
                <div className="p-8 text-center text-gray-500 border-2 border-dashed border-border rounded-xl">
                  No students added for this month yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 border border-border rounded-xl bg-gray-50">
            No months available. Click "Add Month" to get started.
          </div>
        )}
      </div>

      {/* Media Selector Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Select Student Photo</h3>
              <button 
                onClick={() => {
                  setIsMediaModalOpen(false);
                  setMediaTarget(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaSelector 
                folderKey="STUDENTS" 
                onSelect={(id: string, url: string | undefined) => {
                  if (url && mediaTarget !== null) {
                    handleStudentChange(mediaTarget.studentIndex, "image", url);
                    setIsMediaModalOpen(false);
                    setMediaTarget(null);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
